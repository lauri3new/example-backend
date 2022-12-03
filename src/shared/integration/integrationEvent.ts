import { randomUUID } from 'crypto'

export const createIntegrationEvent = <A, B extends string>({ data, kind }: { data: A, kind: B }) => ({
  id: `event_${randomUUID()}`,
  data,
  kind,
  createdAt: new Date()
})
