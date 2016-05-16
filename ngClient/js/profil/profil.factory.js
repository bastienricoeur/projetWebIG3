myApp.factory('GetProfil', function($http, APPLINK) {
  var urlBase = APPLINK+'/api/v1/user';
  var _profFactory = {};

  _profFactory.getProf = function() {
    return $http.get(urlBase);
  };

  return _profFactory;
});

myApp.factory('UpdProfFac', function($http, APPLINK) {
  return {
    update: function(password, nom, prenom, adresse, tel) {
      return $http.put(APPLINK+'/api/v1/user', {
        password: password,
        nom: nom,
        prenom: prenom,
        adresse: adresse,
        telephone: tel
      });
    }
  }
});

myApp.factory('DelProfFac', function($http, APPLINK) {
  return {
    deleteProfil: function() {
      return $http.delete(APPLINK+'/api/v1/user');
    }
  }
});
