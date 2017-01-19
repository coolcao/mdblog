'use strict'
app.controller('BlogDetailController', ['$scope', '$http', '$stateParams', '$filter','toaster','blogService', function($scope, $http, $stateParams, $filter,toaster,blogService) {
  $scope.detail = function() {
    var path = $stateParams.path;

    blogService.detail(path).then(function (result) {
      $scope.blog = result;
    }).catch(function (err) {
      toaster.pop('error','错误',err.message || err);
    });


  }
}])