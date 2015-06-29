var N;
var latitude = 44.873773;
var longitude = -91.927094;
var locations = [];
var map;



function getCurrentPosition() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(setPosition);
    } else {
        console.warn('Geolocation failed');
        initialize();
    }
}

function setPosition(position) {
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
    initialize();
}

function initialize() {
    var isChrome = /Chrome/.test(navigator.userAgent);
    if (!isChrome) alert("This application requires the Chrome browser.");
    
    
    var mapOptions = {
        center: {lat: latitude, lng: longitude},
        zoom: 15
    };
    map = new google.maps.Map(document.getElementById('map-canvas'),
        mapOptions);
        
    var infowindow = new google.maps.InfoWindow();
    
    // map search box
    var searchinput = /** @type {HTMLInputElement} */(
      document.getElementById('pac-input'));
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(searchinput);
    var searchBox = new google.maps.places.SearchBox(
    /** @type {HTMLInputElement} */(searchinput));
    
    google.maps.event.addListener(searchBox, 'places_changed', function() {
      var places = searchBox.getPlaces();
      if (places.length == 0) {
        return;
      }
      var place = places[0];
      if (!place.geometry) {
         window.alert("Autocomplete's returned place contains no geometry");
         return;
      }
      if (place.geometry.viewport) {
        map.fitBounds(place.geometry.viewport);
      } else {
        var loc = place.geometry.location;
        map.setCenter(loc);
        $('#latitude').val(loc.A.toFixed(6));
        $('#longitude').val(loc.F.toFixed(6));
        $('#placename').val(searchinput.value);
      }
      
      
    });

    var input = document.getElementById('placename');
    var autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.bindTo('bounds', map);
    
    google.maps.event.addListener(autocomplete, 'place_changed', function() {
       infowindow.close();
       var place = autocomplete.getPlace();
       if (!place.geometry) {
         window.alert("Autocomplete's returned place contains no geometry");
         return;
       }
       if (place.geometry.viewport) {
         map.fitBounds(place.geometry.viewport);
       } else {
         map.setCenter(place.geometry.location);
       }
       var loc = place.geometry.location;
       $('#latitude').val(loc.A.toFixed(6));
       $('#longitude').val(loc.F.toFixed(6));
    });
    getMarkers();

    var selector = document.querySelector('core-selector');

    selector.addEventListener('core-select', function(e) {
       var selected = selector.selected;
       // console.log('selected ', selected);
       // console.log('locations ', locations);
       for (var i = 0; i < N; i++) {
          var visible = false;
          if ($.inArray(locations[i].color, selected) > -1)
             visible = true;
          allMarkers[i].setVisible(visible);
       }
    });
}

function getMarkers() {
    $.ajax({
        type: 'GET', url: 'list', success: setMarkers,
        error: function(jqXHR, exception) {
            if (jqXHR.status === 0) {
                alert('Not connect.n Verify Network.');
            } else if (jqXHR.status == 404) {
                alert('Requested page not found. [404]');
            } else if (jqXHR.status == 500) {
                alert('Internal Server Error [500].');
            } else if (exception === 'parsererror') {
                alert('Requested JSON parse failed.');
            } else if (exception === 'timeout') {
                alert('Time out error.');
            } else if (exception === 'abort') {
                alert('Ajax request aborted.');
            } else {
                alert('Uncaught Error.n' + jqXHR.responseText);
            }
        }
    });
}

var icons = ['icons/blue-dot.png',
             'icons/ltblue-dot.png',
             'icons/pink-dot.png',
             'icons/red-dot.png',
             'icons/green-dot.png',
             'icons/orange-dot.png',
             'icons/purple-dot.png',
             'icons/yellow-dot.png',
             'icons/blue-pushpin.png'];

var allMarkers = [];
    
function pushMarker (location, visible) {
    // console.log('pushMarker');
    var marker = new google.maps.Marker({
        position: {lat: location.latitude, lng: location.longitude},
        icon: icons[location.color]
    });
    marker.setMap(map);
    marker.setVisible(visible);
    allMarkers.push(marker);
}

function setMarkers(loc) {
    locations = loc;
    locations.forEach(function (location) {pushMarker(location, false);});
    // console.log('locations = ', locations);
    N = allMarkers.length;
    if (N == 0) {
        console.warn('No markers');
    } else {
        // console.log(N + ' markers');
    }
}

function submit() {
    lat = parseFloat($('#latitude').val());
    lng = parseFloat($('#longitude').val());
    color = parseInt($('select').val());
    notes = $('#notes').val();
    if (color >= 0) {
        data = {latitude: lat, longitude: lng, amenity: color, notes: notes};
        $.post("/add", data);
        pushMarker(data, true);
        N = N + 1;
        var latlng = new google.maps.LatLng(lat, lng);
        map.setCenter(latlng);
        // $('#addData').hide(250);
        google.maps.event.trigger(map, 'resize');
    }
    clearForm();
}
$('#submit').click(submit);

function clearForm() {
   $('#latitude').val('');
   $('#longitude').val('');
   $('#notes').val('');
   $('#placename').val('');
}
   

function toggle() {
    var collapse = document.querySelector('core-collapse');
    collapse.toggle();
}

function showAll() {
    var selector = document.querySelector('core-selector');
    selector.selected = ["", 0, 1, 2, 3, 4, 5, 6, 7, 8];
    // for (var i = 0; i < N; i++)
    //   allMarkers[i].setVisible(true);

}

// $('#selectAmenities').click(toggle);

google.maps.event.addDomListener(window, 'load', getCurrentPosition);
