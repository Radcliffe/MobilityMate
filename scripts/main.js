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
    console.log(navigator.userAgent);
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
        $('#latitude').val(loc.A.toFixed(7));
        $('#longitude').val(loc.F.toFixed(7));
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
       $('#latitude').val(loc.A.toFixed(7));
       $('#longitude').val(loc.F.toFixed(7));
    });
    getMarkers();
}

function getMarkers() {
    $.ajax({
        type: 'GET', url: 'list', success: setMarkers
    })
}

function setMarkers(result) {
    locations = result;
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

    locations.forEach(function (location) {
        var marker = new google.maps.Marker({
            position: {lat: location.latitude, lng: location.longitude},
            icon: icons[location.color]
        });
        marker.setMap(map);
        marker.setVisible(false);
        allMarkers.push(marker);
    });

    N = allMarkers.length;

//    $('.check').change(
//        function () {
//            var color = parseInt(this.value);
//            for (var i = 0; i < N; i++) {
//                if (locations[i].color == color) {
//                    allMarkers[i].setVisible(this.checked)
//                }
//            }
//        }
//    );

//    $('#selectAll').click(
//        function () {
//            var checked = this.checked;
//            $('.check').each(function () {
//                this.checked = checked;
//            });
//            for (var i = 0; i < N; i++) {
//                allMarkers[i].setVisible(this.checked)
//            }
//    });
    
    var selector = document.querySelector('core-selector');

    selector.addEventListener('core-select', function(e) {
        var selected = selector.selected;
        for (var i = 0; i < N; i++) {
           var visible = false;
           if ($.inArray(locations[i].color, selected) > -1)
              visible = true;
           allMarkers[i].setVisible(visible);
        }
    });
}

function toggle() {
    var collapse = document.querySelector('core-collapse');
    collapse.toggle();
}

google.maps.event.addDomListener(window, 'load', getCurrentPosition);
