'use strict';

app.controller('BlogListController', ['$scope', '$http', '$stateParams','$state', 'toaster','blogService',function($scope, $http, $stateParams,$state,toaster,blogService) {

    $scope.tag = $stateParams.tag;
    $scope.page = $stateParams.page;


    $scope.list = function() {
        blogService.list({page:$scope.page,tag:$scope.tag}).then(function (result) {
            $scope.pagination = result.pagination;
            $scope.blogs = result.blogs;
        }).catch(function (err) {
            toaster.pop('error','错误',err.message || err);
        });
    };

    $scope.recent = function () {
        blogService.recent().then(function(result){
            $scope.blogs = result;
        }).catch(function (err) {
            toaster.pop('error','错误',err.message || err);
        });
    };

    $scope.goto = function(page) {
        if (page) {
            $state.go('blog.list',{page:page});
        }
    };

    $scope.prePage = function() {
        if ($scope.pagination.hasPrePage) {
            $state.go('blog.list',{page:$scope.page});
        }
    }

    $scope.nextPage = function() {
        if ($scope.pagination.hasNextPage) {
            $state.go('blog.list',{page:$scope.page});
        }

    }

}]);