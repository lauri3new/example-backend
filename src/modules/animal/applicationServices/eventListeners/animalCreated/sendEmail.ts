import { NarrowEventByName } from '../../../eventHandler'
import { EmailService } from '../../../infrastructureServices/emailService'
import { AnimalIntegrationEvents } from '../../../integration'

type AnimalCreatedEventListener = {
  infrastructureServices: {
    emailService: EmailService
  }
}

export const createAnimalCreatedEventSendEmailListener = (deps: AnimalCreatedEventListener) => ({
  listenerName: 'animal.animal.created.send.email.listener' as const,
  // run task
  listener: async (
    event: NarrowEventByName<AnimalIntegrationEvents, 'animal.animal.created'>
  ) => {
    // taskRepo process.
    await deps.infrastructureServices.emailService.send(event)
  }
})
