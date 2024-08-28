const Sentry = require("@sentry/node");
const { nodeProfilingIntegration } = require("@sentry/profiling-node");

Sentry.init({
  dsn: "https://81a2f38c96d75c1a786eba6616e7def9@o4507466917675008.ingest.us.sentry.io/4507466919313408",
  integrations: [
    nodeProfilingIntegration(),
  ],
  tracesSampleRate: 1.0,
  profilesSampleRate: 1.0,
});

module.exports = Sentry;