import { Booking } from "../models/booking";
import { Guest } from "../models/guest";
import { Hotel } from "../models/hotel";
import { Room } from "../models/room";

const { User } = require('../models/user');
const { ApolloError } = require('apollo-server-errors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


export const resolvers = {
    Query: {
        user: async (_: Object, { id }: { id: String }) => {
            const user = await User.findById(id);
            if (!user) {
                throw new ApolloError('User not found', '404');
            }
            return user;
        },

        bookings: async (_: Object, { hotelId }: { hotelId: String },
            { req }: { req: { userId: String } }
        ) => {
            const loggedInUser = req.userId;
            const hotelOwner = await Hotel.findById(hotelId);
            if (!hotelOwner || !hotelOwner.owner || loggedInUser !== hotelOwner.owner) {
                throw new ApolloError('You are not authorized to view the booking list', '401');
            }
            const bookings = await Booking.find({ hotel: hotelId });
            if (!bookings) {
                throw new ApolloError('Bookings not found', '404');
            }
            return bookings;
        },
        hotel: async (_: Object, { id }: { id: String },
            { req }: { req: { userId: String } }
        ) => {
            const hotel = await Hotel.findById(id);
            const loggedInUser = req.userId;
            if (!hotel || !hotel.owner || loggedInUser !== hotel.owner) {
                throw new ApolloError('You are not authorized to view the hotel', '401');
            }
            if (!hotel) {
                throw new ApolloError('Hotel not found', '404');
            }
            return hotel;
        },

        rooms: async (_: Object, { id }: { id: String },
            { req }: { req: { userId: String } }
        ) => {
            const hotel = await Hotel.findById(id);
            const loggedInUser = req.userId;
            if (!hotel || !hotel.owner || loggedInUser !== hotel.owner) {
                throw new ApolloError('You are not authorized to view the rooms', '401');
            }
            const rooms = await Room.find({ hotel: id });
            if (!rooms) {
                throw new ApolloError('Rooms not found', '404');
            }
            return rooms;
        },

        guest: async (_: Object, { email }: { email: String },
            { req }: { req: { userId: String } }
        ) => {
            const guest = await Guest.findOne({ email });
            const loggedInUser = req.userId;
            const hotel = await Hotel.findById(guest.hotel);
            if (!hotel || !hotel.owner || loggedInUser !== hotel.owner) {
                throw new ApolloError('You are not authorized to view the guest', '401');
            }
            if (!guest) {
                throw new ApolloError('Guest not found', '404');
            }
            return guest;
        },
    },
    Mutation: {
        register: async (_: Object, { input: { username, email, password } }: {
            input: {
                username: string,
                email: string,
                password: string
            }
        }) => {
            // see if user already exists

            const oldUser = await User.findOne({ email });

            // if user exists, return error

            if (oldUser) {
                throw new ApolloError('User already exists ' + email, 'USER_ALREADY_EXISTS');
            }

            // encrypt password

            var hashedPassword = await bcrypt.hash(password, 10);

            // build user object

            const newUser = new User({
                username,
                email: email.toLowerCase(),
                password: hashedPassword
            });


            // create JWT token

            const token = jwt.sign({
                userId: newUser._id,
                email,
            }, process.env.JWT_SECRET, {
                expiresIn: '7d'
            });
            newUser.token = token;

            // save user

            const res = await newUser.save();

            return {
                id: res._id,
                ...res._doc,
            }

        },

        login: async (_: Object, { input: { email, password } }: {
            input: {
                email: string,
                password: string
            }
        }) => {
            // see if user exists
            const user = await User.findOne({ email });

            // check if password is correct
            const isMatch = await bcrypt.compare(password, user.password);

            if (user && isMatch) {
                // create JWT token
                const token = jwt.sign({
                    userId: user._id.toString(),
                    email,
                }, process.env.JWT_SECRET, {
                    expiresIn: '7d'
                });

                //attach token to user
                user.token = token;

                // return user
                return {
                    id: user._id,
                    ...user._doc,
                };
            } else {
                // throw error
                throw new ApolloError('Invalid credentials', 'INVALID_CREDENTIALS');
            }

        },

        createHotel: async (_: Object, { input: { _id, name, address, city, state, taxNumber, currency, owner } }: {
            input: {
                _id: string,
                name: string,
                address: string,
                city: string,
                state: string,
                taxNumber: string,
                currency: string,
                owner: string
            }
        }, { req }: { req: { userId: String } },) => {
            // check if the owner is same as the logged in user
            const loggedInUser = req.userId;
            if (loggedInUser !== owner) {
                throw new ApolloError('You are not authorized to create a hotel', 'UNAUTHORIZED');
            }
            // upsert the hotel
            if (!_id) {
                const hotel = new Hotel({
                    name,
                    address,
                    city,
                    state,
                    taxNumber,
                    currency,
                    owner,
                });
                const res = await hotel.save();
                return {
                    id: res._id,
                    ...res._doc,
                }
            } else {
                const hotel = await Hotel.findByIdAndUpdate(_id, {
                    name,
                    address,
                    city,
                    state,
                    taxNumber,
                    currency,
                    owner,
                });
                return {
                    id: hotel._id,
                    ...hotel._doc,
                }
            }

        },
        createBooking: async (_: Object, { input: { _id, hotel, guest, room, checkIn, checkOut, adults, children, source, status } }: {
            input: {
                _id: string,
                hotel: string,
                guest: string,
                room: string,
                checkIn: string,
                checkOut: string,
                adults: number,
                children: number,
                source: string,
                status: string,
            }
        }, { req }: { req: { userId: String } },) => {
            // check if the owner is same as the logged in user
            const loggedInUser = req.userId;
            const hotelOwner = await Hotel.findById(hotel);
            if (loggedInUser !== hotelOwner.owner) {
                throw new ApolloError('You are not authorized to create a booking', 'UNAUTHORIZED');
            }
            // cretae booking model
            if (!_id) {
                const booking = new Booking({
                    hotel,
                    guest,
                    room,
                    checkIn,
                    checkOut,

                    adults,
                    children,
                    source,
                    status,
                });
                await booking.save();
                return { ...booking._doc };
            } else {
                const booking = await Booking.findByIdAndUpdate(_id, {
                    hotel,
                    guest,
                    room,
                    checkIn,
                    checkOut,
                    adults,
                    children,
                    source,
                    status,
                }, {
                    new: true,
                    upsert: true
                });
                return { ...booking._doc };
            }
        },
        createRoom: async (_: Object, { input: { _id, hotel, name, status, price } }: {
            input: {
                _id: string,
                hotel: string,
                name: string,
                status: string,
                price: number,
            }
        }, { req }: { req: { userId: String } },) => {
            // check if the owner is same as the logged in user
            const loggedInUser = req.userId;
            const hotelOwner = await Hotel.findById(hotel);
            if (loggedInUser !== hotelOwner.owner) {
                throw new ApolloError('You are not authorized to create a room', 'UNAUTHORIZED');
            }
            // cretae booking model
            if (!_id) {
                const room = new Room({
                    hotel,
                    name,
                    status,
                    price,
                });
                await room.save();
                return { ...room._doc };
            } else {
                const room = await Room.findByIdAndUpdate(_id, {
                    hotel,
                    name,
                    status,
                    price,
                }, {
                    new: true,
                    upsert: true
                });
                return { ...room._doc };
            }
        },
        createGuest: async (_: Object, { input: { _id, name, email, phone, address, city, state, country, dob, hotel } }: {
            input: {
                _id: string,
                name: string,
                email: string,
                phone: string,
                address: string,
                city: string,
                state: string,
                country: string,
                dob: string,
                hotel: string,
            }
        }, { req }: { req: { userId: String } },) => {
            // check if the owner is same as the logged in user
            const loggedInUser = req.userId;
            const hotelOwner = await Hotel.findById(hotel);
            if (loggedInUser !== hotelOwner.owner) {
                throw new ApolloError('You are not authorized to create a guest', 'UNAUTHORIZED');
            }
            // cretae booking model
            if (!_id) {
                const guest = new Guest({
                    name,
                    email,
                    phone,
                    address,
                    city,
                    state,
                    country,
                    dob,
                    hotel,
                });
                await guest.save();
                return { ...guest._doc };
            } else {
                const guest = await Guest.findByIdAndUpdate(_id, {
                    name,
                    email,
                    phone,
                    address,
                    city,
                    state,
                    country,
                    dob,
                    hotel,
                }, {
                    new: true,
                    upsert: true
                });
                return { ...guest._doc };
            }
        }
    }

};

