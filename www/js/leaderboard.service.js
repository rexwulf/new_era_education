var app = angular.module('leaderboard.service', []);
var ip = "http://192.168.1.10:8080";
var urlSelfRank = ip + "/Laravel/VGPT/public/api/v1/users";
app.factory('Ranks', function($q, $http){
  var self = {};
  var toParams = function(obj) {
      var p = [];
      for (var key in obj) {
          p.push(key + '=' + encodeURIComponent(obj[key]));
      }
      return p.join('&');
  };
  self.getYourRank = function(user, today, week, month){
    var d = $q.defer();
    console.log("getting user ranks");
    var userObj = {
      adm_no: user[2],
      today_score: today,
      week_score: week,
      month_score: month
    };
    $http({
      url: urlSelfRank,
      method: "POST",
      data: toParams(userObj),
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    }).success(function(rankRes){
      d.resolve(rankRes);
      var strBuilder = [];
      for(var key in rankRes){
            if (rankRes.hasOwnProperty(key)) {
               strBuilder.push("Key is " + key + ", value is " + rankRes[key] + "\n");
          }
      }
      console.log(strBuilder.join(""));
    }, function(err){
      console.log("error in self rank");
    });
    //code for getting rank......
    return d.promise;
  };
  self.getPublicRanks = function(low, high, days){
    var d = $q.defer();
    console.log("give public ranks " + days);
    //code for public ranks......
    var userObj = {
      low: low,
      high: high,
      type: days
    };
    $http({
      url: urlSelfRank + "/ranks",
      method: "POST",
      data: toParams(userObj),
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    }).success(function(ranksPublic){
      d.resolve(ranksPublic.names);
    }, function(err){
      console.log(err);
    });
    return d.promise;
  };
  return self;
});
