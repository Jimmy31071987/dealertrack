(function(app){ 

    'use strict';

    app.factory('settings', settings);

    settings.$inject = ['$http', '$location', 'apiService', '$rootScope'];

    function settings($http, $location, apiService, $rootScope) {

        var PATH = {
            ROOT: "",
            API: "/api/"
        };

        var config = {
            URL: {
                "SEARCH_URL": PATH.ROOT + "",
                "FILEUPLOAD": PATH.API + "FileUploadHandler.ashx",
                "PARSEFILE": PATH.ROOT+ "Home.aspx/ParseFile"
            } 
        };

        config.getParam = function (ParamName) {
            var paramValu = location.search.split(ParamName + "=")[1];
            if (paramValu != undefined && paramValu.indexOf("&") > 0) {
                paramValu = paramValu.split("&")[0];
            }
            return paramValu;
        };

        config.Redirect = function (PageName) {
            window.location.href = PageName;
        };

        return config;
    }

})(angular.module('common.core'));