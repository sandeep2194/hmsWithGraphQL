const { gql } = require("apollo-server-express")

export const typeDefs = gql`

    type User {
        _id: ID!
        email: String!
        password: String!
        token: String
        username: String
    }

    type Hotel{
        _id: ID!
        name: String!
        address: String!
        city: String!
        state: String!
        taxNumber: String!
        currency: String!
        owner: User!
    }

    type Room{
        _id: ID!
        name: String!
        status: String!
        hotel: Hotel!
        price: Int!
    }

    type Guest{
        _id: ID!
        name: String!
        phone: String
        city: String
        dob: String
        hotel: Hotel!
        email: String!
        country: String
        state: String
        address: String
    }

    type Booking{
    _id: ID!
        checkIn: String!
        checkOut: String!
        adults: Int!
        children: Int!
        guests: [Guest!]!
        rooms: [Room!]!
        hotel: Hotel!
        source: String!
        status: String!
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

    
    input BookingInput {
        _id: ID
        checkIn: String
        checkOut: String
        adults: Int
        children: Int
        guests: [String!]
        rooms: [String!]
        hotel: String
        source: String
        status: String
    }

    input GuestInput {
        _id: ID
        name: String!
        phone: String
        city: String
        dob: String
        hotel: String
        email: String
        country: String
        state: String
        address: String
    }

    input HotelInput {
        _id: ID
        name: String
        address: String
        city: String
        state: String
        taxNumber: String
        currency: String
        owner: String
    }

    input RoomInput {
        _id: ID
        name: String
        status: String
        hotel: String
        price: Int
    }
   type Query {
        user(id: ID!): User
        bookings(hotelId:ID!): [Booking!]!
        hotel(id: ID!): Hotel
        rooms(hotelId: ID!): [Room!]!
        guest(email: String!): Guest
    }

    type Mutation {
        register(input: RegisterInput): User
        login(input: LoginInput): User
        createBooking(input: BookingInput): Booking
        createHotel(input: HotelInput): Hotel
        createRoom(input: RoomInput): Room
        createGuest(input: GuestInput): Guest
    }

`;
