import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Container, Button, Text, TextInput, Alert, ScrollView, Dimensions, Linking} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appbar } from 'react-native-paper';
import {Restart} from 'fiction-expo-restart';
import { Card } from 'react-native-elements';
import { Table, Row } from 'react-native-table-component'

const Status = (current) => {

    const [order, setOrder] = useState(current.current.order)
    const [delivery, setDelivery] = useState(current.current.delivery)
    const [products, setProducts] = useState(current.current.products)
    let statusView = ''
    

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

    const setTransit = async () => {
        let data = {
            "orderId" : order.orderId,
            "orderTotal" : order.orderTotal,
            "orderPlaced" : order.orderPlaced,
            "orderStatus" : "In Transit",
            "userID" : order.userID
        }
        const response = await fetch(`https://onlineshopdeliveryapi20220402003022.azurewebsites.net/api/orders/${order.orderId}`, {
            method: 'PUT',
            body: (JSON.stringify(data)),
            headers: {
                'Content-Type': 'application/json',
        },},)
        if(response.status == 204){statusView = "In Transit"}
    }

    const setDelivered = async () => {
        let data = {
            "orderId" : order.orderId,
            "orderTotal" : order.orderTotal,
            "orderPlaced" : order.orderPlaced,
            "orderStatus" : "Delivered",
            "userID" : order.userID
        }
        const response = await fetch(`https://onlineshopdeliveryapi20220402003022.azurewebsites.net/api/orders/${order.orderId}`, {
            method: 'PUT',
            body: (JSON.stringify(data)),
            headers: {
                'Content-Type': 'application/json',
        },},)
        if(response.status == 204){statusView = "Delivered"}
    }

    if(current != null){

        let lineTwo = ''
        if(statusView == ''){statusView = order.orderStatus}
        if(delivery.addressLine2 != null){lineTwo = delivery.addressLine2}

        let tableHeaders = ['Product', 'Value', 'Quantity']

        let productRows = products.map((val, key) => {
            let rowData = [val.productName, '£' + val.price, val.amount]
            return (
                <Row textStyle={styles.text} flexArr={[2,1,1]} key={key} data={rowData} />
            )
        })

        return (
            <View style={styles.container}>
                <Appbar.Header style={styles.header}>
                    <Appbar.Content style={{marginLeft: 70}} title="Delivery Status Management" />
                  </Appbar.Header>
                <ScrollView style={{width: Dimensions.get('window').width - 10}} contentContainerStyle={styles.scrollContainer}>
                    <View style={styles.item}>
                        <Text style={styles.sectionHeader}>Order Details</Text>
                        <Text style={styles.list}>Order Number: {order.orderId}</Text>
                        <Text style={styles.list}>Purchase Date: {convertDate(order.orderPlaced)}</Text>
                        <Text style={styles.list}>Current Status: <Text style={{color: 'blue'}}>{order.orderStatus}</Text></Text>
                    </View>

                    <View style={styles.item}>
                        <Text style={styles.sectionHeader}>Delivery Details</Text>
                        <Text style={styles.list}>Recipient: {delivery.lastName}, {delivery.firstName}</Text>
                        <Text style={styles.list}>House Address: {delivery.addressLine1},{lineTwo}</Text>
                        <Text style={styles.list}>City: {delivery.city}</Text>
                        <Text style={styles.list}>Country: {delivery.country}</Text>
                        <Text style={styles.list}>PostCode: {delivery.postCode}</Text>
                        <Text style={styles.list}>E-mail: {delivery.email}</Text>
                    </View>

                    <View style={styles.item}>
                        <Text style={styles.sectionHeader}>Product Breakdown</Text>
                        <ScrollView style={styles.scrolling}>
                            <Table borderStyle={{borderWidth: 2, borderColor: 'black'}}>
                                <Row data={tableHeaders} flexArr={[2,1,1]} style={{backgroundColor: 'black'}} textStyle={styles.headerText} />
                                {productRows}
                            </Table>
                        </ScrollView>
                    </View>
                    <View style={styles.item}>
                        <Text style={styles.sectionHeader}>Update Status</Text>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 15}}>
                            <View style={{justifyContent: 'flex-start', marginRight: 50}}><Button title='Mark as: In Transit' onPress={() => setTransit()} color={'#209ccc'} /></View>
                            <View style={{justifyContent: 'flex-end'}}><Button title='Mark as: Delivered' onPress={() => setDelivered()} color={'#FF6961'} /></View>
                        </View>
                    </View>

                </ScrollView>
            </View>
        )
    }
    else{
        return (
            <View style={styles.container}>
                <Text>No Order Selected...</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
      },
      scrollContainer: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        borderColor: 'black', borderWidth: 2, borderRadius: 10,
        marginTop: 8
      },
    item: {
        borderRadius: 80,
        alignItems: 'center',
        width: Dimensions.get('window').width - 30,
        padding: 20,
        marginTop: 7,
        backgroundColor: 'white',
    },
    scrolling: {
        width: Dimensions.get('window').width - 30,
    },
    text: {
        textAlign: 'center',
        fontSize: 15
    },
    sectionHeader: {
        fontWeight: 'bold',
        fontSize: 30,
        marginBottom: 5
    },
    headerText: {
        textAlign: 'center',
        color: 'white'
    },
    list: {
        fontSize: 20,
        marginBottom: 2
    },
    header: {
        flexDirection: 'row', 
        backgroundColor: 'black', 
        justifyContent: 'center',
        padding: 8,
        alignItems: 'center',
        width: Dimensions.get('window').width,
        marginTop: -10,
    }
})

export default Status