import { AppServices } from '../appServices'
import { productHttpController } from './http/product'

type CreateControllersProps = AppServices

export const createControllers = (props: CreateControllersProps) => ({
  productHttpController: productHttpController(props)
})

export type Controllers = ReturnType<typeof createControllers>
