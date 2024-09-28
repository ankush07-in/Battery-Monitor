import requests
import time
import subprocess
import json

url = 'http://192.168.0.103:3000/batteryStatus'  # Replace with your actual desktop IP

while True:
    try:
        result = subprocess.run(['termux-battery-status'], capture_output=True, text=True)
        battery_info = json.loads(result.stdout)

        level = battery_info['percentage']
        charging = battery_info['plugged'] != "UNPLUGGED"
        print(f"Battery Level: {level}%, Charging: {charging}")  # Output to terminal

        # Send data to server
        requests.post(url, json={'level': level, 'charging': charging})

        time.sleep(60)  # Update every minute
    except Exception as e:
        print(f"An error occurred: {e}")
        time.sleep(60)  # Wait before retrying