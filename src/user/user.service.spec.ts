import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { UserService } from './user.service';
import { User } from './schema/user.schema';

const mockUser = {
  email: 'admin@findcareaides.com',
  password: 'adminagent',
};

describe('UsersService', () => {
  let service: UserService;
  let model: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(User.name),
          useValue: {
            new: jest.fn().mockResolvedValue(mockUser),
            constructor: jest.fn().mockResolvedValue(mockUser),
            findOne: jest.fn(),
            exec: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    model = module.get(getModelToken(User.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOneByEmail', () => {
    it('should return a user when found by email', async () => {
      const email = 'admin@findcareaides.com';
      const expectedUser = {
        email: 'admin@findcareaides.com',
        username: 'admin',
      };

      model.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(expectedUser),
      });

      const user = await service.findOneByEmail(email);
      expect(user).toEqual(expectedUser);
      expect(model.findOne).toHaveBeenCalledWith({ email });
    });

    it('should return a user when found by username', async () => {
      const email = 'admin';
      const expectedUser = {
        email: 'admin@findcareaides.com',
      };

      model.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(expectedUser),
      });

      const user = await service.findOneByEmail(email);
      expect(user).toEqual(expectedUser);
      expect(model.findOne).toHaveBeenCalledWith({ email });
    });

    it('should return null if no user is found', async () => {
      const email = 'nonexistent';
      model.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(null),
      });

      const user = await service.findOneByEmail(email);
      expect(user).toBeNull();
      expect(model.findOne).toHaveBeenCalledWith({ email });
    });

    it('should handle errors during the query', async () => {
      const email = 'errorcase';
      const error = new Error('Database query error');
      model.findOne.mockReturnValue({
        exec: jest.fn().mockRejectedValueOnce(error),
      });

      await expect(service.findOneByEmail(email)).rejects.toThrow(
        'Database query error',
      );
      expect(model.findOne).toHaveBeenCalledWith({ email });
    });
  });
});
