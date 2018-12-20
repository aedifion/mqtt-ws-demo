// MQTT client instance
var client;
 
// create MQTT client and connect
function connect() {   
	// Create a client instance
	host = $('#host').val();
	port = $('#port').val();       	
	client = new Paho.MQTT.Client(String(host), Number(port), "websockets-test-client");

	// set callback handlers
	client.onMessageArrived = cb_onMessageArrived;

	// set connect options and connect
    options = {
        onSuccess: cb_onConnect,
        useSSL: true,
        userName: $('#username').val(),
        password: $('#password').val()
    };
    console.log("Connecting to: Host="+ host + ", port=" + port + " TLS = " + options.useSSL + " username=" + options.userName + " password=" + options.password);
	client.connect(options);
}

// disconnect given client
function disconnect() {
    console.log("Disconnecting from " + client.host + ":" + client.port)
	client.disconnect();
	$('#status').val("Disconnected!")
}

// callback when the client connects
function cb_onConnect() {
    console.log("Connection established.");
    $('#status').val('Connected to ' + host + ':' + port);
    topic = $('#topic').val();
    client.subscribe(topic);
}

// clear all messages
function clearList() {
	$('#messages').empty();
}

// callback when a message arrives
function cb_onMessageArrived(message) {
    console.log("Message arrived: topic=" + message.destinationName + ", message=" + message.payloadString);
	var topic = message.destinationName.split("/");
	var colored_lbg = "<span style='background-color: LightGray'>" + topic[0] + "</span>"
	var colored_topic = "<span style='background-color: LightSteelBlue'>" + topic[1] + "</span>"
	var colored_hashid = "<span style='background-color: Linen'>" + topic[2] + "</span>"
	var payload = message.payloadString.split(";");
	var colored_dp = "<span style='background-color: Linen'>" + payload[0] + "</span>"
	var dt = payload[1].split("T")
	dt = dt[0] + ' ' + dt[1].split("Z")[0].split(".")[0]
	
	$('#messages').prepend('<li><span style="font-size: 0.8rem">' + dt + " - " + colored_lbg + '/' + colored_topic + '/' + colored_hashid + ": " + colored_dp + ' ' + payload[2] + '</span></li>');
}
