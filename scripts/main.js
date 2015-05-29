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
    var mapOptions = {
        center: {lat: latitude, lng: longitude},
        zoom: 15
    };
    map = new google.maps.Map(document.getElementById('map-canvas'),
        mapOptions);
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
        'icons/yellow-dot.png'];

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

    $('.check').change(
        function () {
            var color = parseInt(this.value);
            for (var i = 0; i < N; i++) {
                if (locations[i].color == color) {
                    allMarkers[i].setVisible(this.checked)
                }
            }
        }
    );

    $('#selectAll').click(
        function () {
            var checked = this.checked;
            $('.check').each(function () {
                this.checked = checked;
            });
            for (var i = 0; i < N; i++) {
                allMarkers[i].setVisible(this.checked)
            }
        });
}

google.maps.event.addDomListener(window, 'load', getCurrentPosition);
