export interface EventBus {
  on:(eventName: string, listener: (eventData: any) => Promise<void>) => void
  emit:(eventName: string, eventData: any) => Promise<any[]>
}

export class MemoryEventBus implements EventBus {
  constructor(private listeners: any) {
    this.listeners = {}
  }

  on(eventName: string, listener: (eventData: any) => Promise<void>) {
    return new MemoryEventBus({
      ...this.listeners,
      [eventName]: [...this.listeners[eventName], listener]
    })
  }

  emit(eventName: string, eventData: any) {
    return Promise.all(this.listeners[eventName].map((listener: any) => listener(eventData)))
  }
}
