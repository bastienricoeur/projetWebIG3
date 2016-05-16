myApp.factory('ListUsers', function($http, APPLINK) {
  var urlBase = APPLINK+'/api/v1/admin/users/';
  var _usersFactory = {};

  _usersFactory.getUsers = function() {
    return $http.get(urlBase);
  };

  return _usersFactory;
});

myApp.factory('DelUserFact', function($http, APPLINK) {
  return {
    deleteUser: function(id) {
      return $http.delete(APPLINK+'/api/v1/admin/user/'+id);
    }
  }
});

myApp.factory('UptRoleFact', function($http, APPLINK) {
  return {
    updateUser: function(role,id) {
      return $http.put(APPLINK+'/api/v1/admin/user/'+id, {
          admin: role
      });
    }
  }
});
