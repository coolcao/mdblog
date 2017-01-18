'use strict';
angular.module('app').filter('trustHtml', function($sce) {
  return function(input) {
    return $sce.trustAsHtml(input);
  }
});