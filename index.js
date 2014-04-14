var schools = {
	"results" : [{
		"zip" : 13329,
		"lon" : -74.7759,
		"lat" : 43.1022,
		"city" : "Dolgeville",
		"gsid" : 3600001,
		"name" : "James A Green High School",
		"state" : "NY",
		"street" : "38 Slawson St",
		"country" : "US"
	}, {
		"zip" : 13329,
		"lon" : -74.7759,
		"lat" : 43.1022,
		"city" : "Dolgeville",
		"gsid" : 3600002,
		"name" : "Dolgeville Elementary School",
		"state" : "NY",
		"street" : "38 Slawson St",
		"country" : "US"
	}, {
		"zip" : 13456,
		"lon" : -75.2534,
		"lat" : 42.9885,
		"city" : "Sauquoit",
		"gsid" : 3600003,
		"name" : "Sauquoit Valley High School",
		"state" : "NY",
		"street" : "2601 Oneida St",
		"country" : "US"
	}, {
		"zip" : 13456,
		"lon" : -75.2534,
		"lat" : 42.9885,
		"city" : "Sauquoit",
		"gsid" : 3600004,
		"name" : "Sauquoit Valley Elementary School",
		"state" : "NY",
		"street" : "2601 Oneida St",
		"country" : "US"
	}, {
		"zip" : 13456,
		"lon" : -75.2534,
		"lat" : 42.9885,
		"city" : "Sauquoit",
		"gsid" : 3600005,
		"name" : "Sauquoit Valley Middle School",
		"state" : "NY",
		"street" : "2601 Oneida St",
		"country" : "US"
	}, {
		"zip" : 13684,
		"lon" : -75.1283,
		"lat" : 44.3609,
		"city" : "Russell",
		"gsid" : 3600006,
		"name" : "Edwards-Knox Elementary School",
		"state" : "NY",
		"street" : "2512 County Hwy 24",
		"country" : "US"
	}, {
		"zip" : 12303,
		"lon" : -73.953,
		"lat" : 42.7755,
		"city" : "Schenectady",
		"gsid" : 3600008,
		"name" : "Draper Middle School",
		"state" : "NY",
		"street" : "2070 Curry Rd",
		"country" : "US"
	}, {
		"zip" : 11713,
		"lon" : -72.9432,
		"lat" : 40.7596,
		"city" : "Bellport",
		"gsid" : 3600020,
		"name" : "Bellport Middle School",
		"state" : "NY",
		"street" : "35 Kreamer St",
		"country" : "US"
	}, {
		"zip" : 14572,
		"lon" : -77.6028,
		"lat" : 42.563,
		"city" : "Wayland",
		"gsid" : 3600038,
		"name" : "Wayland Elementary School",
		"state" : "NY",
		"street" : "2350 Rt 63",
		"country" : "US"
	}, {
		"zip" : 13054,
		"lon" : -75.6772,
		"lat" : 43.1273,
		"city" : "Durhamville",
		"gsid" : 3600045,
		"name" : "Durhamville School",
		"state" : "NY",
		"street" : "5462 Main St",
		"country" : "US"
	}],
	"meta" : {
		"code" : 200
	}
};


schools = schools.results;

$(document).ready(function() {

	//Function to only allow numbers to be entered into zip code field. 
	$("#zipcodeEntry").keydown(function(event) {
		// Allow: backspace, delete, tab, escape, and enter
		if (event.keyCode == 46 || event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 27 || event.keyCode == 13 ||
		// Allow: Ctrl+A and Ctrl+V
		((event.keyCode == 65 || event.keyCode == 86) && event.ctrlKey === true) ||
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
	
	// Deprecated - add click listener to button to begin searching for closest schools	
	// $('#getSchools').on('click', function() {
		// var zip = $('#zipcodeEntry').val();
		// getLatLong(zip);
	// });
	
	// Add listener if user adds input. If zip code is proper length, pass to function to retrieve latitude/longitude 	
	$('#zipcodeEntry').on('input', function() {
		var zip = $('#zipcodeEntry').val();
		
		$('#zipcodeEntry').removeClass('errorBox successBox');
		if(zip.length == 5) {
			getLatLong(zip);
		}
	});

	
});

//Get current browser/phone location 
function getLocation() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(useDeviceLocation);
	}
	else {
		alert("Didn't work");
	}
}

// Pass current location to main function 
function useDeviceLocation(position) {
	getClosestSchools(position.coords.latitude, position.coords.longitude);
}

// Get latitude & longitude for this zip. Uses free geocoding provided by geonames 
function getLatLong(zip) {
	load(); // Show loading animation (Pacman!)
	var url = 'http://api.geonames.org/postalCodeSearchJSON';
	$.post(url, {
		postalcode : zip,
		country : 'US',
		maxRows : 1,
		username : 'rafistrauss'
	}, function(data) {
		if(typeof data.postalCodes[0] == "undefined") { //Returned value doesn't have the information we need
			endLoad(); //Hide loading animation
			$('#zipcodeEntry').addClass('errorBox'); 
			return false;
		}
		var lat = data.postalCodes[0].lat;
		var lon = data.postalCodes[0].lng;

		getClosestSchools(lat, lon); //Get closest school to the provided latitude and longitude

	});
}

/**
 * Get the closest schools to the input location and display them to the user
 * 
 * @param {float} lat Latitude of user-input location
 * @param {float} lon Longitude of user-input location
 */

function getClosestSchools(lat, lon) {
	displayResults(findClosestSchools(lat, lon)); 

}

/**
 * Display the 3 closest schools
 * 
 * @param {Array} closestSchools The 3 closest schools to input location
 */
function displayResults(closestSchools) {
	$('#resultsTable > tbody').html("");
	$.each(closestSchools, function(i, v) {
		var disp = '<tr>';
		disp += '<td>' + v.name + '</td>';
		disp += '<td>' + v.street + ', ' + v.city + ', ' + v.state + ', ' + v.zip + '</td>';
		disp += '<td>' + (v.distance / 1.609).toFixed(0) + ' miles </td>'; 	//"How 		far 	is 		a 		kilometer?"
		disp += '</tr>';
		$('#resultsTable').append(disp);
	});
	endLoad();
	$('#zipcodeEntry').addClass('successBox');
	
}


/**
 * @param {float} lat Latitude of user-input location
 * @param {float} lon Longitude of user-input location
 * @return {Array} The three closest schools to the input location
 */
function findClosestSchools(lat, lon) {
	
	var schoolDistances = new Array();
	var closestSchools = [];

	$.each(schools, function(i, v) { 		//Iterate through each school and get its distance from input location
		schoolDistances.push(new Array(i, getDistance(lat, lon, v.lat, v.lon)));
	});

	schoolDistances.sort(function(a, b) {	//Sort school by distance. For large data sets, it would be worth optimizing this function
		return a[1] - b[1];					//by limiting schoolDistances to a maximum of 3 elements and adding/replacing elements if the current
	});										//element is less than any in schoolDistances.  

	

	for (var i = 0; i < 3; i++) {			//Retrieve the 3 closest schools
		schools[schoolDistances[i][0]]['distance'] = schoolDistances[i][1];
		closestSchools.push(schools[schoolDistances[i][0]]);
	}

	return closestSchools;

}


/**
 * This function from here: http://stackoverflow.com/questions/27928/how-do-i-calculate-distance-between-two-latitude-longitude-points/21623206#21623206 
 * @param {float} lat1 First latitude point
 * @param {float} lon1 First longitude point
 * @param {float} lat2 Second latitude point
 * @param {float} lon2 Second longitude point
 */
function getDistance(lat1, lon1, lat2, lon2) {
	var R = 6371;
	var a = 0.5 - Math.cos((lat2 - lat1) * Math.PI / 180) / 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * (1 - Math.cos((lon2 - lon1) * Math.PI / 180)) / 2;

	return R * 2 * Math.asin(Math.sqrt(a));
}

/**
 * Show loading animation (waka waka waka) 
 */

function load() {
	$('#loadingIcon').attr('src', 'loading.gif');
}

/**
 * End loading animation 
 */

function endLoad() {
	$('#loadingIcon').attr('src', '');
}
