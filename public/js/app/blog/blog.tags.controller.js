app.controller('TagsController', ['$scope', '$http', '$state','toaster','blogService',function ($scope, $http,$state,toaster,blogService) {
  $scope.tags = function () {

    blogService.tags().then(function (result) {
      $scope.tags = result.tags;
      $scope.tagsValues = result.tagsValues;
    }).catch(function (err) {
      toaster.pop('error','错误',err.message || err);
    });

  };

  $scope.listByTag = function(tag){
    if(!tag){
      toaster.pop('error','错误','tag不能为空');
    }
    $state.go('blog.list',{page:null,tag:tag});
  };
  
}])
