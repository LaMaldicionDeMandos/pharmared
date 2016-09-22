
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


    .controller('registerPharmacyController', function($scope, registerService,  validateFormService) {

         $scope.form={fantasyName:'',cuit:'',phone:'',street:'',number:'',city:'',state:'',email:'',fullName:''};
         $scope.errors = {};
         $scope.register = function() {
            $scope.success = false;
            $scope.errors = {};
           var valid = validateFormService.validate($scope.form);
             if (valid) {
               registerService.register($scope.form,registerService.PHARMACY).then(
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

    })



.controller('registerLaboratoryController', function($scope, registerService, validateFormService) {

    $scope.form={fantasyName:'',cuit:'',phone:'',street:'',number:'',city:'',province:'',email:'',fullName:''};
    $scope.errors = {};
    $scope.register = function() {
        $scope.success = false;
        $scope.errors = {};
        var valid = validateFormService.validate($scope.form);
        if (valid) {
            registerService.register($scope.form,registerService.LABORATORY).then(
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

});









