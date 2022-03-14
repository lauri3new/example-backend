import { Left, Right, Either } from 'light-fp/dist/Either'

export const fromNullable = <A>(a: null | undefined | A): Either<null, A> => {
  if (a == null) {
    return Left(null)
  }
  return Right(a)
}
