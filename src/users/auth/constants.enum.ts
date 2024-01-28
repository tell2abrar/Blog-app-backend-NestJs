export enum META_DATA {
  IS_PUBLIC = 'isPublic',
}

export enum AUTH_ERROR {
  JWT_EXPIRED = 'jwt expired',
  INVALID_SIGNATURE = 'invalid signature',
  NO_TOKEN_PROVIDED = 'Invalid Authorization Token - No Token Provided in Headers',
  EXPIRED_OR_INVALID = 'Invalid Authorization Token - Expired or Invalid',
  TOKEN_EXPIRED_ERROR = 'TokenExpiredError',
  JSON_WEB_TOKEN_ERROR = 'JsonWebTokenError',
}
