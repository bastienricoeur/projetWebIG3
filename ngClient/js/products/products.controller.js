myApp.controller("ProductCtrl", ['$scope','$window','$location','ListProducts','TypesProduct','CreateProdFact',
function($scope,$window,$location,ListProducts,TypesProduct,CreateProdFact) {
  $scope.products = [];

  ListProducts.getProducts().then(function(data) {
    $scope.products = data.data.data;
  });

  $scope.typesProd = [];

  TypesProduct.getTypes().then(function(data) {
    $scope.typesProd = data.data.data;
  });

  $scope.newProd = {
  };

  $scope.createProd = function() {
    var nom = $scope.newProd.nom;
    var desc = $scope.newProd.description;
    var prix = $scope.newProd.prix;
    var nbexemp = $scope.newProd.nbexemp;
    var img = $scope.newProd.urlImg;
    var typeart = $scope.newProd.typearticle.id;
    if (nom !== undefined && desc !== undefined && prix !== undefined && nbexemp !== undefined && img !== undefined && typeart !== undefined) {

      CreateProdFact.insert(nom, desc, prix, nbexemp, img, typeart).success(function(data) {

        $location.path("/");
      }).error(function(status) {
        alert('Invalid credentials');
      });
    } else {
      alert('Veuillez remplir tous les champs du formulaire');
    }
  };


}
]);

myApp.controller("ProductDetCtrl", ['$scope','$location','$window','$routeParams','DetailProdFact','UpdateProdFact','TypesProduct','UpdateQteFact','CreateContenuFact',
function($scope,$location,$window,$routeParams,DetailProdFact,UpdateProdFact,TypesProduct,UpdateQteFact,CreateContenuFact) {
  $scope.prodDet= [];
  $scope.uptQte = {
  };
  DetailProdFact.getDetails($routeParams.id).then(function(data) {
    $scope.prodDet = data.data.data;
    $scope.uptQte.qte=$scope.prodDet[0].attribute.nbExemp;
  });

  $scope.stockEpuise = function(nb)
  {
    if(nb==0){return true}else {return false}
  }

  $scope.typesProd = [];

  TypesProduct.getTypes().then(function(data) {
    $scope.typesProd = data.data.data;
  });

  $scope.uptProd = {
  };

  $scope.uptateProd = function() {
    var nom = $scope.uptProd.nom;
    var desc = $scope.uptProd.description;
    var prix = $scope.uptProd.prix;
    var nbexemp = $scope.uptProd.nbexemp;
    var img = $scope.uptProd.urlImg;
    var typeart = $scope.uptProd.typearticle.id;
    if (nom !== undefined && desc !== undefined && prix !== undefined && nbexemp !== undefined && img !== undefined && typeart !== undefined) {

      UpdateProdFact.update($routeParams.id,nom, desc, prix, nbexemp, img, typeart).success(function(data) {

        $location.path("/");
      }).error(function(status) {
        alert('Invalid credentials');
      });
    } else {
      alert('Veuillez remplir tous les champs du formulaire');
    }
  };


  $scope.uptQte = function(){
    var qte = $scope.uptQte.qte;
    if(qte !== undefined){
      UpdateQteFact.updatequantite($routeParams.id,qte).success(function(data) {

        $window.location.reload();
      }).error(function(status) {
        alert('Invalid credentials');
      });
    }
  };

  $scope.com={
  };
  $scope.com.qte=1;

  $scope.commandeProd = function(){

    var qte=$scope.com.qte;
    if(qte !==undefined)
    {
      if($window.sessionStorage.com!==undefined)
      {
        CreateContenuFact.insert($window.sessionStorage.com,$routeParams.id,qte).success(function(data) {

          $location.path("/panier");
        }).error(function(status) {
          alert('Invalid credentials');
        });
      }
    }
  };

}
]);
