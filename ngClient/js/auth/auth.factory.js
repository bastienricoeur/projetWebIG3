myApp.factory('AuthenticationFactory', function($window) {
  var auth = {
    isLogged: false,
    check: function() {
      if ($window.sessionStorage.token) {
        this.isLogged = true;
      } else {
        this.isLogged = false;
        delete this.user;
      }
    }
  }
  return auth;
});
myApp.factory('UserAuthFactory', function($window, $location, $http, AuthenticationFactory, APPLINK) {
  return {
    login: function(username, password) {
      return $http.post(APPLINK+'/login', {
        username: username,
        password: password
      });
    },
    logout: function() {
      if (AuthenticationFactory.isLogged) {
        AuthenticationFactory.isLogged = false;
        delete $window.sessionStorage.token;
        delete $window.sessionStorage.com
        $location.path("/login");
      }
    }
  }
});
myApp.factory('TokenInterceptor', function($q, $window) {
  return {
    request: function(config) {
      config.headers = config.headers || {};
      if ($window.sessionStorage.token) {
        config.headers['X-Access-Token'] = $window.sessionStorage.token;
        config.headers['Content-Type'] = "application/json";
      }
      return config || $q.when(config);
    },
    response: function(response) {
      return response || $q.when(response);
    }
  };
});
