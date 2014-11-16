var teamHelper = require('../helpers/teamHelper.js');

exports.players = function(teamKey, cb) {
  var self = this;

  this
    .api('http://fantasysports.yahooapis.com/fantasy/v2/team/' + teamKey + '/roster/players?format=json')
    .then(function(data) {
      var team = teamHelper.mapTeam(data.fantasy_content.team[0]);
      var roster = teamHelper.mapRoster(data.fantasy_content.team[1].roster);

      team.roster = roster;

      cb(team);
    }, function(e) {
      self.err(e, cb);
    });
};
