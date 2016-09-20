angular.module('landingApp.services', []).
    factory('formService', function($http, $q) {
        return {
            PHARMACY:"pharmacy",PHARMACIST:"pharmacist",LABORATORY:"laboratory",DRUGSTORE:"drugstore",
            register: function (form,entity) {
                var def = $q.defer();
                $http({
                    url: '/register/'+entity,
                    method: 'post',
                    dataType: 'json',
                    data: form,
                    headers: {'Content-Type': 'application/json'}
                }).success(function(data) {
                    def.resolve(data);
                }).error(function(data, status) {
                    def.reject(data);
                });
                return def.promise;

            }
        };
    });