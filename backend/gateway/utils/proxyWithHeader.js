import proxy from "express-http-proxy";

export const proxyWithHeader = (serviceUrl, routePrefix) => {
  return proxy(serviceUrl, {
    proxyReqPathResolver: (req) =>
      req.originalUrl.replace(new RegExp(`^${routePrefix}`), ""),
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
      if(srcReq.user) {
        proxyReqOpts.headers['x-user-id'] = srcReq.user.userId;
      }
      return proxyReqOpts;
    }
  });
};
