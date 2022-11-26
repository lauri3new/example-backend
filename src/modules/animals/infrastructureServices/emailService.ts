export type EmailService = {
  send: () => Promise<number>
}

export const emailService = {
  send: () => (Math.random() > 0.5 ? Promise.resolve(200) : Promise.reject(new Error(500)))
}
