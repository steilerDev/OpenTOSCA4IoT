package de.tosca4iot.smarthome.Weather_Sensor.ConfigLoader;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

public class ConfigReader {
	String result = "";
	InputStream inputStream;
	String path = "";
	
	public ConfigReader (String path){
		this.path = path;
	}
 
	public String getPropValues(String key) throws IOException {
 
		try {
			Properties prop = new Properties();
			String propFileName = path;
 
			inputStream = getClass().getClassLoader().getResourceAsStream(propFileName);
 
			if (inputStream != null) {
				prop.load(inputStream);
			} else {
				throw new FileNotFoundException("property file '" + propFileName + "' not found in the classpath");
			}

			result = prop.getProperty(key);

		} catch (Exception e) {
			System.out.println("Exception: " + e);
		} finally {
			inputStream.close();
		}
		return result;
	}
}
