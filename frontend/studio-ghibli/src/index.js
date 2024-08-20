import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./index.css";
import NavCategoryProvider from "./share/context/nav-category-context";

// OpenTelemetry Setup
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { FetchInstrumentation } from '@opentelemetry/instrumentation-fetch';
import { XMLHttpRequestInstrumentation } from '@opentelemetry/instrumentation-xml-http-request';
import { Resource } from '@opentelemetry/resources';
import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { WebTracerProvider } from '@opentelemetry/sdk-trace-web';

const provider = new WebTracerProvider({
  resource: new Resource({
    'service.name': 'frontend',  // Ensure this is set correctly
  }),
});
console.log("Trace test")
const exporter = new OTLPTraceExporter({
  url: '/v1/traces',  // The proxy will forward this to http://localhost:4318/v1/traces
});

provider.addSpanProcessor(new SimpleSpanProcessor(exporter));
provider.register();

registerInstrumentations({
  instrumentations: [
    new FetchInstrumentation(),
    new XMLHttpRequestInstrumentation(),
  ],
});

ReactDOM.render(
  <NavCategoryProvider>
    <App />
  </NavCategoryProvider>,
  document.getElementById("root")
);
