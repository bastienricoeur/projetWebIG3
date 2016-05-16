myApp.factory('ListProducts', function($http,$window, APPLINK) {
  var urlBase = APPLINK+'/api/v1/products/';
  var _productsFactory = {};
  _productsFactory.getProducts = function() {
    return $http.get(urlBase);
  };

  return _productsFactory;
});

myApp.factory('DetailProdFact', function($http, APPLINK) {
  var _detailsFactory = {};
  _detailsFactory.getDetails = function(numero) {
    return $http.get(APPLINK+'/api/v1/product/'+numero);
  };
  return _detailsFactory;
});

myApp.factory('TypesProduct', function($http, APPLINK) {
  var urlBase = APPLINK+'/api/v1/prodtypes/';
  var _typesFactory = {};

  _typesFactory.getTypes = function() {
    return $http.get(urlBase);
  };

  return _typesFactory;
});

myApp.factory('CreateProdFact', function($http, APPLINK) {
  return {
    insert: function(nom, desc, prix, nbexemp, img, typeart) {
      return $http.post(APPLINK+'/api/v1/admin/product/', {
        nom: nom,
        description: desc,
        prix: prix,
        nbExemplaire: nbexemp,
        img: img,
        typeart: typeart
      });
    }
  }
});

myApp.factory('UpdateProdFact', function($http, APPLINK) {
  return {
    update: function(id,nom, desc, prix, nbexemp, img, typeart) {
      return $http.put(APPLINK+'/api/v1/admin/product/'+id, {
        nom: nom,
        description: desc,
        prix: prix,
        nbExemplaire: nbexemp,
        img: img,
        typeart: typeart
      });
    }
  }
});

myApp.factory('UpdateQteFact', function($http, APPLINK) {
  return {
    updatequantite: function(id,qte) {
      return $http.put(APPLINK+'/api/v1/admin/product/qte/'+id, {
        quantite: qte
      });
    }
  }
});
