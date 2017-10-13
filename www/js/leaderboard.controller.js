var app = angular.module('leaderboard.controller', ['db.service', 'leaderboard.service']);
app.controller('LeaderboardCtrl', function($scope, DbLeaderboard, DbServiceSettings, Ranks){
  $scope.dayRanks = [];
  $scope.weekRanks = [];
  $scope.monthRanks = [];
  DbLeaderboard.getScoreData().then(function(res){
    DbServiceSettings.getUserInfo().then(function(user){
      console.log("got user data");
      console.log("send today score" + DbLeaderboard.today);
      Ranks.getYourRank(user, DbLeaderboard.today, DbLeaderboard.week, DbLeaderboard.month).then(function(ranks){
        console.log(ranks.Today_Rank);
        console.log(ranks.Week_Rank);
        console.log(ranks.Month_Rank);
        DbLeaderboard.saveRanks(ranks);
        /*$scope.userDayRank = ranks.dayRank;
        $scope.userWeekRank = ranks.weekRank;
        $scope.userMonthRank = ranks.monthRank;*/
        console.log("updated self ranks");
        $scope.loadDay = function(){
          var low = $scope.dayRanks.length + 1;
          var high = low + 10;
          Ranks.getPublicRanks(low, high, "today").then(function(ranks){
            $scope.dayRanks = $scope.dayRanks.concat(ranks);
          });
        };
        $scope.loadWeek = function(){
          var low = $scope.weekRanks.length + 1;
          var high = low + 10;
          Ranks.getPublicRanks(low, high, "week").then(function(ranks){
              $scope.weekRanks = $scope.weekRanks.concat(ranks);
          });
        };
        $scope.loadMonth = function(){
          var low = $scope.monthRanks.length + 1;
          var high = low + 10;
          Ranks.getPublicRanks(low, high, "month").then(function(ranks){
              $scope.monthRanks = $scope.monthRanks.concat(ranks);
          });
        };
        $scope.loadDay();
        $scope.loadWeek();
        $scope.loadMonth();
      }, function(err){
        console.log(err);
      });
    }, function(err){
      console.log(err);
    });
  });
});
