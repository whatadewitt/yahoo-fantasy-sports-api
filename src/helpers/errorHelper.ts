import { YahooFantasyError } from '../types/core.js';

const MAX_BODY_LENGTH = 2000;

const SENSITIVE_KEYS = [
  'oauth_consumer_key',
  'oauth_nonce',
  'oauth_signature',
  'oauth_token',
  'oauth_token_secret',
  'access_token',
  'refresh_token',
  'client_secret',
  'consumer_secret',
];

const SENSITIVE_PATTERN = new RegExp(
  `\\b(${SENSITIVE_KEYS.join('|')})=([^&\\s"'<>]*)`,
  'gi',
);

const BEARER_PATTERN = /(Bearer\s+)[\w.\-~+/=]+/gi;

export function redactSensitive(value: string): string {
  return value
    .replace(SENSITIVE_PATTERN, (_match, key) => `${key}=REDACTED`)
    .replace(BEARER_PATTERN, '$1REDACTED');
}

export function redactDeep(value: any): any {
  if (typeof value === 'string') return redactSensitive(value);
  if (Array.isArray(value)) return value.map(redactDeep);
  if (value && typeof value === 'object') {
    const out: Record<string, any> = {};
    for (const key of Object.keys(value)) {
      out[key] = redactDeep(value[key]);
    }
    return out;
  }
  return value;
}

export function truncateBody(body: string): string {
  const redacted = redactSensitive(body);
  return redacted.length > MAX_BODY_LENGTH
    ? `${redacted.slice(0, MAX_BODY_LENGTH)}… (truncated, ${redacted.length} bytes)`
    : redacted;
}

function pathOf(url: string): string {
  const withoutHost = url.replace(/^https?:\/\/[^/]+/, '');
  return withoutHost.split('?')[0] || url;
}

export interface YahooErrorParts {
  description?: string;
  code?: string;
  detail?: string;
}

export function describeYahooError(parsed: any): YahooErrorParts {
  if (!parsed || typeof parsed !== 'object') return {};

  const err = parsed.error;

  if (typeof err === 'string') {
    return {
      description: parsed.error_description || err,
      code: err,
      detail: parsed.error_detail,
    };
  }

  if (err && typeof err === 'object') {
    return {
      description: err.description || err.message || err.detail,
      code: err.name || err.code,
      detail: err.detail,
    };
  }

  if (typeof parsed.error_description === 'string') {
    return { description: parsed.error_description };
  }

  return {};
}

export interface ApiErrorContext {
  method: string;
  url: string;
  statusCode?: number;
  body?: string;
  parsed?: any;
  cause?: unknown;
  fallback?: string;
  code?: string;
}

export function buildApiError(ctx: ApiErrorContext): YahooFantasyError {
  const parts = describeYahooError(ctx.parsed);
  const { description, detail } = parts;
  const code = parts.code || ctx.code;

  const headline =
    description ||
    ctx.fallback ||
    (ctx.statusCode
      ? `Yahoo API request failed with HTTP ${ctx.statusCode}`
      : 'Yahoo API request failed');

  const context = [
    ctx.statusCode ? `HTTP ${ctx.statusCode}` : null,
    code || null,
    `${ctx.method} ${pathOf(ctx.url)}`,
  ].filter(Boolean);

  const message = redactSensitive(`${headline} (${context.join(', ')})`);

  const error = new YahooFantasyError(message, code, ctx.statusCode);
  error.method = ctx.method;
  error.url = redactSensitive(ctx.url);
  error.description = description;
  error.detail = detail;

  if (ctx.body) error.responseBody = truncateBody(ctx.body);
  if (ctx.parsed?.error !== undefined) {
    error.details = redactDeep(ctx.parsed.error);
  }
  if (ctx.cause !== undefined) error.cause = ctx.cause;

  return error;
}
