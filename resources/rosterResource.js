var teamHelper = require('../helpers/teamHelper.js');

module.exports = RosterResource;

function RosterResource(yf) {
  this.yf = yf;
};

RosterResource.prototype.players = function(teamKey, cb) {
  this
    .yf
    .api('http://fantasysports.yahooapis.com/fantasy/v2/team/' + teamKey + '/roster/players?format=json')
    .then(function(data) {
      var team = teamHelper.mapTeam(data.fantasy_content.team[0]);
      var roster = teamHelper.mapRoster(data.fantasy_content.team[1].roster);

      team.roster = roster;

      cb(null, team);
    }, function(e) {
      cb(e, null);
    });
};

// todo: need to add date, week
// https://developer.yahoo.com/fantasysports/guide/roster-resource.html#roster-resource-desc
