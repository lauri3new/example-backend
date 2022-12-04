import { NarrowEventByName } from '../../../eventTaskOutbox'
import { EmailService } from '../../../infrastructureServices/emailService'
import { AnimalIntegrationEvents } from '../../../integration'

type AnimalCreatedEventSendEmailDeps = {
  infrastructureServices: {
    emailService: EmailService
  }
}

export const createAnimalCreatedEventSendEmail = (deps: AnimalCreatedEventSendEmailDeps) => ({
  listenerName: 'animal.animal.created.send.email' as const,
  listener: async (
    event: NarrowEventByName<AnimalIntegrationEvents, 'animal.animal.created'>
  ) => {
    await deps.infrastructureServices.emailService.send(event)
  }
})
