import { StyleSheet } from 'react-native';
import React from 'react';
import Login from '../components/Login';
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import { gql, useMutation } from '@apollo/client';

const REGISTER_MUTATION = gql`
  mutation RegisterMutation($email: String!, $password: String!, $username : String!) {
    register(email: $email, password: $password, username: $username) {
      token,
      user {
        _id
        username
        email
        }
    }
  }
`;

export default function TabOneScreen({ navigation }: RootTabScreenProps<'TabOne'>) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <Login />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
