import * as bcrypt from 'bcrypt';
import { Role } from './roles/entities/role.entity';
import { User } from './entities/users.entity';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { USER_ERROR } from './constants.enum';
import { ICurrentUser } from './auth/current-user.interface';
import { RoleNameEnum } from './roles/constants.enum';
import { RolesService } from './roles/roles.service';
import { hashPassword } from './utils';
import { SigninUserInput } from './dtos/signin-user-input.dto';
import { SignupUserInput } from './dtos/signup-user-input.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { AccessUserPayload } from './dtos/access-user.dto';
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly roleService: RolesService,
  ) {}

  async me(user: ICurrentUser): Promise<User> {
    try {
      const { userId } = user;
      const result = await this.findById(userId);
      if (!result) throw new ForbiddenException();

      return result;
    } catch (exception) {
      if (exception instanceof ForbiddenException) throw exception;
      throw new InternalServerErrorException(exception);
    }
  }

  async findByEmail(email: string): Promise<User> {
    try {
      const user = await this.usersRepository.findOne({ where: { email } });
      if (!user) {
        throw new NotFoundException(USER_ERROR.USER_DOES_NOT_EXIST);
      }

      return user;
    } catch (exception) {
      if (exception instanceof NotFoundException) throw exception;
      throw new InternalServerErrorException(exception);
    }
  }

  async findById(userId: string): Promise<User> {
    try {
      const user = await this.usersRepository.findOne({ where: { id: userId }, relations: { roles: true } });
      if (!user) {
        throw new NotFoundException(USER_ERROR.USER_DOES_NOT_EXIST);
      }

      return user;
    } catch (exception) {
      if (exception instanceof NotFoundException) throw exception;
      throw new InternalServerErrorException(exception);
    }
  }

  generateToken(user: User): string {
    try {
      const { id, email } = user;
      const payload: ICurrentUser = { userId: id, email };
      return this.jwtService.sign(payload);
    } catch (exception) {
      throw new InternalServerErrorException(exception);
    }
  }

  async verifyJwt(token: string): Promise<ICurrentUser & { roles: Array<Role> }> {
    try {
      const payload: ICurrentUser = await this.jwtService.verify(token);
      const user = await this.findById(payload.userId);

      if (!user) throw new UnauthorizedException();

      return {
        ...payload,
        roles: user.roles,
      };
    } catch (exception) {
      if (exception instanceof UnauthorizedException) throw exception;
      throw new InternalServerErrorException(exception);
    }
  }

  async signin(input: SigninUserInput): Promise<AccessUserPayload> {
    try {
      const { email, password } = input;
      const user = await this.findByEmail(email);

      const comparePass = bcrypt.compareSync(password, user.password);
      if (!comparePass) throw new UnauthorizedException(USER_ERROR.INVALID_CREDENTIALS);

      return { accessToken: this.generateToken(user) };
    } catch (exception) {
      if (exception instanceof UnauthorizedException) throw exception;
      throw new InternalServerErrorException(exception);
    }
  }

  async signup(input: SignupUserInput): Promise<User> {
    try {
      const { email, password, userName } = input;

      const isAlreadyExist = await this.usersRepository.findOne({ where: { email } });
      if (isAlreadyExist) throw new BadRequestException(USER_ERROR.USER_ALREADY_EXISTS);

      const hashedPassword = await hashPassword(password);
      const userDto: Partial<User> = {
        email,
        userName,
        password: hashedPassword,
      };

      const role = await this.roleService.findByName(RoleNameEnum.CUSTOMER);

      const user = await this.usersRepository.save({ ...userDto, roles: [role] });
      return user;
    } catch (exception) {
      if (exception instanceof BadRequestException) throw exception;
      throw new InternalServerErrorException(exception);
    }
  }
}
