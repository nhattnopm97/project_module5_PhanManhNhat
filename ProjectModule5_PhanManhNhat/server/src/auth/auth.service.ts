import { Injectable } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private JwtService: JwtService,
  ) {}

  async login(user: AuthDto) {
    let { email, password } = user;
    let findEmail = await this.usersService.findOneByEmail(email);
    console.log(findEmail);
    if (findEmail) {
      let compare = await bcrypt.compare(password, findEmail.password);
      console.log(compare);
      if (compare) {
        //neu dung thi tao mot accept token vaf gui ve phia client oke
        const payload = { sub: findEmail.id, email: findEmail.email };
        let access_token = await this.JwtService.signAsync(payload);
        return access_token;
      } else {
        //mat khau khong dung
        return 'mat khau khong chinh xac';
      }
    } else {
      return 'Tai khoan hoac mat khau khong chinh xac';
    }
  }

  async register(user: AuthDto) {
    try {
      let { email, password } = user;
      let salt = await bcrypt.genSalt(10);
      let hash = await bcrypt.hash(password, salt);
      console.log(hash);
      user.password = hash;
      return this.usersService.create(user);
    } catch (error) {
      console.log(error);
    }
  }
}
