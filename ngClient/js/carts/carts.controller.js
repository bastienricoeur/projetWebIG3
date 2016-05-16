myApp.controller("CartsCtrl", ['$scope','$window','$location','MyCarts','DelCartFact','CreateCartFact',
function($scope,$window,$location,MyCarts,DelCartFact,CreateCartFact) {
  $scope.carts = [];

  MyCarts.getCarts().then(function(data) {
    $scope.carts = data.data.data;
  });

  $scope.deleteCB = function(id) {
    DelCartFact.deleteCart(id).success(function(data) {
      $window.location.reload();
    }).error(function(status) {
      alert('Invalid credentials');
    });
  };

  $scope.createCB = function() {
    var numero = $scope.newCB.numeroCB;
    var titulaire = $scope.newCB.titulaire;
    var pictogramme = $scope.newCB.pictogramme;
    var banque = $scope.newCB.banque;
    var date = $scope.newCB.date;
    if (numero !== undefined && titulaire !== undefined && pictogramme !== undefined && banque !== undefined && date !== undefined) {

      CreateCartFact.create(numero, titulaire, pictogramme, banque, date).success(function(data) {
        $location.path("/mycarts");
      }).error(function(status) {
        alert('Invalid credentials');
      });
    } else {
      alert('Veuillez remplir tous les champs du formulaire');
    }
  };
}
]);
