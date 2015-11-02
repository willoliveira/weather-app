(function () {

  angular
    .module('WeatherApp')
    .config(Route);

  Route.$inject = ['$stateProvider', '$urlRouterProvider'];

  function Route($stateProvider, $urlRouterProvider) {

    $stateProvider


      .state('home', {
        url: "/home",
        views: {
          viewPrincipal: {
            templateUrl: "views/home.view.html",
            controller: 'HomeController'
          }
        }
      })

      .state("weather", {
        url: "/weather",
        views: {
          viewPrincipal: {
            templateUrl: "views/weather.view.html",
            controller: "WeatherController"
          }
        }
      });

    $urlRouterProvider.otherwise('home');
  }
})();
