module.exports = [
  {
    "name": "yahoo metadata url",
    "method": "GET",
    "url": "https://fantasysports.yahooapis.com/fantasy/v2/game/328/metadata",
    "params": {
      "format": "json",
      "oauth_consumer_key": "dj0yJmk9",
      "oauth_signature_method": "HMAC-SHA1",
      "oauth_timestamp": 1700000000,
      "oauth_nonce": "abc123",
      "oauth_version": "1.0"
    },
    "consumerSecret": "consumersecret",
    "expected": "Ukf6nIWEmhSBfN3VFSm6FkqH3TU%3D",
    "expectedRaw": "Ukf6nIWEmhSBfN3VFSm6FkqH3TU="
  },
  {
    "name": "number timestamp coerced to string",
    "method": "GET",
    "url": "https://fantasysports.yahooapis.com/fantasy/v2/games",
    "params": {
      "oauth_timestamp": 1234567890,
      "a": 42
    },
    "consumerSecret": "s",
    "expected": "U8x196vSEnZ7otRWrsmv7qNuU6M%3D",
    "expectedRaw": "U8x196vSEnZ7otRWrsmv7qNuU6M="
  },
  {
    "name": "nonce with base64 chars + / =",
    "method": "GET",
    "url": "https://fantasysports.yahooapis.com/fantasy/v2/games",
    "params": {
      "oauth_nonce": "ab+cd/ef==",
      "format": "json"
    },
    "consumerSecret": "s",
    "expected": "vX0wsdd3dCLYv05HOR%2FFocnwLlA%3D",
    "expectedRaw": "vX0wsdd3dCLYv05HOR/FocnwLlA="
  },
  {
    "name": "semicolon path (yahoo collection form)",
    "method": "GET",
    "url": "https://fantasysports.yahooapis.com/fantasy/v2/games;game_keys=328",
    "params": {
      "format": "json"
    },
    "consumerSecret": "s",
    "expected": "P239IbIqCrp0fqCjEu%2FSrQ0Fq0o%3D",
    "expectedRaw": "P239IbIqCrp0fqCjEu/SrQ0Fq0o="
  },
  {
    "name": "reserved chars !'()* in value",
    "method": "GET",
    "url": "https://example.com/x",
    "params": {
      "v": "a!b'c(d)e*f"
    },
    "consumerSecret": "s",
    "expected": "zA5DjVoO5scPMzMrwsW2Zzvp62w%3D",
    "expectedRaw": "zA5DjVoO5scPMzMrwsW2Zzvp62w="
  },
  {
    "name": "reserved chars in key",
    "method": "GET",
    "url": "https://example.com/x",
    "params": {
      "k!'()*": "v"
    },
    "consumerSecret": "s",
    "expected": "xtW73FgxzsqLPTojug7BfvgmuFM%3D",
    "expectedRaw": "xtW73FgxzsqLPTojug7BfvgmuFM="
  },
  {
    "name": "unicode value",
    "method": "GET",
    "url": "https://example.com/x",
    "params": {
      "v": "héllo wörld ✓"
    },
    "consumerSecret": "s",
    "expected": "N0HqesPXfzhvVAW2bA7pbsq22DQ%3D",
    "expectedRaw": "N0HqesPXfzhvVAW2bA7pbsq22DQ="
  },
  {
    "name": "empty string value",
    "method": "GET",
    "url": "https://example.com/x",
    "params": {
      "a": "",
      "b": "x"
    },
    "consumerSecret": "s",
    "expected": "7srz%2FEpajhxQIn%2FOaU%2FZ5tILW4I%3D",
    "expectedRaw": "7srz/EpajhxQIn/OaU/Z5tILW4I="
  },
  {
    "name": "zero value (falsy quirk)",
    "method": "GET",
    "url": "https://example.com/x",
    "params": {
      "a": 0,
      "b": "x"
    },
    "consumerSecret": "s",
    "expected": "dIU5MrZzZq6HK3BrriuQK7PfAJE%3D",
    "expectedRaw": "dIU5MrZzZq6HK3BrriuQK7PfAJE="
  },
  {
    "name": "array value sorted",
    "method": "GET",
    "url": "https://example.com/x",
    "params": {
      "a": [
        "z",
        "b",
        "a"
      ]
    },
    "consumerSecret": "s",
    "expected": "XUN%2B%2F1P4Z7Oj%2FgqfLP9G%2Ba5JQQ4%3D",
    "expectedRaw": "XUN+/1P4Z7Oj/gqfLP9G+a5JQQ4="
  },
  {
    "name": "key sort order by encoded key",
    "method": "GET",
    "url": "https://example.com/x",
    "params": {
      "0": "4",
      "b": "1",
      "A": "2",
      "a": "3",
      "_": "5",
      "~": "6"
    },
    "consumerSecret": "s",
    "expected": "TZHJ15bMwVgaJ%2FvdXzZYfKxiV30%3D",
    "expectedRaw": "TZHJ15bMwVgaJ/vdXzZYfKxiV30="
  },
  {
    "name": "default port 443 stripped",
    "method": "GET",
    "url": "https://example.com:443/x",
    "params": {
      "a": "1"
    },
    "consumerSecret": "s",
    "expected": "aMHXmau4ftFqJLOtmLX7%2BZHyOJw%3D",
    "expectedRaw": "aMHXmau4ftFqJLOtmLX7+ZHyOJw="
  },
  {
    "name": "default port 80 stripped",
    "method": "GET",
    "url": "http://example.com:80/x",
    "params": {
      "a": "1"
    },
    "consumerSecret": "s",
    "expected": "9WOH0cQRw1MhxhBLpkf57tRymlQ%3D",
    "expectedRaw": "9WOH0cQRw1MhxhBLpkf57tRymlQ="
  },
  {
    "name": "non-default port kept",
    "method": "GET",
    "url": "https://example.com:8443/x",
    "params": {
      "a": "1"
    },
    "consumerSecret": "s",
    "expected": "dBLAsRfVOWf6Blum1%2FQ9qJ5OQZ4%3D",
    "expectedRaw": "dBLAsRfVOWf6Blum1/Q9qJ5OQZ4="
  },
  {
    "name": "uppercase host lowercased",
    "method": "GET",
    "url": "https://EXAMPLE.COM/X",
    "params": {
      "a": "1"
    },
    "consumerSecret": "s",
    "expected": "pGhgnQ4qZv7M38boNy8KIjtSQu8%3D",
    "expectedRaw": "pGhgnQ4qZv7M38boNy8KIjtSQu8="
  },
  {
    "name": "lowercase method uppercased",
    "method": "get",
    "url": "https://example.com/x",
    "params": {
      "a": "1"
    },
    "consumerSecret": "s",
    "expected": "aMHXmau4ftFqJLOtmLX7%2BZHyOJw%3D",
    "expectedRaw": "aMHXmau4ftFqJLOtmLX7+ZHyOJw="
  },
  {
    "name": "POST method",
    "method": "POST",
    "url": "https://example.com/x",
    "params": {
      "a": "1"
    },
    "consumerSecret": "s",
    "expected": "e%2BQPtvPSE1%2FTL%2FFMAAmmPnrWPlc%3D",
    "expectedRaw": "e+QPtvPSE1/TL/FMAAmmPnrWPlc="
  },
  {
    "name": "token secret provided",
    "method": "GET",
    "url": "https://example.com/x",
    "params": {
      "a": "1"
    },
    "consumerSecret": "cs",
    "tokenSecret": "tokensecret",
    "expected": "VbNKZslhu%2Bg87ICUUWmYywB4K0Q%3D",
    "expectedRaw": "VbNKZslhu+g87ICUUWmYywB4K0Q="
  },
  {
    "name": "secret with reserved chars",
    "method": "GET",
    "url": "https://example.com/x",
    "params": {
      "a": "1"
    },
    "consumerSecret": "se!cr'et(*)",
    "expected": "pFI6Qw00k%2FO%2FK1zu%2F9VVNv3Oso0%3D",
    "expectedRaw": "pFI6Qw00k/O/K1zu/9VVNv3Oso0="
  },
  {
    "name": "no params",
    "method": "GET",
    "url": "https://example.com/x",
    "params": {},
    "consumerSecret": "s",
    "expected": "7s%2BWf2E8hP8nbcfnr%2FFVYhlop54%3D",
    "expectedRaw": "7s+Wf2E8hP8nbcfnr/FVYhlop54="
  },
  {
    "name": "root path",
    "method": "GET",
    "url": "https://example.com",
    "params": {
      "a": "1"
    },
    "consumerSecret": "s",
    "expected": "GmVVivWQrqUfJ1%2FHQgK34ozBN5Y%3D",
    "expectedRaw": "GmVVivWQrqUfJ1/HQgK34ozBN5Y="
  },
  {
    "name": "rfc5849 official example",
    "method": "POST",
    "url": "http://example.com/request",
    "params": {
      "b5": "=%3D",
      "a3": [
        "a",
        "2 q"
      ],
      "c@": "",
      "a2": "r b",
      "c2": "",
      "oauth_consumer_key": "9djdj82h48djs9d2",
      "oauth_token": "kkk9d7dh3k39sjv7",
      "oauth_signature_method": "HMAC-SHA1",
      "oauth_timestamp": "137131201",
      "oauth_nonce": "7d8f3e4a"
    },
    "consumerSecret": "j49sk3j29djd",
    "tokenSecret": "dh893hdasih9",
    "expected": "r6%2FTJjbCOr97%2F%2BUU0NsvSne7s5g%3D",
    "expectedRaw": "r6/TJjbCOr97/+UU0NsvSne7s5g="
  }
];

