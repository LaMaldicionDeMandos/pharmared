
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


    .controller('registerPharmacyController', function($scope) {

         $scope.form={fantasyName:'',cuit:'',phone:'',street:'',number:'',city:'',state:'',email:'',fullName:''};

          $scope.register = function(form) {
            console.log (form.fullName);


};
})        ;
