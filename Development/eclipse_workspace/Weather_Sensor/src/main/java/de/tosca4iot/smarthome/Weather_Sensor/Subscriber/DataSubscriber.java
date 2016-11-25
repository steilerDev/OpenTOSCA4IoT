package de.tosca4iot.smarthome.Weather_Sensor.Subscriber;

import org.eclipse.paho.client.mqttv3.IMqttDeliveryToken;
import org.eclipse.paho.client.mqttv3.MqttCallback;
import org.eclipse.paho.client.mqttv3.MqttClient;
import org.eclipse.paho.client.mqttv3.MqttConnectOptions;
import org.eclipse.paho.client.mqttv3.MqttException;
import org.eclipse.paho.client.mqttv3.MqttMessage;
import org.eclipse.paho.client.mqttv3.persist.MemoryPersistence;

import de.tosca4iot.smarthome.Weather_Sensor.Start;
import de.tosca4iot.smarthome.Weather_Sensor.Dashboard.GUI;

public class DataSubscriber implements Runnable {
	private GUI theDashboard;
	public static void main(String[] args) {
		// TODO Auto-generated method stub

	}
	public DataSubscriber(GUI theDashboard, String ipAddress, String port, String topic ){
		this.theDashboard = theDashboard;
		subscribe(ipAddress, port, topic);
	}
	
	public void subscribe(String ipAddress, String port, String topic) {
        String broker       = "tcp://"+ipAddress+":"+port;
        String clientId     = "Dashboard";
        MemoryPersistence persistence = new MemoryPersistence();
        try {
            MqttClient sampleClient = new MqttClient(broker, clientId, persistence);
            MqttConnectOptions connOpts = new MqttConnectOptions();
            connOpts.setCleanSession(true);
            System.out.println("Connecting to broker: "+broker);
            sampleClient.connect(connOpts);
            System.out.println("Connected");
            sampleClient.setCallback(new MqttCallback() {
				
				@Override
				public void messageArrived(String topic, MqttMessage message) throws Exception {
					// TODO Auto-generated method stub
					System.out.println("Message arrived for the Topic "+topic);
					System.out.println("Content: "+message);
					Start.theSubscriber.handleMessages(topic, message);
				}
				
				@Override
				public void deliveryComplete(IMqttDeliveryToken token) {
					// TODO Auto-generated method stub
					
				}
				
				@Override
				public void connectionLost(Throwable cause) {
					// TODO Auto-generated method stub
					
				}
			});
            sampleClient.subscribe(topic );
            System.out.println("Subscribed");

        } catch(MqttException me) {
            System.out.println("reason "+me.getReasonCode());
            System.out.println("msg "+me.getMessage());
            System.out.println("loc "+me.getLocalizedMessage());
            System.out.println("cause "+me.getCause());
            System.out.println("excep "+me);
            me.printStackTrace();
        }
        
	}
	private void handleMessages(String topic, MqttMessage message){
		switch(topic){
		case "rapi/humidity":
			this.theDashboard.setHumidityData(message.toString());
			break;
		case "rapi/temperature":
			this.theDashboard.setTemperatureData(message.toString());
			break;
		case "rapi/brightness":
			this.theDashboard.setBrightnessData(message.toString());
			break;
		case "rapi/pressure":
			this.theDashboard.setPressureData(message.toString());
			break;
		default:
			break;
		}
	}
	
	@Override
	public void run() {
		// TODO Auto-generated method stub
		System.out.println("Subscriber started");
        while(true){
        	
        }
	}

}
