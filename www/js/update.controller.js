var app = angular.module('update.controller', ['update.service', 'db.service']);
var ip = "http://192.168.1.10:8080";
var resUrl = "http://192.168.1.10:8080" + "/Laravel/VGPT/resources/";
app.controller('UpdateCtrl', function($scope, UpdateService, DbServiceSettings, DbItemAdd, $cordovaDevice, $timeout, $cordovaSQLite, $http, $cordovaFileTransfer, DbTest){
  $scope.loading = false;
  $scope.checkQuestionUpdates = function(){
    $scope.loading = true;
    var count = 0;
    var uuid = $cordovaDevice.getUUID();
    db = $cordovaSQLite.openDB({name: 'my.db', location: 'default'});
    var query = "SELECT firstname, lastname, admnNo, accessMethod FROM user WHERE deviceId = ?";
    $cordovaSQLite.execute(db, "SELECT count(*) FROM physicsQuestions").then(function(res){
      count += res.rows.item(0)['count(*)'];
    }, function(err){
      console.log(err.message);
    });
    $cordovaSQLite.execute(db, "SELECT count(*) FROM chemistryQuestions").then(function(res){
      count += res.rows.item(0)['count(*)'];
    }, function(err){
      console.log(err.message);
    });
    $cordovaSQLite.execute(db, "SELECT count(*) FROM mathsQuestions").then(function(res){
      count += res.rows.item(0)['count(*)'];
    }, function(err){
      console.log(err.message);
    });
    $cordovaSQLite.execute(db, query, [uuid]).then(function(result){
      console.log("result");
      if(result.rows.length > 0){
        for(var x = 0; x < result.rows.length; x++){
          console.log(x);
          console.log(result.rows.item(x).admnNo);
          console.log(result.rows.item(x).accessMethod);
        }
      }
      var url = "";
      if(result.rows.item(0).accessMethod == "intranet"){
        url = "http://192.168.1.10:8080" + "/Laravel/VGPT/public/api/v1/question/" + count; /// add count
      }
      else{
        url = "someURL" + "/Laravel/VGPT/public/api/v1/question/";
      }
      console.log(url);
      console.log("sum count = " + count);
      $http.get(url).then(function(reply){
        console.log("got reply");
        console.log(reply);
        /*var strBuilder = [];
        for(var key in reply.data){
              if (reply.data.hasOwnProperty(key)) {
                 strBuilder.push("Key is " + key + ", value is " + reply.data[key] + "\n");
            }
        }
        console.log(strBuilder.join(""));*/
        reply = reply.data.questions;
        angular.forEach(reply, function(item, index){
          console.log("item type --");
          console.log(item.type);
        //  console.log("question detected");
          DbItemAdd.addQuestion(item).then(function(success){
            console.log("question Added");
            $scope.res = "added q";
          });
        });
        $scope.loading = false;
      }, function(err){
        console.log("error ques");
        var strBuilder = [];
        for(var key in err){
              if (err.hasOwnProperty(key)) {
                 strBuilder.push("Key is " + key + ", value is " + err[key] + "\n");
            }
        }
        console.log(strBuilder.join(""));
        $scope.loading = false;
        //$scope.res = strBuilder.join("");
      });
    });
  };
  $scope.checkVideoUpdates = function(){
    $scope.loading = true;
    db = $cordovaSQLite.openDB({name: 'my.db', location: 'default'});
    var query = "SELECT * FROM user";
    var count = 0;
    $cordovaSQLite.execute(db, "SELECT count(*) FROM physicsVideos").then(function(res){
      count += res.rows.item(0)['count(*)'];
    }, function(err){
      console.log(err.message);
    });
    $cordovaSQLite.execute(db, "SELECT count(*) FROM chemistryVideos").then(function(res){
      count += res.rows.item(0)['count(*)'];
    }, function(err){
      console.log(err.message);
    });
    $cordovaSQLite.execute(db, "SELECT count(*) FROM mathsVideos").then(function(res){
      count += res.rows.item(0)['count(*)'];
    }, function(err){
      console.log(err.message);
    });
    $cordovaSQLite.execute(db, query).then(function(result){
      console.log("result db");
      if(result.rows.length > 0){
        for(var x = 0; x < result.rows.length; x++){
          console.log(x);
          console.log(result.rows.item(x).admnNo);
        }
      }
      var url = "";
      console.log("videos already present = " + count);
      console.log("count = " + count);
      if(result.rows.item(0).accessMethod == "intranet"){
        url = "http://192.168.1.10:8080" + "/Laravel/VGPT/public/api/v1/video/" + count;
      }
      else{
        url = "someURL" + "/Laravel/VGPT/public/api/v1/video/view";
      }
      //url = "./js/video.json";
      console.log("getting JSON for vid from " + url);
      $http.get(url).success(function(reply){
        reply = reply.videos;
        angular.forEach(reply, function(item, index){
          console.log("video subject = " + item.subject);
          console.log("item type --");
          console.log(item.type);
          console.log("video detected");
          DbItemAdd.addVideo(item).then(function(success){
            console.log("video Added");
          });
        });
        $scope.loading = false;
      }, function(err){
        $scope.loading = false;
        console.log(err);
      });
    });
  };
  $scope.checkDppUpdates = function(){
    $scope.loading = true;
    db = $cordovaSQLite.openDB({name: 'my.db', location: 'default'});
    var query = "SELECT * FROM user";
    var count = 0;
    $cordovaSQLite.execute(db, "SELECT count(*) FROM physicsMaterial").then(function(res){
      count += res.rows.item(0)['count(*)'];
    }, function(err){
      console.log(err.message);
    });
    $cordovaSQLite.execute(db, "SELECT count(*) FROM chemistryMaterial").then(function(res){
      count += res.rows.item(0)['count(*)'];
    }, function(err){
      console.log(err.message);
    });
    $cordovaSQLite.execute(db, "SELECT count(*) FROM mathsMaterial").then(function(res){
      count += res.rows.item(0)['count(*)'];
    }, function(err){
      console.log(err.message);
    });
    var batch = "";
    console.log("count = " + count);
    $cordovaSQLite.execute(db, query).then(function(result){
      console.log(result.rows.item(0).batch);
      batch = result.rows.item(0).batch;
      var urld = "";
      if(result.rows.item(0).accessMethod == "intranet"){
        urld = "http://192.168.1.10:8080" + "/Laravel/VGPT/public/api/v1/dpp/batch";
      }
      else{
        urld = "someURL" + "/Laravel/VGPT/public/api/v1/dpp/batch/";
      }
      console.log("no. of dpp already present" + count);
      var userObj = {
        batch: "123",//to change
        no: count//to change
      };
      console.log(result.rows.item(0).batch);
      console.log(urld);
      console.log("getting JSON for dpp");
      var downloadDpp = function(filename, ext, url, targetPath, dpp){
        console.log(url);
        var trustHosts = true;
        var options = {};
        $cordovaFileTransfer.download(url, targetPath, options, trustHosts)
          .then(function(result) {
            console.log("download complete from " + url);
            addToDb(ext, targetPath, url, dpp);
          }, function(err) {
              console.log(err);
          }, function (progress) {
            $timeout(function () {
              console.log((progress.loaded / progress.total) * 100);
            });
          });
      };
      var addToDb = function(ext, targetPath, url, dpp){
        var query = "INSERT INTO " + dpp.subject + "Material (topic, intranetLink, title, description, id, deviceLink, fileType) VALUES (?, ?, ?, ?, ?, ?, ?)";
        $cordovaSQLite.execute(db, query, [dpp.topic, url, dpp.title, dpp.description, dpp.id, targetPath, ext]).then(function(res){
          console.log("added new dpp");
          console.log(res.insertId);
        }, function(err){
          console.log(err.message);
        });
      };
      var toParams = function(obj) {
          var p = [];
          for (var key in obj) {
              p.push(key + '=' + encodeURIComponent(obj[key]));
          }
          return p.join('&');
      };
      $http({
        url: urld,
        method: "POST",
        data: toParams(userObj),
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
      }).success(function(res){
        var strBuilder = [];
        for(var key in res){
              if (res.hasOwnProperty(key)) {
                 strBuilder.push("Key is " + key + ", value is " + res[key] + "\n");
            }
        }
        console.log(strBuilder.join(""));
        res = res.dpps;
        if(!res.length){
          console.log("no new dpps");
        }
        for(var x = 0; x < res.length; x++){
          var filename = res[x].URL.split("/").pop();
          var ext = filename.split(".").pop();
          console.log(filename);
          var url = "http://192.168.1.10:8080/" + "/Laravel/VGPT/resources/" + res[x].URL;
          var targetPath = cordova.file.externalApplicationStorageDirectory + filename;
          console.log(targetPath);
          downloadDpp(filename, ext, url, targetPath, res[x]);
        }
        $scope.loading = false;
      }, function(err){
        console.log(err);
      });
    });
  };
  $scope.uploadToServer = function(){
    $scope.loading = true;
    var admnNo = 0;
    DbServiceSettings.getUserInfo().then(function(user){
      admnNo = user[2];
    });
    DbTest.getTestsInfo().then(function(res){
      console.log("got basic tests info");
      var toParams = function(obj) {
          var p = [];
          for (var key in obj) {
              p.push(key + '=' + encodeURIComponent(obj[key]));
          }
          return p.join('&');
      };
      var currentPass = [];
      var p = 0;
      var setUploaded = function(){
        DbTest.setUploaded(currentPass[p]);
        p = p + 1;
      };
      for(var x = 0; x < res.length; x++){
        $scope.loading = true;
        if(!res.item(x).uploaded){
          currentPass.push(res.item(x).password);
          var userObj = {
            admnNo: admnNo,
            name: res.item(x).name,
            physics: res.item(x).physicsScore,
            maths: res.item(x).mathsScore,
            chemistry: res.item(x).chemistryScore,
            totalScore: res.item(x).score
          };
          $http({
            url: "url",
            method: "POST",
            data: toParams(userObj),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
          }).success(setUploaded(res), function(err){
            $scope.loading = false;
          });
        }
        $scope.loading = false;
      }
      $scope.loading = false;
    }, function(err){
      console.log(err);
    });
  };
});
