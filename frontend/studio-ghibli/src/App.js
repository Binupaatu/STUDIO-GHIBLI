
import { SpanStatusCode } from '@opentelemetry/api'; // Import SpanStatusCode
import React, { useEffect } from 'react';
import AdvertisementContainer from "./container/AdvertisementContainer";
import CourseSelectionContainer from "./container/CourseSelectionContainer";
import FeaturedTopicsContainer from "./container/FeaturedTopicsContainer";
import FooterContainer from "./container/FooterContainer";
import HeaderContainer from "./container/HeaderContainer";
import StudentsViewingContainer from "./container/StudentsViewingContainer";
import TopCategoriesContainer from "./container/TopCategoriesContainer";
import { useTracer } from './tracing'; // Assume this is a utility to get the tracer


function App() {
  const tracer = useTracer();

  useEffect(() => {
    const span = tracer.startSpan('Load App Component');
    span.addEvent('Rendering started');

    try {
      // Simulate some async operation or data fetching
      setTimeout(() => {
        span.addEvent('Rendering completed');
        // Any other logic can be added here
      }, 1000);
    } catch (error) {
      span.recordException(error);
      span.setStatus({ code: SpanStatusCode.ERROR, message: error.message });
    } finally {
      span.end(); // End the span after the operation completes or an error occurs
    }
  }, [tracer]);
  return (
    <>
      {/* Vikash */}
      <HeaderContainer />
      <CourseSelectionContainer />
      <StudentsViewingContainer />
      <TopCategoriesContainer />
      <FeaturedTopicsContainer />
      <AdvertisementContainer />
      <FooterContainer />
    </>
  );
}

export default App;
