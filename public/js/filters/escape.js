'use strict';
angular.module('app').filter('escape', function() {
  return window.encodeURIComponent;
});