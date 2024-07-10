import { View, Text, StyleSheet, SafeAreaView, ScrollView} from 'react-native'
import React from 'react'
import BluetoothComponent from './BluetoothComponent'
// import { SafeAreaView } from 'react-native-safe-area-context'

const index = () => {
  return (
    // <View>
        // <ScrollView contentContainerStyle={styles.container}>
            // <SafeAreaView style={styles.container}>
            //     <BluetoothComponent style={styles.content}/>
            // </SafeAreaView>
        // </ScrollView>
    // {/* </View> */}
    
    // <View>
    //     <BluetoothComponent style={styles.content}/>
    // </View>

    <View 
    style={{
        flex:1,
        flexDirection:'column',
        // backgroundColor:'yellow'
    }}>
        <BluetoothComponent 
        // style={styles.content}
        />
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop:20,
        justifyContent: 'center',
        alignItems: 'center',
      },
      content: {
          paddingTop:20,
          flex: 1,
          flexDirection:'column',
          backgroundColor:'yellow',
          justifyContent: 'center',
          alignContentItems: 'center',
      },
  });

export default index