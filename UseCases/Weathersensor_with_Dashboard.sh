#!/bin/bash

echo "Please insert the IP Address of the Raspberry PI which should be used as Weathersensor Gateway"
read weathersensor_ip
expect raspberry ssh pi@{weathersensor_ip}
wget -qO- https://github.com/steilerDev/TOSCA4IoT.git/trunk/UseCases/Dashboard/Dashboard.sh | sh;

echo "Please insert the IP Address of the Raspberry PI which should be used as Weathersensor Dashboard"
expect raspberry ssh pi@{weathersensor_ip}
read dashboard_ip
wget -qO- https://github.com/steilerDev/TOSCA4IoT.git/trunk/UseCases/Weathersensor/Weathersensor.sh | sh;


