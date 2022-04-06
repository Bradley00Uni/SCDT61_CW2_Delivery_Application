import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Container, Button, Text, TextInput, Alert, ScrollView, Dimensions} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appbar } from 'react-native-paper';
import {Restart} from 'fiction-expo-restart';
import { Card, Overlay } from 'react-native-elements';

import Status from './status';

const Deliveries = () => {
    const STORAGE_ID = '@driver_id'

    const [orders, setOrders] = useState(null)
    const [loading, setLoading] = useState(true)

    const [currentOrder, setCurrentOrder] = useState(null)
    const [statusVisible, setStatusVisible] = useState(false)

    useEffect(() => {
        getOrders()
    }, [loading])

    const getOrders = async () => {
        const id = await AsyncStorage.getItem(STORAGE_ID)
        fetch(`https://onlineshopdeliveryapi20220402003022.azurewebsites.net/api/orders/DriverOrders/${id}`).then( (response) => response.json()).then( (responseJson) => {
            setOrders(responseJson)
            setLoading(false)
        }).catch((error) => {console.log(error)})

    }

    const convertDate =(date) => {

        var newDate = date.toString()
        var month = newDate.substring(5,7);
        var day = newDate.substring(8,10);
        var year = newDate.substring(0,4)

        if(day.charAt(0) == "0"){
            day = day - day.charAt(0)
        }

        if(day == "01"||day == "21"||day == "31"){day = day + "st"}
        else if(day == "02"||day == "22"){day = day + "nd"}
        else if(day == "03"||day == "23"){day = day + "rd"}
        else{day = day + "th"}

        switch (month) {
            case "01": month = "January"; break;
            case "02": month = "February"; break;
            case "03": month = "March"; break;
            case "04": month = "April"; break;
            case "05": month = "May"; break;
            case "06": month = "June"; break;
            case "07": month = "July"; break;
            case "08": month = "August"; break;
            case "09": month = "September"; break;
            case "10": month = "October"; break;
            case "11": month = "November"; break;
            case "12": month = "December"; break;
        }
        newDate = month + " " + day + " " + year
        return newDate
    }

    const toggleStatus = () => {setStatusVisible(!statusVisible)}

    if(loading){
        return(
            <View>
                <Text>Loading...</Text>
            </View>
        )
    }
    else{
        if(orders != Object){
          let orderMap = orders.map((val, key) => {
  
              let totalProducts = 0
              val.products.forEach(p => {totalProducts = totalProducts + 1})
  
              return (
                  <Card key={key} style={styles.item} containerStyle={{backgroundColor: 'white', borderColor: 'black', borderWidth: 1, borderRadius: 18,}}>
                      <Card.Title h5>Order : {val.order.orderId} | <Text style={{fontWeight: 'bold', color: 'blue', fontSize: 15}}> {val.order.orderStatus}</Text></Card.Title>
                      <Card.Divider color='black' />
                      <Text>Order Placed: {convertDate(val.order.orderPlaced)}</Text>
                      <Text>Number of Items: {totalProducts} | Order Total: £{val.order.orderTotal}</Text>
                      <Text>Deliver to: {val.delivery.firstName} {val.delivery.lastName} </Text>
                      <Text>Address: {val.delivery.addressLine1}, {val.delivery.city}, {val.delivery.country}</Text>
                      <Text>PostCode: {val.delivery.postCode}</Text>
                      <Text>Recipient Email: {val.delivery.email}</Text>
                      <View style={{marginTop: 5}}><Button title='Update' onPress={() => {toggleStatus(); setCurrentOrder(val)}} color={'#209ccc'} /></View>
                  </Card>
              )
          })
  
          return (
              <View style={styles.container}>
                  <Appbar.Header style={styles.header}>
                    <Appbar.Action icon="refresh" accessibiltyLevel onPress={() => getOrders()} />
                    <Appbar.Content title="Your Current Orders" />
                    <Appbar.Action icon="logout" accessibiltyLevel onPress={() => logout()} />
                  </Appbar.Header>
                  <ScrollView style={styles.scrolling}>{orderMap}</ScrollView>
                  <Overlay isVisible={statusVisible} fullScreen >
                    <Status current={currentOrder} />
                    <View style={{marginTop: 30}}><Button color={'black'} onPress={() => toggleStatus()} title={"Go Back"} /></View>
                  </Overlay>
              </View>
          )
        }
        else{
            return (
                <View>
                    <Text>No Pending Order</Text>
                </View>
            )
        }
    }
  }
  
  const styles = StyleSheet.create({
      container: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        },
      item: {
          flexDirection: 'row',
          borderRadius: 80,
          height: 150,
      },
      scrolling: {
          width: Dimensions.get('window').width,
      },
      header: {
          flexDirection: 'row', 
          backgroundColor: 'black', 
          justifyContent: 'center',
          padding: 8,
          alignItems: 'center',
          width: Dimensions.get('window').width,
      }
  })
  
  export default Deliveries