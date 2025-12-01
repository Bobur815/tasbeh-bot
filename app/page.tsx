'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [count, setCount] = useState(0);
  const [target, setTarget] = useState(99);
  const [showCompletion, setShowCompletion] = useState(false);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customValue, setCustomValue] = useState('');

  // Load count from local storage on initial mount
  useEffect(() => {
    const savedCount = localStorage.getItem('last_count');
    if (savedCount !== null) {
      setCount(parseInt(savedCount));
    }
  }, []);

  // Save count to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem('last_count', count.toString());
  }, [count]);

  // Haptic Feedback (if supported)
  const hapticFeedback = () => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(10);
    }
  };

  // Check if target is reached
  useEffect(() => {
    if (count === target && count > 0) {
      setShowCompletion(true);
    }
  }, [count, target]);

  // Prevent pull-to-refresh on mobile
  useEffect(() => {
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };

    document.body.addEventListener('touchmove', handleTouchMove, { passive: false });
    return () => {
      document.body.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  const handleIncrease = () => {
    setCount(count + 1);
    hapticFeedback();
  };

  const handleDecrease = () => {
    if (count > 0) {
      setCount(count - 1);
      hapticFeedback();
    }
  };

  const handleReset = () => {
    if (confirm('Hisoblashni qayta boshlashni xohlaysizmi?')) {
      setCount(0);
    }
  };

  const handleContinue = () => {
    setShowCompletion(false);
    setCount(0);
  };

  const handleTargetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;

    if (value === 'custom') {
      setShowCustomInput(true);
    } else {
      setShowCustomInput(false);
      setTarget(parseInt(value));
    }
  };

  const handleCustomInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomValue(value);
    const numValue = parseInt(value);
    if (numValue > 0) {
      setTarget(numValue);
    }
  };

  const handleOverlayClick = () => {
    setShowCompletion(false);
  };

  return (
    <>
      <div className="container">
        {/* Header
        <div className="header">
          <div className="basmala">بِسْمِ اللَّهِ</div>
          <h1 className="app-title">Tasbeh Hisoblagich</h1>
        </div> */}

        {/* Main Counter Display */}
        <div className="counter-display">
          <div className="count-number">{count}</div>
          <div className="count-label">/ {target}</div>
        </div>

        {/* Target Selector */}
        <div className="target-selector">
          <div className="target-label">Maqsad tanlang</div>
          <div className="select-wrapper">
            <select onChange={handleTargetChange} defaultValue="99" className={showCustomInput ? 'has-custom' : ''}>
              <option value="33">33 dona</option>
              <option value="99">99 dona</option>
              <option value="100">100 dona</option>
              <option value="custom">Boshqa raqam</option>
            </select>
          </div>
          {showCustomInput && (
            <div className="custom-input-wrapper">
              <input
                type="number"
                id='customInput'
                className="custom-input"
                min="1"
                placeholder="Raqamni kiriting"
                value={customValue}
                onChange={handleCustomInput}
                autoFocus
              />
            </div>
          )}
        </div>

        {/* Interaction Zone */}
        <div className="interaction-zone">
          {/* Big Dhikr Button */}
          <button
            className="big-dhikr-button"
            onClick={handleIncrease}
            aria-label="Zikr qo'shish"
          >
            <span className="button-icon">+</span>
          </button>

          {/* Secondary Buttons */}
          <div className="secondary-buttons">
            <button className="btn-decrease" onClick={handleDecrease}>
              − 1
            </button>
            <button className="btn-decrease" onClick={handleReset}>
              <img src="/icons8-retry-60.png" alt="" className='w-6 h-6'/> 
            </button>
          </div>
        </div>
      </div>

      {/* Completion Message */}
      <div
        className={`overlay ${showCompletion ? 'show' : ''}`}
        onClick={handleOverlayClick}
      />
      <div className={`completion-message ${showCompletion ? 'show' : ''}`}>
        <h2>Субҳаналлоҳ! 🤲</h2>
        <p>Siz maqsadga yetdingiz!</p>
        <button onClick={handleContinue}>Davom ettirish</button>
      </div>
    </>
  );
}
