import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import styles from "./HintModal.module.css";

const HintModal = ({ show, hintInfo, onHintAccept, onHintDismiss }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (!show || !hintInfo) return;

    // Reset asynchronously to avoid "setState in effect" warnings.
    const t = setTimeout(() => setCurrentSlide(0), 0);
    return () => clearTimeout(t);
  }, [show, hintInfo]);

  if (!show || !hintInfo) return null;

  const slides = [
    {
      title: hintInfo.strategy || "Hint",
      text: "Pay Attention to the highlighted Cell",
      button: null,
    },
    {
      title: hintInfo.strategy || "Hint",
      text: hintInfo.explanation,
      button: null,
    },
    {
      title: "Solution",
      text: `Place ${hintInfo.value} in this cell`,
      button: (
        <Button
          variant="primary"
          size="sm"
          onClick={onHintAccept}
          className={styles.okBtn}
        >
          OK
        </Button>
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
    <div className={styles.hintModalOverlay}>
      <div className={styles.hintModal}>
        <button
          className={styles.closeBtn}
          onClick={onHintDismiss}
          aria-label="Close"
        >
          ✕
        </button>

        <div className={styles.hintModalBody}>
          <div className={styles.hintContent}>
            <h5 className={styles.hintTitle}>{slides[currentSlide].title}</h5>
            <p className={styles.hintExplanation}>
              {slides[currentSlide].text}
            </p>
          </div>
        </div>

        <div className={styles.hintModalFooter}>
          <div className={styles.slideIndicators}>
            {slides.map((_, index) => (
              <span
                key={index}
                className={`${styles.slideDot} ${index === currentSlide ? styles.activeDot : ""}`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>

          <div className={styles.slideActions}>
            {currentSlide > 0 && (
              <button
                className={styles.arrowBtn}
                onClick={handlePrev}
                aria-label="Previous"
              >
                ←
              </button>
            )}

            {slides[currentSlide].button ? (
              slides[currentSlide].button
            ) : (
              <button
                className={styles.arrowBtn}
                onClick={handleNext}
                aria-label="Next"
              >
                →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HintModal;
