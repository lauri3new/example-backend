type Secrets = {
  SECRET: string
}

const parseSecrets = (a: string) => {
  try {
    return JSON.parse(a) as Secrets
  } catch (e) {
    throw new Error('no secrets found')
  }
}

export const secrets = parseSecrets(process.env.SECRETS as string)
