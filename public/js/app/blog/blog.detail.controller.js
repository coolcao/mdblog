'use strict'
app.controller('BlogDetailController', ['$scope', '$http', '$stateParams', '$filter','toaster', function($scope, $http, $stateParams, $filter,toaster) {
  $scope.detail = function() {
    var path = $stateParams.path;
    if (!path) {
      return toaster.pop('error','错误','path不能为空');
    }
    try {
      path = window.decodeURIComponent(path);
      $http.get('/blogs/' + encodeURIComponent(path)).then(function(result) {
        $scope.blog = result.data && result.data.blog
        if ($scope.blog) {
          let reg = /<code[^>]*([\s\S]*?)<\/code>/g
          let codes = $scope.blog.content.match(reg)
          if (codes) {
            let coder = codes.map((item) => {
              return $filter('prettyprint')(item)
            })
            for (let i = 0; i < codes.length; i++) {
              $scope.blog.content = $scope.blog.content.replace(codes[i], coder[i])
            }
          }
        }
      }, function(err) {
        console.log(err)
        toaster.pop('error','错误',err.message || err);
      })
    } catch (err) {
        toaster.pop('error','错误',err.message || err);
    }

  }
}])