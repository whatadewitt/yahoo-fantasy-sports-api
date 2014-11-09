var teamHelper = require('../helpers/teamHelper.js');

exports.players = function(teamKey, cb) {
  this
    .api('http://fantasysports.yahooapis.com/fantasy/v2/team/' + teamKey + '/roster/players?format=json')
    .then(function(data) {
      var team = teamHelper.teamMap(data.team[0]);
      var roster = teamHelper.rosterMap(data.team[1].roster);

      team.roster = roster;

      cb(team);
    });
};
