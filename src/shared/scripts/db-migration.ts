/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */

import { Knex } from 'knex'
import yargs from 'yargs'
import path from 'path'
import { dbClient } from '../capabilities/dbClient'
import { logger } from '../capabilities/logger'

const MIGRATION_LOCKED = 'MigrationLocked'
const migrateLatestResultMessage = (moduleName: string) => `${moduleName} migration latest result`

type MigrationParams = {
  schemaName: string
  directory: string
}

const runModuleMigrationLatest = async (knex: Knex, migrationParams: MigrationParams) => {
  await knex.schema.createSchemaIfNotExists(migrationParams.schemaName)
  return knex.migrate.latest(migrationParams)
}

const rollbackModuleMigration = async (knex: Knex, migrationParams: MigrationParams) => {
  await knex.schema.createSchemaIfNotExists(migrationParams.schemaName)
  return knex.migrate.latest(migrationParams)
}

const appModules: MigrationParams[] = [{
  directory: path.join(__dirname, '../../modules/animals/migrations'),
  schemaName: 'animals'
}, {
  directory: path.join(__dirname, '../../modules/food/migrations'),
  schemaName: 'food'
}]

const latestHandler = async () => {
  try {
    for (const appModule of appModules) {
      const res = await runModuleMigrationLatest(dbClient, appModule)
      logger.info({ result: res })
    }
  } catch (err: any) {
    logger.error({ err })
    if (err.name !== MIGRATION_LOCKED) {
      process.exit(1)
    }
  } finally {
    process.exit()
  }
}

const latestModuleHandler = async (moduleName: string) => {
  try {
    const appModule = appModules.find(({ schemaName }) => moduleName === schemaName)
    if (!appModule) {
      throw new Error(
        `${moduleName} module not found, did you mean one of ${appModules
          .map(({ schemaName }) => schemaName).join(',')}`
      )
    }
    const res = await runModuleMigrationLatest(dbClient, appModule)
    logger.info({ result: res }, migrateLatestResultMessage(moduleName))
  } catch (err: any) {
    logger.error({ err })
  } finally {
    process.exit()
  }
}

const rollbackHandler = async () => {
  try {
    for (const appModule of appModules) {
      const res = await rollbackModuleMigration(dbClient, appModule)
      logger.info({ result: res })
    }
  } catch (err: any) {
    logger.error({ err })
    process.exit(1)
  } finally {
    process.exit()
  }
}

const rollbackModuleHandler = async (moduleName: string) => {
  try {
    const appModule = appModules.find(({ schemaName }) => moduleName === schemaName)
    if (!appModule) {
      throw new Error(
        `${moduleName} module not found, did you mean one of ${appModules
          .map(({ schemaName }) => schemaName).join(',')}`
      )
    }
    const res = await rollbackModuleMigration(dbClient, appModule)
    logger.info({ result: res })
  } catch (err: any) {
    logger.error({ err })
    process.exit(1)
  } finally {
    process.exit()
  }
}

const versionHandler = async () => {
  try {
    const res = await dbClient.migrate.currentVersion()
    logger.info(`version ${res}`)
  } catch (err: any) {
    logger.error({ err })
  } finally {
    process.exit()
  }
}

const makeModuleHandler = async (moduleName: string, filenames: string[]) => {
  try {
    const appModule = appModules.find(({ schemaName }) => moduleName === schemaName)
    if (!appModule) {
      throw new Error(`${moduleName} module not found, did you mean one of ${appModules
        .map(({ schemaName }) => schemaName).join(',')}`)
    }
    const res = await dbClient.migrate.make(filenames.join('_'), appModule)
    logger.info({ res })
  } catch (err: any) {
    logger.error({ err })
  } finally {
    process.exit()
  }
}

yargs.command('latest', 'Migrate to latest', () => {}, latestHandler)
  .command('rollback', 'Rollback 1 version', () => {}, rollbackHandler)
  .command(
    'rollback-module <moduleName>',
    'Rollback 1 version for specified module',
    // @ts-ignore
    () => {},
    ({ moduleName }:{moduleName: string}) => rollbackModuleHandler(moduleName)
  )
  .command(
    'latest-module <moduleName>',
    'Migrate to latest for specified module',
    // @ts-ignore
    () => {},
    ({ moduleName }:{moduleName: string}) => latestModuleHandler(moduleName)
  )
  .command('version', 'Print version', () => {}, versionHandler)
  .command(
    'make-module <moduleName> <name..>',
    'Make a new migration file for specified module',
    // @ts-ignore
    () => {},
    ({ moduleName, name }: { moduleName: string, name: string[] }) => makeModuleHandler(moduleName, name)
  )
  .parse()
