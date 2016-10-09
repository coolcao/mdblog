/**
 * Created by coolcao on 16/8/3.
 */

"use strict";
app.controller('SideNavCtrl',['$scope',function ($scope) {
    $scope.menus = [
    {
        name:'文章列表',
        state:'blogs'
    },
    {
        name:'标签分类',
        state:'tags'
    },
    {
        name:'标签子目录',
        state:'tags.list'
    },
    {
        name:'关于在下',
        state:'blogs-detail'
    },
    ];
}]);
