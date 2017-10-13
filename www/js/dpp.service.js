var app = angular.module('dpp.service', []);
app.factory('DppService', function($q, $cordovaSQLite, $cordovaDevice, $http, $timeout, $cordovaFileTransfer){
  var self = {};
  var db = $cordovaSQLite.openDB({name: 'my.db', location: 'default'});
  var downloadDpp = function(filename, ext, url, targetPath, dpp){
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
  self.addDpp = function(){
    console.log("begin add dpp");
    var d = $q.defer();
    $http.get('./js/dpp.json').success(function(res){
      for(var x = 0; x < res.length; x++){
        var filename = res[x].url.split("/").pop();
        var ext = filename.split(".").pop();
        console.log(filename);
        var url = res[x].url;
        var targetPath = cordova.file.externalApplicationStorageDirectory + filename;
        downloadDpp(filename, ext, url, targetPath, res[x]);
      }
      d.resolve();
    }, function(err){
      console.log(err);
    });
    return d.promise;
  };
  return self;
});
