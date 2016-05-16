myApp.controller("HeaderCtrl", ['$scope', '$rootScope','$location', 'UserAuthFactory',
function($scope,$rootScope, $location, UserAuthFactory) {

  $scope.isActive = function(route) {
    return route === $location.path();
  }

  $scope.logout = function () {
    UserAuthFactory.logout();
  }

}
]);
