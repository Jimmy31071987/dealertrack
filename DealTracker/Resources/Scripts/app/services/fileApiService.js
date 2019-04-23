(function (app) {

    'use strict';

    app.factory('fileUpload', fileUpload);

    fileUpload.$inject = ['$http'];

    function fileUpload($http) {

        var service = {

            post:post
        };

        function post(url, config , success, failure) {

          
            $http.post(url, config).then(function (result) { success(result); }, function (error) { failure(error); });

        }

        return service;
    }

})(angular.module('common.core'));