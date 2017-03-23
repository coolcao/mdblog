'use strict'

/**
 * Config for the router
 */
angular.module('app')
  .run(
    ['$rootScope', '$state', '$stateParams',
      function($rootScope, $state, $stateParams) {
        $rootScope.$state = $state
        $rootScope.$stateParams = $stateParams
      }
    ]
  )
  .config(
    ['$stateProvider', '$urlRouterProvider',
      function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider
          .otherwise('/blog/list')
        $stateProvider
          .state('blog', {
            abstract: true,
            url: '/blog',
            templateUrl: 'tpl/app.html',
            resolve: {
              deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load(['toaster','js/services/blog.pagination.factory.js','js/services/blog.service.js','js/filters/trustHtmlFilter.js',]).then(function () {
                  return $ocLazyLoad.load(['js/app/blog/blog.tags.controller.js', 'js/app/blog/blog.list.controller.js', 'js/controllers/search.form.controller.js','js/controllers/nav.controller.js'])
                });
              }]
            }
          })
          .state('blog.list', {
            url: '/list?:tag&:page&:catalog',
            controller: 'BlogListController',
            templateUrl: 'tpl/blog/blog.list.html',
            resolve: {
              deps: ['$ocLazyLoad',
                function($ocLazyLoad) {
                  return $ocLazyLoad.load(['js/app/blog/blog.list.controller.js'])
                }
              ]
            }
          })
          .state('blog.search', {
            url: '/search?:keyword&:page',
            controller: 'BlogSearchController',
            templateUrl: 'tpl/blog/blog.search.html',
            resolve: {
              deps: ['$ocLazyLoad',
                function($ocLazyLoad) {
                  return $ocLazyLoad.load(['js/app/blog/blog.search.controller.js'])
                }
              ]
            }
          })
          .state('blog.detail', {
            url: '/:path',
            controller: 'BlogDetailController',
            templateUrl: 'tpl/blog/blog.detail.html',
            resolve: {
              deps: ['$ocLazyLoad',
                function($ocLazyLoad) {
                  return $ocLazyLoad.load(['vendor/jquery/google-code-prettify/bin/prettify.min.js',
                    'vendor/jquery/google-code-prettify/bin/prettify.min.css','vendor/jquery/showdown/dist/showdown.min.js','vendor/angular/ng-showdown/dist/ng-showdown.min.js'
                  ]).then(function() {
                    return $ocLazyLoad.load([
                      'js/app/blog/blog.detail.controller.js',
                      'js/filters/trustHtmlFilter.js',
                      'js/filters/prettyprint.js'
                    ])
                  })
                }
              ]
            }
          })
          .state('about', {
            url: '/about',
            templateUrl: 'tpl/app.html'
          })
          .state('about.me', {
            url: '/me',
            templateUrl: 'tpl/about.html'
          })
      }
    ]
  )