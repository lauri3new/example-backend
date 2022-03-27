import Objection, { Model } from 'objection'

export class ProductModel extends Model {
  static tableName = 'product'

  id!: string
  name!: string
  currency!: string
  price!: number
  externalId!: string
  type!: string
  image?: string
}

export type Product = Objection.ModelObject<ProductModel>
