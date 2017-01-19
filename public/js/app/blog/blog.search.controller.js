'use strict';

app.controller('BlogSearchController', ['$scope', '$http', '$stateParams','$state', 'toaster','blogService',function($scope, $http, $stateParams,$state,toaster,blogService) {

    $scope.page = $stateParams.page;
    $scope.keyword = $stateParams.keyword;
    $scope.search = function() {

        var page = $scope.page || 1;
        var keyword = $scope.keyword;

        blogService.search({page:page,keyword:keyword}).then(function (result) {
            $scope.blogs = result.blogs;
            $scope.pagination = result.pagination;
        }).catch(function (err) {
            toaster.pop('error','错误',err.message || err);
        });

    };

    $scope.goto = function(page) {
        if (page) {
            $state.go('blog.search',{page:page});
        }
    };

    $scope.prePage = function() {
        if ($scope.pagination.hasPrePage) {
            $state.go('blog.search',{page:$scope.page});
        }
    }

    $scope.nextPage = function() {
        if ($scope.pagination.hasNextPage) {
            $state.go('blog.search',{page:$scope.page});
        }

    }

}]);