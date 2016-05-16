myApp.controller('LoginCtrl', ['$scope', '$window', '$location', 'UserAuthFactory', 'AuthenticationFactory','CreateCommandeFact',
function($scope, $window, $location, UserAuthFactory, AuthenticationFactory,CreateCommandeFact) {
  $scope.user = {
  };
  $scope.login = function() {
    var username = $scope.user.username;
    var password = $scope.user.password;
    if (username !== undefined && password !== undefined) {

      UserAuthFactory.login(username, password).success(function(data) {

        AuthenticationFactory.isLogged = true;

        $window.sessionStorage.token = data.token;

        var date=new Date();
        CreateCommandeFact.insert(date).then(function(data) {
          $scope.comStore=data.data.data;
          $window.sessionStorage.com=$scope.comStore.id;
        });

        $location.path("/");
      }).error(function(status) {
        alert('Erreur de mot de passe ou d\'identifiant');
      });
    } else {
      alert('Veuillez remplir tous les champs du formulaire');
    }
  };
}
]);
