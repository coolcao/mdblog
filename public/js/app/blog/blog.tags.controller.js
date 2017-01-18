app.controller('TagsController', ['$scope', '$http', '$state',function ($scope, $http,$state) {
  $scope.tags = function () {
    $http.get('/blogs/tags').then(function onSuccess (result) {
      var data = result && result.data ;
      var ret = data && data.ret;
      var tagsTree = data && data.tags;
      if(ret == 0){
        if(tagsTree && tagsTree.child){
          tagsTree.child.sort(function(a,b){
            return a.count - b.count < 0;
          });
        }

        var values = [];
        var q = [];
        q = q.concat(tagsTree.child);
        while (q.length > 0) {
          let t = q.shift();
          values.push(t);
          q = q.concat(t.child);
        }
        $scope.tagsValues = values;
        $scope.tags = tagsTree;
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
    $state.go('blog.list',{page:1,tag:tag});
  };
}])
