import { Resolver, Query, Mutation, Arg, Authorized, UseMiddleware } from 'type-graphql';
import bcrypt from 'bcryptjs';
import { User } from '../../entity/User';
import { RegisterInput } from './register/registerInput';
import { isAuth } from '../middleware/isAuth';
import { sendEmail } from '../utils/sendEmail';
import { createConfirmationURL } from '../utils/createConfirmationURL';


@Resolver(User)
export class RegisterResolver {

  @Authorized() // One way of authentication
  @Query(() => String)
  hello() {
    return 'Hello World';
  }

  @UseMiddleware(isAuth) // Another way of authentication
  @Query(() => String)
  gundam() {
    return "Barbatos Lupus Rex";
  }

  @Mutation(() => User)
  async register(
    @Arg("data") { firstName, lastName, email, password}: RegisterInput,
  ): Promise<User> { 
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword
    }).save();

    await sendEmail(email, await createConfirmationURL(user.id));
    return user;
  }
}