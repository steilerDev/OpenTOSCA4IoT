#!/bin/bash

apt-get -y update & apt-get upgrade
apt-get -y remove nodejs
hash -d node
wget https://nodejs.org/dist/v5.10.1/node-v5.10.1-linux-armv7l.tar.gz 
tar -xvf node-v5.10.1-linux-armv7l.tar.gz -C /usr/local/lib
export PATH=${PATH}:/usr/local/lib/node-v5.10.1-linux-armv7l/bin

#Git Installation
HOME="/home/pi"
apt-get -y install subversion git
cd ~
mkdir $HOME/UseCase
cd $HOME/UseCase/

#UseCase Installation
svn export https://github.com/steilerDev/TOSCA4IoT.git/trunk/UseCases/Weathersensor

#Create Configuration File
echo "Please insert the ip address of the TOSCA4IoT basestation"
read basestation_ip
echo "Please insert the port of the Message Broker [Standard:1883]"
read message_broker_port
cat > $HOME/UseCase/Weathersensor/SensorTag_Connect/config.properties <<EOL
tcp://${basestation_ip}:${message_broker_port}
EOL

#Start Application
nohup node /home/pi/UseCase/OPC_UA/SensorTag_Connect/sensortag2mqtt.js >>/dev/null 2>>/dev/null &