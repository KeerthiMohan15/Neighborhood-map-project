var map;
var markers = [];
var marker;

var myplaces = [{
    title: 'Chottanikkara Temple',
    location: {
        lat: 9.933126,
        lng: 76.391356
    }, // latitude and longitude
    img: 'img/chottanikkara.png',
}, {
    title: 'Ernakulam Shiva Temple',
    location: {
        lat: 9.969106,
        lng: 76.288631
    },
    img: 'img/ErnakulamShivaTemple.png',
}, {
    title: 'Sree Poornathrayeesa Temple',
    location: {
        lat: 9.945009,
        lng: 76.342226
    },
    img: 'img/poornathrayeeshatemple.png',
}, {
    title: 'Hill Palace',
    location: {
        lat: 9.952639,
        lng: 76.363914
    },
    img: 'img/hillpalace.png',
}, {
    title: 'Marine Drive',
    location: {
        lat: 9.98258,
        lng: 76.275427
    },
    img: 'img/marinedrive.png',
}, {
    title: 'Mattancherry Palace',
    location: {
        lat: 9.958275,
        lng: 76.259349
    },
    img: 'img/mattancherypalace.png',
}, {
    title: "LuLu Mall",
    location: {
        lat: 10.027054,
        lng: 76.308079
    },
    img: 'img/lulu.png',
}];

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 9.9816358,
            lng: 76.2998842
        },
        zoom: 12
    });
    getmymarkers();
}

//Initiating the markers and calling the infowindow to open on them.Also fixing the boundary.
function getmymarkers() {
    var myInfowindow = new google.maps.InfoWindow();
    var bounds = new google.maps.LatLngBounds();
    // The following group uses the location array to create an array of markers on initialize.
    for (var i = 0; i < myplaces.length; i++) {
        // Get the position from the location array.
        var position = myplaces[i].location;
        var title = myplaces[i].title;
        var img = myplaces[i].img;
        // Create a marker per location, and put into markers array.
        marker = new google.maps.Marker({
            map: map,
            position: position,
            title: title,
            img: img,
            animation: google.maps.Animation.DROP,
            id: i,
        });
        // Push the marker to our array of markers.
        markers.push(marker);
        // Create an onclick event to open an infowindow at each marker.
        marker.addListener('click', function() {
            populateInfoWindow(this, myInfowindow);
        });
        bounds.extend(markers[i].position);
    }
    // Extend the boundaries of the map for each marker
    map.fitBounds(bounds);
}

// This function populates the infowindow when the marker is clicked. We'll only allow
// one infowindow which will open at the marker that is clicked, and populate based
// on that markers position.
function populateInfoWindow(marker, infowindow) {
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
        infowindow.setContent('<div>' + marker.title + '</div><br>' + '<img src="' + marker.img + '" alt="Image of ' + marker.title + '"><br>' + '<div id="wikipedia-links"></div>');
        infowindow.marker = marker;
        infowindow.open(map, marker);
        // Make sure the marker property is cleared if the infowindow is closed.
        infowindow.addListener('closeclick', function() {
            infowindow.marker = null;
        });
    }

    // load wikipedia data and append to the infowindow
    var $mylink = $('#wikipedia-links');
    var wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + marker.title + '&format=json&callback=wikiCallback';
    var wikiRequestTimeout = setTimeout(function() {
        $mylink.text("Failed to get wikipedia resources");
    }, 8000);

    $.ajax({
        url: wikiUrl,
        dataType: "jsonp",
        //jsonp:"callback",
        success: function(response) {
            var wikiList = response[1];
            for (var i = 0; i < wikiList.length; i++) {
                wikiStr = wikiList[i];
                var url = 'http://en.wikipedia.org/wiki/' + wikiStr;
                $mylink.append('<li><a href=" ' + url + ' ">' + wikiStr + '</a></li>');
            };
            clearTimeout(wikiRequestTimeout);
        }
    });
};

// If Google Map alerts its failure to load
var Alert = function() {
    alert('Failed to load!!');
};

//NavBar
jQuery(function($) {
    $('.menu-btn').click(function() {
        $('.responsive-menu').toggleClass('expand')
    })
})