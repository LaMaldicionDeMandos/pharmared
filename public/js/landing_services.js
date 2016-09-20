angular.module('landingApp.services', []).
    factory('formService', function($http, $q) {
        return {
            register: function (form) {
                var def = $q.defer();
                def.resolve('success');
                
                return def.promise;
            }
        };
    });