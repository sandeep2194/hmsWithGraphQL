import { Request, Response } from "express";
import { TypeDefinitionNode } from "graphql";
import { BearerParser } from 'bearer-token-parser';

const express = require('express');
require("dotenv").config();
require("./config/db").connect();
const jwt = require('jsonwebtoken');


const { ApolloServer } = require("apollo-server-express")

const { typeDefs } = require('./schema/type-defs')

const { resolvers } = require('./schema/resolvers')

async function startApolloServer(typeDefs: TypeDefinitionNode, resolvers: Object) {
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        context: ({ req, res }: any) => ({ req, res })

    })
    const app = express();
    await server.start();
    app.use((req: Request, _: Response, next: Function) => {
        const token = BearerParser.parseBearerToken(req.headers);
        try {
            const data = jwt.verify(token, process.env.JWT_SECRET) as any;
            (req as any).userId = data.userId;
        } catch {
        }
        next();
    });
    server.applyMiddleware({ app, path: '/graphql' });

    app.listen(4000, () => {
        console.log(`Server is listening on port ${4000}${server.graphqlPath}`);
    })
}

startApolloServer(typeDefs, resolvers);


