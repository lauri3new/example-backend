import { AnimalIntegrationEvents } from '../../modules/animals/integration'

type EventNames = AnimalIntegrationEvents['eventName']

export type NarrowEventByName<
  Union extends AnimalIntegrationEvents,
  Branch extends Union['eventName'],
  > = Union extends Record<'eventName', Branch> ? Union : never;

export interface EventBus {
  on:<A extends EventNames>(
    eventName: A,
    listener: (eventData: NarrowEventByName<AnimalIntegrationEvents, A>['eventData']) => Promise<void>
  ) => void
  emit:<A extends EventNames>(
    eventName: EventNames, eventData: NarrowEventByName<AnimalIntegrationEvents, A>['eventData']
  ) => Promise<void>
}

export class MemoryEventBus implements EventBus {
  constructor(private listeners: any = {}) {
    this.listeners = listeners
  }

  // @ts-ignore
  on<A extends EventNames>(
    eventName: A,
    listener: (eventData: NarrowEventByName<AnimalIntegrationEvents, A>['eventData']
    ) => Promise<void>
  ) {
    this.listeners = {
      ...this.listeners,
      [eventName]: this.listeners[eventName] ? [...this.listeners[eventName], listener] : [listener]
    }
  }

  async emit<A extends EventNames>(
    eventName: A,
    eventData: NarrowEventByName<AnimalIntegrationEvents, A>['eventData']
  ) {
    await Promise.all((this.listeners[eventName] || []).map((listener: any) => listener(eventData)))
  }
}
