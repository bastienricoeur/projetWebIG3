var myApp = angular.module('ngclient', ['ngRoute']);
myApp.constant('APPLINK','https://oldlantern.herokuapp.com');
myApp.config(function($routeProvider, $httpProvider) {
  $httpProvider.interceptors.push('TokenInterceptor');
  $routeProvider
  .when('/login', {
    templateUrl: 'partials/login.html',
    controller: 'LoginCtrl',
    access: {
      requiredLogin: false
    }
  }).when('/signup', {
    templateUrl: 'partials/signup.html',
    controller: 'SignupCtrl',
    access: {
      requiredLogin: false
    }
  }).when('/', {
    templateUrl: 'partials/home.html',
    controller: 'ProductCtrl',
    access: {
      requiredLogin: true
    }
  }).when('/detail/:id', {
    templateUrl: 'partials/detailproduct.html',
    controller: 'ProductDetCtrl',
    access: {
      requiredLogin: true
    }
  }).when('/uptproduct/:id', {
    templateUrl: 'partials/updateproduct.html',
    controller: 'ProductDetCtrl',
    access: {
      requiredLogin: true
    }
  }).when('/newprod', {
    templateUrl: 'partials/newproduct.html',
    controller: 'ProductCtrl',
    access: {
      requiredLogin: true
    }
  }).when('/profil', {
    templateUrl: 'partials/myprofil.html',
    controller: 'MyProfilCtrl',
    access: {
      requiredLogin: true
    }
  }).when('/majprofil', {
    templateUrl: 'partials/updateprofil.html',
    controller: 'MyProfilCtrl',
    access: {
      requiredLogin: true
    }
  }).when('/mycarts', {
    templateUrl: 'partials/carts.html',
    controller: 'CartsCtrl',
    access: {
      requiredLogin: true
    }
  }).when('/newcart', {
    templateUrl: 'partials/newcart.html',
    controller: 'CartsCtrl',
    access: {
      requiredLogin: true
    }
  }).when('/listusr', {
    templateUrl: 'partials/listusers.html',
    controller: 'UsersCtrl',
    access: {
      requiredLogin: true
    }
  }).when('/panier', {
    templateUrl: 'partials/panier.html',
    controller: 'CommandeCtrl',
    access: {
      requiredLogin: true
    }
  }).when('/final', {
    templateUrl: 'partials/final.html',
    controller: 'CommandeCtrl',
    access: {
      requiredLogin: true
    }
  }).otherwise({
    redirectTo: '/login'
  });
});
myApp.run(function($rootScope, $window, $location, AuthenticationFactory,GetProfil) {
  // when the page refreshes, check if the user is already logged in
  AuthenticationFactory.check();
  $rootScope.$on("$routeChangeStart", function(event, nextRoute, currentRoute) {
    if ((nextRoute.access && nextRoute.access.requiredLogin) && !AuthenticationFactory.isLogged) {
      $location.path("/login");
    } else {
      // check if user object exists else fetch it. This is incase of a page refresh
      if (!AuthenticationFactory.user) AuthenticationFactory.user = $window.sessionStorage.user;
      if (!AuthenticationFactory.userRole) AuthenticationFactory.userRole = $window.sessionStorage.userRole;
    }
  });

  $rootScope.$on('$routeChangeSuccess', function(event, nextRoute, currentRoute) {
    $rootScope.showMenu = AuthenticationFactory.isLogged;
    $rootScope.role = AuthenticationFactory.userRole;
    $rootScope.admin=false;
    // if the user is already logged in, take him to the home page
    if (AuthenticationFactory.isLogged == true && $location.path() == '/login') {
      $location.path('/');
    }
    if(AuthenticationFactory.isLogged)
    {
      GetProfil.getProf().then(function(data) {
        if(data.data.data.attribute.role=="admin")
        {
          $rootScope.admin=true;
        }
        else {
          $rootScope.admin=false;
        }

      });
    }
    else {
      $rootScope.admin=false;
    }
  });

});
