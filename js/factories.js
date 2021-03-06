function getLocations($http) {
  return function (success, fail) {
    $http.get('locations.json')
      .then(success, fail);
  };
}

function compHeading() {
  return function (lat1, long1, lat2, long2) {
    return 105 + Math.atan2(lat1 - lat2, long2 - long1) * 180 / Math.PI;
  };
}

angular.module('xplaneMap')

  .factory('getLocations', getLocations)
  .factory('compHeading', compHeading)
  .constant('BOISE_LAT', 43.558467)
  .constant('BOISE_LNG', -116.202134);