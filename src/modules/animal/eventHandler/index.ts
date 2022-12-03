import { Transaction } from 'objection'
import { AnimalIntegrationEvents } from '../integration'
import { TaskRepository } from '../repositories/task'

type EventNames = AnimalIntegrationEvents['kind']

export type NarrowEventByName<
  Union extends AnimalIntegrationEvents,
  Branch extends Union['kind'],
  > = Union extends Record<'kind', Branch> ? Union : never;

export interface EventTaskThing {
  on:<A extends EventNames>(
    eventName: A,
    task: [string, (_: NarrowEventByName<AnimalIntegrationEvents, A>) => Promise<void>]
  ) => void
  startEmit:<A extends EventNames>(
    _: NarrowEventByName<AnimalIntegrationEvents, A>,
    trx: Transaction
  ) => Promise<{
    commit: () => Promise<void>
  }>
  runTask: (_: EventNames, __: string, ___: string) => Promise<void>
}

export class MemoryEventTaskThing implements EventTaskThing {
  constructor(
    private listeners: Record<EventNames, Record<string, () => {}>> = {} as any,
    private readonly taskRepo: TaskRepository
  ) {}

  on<A extends EventNames>(
    kind: A,
    task: [string, (_: NarrowEventByName<AnimalIntegrationEvents, A>) => Promise<void>]
  ) {
    this.listeners = {
      ...this.listeners,
      [kind]: this.listeners[kind] ? {
        ...this.listeners[kind],
        [task[0]]: task[1]
      } : {
        [task[0]]: task[1]
      }
    }
  }

  //

  async startEmit<A extends EventNames>(event: NarrowEventByName<AnimalIntegrationEvents, A>, trx: Transaction) {
    const listeners = Object.entries(this.listeners[event.kind])
      .map(a => ([{ type: a[0] }, a[1]]) as const)
    const tasks = await this.taskRepo.create(
      event,
      listeners,
      trx
    )

    return {
      trx,
      commit: async () => {
        await trx.commit()
        tasks.forEach(f => f())
      }
    }
  }

  async runTask(eventKind: EventNames, taskKind: string, taskId: string) {
    await this.taskRepo.process(taskId, this.listeners[eventKind][taskKind])
  }
}
