import { trace } from '@opentelemetry/api';

export function useTracer() {
  return trace.getTracer('frontend');
}