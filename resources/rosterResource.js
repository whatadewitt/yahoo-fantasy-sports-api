var teamHelper = require('../helpers/teamHelper.js');

module.exports = RosterResource;

function RosterResource(yf) {
  this.yf = yf;
};

RosterResource.prototype.players = function(teamKey, cb) {
  var apiCallback = this._players_callback.bind(this, cb);
  
  this
    .yf
    .api(
      this.yf.GET,
      'http://fantasysports.yahooapis.com/fantasy/v2/team/' + teamKey + '/roster/players?format=json',
      apiCallback
    );
};

RosterResource.prototype._players_callback = function(cb, e, data) {
  if ( e ) return cb(e);
  
  var team = teamHelper.mapTeam(data.fantasy_content.team[0]);
  var roster = teamHelper.mapRoster(data.fantasy_content.team[1].roster);
  team.roster = roster;

  return cb(null, team);
};

// todo: need to add date, week
// https://developer.yahoo.com/fantasysports/guide/roster-resource.html#roster-resource-desc
