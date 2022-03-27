import { Request, Response } from 'express'
import { ProductAppService } from '../../appServices/products'
import { createGetProductQuery } from '../../repositories/product'

type ProductHttpControllerProps = {
  applicationServices: {
    productAppService: ProductAppService
  }
}

export const productHttpController = ({
  applicationServices: {
    productAppService
  }
}: ProductHttpControllerProps) => ({
  get: (req: Request, res: Response) => createGetProductQuery(req.body)
    .flatMap(productAppService.queries.get)
    .run({},
      data => {
        res.send({
          data
        })
      },
      b => {
        if (!b) {
          res.status(404).send({
            notFound: true
          })
        } else {
          res.status(400).send({
            error: b.message
          })
        }
      },
      _ => {
        res.status(500).send({
          error: 'doh'
        })
      })
})
