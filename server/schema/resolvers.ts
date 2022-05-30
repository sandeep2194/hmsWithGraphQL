
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
        }
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

        }
    }

};

