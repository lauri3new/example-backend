import { ZooApplicationService } from '../../applicationServices'

type ZooHTTPControllerDependencies = {
  applicationServices: {
    zooApplicationService: ZooApplicationService
  }
}

export const createZooAnimalEventsController = (
  { applicationServices: { zooApplicationService } }: ZooHTTPControllerDependencies
) => ({
  saveEvent: (event: any) => zooApplicationService.commands.updateZooRegister(event)
})

export type ZooAnimalEventsController = ReturnType<typeof createZooAnimalEventsController>
