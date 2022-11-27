import { Request, Response } from 'express'
import { FoodApplicationService } from '../../applicationServices'

type FoodHTTPControllerDependencies = {
  applicationServices: {
    foodApplicationService: FoodApplicationService
  }
}

export const createFoodHttpController = (
  { applicationServices: { foodApplicationService } }: FoodHTTPControllerDependencies
) => ({
  httpGet: async (req: Request, res: Response) => {
    const data = await foodApplicationService.queries.getAllAnimalsFood()
    res.send({
      data
    })
  }
})

export type foodHttpController = ReturnType<typeof createFoodHttpController>
