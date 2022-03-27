import jwt from 'jsonwebtoken'
import { secrets } from '../secrets'

type CreateOrderTokenProps = {
  orderId: string
  productId: string
  channelId: string
}

type OrderToken = CreateOrderTokenProps

export const createOrderToken = (props: CreateOrderTokenProps) => jwt
  .sign(props, secrets.SECRET)

export const decodeOrderToken = (token: string) => jwt
  .verify(token, secrets.SECRET) as OrderToken
