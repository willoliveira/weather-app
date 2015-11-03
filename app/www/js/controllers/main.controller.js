(function () {

  angular
    .module('app.controllers')
    .controller('DefaultController', DefaultController);

  DefaultController.$inject = ['$scope', '$timeout', '$state', 'localStorageService', 'GeolocationService'];

  function DefaultController($scope, $timeout, $state, localStorageService, GeolocationService) {

    function init() {

      GeolocationService.get()
        .then(function(location) {
          //Salva a localização em local storage
          localStorageService.set("location", location);
          //manda eles para a pagina do weather
          $state.go('weather');
        }, function(errorMessage) {
          console.log(errorMessage);
          $state.go('weather');
        });

      //if (!localStorageService.get("location"))
        //$state.go("home");
    }
    // trigger init when the view is ready
    $timeout(init, 0);
  }

})();
