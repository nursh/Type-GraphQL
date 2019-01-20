import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import express from "express";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";

import { RegisterResolver } from "./modules/user/Register";

const main = async () => {
  await createConnection();

  const schema = await buildSchema({
    resolvers: [RegisterResolver]
  });

  const server = new ApolloServer({
    schema
  });

  const app = express();
  server.applyMiddleware({ app });
  app.listen(4000, () => {
    console.log(`App is running on port:4000/graphql`);
  });
};

main();
