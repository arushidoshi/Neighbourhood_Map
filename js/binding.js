// Whole-script strict mode syntax
"use strict";

// Marker object consisting of title and marker.
var Marker = function(data) {
	this.title = ko.observable(data.title);
	this.marker = ko.observable(data.marker);
};

var ViewModel = function() {
	var self = this;
	// markerList() is an array of Marker objects.
	this.markerList = ko.observableArray([]);
	locations.forEach(function(oneMarker) {
		self.markerList.push(new Marker(oneMarker));
	});

	// To get the clicked marker and in-turn trigger the onclick event in map.js.
    this.getMarker = function(clickedMarker) {
        if (clickedMarker) {
            google.maps.event.trigger(markers[clickedMarker.title()], "click");
        }
    };

	// Computed observable from Knockout which filters locations and markers based on input.
	this.filter = ko.observable("");
	// Filter Function for filtering based on Knockout's computed observable.
    this.filterLoc = ko.computed(function() {
		var filter = self.filter().toLowerCase();
		if (markerPin) {
			if (!filter) {  // Set all markers to visible if no filter.
				for (var i = 0; i < self.markerList().length; i++) {
					self.markerList()[i].marker.setVisible(true);
				}
				return self.markerList();
			} else {
				return ko.utils.arrayFilter(self.markerList(), function(item) {
					var result = item.title().toLowerCase().startsWith(filter);
					if (result) {
						if (item.marker) {  // Set all markers in result to visible.
							item.marker.setVisible(true);
						}
					} else {
						if (item.marker) {  // Set all other markers to invisible.
							item.marker.setVisible(false);
						}
					}
					return result;
				});
			}
		} else {
			return self.markerList();
		}
	});
};

// Creating ViewModel and applying bindings.
var viewModel = new ViewModel();
ko.applyBindings(viewModel);