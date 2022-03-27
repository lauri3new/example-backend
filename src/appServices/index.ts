import { Repositories } from '../repositories'
import { createProductApplicationService } from './products'

type CreateAppServicesProps = {
  repositories: Repositories
}

export const createAppServices = (a: CreateAppServicesProps) => ({
  applicationServices: {
    productAppService: createProductApplicationService(a)
  }
})

export type AppServices = ReturnType<typeof createAppServices>
