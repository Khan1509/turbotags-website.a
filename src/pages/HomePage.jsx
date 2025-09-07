import React, { lazy, Suspense } from 'react';
import Hero from '../components/Hero';
import Stats from '../components/Stats';
import Platforms from '../components/Platforms';
import TagGenerator from '../components/TagGenerator';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import RatingWidget from '../components/ui/RatingWidget';
import LazySection from '../components/utils/LazySection';
import FaqSchema from '../components/schemas/FaqSchema';
import { faqData } from '../components/Faq';

// Lazy load heavy components and libraries
const MotionDiv = lazy(() => import('framer-motion').then(module => ({ default: module.motion.div })));
const Share = lazy(() => import('../components/Share'));
const TrendingTopics = lazy(() => import('../components/TrendingTopics'));
const NativeAd = lazy(() => import('../components/ui/NativeAd'));
const ToolLinkGrid = lazy(() => import('../components/ui/ToolLinkGrid'));
const FreeTools = lazy(() => import('../components/FreeTools'));
const CreatorTips = lazy(() => import('../components/CreatorTips'));
const TrendingHashtags = lazy(() => import('../components/TrendingHashtags'));

const WhyChooseUs = lazy(() => import('../components/WhyChooseUs'));
const Faq = lazy(() => import('../components/Faq'));

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.6, 
      ease: "easeOut"
    }
  },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    }
  }
};

function HomePage() {
  return (
    <>
      <FaqSchema faqData={faqData} />
      <Suspense fallback={<div className="container mx-auto max-w-7xl px-4 sm:px-6 md:px-8"><LoadingSpinner /></div>}>
        <MotionDiv
          className="container mx-auto max-w-7xl space-y-8 px-4 sm:space-y-12 sm:px-6 md:px-8"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          <Suspense fallback={<div className="h-96 bg-gray-100 rounded-lg animate-pulse" />}>
            <MotionDiv variants={fadeInUp}>
              <Hero />
            </MotionDiv>
          </Suspense>

          <Suspense fallback={<div className="h-32 bg-gray-100 rounded-lg animate-pulse" />}>
            <MotionDiv variants={fadeInUp}>
              <Stats />
            </MotionDiv>
          </Suspense>

          <Suspense fallback={<div className="h-20 bg-gray-100 rounded-lg animate-pulse" />}>
            <MotionDiv variants={fadeInUp}>
              <Share />
            </MotionDiv>
          </Suspense>

          <Suspense fallback={<div className="h-40 bg-gray-100 rounded-lg animate-pulse" />}>
            <MotionDiv variants={fadeInUp}>
              <Platforms />
            </MotionDiv>
          </Suspense>

          <Suspense fallback={<div className="h-96 bg-gray-100 rounded-lg animate-pulse" />}>
            <MotionDiv variants={fadeInUp}>
              <TagGenerator />
            </MotionDiv>
          </Suspense>

          <Suspense fallback={<div className="h-48 bg-gray-100 rounded-lg animate-pulse" />}>
            <MotionDiv variants={fadeInUp}>
              <FreeTools />
            </MotionDiv>
          </Suspense>

          <Suspense fallback={<div className="h-48 bg-gray-100 rounded-lg animate-pulse" />}>
            <MotionDiv variants={fadeInUp}>
              <TrendingHashtags />
            </MotionDiv>
          </Suspense>

          <Suspense fallback={<div className="h-40 bg-gray-100 rounded-lg animate-pulse" />}>
            <MotionDiv variants={fadeInUp}>
              <CreatorTips platform="general" />
            </MotionDiv>
          </Suspense>

          <Suspense fallback={<div className="h-60 bg-gray-100 rounded-lg animate-pulse" />}>
            <MotionDiv variants={fadeInUp}>
              <ToolLinkGrid />
            </MotionDiv>
          </Suspense>

          <Suspense fallback={<div className="h-32 bg-gray-100 rounded-lg animate-pulse" />}>
            <MotionDiv variants={fadeInUp}>
              <NativeAd />
            </MotionDiv>
          </Suspense>

          <LazySection minHeight="400px" fallback={<LoadingSpinner />}>
            <Suspense fallback={<div className="h-96 bg-gray-100 rounded-lg animate-pulse" />}>
              <MotionDiv variants={fadeInUp}>
                <TrendingTopics />
              </MotionDiv>
            </Suspense>
          </LazySection>

          <Suspense fallback={<LoadingSpinner />}>
            <Suspense fallback={<div className="h-96 bg-gray-100 rounded-lg animate-pulse" />}>
              <MotionDiv variants={fadeInUp}>
                <LazySection minHeight="420px">
                  <WhyChooseUs />
                </LazySection>
              </MotionDiv>
            </Suspense>

            <Suspense fallback={<div className="h-96 bg-gray-100 rounded-lg animate-pulse" />}>
              <MotionDiv variants={fadeInUp}>
                <LazySection minHeight="480px">
                  <Faq />
                </LazySection>
              </MotionDiv>
            </Suspense>
          </Suspense>

          <Suspense fallback={<div className="h-32 bg-gray-100 rounded-lg animate-pulse" />}>
            <MotionDiv
              className="bg-white p-6 rounded-xl shadow-md"
              variants={fadeInUp}
            >
              <RatingWidget />
            </MotionDiv>
          </Suspense>
        </MotionDiv>
      </Suspense>
    </>
  );
}

export default HomePage;
