import { View, TextInput, Button, Text, TouchableOpacity } from "react-native"
import React from "react"
import { gql, useMutation, useQuery } from "@apollo/client"
import AsyncStorage from '@react-native-async-storage/async-storage';

const LOGIN_MUTATION = gql`
    mutation Mutation($input: LoginInput) {
    login(input: $input) {
        token,
        _id,
        email,
        username,
  }
}
`
const Login = () => {
    const [showRegister, setShowRegister] = React.useState(false)
    const saveUser = async (user: {
        token: string,
        _id: string,
        email: string,
        username: string,
    }) => {
        try {
            await AsyncStorage.setItem('user', JSON.stringify(user))
        } catch (e) {
            console.log(e)
        }
    }
    return (
        <View
            style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
            }}
        >
            {showRegister ? <RegisterForm saveUser={saveUser} /> : <LoginForm saveUser={saveUser} showRegister={() => setShowRegister(true)} />}

            <Bookings hotelId="62956e11771f4c6cf9af0894" />
        </View>
    )
}

const QUERY_ALL_BOOKINGS = gql`
    query Bookings($hotelId: ID!) {
    bookings(hotelId: $hotelId) {
    _id
    checkIn
    adults
  }
}
`

const Bookings = ({ hotelId }: { hotelId: String }) => {
    const { data, loading, error } = useQuery(QUERY_ALL_BOOKINGS, {
        variables: { hotelId },
    })
    console.log(data)
    console.log(loading)
    error && console.log(error.message)
    return (
        <View>
            {data && data.bookings.map((booking: { _id: String, checkIn: String, adults: Number }) => (
                <View key={booking._id.toString()}>
                    <Text >{booking.checkIn}</Text>
                    <Text >{booking.adults.toString()}</Text>

                </View>
            ))}
        </View>
    );
};

const REGISTER_MUTATION = gql`
  mutation Register($input: RegisterInput) {
  register(input: $input) {
    _id
    username
    token
    email
  }
}
`;
const RegisterForm = ({ saveUser }: { saveUser: Function }) => {
    const [username, setUsername] = React.useState("")
    const [email, setEmail] = React.useState("")
    const [password, setPassword] = React.useState("")
    const [passwordConfirm, setPasswordConfirm] = React.useState("")
    const [register, { data, error }] = useMutation(REGISTER_MUTATION, {
        variables: {
            input: {
                email,
                password,
                username,
            },
        },
    })
    data && saveUser(data.register)
    return (
        <View
            style={{
                flex: 1,
                alignItems: "center",
                width: "80%",
            }}
        >
            <Text>Register</Text>
            <TextInput
                placeholder="Username"
                onChangeText={(text) => setUsername(text)}
                value={username}
                style={{
                    borderWidth: 1,
                    borderColor: "black",
                    padding: 10,
                    margin: 10,
                    width: "100%"
                }}

            />
            <TextInput

                placeholder="Email"
                onChangeText={(text) => setEmail(text)}
                value={email}
                style={{
                    borderWidth: 1,
                    borderColor: "black",
                    padding: 10,
                    margin: 10,
                    width: "100%"
                }}
            />
            <TextInput
                placeholder="Password"
                onChangeText={(text) => setPassword(text)}
                value={password}
                style={{
                    borderWidth: 1,
                    borderColor: "black",
                    padding: 10,
                    margin: 10,
                    width: "100%"
                }}
            />
            <TextInput

                placeholder="Confirm Password"
                onChangeText={(text) => setPasswordConfirm(text)}
                value={passwordConfirm}
                style={{
                    borderWidth: 1,
                    borderColor: "black",
                    padding: 10,
                    margin: 10,
                    width: "100%"
                }}
            />
            <Button
                title="Register"
                onPress={() => {
                    register()
                }}
            />
        </View>
    )
}


const LoginForm = ({ saveUser, showRegister }: { saveUser: Function, showRegister: Function }) => {
    const [email, setEmail] = React.useState("")
    const [password, setPassword] = React.useState("")
    const [login, { data, error }] = useMutation(LOGIN_MUTATION)
    const handleLogin = () => {
        login({
            variables: {
                input: {
                    email,
                    password,
                }
            },
        })
    }
    error && console.log(error)
    data && saveUser(data.login)
    return (
        <View
            style={{
                flex: 1,
                alignItems: "center",
                width: "80%",
            }}

        >
            <TextInput placeholder="Email"
                style={{

                    borderWidth: 1,
                    borderColor: "black",
                    padding: 10,
                    margin: 10,
                    width: "100%"

                }}
                onChangeText={(text) => setEmail(text)}
            />
            <TextInput placeholder="Password"
                style={{
                    borderWidth: 1,
                    borderColor: "black",
                    padding: 10,
                    margin: 10,
                    width: "100%"
                }}
                onChangeText={(text) => setPassword(text)}
            />
            <Button title="Login"
                onPress={handleLogin}
            />

            <TouchableOpacity
                style={{
                    marginTop: 10,
                    width: "100%",
                    alignItems: "center",
                }}
                onPress={() => {
                    showRegister()
                }}
            >
                <Text>Register</Text>
            </TouchableOpacity>

        </View>

    )
}


export default Login