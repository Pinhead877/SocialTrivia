angular.module('mainApp').filter('numberFixedLen', function () {
   return function (n, len) {
      var num = parseInt(n, 10);
      len = parseInt(len, 10);
      if (isNaN(num) || isNaN(len)) {
         return n;
      }
      num = ''+num;
      while (num.length < len) {
         num = '0'+num;
      }
      return num;
   };
});

angular.module('mainApp').filter('range', function(){
   return function(arr, num){
      sum = parseInt(num);

      for(i=1;i<sum+1;i++){
         arr.push(i);
      }

      return arr;
   };
});

angular.module('mainApp').filter('rangeFromTO', function(){
   return function(arr, start, end){
      sum = parseInt(end);
      ind = parseInt(start);
      if(ind<sum){
         for(i=ind;i<sum+1;i++){
            arr.push(i);
         }
      }else{
         for(i=ind;i>=sum;i--){
            arr.push(i);
         }
      }
      return arr;
   };
});
