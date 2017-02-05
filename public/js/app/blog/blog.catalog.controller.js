app.controller('CatalogController', ['$scope', '$http', '$state','toaster','blogService',function ($scope, $http,$state,toaster,blogService) {
  $scope.catalogs = function () {

    blogService.catalogs().then(function (result) {
      $scope.catalogs = result.catalogs;
      $scope.catalogValues = result.catalogValues;
    }).catch(function (err) {
      toaster.pop('error','错误',err.message || err);
    });

  };

  $scope.listByCatalog = function(catalog){
    if(!catalog){
      toaster.pop('error','错误','catalog不能为空');
    }
    $state.go('blog.list',{page:null,catalog:catalog});
  };
  
}])
