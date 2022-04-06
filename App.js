import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Container, Button, Text, TextInput, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BottomNavigation } from 'react-native-paper';

import Home from './components/home';
import Deliveries from './components/deliveries';
import History from './components/history';

export default function App() {
  useEffect(() => {
    readToken()
  },[token, index])

  const STORAGE_TOKEN = '@driver_token'
  const STORAGE_ID = '@driver_id'
  const STORAGE_NAME = '@driver_name'

  const [firstName, setFirstName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [token, setToken] = useState(null)
  const [formState, setFormState] = useState(true)
  const [returned, setReturned] = useState('')

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {key: 'home', title: 'Pending Delivery', icon: 'clock', color: 'black'},
    {key: 'orders', title: 'Your Orders', icon: 'truck', color: 'black'},
    {key: 'history', title: 'Delivery History', icon: 'bag-carry-on-check', color: 'black'}
  ]);

  const saveToken = async (result) => {
    try {
      await AsyncStorage.setItem(STORAGE_TOKEN, result.token)
      console.log('Token Set Successfully')

      await AsyncStorage.setItem(STORAGE_ID, result.id)
      console.log('ID set Successfully')

      await AsyncStorage.setItem(STORAGE_NAME, result.firstName)

      setToken(result.token)
      return('Login Successfully Validated')
    }
    catch (e){
      return('Failed to Validate Login')
    }
  }

  const readToken = async () => {
    try {
      const asyncToken = await AsyncStorage.getItem(STORAGE_TOKEN)
  
      if(asyncToken !== null){
        setToken(asyncToken)
      }
    }
    catch (e){
      console.log('Not Logged In')
    }
  }

    //Renders the navigation
  const renderScene = BottomNavigation.SceneMap({
    home: Home,
    orders: Deliveries,
    history: History,
  });

  const formStateChange = () => {
    setFormState(!formState)
    setFirstName('')
  }

  const sendLogin = async () => {
    let data = {
      "email" : email,
      "password" : password
    }

    let response = await fetch('https://onlineshopdeliveryapi20220402003022.azurewebsites.net/api/auth/Login', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {'Content-Type': 'application/json'}
    })

    let result = await response.json()

    if(response.status == 200){
      //Set App Session Token to returned JWT token from API
      saveToken(result)
    }
    else{
        var errors = Object.values(result.errors);
        var error_messages = ''
  
        for (let e of errors){
          error_messages += e;
        }
        setReturned(error_messages)
    }
  }

  if(token == null){
    return (
      <View style={styles.container}>
        <Text style={styles.mainTitle}>OnlineShop2022</Text>
        <Text style={styles.title}>Delivery Application</Text>

        <Text style={styles.title}>Login</Text>
        <TextInput style={styles.input} placeholder='Email' onChangeText={(email) => setEmail(email)} />
        <TextInput style={styles.input} placeholder='Password' secureTextEntry={true} onChangeText={(password) => setPassword(password)} />

        <View style={styles.inputButton}>
          <Button title='Login' color={'#28b44c'} onPress={(email) => sendLogin(email)} />
        </View>
      </View>
    )
  }
  else{
    return (
      <BottomNavigation navigationState={{index, routes}}
      onIndexChange={setIndex}
      renderScene={renderScene}
      shifting={true} />
    )
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black'
  },
  input: {
    height: 50,
    backgroundColor: 'white',
    marginLeft: 40,
    marginRight: 40,
    marginTop: 15,
    marginBottom: 15,
    textAlign: 'center',
    borderColor: '#47504f', 
    borderWidth: 2, 
    borderRadius: 15,
    width: 300,
  },
  inputButton: {
    width: 280,
    marginBottom: 20
  },
  notation: {
    textAlign: 'center',
    textDecorationLine: 'underline',
    fontSize: 18,
  },
  title: {
    fontSize: 30,
    textAlign: 'center',
    color: 'white'
  },
  mainTitle: {
    fontSize: 40,
    textAlign: 'center',
    marginBottom: 80,
    marginTop: 10,
    fontWeight: 'bold',
    color: 'white'
  },
})
