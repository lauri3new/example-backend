/* eslint-disable no-console */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import { Knex } from 'knex'
import { EventBus } from '../../../../shared/capabilities/eventBus'
import { EventTaskOutbox } from '../../eventTaskOutbox'
import { TaskRepository } from '../../repositories/task'

export type TaskApplicationServiceProps = {
  capabilities: {
    dbClient: Knex
    eventBus: EventBus
  }
  repositories: {
    taskRepo: TaskRepository
  }
  infrastructureServices: {
    eventTaskOutbox: EventTaskOutbox
  }
}

export const createTaskApplicationService = ({
  repositories: { taskRepo }, capabilities: { dbClient },
  infrastructureServices: { eventTaskOutbox }
}: TaskApplicationServiceProps) => ({
  commands: {
    runUnprocessedTasks: async () => {
      const tasks = await taskRepo.selectUnprocessed(dbClient)
      for (const task of tasks) {
        try {
          eventTaskOutbox.runTask(task.event.kind, task.task.kind, task.task.id)
        } catch (e) {
          console.log('taskApplicationService:runUnprocessedTasks', e)
        }
      }
    }
  }
})

export type TaskApplicationService = ReturnType<typeof createTaskApplicationService>

export type ApplicationServices = {
  applicationServices: {
    taskApplicationService: TaskApplicationService
  }
}
