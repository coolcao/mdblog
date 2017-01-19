'use strict';

app.controller('BlogSearchController', ['$scope', '$http', '$stateParams','$state', 'toaster',function($scope, $http, $stateParams,$state,toaster) {

    $scope.page = $stateParams.page;
    $scope.keyword = $stateParams.keyword;
    $scope.search = function() {
        var page = $scope.page || 1;
        var url = '/blogs/search?page=' + page;
        if ($scope.keyword) {
            url += ('&keyword=' + $scope.keyword);
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