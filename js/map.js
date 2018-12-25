var map;
var marker;
var markers = {};
var infoWindowContent;
var markerPin = false;

// Defining map styles.
var styles = [
    {
        "featureType": "administrative.country",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "administrative.country",
        "elementType": "geometry",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "color": "#eace9e"
            }
        ]
    },
    {
        "featureType": "administrative.country",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "hue": "#ff0000"
            }
        ]
    },
    {
        "featureType": "administrative.country",
        "elementType": "labels",
        "stylers": [
            {
                "color": "#ad8f5a"
            }
        ]
    },
    {
        "featureType": "administrative.province",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "simplified"
            },
            {
                "color": "#b77510"
            }
        ]
    },
    {
        "featureType": "administrative.locality",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "simplified"
            },
            {
                "color": "#876118"
            }
        ]
    },
    {
        "featureType": "administrative.neighborhood",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "administrative.land_parcel",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "weight": "4"
            },
            {
                "hue": "#ffa900"
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "geometry",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "landscape.natural",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "landscape.natural.landcover",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "landscape.natural.landcover",
        "elementType": "geometry",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "landscape.natural.terrain",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "poi.attraction",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "poi.business",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "poi.government",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "poi.medical",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "poi.place_of_worship",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "poi.school",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "poi.sports_complex",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road.highway.controlled_access",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "color": "#86bcc4"
            }
        ]
    }
];

// Map initialize function which is called on load.
function initMap() {
    // New map object created and centered on the current location defined in data.js.
    map = new google.maps.Map(document.getElementById('map'), {
      center: current_location,
      zoom: 7,
      styles: styles,
      mapTypeControl: false
    });

    // Centers the map on to the current location with each resize
    google.maps.event.addDomListener(window, 'resize', function() {
        map.setCenter(current_location);
    });

    // Two icon options defined for map markers.
    var defaultIcon = {
        url: "img/closed_book.png",
        scaledSize: new google.maps.Size(50, 50),
        labelOrigin:  new google.maps.Point(25,60),
    };
    var highlightedIcon = {
        url: "img/open_book.png",
        scaledSize: new google.maps.Size(50, 50),
        labelOrigin:  new google.maps.Point(25,60),
    };

    // InfoWindow object created.
    var largeInfowindow = new google.maps.InfoWindow();
    var bounds = new google.maps.LatLngBounds();

    // The following group uses the location array to create an array of markers on initialize.
    for (var i = 0; i < locations.length; i++) {
        // Create a marker per location, and put into markers array.
        var marker = new google.maps.Marker({
            // Get the position from the location array.
            position: locations[i].location,
            title: locations[i].title,
            map: map,
            label: locations[i].title,
            icon: defaultIcon,
            animation: google.maps.Animation.DROP,
            id: i
        });
        // Add another field to marker for storing book ISBN information.
        marker.book = locations[i].book;

        // Extend bounds and fit map based on marker position.
        bounds.extend(marker.position);
        map.fitBounds(bounds);

        // Push the marker to dictionary of markers.
        markers[marker.title] = marker;

        // Create an onclick event to open change marker symbol and 
        // open an infowindow at each marker.
        marker.addListener('click', function() {
            this.setIcon(highlightedIcon);
            populateInfoWindow(this, largeInfowindow);
        });

        // Add marker to the viewModel's markerList for viewModel processing.
        viewModel.markerList()[i].marker = marker;
    }

    // Set markerPin to ensure that all markers have been pinned to the map.
    markerPin = true;

    // This function will populate the infowindow with content from Google Books API.
    function populateInfoWindow(marker, infowindow) {
        infowindow.marker = marker;
        infoWindowContent = "<h1 id='header'>Popular in " + marker.title + "</h1></div>";
        var url = "https://www.googleapis.com/books/v1/volumes?q="+marker.book;
        $.ajax({
                url: url,
                dataType: "json"
            }).done(function (response) {
                console.dir(response);
                var author = response.items[0].volumeInfo.authors[0];
                var title = response.items[0].volumeInfo.title;
                var imageUrl = response.items[0].volumeInfo.imageLinks.thumbnail;

                infoWindowContent = infoWindowContent.concat("<div><p id='content'>Book name: "+title+"</p>");
                infoWindowContent = infoWindowContent.concat("<p id='content'>Author: "+author+"</p>");
                infoWindowContent = infoWindowContent.concat("<img id='img' src=\""+imageUrl+"\"></div>");
                infoWindowContent = infoWindowContent.concat("<p id='content'>Source: <a href=\"https://books.google.com/\">books.google.com</a></p>")
                infowindow.setContent(infoWindowContent);
                infowindow.open(map, marker);
            }).fail(function (jqXHR, textStatus) {
                console.log(jqXHR);
                console.log(textStatus);
                var content = "<p>Error - Cannot connect to OpenLibrary! Please check your connection or try again later</p></div></div>";
                infoWindowContent = infoWindowContent.concat(content);
                infowindow.setContent(infoWindowContent);
                infowindow.open(map, marker);
            });
        
        // Make sure the marker symbol is set to default if the infowindow is closed.
        infowindow.addListener('closeclick',function(){
            marker.setIcon(defaultIcon);
            infowindow.close();
        });
    }
}