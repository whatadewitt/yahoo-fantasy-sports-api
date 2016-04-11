var teamHelper = require('../helpers/teamHelper.js');

module.exports = function() {
  return new RosterResource();
};

function RosterResource() {
  return this;
};

RosterResource.prototype.players = function(teamKey, cb) {
  var self = this;

  this
    .api('http://fantasysports.yahooapis.com/fantasy/v2/team/' + teamKey + '/roster/players?format=json')
    .then(function(data) {
      var team = teamHelper.mapTeam(data.fantasy_content.team[0]);
      var roster = teamHelper.mapRoster(data.fantasy_content.team[1].roster);

      team.roster = roster;

      cb(null, team);
    }, function(e) {
      // self.err(e, cb);
      cb(e, null);
    });
};

// todo: need to add date, week
// https://developer.yahoo.com/fantasysports/guide/roster-resource.html#roster-resource-desc
