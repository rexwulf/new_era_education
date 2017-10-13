// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
var db = null;

angular.module('starter', ['ionic', 'starter.controllers', 'ngCordova', 'update.controller', 'qa.controller', 'videos.controller', 'leaderboard.controller', 'bookmark.controller', 'test.controller', 'dpp.controller', 'user.controller', 'ionic-material', 'ionMdInput'])

.run(function($ionicPlatform, $cordovaSQLite) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      //cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
    var dbDel = function(date){
      var query = "DELETE FROM timeWiseStats WHERE date = ?";
      $cordovaSQLite.execute(db, query, [date]).then(function(res){
        console.log(res.insertId);
      }, function(err){
        console.log(err.message);
      });
    };
    db = $cordovaSQLite.openDB({name: 'my.db', location: 'default'});
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS timeWiseStats (score Int, date text)");
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS user (firstname text, lastname text, deviceId text, admnNo text, batch text, accessMethod text, pointsTotal Int DEFAULT 0, pointsCurrent Int DEFAULT 0, level Int DEFAULT 0, correct Int DEFAULT 0, wrong Int DEFAULT 0, todayRank Int DEFAULT 0, weekRank Int DEFAULT 0, monthRank Int DEFAULT 0)").then(function(res){
      console.log("dreated user");
    }, function(err){
      console.log(err.message);
    });
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS physicsQuestions (chapter text, topic text, question text, questionImage text, A text, AImg text, B text, BImg text, C text, CImg text, D text, DImg text, answer text, level Tinyint, wrong Tinyint DEFAULT 0, id Int, compulsory Tinyint DEFAULT 0)");
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS chemistryQuestions (chapter text, topic text, question text, questionImage text, A text, AImg text, B text, BImg text, C text, CImg text, D text, DImg text, answer text, level Tinyint, wrong Tinyint DEFAULT 0, id Int, compulsory Tinyint DEFAULT 0)");
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS mathsQuestions (chapter text, topic text, question text, questionImage text, A text, AImg text, B text, BImg text, C text, CImg text, D text, DImg text, answer text, level Tinyint, wrong Tinyint DEFAULT 0, id Int, compulsory Tinyint DEFAULT 0)");
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS physicsVideos (chapter text, topic text, source text, intranetLink text, internetLink text, title text, description text, id Int, deviceLink text, downloadDate text)");
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS chemistryVideos (chapter text, topic text, source text, intranetLink text, internetLink text, title text, description text, id Int, deviceLink text, downloadDate text)");
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS mathsVideos (chapter text, topic text, source text, intranetLink text, internetLink text, title text, description text, id Int, deviceLink text, downloadDate text)");
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS physicsMaterial (chapter text, topic text, intranetLink text, internetLink text, title text, description text, onDevice Bit, id Int, deviceLink text, fileType text)");
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS chemistryMaterial (chapter text, topic text, intranetLink text, internetLink text, title text, description text, onDevice Bit, id Int, deviceLink text, fileType text)");
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS mathsMaterial (chapter text, topic text, intranetLink text, internetLink text, title text, description text, onDevice Bit, id Int, deviceLink text, fileType text)");
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS qaLevels (subject text, chapter text, topic text, level Tinyint DEFAULT 0)");
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS questionBookmarks (subject text, topic text, question text, questionImage text, A text, AImg text, B text, BImg text, C text, CImg text, D text, DImg text, answer text, level Tinyint, wrong Tinyint DEFAULT 0)");
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS qaSubjectStats (subject text, points Int DEFAULT 0, totalCorrect Int DEFAULT 0, totalWrong Int DEFAULT 0)");
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS qaTopicStats (topic text, points Int DEFAULT 0, totalCorrect Int DEFAULT 0, totalWrong Int DEFAULT 0)");
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS testsInfo (taken Bit, date text, password text, name text, subjects text, time Int, elapsedTime Int, correct Int, wrong Int, score Int, physicsScore Int, mathsScore Int, chemistryScore Int, uploaded Bit)");
    $cordovaSQLite.execute(db, "SELECT * FROM timeWiseStats").then(function(res){
      if(res.rows.length > 0){
        var dateToday = new Date();
        //var dateToday = rawDate.getMonth() + "/" + rawDate.getDate() + "/" + rawDate.getFullYear();
        for(var x = 0; x < res.rows.length; x++){
          var thatDay = res.rows.item(x).date.split("/");
          ++thatDay[0];
          var someDay = new Date(String(thatDay));
          var timeDiff = Math.abs(dateToday.getTime() - someDay.getTime());
          var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
            console.log("diffDays diff = " + diffDays);
          if(diffDays >= 30){
            dbDel(res.rows.item(x).date);
            console.log("del score from " + res.rows.item(x).date);
          }
        }
      }
      else{
        console.log("nothing in time wise stats");
      }
    }, function(err){
      console.log(err.message);
    });
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.settings', {
    url: '/settings',
    views: {
      'menuContent': {
        templateUrl: 'templates/settings.html',
        controller: 'AppCtrl'
      }
    }
  })

  .state('app.update', {
    url: '/update',
    views: {
      'menuContent': {
        templateUrl: 'templates/update.html',
        controller: 'UpdateCtrl'
      }
    }
  })

  .state('app.qa', {
    url: '/qa',
    views: {
      'menuContent': {
        templateUrl: 'templates/qa.html',
        controller: 'QaCtrl'
      }
    }
  })

  .state('app.qaStats', {
    url: '/qa/stats',
    views: {
      'menuContent': {
        templateUrl: 'templates/qaStats.html',
        controller: 'QaStatsCtrl'
      }
    }
  })
  .state('app.about', {
    url: '/about',
    views: {
      'menuContent': {
        templateUrl: 'templates/about.html',

      }
    }
  })

  .state('app.qaDir', {
    url: '/qa/:subject',
    views: {
      'menuContent': {
        templateUrl: 'templates/qaDirectorySubject.html',
        controller: 'QaDirectoryCtrl'
      }
    }
  })

  .state('app.qaGame', {
    url: '/qa/game/:subject/:topic',
    views: {
      'menuContent': {
        templateUrl: 'templates/qaGame.html',
        controller: 'QaGameCtrl'
      }
    },
    cache: false
  })

  .state('app.qaGameEnd', {
    url: '/qa/game/end',
    views: {
      'menuContent': {
        templateUrl: 'templates/qaEnd.html',
        controller: 'QaEndCtrl'
      }
    },
    cache: false
  })

  .state('app.videos', {
    url: '/videos',
    views: {
      'menuContent': {
        templateUrl: 'templates/videos.html',
        controller: 'VideosCtrl'
      }
    }
  })

  .state('app.videosDir', {
    url: '/videos/:subject',
    views: {
      'menuContent': {
        templateUrl: 'templates/videosDir.html',
        controller: 'VideosDirCtrl'
      }
    }
  })

  .state('app.videosSubDir', {
    url: '/videos/:subject/:topic/',
    views: {
      'menuContent': {
        templateUrl: 'templates/videosSubDir.html',
        controller: 'VideosSubDirCtrl'
      }
    },
    cache: false
  })

  .state('app.bookmarks', {
    url: '/bookmarks',
    views: {
      'menuContent': {
        templateUrl: 'templates/bookmarks.html',
        controller: 'BookmarkCtrl'
      }
    }
  })

  .state('app.bookmarksTopic', {
    url: '/bookmarks/:subject',
    views: {
      'menuContent': {
        templateUrl: 'templates/bookmarksTopics.html',
        controller: 'BookmarkTopicsCtrl'
      }
    }
  })

  .state('app.bookmarksList', {
    url: '/bookmarks/:subject/:topic',
    views: {
      'menuContent': {
        templateUrl: 'templates/bookmarksList.html',
        controller: 'BookmarkListCtrl'
      }
    }
  })

  .state('app.bookmarksQuestion', {
    url: '/bookmarks/:subject/:topic/question',
    views: {
      'menuContent': {
        templateUrl: 'templates/bookmarkQuestion.html',
        controller: 'BookmarkQuestionCtrl'
      }
    },
    cache: false
  })
  .state('app.leaderToday', {
        url: '/leaderToday',
        views: {
            'menuContent': {
                templateUrl: 'templates/leaderToday.html',
                controller: 'LeaderboardCtrl'
            },
            'fabContent': {

            }
        },
        cache: false
    })
    .state('app.leaderWeekly', {
        url: '/leaderWeekly',
        views: {
            'menuContent': {
                templateUrl: 'templates/leaderWeekly.html',
                controller: 'LeaderboardCtrl'
            },
            'fabContent': {

            }
        },
        cache: false
    })
    .state('app.leaderMonthly', {
        url: '/leaderMonthly',
        views: {
            'menuContent': {
                templateUrl: 'templates/leaderMonthly.html',
                controller: 'LeaderboardCtrl'
            },
            'fabContent': {

            }
        },
        cache: false
    })
  /*.state('app.leaderboard', {
    url: '/leaderboard',
    views: {
      'menuContent': {
        templateUrl: 'templates/leaderboard.html',
        controller: 'LeaderboardCtrl'
      }
    }
  })*/

  .state('app.testList', {
    url: '/testlist',
    views: {
      'menuContent': {
        templateUrl: 'templates/testList.html',
        controller: 'TestListCtrl'
      }
    }
  })

  .state('app.testOverview', {
    url: '/testlist/:password',
    views: {
      'menuContent': {
        templateUrl: 'templates/testOverview.html',
        controller: 'TestOverviewCtrl'
      }
    }
  })

  .state('app.testQuestion', {
    url: '/testlist/:password/:subject/:question',
    views: {
      'menuContent': {
        templateUrl: 'templates/testQuestion.html',
        controller: 'TestQuestionCtrl'
      }
    }
  })

  .state('app.testEnd', {
    url: '/endTest',
    views: {
      'menuContent': {
        templateUrl: 'templates/testEnd.html',
        controller: 'TestEndCtrl'
      }
    }
  })

  .state('app.dppSubject', {
    url: '/dpp',
    views: {
      'menuContent': {
        templateUrl: 'templates/dppSubjects.html',
      }
    }
  })

  .state('app.dppTopic', {
    url: '/dpp/:subject',
    views: {
      'menuContent': {
        templateUrl: 'templates/dppTopics.html',
        controller: 'dppTopicCtrl'
      }
    }
  })
  .state('app.dppList', {
    url: '/dpp/:subject/:topic',
    views: {
      'menuContent': {
        templateUrl: 'templates/dppList.html',
        controller: 'dppListCtrl'
      }
    }
  })
  .state('app.redeem', {
    url: '/redeem',
    views: {
      'menuContent': {
        templateUrl: 'templates/redeem.html',
        controller: 'redeemCtrl'
      }
    }
  })
  .state('app.user', {
    url: '/user',
    views: {
      'menuContent': {
        templateUrl: 'templates/user.html',
        controller: 'UserCtrl'
      }
    },
    cache: false
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/user');
});
