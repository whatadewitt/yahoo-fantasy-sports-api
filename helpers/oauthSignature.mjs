import crypto from "crypto";

// OAuth 1.0a HMAC-SHA1 request signing (RFC 5849 section 3.4).
//
// This replaces the oauth-signature package, which was unmaintained since 2016
// and pinned crypto-js ~3.1.9-1, the subject of two critical advisories. The
// behaviour here is deliberately byte-identical to oauth-signature@1.5.0,
// including its quirks; tests/oauthSignature.spec.js pins that with golden
// vectors captured from it, plus the example signature published in RFC 5849.

// oauth-signature used the legacy global escape() for these three characters.
// Spelled out here so we do not depend on a deprecated global.
const ESCAPED = { "!": "%21", "'": "%27", "(": "%28", ")": "%29" };

function rfc3986Encode(decoded) {
  // Note: falsy in means empty string out. 0 and false never reach here as
  // numbers, they are stringified during parameter loading.
  if (!decoded) {
    return "";
  }

  return encodeURIComponent(decoded)
    .replace(/[!'()]/g, (c) => ESCAPED[c])
    .replace(/\*/g, "%2A");
}

function rfc3986Decode(encoded) {
  if (!encoded) {
    return "";
  }

  return decodeURIComponent(encoded);
}

function stringFromParameter(parameter) {
  // Arrays fall through unchanged and are expanded by loadParameterValue.
  let stringValue = parameter || "";

  if ("number" === typeof parameter || "boolean" === typeof parameter) {
    stringValue = parameter.toString();
  }

  return stringValue;
}

// Normalises into { key: [value, ...] }, matching oauth-signature's loader.
function loadParameters(parameters) {
  const loaded = {};

  const addParameter = (key, value) => {
    if (!loaded[key]) {
      loaded[key] = [];
    }
    loaded[key].push(value);
  };

  const loadParameterValue = (key, value) => {
    if (!(value instanceof Array)) {
      addParameter(key, value);
      return;
    }

    for (let i = 0; i < value.length; i++) {
      addParameter(key, stringFromParameter(value[i]));
    }

    if (0 === value.length) {
      addParameter(key, "");
    }
  };

  const loadFromObject = (obj) => {
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        loadParameterValue(key, stringFromParameter(obj[key]));
      }
    }
  };

  const source = parameters || {};

  if (source instanceof Array) {
    for (let i = 0; i < source.length; i++) {
      loadFromObject(source[i]);
    }
  } else if ("object" === typeof source) {
    loadFromObject(source);
  }

  return loaded;
}

// Sorted on the encoded key, which is what the spec requires and is not the
// same as sorting the raw key.
function normalizeParameters(parameters) {
  const loaded = loadParameters(parameters);
  const encodedKeys = Object.keys(loaded).map(rfc3986Encode).sort();
  const normalized = [];

  for (const encodedKey of encodedKeys) {
    const values = loaded[rfc3986Decode(encodedKey)].slice().sort();

    for (const value of values) {
      normalized.push(`${encodedKey}=${rfc3986Encode(value)}`);
    }
  }

  return normalized.join("&");
}

function normalizeUrl(url) {
  if (!url) {
    return url;
  }

  const withScheme = -1 === url.indexOf("://") ? `http://${url}` : url;
  const parsed = new URL(withScheme);

  const scheme = (parsed.protocol.replace(/:$/, "") || "http").toLowerCase();
  const authority = (parsed.hostname || "").toLocaleLowerCase();
  let path = parsed.pathname || "";
  let port = parsed.port || "";

  if ((80 == port && "http" === scheme) || (443 == port && "https" === scheme)) {
    port = "";
  }

  let baseUrl = `${scheme}://${authority}`;
  baseUrl = baseUrl + (port ? `:${port}` : "");

  // A trailing slash the caller never wrote is not part of the signed url.
  if ("/" === path && -1 === withScheme.indexOf(baseUrl + path)) {
    path = "";
  }

  return `${scheme}://${authority}${port ? `:${port}` : ""}${path}`;
}

function signatureBaseString(httpMethod, url, parameters) {
  const method = (httpMethod || "").toUpperCase();

  return [
    rfc3986Encode(method),
    rfc3986Encode(normalizeUrl(url)),
    rfc3986Encode(normalizeParameters(parameters)),
  ].join("&");
}

export function generate(
  httpMethod,
  url,
  parameters,
  consumerSecret,
  tokenSecret,
  options
) {
  const text = signatureBaseString(httpMethod, url, parameters);
  const key = `${rfc3986Encode(consumerSecret)}&${rfc3986Encode(tokenSecret)}`;

  const hash = crypto
    .createHmac("sha1", key)
    .update(text, "utf8")
    .digest("base64");

  // Matches oauth-signature: only an explicit false skips encoding.
  const encodeSignature = options ? options.encodeSignature : true;

  return false === encodeSignature ? hash : rfc3986Encode(hash);
}

export default { generate };
