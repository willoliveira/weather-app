(function() {

  angular
    .module('app.services')
    .factory('ConfigService', ConfigService);

  ConfigService.$inject = ['$http'];

  function ConfigService() {
    return {
      //api reverse location
      URL_REVERSE_LOCATION: 'http://maps.googleapis.com/maps/api/geocode/json',
      //api weather
      URL_GET_TEMP: 'http://developers.agenciaideias.com.br/tempo/json/',
      //api list geo name (continents, countries and cities)
      URL_GEO_NAME: 'http://www.geonames.org/childrenJSON?'
    };
  }
})();
