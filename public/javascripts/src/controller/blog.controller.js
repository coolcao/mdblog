/**
 * Created by coolcao on 16/8/3.
 */


app.controller('BlogCtrl',['$scope','$http',function ($scope,$http) {

    $scope.list = function () {
        $http.get('/blogs').then(function (result) {
            console.log(result.data.blogs);
            $scope.blogs = result.data && result.data.blogs;
        },function (err) {
            console.log(err);
        });
    }

}]);