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
  httpGet: async (req: Request, res: Response) => validateGETAnimalRequest(req)
    .match(
      error => {
        res.status(400).send({
          message: error || 'bad input'
        })
      },
      async ({ id }) => {
        const animal = await animalApplicationService.queries.get(id)
        res.send(animal)
      }
    ),
  httpPut: async (req: Request, res: Response) => {
    const x = validatePUTAnimalRequest(req)
      .match(
        a => ({ type: 'left' as const, value: a }),
        b => ({ type: 'right' as const, value: b })
      )
    if (x.type === 'left') {
      res.status(400).send({ message: x.value })
      return
    }
    const animalResult = await animalApplicationService.commands.create(x.value.type, x.value.name)
    animalResult.match(
      error => {
        res.status(400).send({
          message: error || 'bad input'
        })
      },
      animal => {
        res.send({ animal })
      }
    )
  }
})

export type AnimalHttpController = ReturnType<typeof createAnimalHttpController>
