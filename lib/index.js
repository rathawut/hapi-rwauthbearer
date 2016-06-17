const Boom = require('boom');
const pkg = require('../package.json');

exports.register = (server, options, next) => {
  const authKey = options.authKey || 'authKey';
  const authenticate = function authenticate(request, reply) {
    const req = request.raw.req;
    const authorization = req.headers.authorization;
    if (!authorization || !authorization.startsWith(`Bearer ${authKey}`)) {
      return reply(Boom.unauthorized());
    }
    return reply.continue({ credentials: { authKey } });
  };
  const scheme = function scheme() {
    return {
      authenticate,
    };
  };
  server.auth.scheme('bearer', scheme);
  server.auth.strategy('bearer', 'bearer');
  server.auth.default('bearer');
  next();
};

exports.register.attributes = {
  pkg,
};
