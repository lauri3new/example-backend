import {
  objectOutputType, ZodError, ZodObject, ZodRawShape, ZodTypeAny
} from 'zod'
import {
  Arrow, resolve, reject
} from '@light-arrow/arrow'

export const validate = <
  A extends ZodRawShape,
  B extends 'passthrough' | 'strict' | 'strip' = 'strip',
  C extends ZodTypeAny = ZodTypeAny,
  D = objectOutputType<A, C>,
  E = objectOutputType<A, C>>(a: ZodObject<A, B, C, D, E>, b: any): Arrow<{}, ZodError<E>, D> => {
  const g = a.safeParse(b)
  if (g.success) {
    return resolve(g.data)
  }
  return reject(g.error)
}
