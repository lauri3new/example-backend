import { AnimalIntegrationEvents } from '../../../modules/animal/integration'

export type EventNames = AnimalIntegrationEvents['kind']

export type IntegrationEvents = AnimalIntegrationEvents

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
