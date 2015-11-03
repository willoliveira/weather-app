(function() {

  angular
    .module('app.controllers')
    .controller('HomeController', HomeController);

  HomeController.$inject = ['$scope', '$timeout', '$state','GeolocationService', 'localStorageService'];

  function HomeController($scope, $timeout) {

    function init() { }
    // trigger init when the view is ready
    $timeout(init, 0);
  }
})();
