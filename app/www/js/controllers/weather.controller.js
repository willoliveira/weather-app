(function () {

  angular
    .module('app.controllers')
    .controller('WeatherController', WeatherController);

  WeatherController.$inject = ['$scope', '$timeout', 'GeolocationService', 'GeoNameService', 'localStorageService', '$ionicSlideBoxDelegate', '$ionicModal'];

  function WeatherController($scope, $timeout, GeolocationService, GeoNameService, localStorageService, $ionicSlideBoxDelegate, $ionicModal) {

    var
      locationParams,
      locationName = "",
      modalSelect;

      $scope.countries = null;
      $scope.cities = {};
      $scope.citySelect = {};

      $scope.geo = {country: "", city: ""};

    $scope.openModal = openModal;
    $scope.closeModal = closeModal;
    $scope.loadComboGeo = loadComboGeo;
    $scope.updateWeather = updateWeather;


    //Armazenando os dados da temperatura
    $scope.Temp = {};

    /* init */
    function init() {
      //Tira o slide do slide box
      $ionicSlideBoxDelegate.enableSlide(false);
      //Get location params in local storage
      locationParams = localStorageService.get("location");

      //Pega os estados salvos
      //$scope.countries = localStorageService.get("countries");

      //Se eu ja tiver a localização
      if (locationParams) GeolocationService.getReverseLocation(locationParams).then(parseLocation);
      //Pega o template da modal
      $ionicModal.fromTemplateUrl('views/modal-select.html', { scope: $scope }).then(function(modal) {
        modalSelect = modal;
      });
    }

    /**
     * public functions
     */

    /**
     *
     */
    function openModal() {
      $scope.geo = {country: "", city: ""};
      modalSelect.show();
      //
      initCombo();
    }
    /**
     *
     */
    function closeModal() {
      modalSelect.hide();
    }
    /**
     *
     * @param name
     * @param geoId
     */
    function loadComboGeo(name, geoId) {
      //Se ja possuir os estados ou as cidades
      if ((name == 'cities' && $scope[name][geoId]) ||
        (name == 'countries' && $scope[name])) {
        return;
      }
      GeoNameService.getGeoName(geoId).then(function(response) {
        var data = response.data;
        if (name == 'cities') {
          if ($scope[name][geoId]) $scope[name][geoId] = {};
          $scope[name][geoId] = data;
        }
        else $scope[name] = data;
      });
    }

    /**
     *
     */
    function updateWeather() {
      $scope.closeModal();
      loadWeather($scope.geo.city.name + "-" + $scope.geo.country.name);
    }

    /**
     * private functions
     *
     */

    /**
     *
     * @param response
     */
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
    /**
     *
     * @param locationName
     */
    function loadWeather(locationName) {
      GeolocationService
        .getTemp(locationName)
        .then(configureData);
    }
    /**
     *
     * @param response
     */
    function configureData(response) {
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
    /**
     *
     */
    function initCombo() {
      if (!$scope.countries) loadComboGeo('countries', 3469034);
    }

    // trigger init when the view is ready
    $timeout(init, 0);

    localStorageService.get();
  }

})();
