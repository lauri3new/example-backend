import { ProductRepository } from '../repositories/product'

export const createProductApplicationService = ({
  repositories: {
    product
  }
}: {
  repositories: {
    product: ProductRepository
  }
}) => ({
  queries: {
    getList: product.getList,
    get: product.get
  }
})

export type ProductAppService = ReturnType<typeof createProductApplicationService>
