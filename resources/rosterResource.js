// module.exports = function(teamKey, cb) {
//   this
//     .api('http://fantasysports.yahooapis.com/fantasy/v2/team/' + teamKey + '/roster?format=json')
//     .then(function(data) {
//       var roster = data.fantasy_content;

//       cb(roster);
//     });
// };

exports.players = function(teamKey, cb) {
  this
    .api('http://fantasysports.yahooapis.com/fantasy/v2/team/' + teamKey + '/roster/players?format=json')
    .then(function(data) {
      var roster = data.fantasy_content;

      cb(roster);
    });
};
