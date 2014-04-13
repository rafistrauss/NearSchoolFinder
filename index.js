var schools = {"results": [{"zip": 13329, "lon": -74.7759, "lat": 43.1022, "city": "Dolgeville", "gsid": 3600001, "name": "James A Green High School", "state": "NY", "street": "38 Slawson St", "country": "US"}, {"zip": 13329, "lon": -74.7759, "lat": 43.1022, "city": "Dolgeville", "gsid": 3600002, "name": "Dolgeville Elementary School", "state": "NY", "street": "38 Slawson St", "country": "US"}, {"zip": 13456, "lon": -75.2534, "lat": 42.9885, "city": "Sauquoit", "gsid": 3600003, "name": "Sauquoit Valley High School", "state": "NY", "street": "2601 Oneida St", "country": "US"}, {"zip": 13456, "lon": -75.2534, "lat": 42.9885, "city": "Sauquoit", "gsid": 3600004, "name": "Sauquoit Valley Elementary School", "state": "NY", "street": "2601 Oneida St", "country": "US"}, {"zip": 13456, "lon": -75.2534, "lat": 42.9885, "city": "Sauquoit", "gsid": 3600005, "name": "Sauquoit Valley Middle School", "state": "NY", "street": "2601 Oneida St", "country": "US"}, {"zip": 13684, "lon": -75.1283, "lat": 44.3609, "city": "Russell", "gsid": 3600006, "name": "Edwards-Knox Elementary School", "state": "NY", "street": "2512 County Hwy 24", "country": "US"}, {"zip": 12303, "lon": -73.953, "lat": 42.7755, "city": "Schenectady", "gsid": 3600008, "name": "Draper Middle School", "state": "NY", "street": "2070 Curry Rd", "country": "US"}, {"zip": 11713, "lon": -72.9432, "lat": 40.7596, "city": "Bellport", "gsid": 3600020, "name": "Bellport Middle School", "state": "NY", "street": "35 Kreamer St", "country": "US"}, {"zip": 14572, "lon": -77.6028, "lat": 42.563, "city": "Wayland", "gsid": 3600038, "name": "Wayland Elementary School", "state": "NY", "street": "2350 Rt 63", "country": "US"}, {"zip": 13054, "lon": -75.6772, "lat": 43.1273, "city": "Durhamville", "gsid": 3600045, "name": "Durhamville School", "state": "NY", "street": "5462 Main St", "country": "US"}], "meta": {"code": 200}};
schools = schools.results;
	

$(document).ready(function() {
	
	//function to only allow numbers to be enterred into zip code field
	$("#zipcodeEntry").keydown(function(event) {
		// Allow: backspace, delete, tab, escape, and enter
		if (event.keyCode == 46 || event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 27 || event.keyCode == 13 ||
		// Allow: Ctrl+A
		(event.keyCode == 65 && event.ctrlKey === true) ||
		// Allow: home, end, left, right
		(event.keyCode >= 35 && event.keyCode <= 39)) {
			// let it happen, don't do anything
			return;
		} else {
			// Ensure that it is a number and stop the keypress
			if (event.shiftKey || (event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105 )) {
				event.preventDefault();
			}
		}
	});
	
	$('#getSchools').on('click', function() {
		var zip = $('#zipcodeEntry').val();
		getLatLong(zip);
	});
	
	// var o = getLatLong(10134);
	// o = o.postalCodes;
	// var lat = o.lat;
	// var lon = o.lon;
	// console.log(lat + lon);
	
		

});

function getLatLong(zip) {
	// var request = 'http://api.geonames.org/postalCodeSearchJSON?postalcode='+ zip + '&maxRows=1&username=rafistrauss';
	var url = 'http://api.geonames.org/postalCodeSearchJSON';
	$.post(url, {
		postalcode : zip,
		maxRows : 1,
		username : 'rafistrauss' 
	}, function(data) {
		// console.log(data.postalCodes);
		// console.log(data);
		var lat = data.postalCodes[0].lat;
		var lon = data.postalCodes[0].lng;
		console.log(data);
		// console.log(data.postalCodes[0]);
		displayResults(findClosestSchools(lat, lon));
	});
}

function displayResults(closestSchools) {
	$('#resultsTable > tbody').html("");
	$.each(closestSchools, function(i,v) {
		var disp = '<tr>';
		disp += '<td>' + v.name + '</td>';
		disp += '<td>' + v.street + ', ' + v.city + ', ' + v.state +', ' + v.zip + '</td>';
		disp += '<td>' +  (v.distance/1.609).toFixed(0) + '</td>';
		disp += '</tr>';
		$('#resultsTable').append(disp);
	});
}

function findClosestSchools(lat, lon) {
	console.log("Lat: " + lat + ', Long: ' + lon);
	var schoolDistances = new Array();
	var closestSchools = [];
	
	$.each(schools, function(i, v) {
		schoolDistances.push(new Array(i, getDistance(lat, lon, v.lat, v.lon)));
	});
	
	schoolDistances.sort(function(a,b) {
		return a[1]-b[1];
	});
	
	console.log(schoolDistances);
	
	for(var i = 0; i < 3; i++) {
		schools[schoolDistances[i][0]]['distance'] =  schoolDistances[i][1];
		closestSchools.push(schools[schoolDistances[i][0]]);
	}
	
	return closestSchools;
	
}

//This function from here: http://stackoverflow.com/questions/27928/how-do-i-calculate-distance-between-two-latitude-longitude-points/21623206#21623206
function getDistance(lat1, lon1, lat2, lon2) {
  var R = 6371;
  var a = 
     0.5 - Math.cos((lat2 - lat1) * Math.PI / 180)/2 + 
     Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
     (1 - Math.cos((lon2 - lon1) * Math.PI / 180))/2;

  return R * 2 * Math.asin(Math.sqrt(a));
}


