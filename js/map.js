// Whole-script strict mode syntax
"use strict";

var map;
var marker;
var markers = {};
var markerAnimation = [];
var infoWindowContent;
var currentMarker = null;
var infowindowopen = null;
var markerPin = false;

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

    // Hide any open infowindows or marker animation if filter is activated.
    document.getElementById("filter").addEventListener("click", function(){
      if(infowindowopen) {
        currentMarker.setAnimation(null);
        currentMarker.setIcon(defaultIcon);
        infowindowopen.close();
      }
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
            class: i
        });
        // Add another field to marker for storing book ISBN information.
        marker.book = locations[i].book;

        // Extend bounds and fit map based on marker position.
        bounds.extend(marker.position);
        map.fitBounds(bounds);

        // Push the marker to dictionary of markers.
        markers[marker.title] = marker;
        markerAnimation.push(marker);

        // Create an onclick event to open change marker symbol and 
        // open an infowindow at each marker.
        marker.addListener('click', function() {
            for (var i = 0; i < markerAnimation.length; i++) {
                markerAnimation[i].setAnimation(null);
                markerAnimation[i].setIcon(defaultIcon);
            }
            toggleBounce(this);
            currentMarker = this;
            populateInfoWindow(this, largeInfowindow);
        });

        // Add marker to the viewModel's markerList for viewModel processing.
        viewModel.markerList()[i].marker = marker;
    }
    // Set markerPin to ensure that all markers have been pinned to the map.
    markerPin = true;

    function toggleBounce(marker) {
        if (marker.getAnimation() !== null) {
          marker.setAnimation(null);
          marker.setIcon(defaultIcon);
        } else {
          marker.setAnimation(google.maps.Animation.BOUNCE);
          marker.setIcon(highlightedIcon);
        }
    }

    // This function will populate the infowindow with content from Google Books API.
    function populateInfoWindow(marker, infowindow) {
        infowindow.marker = marker;
        infoWindowContent = "<h1 class='header'>Popular in " + marker.title + "</h1></div>";
        var infoWindowContent1 = "";
        var infoWindowContent2 = "";
        var url1 = "https://openlibrary.org/search.json?q="+marker.book;
        var url2 = "https://www.googleapis.com/books/v1/volumes?q="+marker.book;
        var ajax1 = $.ajax({ 
          dataType: "json",
          url: url1
        }).done(function (response) {
                console.dir(response);
                var author = response.docs[0].author_name[0];
                var title = response.docs[0].title_suggest;
                console.log(author);

                infoWindowContent1 = infoWindowContent1.concat("<div><p class='content'>Book name: "+title+"</p>");
                infoWindowContent1 = infoWindowContent1.concat("<p class='content'>Author: "+author+"</p>");
        }).fail(function (jqXHR, textStatus) {
                console.log(jqXHR);
                console.log(textStatus);
                var content = "<p>Error - Cannot connect to Google Books! Please check your connection or try again later</p></div></div>";
                infoWindowContent1 = infoWindowContent1.concat(content);
        });
 
        var ajax2 = $.ajax({ 
          dataType: "json",
          url: url2
        }).done(function (response) {
                console.dir(response);
                var imageUrl = response.items[0].volumeInfo.imageLinks.thumbnail;

                infoWindowContent2 = infoWindowContent2.concat("<img class='img' src=\""+imageUrl+"\"></div>");
                infoWindowContent2 = infoWindowContent2.concat("<p class='content'>Sources: <br><a href=\"https://books.google.com/\">books.google.com</a><br><a href=\"https://openlibrary.org/\">openlibrary.org</a></p>"); 
        }).fail(function (jqXHR, textStatus) {
                console.log(jqXHR);
                console.log(textStatus);
                var content = "<p>Error - Cannot connect to OpenLibrary! Please check your connection or try again later</p></div></div>";
                infoWindowContent2 = infoWindowContent2.concat(content);
        });

        $.when( ajax1 , ajax2  ).done(function( a1, a2 ) {
            infoWindowContent = infoWindowContent.concat(infoWindowContent1);
            infoWindowContent = infoWindowContent.concat(infoWindowContent2);
            infowindow.setContent(infoWindowContent);
            infowindowopen = infowindow;
            infowindow.open(map, marker);
        }); 
        
        // Make sure the marker symbol is set to default if the infowindow is closed.
        infowindow.addListener('closeclick',function(){
            infowindowopen = null;
            marker.setAnimation(null);
            marker.setIcon(defaultIcon);
            infowindow.close();
        });
    }
}