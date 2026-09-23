import { mapTeamPoints } from "../helpers/teamHelper.mjs";

describe("helper : teamHelper", function () {
  describe(": mapTeamPoints", function () {
    var teamPoints = { coverage_type: "week", week: "3", total: "104.5" };

    var remainingGames = {
      total: {
        remaining_games: 5,
        live_games: 1,
        completed_games: 3,
      },
    };

    it("should map team points", function () {
      var team = mapTeamPoints({}, { team_points: teamPoints });

      expect(team.points).toEqual(teamPoints);
    });

    it("should surface team_remaining_games when present", function () {
      var team = mapTeamPoints(
        {},
        { team_points: teamPoints, team_remaining_games: remainingGames }
      );

      expect(team.team_remaining_games).toEqual(remainingGames);
    });

    it("should not add team_remaining_games when absent", function () {
      var team = mapTeamPoints({}, { team_points: teamPoints });

      expect(team.hasOwnProperty("team_remaining_games")).toBe(false);
    });

    it("should map stats when present", function () {
      var team = mapTeamPoints(
        {},
        {
          team_points: teamPoints,
          team_stats: { stats: [{ stat: { stat_id: "4", value: "250" } }] },
        }
      );

      expect(team.stats).toEqual([{ stat_id: "4", value: "250" }]);
    });

    it("should map projected points when present", function () {
      var projected = { coverage_type: "week", week: "3", total: "98.2" };
      var team = mapTeamPoints(
        {},
        { team_points: teamPoints, team_projected_points: projected }
      );

      expect(team.projected_points).toEqual(projected);
    });

    it("should preserve properties already on the team", function () {
      var team = mapTeamPoints(
        { team_key: "328.l.34014.t.1", name: "Test Team" },
        { team_points: teamPoints, team_remaining_games: remainingGames }
      );

      expect(team.team_key).toBe("328.l.34014.t.1");
      expect(team.name).toBe("Test Team");
    });
  });
});
