angular.module('mainApp', ['ngRoute', 'ui.grid', 'ui.grid.selection']).config(
   function($locationProvider, $sceDelegateProvider){
      //enable html 5 mode for the base tag to work
      $locationProvider.html5Mode(true);

  //     $sceDelegateProvider.resourceUrlWhitelist([
  //   // Allow same origin resource loads.
  //   'self',
  //   // Allow loading from our assets domain.  Notice the difference between * and **.
  //   '192.168.*.*'
  // ]);
   }
);

angular.module('mainApp').run();
