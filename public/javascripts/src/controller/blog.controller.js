/**
 * Created by coolcao on 16/8/3.
 */


app.controller('BlogCtrl',['$scope','$http','$stateParams',function ($scope,$http,$stateParams) {

    $scope.tag = $stateParams.tag;

    $scope.list = function (page) {
        page = page || 1;
        var url = '/blogs?page=' + page;
        if($scope.tag){
            url += ('&tag=' + $scope.tag);
        }
        $http.get(url).then(function (result) {
            $scope.blogs = result.data && result.data.blogs;
            $scope.pagination = result.data && result.data.pagination;
        },function (err) {
            console.log(err);
        });
    }

    $scope.prePage = function(){
        if($scope.pagination.hasPrePage){
            var page = $scope.pagination.prePage;
            $scope.list(page);
        }
    }

    $scope.nextPage = function(){
        if($scope.pagination.hasNextPage){
            var page = $scope.pagination.nextPage;
            $scope.list(page);
        }
        
    }

}]);