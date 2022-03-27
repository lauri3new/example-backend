export const sleep = (ms: number) => new Promise(res => {
  setTimeout(() => {
    res(true as const)
  }, ms)
})
