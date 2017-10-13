var app = angular.module('user.controller', ['db.service']);
app.controller('UserCtrl', function($scope, DbServiceSettings, $timeout, ionicMaterialMotion, ionicMaterialInk){
  DbServiceSettings.getUserInfo().then(function(res){
    $scope.user = {
      name: res[0] + " " + res[1],
      admnNo: res[2],
      batch: res[4],
      pointsTotal: res[5],
      pointsCurrent: res[6],
      correct: res[7] ? res[7]:0,
      accuracy: (res[7]) ? Math.floor((res[7]/(res[7] + res[8]))*100) : 0,
      todayRank: res[9],
      weekRank: res[10],
      monthRank: res[11]
    };
    console.log("month = " + res[11]);
  }, function(err){
    console.log("error getting user profile");
  });

  //Rishab's code
  // Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(false);
    $scope.$parent.setHeaderFab(false);

    // Set Motion
    $timeout(function() {
        ionicMaterialMotion.slideUp({
            selector: '.slide-up'
        });
    }, 300);

    $timeout(function() {
        ionicMaterialMotion.fadeSlideInRight({
            startVelocity: 3000
        });
    }, 700);

    // Set Ink
    ionicMaterialInk.displayEffect();
    //End rishab's code
  /*DbServiceSettings.getSubjectPointsInfo().then(function(res){
    $scope.subjectPoints = [];
    for(var x = 0; x < res.length; x++){
      $scope.subjectPoints.push(res.item(x));
    }
  }, function(err){
    console.log("error points subject profile");
  });*/
});
//192.168.1.107:8080
