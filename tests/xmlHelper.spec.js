const { escapeXml } = require("../dist/cjs/helpers/xmlHelper");

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
