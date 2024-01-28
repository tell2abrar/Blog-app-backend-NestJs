import { parseBoolean } from '../common/utils';

export default () => ({
  port: parseInt(process.env.PORT) || 3000,
  jwt: {
    expiry: process.env.JWT_EXPIRY || '10d',
    secret: process.env.JWT_SECRET_KEY || 'my-secret',
  },
  database: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    type: process.env.DB_TYPE,
    seeds: ['src/database/seeds/**/*.ts'],
    database: process.env.DB_NAME,
    entities: ['src/**/**/*.entity{.ts,.js}'],
    password: process.env.DB_PASSWORD,
    username: process.env.DB_USER,
    migrations: ['src/database/migrations/*.{js,ts}'],
    synchronize: parseBoolean(process.env.DB_SYNC) || false,
    autoLoadEntities: true,
  },
});
