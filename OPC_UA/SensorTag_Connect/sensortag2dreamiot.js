/*
 * sensortag2dreamiotf.js
 */


var SensorTag = require('sensortag');
//Creating a little delay to avoid sending to much data to the cloud 
var pushDelay = 3000;
var data =
    {           
        ts: new Date().getTime()
    };

/* Discover a SensorTag
 * Connect to the discovered SensorTag
 * Register Event Listener for the Sensors 
 */
SensorTag.discover(function (st) {
    st.on('disconnect', function () {
        console.log('sensor disconnected!');
        process.exit(0);
    });

    function init() {
        console.log("connect to and setup sensortag " + st.id);
        st.connectAndSetUp(setup);

    }
    function setup() {
        console.log("enable humidity sensor ...");
        st.enableHumidity(humidityC);
        console.log("enable barometric pressure sensor ...");
        st.enableBarometricPressure(pressureC);
        console.log("enable luxometer ...");
        st.enableLuxometer(luxC);   
    }
    
    //waiting for humidity updates
    function humidityC() {
        st.notifyHumidity(function () {
            st.on('humidityChange', function (temperature, humidity) {
		var ts = new Date().getTime();
		if (ts - pushDelay > data.ts) {
		  data.ts = ts;
		  sendSensor(3, "Temperature", temperature);
		  sendSensor(4, "Humidity", humidity);
		}
            });
        });
    }
    
    //waiting for pressure updates
    function pressureC() {
        st.notifyBarometricPressure(function () {
            st.on('barometricPressureChange', function (pressure) {
		var ts = new Date().getTime();
		if (ts - pushDelay > data.ts) {
		  data.ts = ts;
		  sendSensor(2, "Pressure", pressure);
		}
            });
        });
    }
    
    //waiting for Luxometer updates
    function luxC() {
        st.notifyLuxometer(function () {
            st.on('luxometerChange', function (lux) {
	      	var ts = new Date().getTime();
		if (ts - pushDelay > data.ts) {
		  data.ts = ts;
		  sendSensor(1, "Luxometer", lux);
		}
            });
        });
    }
    init();
});

//Using Node-Rest-Client to connect to Dreamfactory
var Client = require('node-rest-client').Client;
var client = new Client();
client.on('error', function (er) {
  console.trace('Connection Error:') // [1]
  console.error(er.stack) // [2]
})

function sendSensor(field, sensor, data) {

  if (justiceCounter(field)){ //A little helper so that every sensor have the same amount of pushes
      var args = {
	      data: { Field: field, Data: data, Timestamp: getDate() }, //The Sensordata in JSON. Field is just a ID.
	      headers: { "Content-Type": "application/json" }
      };
      console.log ("-"+getDate()+"- "+sensor+": "+data);
      
      //Update the dreamfactory data
      client.put("https://df-ft-tim-ebner.enterprise.dreamfactory.com/api/v2/db/_table/HMI_SENSORDATA_RECENT/"+field+"?api_key=49da2ee7219c8c85a1430aa028463f94b6e1ea0bca3fe0d290684d49dd127298", args, function (data, response) {

      });
  }
};

//Create a Timestamp for the database
function getDate(){
  var date = new Date();
  return ""+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
};

//A little helper so that every sensor have the same amount of pushes
var counter=1;
function justiceCounter (number){
  if(counter == number){
    counter ++
    if (counter == 5){
      counter = 1
    }
    return true;
  } else {
    return false;
  }
}

//Error Handler so that the program doesn't stop if the internet connection fails.
process.on('uncaughtException', function (er) {
  console.log("Connection Error:");
  console.error(er.stack);
  //process.exit(1);
})

