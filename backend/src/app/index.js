import {ApolloServer} from 'apollo-server-express';
import express from 'express';
import { resolvers, typeDefs } from "../graphql";
import http, { createServer } from "http";

const HOST = "localhost";
const PORT = "3000";
const app = express();

//mongodb modelsjh
import labs from '../models/labs';




const server = new ApolloServer({
    typeDefs, resolvers
});



const httpserver = http.createServer(app);

server.applyMiddleware({ app });

httpserver.listen({ port: PORT, host: HOST }, () => {
    console.log(`server ready http://${HOST}:${PORT}${server.graphqlPath}`);
});
