var teamHelper = require('../helpers/teamHelper.js');

module.exports = RosterResource;

function RosterResource(yf) {
  this.yf = yf;
};

RosterResource.prototype.players = function(teamKey, date, cb) {
  var url = 'http://fantasysports.yahooapis.com/fantasy/v2/team/' + teamKey + '/roster';
  
  if ( 2 == arguments.length ) {
    cb = date;
    date = null;
  } else if ( 3 == arguments.length ) {
    if ( date.indexOf('-') > 0 ) {
      // string is date, of format y-m-d
      url += ';date=' + date;
    } else {
      // number is week...
      url += ';week=' + date;
    }  
  }
  
  var apiCallback = this._players_callback.bind(this, cb); 
  
  url += '?format=json';
  
  this
    .yf
    .api(
      this.yf.GET,
      url,
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