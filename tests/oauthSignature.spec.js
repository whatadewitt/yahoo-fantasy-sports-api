import { generate } from "../helpers/oauthSignature.mjs";

var vectors = require("./oauth-vectors");

describe("helper : oauthSignature", function () {
  it("should be defined", function () {
    expect(generate).not.toBe(null);
  });

  // Golden vectors captured from oauth-signature@1.5.0 before it was removed.
  // The rfc5849 case is additionally anchored to the signature published in
  // RFC 5849 section 3.4.1.1, so matching these means matching the spec and
  // not merely reproducing the old library's quirks.
  describe(": golden vectors", function () {
    vectors.forEach(function (v) {
      it("should match oauth-signature for: " + v.name, function () {
        expect(
          generate(v.method, v.url, v.params, v.consumerSecret, v.tokenSecret)
        ).toBe(v.expected);
      });
    });
  });

  describe(": unencoded output", function () {
    vectors.forEach(function (v) {
      it("should match unencoded signature for: " + v.name, function () {
        expect(
          generate(v.method, v.url, v.params, v.consumerSecret, v.tokenSecret, {
            encodeSignature: false,
          })
        ).toBe(v.expectedRaw);
      });
    });
  });

  describe(": rfc 5849", function () {
    it("should produce the signature published in RFC 5849 section 3.4.1.1", function () {
      var rfc = vectors.filter(function (v) {
        return v.name === "rfc5849 official example";
      })[0];

      expect(
        generate(rfc.method, rfc.url, rfc.params, rfc.consumerSecret, rfc.tokenSecret, {
          encodeSignature: false,
        })
      ).toBe("r6/TJjbCOr97/+UU0NsvSne7s5g=");
    });
  });
});
