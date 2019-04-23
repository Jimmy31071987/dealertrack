(function (app) {

    'use strict';

    app.factory('apiService', apiService);

    apiService.$inject = ['$http', '$location', 'notificationService','$rootScope'];

    function apiService($http, $location, notificationService, $rootScope) {

        var service = {
            post: post 
        };

        function post(url, config, success, failure) {
            return $http.post(url, config).then(function (result) { success(result); }, function (error) { failure(error); });
        }

       

        return service;
    }

})(angular.module('common.core'));