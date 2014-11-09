'use strict';

angular
  .module('openpiApp')
  .service('Auth', function Auth($http, $location, $cookies, Socket, AUTH_URL, API_URL) {

    var auth, self = this;

    self.getAuth = function() {
      return auth;
    };

    self.setAuth = function(data) {
      auth = data;

      if (auth && auth.token && auth.token.accessToken) {
        Socket.connect(auth.token.accessToken);
        $cookies.auth = JSON.stringify(auth);
        $http.defaults.headers.common.Authorization = 'Bearer ' + auth.token.accessToken || '';
      } else {
        Socket.disconnect();
        delete $cookies.auth;
        $http.defaults.headers.common.Authorization = '';
      }
    };

    self.setAuth($cookies.auth && JSON.parse($cookies.auth));

    self.saveAuth = function(auth) {
      self.setAuth(auth);
      $location.path('/');
    };

    self.getUser = function() {
      return auth && auth.user;
    };

    self.getUserName = function() {
      return auth && auth.user && (auth.user.displayName || auth.user.email);
    };

    self.userCreate = function(user) {
      return $http({
        method: 'POST',
        url: AUTH_URL + 'signup',
        data: user
      }).success(self.saveAuth);
    };

    self.userUpdate = function(user) {
      return $http({
        method: 'PUT',
        url: API_URL + 'user',
        data: user
      }).success(function(user) {
        auth.user = user;
        self.saveAuth(auth);
      });
    };

    self.login = function(email, password) {
      return $http({
        url: AUTH_URL + 'signin',
        method: 'POST',
        data: {
          email: email,
          password: password
        },
      }).success(self.saveAuth);
    };

    self.logout = function() {
      self.setAuth();
      $location.path('/login');
    };

    self.testLogin = function() {
      self.auth = $cookies.auth && JSON.parse($cookies.auth);

      if (self.auth) {
        self.saveAuth(self.auth);
      }
    };

    self.refreshLogin = function(token) {

      token = token || (auth && auth.token) || {};

      if (token.refreshToken) {
        return $http({
          url: AUTH_URL + 'token',
          method: 'POST',
          data: token,
        }).success(self.saveAuth)
          .error(self.logout);
      } else {
        self.logout();
      }
    };
  });
