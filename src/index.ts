import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-express';
import * as express from 'express';
import { buildSchema, Resolver, Query } from 'type-graphql';

@Resolver()
class HelloResolver {

  @Query(() => String, { nullable: true })
  hello() {
    return 'Hello World'
  }
}

const main = async () => {
  const schema = await buildSchema({
    resolvers: [HelloResolver]
  });

  const server = new ApolloServer({
    schema
  });

  const app = express();
  server.applyMiddleware({ app });
  app.listen(4000, () => {
    console.log(`App is running on port:4000/graphql`);
  })
}

main();