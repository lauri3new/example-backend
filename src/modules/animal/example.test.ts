/* eslint-disable import/no-extraneous-dependencies */
// eslint-disable-next-line import/no-extraneous-dependencies
import request from 'supertest'
import waitForExpect from 'wait-for-expect'
import { app } from '../../app'
import { dbClient } from '../../shared/capabilities/dbClient'

test('full integration test', async () => {
  // TODO: show other way of testing with mock eventTaskOutbox
  // TODO: mock app, pass dependencies through for mocking in bindApp function
  const res = await request(app)
    .put('/animals/1')
    .send({
      type: 'elephant',
      name: 'newwy'
    })

  expect(res.status).toBe(200)

  await waitForExpect(async () => {
    const y = await dbClient('app_task')
      .withSchema('animals')
      .select('*')
      .orderBy('created_at', 'desc')

    // assert infrastructure services are called with correct args, task types
    expect(y.length).toBe(2)
    expect(y[0].attemptCount).toBe(0)
    expect(y[0].processedAt).toEqual(expect.any(Date))
    expect(y[1].attemptCount).toBe(0)
    expect(y[1].processedAt).toEqual(expect.any(Date))
  })
})
