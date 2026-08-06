const {
  escapeXml,
  buildRosterPayload,
  buildAddPayload,
  buildDropPayload,
  buildAddDropPayload,
  buildWaiverPayload,
  buildProposeTradePayload,
  buildTradeResponsePayload,
  buildEditWaiverPayload,
} = require("../dist/cjs/helpers/xmlHelper");

describe("xmlHelper.escapeXml", function () {
  it("escapes XML metacharacters", function () {
    expect(escapeXml(`a & b < c > d " e ' f`)).toBe(
      "a &amp; b &lt; c &gt; d &quot; e &apos; f"
    );
  });

  it("stringifies non-strings", function () {
    expect(escapeXml(10)).toBe("10");
  });
});

describe("xmlHelper.buildRosterPayload", function () {
  it("builds a week-coverage roster body", function () {
    const xml = buildRosterPayload({ week: 10 }, [
      { player_key: "nfl.p.1", position: "WR" },
      { player_key: "nfl.p.2", position: "BN" },
    ]);
    expect(xml).toBe(
      "<?xml version='1.0'?><fantasy_content><roster>" +
        "<coverage_type>week</coverage_type><week>10</week><players>" +
        "<player><player_key>nfl.p.1</player_key><position>WR</position></player>" +
        "<player><player_key>nfl.p.2</player_key><position>BN</position></player>" +
        "</players></roster></fantasy_content>"
    );
  });

  it("builds a date-coverage roster body", function () {
    const xml = buildRosterPayload({ date: "2026-05-17" }, [
      { player_key: "nba.p.9", position: "PG" },
    ]);
    expect(xml).toBe(
      "<?xml version='1.0'?><fantasy_content><roster>" +
        "<coverage_type>date</coverage_type><date>2026-05-17</date><players>" +
        "<player><player_key>nba.p.9</player_key><position>PG</position></player>" +
        "</players></roster></fantasy_content>"
    );
  });
});

describe("xmlHelper transaction create builders", function () {
  it("buildAddPayload", function () {
    expect(buildAddPayload("nfl.p.1", "nfl.l.1.t.1")).toBe(
      "<?xml version='1.0'?><fantasy_content><transaction>" +
        "<type>add</type><player><player_key>nfl.p.1</player_key>" +
        "<transaction_data><type>add</type>" +
        "<destination_team_key>nfl.l.1.t.1</destination_team_key>" +
        "</transaction_data></player></transaction></fantasy_content>"
    );
  });

  it("buildDropPayload", function () {
    expect(buildDropPayload("nfl.p.2", "nfl.l.1.t.1")).toBe(
      "<?xml version='1.0'?><fantasy_content><transaction>" +
        "<type>drop</type><player><player_key>nfl.p.2</player_key>" +
        "<transaction_data><type>drop</type>" +
        "<source_team_key>nfl.l.1.t.1</source_team_key>" +
        "</transaction_data></player></transaction></fantasy_content>"
    );
  });

  it("buildAddDropPayload", function () {
    expect(buildAddDropPayload("nfl.p.1", "nfl.p.2", "nfl.l.1.t.1")).toBe(
      "<?xml version='1.0'?><fantasy_content><transaction>" +
        "<type>add/drop</type><players>" +
        "<player><player_key>nfl.p.1</player_key><transaction_data>" +
        "<type>add</type><destination_team_key>nfl.l.1.t.1</destination_team_key>" +
        "</transaction_data></player>" +
        "<player><player_key>nfl.p.2</player_key><transaction_data>" +
        "<type>drop</type><source_team_key>nfl.l.1.t.1</source_team_key>" +
        "</transaction_data></player>" +
        "</players></transaction></fantasy_content>"
    );
  });

  it("buildWaiverPayload with faab and no drop", function () {
    expect(buildWaiverPayload("nfl.p.1", "nfl.l.1.t.1", { faab_bid: 17 })).toBe(
      "<?xml version='1.0'?><fantasy_content><transaction>" +
        "<type>add</type><faab_bid>17</faab_bid>" +
        "<player><player_key>nfl.p.1</player_key><transaction_data>" +
        "<type>add</type><destination_team_key>nfl.l.1.t.1</destination_team_key>" +
        "</transaction_data></player></transaction></fantasy_content>"
    );
  });

  it("buildWaiverPayload with faab and drop", function () {
    expect(
      buildWaiverPayload("nfl.p.1", "nfl.l.1.t.1", {
        faab_bid: 5,
        drop_player_key: "nfl.p.2",
      })
    ).toBe(
      "<?xml version='1.0'?><fantasy_content><transaction>" +
        "<type>add/drop</type><faab_bid>5</faab_bid><players>" +
        "<player><player_key>nfl.p.1</player_key><transaction_data>" +
        "<type>add</type><destination_team_key>nfl.l.1.t.1</destination_team_key>" +
        "</transaction_data></player>" +
        "<player><player_key>nfl.p.2</player_key><transaction_data>" +
        "<type>drop</type><source_team_key>nfl.l.1.t.1</source_team_key>" +
        "</transaction_data></player>" +
        "</players></transaction></fantasy_content>"
    );
  });
});

describe("xmlHelper trade builders", function () {
  it("buildProposeTradePayload with note", function () {
    expect(
      buildProposeTradePayload("t.1", "t.2", {
        send: ["p.a"],
        receive: ["p.b"],
        trade_note: "deal?",
      })
    ).toBe(
      "<?xml version='1.0'?><fantasy_content><transaction>" +
        "<type>pending_trade</type><trader_team_key>t.1</trader_team_key>" +
        "<tradee_team_key>t.2</tradee_team_key><trade_note>deal?</trade_note>" +
        "<players>" +
        "<player><player_key>p.a</player_key><transaction_data>" +
        "<type>pending_trade</type><source_team_key>t.1</source_team_key>" +
        "<destination_team_key>t.2</destination_team_key></transaction_data></player>" +
        "<player><player_key>p.b</player_key><transaction_data>" +
        "<type>pending_trade</type><source_team_key>t.2</source_team_key>" +
        "<destination_team_key>t.1</destination_team_key></transaction_data></player>" +
        "</players></transaction></fantasy_content>"
    );
  });

  it("buildProposeTradePayload without note omits trade_note", function () {
    const xml = buildProposeTradePayload("t.1", "t.2", {
      send: ["p.a"],
      receive: [],
    });
    expect(xml.indexOf("<trade_note>")).toBe(-1);
  });

  it("buildTradeResponsePayload accept with note", function () {
    expect(
      buildTradeResponsePayload("k1", "accept", { trade_note: "ok" })
    ).toBe(
      "<?xml version='1.0'?><fantasy_content><transaction>" +
        "<transaction_key>k1</transaction_key><type>pending_trade</type>" +
        "<action>accept</action><trade_note>ok</trade_note>" +
        "</transaction></fantasy_content>"
    );
  });

  it("buildTradeResponsePayload vote_against with voter", function () {
    expect(
      buildTradeResponsePayload("k1", "vote_against", { voter_team_key: "t.9" })
    ).toBe(
      "<?xml version='1.0'?><fantasy_content><transaction>" +
        "<transaction_key>k1</transaction_key><type>pending_trade</type>" +
        "<action>vote_against</action><voter_team_key>t.9</voter_team_key>" +
        "</transaction></fantasy_content>"
    );
  });

  it("buildEditWaiverPayload with priority and faab", function () {
    expect(
      buildEditWaiverPayload("k2", { priority: 2, faab_bid: 8 })
    ).toBe(
      "<?xml version='1.0'?><fantasy_content><transaction>" +
        "<transaction_key>k2</transaction_key><type>waiver</type>" +
        "<waiver_priority>2</waiver_priority><faab_bid>8</faab_bid>" +
        "</transaction></fantasy_content>"
    );
  });
});
