myApp.controller("MyProfilCtrl", ['$scope','$location','GetProfil','UpdProfFac','DelProfFac','UserAuthFactory',
function($scope,$location,GetProfil,UpdProfFac,DelProfFac,UserAuthFactory) {
  $scope.userProfil = [];

  GetProfil.getProf().then(function(data) {
    $scope.userProfil = data.data;
  });

  $scope.userUpt = {
  };

  $scope.subUpdate = function() {
    var password = $scope.userUpt.password;
    var nom = $scope.userUpt.nom;
    var prenom = $scope.userUpt.prenom;
    var adresse = $scope.userUpt.adresse;
    var tel = $scope.userUpt.tel;
    if (password !== undefined && nom !== undefined && prenom !== undefined && adresse !== undefined && tel !== undefined) {

      UpdProfFac.update(password, nom, prenom, adresse, tel).success(function(data) {
        $location.path("/profil");
      }).error(function(status) {
        alert('Invalid credentials');
      });
    } else {
      alert('Veuillez remplir tous les champs du formulaire');
    }
  };


  $scope.delProf = function()
  {
    DelProfFac.deleteProfil().success(function(data) {
      UserAuthFactory.logout();
      $location.path("/login");
    }).error(function(status) {
      alert('Invalid credentials');
    });

  };

}
]);
