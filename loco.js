/* 
Filename: loco.js
Author: Clare Frances Lee looking at Eni's code
Due Date: Feb 27, 2015
Purpose: Implements the map and fb login mechanism for locoloco.html page

Honor Code Statement:
The code was all written by me (looking at notes and solutions)
*/

var myLocations=[];

function statusChangeCallback(response) {
    console.log('statusChangeCallback');
    console.log(response);
    // The response object is returned with a status field that lets the
    // app know the current login status of the person.
    // Full docs on the response object can be found in the documentation
    // for FB.getLoginStatus().
    if (response.status === 'connected') {
      // Logged into your app and Facebook.
      testAPI();
    } else if (response.status === 'not_authorized') {
      // The person is logged into Facebook, but not your app.
      document.getElementById('status').innerHTML = 'Please log ' +
        'into this app.';
    } else {
      // The person is not logged into Facebook, so we're not sure if
      // they are logged into this app or not.
      document.getElementById('status').innerHTML = 'Please log ' +
        'into Facebook.';
    }
  }

  // This function is called when someone finishes with the Login
  // Button.  See the onlogin handler attached to it in the sample
  // code below.
  function checkLoginState() {
    FB.getLoginStatus(function(response) {
      statusChangeCallback(response);
    });
  }

  window.fbAsyncInit = function() {
  FB.init({
    appId      : '1569756589961991',
    cookie     : true,  // enable cookies to allow the server to access 
                        // the session
    xfbml      : true,  // parse social plugins on this page
    version    : 'v2.3' // use version 2.3
  });


  FB.getLoginStatus(function(response) {
    statusChangeCallback(response);
  });

  };

  // Load the SDK asynchronously
  (function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));


  function testAPI() {
    console.log('Welcome!  Fetching your information.... ');
    FB.api('/me', function(response) {
      console.log('Successful login for: ' + response.name);
      document.getElementById('status').innerHTML =
        'Thanks for logging in, ' + response.name + '!';
    });
      
    FB.api('/me/tagged_places', function (response) {
	console.log("Getting tagged places..");
    console.log(myLocations);
	for (var i in response.data) {
        
		var temp = {'id': response.data[i].place.name, 'latLong':{lat:response.data[i].place.location.latitude, 
		long:response.data[i].place.location.longitude},'created':response.data[i].created_time};
		myLocations.push(temp);	
	
		}
	});
  }





//Map variable as a global variable so it can be accessed by other functions
var mapOptions = {
          center: { lat: 42.2932434, lng: -71.3031685},
          zoom: 8,
		  mapTypeId:'roadmap'};

var map = new google.maps.Map(document.getElementById('map-canvas'),
            mapOptions);


function putMarkers(myMap) {
	console.log('Putting Markers...');
		var bounds = new google.maps.LatLngBounds();
		for (var i in myLocations){
			var place = myLocations[i];
			var loc = new google.maps.LatLng(place.latLong.lat, place.latLong.long);           
			var infowindow = new google.maps.InfoWindow({
				 content: "I visited "+ place.id + " on " + place.created.substring(0,9)
				 }); 
			var marker = new google.maps.Marker({
				position: loc,
				title: place.name,
				myinfowindow: infowindow,
				animation: google.maps.Animation.DROP
			});
            
            
			google.maps.event.addListener(marker, 'click', function () 
				{this.myinfowindow.open(map, this)
                map.setZoom(10);})
			bounds.extend(loc);
			marker.setMap(myMap);		 
		}

		myMap.fitBounds(bounds);
	}	

 google.maps.event.addListener(map, 'click', function() {
     //click map to zoom out
     
     map.setZoom(2);
 });



document.getElementById('on-click-button').onclick = function() {
	putMarkers(map);
}
