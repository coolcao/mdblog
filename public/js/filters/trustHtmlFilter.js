app.filter('trustHtml', function($sce) {
  return function(input) {
    return $sce.trustAsHtml(input);
  }
});