const { NodeTracerProvider } = require('@opentelemetry/node');
const { SimpleSpanProcessor } = require('@opentelemetry/tracing');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');
const { Resource } = require('@opentelemetry/resources');


const provider = new NodeTracerProvider({
  resource: new Resource({
    'service.name' : 'Enrollment-service'
  })
});
// Configure OTLP exporter
const otlpExporter = new OTLPTraceExporter({
  url: 'http://localhost:4318/v1/traces', // Assuming your collector is running on localhost
  serviceName: 'Enrollment-service'
});

provider.addSpanProcessor(new SimpleSpanProcessor(otlpExporter));

// Initialize the provider
provider.register();
