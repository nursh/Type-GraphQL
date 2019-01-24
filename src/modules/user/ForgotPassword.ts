import { Resolver, Mutation, Arg } from 'type-graphql';
import uuid = require("uuid");


import { User } from '../../entity/User';
import { redis } from '../../redis';
import { sendEmail } from '../utils/sendEmail';
import { forgotPasswordPrefix } from '../constants/redisPrefixes';


@Resolver(User)
export class ForgotPasswordResolver {

  @Mutation(() => Boolean)
  async forgotPassword( @Arg("email") email: string): Promise<boolean> { 

    const user = await User.findOne({ where: { email }});

    if (!user) {
      return true;
    }

    const token = uuid();
    await redis.set(`${forgotPasswordPrefix} ${token}`, user.id, "ex", 60 * 60 * 24);
    const url = `http://localhost:3000/user/change-password/${token}`;

    await sendEmail(email, url);
    return true;
  }
}