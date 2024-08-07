import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { HashHelper } from './helper/hash.helper';
import { UnauthorizedException } from '@nestjs/common';
import { User } from '../user/schema/user.schema';
import { UserService } from '../user/user.service';

describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  const mockUser = {
    _id: '123',
    email: 'admin@findcareaides.com',
    password: 'hashedPassword',
  } as User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            findOneByEmail: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return a user when credentials are valid', async () => {
      jest.spyOn(userService, 'findOneByEmail').mockResolvedValue(mockUser);
      jest.spyOn(HashHelper, 'compare').mockResolvedValue(true);

      const result = await service.validateUser(mockUser.email, 'password');
      expect(result).toEqual(mockUser);
      expect(userService.findOneByEmail).toHaveBeenCalledWith(mockUser.email);
      expect(HashHelper.compare).toHaveBeenCalledWith(
        'password',
        mockUser.password,
      );
    });

    it('should throw UnauthorizedException if user is not found', async () => {
      jest.spyOn(userService, 'findOneByEmail').mockResolvedValue(null);

      await expect(
        service.validateUser('wronguser', 'password'),
      ).rejects.toThrow(UnauthorizedException);
      expect(userService.findOneByEmail).toHaveBeenCalledWith('wronguser');
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      jest.spyOn(userService, 'findOneByEmail').mockResolvedValue(mockUser);
      jest.spyOn(HashHelper, 'compare').mockResolvedValue(false);

      await expect(
        service.validateUser(mockUser.email, 'wrongpassword'),
      ).rejects.toThrow(UnauthorizedException);
      expect(userService.findOneByEmail).toHaveBeenCalledWith(mockUser.email);
      expect(HashHelper.compare).toHaveBeenCalledWith(
        'wrongpassword',
        mockUser.password,
      );
    });
  });

  describe('login', () => {
    it('should return an access token', async () => {
      const token = 'jwt-token';
      jest.spyOn(jwtService, 'sign').mockReturnValue(token);

      const result = await service.login(mockUser);
      expect(result).toEqual({ access_token: token });
      expect(jwtService.sign).toHaveBeenCalledWith({
        email: mockUser.email,
        sub: mockUser._id,
      });
    });
  });
});
