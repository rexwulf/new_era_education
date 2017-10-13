var app = angular.module('update.service', []);
app.factory('UpdateService', function($q, $http, DbServiceSettings, $cordovaFileTransfer, $cordovaFile, DbItemAdd){
  var self = {};
  self.checkUpdates = function(){
    var d = $q.defer();
    DbServiceSettings.getUserInfo().then(function(userInfo){
      var user = {
        firstname: userInfo[0],
        lastname: userInfo[1],
        admnNo: userInfo[2]
      };
      console.log(user);
      var url = "";
      if(userInfo[3] == "intranet"){
        url = "someIp";
      }
      else{
        url = "someURL";
      }
      $http.get('./js/updateReply.json').success(function(reply){
        angular.forEach(reply, function(item, index){
          if(item.type == "question"){
            DbItemAdd.addQuestion(item).then(function(success){
              console.log("question Added");
            });
          }
          else if(item.type == "video"){
            DbItemAdd.addVideo(item).then(function(success){
              console.log("video Added");
            });
          }
          else if(item.type == "studyMaterial"){
            DbItemAdd.addStudyMaterial(item).then(function(success){
              console.log("question Added");
            });
          }
        });
        d.resolve(reply);
      }, function(err){
        console.log(err);
        d.reject();
      });
    }, function(err){
      console.log(err);
    });
    return d.promise;
  };
  return self;
});
