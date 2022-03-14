import { DbClient } from './dbClient'

export type HasCapabilities = {
  capabilities: {
    dbClient: DbClient
  }
}
