myApp.factory('CreateCommandeFact', function($http, APPLINK) {
    var _newcomFactory = {};

    _newcomFactory.insert= function(date) {
      return $http.post(APPLINK+'/api/v1/commande/', {
        date: date
      });
    }
    return _newcomFactory;
});


myApp.factory('CreateContenuFact', function($http, APPLINK) {
    return {
      insert: function(numerocom,numeroart,qte) {
        return $http.post(APPLINK+'/api/v1/contenucommande/', {
          numerocom: numerocom,
          numeroart: numeroart,
          quantite: qte
        });
      }
    }
});


myApp.factory('PanierFact', function($http, APPLINK) {
    var _panierFactory = {};

    _panierFactory.getPanier= function(id) {
      return $http.get(APPLINK+'/api/v1/commande/'+id);
    }
    return _panierFactory;
});

myApp.factory('FactureFact', function($http, APPLINK) {
    return{
      insert: function(numerocom,cb,adresse) {
        return $http.post(APPLINK+'/api/v1/facture/', {
          numerocom: numerocom,
          numerocb: cb,
          adresseLivraison: adresse
        });
      }
    }
});
