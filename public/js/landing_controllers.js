
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


    .controller('registerPharmacyController', function($scope, formService) {

         $scope.form={fantasyName:'',cuit:'',phone:'',street:'',number:'',city:'',state:'',email:'',fullName:''};
         $scope.errors = {};
         $scope.register = function() {
            $scope.success = false;
            $scope.errors = {};
            var valid = validateForm($scope.form);
             if (valid) {
               formService.register($scope.form).then(
                    function(info) {
                        $scope.success = true;
                        console.log(info);
                    },
                    function(error) {
                        $scope.errors.form = error;
                    }
                );
            }
        }; 

var validateForm = function(form) {
            var valid = true;
            if (!form.fantasyName || form.fantasyName.length == 0) {
                $scope.errors.fantasyName = 'invalid_fantasyName';
                valid = false;
            }

            if (!form.cuit || form.cuit.length == 0) {
                $scope.errors.cuit = 'invalid_cuit';
                valid = false;
            }

            
            if (!form.phone || form.phone.length == 0) {
                $scope.errors.phone = 'invalid_phone';
                valid = false;
            }

             if (!form.street || form.street.length == 0) {
                $scope.errors.street = 'invalid_street';
                valid = false;
            }



            if (!form.number || form.number.length == 0) {
                $scope.errors.number = 'invalid_number';
                valid = false;
            }

            if (!form.city || form.city.length == 0) {
                $scope.errors.city = 'invalid_city';
                valid = false;
            }


            if (!form.state || form.state.length == 0) {
                $scope.errors.state = 'invalid_state';
                valid = false;
            }

           

            if (!form.fullName || form.fullName.length == 0) {
                $scope.errors.fullName = 'invalid_fullName';
                valid = false;
            }




            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

            if (!re.test(form.email)) {
                $scope.errors.email = 'invalid_email';
                valid = false;
            }
            return valid;
        };
    });




