app.controller('TagsController', ['$scope', '$http', '$state','toaster',function ($scope, $http,$state,toaster) {
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
        toaster.pop('error','错误','请求错误，错误码：【' + data.ret + '】');
      }
    }, function onFailed (err) {
      console.log(err);
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
