myApp.controller("CommandeCtrl", ['$scope','$window','$location','MyCarts','PanierFact','FactureFact',
function($scope,$window,$location,MyCarts,PanierFact,FactureFact) {

  $scope.optcarts=[];

  MyCarts.getCarts().then(function(data) {
    $scope.optcarts = data.data.data;
  });

  $scope.contCom=[];
  $scope.total;
  PanierFact.getPanier($window.sessionStorage.com).then(function(data) {
    $scope.contCom = data.data.data;
    var total = 0;
    for(var i = 0; i < $scope.contCom.relationships.length; i++){
        var product = $scope.contCom.relationships[i];
        total += ($scope.contCom.relationships[i].quantite * $scope.contCom.relationships[i].attribute.prix);
    }
    $scope.total=total;
  });





  $scope.newFact={};


  $scope.newFact=function()
  {
    var adresse=$scope.newFact.adresse;
    var cb=$scope.newFact.cb.id;
    if (adresse !== undefined && cb !== undefined) {

      FactureFact.insert($window.sessionStorage.com,cb,adresse).success(function(data) {

        $location.path("/final");
      }).error(function(status) {
        alert('Invalid credentials');
      });
    } else {
      alert('Veuillez remplir tous les champs du formulaire');
    }
  };


}

]);
