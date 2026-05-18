const { escapeXml, buildRosterPayload } = require("../dist/cjs/helpers/xmlHelper");

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
