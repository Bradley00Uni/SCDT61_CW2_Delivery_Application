import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Container, Button, Text, TextInput, Alert, ScrollView, Dimensions} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appbar } from 'react-native-paper';
import {Restart} from 'fiction-expo-restart';
import { Card, Overlay } from 'react-native-elements';

const History = () => {
    const STORAGE_ID = '@driver_id'

    const [orders, setOrders] = useState(null)
    const [loading, setLoading] = useState(true)

    const [currentOrder, setCurrentOrder] = useState(null)
    const [details, setDetailsVisible] = useState(false)

    useEffect(() => {
        getOrders()
    }, [loading])

    const getOrders = async () => {
        const id = await AsyncStorage.getItem(STORAGE_ID)
        fetch(`https://onlineshopdeliveryapi20220402003022.azurewebsites.net/api/orders/CompleteOrders/${id}`).then( (response) => response.json()).then( (responseJson) => {
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
                      <Card.Title h5>Order : {val.order.orderId} | {convertDate(val.order.orderPlaced)}</Card.Title>
                      <Card.Divider color='black' />
                      <Text style={{textAlign: 'center'}}>Number of Items: {totalProducts} | Order Total: £{val.order.orderTotal}</Text>
                  </Card>
              )
          })
  
          return (
              <View style={styles.container}>
                  <Appbar.Header style={styles.header}>
                    <Appbar.Action icon="refresh" accessibiltyLevel onPress={() => getOrders()} />
                    <Appbar.Content title="OnlineShop2022 Orders" />
                  </Appbar.Header>
                  <ScrollView style={styles.scrolling}>{orderMap}</ScrollView>
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

export default History