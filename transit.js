// Define a bunch of variables
var lat = 0;
var lng = 0;
var mapOptions = {
	zoom: 12,
	center: new google.maps.LatLng(42.3581, -71.0636), // Center the map at Boston
	mapTypeId: google.maps.MapTypeId.ROADMAP
};
var me = new google.maps.LatLng(lat, lng);
var map;
var mywindow;
var marker;

var stop_markers = [];
var content_string = [];
var stop_counter = 0;
var infowindow = [];

var train_path = [];
var train_path2 = [];
var poly_line;
var poly_line2;
var poly_close;
var closest_path = [];
var closest;
var my_distance;
var found;

// Array of stops
var stops = [{"line":"blue", "name":"Bowdoin", "lat":42.361365, "lng":-71.062037},
		{"line":"blue", "name":"Government Center", "lat":42.359705, "lng":-71.05921499999999},
		{"line":"blue", "name":"State Street", "lat":42.358978, "lng":-71.057598},
		{"line":"blue", "name":"Aquarium", "lat":42.359784, "lng":-71.051652},
		{"line":"blue", "name":"Maverick", "lat":42.36911856, "lng":-71.03952958000001},
		{"line":"blue", "name":"Airport", "lat":42.374262, "lng":-71.030395},
		{"line":"blue", "name":"Wood Island", "lat":42.3796403, "lng":-71.02286539000001},
		{"line":"blue", "name":"Orient Heights", "lat":42.386867, "lng":-71.00473599999999},
		{"line":"blue", "name":"Suffolk Downs", "lat":42.39050067, "lng":-70.99712259}, 
  		{"line":"blue", "name":"Beachmont", "lat":42.39754234, "lng":-70.99231944},
		{"line":"blue", "name":"Revere Beach", "lat":42.40784254, "lng":-70.99253321},
  		{"line":"blue", "name":"Wonderland", "lat":42.41342, "lng":-70.991648},
  		{"line":"orange", "name":"Oak Grove", "lat":42.43668, "lng":-71.07109699999999},
  		{"line":"orange", "name":"Malden Center", "lat":42.426632, "lng":-71.07411},
  		{"line":"orange", "name":"Wellington", "lat":42.40237, "lng":-71.077082}, 
  		{"line":"orange", "name":"Sullivan", "lat":42.383975, "lng":-71.076994},
  		{"line":"orange", "name":"Community College", "lat":42.373622, "lng":-71.06953300000001},
  		{"line":"orange", "name":"North Station", "lat":42.365577, "lng":-71.06129},
  		{"line":"orange", "name":"Haymarket", "lat":42.363021, "lng":-71.05829},
  		{"line":"orange", "name":"State Street", "lat":42.358978, "lng":-71.057598},
  		{"line":"orange", "name":"Downtown Crossing", "lat":42.355518, "lng":-71.060225},
  		{"line":"orange", "name":"Chinatown", "lat":42.352547, "lng":-71.062752},
  		{"line":"orange", "name":"Tufts Medical", "lat":42.349662, "lng":-71.063917 },
  		{"line":"orange", "name":"Back Bay", "lat":42.34735, "lng":-71.075727},
  		{"line":"orange", "name":"Mass Ave", "lat":42.341512, "lng":-71.083423},
  		{"line":"orange", "name":"Ruggles", "lat":42.336377, "lng":-71.088961},
  		{"line":"orange", "name":"Roxbury Crossing", "lat":42.331397, "lng":-71.095451},
  		{"line":"orange", "name":"Jackson Square", "lat":42.323132, "lng":-71.099592},
  		{"line":"orange", "name":"Stony Brook", "lat":42.317062, "lng":-71.104248},
  		{"line":"orange", "name":"Green Street", "lat":42.310525, "lng":-71.10741400000001},
  		{"line":"orange", "name":"Forest Hills", "lat":42.300523, "lng":-71.113686},
  		{"line":"red", "name":"Alewife", "lat":42.395428, "lng":-71.142483},
  		{"line":"red", "name":"Davis", "lat":42.39674, "lng":-71.121815},
  		{"line":"red", "name":"Porter Square", "lat":42.3884, "lng":-71.11914899999999},
  		{"line":"red", "name":"Harvard Square", "lat":42.373362, "lng":-71.118956},
  		{"line":"red", "name":"Central Square", "lat":42.365486, "lng":-71.103802},
  		{"line":"red", "name":"Kendall/MIT", "lat":42.36249079, "lng":-71.08617653},
  		{"line":"red", "name":"Charles/MGH", "lat":42.361166, "lng":-71.070628 },
  		{"line":"red", "name":"Park Street", "lat":42.35639457, "lng":-71.0624242},
  		{"line":"red", "name":"Downtown Crossing", "lat":42.355518, "lng":-71.060225},
  		{"line":"red", "name":"South Station", "lat":42.352271, "lng":-71.05524200000001},
  		{"line":"red", "name":"Broadway", "lat":42.342622, "lng":-71.056967},
  		{"line":"red", "name":"Andrew", "lat":42.330154, "lng":-71.057655},
  		{"line":"red", "name":"JFK/UMass", "lat":42.320685, "lng":-71.052391},
  		{"line":"red", "name":"North Quincy", "lat":42.275275, "lng":-71.029583},
  		{"line":"red", "name":"Wollaston", "lat":42.2665139, "lng":-71.0203369},
  		{"line":"red", "name":"Quincy Center", "lat":42.251809, "lng":-71.005409},
  		{"line":"red", "name":"Quincy Adams", "lat":42.233391, "lng":-71.007153},
  		{"line":"red", "name":"Braintree", "lat":42.2078543, "lng":-71.0011385},
  		{"line":"red", "name":"Savin Hill", "lat":42.31129, "lng":-71.053331},
  		{"line":"red", "name":"Fields Corner", "lat":42.300093, "lng":-71.061667},
  		{"line":"red", "name":"Shawmut", "lat":42.29312583, "lng":-71.06573796000001},
  		{"line":"red", "name":"Ashmont", "lat":42.284652, "lng":-71.06448899999999}];

function initialize(){
	map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
	// Find my location
	locate_me();
}

function locate_me(){
	// Check if geolocation is available
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			// Get my location
			lat = position.coords.latitude;
			lng = position.coords.longitude;
			me = new google.maps.LatLng(lat, lng);
			marker = new google.maps.Marker({
				position: me,
				title: "You are here at " + lat + " " + lng + "."
			});
			marker.setMap(map);

			// Get the JSON and send it to a function
			xhr = new XMLHttpRequest();
			xhr.open("get", "http://mbtamap.herokuapp.com/mapper/rodeo.json", true); 
			xhr.onreadystatechange = data_ready;
			xhr.send(null)
		});
	} else {
		alert("Location services are not supported by your browser.")
	}
}

function data_ready(){
	if (xhr.readyState == 4 && xhr.status == 200) {
		// Parse the JSON and find the correct line
		schedule = JSON.parse(xhr.responseText);
		my_line = schedule["line"];
		draw_stations(my_line);
		draw_lines(my_line);
	}
}

function draw_stations(my_line){
	
	// Loop through the array of stops and add stops of the correct line to the map
	for (var i = 0; i < stops.length; i++){
		var stop_info;
		if (stops[i].line == my_line){
			stop_loc = new google.maps.LatLng(stops[i].lat, stops[i].lng)
			stop_markers.push(new google.maps.Marker({
				position: stop_loc,
				title: stops[i].name,
				icon: 'logo.png',
				animation: google.maps.Animation.DROP,
				index: stop_counter
			}));

			// Loop through the JSON schedule to find upcoming trains and put them in to a table
			stop_info = '<p>' + stops[i].name + '</p>' + '<table id="schedule"><tr><th>Direction</th><th>Next Train <br> mm:ss</th></tr>';
			for(var j = 0; j < schedule["schedule"].length; j++){
				for(var k = 0; k < schedule["schedule"][j].Predictions.length; k++){
					if(schedule["schedule"][j].Predictions[k]["Stop"] == stops[i].name){
						var time 
						if(schedule["schedule"][j].Predictions[k]["Seconds"]%60 < 10){
							time = Math.floor(schedule["schedule"][j].Predictions[k]["Seconds"] / 60) + ":" + "0" 
							+ Math.abs(schedule["schedule"][j].Predictions[k]["Seconds"]%60);
						} else {
							time = Math.floor(schedule["schedule"][j].Predictions[k]["Seconds"] / 60) + ":" 
							+ Math.abs(schedule["schedule"][j].Predictions[k]["Seconds"]%60);
						}
						stop_info += '<tr><td>' + schedule["schedule"][j]["Destination"] + '</td><td>' + time + '</td></tr>';
					}
				}
			}
			// Define an info window for each marker
			content_string.push(stop_info);
			stop_markers[stop_markers.length - 1].setMap(map);
			info = new google.maps.InfoWindow({
				content: content_string[stop_counter]
			});
			infowindow[stop_counter] = set_listener(stop_markers[stop_markers.length - 1], info);
			stop_counter++;
		}
	}

	
	// Calculate the closest stop
	find_closest();
}

function set_listener(marker, iw){
	google.maps.event.addListener(stop_markers[stop_counter], 'click', function() {
		iw.open(map, marker);
	});
}

function find_closest(){
	// Loop through the stops to find the closest to the user location
	closest = stop_markers[0];
	var distance = haversine(me.lat(), stop_markers[0].position.lat(), me.lng(), stop_markers[0].position.lng());
	for(var i = 0; i < stop_markers.length; i++){
		var compare = haversine(me.lat(), stop_markers[i].position.lat(), me.lng(), stop_markers[i].position.lng());
		if(compare < distance){
			distance = compare;
			closest = stop_markers[i];
		}
	}

	closest_path[0] = new google.maps.LatLng(me.lat(), me.lng());
	closest_path[1] = new google.maps.LatLng(closest.position.lat(), closest.position.lng());

	// Draw the line
	poly_close = new google.maps.Polyline({
		path: closest_path,
		geodesic: true,
		strokeColor: '#000000',
		strokeOpacity: 1.0,
		strokeWeight: 4
	});
	poly_close.setMap(map);

	distance = ((distance * 0.621371).toFixed(2)).toString();
	my_distance = distance;

	mywindow = new google.maps.InfoWindow({
		content: 'You are ' + my_distance + ' miles from the closest station.'
	});
	mywindow.open(map, marker);
}

function haversine(lat1, lat2, lon1, lon2){

	var R = 6371; // km
	var dLat = toRad(lat2 - lat1);
	var dLon = toRad(lon2 - lon1);
	var lat1 = toRad(lat1);
	var lat2 = toRad(lat2);

	var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
	var d = R * c;

	return d;
}

function toRad(num){
	// Convert number to radians
	return num * Math.PI / 180;
}

function draw_lines(my_line){
	var counter = 0;
	var color;
	if (my_line != 'red'){
		if (my_line == 'blue') {
			color = '#0000FF';
		} else if (my_line == 'orange'){
			color = '#FF6600';
		}

		// Loop through the stops and add stations to the points on the line
		for (var i = 0; i < stops.length; i++){
			if (stops[i].line == my_line){
				train_path[counter] = new google.maps.LatLng(stops[i].lat, stops[i].lng);
				counter++;
			}
		}

		// Draw the line
		poly_line = new google.maps.Polyline({
			path: train_path,
			geodesic: true,
			strokeColor: color,
			strokeOpacity: 1.0,
			strokeWeight: 6
		});
		poly_line.setMap(map);
	} else {
		// Split the red line in to 2 parts
		color = '#FF0000';

		// Draw the Braintree Red Line
		for (var i = 0; i < stops.length && stops[i].name != 'Savin Hill'; i++){
			if(stops[i].line == my_line){
				train_path[counter] = new google.maps.LatLng(stops[i].lat, stops[i].lng);
				counter++;
			}
		}

		poly_line = new google.maps.Polyline({
			path: train_path,
			geodesic: true,
			strokeColor: color,
			strokeOpacity: 1.0,
			strokeWeight: 6
		});
		poly_line.setMap(map);

		// Draw the Ashmont Red Line to JFK
		train_path2 = [
			new google.maps.LatLng(42.320685, -71.052391),
			new google.maps.LatLng(42.31129, -71.053331),
			new google.maps.LatLng(42.300093, -71.061667),
  			new google.maps.LatLng(42.29312583, -71.06573796000001),
  			new google.maps.LatLng(42.284652, -71.06448899999999)
  		];

		poly_line2 = new google.maps.Polyline({
			path: train_path2,
			geodesic: true,
			strokeColor: color,
			strokeOpacity: 1.0,
			strokeWeight: 6
		});
		poly_line2.setMap(map);
	}
}













