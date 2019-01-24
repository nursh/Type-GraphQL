import { Resolver, Mutation, Arg } from 'type-graphql';
import { User } from '../../entity/User';
import { redis } from '../../redis';
import { confirmationPrefix } from '../constants/redisPrefixes';

@Resolver(User)
export class  ConfirmUserResolver{

  @Mutation(() => Boolean)
  async confirmUser( @Arg("token") token: string): Promise<boolean> { 
    const userId = await redis.get(`${confirmationPrefix} ${token}`);
    if (!userId) {
      return false;
    }

    await User.update({ id: parseInt(userId, 10) }, { confirmed: true });
    await redis.del(`${confirmationPrefix} ${token}`);
    return true;
  }
}