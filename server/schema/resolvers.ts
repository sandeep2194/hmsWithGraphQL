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
        user: async (_: Object, { ID }: { ID: String }) => {
            const user = await User.findById(ID);
            if (!user) {
                throw new ApolloError('User not found', '404');
            }
            return user;
        },

        bookings: async (_: Object, { ID }: { ID: String }) => {
            const bookings = await Booking.find({ hotel: ID });
            if (!bookings) {
                throw new ApolloError('Bookings not found', '404');
            }
            return bookings;
        },
        hotel: async (_: Object, { ID }: { ID: String }) => {
            const hotel = await User.findById(ID);
            if (!hotel) {
                throw new ApolloError('Hotel not found', '404');
            }
            return hotel;
        },

        rooms: async (_: Object, { ID }: { ID: String }) => {
            const rooms = await Room.find({ hotel: ID });
            if (!rooms) {
                throw new ApolloError('Rooms not found', '404');
            }
            return rooms;
        },

        guest: async (_: Object, { ID }: { ID: String }) => {
            const guest = await Guest.findById(ID);
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

        createHotel: async (_: Object, { input: { name, address, city, state, taxNumber, currency, owner } }: {
            input: {
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
            // cretae hotel model
            const newHotel = new Hotel({
                name,
                address,
                city,
                state,
                taxNumber,
                currency,
                owner,
            })
            // save hotel
            newHotel.save();
        },
        updateHotel: async (_: Object, { input: { id, owner, payload } }: {
            input: {
                id: string,
                owner: string,
                payload: Object
            }
        }, { req }: { req: { userId: String } },) => {
            // check if the owner is same as the logged in user
            const loggedInUser = req.userId;

            if (loggedInUser !== owner) {
                throw new ApolloError('You are not authorized to update a hotel', 'UNAUTHORIZED');
            }
            // update the hotel
            await Hotel.updateOne({ _id: id }, { $set: payload });
        },
        createBooking: async (_: Object, { input: { hotel, guest, room, checkIn, checkOut, } }: {
            input: {
                hotel: string,
                guest: string,
                room: string,
                checkIn: string,
                checkOut: string
            }
        }, { req }: { req: { userId: String } },) => {
            // check if the owner is same as the logged in user
            const loggedInUser = req.userId;
            if (loggedInUser !== hotel) {
                throw new ApolloError('You are not authorized to create a booking', 'UNAUTHORIZED');
            }
            // cretae booking model
            const newBooking = new Booking({
                hotel,
                guest,
                room,
                checkIn,
                checkOut,
            })
            // save booking
            newBooking.save();
        },
        updateBooking: async (_: Object, { input: { id, payload, owner } }: {
            input: {
                id: string,
                payload: Object,
                owner: string
            }
        }, { req }: { req: { userId: String } },) => {
            // check if the owner is same as the logged in user
            const loggedInUser = req.userId;
            if (loggedInUser !== owner) {
                throw new ApolloError('You are not authorized to update a booking', 'UNAUTHORIZED');
            }
            // update the booking
            await Booking.updateOne({ _id: id }, { $set: payload });
        }
    }

};

