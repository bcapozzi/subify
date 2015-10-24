Players = new Mongo.Collection("players");

if (Meteor.isClient) {

  Session.set("elapsedSecs",0);
  Session.set("isRunning",false);

  Template.body.helpers({
    playersInGame: function() {
      return Players.find({current: "inGame"}, {sort: { playedSeconds: -1}});
    },
    playersOnBench: function() {
      return Players.find({current: "onBench"}, {sort: { benchSeconds: -1 }});
    },
    playersInjured: function() {
      return Players.find({current: "injured"}, {sort: { benchSeconds: -1 }});
    },
    displayRunningTime: function() {
      var num_secs = Session.get("elapsedSecs");
      var num_minutes = num_secs / 60.0;
      var num_minutes_int = Math.floor(num_minutes + 0.001);
      num_secs = num_secs - 60*num_minutes_int;
      var ss = num_secs.toString();
      var mm = num_minutes_int.toString();

      if (num_secs < 10)
        ss = "0" + ss;

      if (num_minutes_int < 10)
        mm = "0" + mm;

      return mm + ":" + ss; //Session.get("elapsedSecs");
    }
  });

  Template.body.events({

    /*
    "click .newGameButton" : function(event) {
      Session.set("elapsedSecs", 0);
      Session.set("isRunning", false);
      Players.find().collection.update({}, {$set: {playedSeconds: 0, benchSeconds: 0, current: "onBench"}}, {multi: true});
    },*/

    "click .startClock" : function(event) {
      event.target.classList.remove("startClock");
      event.target.classList.add("endClock");
      event.target.textContent = "Stop";
      event.target.blur();
      Session.set("isRunning",true);
      var interval = Meteor.setInterval(function() {
        var shouldUpdate = Session.get("isRunning");
        if (shouldUpdate) {
          var currVal = Session.get("elapsedSecs");
          currVal = currVal + 1;
          Session.set("elapsedSecs", currVal);

          // increment the playedSeconds for each player in the game
          // Collection.update({_id: {$in: [id1, id2, id3]}}, {...}, {multi:true});
          Players.find({current: "inGame"}).collection.update({current: "inGame"}, {$inc: {playedSeconds: 1}}, {multi: true});
          Players.find({current: "onBench"}).collection.update({current: "onBench"}, {$inc: {benchSeconds: 1}}, {multi: true});
          Players.find({current: "injured"}).collection.update({current: "injured"}, {$inc: {benchSeconds: 1}}, {multi: true});
          /*Players.find({current: "inGame"}, {sort: { playedSeconds: -1}}).forEach(
            function(p) {
              var updatedSecs = p.playedSeconds + 1;
              Players.update(p._id, {
                $set: {playedSeconds: updatedSecs}});
            });

          Players.find({current: "onBench"}, {sort: { benchSeconds: -1 }}).forEach(
            function(p) {
              var updatedSecs = p.benchSeconds + 1;
              Players.update(p._id, {
                $set: {benchSeconds: updatedSecs}});
            });
          */
          // console.log("Elapsed secs: " + currVal);
        }
      }, 1000);

      Session.set("interval",interval);

    },
    "click .endClock" : function(event) {
      event.target.classList.remove("endClock");
      event.target.classList.add("startClock");
      event.target.textContent = "Start";
      event.target.blur();
      Session.set("isRunning",false);
      var interval = Session.get("interval");
      Meteor.clearInterval(interval);
    }
  });
  Template.inGamePlayer.helpers({
    playingTimeFormatted: function() {
      var minutes = this.playedSeconds/60;
      var mm_int = Math.floor(minutes);
      var seconds = (minutes - mm_int)*60;
      var ss_int = Math.floor(seconds + 0.001);

      var mm = mm_int.toString();
      var ss = ss_int.toString();

      if (mm_int < 10)
        mm = "0" + mm;

      if (ss_int < 10)
        ss = "0" + ss;

      return mm + ":" + ss;


    },

    benchTimeFormatted: function() {
      var minutes = this.benchSeconds/60;
      var mm_int = Math.floor(minutes);
      var seconds = (minutes - mm_int)*60;
      var ss_int = Math.floor(seconds + 0.001);

      var mm = mm_int.toString();
      var ss = ss_int.toString();

      if (mm_int < 10)
        mm = "0" + mm;

      if (ss_int < 10)
        ss = "0" + ss;

      return mm + ":" + ss;
    }
  });

   Template.injuredPlayer.helpers({
    playingTimeFormatted: function() {
      var minutes = this.playedSeconds/60;
      var mm_int = Math.floor(minutes);
      var seconds = (minutes - mm_int)*60;
      var ss_int = Math.floor(seconds + 0.001);

      var mm = mm_int.toString();
      var ss = ss_int.toString();

      if (mm_int < 10)
        mm = "0" + mm;

      if (ss_int < 10)
        ss = "0" + ss;

      return mm + ":" + ss;


    },

    benchTimeFormatted: function() {
      var minutes = this.benchSeconds/60;
      var mm_int = Math.floor(minutes);
      var seconds = (minutes - mm_int)*60;
      var ss_int = Math.floor(seconds + 0.001);

      var mm = mm_int.toString();
      var ss = ss_int.toString();

      if (mm_int < 10)
        mm = "0" + mm;

      if (ss_int < 10)
        ss = "0" + ss;

      return mm + ":" + ss;
    }
  });

  Template.benchPlayer.helpers({
    playingTimeFormatted: function() {
      var minutes = this.playedSeconds/60;
      var mm_int = Math.floor(minutes);
      var seconds = (minutes - mm_int)*60;
      var ss_int = Math.floor(seconds + 0.001);

      var mm = mm_int.toString();
      var ss = ss_int.toString();

      if (mm_int < 10)
        mm = "0" + mm;

      if (ss_int < 10)
        ss = "0" + ss;

      return mm + ":" + ss;


    },

    benchTimeFormatted: function() {
      var minutes = this.benchSeconds/60;
      var mm_int = Math.floor(minutes);
      var seconds = (minutes - mm_int)*60;
      var ss_int = Math.floor(seconds + 0.001);

      var mm = mm_int.toString();
      var ss = ss_int.toString();

      if (mm_int < 10)
        mm = "0" + mm;

      if (ss_int < 10)
        ss = "0" + ss;

      return mm + ":" + ss;
    }
  });

  Template.benchPlayer.events({
    "click .enterGameButton" : function(event) {
       Players.update(this._id, {
        $set: {current: "inGame"}
       }
     )},
    "click .toInactiveButton" : function(event) {
       Players.update(this._id, {
        $set: {current: "injured"}
       })
    }
  });

  Template.inGamePlayer.events({
    "click .toBenchButton" : function(event) {
       Players.update(this._id, {
        $set: {current: "onBench"}
    });
    },
    "click .toInactiveButton" : function(event) {
       Players.update(this._id, {
        $set: {current: "injured"}
    });
    }
  });

  Template.injuredPlayer.events({
    "click .toBenchButton" : function(event) {
       Players.update(this._id, {
        $set: {current: "onBench"}
    });
    }
  });

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
    //if (Players.find().count() == 0)
    //{
      Players.remove({});
      Players.insert({name: "Julia", playedSeconds: 0, benchSeconds: 0, current: "onBench"});
      Players.insert({name: "Lilly", playedSeconds: 0, benchSeconds: 0, current: "onBench"});
      Players.insert({name: "Harper", playedSeconds: 0, benchSeconds: 0, current: "onBench"});
      Players.insert({name: "Neel", playedSeconds: 0, benchSeconds: 0, current: "onBench"});
      Players.insert({name: "David", playedSeconds: 0, benchSeconds: 0, current: "onBench"});
      Players.insert({name: "Gavin", playedSeconds: 0, benchSeconds: 0, current: "onBench"});
      Players.insert({name: "Caroline", playedSeconds: 0, benchSeconds: 0, current: "onBench"});
      Players.insert({name: "Ethan", playedSeconds: 0, benchSeconds: 0, current: "onBench"});
      Players.insert({name: "Lexie", playedSeconds: 0, benchSeconds: 0, current: "onBench"});
      Players.insert({name: "Catherine", playedSeconds: 0, benchSeconds: 0, current: "onBench"});
      Players.insert({name: "Isabel", playedSeconds: 0, benchSeconds: 0, current: "onBench"});
      Players.insert({name: "Nolan", playedSeconds: 0, benchSeconds: 0, current: "onBench"});
    //}
  });
}
