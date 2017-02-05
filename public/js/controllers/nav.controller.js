'use strict'
app.controller('navController', ['$scope', '$state', '$stateParams', '$filter','blogService', function($scope, $state, $stateParams, $filter,blogService) {
    $scope.getCatalogs = function catalogs() {
        blogService.catalogs().then(function (result) {
            $scope.catalogValues = result.catalogValues;
        }).catch(function (err) {
            console.log(err.message);
        });
    }
}]);