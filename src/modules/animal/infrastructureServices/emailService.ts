export type EmailService = {
  send: (event: any) => Promise<number>
}

export const emailService = {
  send: (_: any) => new Promise<number>(res => {
    setTimeout(() => res(200), 500)
  })
  // (Math.random() > 0.5 ? Promise.resolve(200) : Promise.reject(new Error('500')))
}
