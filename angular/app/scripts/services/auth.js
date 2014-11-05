'use strict';

angular
  .module('openpiApp')
  .service('Auth', function Auth($http, $location, $cookies, AUTH_URL, API_URL) {

    var self = this;

    self.userCreate = function(user) {
      return $http({
        method: 'POST',
        url: AUTH_URL + 'signup',
        data: user
      }).success(function(data) {
        self.saveToken(data.auth);
        self.user = data.user;
        $location.path('/');
      });
    };

    self.userUpdate = function(user) {
      return $http({
        method: 'PUT',
        url: API_URL + 'user',
        data: user
      }).success(function(data) {
        self.user = data;
        $location.path('/');
      });
    };

    self.userDeactivate = function() {
      return $http({
        method: 'DELETE',
        url: API_URL + 'user/1/',
      }).success(function() {
        self.logout();
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
      }).success(function(data) {
        self.user = data;
        self.saveToken(data.token);
      });
    };

    self.logout = function() {
      delete self.auth;
      delete self.user;
      delete $cookies.auth;
      delete $cookies.user;
      $http.defaults.headers.common.Authorization = '';
      $location.path('/login');
    };

    self.testLogin = function() {
      self.auth = $cookies.auth && JSON.parse($cookies.auth);
      self.user = $cookies.user && JSON.parse($cookies.user);

      if (self.auth) {
        if (self.user) {
          self.saveToken(self.auth);
          $location.path('/');
        } else {
          self.refreshLogin();
        }
      }
    };

    self.refreshLogin = function() {
      if (self.auth.refreshToken) {
        return $http({
          url: AUTH_URL + 'token',
          method: 'POST',
          data: self.auth,
        }).success(self.saveToken)
          .success(self.getUserData)
          .error(self.logout);
      } else {
        self.logout();
      }
    };

    self.getUserData = function(noRedirect) {
      return $http({
        method: 'GET',
        url: API_URL + 'user/',
      }).success(function(data) {
        self.user = data;
        if (noRedirect !== true) {
          $location.path('/');
        }
      }).error(self.logout);
    };

    self.saveToken = function(token) {
      self.auth = token;
      $http.defaults.headers.common.Authorization = 'Bearer ' + token.accessToken;
    };

  });
