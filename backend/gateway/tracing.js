const { NodeTracerProvider } = require('@opentelemetry/node');
const { SimpleSpanProcessor } = require('@opentelemetry/tracing');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');
const { Resource } = require('@opentelemetry/resources');
const { registerInstrumentations } = require('@opentelemetry/instrumentation');
const { HttpInstrumentation } = require('@opentelemetry/instrumentation-http');
const { ExpressInstrumentation } = require('@opentelemetry/instrumentation-express');

// Create a provider with service name
const provider = new NodeTracerProvider({
  resource: new Resource({
    'service.name': 'Gateway-service',  // Set the service name
  }),
});

// Configure OTLP exporter
const otlpExporter = new OTLPTraceExporter({
  url: 'http://localhost:4318/v1/traces', // Your OTLP collector endpoint
  // serviceName is not needed here, as it's already defined in the Resource
});

// Add the span processor to the provider
provider.addSpanProcessor(new SimpleSpanProcessor(otlpExporter));

// Initialize the provider
provider.register();

// Register automatic instrumentation for HTTP and Express
registerInstrumentations({
  tracerProvider: provider,
  instrumentations: [
    new HttpInstrumentation(),
    // Add other instrumentations as needed
  ],
});
new ExpressInstrumentation({
  ignoreLayersType: ['middleware'], // Ignore all middleware spans
  ignoreLayers: ['query', 'expressInit', 'corsMiddleware', 'jsonParser'], // Specifically ignore certain middleware
});

console.log('Tracing initialized for Gateway-service');
