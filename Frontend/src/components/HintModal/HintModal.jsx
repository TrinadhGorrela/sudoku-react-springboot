import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import styles from "./HintModal.module.css";

const HintModal = ({ show, hintInfo, onOkHint, onDismissHint }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (show) {
      setCurrentSlide(0);
    }
  }, [show, hintInfo]);

  if (!show || !hintInfo) return null;

  const slides = [
    {
      title: "Last Remaining Cell" || "Hint",
      text: "Pay Attention to the highlighted Cell",
      button: null,
    },
    {
      title: "Last Remaining Cell" || "Hint",
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
          onClick={onOkHint}
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
          onClick={onDismissHint}
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
