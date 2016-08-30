/*
 * sensortag2ibmiotf.js
 */

var SensorTag = require('sensortag');
var pushDelay = 5000;
var data =
    {
        "pressure": 0,
        "humidity": 0,
        "humidity_t": 0,       
        // "light": 0,             
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
        /*
            console.log("enable luxometer ...");
            st.enableLuxometer(luxC);
        */
    }
    function humidityC() {
        st.notifyHumidity(function () {
            st.on('humidityChange', function (temperature, humidity) {
                update('humidity_t', temperature);
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
                update('light', lux);
            });
        });
    }
    init();
});

var mqttClient;

function mqttInit() {
    var properties = require('properties');
    var mqtt = require('mqtt');
    properties.parse('./ibmiotf.properties', { path: true }, function (err, cfg) {
        if (err) {
            console.error('properties missing.');
            throw err;
        }
        var id = ['d', cfg.org, cfg.type, cfg.id].join(':');
        mqttClient = mqtt.connect("mqtts://" + cfg.org + '.messaging.internetofthings.ibmcloud.com:8883',
            {
                "clientId": id,
                "keepalive": 30,
                "username": "use-token-auth",
                "password": cfg['auth-token']
            });
        mqttClient.on('connect', function () {
            console.log('connected to ibm iotf.');
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
    var payload = {
        "d": data
    }
    var msg =  JSON.stringify(payload);
    mqttClient.publish('iot-2/evt/status/fmt/json',msg, function () {
    });
    console.log('data sent: '+msg);
};



