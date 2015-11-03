(function () {

  angular
    .module('app.controllers')
    .controller('WeatherController', WeatherController);

  WeatherController.$inject = ['$scope', '$timeout', 'GeolocationService', 'GeoNameService', 'localStorageService', '$ionicModal'];

  function WeatherController($scope, $timeout, GeolocationService, GeoNameService, localStorageService,  $ionicModal) {
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
    $scope.errorConexao = false;
    //Armazenando os dados da temperatura
    $scope.weather = [];

    /*public function*/
    $scope.openModal = openModal;
    $scope.closeModal = closeModal;
    $scope.loadComboGeo = loadComboGeo;
    $scope.updateWeather = updateWeather;
    $scope.setWidth = setWidth;
    /* init */
    function init() {
      //Get location params in local storage
      locationParams = localStorageService.get("location");
      //Se eu ja tiver a localização
      if (locationParams)
        GeolocationService
          .getReverseLocation(locationParams)
          .then(parseLocation, errorRequest);
      else
        loadWeather('Acrelandia-Acre');
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
      //
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


    function setWidth (elem, num) {
      var scroll = document.querySelectorAll(".previsoes .scroll");
      for (var cont = 0; cont < scroll.length; cont++) {
        scroll[cont].style.width = num * 132 + "px";
      }
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
        .getWeather(locationName)
        .then(configureData, errorRequest);
    }
    /**
     *
     * @param response
     */
    function configureData(response) {
      //seta erro de conexao como false
      $scope.errorConexao = false;
      if (!response.data || response.data.erro) {
        alert("cidade não encontrada");
        return;
      }
      var w, dateStr = "";
      //cache
      w = response.data;
      //Tranforma o dia atual em date
      dateStr = w.agora.data_hora.match(/[\d][\d]{1,}/g);
      w.agora.data_hora = new Date(dateStr[2], dateStr[1] - 1, dateStr[0]);
      for (var cont = 0; cont < w.previsoes.length; cont++) {
        //Tranforma o dia das previsões em date
        console.log(w.previsoes[cont].data, w.previsoes[cont].data.match(/[\d][\d]{1,}/g))
        var date = w.previsoes[cont].data.match(/[\d][\d]{1,}/g);
        w.previsoes[cont].data = new Date(date[2], date[1] - 1, date[0]);
      }
      //Adiciona no array
      $scope.weather.push(response.data);
      //Guarda em localStorage
      localStorageService.set("weather", response.data);
      //seta o index atual
      $scope.currentIndex = $scope.weather.length - 1;
    }
    /**
     *
     */
    function initCombo() {
      if (!$scope.countries)
        loadComboGeo('countries', 3469034);
    }

    function errorRequest(response) {
      var weather = localStorageService.get("weather");
      if (weather) {
        $scope.errorConexao = false;
        $scope.weather.push(weather);
      } else
        $scope.errorConexao = true;

    }

    // trigger init when the view is ready
    $timeout(init, 0);

    localStorageService.get();
  }

})();
