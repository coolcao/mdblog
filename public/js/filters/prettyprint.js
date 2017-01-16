app.filter('prettyprint', function () {
  return function (text) {
    return prettyPrintOne(text, '', true)
  }
})
