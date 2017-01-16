'use strict';

app.controller('BlogListController', ['$scope', '$http', '$stateParams','$state', function($scope, $http, $stateParams,$state) {

    $scope.tag = $stateParams.tag;
    $scope.page = $stateParams.page;

    $scope.list = function() {
        var page = $scope.page || 1;
        var url = '/blogs?page=' + page;
        if ($scope.tag) {
            url += ('&tag=' + $scope.tag);
        }
        let countPerPage = 5;
        $http.get(url).then(function(result) {
            $scope.blogs = result.data && result.data.blogs;
            let pagination = result.data && result.data.pagination;
            if (pagination) {
                let start = 1;
                let end = (pagination.totalPages > 5) ? 5 : pagination.totalPages;
                let usePages = [];
                //他妈的，这段逻辑有点乱，整理一下

                let totalPages = pagination.totalPages;
                let currentPage = pagination.page;

                if(totalPages < countPerPage){
                    start = 1;
                    end = totalPages;
                }else{
                    if(currentPage < ((countPerPage / 2 >>> 0) + 1)){
                        start = 1;
                        end = countPerPage;
                    }else if(currentPage > (totalPages - (countPerPage / 2))){
                        end = totalPages;
                        start = end - (countPerPage - 1);
                    }else{
                        start = currentPage - (countPerPage / 2 >>> 0);
                        end = currentPage + (countPerPage / 2 >>> 0);
                    }
                }


                for (let i = start; i <= end; i++) {
                    usePages.push(pagination.pages[i - 1]);
                }

                pagination.usePages = usePages;

                $scope.pagination = pagination;
            }
        }, function(err) {
            console.log(err);
        });
    };

    $scope.recent = function () {
        var url = '/blogs' ;
        $http.get(url).then(function(result) {
            $scope.blogs = result.data && result.data.blogs.slice(0,5);;
        }, function(err) {
            console.log(err);
        });
    }

    $scope.search = function search(opt) {
        if(opt && opt.tag){
            $state.go('blog.list',{page:1,tag:opt.tag});
        }
    }

    $scope.goto = function(page) {
        if (page) {
            $scope.page = page;
            $state.go('blog.list',{page:page});
        }
    };

    $scope.prePage = function() {
        if ($scope.pagination.hasPrePage) {
            $scope.page = $scope.pagination.prePage;
            $state.go('blog.list',{page:$scope.page});
        }
    }

    $scope.nextPage = function() {
        if ($scope.pagination.hasNextPage) {
            $scope.page = $scope.pagination.nextPage;
            $state.go('blog.list',{page:$scope.page});
        }

    }

}]);