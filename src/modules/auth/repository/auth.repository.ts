import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthRepository {
  private users = [
    { username: 'admin', password: '1234' },
    { username: 'user', password: 'abcd' },
  ];

  async findByUsername(username: string) {
    return this.users.find(user => user.username === username);
  }
}
