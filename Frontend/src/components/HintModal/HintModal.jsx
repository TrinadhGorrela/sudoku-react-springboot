import React, { useState, useEffect } from "react";
import styles from "./HintModal.module.css";

const HintModal = ({ show, hintInfo, onHintAccept, onHintDismiss }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (!show || !hintInfo) return;

    const t = setTimeout(() => setCurrentSlide(0), 0);
    return () => clearTimeout(t);
  }, [show, hintInfo]);

  if (!show || !hintInfo) return null;

  const slides = [
    {
      title: hintInfo.strategy || "Hint",
      body: "Pay Attention to the highlighted Cell",
    },
    {
      title: hintInfo.strategy || "Hint",
      body: hintInfo.explanation,
    },
    {
      title: hintInfo.strategy || "Hint",
      body: (
        <>
          Since it is the only possible option, this cell must be <span className={styles.textBlue}>{hintInfo.value}</span>
        </>
      ),
    },
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  return (
    <div className={styles.hintModalOverlay} onClick={onHintDismiss}>
      <div className={styles.hintModal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.hintModalBody}>
          <h4 className={styles.hintTitle}>{slides[currentSlide].title}</h4>
          <p className={styles.hintExplanation}>
            {slides[currentSlide].body}
          </p>
        </div>

        <div className={styles.hintModalFooter}>
          <div className={styles.footerSide}>
            <button
              className={`${styles.arrowBtn} ${currentSlide === 0 ? styles.hidden : ""}`}
              onClick={handlePrev}
              aria-label="Previous"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
            </button>
          </div>

          <div className={styles.slideIndicators}>
            {slides.map((_, index) => (
              <span
                key={index}
                className={`${styles.slideDot} ${index === currentSlide ? styles.activeDot : ""}`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>

          <div className={styles.footerSide}>
            {currentSlide < slides.length - 1 ? (
              <button
                className={styles.arrowBtn}
                onClick={handleNext}
                aria-label="Next"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>
            ) : (
              <button
                className={styles.arrowBtn}
                onClick={onHintAccept}
                aria-label="Accept"
              >
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HintModal;
