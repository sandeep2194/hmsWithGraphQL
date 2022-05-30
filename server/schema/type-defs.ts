const { gql } = require("apollo-server")

export const typeDefs = gql`

    type User {
        _id: ID!
        email: String!
        password: String!
        hotelId: String
        token: String
        username: String
    }

    input RegisterInput {
        username: String!
        email: String!
        password: String!
    }

    input LoginInput {
        email: String!
        password: String!
    }

   type Query {
        user(id: ID!): User
    }

    type Mutation {
        register(input: RegisterInput): User
        login(input: LoginInput): User
    }

`;
