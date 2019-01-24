import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import express from "express";
import { buildSchema, formatArgumentValidationError } from "type-graphql";
import { createConnection } from "typeorm";
import session from "express-session";
import connectRedis from "connect-redis";
import cors from 'cors';


const RedisStore = connectRedis(session);
import { redis } from './redis';

const main = async () => {
  await createConnection();

  const schema = await buildSchema({
    resolvers: [__dirname + '/modules/**/*.ts'],
    authChecker: ({ context: { req } }) => {
      return !!req.session.userId;
    }
  });

  const server = new ApolloServer({
    schema,
    formatError: formatArgumentValidationError,
    context: ({ req }: any ) =>  ({ req })
  });

  const app = express();
  app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000'
  }));

  app.use(
    session({
      store: new RedisStore({
        client: redis as any,
      }),
      name: "qid",
      secret: 'session_secret',
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24 * 7 * 365, // 7 years
      },
    } as any)
  );

  server.applyMiddleware({ app });
  app.listen(4000, () => {
    console.log(`App is running on port:4000/graphql`);
  });
};

main();
