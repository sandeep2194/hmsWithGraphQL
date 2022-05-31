import { View, TextInput, Button, Text, TouchableOpacity } from "react-native"
import React from "react"
import { gql, useMutation } from "@apollo/client"

const LOGIN_MUTATION = gql`
    mutation LoginMutation($email: String!, $password: String!) {
        login(email: $email, password: $password) {   
            token
            user {
                _id
                username
                email
            }
        }
    }
`
const Login = () => {
    const [email, setEmail] = React.useState("")
    const [password, setPassword] = React.useState("")
    const [login, { data, error }] = useMutation(LOGIN_MUTATION)

    const handleLogin = () => {
        login({
            variables: {
                email,
                password,
            },
        })
    }

    error && console.log(error)
    data && console.log(data)

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
                    console.log("Register")
                }}
            >
                <Text>Register</Text>
            </TouchableOpacity>

        </View>

    )
}

export default Login