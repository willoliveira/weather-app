(function() {

  angular
    .module('app.services')
    .factory('GeoNameService', GeoNameService);

  GeoNameService.$inject = ['$http', '$q', 'ConfigService'];

  function GeoNameService ($http, $q, ConfigService) {

    var
      service =  {
        getGeoName: getGeoName
      };

    return service;

    function getGeoName(geoId) {
      return $http
        .get('http://www.geonames.org/childrenJSON?geonameId=' + geoId);
    }
  }
})();
