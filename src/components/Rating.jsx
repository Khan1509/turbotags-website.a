import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Rating = () => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const handleRating = (rate) => {
    setRating(rate);
    setSubmitted(true);
  };

  return (
    <section className="bg-white p-6 rounded-xl shadow-md">
      <div className="text-center max-w-2xl mx-auto">
        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="thank-you"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <h2 className="text-2xl font-bold text-tt-dark-violet">Thank you for your feedback!</h2>
              <p className="text-gray-600 mt-2">Your input helps us improve TurboTags for everyone.</p>
            </motion.div>
          ) : (
            <motion.div
              key="rating-form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Enjoying TurboTags?</h2>
              <p className="text-gray-600 mb-6">Rate your experience to help us grow and improve.</p>
              <div className="flex justify-center items-center space-x-2">
                {[...Array(5)].map((_, index) => {
                  const ratingValue = index + 1;
                  return (
                    <motion.label
                      key={ratingValue}
                      whileHover={{ scale: 1.2, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <input
                        type="radio"
                        name="rating"
                        className="hidden"
                        value={ratingValue}
                        onClick={() => handleRating(ratingValue)}
                      />
                      <Star
                        className="cursor-pointer h-10 w-10 transition-colors"
                        onMouseEnter={() => setHoverRating(ratingValue)}
                        onMouseLeave={() => setHoverRating(0)}
                        fill={ratingValue <= (hoverRating || rating) ? '#FFC107' : 'none'}
                        stroke={ratingValue <= (hoverRating || rating) ? '#FFC107' : '#9ca3af'}
                      />
                    </motion.label>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Rating;
