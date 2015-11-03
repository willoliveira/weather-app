(function() {

  angular
    .module('app.services')
    .factory('GeolocationService', GeolocationService);

  GeolocationService.$inject = ['$http', '$q', 'ConfigService'];

  function GeolocationService ($http, $q, ConfigService) {

    var
      deferred,
      service =  {
        get: get,
        getReverseLocation: getReverseLocation,
        getWeather: getWeather
      };

    return service;

    function get() {
      deferred = $q.defer();
      //Pega a localização
      navigator.geolocation.getCurrentPosition(getLocationSucess, getLocationError);

      return deferred.promise;
    }
      function getLocationSucess(location) {
        deferred.resolve({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          accuracy: location.coords.accuracy
        });
      }

      function getLocationError() {
        deferred.reject("error");
      }

    function getReverseLocation(param) {
      return $http
        .get(ConfigService.URL_REVERSE_LOCATION + '?latlng='+ param.latitude +',' + param.longitude + '&sensor=true');
    }

    function getWeather(param) {
      return $http
        .get(ConfigService.URL_GET_TEMP + param);
    }

  }
})();
