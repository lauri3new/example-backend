import { AnimalIntegrationEvents } from '../../modules/animal/integration'

type EventNames = AnimalIntegrationEvents['eventName']

export type NarrowEventByName<
  Union extends AnimalIntegrationEvents,
  Branch extends Union['eventName'],
  > = Union extends Record<'eventName', Branch> ? Union : never;

export interface EventBus {
  on:<A extends EventNames>(
    eventName: A,
    listener: (eventData: NarrowEventByName<AnimalIntegrationEvents, A>) => Promise<void>
  ) => void
  emit:<A extends EventNames>(
    _: NarrowEventByName<AnimalIntegrationEvents, A>
  ) => Promise<void>
}

export class MemoryEventBus implements EventBus {
  constructor(private listeners: any = {}) {
    this.listeners = listeners
  }

  on<A extends EventNames>(
    eventName: A,
    listener: (_: NarrowEventByName<AnimalIntegrationEvents, A>) => Promise<void>
  ) {
    this.listeners = {
      ...this.listeners,
      [eventName]: this.listeners[eventName] ? [...this.listeners[eventName], listener] : [listener]
    }
  }

  async emit<A extends EventNames>(event: NarrowEventByName<AnimalIntegrationEvents, A>) {
    await Promise.all((this.listeners[event.eventName] || []).map((listener: any) => listener(event.eventData)))
  }
}
