import { Knex } from 'knex'

type FoodRepositoryDependencies = {
  capabilities: {
    dbClient: Knex
  }
}

type CreateFoodProps = {
  id: string
  food: string
  value: number
}

type RegisterItem = {
  animalId: string
  food: string
  value: number
}

export const createFoodRepository = ({ capabilities: { dbClient } }: FoodRepositoryDependencies) => ({
  getAllAnimalsFood: async () => dbClient.select<RegisterItem[]>('*').from('food.register'),
  getForAnimal: async (animalId: string) => dbClient.select<RegisterItem>('*').from('food.register')
    .where({ animalId })
    .first(),
  updateRegister: async (props: CreateFoodProps) => dbClient('food.register')
    .insert({
      animalId: props.id,
      food: props.food,
      value: props.value
    })
})

export type FoodRepository = ReturnType<typeof createFoodRepository>
