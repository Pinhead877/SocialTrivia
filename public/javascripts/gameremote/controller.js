app.controller('remote-cont', ["$scope" ,function($scope){
  var socket = io();

  $scope.numin = 0;

  $scope.sendnum = function(){
    console.log("Sent!");
    socket.emit('selected', $scope.numin);
  }
}]);
