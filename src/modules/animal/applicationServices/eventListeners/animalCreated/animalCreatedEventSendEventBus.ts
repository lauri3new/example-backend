import { EventBus } from '../../../../../shared/capabilities/eventBus/eventBus'
import { NarrowEventByName } from '../../../eventTaskOutbox'
import { AnimalIntegrationEvents } from '../../../integration'

type AnimalCreatedEventSendEventBusDeps = {
  capabilities: {
    eventBus: EventBus
  }
}

export const createAnimalCreatedEventSendEventBus = (deps: AnimalCreatedEventSendEventBusDeps) => ({
  listenerName: 'animal.animal.created.send.event.bus' as const,
  listener: async (
    event: NarrowEventByName<AnimalIntegrationEvents, 'animal.animal.created'>
  ) => {
    await deps.capabilities.eventBus.emit(event)
  }
})
