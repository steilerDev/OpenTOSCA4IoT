/*
 * sensortag2mqtt.js
 */

var SensorTag = require('sensortag');
var pushDelay = 5000;
var data =
    {
        "pressure": 0,
        "humidity": 0,
        "temperature": 0,       
        "brightness": 0,             
        ts: new Date().getTime()
    };

SensorTag.discover(function (st) {
    mqttInit();
    st.on('disconnect', function () {
        console.log('sensor disconnected!');
        process.exit(0);
    });
    function update(field, value) {
        if (data[field] != value) {
            console.log("update: " + field + "=" + value);
            data[field] = value;
            var ts = new Date().getTime();
            if (ts - pushDelay > data.ts) {
                data.ts = ts;
                mqttSend(data);
            }
        }
    }
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
    function humidityC() {
        st.notifyHumidity(function () {
            st.on('humidityChange', function (temperature, humidity) {
                update('temperature', temperature);
                update('humidity', humidity);
            });
        });
    }
    function pressureC() {
        st.notifyBarometricPressure(function () {
            st.on('barometricPressureChange', function (pressure) {
                update('pressure', pressure);
            });
        });
    }
    function luxC() {
        st.notifyLuxometer(function () {
            st.on('luxometerChange', function (lux) {
                update('brightness', lux);
            });
        });
    }
    init();
});

var mqttClient;

function mqttInit() {
    var properties = require('properties');
    var mqtt = require('mqtt');
    properties.parse('/home/pi/UseCase/OPC_UA/SensorTag_Connect/TOSCA4IoT-Server.properties', { path: true }, function (err, cfg) {
        if (err) {
            console.error('properties missing.');
            throw err;
        }
        var id = ['d', cfg.url, cfg.org, cfg.type, cfg.id].join(':');
	console.log(cfg.url);
        mqttClient = mqtt.connect(cfg.url);
        mqttClient.on('connect', function () {
            console.log('connected to TOSCA4IoT-Server');
            mqttClient.publish('rapi/connected','true');
        });
        mqttClient.on('error', function (err) {
            console.log('error' + err);
            process.exit(1);
        });
        mqttClient.on('close', function () {
            console.log('connection closed.');
            process.exit(1);
        });
    });
}

function mqttSend(data) {
    for(var key in data) {
        var value = data[key];
        mqttClient.publish('rapi/'+key, value+'');
        console.log('Topic: '+'rapi/'+key +' data:' +value)
    }

    var payload = {
        "d": data
    }
    var msg =  JSON.stringify(payload);
    console.log('data sent: '+msg);
};
