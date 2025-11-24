import { Request } from 'express';

export const getReqMainInfo: (req: Request) => {
  [prop: string]: any;
} = (req) => {
  const { query, headers, url, method, body, socket, ip, originalUrl, httpVersion } = req;

  const xRealIp = headers['X-Real-IP'];
  const xForwardedFor = headers['X-Forwarded-For'];
  const realIp = xRealIp || xForwardedFor || ip || socket.remoteAddress;

  return {
    method,
    url,
    originalUrl,
    host: headers.host,
    ip: realIp,
    query,
    body,
    httpVersion,
  };
};
