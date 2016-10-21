angular.module('landingApp.services', []).
    factory('userService', function($http, $q) {
    return {
        login: function (user) {
            var def = $q.defer();
            $http({
                url: '/login',
                method: 'post',
                dataType: 'json',
                data: user,
                headers: {'Content-Type': 'application/json'}
            }).success(function (data) {
                    def.resolve(data);
            }).error(function (data, status) {
                    def.reject(data);
            });
            return def.promise;
        }

    } ;
    })
    .factory('retrieveService', function($http, $q) {
    return {
        retrievePassw: function (username) {
            var def = $q.defer();
            $http({
                url: '/retrieve',
                method: 'post',
                data: username,
                headers: {'Content-Type': 'application/json'}
            }).success(function (data) {
                def.resolve(data);
            }).error(function (data) {
                def.reject(data);
            });
            return def.promise;
        }

    } ;
})


    .factory('registerService', function($http, $q) {
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
    })

    .factory('validateFormService', function() {
    return {
        validate: function (form) {
            var errors = {};
            var valid=true;
            if (!form.fantasyName || form.fantasyName.length == 0) {
            //    errors.fantasyName = 'invalid_fantasyName';
                errors.fantasyName ='invalid_fantasy';
                valid = false;
            }

            if (!form.cuit || form.cuit.length == 0) {
                errors.cuit = 'invalid_cuit';
                valid = false;
            }


            if (!form.phone || form.phone.length == 0) {
                errors.phone = 'invalid_phone';
                valid = false;
            }

            if (!form.street || form.street.length == 0) {
                errors.street = 'invalid_street';
                valid = false;
            }


            if (!form.number || form.number.length == 0) {
                errors.number = 'invalid_number';
                valid = false;
            }

            if (!form.city || form.city.length == 0) {
                errors.city = 'invalid_city';
                valid = false;
            }


            if (!form.province || form.province.length == 0) {
                errors.province = 'invalid_province';
                valid = false;
            }

            var bl=/\s/;

            if (!form.fullName || form.fullName.length == 0 || !bl.test(form.fullName)) {
                errors.fullName = 'invalid_fullName';
                valid = false;
            }


            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

            if (!re.test(form.email)) {
                errors.email = 'invalid_email';
                valid = false;
            };
            return {err:errors,valid:valid};
        }

    };
})



