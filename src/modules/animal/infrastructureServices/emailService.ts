export type EmailService = {
  send: (event: any) => Promise<number>
}

export const emailService = {
  send: (_: any) => (Math.random() > 0.5 ? Promise.resolve(200) : Promise.reject(new Error('500')))
}
