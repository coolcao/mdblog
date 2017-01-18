'use strict'
app.controller('searchFormController', ['$scope', '$http','$state', '$stateParams', '$filter', function($scope, $http, $state,$stateParams, $filter) {
  $scope.gotoSearch = function (keyword) {
    if(keyword){
      $state.go('blog.search',{keyword:keyword,page:null});
    }
  }
}]);