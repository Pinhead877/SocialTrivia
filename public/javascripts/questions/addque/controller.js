angular.module("mainApp").controller('que-add-ctrl', ['$scope', '$http','$q', function($scope, $http, $q){
   $scope.queDetails = {
      isPrivate: false
   };

   $scope.clearQue = function(){
      $scope.queDetails.question = "";
      $scope.queDetails.answer = "";
      $scope.queForm.$setPristine();
   }

   $scope.back = function(){
      window.location.href = "/questions/list";
   }

   $scope.addQuetion = function(){
      if($scope.queForm.$valid){
         $scope.queDetails.category = JSON.parse($scope.queDetails.category);
         $http.post('/questions/create', $scope.queDetails).then(function(result){
            if(result.data.error) alert(result.data.error.message);
            else{
               alert("Added!");
               $scope.added = !$scope.added;
               $scope.clearQue();
            }
         });
      }
   };

   // $http.get('/questions/getCategories').then(function(result){
   //
   //    if(result.data.error){
   //       alert(result.data.error.message);
   //    }else{
   //       $scope.categoriesList = result.data;
   //    }
   // });

   $scope.getCategories = function(){
      var defered = $q.defer();
      $http.get('/questions/getCategories').then(function(result){
         if(result.data.error){
            alert(result.data.error.message);
         }else{
            // $scope.categoriesList = result.data;
            defered.resolve(result.data);
         }
      });
      return defered.promise;
   }

   $scope.init = function(){
      $scope.getCategories().then(function(categories){
         debugger;
      });
   }

   $scope.init();

}]);
