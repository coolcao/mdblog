'use strict'
app.controller('BlogDetailController', ['$scope', '$http', '$stateParams', '$filter', function ($scope, $http, $stateParams, $filter) {
  $scope.detail = function () {
    var id = $stateParams.id
    if (!id) {
      return alert('出错了')
    }
    $http.get('/blogs/' + id).then(function (result) {
      // $scope.blog = result.data && $filter('prettyprint')(result.data.blog) 
      $scope.blog = result.data && result.data.blog
      if ($scope.blog) {
        let reg = /<code[^>]*([\s\S]*?)<\/code>/g
        let codes = $scope.blog.content.match(reg)
        if (codes) {
          let coder = codes.map((item) => {
            return $filter('prettyprint')(item)
          })
          for (let i = 0;i < codes.length;i++) {
            $scope.blog.content = $scope.blog.content.replace(codes[i], coder[i])
          }
        }
      }
    }, function (err) {
      console.log(err)
    })
  }
}])
