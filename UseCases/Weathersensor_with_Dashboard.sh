#!/bin/bash

echo "Please insert the IP Address of the Raspberry PI which should be used as Weathersensor Gateway"
read weathersensor_ip
expect.sh raspberry ssh pi@{weathersensor_ip}
svn export https://github.com/steilerDev/TOSCA4IoT.git/trunk/UseCases/Weathersensor/Weathersensor.sh
bash Weathersensor.sh

echo "Please insert the IP Address of the Raspberry PI which should be used as Weathersensor Dashboard"
read dashboard_ip
expect.sh raspberry ssh pi@{dashboard_ip}
svn export https://github.com/steilerDev/TOSCA4IoT.git/trunk/UseCases/Dashboard/Dashboard.sh
bash Dashboard.sh


