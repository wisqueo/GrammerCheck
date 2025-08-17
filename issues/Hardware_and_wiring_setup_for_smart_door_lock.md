# Hardware and Wiring Setup for Smart Door Lock

**Project Items:**
- Servo MG90s
- Buck converter (DC)
- ESP8266 1.0
- Buzzer 9V
- RFID RC522 and cards
- LED 5mm (red and green)
- 2S battery 18650 (output: 5V stable with buck converter)

**Pin Configuration:**
- d0: Green LED
- d1: Red LED
- d2: Buzzer +
- d3: RC522 RST
- d4: RC522 SDA
- d5: RC522 SCK
- d6: RC522 MISO
- d7: RC522 MOSI
- d8: Servo signal
- Common ground for all modules
- ESP powered via VIN and GND
- LEDs should have appropriate ohm resistors

**Task:**
Set up all hardware per pin mapping above. Ensure power stability and proper connections for reliable operation.