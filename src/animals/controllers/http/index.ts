import { Request, Response } from 'express'
import { AnimalApplicationService } from '../../applicationServices'
import { validateGETAnimalRequest, validatePUTAnimalRequest } from './validation'

type AnimalHTTPControllerDependencies = {
  applicationServices: {
    animalApplicationService: AnimalApplicationService
  }
}

export const createAnimalHttpController = (
  { applicationServices: { animalApplicationService } }: AnimalHTTPControllerDependencies
) => ({
  httpGet: (req: Request, res: Response) => validateGETAnimalRequest(req)
    .flatMap(({ id }) => animalApplicationService.queries.get(id))
    .match(
      error => {
        res.status(400).send({
          message: error || 'bad input'
        })
      },
      animal => {
        res.send(animal)
      }
    ),
  httpPut: (req: Request, res: Response) => validatePUTAnimalRequest(req)
    .flatMap(data => animalApplicationService.commands.create(data.type, data.name))
    .match(
      message => {
        res.status(400).send({ message })
      },
      animal => {
        res.send(animal)
      }
    )
})

export type AnimalHttpController = ReturnType<typeof createAnimalHttpController>
