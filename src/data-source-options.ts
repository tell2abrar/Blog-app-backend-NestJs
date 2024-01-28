import configuration from './config/configuration';
import { SeederOptions } from 'typeorm-extension';
import { DataSourceOptions } from 'typeorm';
import { config as loadEnv } from 'dotenv';

loadEnv();
const config = configuration().database;

const dataSourceOptions: DataSourceOptions & SeederOptions = {
  ...config,
  migrationsTableName: 'migrations',
  type: 'postgres',
  // url: config.url,
  // logging: config.logging,
  synchronize: config.synchronize,
  name: 'default',
  entities: config.entities,
  migrations: config.migrations,
  seeds: config.seeds,
};

export { dataSourceOptions };
