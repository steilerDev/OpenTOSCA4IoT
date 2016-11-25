package de.tosca4iot.smarthome.Weather_Sensor.Dashboard;

import java.awt.BorderLayout;
import java.awt.EventQueue;

import javax.swing.JFrame;
import javax.swing.JPanel;
import javax.swing.border.EmptyBorder;
import java.awt.GridLayout;
import javax.swing.JLabel;
import java.awt.Font;

public class GUI extends JFrame {

	private JPanel contentPane;
	
	private JLabel lblTemperatureData;
	private JLabel lblHumidityData;
	private JLabel lblPressureData;
	private JLabel lblBrightnessData;

	/**
	 * Launch the application.
	 */
	public static void main(String[] args) {
	}

	/**
	 * Create the frame.
	 */
	public GUI() {
		setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		setBounds(100, 100, 450, 300);
		contentPane = new JPanel();
		contentPane.setBorder(new EmptyBorder(5, 5, 5, 5));
		contentPane.setLayout(new BorderLayout(0, 0));
		setContentPane(contentPane);
		setTitle("Dashboard");
		
		JPanel panel = new JPanel();
		contentPane.add(panel, BorderLayout.CENTER);
		panel.setLayout(new GridLayout(0, 2, 0, 0));
		
		JLabel lblTemperature = new JLabel("Temperature");
		lblTemperature.setFont(new Font("Tahoma", Font.PLAIN, 14));
		panel.add(lblTemperature);
		
		lblTemperatureData = new JLabel("TemperatureData");
		lblTemperatureData.setFont(new Font("Tahoma", Font.PLAIN, 14));
		panel.add(lblTemperatureData);
		
		JLabel lblHumdity = new JLabel("Humidity");
		lblHumdity.setFont(new Font("Tahoma", Font.PLAIN, 14));
		panel.add(lblHumdity);
		
		lblHumidityData = new JLabel("HumidityData");
		lblHumidityData.setFont(new Font("Tahoma", Font.PLAIN, 14));
		panel.add(lblHumidityData);
		
		JLabel lblBrightness = new JLabel("Brightness");
		lblBrightness.setFont(new Font("Tahoma", Font.PLAIN, 14));
		panel.add(lblBrightness);
		
		lblBrightnessData = new JLabel("BrightnessData");
		lblBrightnessData.setFont(new Font("Tahoma", Font.PLAIN, 14));
		panel.add(lblBrightnessData);
		
		JLabel lblPressure = new JLabel("Pressure");
		lblPressure.setFont(new Font("Tahoma", Font.PLAIN, 14));
		panel.add(lblPressure);
		
		lblPressureData = new JLabel("PressureData");
		lblPressureData.setFont(new Font("Tahoma", Font.PLAIN, 14));
		panel.add(lblPressureData);
		
		JLabel lblTitle = new JLabel("Dashboard");
		lblTitle.setFont(new Font("Tahoma", Font.BOLD, 18));
		contentPane.add(lblTitle, BorderLayout.NORTH);
	}

	public void setTemperatureData(String temperatureData) {
		this.lblTemperatureData.setText(temperatureData);
	}

	public void setHumidityData(String humidityData) {
		this.lblHumidityData.setText(humidityData);
	}

	public void setPressureData(String pressureData) {
		this.lblPressureData.setText(pressureData);
	}

	public void setBrightnessData(String brightnessData) {
		this.lblBrightnessData.setText(brightnessData);
	}
	
	

}
