/* eslint-disable no-console */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import { Knex } from 'knex'
import { EventBus } from '../../../shared/capabilities/eventBus'
import { emailService, EmailService } from '../infrastructureServices/emailService'
import { TaskRepository } from '../repositories/task'

export type TaskApplicationServiceProps = {
  capabilities: {
    dbClient: Knex
    eventBus: EventBus
  }
  repositories: {
    taskRepo: TaskRepository
  }
  infrastructureServices: {
    emailService: EmailService
  }
}

export const createTaskApplicationService = ({
  repositories: { taskRepo }, capabilities: { dbClient, eventBus }
}: TaskApplicationServiceProps) => ({
  commands: {
    runUnprocessedTasks: async () => {
      const tasks = await taskRepo.selectUnprocessed(dbClient)
      for (const task of tasks) {
        try {
          switch (task.type) {
            case 'send_email': {
              await emailService.send()
              await taskRepo.markProcessed(task.id)
              break
            }
            case 'emit_event': {
              await eventBus.emit(task.eventType, task.data)
              await taskRepo.markProcessed(task.id)
              break
            }
            default: {
              console.error(`unrecognised task ${task.type}`)
            }
          }
        } catch (e) {
          console.log(e)
          await taskRepo.markAttempted(task.id)
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
