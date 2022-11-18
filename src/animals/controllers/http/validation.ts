import { Request } from 'express'
import { Left, Right, Either } from 'light-fp/dist/Either'

export const validateGETAnimalRequest = (req: Request): Either<string, { id: string }> => {
  if (req.params.id) {
    return Right({
      id: req.params.id
    })
  }
  return Left('id not provided')
}

export const validatePUTAnimalRequest = (req: Request): Either<string, {
  id: string
  type: string
  name: string
}> => {
  if (req.params.id && req.body?.type) {
    return Right({
      id: req.params.id,
      type: req.body.type,
      name: req.body.name
    })
  }
  return Left('bad request')
}
