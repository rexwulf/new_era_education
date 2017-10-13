// This contains (almmost) all the SQLite related functions used in the app

var db = null;
var app = angular.module('db.service', []);
app.factory('DbServiceSettings', function($q, $cordovaSQLite, $cordovaDevice, $timeout){
  var self = {};
  //change access type: intranet or internet
  self.changeAccess = function(accessMethod){
    db = $cordovaSQLite.openDB({name: 'my.db', location: 'default'});
    var uuid = $cordovaDevice.getUUID();
    var d = $q.defer();
    var query  = "UPDATE user SET accessMethod = ? WHERE deviceId = ?";
    console.log(uuid);
    $cordovaSQLite.execute(db, query, [accessMethod, uuid]).then(function(result){
      d.resolve();
      console.log("insert id = " + result.insertId);
    }, function(error){
      d.reject();
      for(var e in error)
        console.log(error[e]);
      console.log("error");
    });
    return d.promise;
  };

  //Get basic user info
  self.getUserInfo = function(){
    //var uuid = $cordovaDevice.getUUID();
    var d  = $q.defer();
    $timeout(function(){
      db = $cordovaSQLite.openDB({name: 'my.db', location: 'default'});
      var query = "SELECT firstname, lastname, admnNo, accessMethod, pointsTotal, batch, pointsCurrent, correct, weekRank, todayRank, monthRank, wrong FROM user";
      $cordovaSQLite.execute(db, query).then(function(result){
        console.log("got user info");
        console.log(result.rows.item(0).firstname);
        if(result.rows.length > 0){
            var res =  [result.rows.item(0).firstname, result.rows.item(0).lastname, result.rows.item(0).admnNo, result.rows.item(0).accessMethod, result.rows.item(0).batch, result.rows.item(0).pointsTotal, result.rows.item(0).pointsCurrent, result.rows.item(0).correct, result.rows.item(0).wrong, result.rows.item(0).todayRank, result.rows.item(0).weekRank, result.rows.item(0).monthRank];
            d.resolve(res);
        }
        else{
          d.reject();
        }
      }, function(err){
        console.log("err user info");
        console.log(err.message);
      });
    }, 300);
    return d.promise;
  };

  self.getSubjectPointsInfo = function(){
    db = $cordovaSQLite.openDB({name: 'my.db', location: 'default'});
    var d  = $q.defer();
    var query = "SELECT * FROM qaSubjectStats";
    $cordovaSQLite.execute(db, query).then(function(result){
      d.resolve(result.rows);
    }, function(err){
      console.log(err.message);
    });
    return d.promise;
  };

  return self;
});
app.factory('DbItemAdd', function($q, $cordovaSQLite, $cordovaFileTransfer, $timeout){
  var self = {};
  self.downloading = true;
  var downloadImage = function(url){
    url = "http://192.168.1.10:8080/Laravel/VGPT/resources/" + url;
    var trustHosts = true;
    var options = {};
    var filename = url.split("/").pop();
    //console.log("filename = " + filename);
    var targetPath = cordova.file.externalApplicationStorageDirectory + filename;
    $cordovaFileTransfer.download(url, targetPath, options, trustHosts)
      .then(function(result) {
        console.log("download complete from " + url);
        self.downloading = false;
      }, function(err) {
        var strBuilder = [];
        for(var key in err){
              if (err.hasOwnProperty(key)) {
                 strBuilder.push("Key is " + key + ", value is " + err[key] + "\n");
            }
        }
        console.log(strBuilder.join(""));
      }, function (progress) {
        $timeout(function () {
          console.log((progress.loaded / progress.total) * 100);
          self.downloading = true;
        });
      });
  };
  self.addQuestion = function(question){
    console.log("start adding question");
    var filename = "";
    if(question.questionImageUrl.length > 4){
      downloadImage(question.questionImageUrl);
      filename = question.questionImageUrl.split("/").pop();
      question.questionImage = cordova.file.externalApplicationStorageDirectory + filename;
      console.log(question.questionImage);
    }
    if(question.aImageUrl.length > 4){
      downloadImage(question.aImageUrl);
      console.log("option IMG A");
      filename = question.aImageUrl.split("/").pop();
      question.aImg = cordova.file.externalApplicationStorageDirectory + filename;
      console.log(question.aImageUrl);
    }
    if(question.bImageUrl.length > 4){
      console.log("option IMG B");
      downloadImage(question.bImageUrl);
      filename = question.bImageUrl.split("/").pop();
      question.bImg = cordova.file.externalApplicationStorageDirectory + filename;
      console.log(question.bImageUrl);
    }
    if(question.cImageUrl.length > 4){
      console.log("option IMG C");
      downloadImage(question.cImageUrl);
      filename = question.cImageUrl.split("/").pop();
      question.cImg = cordova.file.externalApplicationStorageDirectory + filename;
      console.log(question.cImageUrl);
    }
    if(question.dImageUrl.length > 4){
      console.log("option IMG D");
      downloadImage(question.dImageUrl);
      filename = question.dImageUrl.split("/").pop();
      question.dImg = cordova.file.externalApplicationStorageDirectory + filename;
      console.log(question.dImageUrl);
    }
    db = $cordovaSQLite.openDB({name: 'my.db', location: 'default'});
    var dbObj = {
      physics: 'physicsQuestions',
      chemistry: 'chemistryQuestions',
      maths: 'mathsQuestions'
    };
    var d = $q.defer();
    //question.compulsory = (question.compulsory) ? 1 : 0;
    console.log(question.questions);
    var query = "INSERT INTO " + dbObj[question.subject.toLowerCase()] + " (topic, question, questionImage, A, AImg, B, BImg, C, CImg, D, DImg, answer, level, wrong, id, compulsory) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    $cordovaSQLite.execute(db, query, [question.topic, question.questions, question.questionImage,
                                       question.a, question.aImg, question.b, question.bImg, question.c, question.cImg,
                                       question.d, question.dImg, question.answer, question.level, 0, question.id, question.imp])
                                       .then(function(result){
                                          d.resolve();
                                          console.log("insert id = " + result.insertId);
                                        }, function(err){
                                          var strBuilder = [];
                                          for(var key in err){
                                                if (err.hasOwnProperty(key)) {
                                                   strBuilder.push("Key is " + key + ", value is " + err[key] + "\n");
                                              }
                                          }
                                          console.log(strBuilder.join(""));
                                        });
    return d.promise;
  };
  self.addVideo = function(video){
    db = $cordovaSQLite.openDB({name: 'my.db', location: 'default'});
    var dbObj = {
      physics: "physicsVideos",
      chemistry: "chemistryVideos",
      math: "mathsVideos"
    };
    var d = $q.defer();
    var query = "INSERT INTO " + dbObj[video.subject.toLowerCase()] + " (chapter, topic, intranetLink, internetLink, title, description, id) VALUES (?, ?, ?, ?, ? ,? ,?)";
    $cordovaSQLite.execute(db, query, [video.chapter, video.topic, video.intranetLink, video.internetLink, video.title, video.description, video.id])
                            .then(function(result){
                              d.resolve();
                              console.log("insert id = " + result.insertId);
                            }, function(err){
                              var strBuilder = [];
                              for(var key in err){
                                    if (err.hasOwnProperty(key)) {
                                       strBuilder.push("Key is " + key + ", value is " + err[key] + "\n");
                                  }
                              }
                              console.log(strBuilder.join(""));
                            });
    return d.promise;
  };
  /*self.addStudyMaterial = function(file){
    console.log("adding studyMaterial");
    db = $cordovaSQLite.openDB({name: 'my.db', location: 'default'});
    var dbObj = {
      physics: "physicsMaterial",
      chemistry: "chemistryMaterial",
      maths: "mathsMaterial"
    };
    var d = $q.defer();
    var query = "INSERT INTO " + dbObj[file.subject] + " (chapter, intranetLink, internetLink, title, description, onDevice, id, deviceLink, fileType) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    $cordovaSQLite.execute(db, query, [file.chapter, file.intranetLink, file.internetLink, file.title, file.description, 0, file.id, null, file.fileType])
                            .then(function(result){
                              d.resolve();
                              console.log("insert id = " + result.insertId);
                            }, function(err){
                              var strBuilder = [];
                              for(var key in err){
                                    if (err.hasOwnProperty(key)) {
                                       strBuilder.push("Key is " + key + ", value is " + err[key] + "\n");
                                  }
                              }
                              console.log(strBuilder.join(""));
                            });
    return d.promise;
  };*/
  return self;
});

app.factory('DbQuestions', function($q, $cordovaSQLite){
  var self = {};
  self.getLevel = function(topic){
    var d = $q.defer();
    db = $cordovaSQLite.openDB({name: 'my.db', location: 'default'});
    var query = "SELECT level from 'qaLevels' WHERE topic = ?";
    $cordovaSQLite.execute(db, query, [topic]).then(function(result){
      d.resolve();
      if(reult.rows.length > 0){
        self.level = result.rows.item(0).level;
      }
      else{
        console.log("found no levels");
      }
    });
    return d.promise;
  };
  self.getQuestions = function(subject, chapter){
    var dbObj = {
      physics: "physicsQuestions",
      chemistry: "chemistryQuestions",
      maths: "mathsQuestions"
    };
    var d = $q.defer();
    self.level = 0;
    db = $cordovaSQLite.openDB({name: 'my.db', location: 'default'});
    var query = "SELECT level from 'qaLevels' WHERE topic = ?";
    $cordovaSQLite.execute(db, query, [chapter]).then(function(levelResult){
      if(levelResult.rows.length > 0){
        self.level = levelResult.rows.item(0).level;
        console.log("level = " + self.level);
      }
      else{
        console.log("found no levels");
      }
      query = "SELECT question, questionImage, A, AImg, B, BImg, C, CImg, D, DImg, answer, wrong, id FROM " + dbObj[subject] + " WHERE topic = '" + chapter + "' AND level = " + self.level;
      console.log(query);
      $cordovaSQLite.execute(db, query).then(function(result){
        if(result.rows.length > 0){
          console.log(result.rows.length);  //result.rows.item(0).question
          self.questions = result.rows;
        }
        else{
          self.questions = false;
          console.log("no questions");
        }
        d.resolve();
      }, function(err){
        var strBuilder = [];
        for(var key in err){
              if (err.hasOwnProperty(key)) {
                 strBuilder.push("Key is " + key + ", value is " + err[key] + "\n");
            }
        }
        console.log(strBuilder.join(""));
      });
    });
    return d.promise;
  };
  self.removeCompulsory = function(questionsArr, subject){
    var dbObj = {
      physics: "physicsQuestions",
      chemistry: "chemistryQuestions",
      maths: "mathsQuestions"
    };
    var d = $q.defer();
    console.log("removing compulsory " + questionsArr.length);
    db = $cordovaSQLite.openDB({name: 'my.db', location: 'default'});
    var editDb = function(query, question){
      $cordovaSQLite.execute(db, query, [question]).then(function(result){
        console.log(result.insertId);
        console.log("removed");
    }, function(err){
        var strBuilder = [];
        for(var key in err){
              if (err.hasOwnProperty(key)) {
                 strBuilder.push("Key is " + key + ", value is " + err[key] + "\n");
            }
        }
        console.log(strBuilder.join(""));
        });
    };
    for(x = 0; x < questionsArr.length; x++){
      var query = "UPDATE " + dbObj[subject] + " SET compulsory = 0 WHERE question = ?";
      editDb(query, questionsArr[x]);
    }
  };
  self.addWrong = function(questionsArr, wrongArr, subject){
    var dbObj = {
      physics: "physicsQuestions",
      chemistry: "chemistryQuestions",
      maths: "mathsQuestions"
    };
    var editDb = function(query, question){
      $cordovaSQLite.execute(db, query, [question]).then(function(result){
        console.log(result.insertId);
      }, function(err){
        var strBuilder = [];
        for(var key in err){
              if (err.hasOwnProperty(key)) {
                 strBuilder.push("Key is " + key + ", value is " + err[key] + "\n");
            }
        }
        console.log(strBuilder.join(""));
      });
    };
    var d = $q.defer();
    console.log("wronging " + wrongArr.length);
    db = $cordovaSQLite.openDB({name: 'my.db', location: 'default'});
    for(x = 0; x < wrongArr.length; x++){
      var query = "UPDATE " + dbObj[subject] + " SET wrong = " + wrongArr[x] + " WHERE question = ?";
      editDb(query, questionsArr[x]);
    }
    d.resolve();
    console.log("wronged all");
    return d.promise;
  };
  self.editStats = function(){
    var d = $q.defer();

    return d.promise;
  };
  self.bookmark = function(q){
    var d = $q.defer();
    console.log("initiate bookmark");
    console.log("topic = "+q.topic);
    console.log("question = "+q.question);
    var strBuilder = [];
    for(var key in q){
          if (q.hasOwnProperty(key)) {
             strBuilder.push("Key is " + key + ", value is " + q[key] + "\n");
        }
    }
    console.log(strBuilder.join(""));
    var insertArr = [q.topic, q.question, q.questionImage, q.a, q.AImg, q.b, q.BImg, q.c, q.CImg, q.d, q.DImg, q.answer, q.level, q.wrong];
    db = $cordovaSQLite.openDB({name: 'my.db', location: 'default'});
    var query = "SELECT question FROM questionBookmarks WHERE question = ?";
    $cordovaSQLite.execute(db, query, [q.question]).then(function(result){
      if(result.rows.length === 0){
        console.log("no similarities in question image");
        query = "INSERT INTO questionBookmarks (topic, question, questionImage, A, AImg, B, BImg, C, CImg, D, DImg, answer, level, wrong) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        $cordovaSQLite.execute(db, query, insertArr).then(function(res){
          console.log(res.insertId);
          d.resolve(true);
        }, function(err){
          var strBuilder = [];
          for(var key in err){
                if (err.hasOwnProperty(key)) {
                   strBuilder.push("Key is " + key + ", value is " + err[key] + "\n");
              }
          }
          console.log(strBuilder.join(""));
        });
      }
      else if(q.questionImage !== null){
        console.log("similar question text");
        query = "SELECT questionImage FROM questionBookmarks WHERE questionImage = ?";
        $cordovaSQLite.execute(db, query, [q.questionImage]).then(function(result){
          if(result.rows.length === 0){
            console.log("no similarities in image");
            query = "INSERT INTO questionBookmarks (topic, question, questionImage, A, AImg, B, BImg, C, CImg, D, DImg, answer, level, wrong) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            $cordovaSQLite.execute(db, query, insertArr).then(function(res){
              console.log(res.insertId);
              d.resolve(true);
            }, function(err){
              var strBuilder = [];
              for(var key in err){
                    if (err.hasOwnProperty(key)) {
                       strBuilder.push("Key is " + key + ", value is " + err[key] + "\n");
                  }
              }
              console.log(strBuilder.join(""));
            });
          }
          else{
            d.resolve(false);
          }
        }, function(err){
          console.log(err.message);
        });
      }
      else{
        d.resolve(false);
      }
    }, function(err){
      var strBuilder = [];
      for(var key in err){
            if (err.hasOwnProperty(key)) {
               strBuilder.push("Key is " + key + ", value is " + err[key] + "\n");
          }
      }
      console.log(strBuilder.join(""));
    });
    return d.promise;
  };
  self.changeLevel = function(level, topic){
    var d = $q.defer();
    var query = "UPDATE qaLevels SET level = ? WHERE topic = ?";
    $cordovaSQLite.execute(db, query, [level, topic]).then(function(result){
      d.resolve();
      console.log("changed level to " + level);
    }, function(err){
      console.log(err.message);
    });
    return d.promise;
  };
  return self;
});

app.factory('DbBookmarks', function($q, $cordovaSQLite){
  var self = {};
  self.getBookmarks = function(topic){
    var d = $q.defer();
    var query = "SELECT * from questionBookmarks WHERE topic = ?";
    $cordovaSQLite.execute(db, query, [topic]).then(function(result){
        self.bookmarks = result.rows;
        d.resolve();
    }, function(err){
      console.log(err.message);
    });
    return d.promise;
  };
  self.deleteBookmark = function(question){
    var d = $q.defer();
    var quesry = "DELETE FROM questionBookmarks WHERE question = ?";
    $cordovaSQLite.execute(db, query, [question]).then(function(result){
      console.log("deleted");
      d.resolve();
    }, function(err){
      console.log(err.message);
    });
    return d.promise;
  };
  return self;
});

app.factory('DbVideos', function($q, $cordovaSQLite){
  var self = {};
  //get full list of videos for specific topic/chapter
  self.getVideosList = function(subject, topic){
    db = $cordovaSQLite.openDB({name: 'my.db', location: 'default'});
    var dbObj = {
      physics: "physicsVideos",
      chemistry: "chemistryVideos",
      maths: "mathsVideos"
    };
    var d = $q.defer();
    self.videosList = [];
    var query = "SELECT chapter, topic, source, intranetLink, internetLink, title, description, deviceLink, id, downloadDate FROM '" + dbObj[subject] + "' WHERE topic = ?";
    $cordovaSQLite.execute(db, query, [topic]).then(function(result){
      d.resolve();
      if(result.rows.length > 0){
        console.log(result.rows.length);
        self.videosList = result.rows;
      }
      else{
        console.log("no videos");
      }
    });
    return d.promise;
  };

  //get full info for video
  self.getVideo = function(video, subject){
    db = $cordovaSQLite.openDB({name: 'my.db', location: 'default'});
    var dbObj = {
      physics: "physicsVideos",
      chemistry: "chemistryVideos",
      maths: "mathsVideos"
    };
    console.log(subject);
    console.log(video);
    var d = $q.defer();
    var query = "SELECT chapter, topic, intranetLink, internetLink, title, description, id, deviceLink, downloadDate FROM '" + dbObj[subject] + "' WHERE title = ?";
    $cordovaSQLite.execute(db, query, [video]).then(function(result){
      d.resolve();
      if(result.rows.length > 0){
        console.log(result.rows.length);
        self.link = result.rows.item(0).deviceLink;
      }
      else{
        self.link = false;
        console.log("no videos");
      }
    });
    return d.promise;
  };

  //Set local storage address for videos
  self.updateDeviceLink = function(subject, address, id){
    db = $cordovaSQLite.openDB({name: 'my.db', location: 'default'});
    var dbObj = {
      physics: "physicsVideos",
      chemistry: "chemistryVideos",
      maths: "mathsVideos"
    };
    var d = $q.defer();
    var rawDate = new Date();
    var dateToday = rawDate.getMonth() + "/" + rawDate.getDate() + "/" + rawDate.getFullYear();
    var query = "UPDATE " + dbObj[subject] + " SET deviceLink = ?, downloadDate = ? WHERE id = ?";
    $cordovaSQLite.execute(db, query, [address, dateToday, id]).then(function(result){
      console.log("updated deviceLink to address = " + address);
      d.resolve();
    }, function(err){
      console.log(err.message);
    });
    return d.promise;
  };
  self.removeVideo = function(id, subject){
    var d = $q.defer();
    db = $cordovaSQLite.openDB({name: 'my.db', location: 'default'});
    var dbObj = {
      physics: "physicsVideos",
      chemistry: "chemistryVideos",
      maths: "mathsVideos"
    };
    var query = "UPDATE " + dbObj[subject] + " SET deviceLink = NULL, downloadDate = NULL WHERE id = ?";
    $cordovaSQLite.execute(db, query, [id]).then(function(result){
      console.log("deleted video from db");
      d.resolve();
    }, function(err){
      d.reject();
      console.log(err.message);
    });
    return d.promise;
  };
  return self;
});

app.factory('PointsEditor', function($q, $cordovaSQLite, $cordovaDevice){
  var self = {};
  self.appendPointsForGame = function(points, subject, topic, correct, wrong){
    //var uuid = $cordovaDevice.getUUID(();)
    console.log("insert points = " + points);
    console.log("no of wrong = " + wrong);
    var d = $q.defer();
    var query = "UPDATE user SET pointsTotal = pointsTotal + ?, pointsCurrent = pointsCurrent + ?, correct = correct + " + correct + ", wrong = wrong + " + wrong;
    $cordovaSQLite.execute(db, query, [points, points]).then(function(res){
      console.log("added points to table =  user");
    }, function(err){
      console.log(err.message);
    });
    query = "UPDATE qaSubjectStats SET points = points + ?, totalCorrect = totalCorrect + ?, totalWrong = totalWrong + ? WHERE subject = ?";
    $cordovaSQLite.execute(db, query, [points, correct, wrong, subject]).then(function(res){
      console.log("added points to table =  qaSubjectStats");
    }, function(err){
      console.log(err.message);
    });
    query = "UPDATE qaTopicStats SET points = points + ?, totalCorrect = totalCorrect + ?, totalWrong = totalWrong + ? WHERE topic = ?";
    $cordovaSQLite.execute(db, query, [points, correct, wrong, topic]).then(function(res){
      console.log("added points to table =  qaTopicStats");
    }, function(err){
      console.log(err.message);
    });
    var rawDate = new Date();
    var dateToday = rawDate.getMonth() + "/" + rawDate.getDate() + "/" + rawDate.getFullYear();
    query = "SELECT date, score FROM timeWiseStats WHERE date = ?";
    $cordovaSQLite.execute(db, query, [dateToday]).then(function(res){
      if(res.rows.length){
        /**/
        query = "UPDATE timeWiseStats SET score = score + ? WHERE date = ?";
        $cordovaSQLite.execute(db, query, [points, dateToday]).then(function(res){
          console.log("Updated timewisestats with " + "points = " + points + " " + dateToday);
        }, function(err){
          console.log(err.message);
        });
      }
      else{
        query = "INSERT INTO timeWiseStats (score, date) VALUES (?, ?)";
        $cordovaSQLite.execute(db, query, [points, dateToday]).then(function(res){
          console.log(res.insertId);
          console.log("inserted into timeWiseStats " + "points = " + points + " " + dateToday);
          d.resolve();
        }, function(err){
          console.log(err.message);
        });
      }
      console.log(res.insertId);
      //console.log("updated timeWiseStats " + dateToday);
      d.resolve();
    }, function(err){
      console.log(err.messsge);

    });
    return d.promise;
  };
  return self;
});

app.factory('DbLeaderboard', function($q, $cordovaSQLite){
  db = $cordovaSQLite.openDB({name: 'my.db', location: 'default'});
  var self = {
    today: 0,
    week: 0,
    month: 0
  };
  var db = $cordovaSQLite.openDB({name: 'my.db', location: 'default'});
  self.getScoreData = function(){
    var d = $q.defer();
    var query = "SELECT score, date FROM timeWiseStats";
    self.today = 0;
    self.week = 0;
    self.month = 0;
    console.log(query);
    $cordovaSQLite.execute(db, query).then(function(res){
      console.log(res.insertId);
      console.log(res.rows.length);
      var dateToday = new Date();
      //var dateToday = rawDate.getMonth() + "/" + rawDate.getDate() + "/" + rawDate.getFullYear();
      for(var x = 0; x < res.rows.length; x++){
        console.log("len timewise > 0");
        console.log("date = " + res.rows.item(x).date);
        console.log("score = " + res.rows.item(x).score);
        var thatDay = res.rows.item(x).date.split("/");
        ++thatDay[0];
        var someDay = new Date(String(thatDay));
        var timeDiff = Math.abs(dateToday.getTime() - someDay.getTime());
        var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
        if(diffDays <= 1){
          self.today += res.rows.item(x).score;
          self.week += res.rows.item(x).score;
          self.month += res.rows.item(x).score;
        }
        else if(diffDays <= 8){
          self.week += res.rows.item(x).score;
          self.month += res.rows.item(x).score;
        }
        else if(diffDays < 31){
          self.month += res.rows.item(x).score;
        }
      }
      d.resolve();
    }, function(err){
      console.log(err.message);
    });
    return d.promise;
  };
  self.saveRanks = function(ranks){
    console.log("month rank to save = " + ranks.Month_Rank);
    var query = "UPDATE user SET todayRank = " + ranks.Today_Rank + ", weekRank = " + ranks.Week_Rank + ", monthRank = " + ranks.Month_Rank;
    $cordovaSQLite.execute(db, query).then(function(res){
      console.log("updated user ranks");
    }, function(err){
      console.log(err.message);
    });
  };
  return self;
});

app.factory('DbTest', function($q, $cordovaSQLite){
  var self = {};
  db = $cordovaSQLite.openDB({name: 'my.db', location: 'default'});
  self.getPreviousTests = function(){
    var d = $q.defer();
    var query = "SELECT * FROM testsInfo WHERE taken = 1";
    $cordovaSQLite.execute(db, query).then(function(res){
      d.resolve(res.rows);
    }, function(err){
      console.log(err.message);
    });
    return d.promise;
  };
  self.checkCode = function(code){
    var d = $q.defer();
    var query = "SELECT * FROM testsInfo WHERE password = ?";
    $cordovaSQLite.execute(db, query, [code]).then(function(res){
      if(res.rows.length > 0){
        d.resolve(res.rows.item(0));
      }
      else{
        d.resolve(false);
      }
    }, function(err){
      console.log(err.message);
    });
    return d.promise;
  };
  self.getTest = function(code){
    var d = $q.defer();
    var query = "SELECT * FROM " + code;
    $cordovaSQLite.execute(db, query).then(function(res){
      console.log("length of data" + res.rows.length);
      d.resolve(res.rows);
    }, function(err){
      console.log(err.message);
    });
    return d.promise;
  };
  self.getTestInfo = function(code){
    var d = $q.defer();
    var query = "SELECT * FROM testsInfo WHERE password = ?";
    $cordovaSQLite.execute(db, query, [code]).then(function(res){
      if(res.rows.length > 0){
        d.resolve(res.rows.item(0));
      }
    }, function(err){
      console.log(err.message);
    });
    return d.promise;
  };
  self.setUploaded = function(code){
    var d = $q.defer();
    var query = "UPDATE testsInfo SET uploaded = 1 WHERE password = '" + code + "'";
    $cordovaSQLite.execute(db, query).then(function(res){
      console.log("set as uploaded");
      d.resolve();
    }, function(err){
      console.log(err.message);
    });
    return d.promise;
  };
  self.getAllTestsInfo = function(){
    var d = $q.defer();
    var query = "SELECT name, score, physicsScore, chemistryScore, mathsScore, password, uploaded FROM testsInfo";
    $cordovaSQLite.execute(db, query).then(function(res){
      console.log("got some tests info");
      d.resolve(res.rows);
    }, function(err){
      console.log(err.message);
    });
    return d.promise;
  };
  self.editStats = function(code, score, subjectScores){
    var d = $q.defer();
    var query = "SELECT * FROM testsInfo WHERE password = ?";
    $cordovaSQLite.execute(db, query, [code]).then(function(res){
      if(!res.rows.item(0).taken){
        query = "UPDATE testsInfo SET taken = 1, score = ?, physicsScore = ?, mathsScore = ?, chemistryScore = ? WHERE password = '" + code + "'";
        $cordovaSQLite.execute(db, query, [score, subjectScores.physics, subjectScores.math, subjectScores.chemistry]).then(function(response){
          console.log("db: test is taken & scored");
          d.resolve(res.rows.item(0).name);
        }, function(err){
          console.log(err.message);
        });
      }
      else{
        console.log("test is already taken");
      }
    }, function(err){
      console.log(err.message);
    });
    return d.promise;
  };
  self.storeTimeElapsed = function(code, time){
    query = "UPDATE testsInfo SET elapsedTime = ? WHERE password = '" + code + "'";
    $cordovaSQLite.execute(db, query, [time]).then(function(res){
      console.log("db: updated elapsedTime " + time);
    }, function(err){
      console.log(err.message);
    });
  };
  return self;
});

app.factory('DbDpp', function($q, $cordovaSQLite){
  db = $cordovaSQLite.openDB({name: 'my.db', location: 'default'});
  self = {};
  self.getDppList = function(subject, topic){
    var d = $q.defer();
    var query = "SELECT * FROM " + subject + "Material WHERE topic = ?";
    $cordovaSQLite.execute(db, query, [topic]).then(function(res){
      if(res.rows.length > 0){
        console.log("db: getting dpp " + topic);
        d.resolve(res.rows);
      }
      else{
        console.log("dpp empty");
      }
    }, function(err){
      console.log(err.message);
    });
    return d.promise;
  };
  return self;
});
