myApp.controller('SignupCtrl', ['$scope', '$location', 'SubscribeUser',
function($scope, $location, SubscribeUser) {
  $scope.usersub = {
  };
  $scope.signup = function() {
    var username = $scope.usersub.username;
    var password = $scope.usersub.password;
    var nom = $scope.usersub.nom;
    var prenom = $scope.usersub.prenom;
    var adresse = $scope.usersub.adresse;
    var tel = $scope.usersub.tel;
    if (username !== undefined && password !== undefined && nom !== undefined && prenom !== undefined && adresse !== undefined && tel !== undefined) {

        SubscribeUser.sub(username, password, nom, prenom, adresse, tel).success(function(data) {

        $location.path("/login");
      }).error(function(status) {
        alert('Invalid credentials');
      });
    } else {
      alert('Veuillez remplir tous les champs du formulaire');
    }
  };
}
]);
