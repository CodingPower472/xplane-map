function LocationsController($scope, getLocations, $location) {
  $scope.locations = [];
  
  var onLocations = function (data) {
    $scope.locations = data.data;
  };
  
  var fail = function (data) {
    console.error('Error retreiving content with error code ' + data.status);
  };
  
  getLocations(onLocations, fail);
  
  $scope.random = function () {
    var min = 0;
    var max = $scope.locations.length - 1;
    var rand = chance.integer({
      min: min,
      max: max
    });
    console.log('/locs/' + rand);
    $location.path('/locs/' + rand);
  };
  
}

function LocationController($scope, $routeParams, getLocations, $http, compHeading, $timeout) {
  
  var id = parseInt($routeParams.id);
  
  var onLocations = function (data) {
    var locations = data.data;
    console.log(locations);
    locations.forEach(function (location, i) {
      if (i === id) {
        console.log(location);
        $scope.location = location;
        if (location.lat && location.lng) {
          cb(location.lat, location.lng);
        } else {
          console.log(google.maps.Geocoder);
          var geocoder = new google.maps.Geocoder();
          
          var callCb = function (obj) {
            if (status === google.maps.GeocoderStatus.OK) {
              var lat = results[0].geometry.location.lat();
              var lng = results[0].geometry.location.lng();
              cb(lat, lng);
            }
          };
          
          geocoder.geocode({
            address: location.city + ', ' + location.state + ' Airport'
          }, callCb);
          
        }
      }
    });
  };
  
  var getMap = function (lat, lng) {
    
    var mapElem = document.getElementById('map');
    console.log(mapElem);
    var map = new google.maps.Map(mapElem, {
      center: {
        lat: lat,
        lng: lng
      },
      zoom: 4
    });
    
    var BOISE_LAT = 43.558467;
    var BOISE_LNG = -116.202134;

    var coords = [
      {
        lat: BOISE_LAT,
        lng: BOISE_LNG
      }
    ];
    
    if ($scope.location.paths) {
      $scope.location.paths.forEach(function (path, i) {
        coords.push(path);
        if (i === $scope.location.paths.length - 1) {
          var nextPath = {
            lat: $scope.location.lat,
            lng: $scope.location.lng
          };
        } else {
          var nextPath = $scope.location.paths[i + 1];
        }
        
        console.log(google.maps);
        
        var heading = compHeading(path.lat, path.lng, nextPath.lat, nextPath.lng);
        
        heading = Math.round(heading);
        
        new google.maps.Marker({
          position: {
            lat: path.lat,
            lng: path.lng
          },
          map: map,
          label: 'F',
          title: 'Final Approach, new heading ' + heading
        });
      });
    }
    
    coords.push({
      lat: lat,
      lng: lng
    });
    
    var path = new google.maps.Polyline({
      path: coords,
      geodesic: true,
      strokeColor: '#0eacff',
      strokeWeight: 8
    });

    path.setMap(map);
    
    if ($scope.location.paths && $scope.location.paths.length > 0) {
      console.log($scope.location.paths[0]);
      var nextLat = $scope.location.paths[0].lat;
      var nextLng = $scope.location.paths[0].lng;
    } else {
      var nextLat = $scope.location.lat;
      var nextLng = $scope.location.lng;
    }
    
    console.log(nextLat, nextLng);
    
    var heading = compHeading(BOISE_LAT, BOISE_LNG, nextLat, nextLng);
    console.log(BOISE_LAT, BOISE_LNG, nextLat, nextLng);
    
    heading = Math.round(heading);
    
    $timeout(function () {
      alert('ALERT: You have flown for 1 hour.  Cost is now $5.00');
    }, 3600000);
    
    var boisePointer = new google.maps.Marker({
      position: {
        lat: BOISE_LAT,
        lng: BOISE_LNG
      },
      map: map,
      label: 'A',
      title: 'Boise Airport, follow heading ' + heading
    });
    
    var destPointer = new google.maps.Marker({
      position: {
        lat: lat,
        lng: lng
      },
      map: map,
      label: 'B',
      title: $scope.location.city + ', ' + $scope.location.state
    });
    
  };
  
  var cb = function (lat, lng) {
    getMap(lat, lng);
  };
  
  var fail = function (data) {
    console.error('Error retrieving content with error code ' + data.status);
  };
  
  getLocations(onLocations, fail);
}

angular.module('xplaneMap')

  .controller('LocationsController', LocationsController)
  .controller('LocationController', LocationController);