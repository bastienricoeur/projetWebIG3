myApp.controller("UsersCtrl", ['$scope','$window','$location','ListUsers','DelUserFact','UptRoleFact',
function($scope,$window,$location,ListUsers,DelUserFact,UptRoleFact) {
  $scope.users = [];

  ListUsers.getUsers().then(function(data) {
    $scope.users = data.data.data;
  });

  $scope.deleteUsr = function(id) {
    DelUserFact.deleteUser(id).success(function(data) {
      $window.location.reload();
    }).error(function(status) {
      alert('Invalid credentials');
    });
  };


  $scope.whatrole = function(role) {
    if(role=='admin'){
      return true;
    }else{
      return false;
    }
  };

  $scope.uptRole = function(admin,id) {
    UptRoleFact.updateUser(admin,id).success(function(data) {
      $window.location.reload();
    }).error(function(status) {
      alert('Invalid credentials');
    });
  };

}
]);
