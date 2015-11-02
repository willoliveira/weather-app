(function () {

  angular
    .module('app.controllers')
    .controller('WeatherController', WeatherController);

  WeatherController.$inject = ['$scope', '$timeout', 'GeolocationService', 'GeoNameService', 'localStorageService', '$animate', '$ionicModal'];

  function WeatherController($scope, $timeout, GeolocationService, GeoNameService, localStorageService, $animate,   $ionicModal) {
    var
      locationParams,
      locationName = "",
      modalSelect;

    /*public vars*/
    $scope.currentIndex = 0;
    $scope.countries = null;
    $scope.cities = {};
    $scope.citySelect = {};
    $scope.geo = {country: "", city: ""};
    //Armazenando os dados da temperatura
    //$scope.Temp = {};
    $scope.Temp = [];

    /*public function*/
    $scope.openModal = openModal;
    $scope.closeModal = closeModal;
    $scope.loadComboGeo = loadComboGeo;
    $scope.updateWeather = updateWeather;

    $scope.teste = function(elem) {
      if ($scope.Temp.length == 1)
        $animate.off('enter');
      console.log(elem);
    };

    /* init */
    function init() {
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
      //feche a modal
      $scope.closeModal();
      //feche a modal
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
      var t;
      //cache
      t = response.data;
      //Tranforma o dia atual em date
      t.agora.data_hora = new Date(t.agora.data_hora.replace(/\//g, "-").replace(/\s/g, ""));
      for (var cont = 0; cont < t.previsoes.length; cont++) {
        //Tranforma o dia das previsões em date
        var date = t.previsoes[cont].data.replace(/\//g, "-").replace(/\s/g, "");
        t.previsoes[cont].data = new Date(date);
      }
      //Adiciona no array
      $scope.Temp.push(response.data);
      //seta o index atual
      $scope.currentIndex = $scope.Temp.length - 1;

      console.log($scope.Temp);
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
