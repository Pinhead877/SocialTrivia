angular.module('lodash', []);
angular.module('lodash').factory('_', ['$window', function($window) {
  return $window._;
}]);
