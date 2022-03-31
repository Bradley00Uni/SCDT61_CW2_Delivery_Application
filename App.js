import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Container, Button, Text, TextInput, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BottomNavigation } from 'react-native-paper';

export default function App() {
  useEffect(() => {
    readToken()
  },[token, index])

  const HomeRoute = () => <Text>Home Page</Text>;
  const OrderPage = () => <Text>Order Page</Text>;
  const HistoryPage = () => <Text>History Page</Text>;

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
    {key: 'home', title: 'Home', icon: 'home'},
    {key: 'orders', title: 'Orders', icon: 'home'},
    {key: 'history', title: 'History', icon: 'home'}
  ]);

  const saveToken = async (result) => {
    try {
      await AsyncStorage.setItem(STORAGE_TOKEN, result.token)
      console.log('Token Set Successfully')

      await AsyncStorage.setItem(STORAGE_USER, result.id)
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
    home: HomeRoute,
    orders: OrderPage,
    history: HistoryPage,
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

    let response = await fetch('https://localhost:5001/Login', {
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
    if(formState){
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
          <View style={styles.secondaryButton}>
            <Button title='Register Account Instead' color={'#f8ac4c'} onPress={formStateChange} />
          </View>
        </View>
      )
    }
    else{
      return (
        <View>
          <Text style={styles.mainTitle}>OnlineShop2022</Text>
          <Text style={styles.title}>Delivery Application</Text>

          <Text style={styles.title}>Register</Text>
          <TextInput style={styles.input} placeholder='First Name' onChangeText={(name) => setFirstName(name)} />
          <TextInput style={styles.input} placeholder='Email' onChangeText={(email) => setEmail(email)} />
          <TextInput style={styles.input} placeholder='Password' secureTextEntry={true} onChangeText={(password) => setPassword(password)} />

          <View style={styles.inputButton}>
            <Button title='Register' color={'#28b44c'} onPress={(email) => sendLogin(email)} />
          </View>
          <View style={styles.secondaryButton}>
            <Button title='Login Instead' color={'#f8ac4c'} onPress={formStateChange} />
          </View>
        </View>
      )
    }
  }
  else{
    console.log(token)
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
    textAlign: 'center'
  },
  mainTitle: {
    fontSize: 40,
    textAlign: 'center',
    marginBottom: 80,
    marginTop: 10,
    fontWeight: 'bold'
  },
  secondaryButton: {
    width: 130,
    marginTop: 10
  },
})
