import { randomUUID } from 'crypto'
import { Knex } from 'knex'
import { Transaction } from 'objection'

type TaskRepositoryDependencies = {
  capabilities: {
    dbClient: Knex
  }
}

type CreateAndProcessProps = {
  eventType: string
  eventData: any
  tasks: (readonly [{ type: string }, ((_:any) => Promise<any>)])[]
}

export const createTaskRepository = ({ capabilities: { dbClient } }: TaskRepositoryDependencies) => {
  const markAttempted = async (id: string) => dbClient('animals.app_task')
    .update({
      attemptCount: dbClient.raw('?? + ?', ['attempt_count', 1]),
      lastAttemptAt: new Date()
    })
    .where('id', id)
  const markProcessed = async (id: string) => dbClient('animals.app_task')
    .update({
      processedAt: new Date()
    })
    .where('id', id)

  return {
    markAttempted,
    markProcessed,
    selectUnprocessed: async (trx: Knex) => trx('app_task')
      .withSchema('animals')
      .select(['app_task.*', 'app_event.data', 'app_event.type as eventType'])
      .forUpdate()
      .where('processedAt', null)
      .innerJoin('app_event', 'app_task.event_id', 'app_event.id')
      .skipLocked()
      .limit(10),
    createAndProcess: async (props: CreateAndProcessProps, trx: Transaction) => {
      const eventId = `event_${randomUUID()}`
      await trx('animals.app_event').insert({
        id: eventId,
        type: props.eventType,
        data: props.eventData,
        createdAt: new Date()
      })
      const taskIdsTasks = await Promise.all(props.tasks.map(async ([{ type }, f]) => {
        const taskId = `task_${randomUUID()}`
        await trx('animals.app_task').insert({
          id: taskId,
          type,
          eventId,
          attemptCount: 0,
          lastAttemptAt: null,
          createdAt: new Date(),
          processedAt: null
        })
        return [taskId, f] as const
      }))
      await trx.commit()
      return () => Promise.all(taskIdsTasks.map(async ([id, f]) => {
        await dbClient('animals.app_task')
          .select('id')
          .where('id', id)
          .andWhere('processedAt', null)
          .forUpdate()
        try {
          await f(props.eventData)
        } catch (e) {
          await dbClient('animals.app_task')
            .update({
              attemptCount: dbClient.raw('?? + ?', ['attempt_count', 1]),
              lastAttemptAt: new Date()
            })
            .where('id', id)
          return
        }
        await dbClient('animals.app_task')
          .update({
            processedAt: new Date()
          })
          .where('id', id)
      }))
    }
  }
}

export type TaskRepository = ReturnType<typeof createTaskRepository>
