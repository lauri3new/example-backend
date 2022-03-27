import { convertAsyncNullable } from '@light-arrow/arrow'
import { Knex } from 'knex'
import { z } from 'zod'
import { Brand } from '../lib/brand'
import { validate } from '../lib/zod'
import { ProductModel } from '../models/Product'

type ProductRepositoryProps = {
  knex: Knex
}

type ProductId = Brand<string, 'product_id'>

export const createGetProductQuery = (a: object) => validate(z.object({
  id: z.string().transform(t => t as ProductId)
}), a)

export const createProductRepository = ({ knex }: ProductRepositoryProps) => {
  const model = ProductModel.bindKnex(knex)
  return {
    get: convertAsyncNullable(async ({ id }: { id: ProductId }) => model.query()
      .findById(id)
      .then(a => a?.toJSON())),
    getList: convertAsyncNullable(async (_: {}) => model.query()
      .execute()
      .then(as => as.map(a => a?.toJSON())))
  }
}

export type ProductRepository = ReturnType<typeof createProductRepository>
