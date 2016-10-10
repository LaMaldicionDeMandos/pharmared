
'use strict';

/* Controllers */
angular.module('landingApp.controllers', []).
    controller('registerButtonsController', function($scope) {

    $scope.showButton = true;
    $scope.showFarmacia = false;
    $scope.showButton = true;
    $scope.showFarmaceutico = false;
    $scope.showLaboratorio = false;
    $scope.showDrogueria = false;
    $scope.showMessage=false;


    $scope.showSuccess = function() {
        $scope.showFarmacia = false;
        $scope.showFarmaceutico = false;
        $scope.showLaboratorio = false;
        $scope.showDrogueria = false;
        $scope.showMessage=true;
    }


    $scope.FuncFarmacia = function() {
        $scope.showFarmacia = !$scope.showFarmacia;
        $scope.showButton = !$scope.showButton;
    };


    $scope.FuncFarmaceutico = function() {
        $scope.showFarmaceutico = !$scope.showFarmaceutico;
        $scope.showButton = !$scope.showButton;
    };

    $scope.FuncLaboratorio = function() {
        $scope.showLaboratorio  = !$scope.showLaboratorio ;
        $scope.showButton = !$scope.showButton;
    };

    $scope.FuncDrogueria = function() {
        $scope.showDrogueria  = !$scope.showDrogueria ;
        $scope.showButton = !$scope.showButton;
    };


    })


    .controller('registerPharmacyController', function($scope, registerService,  validateFormService,ngDialog) {
        $scope.form={fantasyName:'',cuit:'',phone:'',street:'',number:'',city:'',state:'',email:'',fullName:''};
        $scope.errors = {};
        $scope.showMessage = false;
        $scope.register = function() {
            $scope.success = false;
            $scope.errors = {};
            var result = validateFormService.validate($scope.form);

            if (result.valid) {
                registerService.register($scope.form,registerService.PHARMACY).then(
                    function(info) {
                        $scope.$parent.$parent.showSuccess();
                        $scope.success = true;
                        console.log(info);
                    },
                    function(error) {

                        $scope.errors[error] = true;
                        if ($scope.errors.unknown_error) {
                            ngDialog.open({ template: '/errors' });
                        }
                        console.log(error);

                    }
                );
            } else {
                $scope.errors = result.err;
            }

         };

    })


.controller('registerPharmacistController', function($scope, registerService) {
    $scope.form = {fullName:'', enrollment: '', cuit:'', email:''};
    $scope.errors = {};
    $scope.showMessage = false;
    $scope.register = function() {
        $scope.errors = {};
        $scope.success = false;

        var result = validateForm($scope.form);
        if (result.valid) {
            registerService.register($scope.form,registerService.PHARMACIST).then(
                function(info) {
                    $scope.$parent.$parent.showSuccess();
                    $scope.success = true;
                    console.log(info);
                },
                function(error) {
                    $scope.errors[error] = true;
                    if ($scope.errors.unknown_error) {
                        ngDialog.open({ template: '/errors' });
                    }
                    console.log(error);

                }
            );
        } else {
            $scope.errors = result.err;
        }

        };


    var validateForm = function(form) {
        var valid = true;

        var bl=/\s/;
        if (!form.fullName || form.fullName.length == 0 || !bl.test(form.fullName)) {
            $scope.errors.fullName = 'invalid_fullName';
            valid = false;
        }

        if (!form.enrollment || form.enrollment.length == 0) {
            $scope.errors.enrollment = 'invalid_enrollment';
            valid = false;
        }

        if (!form.cuit || form.cuit.length == 0) {
            $scope.errors.cuit = 'invalid_cuit';
            valid = false;
        }

        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (!re.test(form.email)) {
            $scope.errors.email = 'invalid_email';
            valid = false;
        };
        return {err:$scope.errors,valid:valid};
    }
})



.controller('registerLaboratoryController', function($scope, registerService, validateFormService) {

    $scope.form={fantasyName:'',cuit:'',phone:'',street:'',number:'',city:'',state:'',email:'',fullName:''};
    $scope.errors = {};
    $scope.showMessage = false;
    $scope.register = function() {
        $scope.success = false;

        var result = validateFormService.validate($scope.form);

        if (result.valid) {

            registerService.register($scope.form,registerService.LABORATORY).then(
                function(info) {
                    $scope.$parent.$parent.showSuccess();
                    $scope.success = true;
                    console.log(info);
                },
                function(error) {
                    $scope.errors[error] = true;
                    if ($scope.errors.unknown_error) {
                        ngDialog.open({ template: '/errors' });
                    }
                    console.log(error);

                }
            );
        } else {
            $scope.errors = result.err;
        }

    };

})



    .controller('registerDrugstoreController', function($scope, registerService,  validateFormService) {
        $scope.form={fantasyName:'',cuit:'',phone:'',street:'',number:'',city:'',state:'',email:'',fullName:''};
        $scope.errors = {};
        $scope.showMessage = false;
        $scope.register = function() {
            $scope.success = false;

            var result = validateFormService.validate($scope.form);

            if (result.valid) {

                registerService.register($scope.form,registerService.DRUGSTORE).then(
                    function(info) {
                        $scope.$parent.$parent.showSuccess();
                        $scope.success = true;
                        console.log(info);
                    },
                    function(error) {
                        $scope.errors[error] = true;
                        if ($scope.errors.unknown_error) {
                            ngDialog.open({ template: '/errors' });
                        }
                        console.log(error);

                    }
                );
            } else {
                $scope.errors = result.err;
            }

        };

    })

    .controller('loginController', function($scope, $window, userService) {
        $scope.user = {username:'', password: ''};
        $scope.errors = {};
        $scope.close=function(){
            $scope.errors = {};
        };
        $scope.login = function() {
            $scope.errors = {};

            var result = validateFormLogin($scope.user);
            if (result.valid) {

                var success = function (data) {
                    $scope.success = true;
                    $window.location.href = data;
                };
                var fail = function (error) {
                    $scope.errors.user = error;

                };
                userService.login($scope.user).then(success, fail);
            }
            else{

                $scope.errors = result.err;

            }
        };

        var validateFormLogin = function(user) {
            var valid = true;
            $scope.errors = {};

            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

            if (!re.test(user.username)) {
                $scope.errors.username = 'invalid_username';
                valid = false;
            }



            if (!user.password || user.password.length == 0) {
                $scope.errors.password = 'invalid_password';
                valid = false;
            }

            return {err:$scope.errors,valid:valid};
        }


    });





