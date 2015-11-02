(function() {

  angular
    .module('app.services')
    .factory(WeatherService);

  WeatherService.$inject = ['$http'];

  function WeatherService($http) {

    return {

    };

  }
})();
