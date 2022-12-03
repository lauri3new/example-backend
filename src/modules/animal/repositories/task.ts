import { randomUUID } from 'crypto'
import { Knex } from 'knex'
import { Transaction } from 'objection'
import { AnimalIntegrationEvents } from '../integration'

type TaskRepositoryDependencies = {
  capabilities: {
    dbClient: Knex
  }
}

export const createTaskRepository = ({ capabilities: { dbClient } }: TaskRepositoryDependencies) => {
  const process = async (taskId: string, f: any) => {
    const trx = await dbClient.transaction()
    const event = await trx('animals.app_task')
      .select(['app_event.*', 'app_event.type as eventType'])
      .select('id')
      .where('id', taskId)
      .innerJoin('app_event', 'app_task.event_id', 'app_event.id')
      .andWhere('processedAt', null)
      .forUpdate()
    try {
      await f(event)
    } catch (e) {
      await trx('animals.app_task')
        .update({
          attemptCount: dbClient.raw('?? + ?', ['attempt_count', 1]),
          lastAttemptAt: new Date()
        })
        .where('id', taskId)
      await trx.commit()
      return
    }
    await trx('animals.app_task')
      .update({
        processedAt: new Date()
      })
      .where('id', taskId)
    await trx.commit()
  }

  return {
    selectUnprocessed: async (trx: Knex) => trx('app_task')
      .withSchema('animals')
      .select(['app_task.*', 'app_event.data', 'app_event.type as eventType'])
      .forUpdate()
      .where('processedAt', null)
      .innerJoin('app_event', 'app_task.event_id', 'app_event.id')
      .skipLocked()
      .limit(10),
    create: async <A extends AnimalIntegrationEvents>(
      event: A, tasks: (readonly [{ type: string }, () => {}])[], trx: Transaction
    ) => {
      await trx('animals.app_event').insert({
        id: event.id,
        type: event.kind,
        data: event.data,
        createdAt: event.createdAt
      })
      const taskIds = await Promise.all(tasks.map(async ([{ type }, f]) => {
        const taskId = `task_${randomUUID()}`
        await trx('animals.app_task').insert({
          id: taskId,
          type,
          eventId: event.id,
          attemptCount: 0,
          lastAttemptAt: null,
          createdAt: new Date(),
          processedAt: null
        })
        return [taskId, f] as const
      }))
      return taskIds.map(([id, f]) => () => process(id, f))
    },
    process
  }
}

export type TaskRepository = ReturnType<typeof createTaskRepository>
