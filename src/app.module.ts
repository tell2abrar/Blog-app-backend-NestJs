import configuration from './config/configuration';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { PostsModule } from './posts/posts.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { JwtAuthGuard } from './users/auth/guards/jwt.guard';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentsModule } from './comments/comments.module';
import { dataSourceOptions } from './data-source-options';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

const { entities, migrations, ...options } = dataSourceOptions;

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRoot({ autoLoadEntities: true, ...options }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      playground: true,
    }),
    PostsModule,
    UsersModule,
    CommentsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
