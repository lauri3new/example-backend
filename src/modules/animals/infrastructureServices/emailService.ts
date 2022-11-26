import { AnimalCreated } from '../domain/animal'

export type EmailService = {
  send: (event: AnimalCreated) => Promise<number>
}

export const emailService = {
  send: (_: AnimalCreated) => (Math.random() > 0.5 ? Promise.resolve(200) : Promise.reject(new Error('500')))
}
