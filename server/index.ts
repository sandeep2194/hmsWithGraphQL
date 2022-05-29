const { ApolloServer } = require("apollo-server")

const { typeDefs } = require('./schema/type-defs')

const { resolvers } = require('./schema/resolvers')

const server = new ApolloServer({ typeDefs, resolvers })

require("dotenv").config();
require("./config/db").connect();

server.listen().then(({ url }: { url: String }) => {
    console.log("Server is running on " + url)
}) 