#include <NimBLEDevice.h>

const int LED_BUILTIN = 2;

String bleName = "DO_IOT";  //Tart Smart IoT
// BLE UUIDs
#define SERVICE_UUID_LED "4fafc201-1fb5-459e-8fcc-c5c9c331914b"
#define CHARACTERISTIC_UUID_LED1 "beb5483e-36e1-4688-b7f5-ea07361b26a7"
#define CHARACTERISTIC_UUID_LED2 "beb5483e-36e1-4688-b7f5-ea07361b26a8"
#define CHARACTERISTIC_UUID_LED3 "beb5483e-36e1-4688-b7f5-ea07361b26a9"
#define CHARACTERISTIC_UUID_LED4 "beb5483e-36e1-4688-b7f5-ea07361b26aa"
#define CHARACTERISTIC_UUID_LED5 "beb5483e-36e1-4688-b7f5-ea07361b26ab"
#define CHARACTERISTIC_UUID_LED6 "beb5483e-36e1-4688-b7f5-ea07361b26ac"
#define CHARACTERISTIC_UUID_LED7 "beb5483e-36e1-4688-b7f5-ea07361b26ad"
#define CHARACTERISTIC_UUID_LED8 "beb5483e-36e1-4688-b7f5-ea07361b26ae"
#define CHARACTERISTIC_UUID_LED_STATE "beb5483e-36e1-4688-b7f5-ea07361b26af"

// BLE server and characteristic
NimBLEServer* pServer = nullptr;
NimBLECharacteristic* pCharacteristicLed1 = nullptr;
NimBLECharacteristic* pCharacteristicLed2 = nullptr;
NimBLECharacteristic* pCharacteristicLed3 = nullptr;
NimBLECharacteristic* pCharacteristicLed4 = nullptr;
NimBLECharacteristic* pCharacteristicLed5 = nullptr;
NimBLECharacteristic* pCharacteristicLed6 = nullptr;
NimBLECharacteristic* pCharacteristicLed7 = nullptr;
NimBLECharacteristic* pCharacteristicLed8 = nullptr;
NimBLECharacteristic* pCharacteristicLedState = nullptr;
bool deviceConnected = false;
bool oldDeviceConnected = false;
std::string receivedValueLed1 = "";
std::string receivedValueLed2 = "";
std::string receivedValueLed3 = "";
std::string receivedValueLed4 = "";
std::string receivedValueLed5 = "";
std::string receivedValueLed6 = "";
std::string receivedValueLed7 = "";
std::string receivedValueLed8 = "";
std::string receivedValueLedState = "";

//กำหนดค่า GPIO pin ให้กับ LED
const int ledPins[] = {18, 4, 5, 12, 13, 14, 15, 16};
const int numLeds = 8;//Led จำนวน 8 ดวง

void setupBLE();
void updateStatusPinsToBLE();
void ledBlink(int delay);

void setup() {
  //ตั้งค่าเปิดการใช้งานการเชื่อมต่อ Serial Port
  Serial.begin(115200);

  pinMode(LED_BUILTIN, OUTPUT);
  digitalWrite(LED_BUILTIN, LOW);

  //ตั้งค่า Pins ของ LED ให้เป็น Output ทั้งหมด
  for (int i = 0; i < numLeds; i++) {
    pinMode(ledPins[i], OUTPUT);
    digitalWrite(ledPins[i], HIGH);//Active LOW (LOW=LED ติด , HIGH=LED ดับ)
  }
  setupBLE();
}

void loop() {
  if (deviceConnected) {
    ledBlink(200);
  } else {
    ledBlink(1000);
  }

  checkDeviceConnected();//ตรวจสอบการเชื่อมต่อ

  // ถ้ามีอุปกรณ์เชื่อมต่ออยู่ ให้อ่านข้อมูล Characteristic
  if (deviceConnected) {
    updateStatusPinsToBLE();//Update สถานะของ LED pin ไปที่ BLE


    //อ่านค่า Characteristic ที่อุปกรณ์ที่เชื่อมต่อส่งมา
    //อ่านค่า Characteristic ของ LED1
    std::string newValue = pCharacteristicLed1->getValue();
    if(newValue.c_str()!=nullptr){
      if (newValue != receivedValueLed1) {
        Serial.print("ค่าใหม่ที่รับมาของ LED1: ");
        Serial.println(newValue.c_str());
        receivedValueLed1 = newValue;
        if(newValue=="0"){
          //อัพเดตค่าไปที่ Characteristic
          digitalWrite(ledPins[0],HIGH);
          // pCharacteristicLed1->setValue(String(!digitalRead(ledPins[0])));
        }
        else if(newValue=="1"){
          digitalWrite(ledPins[0],LOW);
          // pCharacteristicLed1->setValue(String(!digitalRead(ledPins[0])));
        }
      }
    }
    

    // อ่านค่า Characteristic ของ LED2
    newValue = pCharacteristicLed2->getValue();
    if(newValue.c_str()!=nullptr){
      if (newValue != receivedValueLed2) {
        Serial.print("ค่าใหม่ที่รับมาของ LED2: ");
        Serial.println(newValue.c_str());
        receivedValueLed2 = newValue;
        if(newValue=="0"){
          //อัพเดตค่าไปที่ Characteristic
          digitalWrite(ledPins[1],HIGH);
          // pCharacteristicLed2->setValue(String(!digitalRead(ledPins[1])));
        }
        else if(newValue=="1"){
          digitalWrite(ledPins[1],LOW);
          // pCharacteristicLed2->setValue(String(!digitalRead(ledPins[1])));
        }
      }
    }
    

    //อ่านค่า Characteristic ของ LED3
    newValue = pCharacteristicLed3->getValue();
    if(newValue.c_str()!=nullptr){
      if (newValue != receivedValueLed3) {
        Serial.print("ค่าใหม่ที่รับมาของ LED3: ");
        Serial.println(newValue.c_str());
        receivedValueLed3 = newValue;
        if(newValue=="0"){
          //อัพเดตค่าไปที่ Characteristic
          digitalWrite(ledPins[2],HIGH);
          // pCharacteristicLed3->setValue(String(!digitalRead(ledPins[2])));
        }
        else if(newValue=="1"){
          digitalWrite(ledPins[2],LOW);
          // pCharacteristicLed3->setValue(String(!digitalRead(ledPins[2])));
        }
      }
    }
    

    //อ่านค่า Characteristic ของ LED4
    newValue = pCharacteristicLed4->getValue();
    if(newValue.c_str()!=nullptr){
      if (newValue != receivedValueLed4) {
        Serial.print("ค่าใหม่ที่รับมาของ LED4: ");
        Serial.println(newValue.c_str());
        receivedValueLed4 = newValue;
        if(newValue=="0"){
          //อัพเดตค่าไปที่ Characteristic
          digitalWrite(ledPins[3],HIGH);
          // pCharacteristicLed4->setValue(String(!digitalRead(ledPins[3])));
        }
        else if(newValue=="1"){
          digitalWrite(ledPins[3],LOW);
          // pCharacteristicLed4->setValue(String(!digitalRead(ledPins[3])));
        }
      }
    }
    

    //อ่านค่า Characteristic ของ LED5
    newValue = pCharacteristicLed5->getValue();
    if(newValue.c_str()!=nullptr){
      if (newValue != receivedValueLed5) {
        Serial.print("ค่าใหม่ที่รับมาของ LED5: ");
        Serial.println(newValue.c_str());
        receivedValueLed5 = newValue;
        if(newValue=="0"){
          //อัพเดตค่าไปที่ Characteristic
          digitalWrite(ledPins[4],HIGH);
          // pCharacteristicLed5->setValue(String(!digitalRead(ledPins[4])));
        }
        else if(newValue=="1"){
          digitalWrite(ledPins[4],LOW);
          // pCharacteristicLed5->setValue(String(!digitalRead(ledPins[4])));
        }
      }
    }
    

    //อ่านค่า Characteristic ของ LED6
    newValue = pCharacteristicLed6->getValue();
    if(newValue.c_str()!=nullptr){
      if (newValue != receivedValueLed6) {
        Serial.print("ค่าใหม่ที่รับมาของ LED6: ");
        Serial.println(newValue.c_str());
        receivedValueLed6 = newValue;
        if(newValue=="0"){
          //อัพเดตค่าไปที่ Characteristic
          digitalWrite(ledPins[5],HIGH);
          // pCharacteristicLed6->setValue(String(!digitalRead(ledPins[5])));
        }
        else if(newValue=="1"){
          digitalWrite(ledPins[5],LOW);
          // pCharacteristicLed6->setValue(String(!digitalRead(ledPins[5])));
        }
      }
    }
    

    //อ่านค่า Characteristic ของ LED7
    newValue = pCharacteristicLed7->getValue();
    if(newValue.c_str()!=nullptr){
      if (newValue != receivedValueLed7) {
        Serial.print("ค่าใหม่ที่รับมาของ LED7: ");
        Serial.println(newValue.c_str());
        receivedValueLed7 = newValue;
        if(newValue=="0"){
          //อัพเดตค่าไปที่ Characteristic
          digitalWrite(ledPins[6],HIGH);
          // pCharacteristicLed7->setValue(String(!digitalRead(ledPins[6])));
        }
        else if(newValue=="1"){
          digitalWrite(ledPins[6],LOW);
          // pCharacteristicLed7->setValue(String(!digitalRead(ledPins[6])));
        }
      }
    }

    //อ่านค่า Characteristic ของ LED8
    newValue = pCharacteristicLed8->getValue();
    if(newValue.c_str()!=nullptr){
      if (newValue != receivedValueLed8) {
        Serial.print("ค่าใหม่ที่รับมาของ LED8: ");
        Serial.println(newValue.c_str());
        receivedValueLed8 = newValue;
        if(newValue=="0"){
          //อัพเดตค่าไปที่ Characteristic
          digitalWrite(ledPins[7],HIGH);
          // pCharacteristicLed8->setValue(String(!digitalRead(ledPins[7])));
        }
        else if(newValue=="1"){
          digitalWrite(ledPins[7],LOW);
          // pCharacteristicLed8->setValue(String(!digitalRead(ledPins[7])));
        }
      }
    }
  }

  //หน่วงเวลา Sampling = 100 ms หรือ 0.1 วินาที
  // delay(5);
}

void updateStatusPinsToBLE(){
  static unsigned long lastMsg = 0;
  unsigned long now = millis();
  if (now - lastMsg > 50) {
    lastMsg = now;
    receivedValueLed1 = String(!digitalRead(ledPins[0])).c_str();
    receivedValueLed2 = String(!digitalRead(ledPins[1])).c_str();
    receivedValueLed3 = String(!digitalRead(ledPins[2])).c_str();
    receivedValueLed4 = String(!digitalRead(ledPins[3])).c_str();
    receivedValueLed5 = String(!digitalRead(ledPins[4])).c_str();
    receivedValueLed6 = String(!digitalRead(ledPins[5])).c_str();
    receivedValueLed7 = String(!digitalRead(ledPins[6])).c_str();
    receivedValueLed8 = String(!digitalRead(ledPins[7])).c_str();

    pCharacteristicLed1->setValue(receivedValueLed1);
    pCharacteristicLed2->setValue(receivedValueLed2);
    pCharacteristicLed3->setValue(receivedValueLed3);
    pCharacteristicLed4->setValue(receivedValueLed4);
    pCharacteristicLed5->setValue(receivedValueLed5);
    pCharacteristicLed6->setValue(receivedValueLed6);
    pCharacteristicLed7->setValue(receivedValueLed7);
    pCharacteristicLed8->setValue(receivedValueLed8);

    receivedValueLedState = "";
    receivedValueLedState += receivedValueLed1;
    receivedValueLedState += ",";
    receivedValueLedState += receivedValueLed2;
    receivedValueLedState += ",";
    receivedValueLedState += receivedValueLed3;
    receivedValueLedState += ",";
    receivedValueLedState += receivedValueLed4;
    receivedValueLedState += ",";
    receivedValueLedState += receivedValueLed5;
    receivedValueLedState += ",";
    receivedValueLedState += receivedValueLed6;
    receivedValueLedState += ",";
    receivedValueLedState += receivedValueLed7;
    receivedValueLedState += ",";
    receivedValueLedState += receivedValueLed8;

    pCharacteristicLedState->setValue(receivedValueLedState);
  }
}

void setupBLE() {
  NimBLEDevice::init(bleName.c_str());  //"ESP32_BLE"

  pServer = NimBLEDevice::createServer();

  NimBLEService* pService = pServer->createService(SERVICE_UUID_LED);//ตั้งค่า Service

  receivedValueLed1 = String(!digitalRead(ledPins[0])).c_str();
  receivedValueLed2 = String(!digitalRead(ledPins[1])).c_str();
  receivedValueLed3 = String(!digitalRead(ledPins[2])).c_str();
  receivedValueLed4 = String(!digitalRead(ledPins[3])).c_str();
  receivedValueLed5 = String(!digitalRead(ledPins[4])).c_str();
  receivedValueLed6 = String(!digitalRead(ledPins[5])).c_str();
  receivedValueLed7 = String(!digitalRead(ledPins[6])).c_str();
  receivedValueLed8 = String(!digitalRead(ledPins[7])).c_str();
  //LED 1
  pCharacteristicLed1 = pService->createCharacteristic(
    CHARACTERISTIC_UUID_LED1, NIMBLE_PROPERTY::READ | NIMBLE_PROPERTY::WRITE);//ตั้งค่าให้สามารถอ่านและเขียน Characteristic ของ LED 1 ได้
  pCharacteristicLed1->setValue(receivedValueLed1);//อ่านค่าสถานะ pin ของ LED 1 และส่งเข้าไปที่ BLE

  //LED 2
  pCharacteristicLed2 = pService->createCharacteristic(
    CHARACTERISTIC_UUID_LED2, NIMBLE_PROPERTY::READ | NIMBLE_PROPERTY::WRITE);//ตั้งค่าให้สามารถอ่านและเขียน Characteristic ของ LED 2 ได้
  pCharacteristicLed2->setValue(receivedValueLed2);//อ่านค่าสถานะ pin ของ LED 2 และส่งเข้าไปที่ BLE

  //LED 3
  pCharacteristicLed3 = pService->createCharacteristic(
    CHARACTERISTIC_UUID_LED3, NIMBLE_PROPERTY::READ | NIMBLE_PROPERTY::WRITE);//ตั้งค่าให้สามารถอ่านและเขียน Characteristic ของ LED 3 ได้
  pCharacteristicLed3->setValue(receivedValueLed3);//อ่านค่าสถานะ pin ของ LED 3 และส่งเข้าไปที่ BLE

  //LED 4
  pCharacteristicLed4 = pService->createCharacteristic(
    CHARACTERISTIC_UUID_LED4, NIMBLE_PROPERTY::READ | NIMBLE_PROPERTY::WRITE);//ตั้งค่าให้สามารถอ่านและเขียน Characteristic ของ LED 4 ได้
  pCharacteristicLed4->setValue(receivedValueLed4);//อ่านค่าสถานะ pin ของ LED 4 และส่งเข้าไปที่ BLE

  //LED 5
  pCharacteristicLed5 = pService->createCharacteristic(
    CHARACTERISTIC_UUID_LED5, NIMBLE_PROPERTY::READ | NIMBLE_PROPERTY::WRITE);//ตั้งค่าให้สามารถอ่านและเขียน Characteristic ของ LED 5 ได้
  pCharacteristicLed5->setValue(receivedValueLed5);//อ่านค่าสถานะ pin ของ LED 5 และส่งเข้าไปที่ BLE

  //LED 6
  pCharacteristicLed6 = pService->createCharacteristic(
    CHARACTERISTIC_UUID_LED6, NIMBLE_PROPERTY::READ | NIMBLE_PROPERTY::WRITE);//ตั้งค่าให้สามารถอ่านและเขียน Characteristic ของ LED 6 ได้
  pCharacteristicLed6->setValue(receivedValueLed6);//อ่านค่าสถานะ pin ของ LED 6 และส่งเข้าไปที่ BLE

  //LED 7
  pCharacteristicLed7 = pService->createCharacteristic(
    CHARACTERISTIC_UUID_LED7, NIMBLE_PROPERTY::READ | NIMBLE_PROPERTY::WRITE);//ตั้งค่าให้สามารถอ่านและเขียน Characteristic ของ LED 7 ได้
  pCharacteristicLed7->setValue(receivedValueLed7);//อ่านค่าสถานะ pin ของ LED 7 และส่งเข้าไปที่ BLE

  //LED 8
  pCharacteristicLed8 = pService->createCharacteristic(
    CHARACTERISTIC_UUID_LED8, NIMBLE_PROPERTY::READ | NIMBLE_PROPERTY::WRITE);//ตั้งค่าให้สามารถอ่านและเขียน Characteristic ของ LED 8 ได้
  pCharacteristicLed8->setValue(receivedValueLed8);//อ่านค่าสถานะ pin ของ LED 8 และส่งเข้าไปที่ BLE

  //LED STATE
  pCharacteristicLedState = pService->createCharacteristic(
    CHARACTERISTIC_UUID_LED_STATE, NIMBLE_PROPERTY::READ | NIMBLE_PROPERTY::WRITE);//ตั้งค่าให้สามารถอ่านและเขียน Characteristic ของ LED 8 ได้
  pCharacteristicLed8->setValue(receivedValueLedState);//อ่านค่าสถานะ pin ของ LED 8 และส่งเข้าไปที่ BLE

  pService->start();//Start Service
  pServer->getAdvertising()->start();//รอรับ Advertising
  Serial.println("กำลังรอ... อุปกรณ์ภายนอกมาเชื่อมต่อ...");
}

//ตรวจสอบว่ามี อุปกรณ์ที่กำลังเชื่อมต่ออยู่หรือไม่
void checkDeviceConnected() {
  // Check if there are any connected devices
  deviceConnected = pServer->getConnectedCount() > 0;

  // Handle new connection
  if (deviceConnected && !oldDeviceConnected) {
    Serial.println("มีอุปกรณ์ถูกเชื่อมต่อ");
    oldDeviceConnected = deviceConnected;
  }

  // Handle disconnection
  if (!deviceConnected && oldDeviceConnected) {
    Serial.println("ไม่มีอุปกรณ์ถูกเชื่อมต่อ");
    oldDeviceConnected = deviceConnected;
    // Restart advertising
    pServer->getAdvertising()->start();
  }
}

void ledBlink(int delay) {
  static unsigned long lastMsg = 0;
  unsigned long now = millis();
  if (now - lastMsg > delay) {
    lastMsg = now;
    digitalWrite(LED_BUILTIN, !digitalRead(LED_BUILTIN));
  }
}