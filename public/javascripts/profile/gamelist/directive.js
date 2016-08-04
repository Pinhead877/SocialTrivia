angular.module('mainApp').directive('gameList',function(){
   return{
      restrict: "E",
      scope: {
         games: '=?'
      },
      controller: 'game-list-ctrl',
      templateUrl: '/templates/profile/gamelist'
   }
});
