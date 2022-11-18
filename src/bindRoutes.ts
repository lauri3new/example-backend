import { Router } from 'express'
import { AnimalHttpController } from './animals/controllers/http'

type Controllers = {
  httpAnimalController: AnimalHttpController
}

export const bindRoutes = (router: Router, controllers: Controllers): Router => {
  const { httpAnimalController } = controllers
  router.get('/animals/:id', httpAnimalController.httpGet)
  router.put('/animals/:id', httpAnimalController.httpPut)
  return router
}
