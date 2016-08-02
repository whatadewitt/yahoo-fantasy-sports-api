var YahooFantasy = require('../../index.js');
var nock = require('nock');
var q = require('q');

describe ("resource : gameResource", function(){
  var yf = new YahooFantasy(
    'Y!APPLICATION_KEY',
    'Y!APPLICATION_SECRET'),
    game = yf.game;

  it ("should be defined", function() {
    expect(game).not.toBe(null);
  });

  // functions
  it ("should have a meta function", function() {
    expect(game.meta).not.toBe(null);
  });

  it ("should have a leagues function", function() {
    expect(game.leagues).not.toBe(null);
  });

  it ("should have a players function", function() {
    expect(game.players).not.toBe(null);
  });

  it ("should have a game_weeks function", function() {
    expect(game.game_weeks).not.toBe(null);
  });

  it ("should have a stat_categories function", function() {
    expect(game.stat_categories).not.toBe(null);
  });

  it ("should have a position_types function", function() {
    expect(game.position_types).not.toBe(null);
  });

  it ("should have a roster_positions function", function() {
    expect(game.roster_positions).not.toBe(null);
  });

  // meta
  describe(": meta", function(){
    var meta = require('../nock-data/gameMeta').meta;
    
    it ("should build a proper url to retrieve metadata via a numeric game key", function(done) {      
      nock('http://fantasysports.yahooapis.com')
        .get("/fantasy/v2/game/328/metadata?format=json")
        .reply(200, meta);

      game.meta(328, function(e, data) {
        expect(data).toEqual(meta.fantasy_content.game[0]);
        done();
      });
    });

    it ("should build a proper url to retrieve metadata via a string game key", function(done) {
      nock('http://fantasysports.yahooapis.com')
        .get("/fantasy/v2/game/mlb/metadata?format=json")
        .reply(200, meta);

      game.meta('mlb', function(e, data) {
        expect(data).toEqual(meta.fantasy_content.game[0]);
        done();
      });
    });
  });

  // leagues
  describe(": leagues", function(){
    it ("should build a proper url to retrieve league data for a single league using a numeric game key", function() {
      game.leagues(328, '328.l.34014', null);

      expect(yf.api)
        .toHaveBeenCalledWith("http://fantasysports.yahooapis.com/fantasy/v2/game/328/leagues;league_keys=328.l.34014?format=json");
    });

    it ("should build a proper url to retrieve league data for a single league using a string game key", function() {
      game.leagues('mlb', 'mlb.l.34014', null);

      expect(yf.api)
        .toHaveBeenCalledWith("http://fantasysports.yahooapis.com/fantasy/v2/game/mlb/leagues;league_keys=mlb.l.34014?format=json");
    });

    it ("should build a proper url to retrieve league data for a single league using a numeric game key and league as an array", function() {
      game.leagues(328, ['328.l.34014'], null);

      expect(yf.api)
        .toHaveBeenCalledWith("http://fantasysports.yahooapis.com/fantasy/v2/game/328/leagues;league_keys=328.l.34014?format=json");
    });

    it ("should build a proper url to retrieve league data for a single league using a string game key and league as an array", function() {
      game.leagues('mlb', ['mlb.l.34014'], null);

      expect(yf.api)
        .toHaveBeenCalledWith("http://fantasysports.yahooapis.com/fantasy/v2/game/mlb/leagues;league_keys=mlb.l.34014?format=json");
    });

    it ("should build a proper url to retrieve league data for a multiple leagues using a numeric game key", function() {
      game.leagues(328, ['328.l.34014', '328.l.24281'], null);

      expect(yf.api)
        .toHaveBeenCalledWith("http://fantasysports.yahooapis.com/fantasy/v2/game/328/leagues;league_keys=328.l.34014,328.l.24281?format=json");
    });

    it ("should build a proper url to retrieve league data for a multiple leagues using a string game key", function() {
      game.leagues('mlb', ['mlb.l.34014', 'mlb.l.24281'], null);

      expect(yf.api)
        .toHaveBeenCalledWith("http://fantasysports.yahooapis.com/fantasy/v2/game/mlb/leagues;league_keys=mlb.l.34014,mlb.l.24281?format=json");
    });
  });

  // players
  it ("should build a proper url to retrieve player data for a single player using a numeric game key", function() {
    game.players(328, '328.p.6619', null);

    expect(yf.api)
      .toHaveBeenCalledWith("http://fantasysports.yahooapis.com/fantasy/v2/game/328/players;player_keys=328.p.6619?format=json");
  });

  it ("should build a proper url to retrieve player data for a single player using a string game key", function() {
    game.players('mlb', 'mlb.p.6619', null);

    expect(yf.api)
      .toHaveBeenCalledWith("http://fantasysports.yahooapis.com/fantasy/v2/game/mlb/players;player_keys=mlb.p.6619?format=json");
  });

  it ("should build a proper url to retrieve player data for a single player using a numeric game key and player as an array", function() {
    game.players(328, ['328.p.6619'], null);

    expect(yf.api)
      .toHaveBeenCalledWith("http://fantasysports.yahooapis.com/fantasy/v2/game/328/players;player_keys=328.p.6619?format=json");
  });

  it ("should build a proper url to retrieve player data for a single player using a string game key and player as an array", function() {
    game.players('mlb', ['mlb.p.6619'], null);

    expect(yf.api)
      .toHaveBeenCalledWith("http://fantasysports.yahooapis.com/fantasy/v2/game/mlb/players;player_keys=mlb.p.6619?format=json");
  });

  it ("should build a proper url to retrieve player data for a multiple players using a numeric game key", function() {
    game.players(328, ['328.p.6619', '328.p.8172'], null);

    expect(yf.api)
      .toHaveBeenCalledWith("http://fantasysports.yahooapis.com/fantasy/v2/game/328/players;player_keys=328.p.6619,328.p.8172?format=json");
  });

  it ("should build a proper url to retrieve player data for a multiple players using a string game key", function() {
    game.players('mlb', ['mlb.p.6619', 'mlb.p.8172'], null);

    expect(yf.api)
      .toHaveBeenCalledWith("http://fantasysports.yahooapis.com/fantasy/v2/game/mlb/players;player_keys=mlb.p.6619,mlb.p.8172?format=json");
  });

  // game_weeks
  it ("should build a proper url to retrieve game weeks using a numeric game key", function() {
    game.game_weeks(328, null);

    expect(yf.api)
      .toHaveBeenCalledWith("http://fantasysports.yahooapis.com/fantasy/v2/game/328/game_weeks?format=json");
  });

  it ("should build a proper url to retrieve game weeks using a string game key", function() {
    game.game_weeks('nfl', null);

    expect(yf.api)
      .toHaveBeenCalledWith("http://fantasysports.yahooapis.com/fantasy/v2/game/nfl/game_weeks?format=json");
  });

  // stat_categories
  it ("should build a proper url to retrieve stat categories using a numeric game key", function() {
    game.stat_categories(328, null);

    expect(yf.api)
      .toHaveBeenCalledWith("http://fantasysports.yahooapis.com/fantasy/v2/game/328/stat_categories?format=json");
  });

  it ("should build a proper url to retrieve stat categories using a string game key", function() {
    game.stat_categories('nfl', null);

    expect(yf.api)
      .toHaveBeenCalledWith("http://fantasysports.yahooapis.com/fantasy/v2/game/nfl/stat_categories?format=json");
  });

  // position_types
  it ("should build a proper url to retrieve position types using a numeric game key", function() {
    game.position_types(328, null);

    expect(yf.api)
      .toHaveBeenCalledWith("http://fantasysports.yahooapis.com/fantasy/v2/game/328/position_types?format=json");
  });

  it ("should build a proper url to retrieve position types using a string game key", function() {
    game.position_types('nfl', null);

    expect(yf.api)
      .toHaveBeenCalledWith("http://fantasysports.yahooapis.com/fantasy/v2/game/nfl/position_types?format=json");
  });

  // roster_positions
  it ("should build a proper url to retrieve roster positions using a numeric game key", function() {
    game.roster_positions(328, null);

    expect(yf.api)
      .toHaveBeenCalledWith("http://fantasysports.yahooapis.com/fantasy/v2/game/328/roster_positions?format=json");
  });

  it ("should build a proper url to retrieve roster positions using a string game key", function() {
    game.roster_positions('nfl', null);

    expect(yf.api)
      .toHaveBeenCalledWith("http://fantasysports.yahooapis.com/fantasy/v2/game/nfl/roster_positions?format=json");
  });
});
