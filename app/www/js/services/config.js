(function() {

  angular
    .module('app.services')
    .factory('ConfigService', ConfigService);

  ConfigService.$inject = ['$http'];

  function ConfigService() {
    return {
      URL_REVERSE_LOCATION: 'http://maps.googleapis.com/maps/api/geocode/json',
      URL_GET_TEMP: 'http://developers.agenciaideias.com.br/tempo/json/'
    };
  }
})();
