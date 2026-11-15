import { bindings, defineConfig, defineWorker } from "cf/config";
import { createWorkersResponseStoreServiceBindingConfig } from "@vinext/cloudflare/cache/config";

const responseStore = await createWorkersResponseStoreServiceBindingConfig({
  worker: {
    name: "auchiya-dev-response-store",
    compatibilityDate: "2026-10-18",
    compatibilityFlags: ["nodejs_compat"],
  },
  bucket: "auchiya-dev-response-store-cache-bodies",
});

export const responseStoreServiceBinding = responseStore.serviceBindingWorker;

export default defineConfig({
  worker: defineWorker({
    ...responseStore.applicationWorker,
    name: "auchiya-dev",
    entrypoint: "vinext/server/fetch-handler",
    compatibilityDate: "2026-10-18",
    compatibilityFlags: ["nodejs_compat"],
    assets: {
      htmlHandling: "none",
      notFoundHandling: "none",
      runWorkerFirst: ["/*", "!/_next/static/*", "!/*/_next/static/*"],
    },
    observability: {
      enabled: true,
      logs: {
        enabled: true,
        invocationLogs: true,
        persist: true,
      },
      traces: {
        enabled: true,
        persist: true,
      },
    },
    env: {
      ...responseStore.applicationWorker.env,
      ASSETS: bindings.assets(),
      IMAGES: bindings.images(),
    },
  }),
});
