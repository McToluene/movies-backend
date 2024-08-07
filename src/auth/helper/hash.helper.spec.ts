import * as bcrypt from 'bcrypt';
import { HashHelper } from './hash.helper';

jest.mock('bcrypt');

describe('HashHelper', () => {
  describe('hash', () => {
    it('should return a hashed string', async () => {
      const data = 'plainTextPassword';
      const hashed = 'hashedPassword';

      (bcrypt.hash as jest.Mock).mockResolvedValue(hashed);

      const result = await HashHelper.hash(data);
      expect(result).toEqual(hashed);
      expect(bcrypt.hash).toHaveBeenCalledWith(data, 10);
    });
  });

  describe('compare', () => {
    it('should return true when data matches the hash', async () => {
      const data = 'plainTextPassword';
      const hash = 'hashedPassword';

      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await HashHelper.compare(data, hash);
      expect(result).toBe(true);
      expect(bcrypt.compare).toHaveBeenCalledWith(data, hash);
    });

    it('should return false when data does not match the hash', async () => {
      const data = 'plainTextPassword';
      const hash = 'hashedPassword';

      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await HashHelper.compare(data, hash);
      expect(result).toBe(false);
      expect(bcrypt.compare).toHaveBeenCalledWith(data, hash);
    });
  });
});
