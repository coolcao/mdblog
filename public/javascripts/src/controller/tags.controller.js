app.controller('TagsController', ['$scope', '$http', '$state',function ($scope, $http,$state) {
  $scope.tags = function () {
    console.log('lalal');
    $http.get('/blogs/tags').then(function onSuccess (result) {
      var data = result && result.data;
      if(data.ret == 0){
        $scope.tags = data.tags;
      }else{
        console.log('请求错误，错误码：【' + data.ret + '】');
      }
    }, function onFailed (err) {
      console.log(err);
    });
  };

  $scope.listByTag = function(tag){
    if(!tag){
      alert('tag不能为空');
    }
    $state.go('blogs',{tag:tag});
  };
}])
