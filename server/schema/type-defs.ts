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
        checkIn: String!
        checkOut: String!
        adults: Int!
        children: Int!
        guests: [String!]!
        rooms: [String!]!
        hotel: String!
        source: String!
        status: String!
    }

    input UpdateBookingInput {
        id:String!
        owner: String!
        payload:Object!
    }

    input GuestInput {
        name: String!
        phone: String
        city: String
        dob: String
        hotel: String!
        email: String!
        country: String
        state: String
    }

    input HotelInput {
        name: String!
        address: String!
        city: String!
        state: String!
        taxNumber: String!
        currency: String!
        owner: String!
    }
    input UpdateHotelInput {
        id: String!
        owner: String!
        payload: Object!
    }

    input RoomInput {
        name: String!
        status: String!
        hotel: String!
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
        updateBooking(id: ID!, input: UpdateBookingInput): Booking
      
        createHotel(input: HotelInput): Hotel
        updateHotel(id: ID!, input: UpdateHotelInput): Hotel
      
        createRoom(input: RoomInput): Room
        updateRoom(id: ID!, input: RoomInput): Room
      
        createGuest(input: GuestInput): Guest
        updateGuest(id: ID!, input: GuestInput): Guest
    }

`;
