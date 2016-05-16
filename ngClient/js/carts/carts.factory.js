myApp.factory('MyCarts', function($http, APPLINK) {
  var urlBase = APPLINK+'/api/v1/carts/';
  var _cartsFactory = {};

  _cartsFactory.getCarts = function() {
    return $http.get(urlBase);
  };

  return _cartsFactory;
});

myApp.factory('DelCartFact', function($http, APPLINK) {
  return {
    deleteCart: function(id) {
      return $http.delete(APPLINK+'/api/v1/cart/'+id);
    }
  }
});

myApp.factory('CreateCartFact', function($http, APPLINK) {
  return {
    create: function(numero, titulaire, pictogramme, banque, date) {
      return $http.post(APPLINK+'/api/v1/cart', {
        numero: numero,
        date: date,
        titulaire: titulaire,
        pictogramme: pictogramme,
        banque: banque
      });
    }
  }
});
