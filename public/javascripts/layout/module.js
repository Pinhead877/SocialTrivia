angular.module('mainApp', ['ngCookies', 'ngRoute']).config(
   function($locationProvider){
      $locationProvider.html5Mode(true);
   }
);
