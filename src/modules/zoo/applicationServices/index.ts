import { fromNullable } from '../../../shared/lib/fromNullable'
import { ZooRepository } from '../repositories/zoo'

export type AnimalApplicationServiceProps = {
  repositories: {
    zooRepo: ZooRepository
  }
}

export const createZooApplicationService = ({ repositories: { zooRepo } }: AnimalApplicationServiceProps) => ({
  queries: {
    getAll: () => fromNullable(zooRepo.getAllAnimals())
  },
  commands: {
    updateZooRegister: async (animal: any) => zooRepo.updateRegister(animal)
  }
})

export type ZooApplicationService = ReturnType<typeof createZooApplicationService>

export type ApplicationServices = {
  applicationServices: {
    zooApplicationService: ZooApplicationService
  }
}
