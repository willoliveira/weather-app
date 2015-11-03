(function() {

  angular
    .module('app.services')
    .factory('AlertService', AlertService);

  AlertService.$inject = ['$ionicPopup'];
  // <ion-spinner icon="spiral"></ion-spinner>
  function AlertService($ionicPopup) {
    service = {
      spinner: {
        start: start,
        stop: stop
      }
    };

    return service;
/*
    $ionicPopup.show({
      title: 'Enter Wi-Fi Password',
      subTitle: 'Please use normal things'
    });

    var alertPopup = $ionicPopup.alert({
      title: 'Don\'t eat that!',
      template: 'It might taste good'
    });
    alertPopup.then(function(res) {
      console.log('Thank you for not eating my delicious ice cream cone');
    });
*/
    function start() {

    }

    function stop() {

    }
  }
})();
