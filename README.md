# weather-app
Aplicativo feito em Phonegap com o framework [Ionic](http://ionicframework.com/).
Aplicativo foi desenvolvido com objetivo de estudo da tecnologia, ele consulta uma base de dados pública para mostrar a previsão do tempo.

Para o desenvolvimento, utizei a seguinte algumas API's, essa abaixo foi para consulta do tempo/clima:
[http://developers.agenciaideias.com.br/tempo/](http://developers.agenciaideias.com.br/tempo/)

Para buscar os estados e cidades, foi esta:
[http://www.geonames.org/](http://www.geonames.org/)

## Instruções de instalação do app

Instanlando o ionic e o cordova.
```
npm install ionic cordova -g
```

Dentro da pasta app do projeto, é preciso instalar as dependências do projeto.
```
npm install
bower install
```

Também na pasta app, é possivel testar a aplicação no browser usando o seguinte comando.
```
ionic serve
```

Testando no android
```
ionic build android
ionic run android
```
