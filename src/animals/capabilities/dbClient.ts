const store: Record<string, any> = {}

export const dbClient = {
  get: <A>(id: string) => (store[id] === undefined ? store[id] as A : undefined),
  put: <A>(id: string, a: A) => {
    store[id] = a
    return a
  }
}

export type DbClient = typeof dbClient
