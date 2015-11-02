(function () {

  angular
    .module('app.controllers')
    .controller('WeatherController', WeatherController);

  WeatherController.$inject = ['$scope', '$timeout', 'GeolocationService', 'localStorageService', '$ionicSlideBoxDelegate', '$ionicModal'];

  function WeatherController($scope, $timeout, GeolocationService, localStorageService, $ionicSlideBoxDelegate, $ionicModal) {

    var
      locationParams,
      locationName = "",
      modalSelect;

    //$scope.Temp = [];
    $scope.Temp = {};

    function init() {

      $ionicSlideBoxDelegate.enableSlide(false);

      //Get location params in local storage
      locationParams = localStorageService.get("location");
      if (locationParams)
        GeolocationService.getReverseLocation(locationParams).then(parseLocation);
      //loadWeather(locationParams);

      $ionicModal.fromTemplateUrl('views/modal-select.html', { scope: $scope }).then(function(modal) {
        modalSelect = modal;
      });
    }

    $scope.openModal = function() {
      modalSelect.show();
    };

    $scope.closeModal = function() {
      modalSelect.hide();
    };

    function parseLocation(response) {
      var arr = response.data.results;
      //formatted_address: "Bauru, Bauru - SP, Brasil"
      //Varre o array de informacoes da localizacao
      address:
      for (var contAddress = 0; contAddress < arr.length; contAddress++) {
        //Verifica os tipos da localizacao
        for (var contType = 0; contType < arr[contAddress].types.length; contType++) {
          //Se for locality, ele tera os parametros que preciso
          if (arr[contAddress].types[contType].indexOf("locality") > -1) {
            var cache = arr[contAddress].formatted_address;
            locationName = cache.split(',')[1].replace(/\s/g, '');
            localStorageService.set("locationName", locationName);
            //Carrega os dados referente ao tempo
            loadWeather(locationName);
            break address;
          }
        }
      }
    }

    function loadWeather(locationName) {
      GeolocationService
        .getTemp(locationName)
        .then(configureData);
    }

    function configureData(response) {
      //pega a data
      //$scope.Temp.push(response.data);
      $scope.Temp = response.data;
      var
        //index = $scope.Temp.indexOf(response.data);//,
        dateCache = $scope.Temp;
      //Tranforma o dia atual em date
      dateCache.agora.data_hora = new Date($scope.Temp.agora.data_hora.replace(/\//g, "-").replace(/\s/g, ""));
      for (var cont = 0; cont < dateCache.previsoes.length; cont++) {
        //Tranforma o dia das previsões em date
        var date = dateCache.previsoes[cont].data.replace(/\//g, "-").replace(/\s/g, "");
        dateCache.previsoes[cont].data = new Date(date);
      }
      console.log($scope.Temp)
    }

    // trigger init when the view is ready
    $timeout(init, 0);

    localStorageService.get();
  }

})();
