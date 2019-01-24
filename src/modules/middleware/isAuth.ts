import { Middleware } from "type-graphql/interfaces/Middleware";
import { MyContext } from "src/types/MyContext";

export const isAuth: Middleware<MyContext> = async ({ context }, next) => {
  if (!context.req.session!.userId) {
    throw new Error("not authenticated");
  }
  return next();
};