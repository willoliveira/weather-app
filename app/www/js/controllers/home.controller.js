(function() {

  angular
    .module('app.controllers')
    .controller('HomeController', HomeController);

  HomeController.$inject = ['$scope', '$timeout', '$state','GeolocationService', 'localStorageService'];

  function HomeController($scope, $timeout, $state, GeolocationService, localStorageService) {

    function init() {
      GeolocationService.get()
        .then(function(location) {
          //Salva a localização em local storage
          localStorageService.set("location", location);
          //manda eles para a pagina do weather
          $state.go('weather');
        }, function(errorMessage) {
          console.log(errorMessage);
        });
    }
    // trigger init when the view is ready
    $timeout(init, 0);
  }
})();
