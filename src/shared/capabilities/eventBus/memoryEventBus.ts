import {
  EventBus, NarrowEventByName, EventNames, IntegrationEvents
} from './eventBus'

export class MemoryEventBus implements EventBus {
  constructor(private listeners: any = {}) {
    this.listeners = listeners
  }

  on<A extends EventNames>(
    kind: A,
    listener: (_: NarrowEventByName<IntegrationEvents, A>) => Promise<void>
  ) {
    this.listeners = {
      ...this.listeners,
      [kind]: this.listeners[kind] ? [...this.listeners[kind], listener] : [listener]
    }
  }

  async emit<A extends EventNames>(event: NarrowEventByName<IntegrationEvents, A>) {
    await Promise.all((this.listeners[event.kind] || []).map((listener: any) => listener(event)))
  }
}
