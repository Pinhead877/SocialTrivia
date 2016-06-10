angular.module('mainApp', ['ngRoute']).config(
   function($locationProvider){
      //enable html 5 mode for the base tag to work
      $locationProvider.html5Mode(true);
   }
);
