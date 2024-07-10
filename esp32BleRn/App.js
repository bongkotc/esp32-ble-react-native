import { View, Text } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import BleDevice from "./src/ble";

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home"
      screenOptions={{
        headerStyle: { backgroundColor: '#000' },
        headerTintColor: '#fff',
        headerTitleStyle: { color: '#fff' },
      }}
      >
        <Stack.Screen name="Home" component={HomeScreen} 
        options={{ title: 'ทดลอง ESP32-BLE กับ 8 LED',navigationBarColor:'lightsteelblue'}} // Change the screen title here
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

function HomeScreen({ navigation }) {
    return (
      // your home screen UI
    //   <View style={{flex:1}}>
    //     <Text>
    //     home screen UI
    //     <BleDevice/>
    //     </Text>
    //     {/* <View>
    //     <BleDevice/>
    //     </View> */}
        
    //   </View>
    <BleDevice/>
    );
  }
  
  function DetailsScreen({ navigation }) {
    return (
      // your details screen UI
      <View>
        <Text>
        details screen UI
        </Text>
      </View>
    );
  }

export default App