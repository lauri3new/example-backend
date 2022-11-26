import { Left, Right } from 'light-fp/dist/Either'
import { AnimalType } from '../domain/animal'

export const checkAnimalType = (a: string) => {
  if (['dog', 'cat', 'elephant', 'sloth'].includes(a)) {
    return Right(a as AnimalType)
  }
  return Left('not a valid animal' as const)
}
