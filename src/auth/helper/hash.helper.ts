import * as bcrypt from 'bcrypt';

export class HashHelper {
  private constructor() {}

  static async hash(data: string): Promise<string> {
    return bcrypt.hash(data, 10);
  }

  static async compare(data: string, hash: string): Promise<boolean> {
    return bcrypt.compare(data, hash);
  }
}
