import { Consumer } from 'sqs-consumer'
import { Producer } from 'sqs-producer'
import { SQSClient, SQS } from '@aws-sdk/client-sqs'

import {
  EventBus, NarrowEventByName, EventNames, IntegrationEvents
} from './eventBus'

export class SQSEventBus implements EventBus {
  sqs
  Consumer
  Producer
  queueUrl
  sqss

  constructor(private listeners: any = {}, queueUrl: string) {
    this.queueUrl = queueUrl
    const sqss = new SQS({
      region: 'us-east-1',
      endpoint: 'http://localstack:4566',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
      }
    })
    this.sqss = sqss
    const sqs = new SQSClient({
      region: 'us-east-1',
      endpoint: 'http://localstack:4566',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
      }
    })
    this.sqs = sqs
    this.Producer = Producer.create({
      queueUrl,
      sqs
    })
    this.Consumer = Consumer.create({
      batchSize: 1,
      waitTimeSeconds: 1,
      queueUrl,
      sqs,
      handleMessage: async message => {
        console.log('handle message called')
        if (!message.Body) {
          console.log('no message body')
          return
        }
        try {
          console.log(message)
          const event = JSON.parse(message.Body!)
          try {
            await Promise.all((this.listeners[event.kind] || []).map((listener: any) => listener(event)))
          } catch (e) {
            console.log(e)
            throw new Error('failed to process events')
          }
        } catch (e) {
          if ((e as any).message === 'failed to process events') {
            throw e
          }
          console.log(e)
          return
        }
      }
    })
    console.log('started listening')
    this.Consumer.start()
    this.listeners = listeners
  }

  on<A extends EventNames>(
    kind: A,
    listener: (_: NarrowEventByName<IntegrationEvents, A>) => Promise<void>
  ) {
    this.listeners = {
      ...this.listeners,
      [kind]: this.listeners[kind] ? [...this.listeners[kind], listener] : [listener]
    }
  }

  async emit<A extends EventNames>(event: NarrowEventByName<IntegrationEvents, A>) {
    try {
      console.log('emitted', event)
      const stringifiedEvent = JSON.stringify(event)
      try {
        // await this.sqs.send(new SendMessageCommand({
        //   MessageDeduplicationId: event.id,
        //   MessageBody: stringifiedEvent,
        //   QueueUrl: this.queueUrl
        // }))
        await this.Producer.send([{
          id: event.id,
          body: stringifiedEvent
        }])
      } catch (e) {
        console.log(e)
      }
    } catch (e) {
      console.log(e)
    }
  }

  purgeQueue() {
    this.sqss.purgeQueue({
      QueueUrl: this.queueUrl
    })
  }

  stop() {
    this.Consumer.stop()
  }
}
