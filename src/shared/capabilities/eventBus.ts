import { AnimalIntegrationEvents } from '../../modules/animal/integration'

type EventNames = AnimalIntegrationEvents['kind']

export type NarrowEventByName<
  Union extends AnimalIntegrationEvents,
  Branch extends Union['kind'],
  > = Union extends Record<'kind', Branch> ? Union : never;

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
    kind: A,
    listener: (_: NarrowEventByName<AnimalIntegrationEvents, A>) => Promise<void>
  ) {
    this.listeners = {
      ...this.listeners,
      [kind]: this.listeners[kind] ? [...this.listeners[kind], listener] : [listener]
    }
  }

  async emit<A extends EventNames>(event: NarrowEventByName<AnimalIntegrationEvents, A>) {
    await Promise.all((this.listeners[event.kind] || []).map((listener: any) => listener(event)))
  }
}
