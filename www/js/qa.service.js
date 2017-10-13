var app = angular.module('qa.service', []);
app.factory('QaStorage', function($q, $cordovaSQLite, $cordovaDevice){
  var self = {};
  self.storeQuestions = function(q, level){
    console.log("data stored");
    console.log(level);
    self.q = q;
    self.level = level;
  };
  self.getQuestions = function(){
    console.log("getting data");
    console.log(self.q[0].question);
    return [self.q, self.level];
  };
  return self;
});
