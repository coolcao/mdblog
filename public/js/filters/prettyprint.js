'use strict';
angular.module('app').filter('prettyprint', function () {
  return function (text) {
    return prettyPrintOne(text, '', true)
  }
})
