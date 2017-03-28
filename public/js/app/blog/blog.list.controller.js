'use strict';

app.controller('BlogListController', ['$scope', '$http', '$stateParams','$state', 'toaster','blogService','$showdown',function($scope, $http, $stateParams,$state,toaster,blogService,$showdown) {

    $scope.tag = $stateParams.tag;
    $scope.page = $stateParams.page;
    $scope.catalog = $stateParams.catalog;


    $scope.list = function() {
        blogService.list({page:$scope.page,tag:$scope.tag,catalog:$scope.catalog}).then(function (result) {
            $scope.pagination = result.pagination;
            $scope.blogs = result.blogs;
            $scope.blogs.forEach(function (item) {
                item.subcontent = $showdown.makeHtml(item.content).substr(0,300);
            });
        }).catch(function (err) {
            toaster.pop('error','错误',err.message || err);
        });
    };

    $scope.recent = function () {
        blogService.recent().then(function(result){
            $scope.recents = result;
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