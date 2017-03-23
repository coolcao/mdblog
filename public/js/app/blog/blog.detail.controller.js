'use strict'
app.controller('BlogDetailController', ['$scope', '$http', '$stateParams', '$filter', 'toaster', 'blogService', '$showdown', function($scope, $http, $stateParams, $filter, toaster, blogService, $showdown) {
    $scope.detail = function() {
        var path = $stateParams.path;

        blogService.detail(path).then(function(result) {
            result.content = $showdown.makeHtml(result.content);

            //使用谷歌美化代码
            var reg = /<code class=[^>]*([\s\S]*?)<\/code>/g
            var codes = result.content.match(reg);
            if (codes) {
                console.log('ppppppppppp');
                let coder = codes.map((item) => {
                    return $filter('prettyprint')(item)
                })
                for (let i = 0; i < codes.length; i++) {
                    result.content = result.content.replace(codes[i], coder[i]);
                }
            }

            $scope.blog = result;
        }).catch(function(err) {
            toaster.pop('error', '错误', err.message || err);
        });


    }
}])