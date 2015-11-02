
(function() {

  angular
    .module('WeatherApp')
    .config(Config);

  Config.$inject = ['localStorageServiceProvider'];

  function Config(localStorageServiceProvider) {
    localStorageServiceProvider
      // set prefix to local storage
      .setPrefix('WeatherApp')
      // set local storage
      .setStorageType('localStorage');
  }

})();
