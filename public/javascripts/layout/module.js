angular.module('mainApp', ['ngRoute', 'smart-table', 'lodash']).config(
   function($locationProvider, $sceDelegateProvider){
      //enable html 5 mode for the base tag to work
      $locationProvider.html5Mode(true);
   }
);

angular.module('mainApp').run();
