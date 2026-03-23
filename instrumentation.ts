import * as Sentry from "@sentry/nextjs";

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    Sentry.init({
      dsn: "https://0501ce4441eccc946e7dc1e2dd45cae9@o4511091368525824.ingest.us.sentry.io/4511091378290688",
      tracesSampleRate: 1.0,
      enableLogs: true,
      sendDefaultPii: true,
    });
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    Sentry.init({
      dsn: "https://0501ce4441eccc946e7dc1e2dd45cae9@o4511091368525824.ingest.us.sentry.io/4511091378290688",
      tracesSampleRate: 1.0,
      enableLogs: true,
      sendDefaultPii: true,
    });
  }
}

export const onRequestError = Sentry.captureRequestError;
