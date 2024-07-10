import React, {useState, useEffect, useMemo, useRef} from 'react';
import {
  View,
  Text,
  Button,
  FlatList,
  TouchableOpacity,
  PermissionsAndroid,
  Platform,
  ScrollView,
  Alert,
  StyleSheet,
} from 'react-native';
import BleManager from 'react-native-ble-manager';
import {Buffer} from 'buffer';
import {NativeEventEmitter, NativeModules} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
// const myIcon = <Icon name="rocket" size={30} color="#900" />;
// import Icon from 'react-native-vector-icons/Ionicons';

global.Buffer = Buffer;

//Server
const SERVICE_UUID = '4fafc201-1fb5-459e-8fcc-c5c9c331914b';
//Characteristic
const CHARACTERISTIC_UUID_LED1 = 'beb5483e-36e1-4688-b7f5-ea07361b26a7';
const CHARACTERISTIC_UUID_LED2 = 'beb5483e-36e1-4688-b7f5-ea07361b26a8';
const CHARACTERISTIC_UUID_LED3 = 'beb5483e-36e1-4688-b7f5-ea07361b26a9';
const CHARACTERISTIC_UUID_LED4 = 'beb5483e-36e1-4688-b7f5-ea07361b26aa';
const CHARACTERISTIC_UUID_LED5 = 'beb5483e-36e1-4688-b7f5-ea07361b26ab';
const CHARACTERISTIC_UUID_LED6 = 'beb5483e-36e1-4688-b7f5-ea07361b26ac';
const CHARACTERISTIC_UUID_LED7 = 'beb5483e-36e1-4688-b7f5-ea07361b26ad';
const CHARACTERISTIC_UUID_LED8 = 'beb5483e-36e1-4688-b7f5-ea07361b26ae';
const CHARACTERISTIC_UUID_LED_STATUS = 'beb5483e-36e1-4688-b7f5-ea07361b26af';

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

//ขอเปิดสิทธิ์ในการใช้งาน Bloetooth
async function requestBluetoothPermission() {
  try {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      ]);

      if (
        granted['android.permission.ACCESS_FINE_LOCATION'] ===
          PermissionsAndroid.RESULTS.GRANTED &&
        granted['android.permission.BLUETOOTH_SCAN'] ===
          PermissionsAndroid.RESULTS.GRANTED &&
        granted['android.permission.BLUETOOTH_CONNECT'] ===
          PermissionsAndroid.RESULTS.GRANTED
      ) {
        console.log('Bluetooth permissions granted');
      } else {
        console.log('Bluetooth permissions denied');
      }
    }
  } catch (err) {
    console.warn(err);
  }
}

const BluetoothComponent = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [devices, setDevices] = useState([]);
  const [connectedDevice, setConnectedDevice] = useState(null);
  const [services, setServices] = useState([]);
  const [characteristics, setCharacteristics] = useState([]);

  const [led1State, setLed1State] = useState(false);
  const [led2State, setLed2State] = useState(false);
  const [led3State, setLed3State] = useState(false);
  const [led4State, setLed4State] = useState(false);
  const [led5State, setLed5State] = useState(false);
  const [led6State, setLed6State] = useState(false);
  const [led7State, setLed7State] = useState(false);
  const [led8State, setLed8State] = useState(false);

  const connetedClient = useRef(null);

  const led1WriteData = useRef('0');

  const targetDeviceName = 'DO_IOT';

  useEffect(() => {
    BleManager.start({showAlert: false});

    const BleManagerModule = NativeModules.BleManager;
    const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

    const handleDiscoverPeripheral = peripheral => {
    //   if (peripheral.name) {
    //     setDevices(prevDevices => {
    //       if (prevDevices.findIndex(dev => dev.id === peripheral.id) === -1) {
    //         return [...prevDevices, peripheral];
    //       }
    //       return prevDevices;
    //     });
    //   }
        if (peripheral.name && peripheral.name.includes(targetDeviceName)) {
            setDevices((prevDevices) => {
            const exists = prevDevices.some((device) => device.id === peripheral.id);
            if (!exists) {
                return [...prevDevices, peripheral];
            }
            return prevDevices;
            });
        }
    };

    bleManagerEmitter.addListener(
      'BleManagerDiscoverPeripheral',
      handleDiscoverPeripheral,
    );

    return () => {
      bleManagerEmitter.removeAllListeners('BleManagerDiscoverPeripheral');
    };
  }, []);

  useEffect(() => {}, [services]);

  useEffect(() => {
    const interval = setInterval(async () => {
      readLedStatus();
    }, 200); // Set to 200 millisecond

    return () => {
      clearInterval(interval); // Clean up interval on unmount
    };
  }, []);

  const writeData2 = async () => {
    if (connetedClient.current) {
      try {
        //   const value = [0]; // Replace with the value you want to write
        let data = led1WriteData.current;
        const payload = Array.from(data).map(char => char.charCodeAt(0)); //num array
        await BleManager.write(
          connetedClient.current.id,
          SERVICE_UUID,
          CHARACTERISTIC_UUID_LED1,
          payload,
        );
        console.log('Data written:', data);

        if (led1WriteData.current == '0') {
          led1WriteData.current = '1';
        } else {
          led1WriteData.current = '0';
        }
      } catch (error) {
        console.error('Error writing data:', error);
      }
    }
  };

  const writeData = async () => {
    if (connetedClient.current) {
      try {
        //   const value = [0]; // Replace with the value you want to write
        let data = `1,${led1WriteData.current}`;
        const payload = Array.from(data).map(char => char.charCodeAt(0)); //num array
        await BleManager.write(
          connetedClient.current.id,
          SERVICE_UUID,
          CHARACTERISTIC_UUID_LED,
          payload,
        );
        console.log('Data written:', data);

        if (led1WriteData.current == '0') {
          led1WriteData.current = '1';
        } else {
          led1WriteData.current = '0';
        }
      } catch (error) {
        console.error('Error writing data:', error);
      }
    }
  };

  const readData = async () => {
    if (connetedClient.current) {
      try {
        console.log('Read1 data:', data);
        const data = await BleManager.read(
          connetedClient.current.id,
          SERVICE_UUID,
          CHARACTERISTIC_UUID_LED1,
        );
        console.log('Read2 data:', data);
        // Handle the data read from the device
      } catch (error) {
        console.error('Error reading data:', error);
      }
    }
  };

  const fetchData = async channel => {
    if (connetedClient.current) {
      try {
        let ledUUID = '';
        switch (channel) {
          case 1:
            ledUUID = CHARACTERISTIC_UUID_LED1;
            break;
          case 2:
            ledUUID = CHARACTERISTIC_UUID_LED2;
            break;
          case 3:
            ledUUID = CHARACTERISTIC_UUID_LED3;
            break;
          case 4:
            ledUUID = CHARACTERISTIC_UUID_LED4;
            break;
          case 5:
            ledUUID = CHARACTERISTIC_UUID_LED5;
            break;
          case 6:
            ledUUID = CHARACTERISTIC_UUID_LED6;
            break;
          case 7:
            ledUUID = CHARACTERISTIC_UUID_LED7;
            break;
          case 8:
            ledUUID = CHARACTERISTIC_UUID_LED8;
            break;
          default:
            break;
        }

        //Read BLE Auth
        let itemRead = {
          deviceId: connetedClient.current.id,
          serviceUUID: SERVICE_UUID,
          characteristicUUID: ledUUID,
        };
        //   let read = await readCharacteristic(itemRead);
        const data = await BleManager.read(
          connetedClient.current.id,
          SERVICE_UUID,
          ledUUID,
        );
        // console.log('Read2 data:', data);
        const string = String.fromCharCode(data);
        console.log(`Read channel(${channel}): ${string}`);
        const read = string;
        if (read != null) {
          switch (channel) {
            case 1:
              setLed1State(prev => (read == '1' ? true : false));
              break;
            case 2:
              setLed2State(prev => (read == '1' ? true : false));
              break;
            case 3:
              setLed3State(prev => (read == '1' ? true : false));
              break;
            case 4:
              setLed4State(prev => (read == '1' ? true : false));
              break;
            case 5:
              setLed5State(prev => (read == '1' ? true : false));
              break;
            case 6:
              setLed6State(prev => (read == '1' ? true : false));
              break;
            case 7:
              setLed7State(prev => (read == '1' ? true : false));
              break;
            case 8:
              setLed8State(prev => (read == '1' ? true : false));
              break;

            default:
              break;
          }
        }
      } catch (error) {
        console.log('Setup error', error);
      }
    }
  };

  const readLedStatus = async () => {
    if (connetedClient.current) {
      try {
        let ledUUID = CHARACTERISTIC_UUID_LED_STATUS;
        const data = await BleManager.read(
          connetedClient.current.id,
          SERVICE_UUID,
          ledUUID,
        );

        console.log('Read data:', data);
        const string = data.map(byte => String.fromCharCode(byte)).join('');
        console.log(`${JSON.stringify(string)}`);
        const stateLeds = string.split(',');
        console.log(`${JSON.stringify(stateLeds)}`);
        if (stateLeds.length == 8) {
          setLed1State(prev => (stateLeds[0] == '1' ? true : false));
          setLed2State(prev => (stateLeds[1] == '1' ? true : false));
          setLed3State(prev => (stateLeds[2] == '1' ? true : false));
          setLed4State(prev => (stateLeds[3] == '1' ? true : false));
          setLed5State(prev => (stateLeds[4] == '1' ? true : false));
          setLed6State(prev => (stateLeds[5] == '1' ? true : false));
          setLed7State(prev => (stateLeds[6] == '1' ? true : false));
          setLed8State(prev => (stateLeds[7] == '1' ? true : false));
        }
      } catch (error) {
        console.log('Setup error', error);
      }
    }
  };

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      requestBluetoothPermission();
    }
  };

  const startScan = async () => {
    setDevices([]);
    await requestPermissions();
    BleManager.scan([], 5, true).then(() => {
      setIsScanning(true);
    });
  };

  const stopScan = async () => {
    setDevices([]);
    await requestPermissions();
    BleManager.stopScan().then(() => {
      setIsScanning(false);
    });
  };

  const connectDevice = async device => {
    try {
      await BleManager.connect(device.id);
      //   setConnectedDevice(device);
      setConnectedDevice(prev => device);
      connetedClient.current = device;
      let retrieveServicesInfo = await BleManager.retrieveServices(device.id);
      console.log(
        `retrieveServicesInfo: ${JSON.stringify(retrieveServicesInfo)}`,
      );
      const services = await BleManager.getConnectedPeripherals([device.id]);
      console.log(`services: ${JSON.stringify(services)}`);
      if (services.length > 0) {
        // setServices(services[0].services);
        // setServices(prev=>([...prev,retrieveServicesInfo.services]));
        setServices(prev => [...retrieveServicesInfo.services]);
        const characteristics = services[0].characteristics;
        // setCharacteristics(characteristics);
        // setCharacteristics(prev=>([...prev,retrieveServicesInfo.characteristics[0]]));
        setCharacteristics(prev => [...retrieveServicesInfo.characteristics]);
      }

      //   await BleManager.startNotification(device.id, SERVICE_UUID, CHARACTERISTIC_UUID_LED1);
      //   console.log('Started notification on characteristic');
    } catch (error) {
      console.log('Connection error', error);
    }
  };

  const disconnectDevice = async () => {
    if (connectedDevice) {
      try {
        await BleManager.disconnect(connectedDevice.id);
        setConnectedDevice(null);
        connetedClient.current = null;
        setServices([]);
        setCharacteristics([]);
      } catch (error) {
        console.log('Disconnection error', error);
      }
    }
  };

  // const onRegisterPressed = async() =>{
  //   try{
  //       const {username, password} = user
  //       console.log(JSON.stringify(user));
  //       await AsyncStorage.setItem('username', username)
  //       await AsyncStorage.setItem('password', password)
  //   }catch(error){
  //       console.log(`error:${error}`);
  //   }

  //   navigation.navigate('LoginScreen')
  // }

  const setLedState = async (channel, state) => {
    if (connectedDevice) {
      try {
        let ledUUID = '';
        switch (channel) {
          case 1:
            ledUUID = CHARACTERISTIC_UUID_LED1;
            break;
          case 2:
            ledUUID = CHARACTERISTIC_UUID_LED2;
            break;
          case 3:
            ledUUID = CHARACTERISTIC_UUID_LED3;
            break;
          case 4:
            ledUUID = CHARACTERISTIC_UUID_LED4;
            break;
          case 5:
            ledUUID = CHARACTERISTIC_UUID_LED5;
            break;
          case 6:
            ledUUID = CHARACTERISTIC_UUID_LED6;
            break;
          case 7:
            ledUUID = CHARACTERISTIC_UUID_LED7;
            break;
          case 8:
            ledUUID = CHARACTERISTIC_UUID_LED8;
            break;
          default:
            break;
        }

        //   //Read BLE Auth
        //   let itemRead = {
        //     deviceId : connectedDevice.id,
        //     serviceUUID : SERVICE_UUID,
        //     characteristicUUID : ledUUID,
        //   }
        // //   await readCharacteristic(itemRead);
        //   let read = await readCharacteristic(itemRead);
        //   console.log(`esp32_id: ${read}`);
        //   // await AsyncStorage.setItem('esp32_id', read)
        //await delay(1000);

        itemWrite = {
          deviceId: connectedDevice.id,
          serviceUUID: SERVICE_UUID,
          characteristicUUID: ledUUID,
          data: !state ? '1' : '0',
        };
        await writeCharacteristicItem(itemWrite);

        //   //Read BLE Auth
        //   let itemRead = {
        //     deviceId : connectedDevice.id,
        //     serviceUUID : SERVICE_UUID,
        //     characteristicUUID : ledUUID,
        //   }
        // //   await readCharacteristic(itemRead);
        //   let read = await readCharacteristic(itemRead);
        //   console.log(`esp32_id: ${read}`);
        //   if(read!=null){
        //     switch (channel) {
        //         case 1: ledUUID = setLed1State(prev => ((read=="1")?true:false)); break;
        //         case 2: ledUUID = setLed2State(prev => ((read=="1")?true:false)); break;
        //         case 3: ledUUID = setLed3State(prev => ((read=="1")?true:false)); break;
        //         case 4: ledUUID = setLed4State(prev => ((read=="1")?true:false)); break;
        //         case 5: ledUUID = setLed5State(prev => ((read=="1")?true:false)); break;
        //         case 6: ledUUID = setLed6State(prev => ((read=="1")?true:false)); break;
        //         case 7: ledUUID = setLed7State(prev => ((read=="1")?true:false)); break;
        //         case 8: ledUUID = setLed8State(prev => ((read=="1")?true:false)); break;
        //         default:
        //             break;
        //     }

        //   }

        //await delay(1000);

        //   itemWrite = {
        //     deviceId : connectedDevice.id,
        //     serviceUUID : SERVICE_UUID,
        //     characteristicUUID : CHARACTERISTIC_UUID_SSID_NAME,
        //     data : 'infinity24'
        //   }
        //   await writeCharacteristicItem(itemWrite);
        //   await delay(1000);

        //   itemWrite = {
        //     deviceId : connectedDevice.id,
        //     serviceUUID : SERVICE_UUID,
        //     characteristicUUID : CHARACTERISTIC_UUID_SSID_PWD,
        //     data : 'BkP@ssInfinityw0rd'
        //   }
        //   await writeCharacteristicItem(itemWrite);
        //   await delay(1000);

        //   itemWrite = {
        //     deviceId : connectedDevice.id,
        //     serviceUUID : SERVICE_UUID,
        //     characteristicUUID : CHARACTERISTIC_UUID_CHANGE_ST_MODE,
        //     data : '1'
        //   }
        //   await writeCharacteristicItem(itemWrite);
        //   await delay(1000);

        //   itemWrite = {
        //     deviceId : connectedDevice.id,
        //     serviceUUID : SERVICE_UUID,
        //     characteristicUUID : CHARACTERISTIC_UUID_RESET_ESP32,
        //     data : '1'
        //   }
        //   await writeCharacteristicItem(itemWrite);
      } catch (error) {
        console.log('Setup error', error);
      }
    }
  };

  const setupDevice = async () => {
    if (connectedDevice) {
      try {
        //Write BLE Auth
        let itemRead = {
          deviceId: connectedDevice.id,
          serviceUUID: SERVICE_UUID,
          characteristicUUID: CHARACTERISTIC_UUID_CHIP_ID,
        };
        await readCharacteristic(itemRead);
        // let read = await readCharacteristic(itemRead);
        // console.log(`esp32_id: ${read}`);
        // await AsyncStorage.setItem('esp32_id', read)
        await delay(1000);

        itemWrite = {
          deviceId: connectedDevice.id,
          serviceUUID: SERVICE_UUID,
          characteristicUUID: CHARACTERISTIC_UUID_CLIENT_CODE,
          data: 'DO_IOT',
        };
        await writeCharacteristicItem(itemWrite);
        await delay(1000);

        itemWrite = {
          deviceId: connectedDevice.id,
          serviceUUID: SERVICE_UUID,
          characteristicUUID: CHARACTERISTIC_UUID_SSID_NAME,
          data: 'infinity24',
        };
        await writeCharacteristicItem(itemWrite);
        await delay(1000);

        itemWrite = {
          deviceId: connectedDevice.id,
          serviceUUID: SERVICE_UUID,
          characteristicUUID: CHARACTERISTIC_UUID_SSID_PWD,
          data: 'BkP@ssInfinityw0rd',
        };
        await writeCharacteristicItem(itemWrite);
        await delay(1000);

        itemWrite = {
          deviceId: connectedDevice.id,
          serviceUUID: SERVICE_UUID,
          characteristicUUID: CHARACTERISTIC_UUID_CHANGE_ST_MODE,
          data: '1',
        };
        await writeCharacteristicItem(itemWrite);
        await delay(1000);

        itemWrite = {
          deviceId: connectedDevice.id,
          serviceUUID: SERVICE_UUID,
          characteristicUUID: CHARACTERISTIC_UUID_RESET_ESP32,
          data: '1',
        };
        await writeCharacteristicItem(itemWrite);
      } catch (error) {
        console.log('Setup error', error);
      }
    }
  };

  const readCharacteristic = async item => {
    let chipId = 'unknow';
    if (connectedDevice.id) {
      chipId = await BleManager.read(
        connectedDevice.id,
        item.serviceUUID,
        item.characteristicUUID,
      ).then(readData => {
        console.log('Read:', readData);
        // const buffer = base64.decode(readData);
        // const data = String.fromCharCode.apply(null, new Uint8Array(readData));
        const string = String.fromCharCode(...readData);
        console.log('Read(Str):', string);
        //return string;
        chipId = string;

        console.log('Read 2(Str):', chipId);
        return string;
      });
      return chipId;
    }
  };

  const writeCharacteristic = item => {
    if (connectedDevice.id) {
      const data = 'Hello, BLE!';
      //   const payload = Buffer.from(data, 'ascii').toString('base64');
      const payload = Array.from(data).map(char => char.charCodeAt(0)); //num array
      BleManager.write(
        connectedDevice.id,
        item.serviceUUID,
        item.characteristicUUID,
        payload,
        20,
      ).then(() => {
        console.log('Write complete');
      });
    }
  };

  const writeCharacteristicItem = item => {
    if (connectedDevice.id) {
      const payload = Array.from(item.data).map(char => char.charCodeAt(0)); //num array
      BleManager.write(
        connectedDevice.id,
        item.serviceUUID,
        item.characteristicUUID,
        payload,
        20,
      ).then(() => {
        console.log('Write complete:', payload);
      });
    }
  };

  const characteristicItemOnPress = value => {
    console.log(JSON.stringify(value));
    if (value != null) {
      switch (value[2]) {
        case 'Read':
          let itemRead = {
            deviceId: connectedDevice.id,
            serviceUUID: value[0].service,
            characteristicUUID: value[0].characteristic,
          };
          readCharacteristic(itemRead);
          break;
        case 'Write':
          let itemWrite = {
            deviceId: connectedDevice.id,
            serviceUUID: value[0].service,
            characteristicUUID: value[0].characteristic,
          };
          writeCharacteristic(itemWrite);
          break;
        default:
          break;
      }
    }
  };

  return (
    <View style={{flex: 1, padding: 20, width: '100%'}}>
        {!connectedDevice && (
            <Button
                title={isScanning ? 'กำลังค้นหา...' : 'ค้นหา'}
                onPress={startScan}
                disabled={isScanning}
            />
        )}
      
        {!connectedDevice && (
            <View style={{paddingTop: 5}}>
                <Button
                title={'ยกเลิกการค้นหา'}
                onPress={stopScan}
                // disabled={isScanning}
                />
            </View>
        )}
      

      {/* {connectedDevice && (
        <View style={{marginTop: 20, flex:1, flexDirection:'column', justifyContent:'center'}}>
            <View style={{marginTop: 20, flex:1, flexDirection:'row', justifyContent:'center'}}>
                <View style={{flex:1, height: 120, flexDirection:'column', width:'100%'}}>
                    <TouchableOpacity onPress={async()=>{ await setLedState(1,led1State)}}>
                        <Text style={{fontSize:20,margin:10, backgroundColor: (led1State)?'blue':'gray'}}>LED 1</Text>
                    </TouchableOpacity>
                </View>
                <View style={{flex:1, height: 120, flexDirection:'column', width:'100%'}}>
                    <TouchableOpacity onPress={async()=>{ await setLedState(2,led2State)}}>
                        <Text style={{fontSize:20,margin:10, backgroundColor: (led2State)?'blue':'gray'}}>LED 2</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{marginTop: 20, flex:1, flexDirection:'row', justifyContent:'center'}}>
                <View style={{flex:1, height: 120, flexDirection:'column', width:'100%'}}>
                    <TouchableOpacity onPress={async()=>{ await setLedState(1,led3State)}}>
                        <Text style={{fontSize:20,margin:10, backgroundColor: (led3State)?'blue':'gray'}}>LED 3</Text>
                    </TouchableOpacity>
                </View>
                <View style={{flex:1, height: 120, flexDirection:'column', width:'100%'}}>
                    <TouchableOpacity onPress={async()=>{ await setLedState(2,led4State)}}>
                        <Text style={{fontSize:20,margin:10, backgroundColor: (led4State)?'blue':'gray'}}>LED 4</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
        
      )} */}

      <View>
        {connectedDevice && (
          <View style={{marginTop: 10}}>
            {/* <Text>Connected to {connectedDevice.name || 'Unnamed Device'}</Text> */}
            <Button title="ยกเลิกการเชื่อมต่อ" onPress={disconnectDevice} />
          </View>
        )}
        <FlatList
          data={devices}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <TouchableOpacity
              onPress={() =>
                connectedDevice ? disconnectDevice() : connectDevice(item)
              }
              style={{
                padding: 10,
                backgroundColor:
                  connectedDevice && connectedDevice.id === item.id
                    ? 'springgreen'
                    : 'white',
              }}>
              <Text>{item.name || 'Unnamed Device'}</Text>
              <Text>{item.id}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <View
        style={{
          marginTop: 10,
          flex: 1,
          flexDirection: 'column',
          // backgroundColor:'#F23456' ,
          width: '100%',
        }}>
        {connectedDevice && (
          <View
            style={{
              marginTop: 20,
              flexDirection: 'column',
              // backgroundColor:'skyblue'
            }}>
            <View
              style={{
                marginTop: 5,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View style={{flex: 1}}>
                <TouchableOpacity
                  style={{
                    ...styles.touchableBtn,
                    backgroundColor: led1State ? 'skyblue' : 'gray',
                  }}
                  onPress={async () => {
                    await setLedState(1, led1State);
                  }}>
                    
                    {/* <Icon name="ios-person" size={30} color="#4F8EF7" />; */}
                  <Text style={{...styles.textBtn}}><Icon name="lightbulb-o" size={50} color={led1State ?'yellow':"silver"} /> 1</Text>
                </TouchableOpacity>
              </View>
              <View style={{flex: 1}}>
                <TouchableOpacity
                  style={{
                    ...styles.touchableBtn,
                    backgroundColor: led2State ? 'skyblue' : 'gray',
                  }}
                  onPress={async () => {
                    await setLedState(2, led2State);
                  }}>
                  <Text style={{...styles.textBtn}}><Icon name="lightbulb-o" size={50} color={led2State ?'yellow':"silver"} />  2</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View
              style={{
                marginTop: 5,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View style={{flex: 1}}>
                <TouchableOpacity
                  style={{
                    ...styles.touchableBtn,
                    backgroundColor: led3State ? 'skyblue' : 'gray',
                  }}
                  onPress={async () => {
                    await setLedState(3, led3State);
                  }}>
                  <Text style={{...styles.textBtn}}><Icon name="lightbulb-o" size={50} color={led3State ?'yellow':"silver"} />  3</Text>
                </TouchableOpacity>
              </View>
              <View style={{flex: 1}}>
                <TouchableOpacity
                  style={{
                    ...styles.touchableBtn,
                    backgroundColor: led4State ? 'skyblue' : 'gray',
                  }}
                  onPress={async () => {
                    await setLedState(4, led4State);
                  }}>
                  <Text style={{...styles.textBtn}}><Icon name="lightbulb-o" size={50} color={led4State ?'yellow':"silver"} />  4</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View
              style={{
                marginTop: 5,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View style={{flex: 1}}>
                <TouchableOpacity
                  style={{
                    ...styles.touchableBtn,
                    backgroundColor: led5State ? 'skyblue' : 'gray',
                  }}
                  onPress={async () => {
                    await setLedState(5, led5State);
                  }}>
                  <Text style={{...styles.textBtn}}><Icon name="lightbulb-o" size={50} color={led5State ?'yellow':"silver"} />  5</Text>
                </TouchableOpacity>
              </View>
              <View style={{flex: 1}}>
                <TouchableOpacity
                  style={{
                    ...styles.touchableBtn,
                    backgroundColor: led6State ? 'skyblue' : 'gray',
                  }}
                  onPress={async () => {
                    await setLedState(6, led6State);
                  }}>
                  <Text style={{...styles.textBtn}}><Icon name="lightbulb-o" size={50} color={led6State ?'yellow':"silver"} />  6</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View
              style={{
                marginTop: 5,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View style={{flex: 1}}>
                <TouchableOpacity
                  style={{
                    ...styles.touchableBtn,
                    backgroundColor: led7State ? 'skyblue' : 'gray',
                  }}
                  onPress={async () => {
                    await setLedState(7, led7State);
                  }}>
                  <Text style={{...styles.textBtn}}><Icon name="lightbulb-o" size={50} color={led7State ?'yellow':"silver"} />  7</Text>
                </TouchableOpacity>
              </View>
              <View style={{flex: 1}}>
                <TouchableOpacity
                  style={{
                    ...styles.touchableBtn,
                    backgroundColor: led8State ? 'skyblue' : 'gray',
                  }}
                  onPress={async () => {
                    await setLedState(8, led8State);
                  }}>
                  <Text style={{...styles.textBtn}}><Icon name="lightbulb-o" size={50} color={led8State ?'yellow':"silver"} />  8</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </View>

      {/* {connectedDevice && (
        <View style={{marginTop: 20}}>
          <Button title="ตั้งค่า" onPress={setupDevice} />
        </View>
      )} */}

      {/* {connectedDevice && (
        <View style={{marginTop: 20}}>
          <Text>Connected to {connectedDevice.name || 'Unnamed Device'}</Text>
          <Button title="Disconnect" onPress={disconnectDevice} />
          <ScrollView style={{marginTop: 20}}>
            <Text>Services:</Text>
            {services != null &&
              console.log(`serv: ${JSON.stringify(services)}`)}
            {services != null &&
              services.map((service, index) => (
                <View
                  key={index}
                  style={{
                    padding: 10,
                    backgroundColor: 'lightgray',
                    marginVertical: 5,
                  }}>
                  <Text>Service UUID: {service.uuid}</Text>
                  <Text>Characteristics:</Text>
                  {characteristics != null &&
                    console.log(`char: ${JSON.stringify(characteristics)}`)}
                  {characteristics != null &&
                    characteristics
                      .filter(char => char.service === service.uuid)
                      .map((char, charIndex) => (
                        <View
                          key={charIndex}
                          style={{
                            padding: 10,
                            backgroundColor: 'white',
                            marginVertical: 5,
                          }}>
                          <Text>
                            Characteristic UUID: {char.characteristic}
                          </Text>
                          {char.properties != null &&
                            console.log(
                              `Properties: ${JSON.stringify(
                                char.properties,
                              )}, typeof: ${typeof char.properties} `,
                            )}
                          <Text>
                            Properties:{' '}
                            {Object.values(char.properties).join(', ')}
                          </Text>
                          {char.properties != null &&
                            Object.entries(char.properties).map((item, charIndex) => (
                                <TouchableOpacity key={charIndex} onPress={()=>{characteristicItemOnPress([char,charIndex,Object.values(char.properties)[charIndex]])}}>
                                    <Text key={charIndex}>{item}{"   "}</Text>
                                </TouchableOpacity>
                            ))}
                          <Text>Properties: {Array.isArray(char.properties) ? char.properties.join(', ') : 'N/A'}</Text>
                        </View>
                      ))}
                </View>
              ))}
          </ScrollView>
        </View>
      )} */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  touchableBtn: {
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    // padding:5,
    margin: 5,
  },
  textBtn: {
    fontSize: 20,
    color: '#fff',
    height: 80,
    width: '100%',
    // padding:20,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
});

export default BluetoothComponent;
