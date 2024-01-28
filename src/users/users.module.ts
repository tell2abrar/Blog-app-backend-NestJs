import { Role } from './roles/entities/role.entity';
import { User } from './entities/users.entity';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { RolesService } from './roles/roles.service';
import { UsersService } from './users.service';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersResolver } from './users.resolver';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.secret'),
        signOptions: {
          expiresIn: configService.get<string | number>('jwt.expiry'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [UsersResolver, UsersService, RolesService],
  exports: [UsersService],
})
export class UsersModule {}
