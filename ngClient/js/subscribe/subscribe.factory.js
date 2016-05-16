myApp.factory('SubscribeUser', function($http, APPLINK) {
  return {
    sub: function(username, password, nom, prenom, adresse, tel) {
      return $http.post(APPLINK+'/subscribe', {
        username: username,
        password: password,
        nom: nom,
        prenom: prenom,
        adresse: adresse,
        telephone: tel
      });
    }
  }
});
