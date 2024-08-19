const { NodeTracerProvider } = require('@opentelemetry/node');
const { SimpleSpanProcessor } = require('@opentelemetry/tracing');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');
const { Resource } = require('@opentelemetry/resources');
const { AlwaysOnSampler } = require('@opentelemetry/core');

// Create a tracer provider with a resource describing the service
const provider = new NodeTracerProvider({
  sampler: new AlwaysOnSampler(),
  resource: new Resource({
    'service.name': 'Customers-service', // Set the service name here
  }),
});

// Configure OTLP trace exporter
const otlpExporter = new OTLPTraceExporter({
  url: 'http://localhost:4318/v1/traces', // Ensure this URL is correct
});

// Add the exporter to the provider
provider.addSpanProcessor(new SimpleSpanProcessor(otlpExporter));

// Register the provider to start tracing
provider.register();

console.log('Tracing initialized for Customers-service');
