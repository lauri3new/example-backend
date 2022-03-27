import { Router } from 'express'
import { Controllers } from './controller'

/**
 * binds controllers to express routes as side effect
*/

export const bindRoutes = (router: Router, controllers: Controllers) => {
  router.get('/v1/products', controllers.productHttpController.get)
}
