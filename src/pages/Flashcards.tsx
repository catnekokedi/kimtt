import React, { useState } from 'react';

const Flashcards = () => {
  const [showAnswer, setShowAnswer] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Mock Anki data extracted from lessons
  const cards = [
    { id: 1, front: '안녕하세요', back: 'Hello', nextReview: '1m', ease: 2.5 },
    { id: 2, front: '감사합니다', back: 'Thank you', nextReview: '10m', ease: 2.5 },
    { id: 3, front: '네', back: 'Yes', nextReview: '1d', ease: 2.5 },
    { id: 4, front: '아니요', back: 'No', nextReview: '4d', ease: 2.5 }
  ];

  const handleReveal = () => {
    setShowAnswer(true);
  };

  const handleRating = (rating: number) => {
    // Simple mock logic for moving to next card
    setShowAnswer(false);
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      alert("Review session complete!");
      setCurrentIndex(0); // Reset for demo
    }
  };

  const currentCard = cards[currentIndex];

  return (
    <div className="flex flex-col h-full bg-surface pb-20">
      <header className="flex justify-between items-center p-4 bg-white border-b">
        <h1 className="text-xl font-bold text-gray-800">Review</h1>
        <div className="flex space-x-2 text-sm">
          <span className="text-blue-500 font-bold">{cards.length - currentIndex} New</span>
          <span className="text-red-500 font-bold">0 Learning</span>
          <span className="text-green-500 font-bold">0 Due</span>
        </div>
      </header>

      <main className="flex-1 p-6 flex flex-col items-center justify-center">
        <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden flex flex-col h-96 relative">

          <div className="flex-1 p-8 flex items-center justify-center text-center">
            <h2 className="text-5xl font-bold text-gray-800">{currentCard.front}</h2>
          </div>

          {showAnswer && (
            <>
              <div className="w-full h-px bg-gray-200 my-4"></div>
              <div className="flex-1 p-8 flex items-center justify-center text-center animate-fade-in">
                <p className="text-3xl text-gray-600">{currentCard.back}</p>
              </div>
            </>
          )}

        </div>
      </main>

      <footer className="p-4 bg-white border-t border-gray-200">
        {!showAnswer ? (
          <button
            onClick={handleReveal}
            className="w-full py-4 bg-blue-500 hover:bg-blue-600 text-white font-bold text-lg rounded-xl shadow-[0_4px_0_0_rgba(59,130,246,1)] transition transform hover:translate-y-1 hover:shadow-none uppercase tracking-wide"
          >
            Show Answer
          </button>
        ) : (
          <div className="flex space-x-2 w-full max-w-sm mx-auto">
             <button
              onClick={() => handleRating(1)}
              className="flex-1 py-3 bg-red-100 hover:bg-red-200 text-red-700 font-bold rounded-xl flex flex-col items-center border border-red-300 transition"
            >
              <span className="text-xs opacity-75 mb-1">&lt;1m</span>
              <span className="uppercase text-sm">Again</span>
            </button>
             <button
              onClick={() => handleRating(2)}
              className="flex-1 py-3 bg-orange-100 hover:bg-orange-200 text-orange-700 font-bold rounded-xl flex flex-col items-center border border-orange-300 transition"
            >
              <span className="text-xs opacity-75 mb-1">&lt;10m</span>
              <span className="uppercase text-sm">Hard</span>
            </button>
             <button
              onClick={() => handleRating(3)}
              className="flex-1 py-3 bg-green-100 hover:bg-green-200 text-green-700 font-bold rounded-xl flex flex-col items-center border border-green-300 shadow-[0_4px_0_0_rgba(134,239,172,1)] transition transform hover:translate-y-1 hover:shadow-none"
            >
               <span className="text-xs opacity-75 mb-1">1d</span>
               <span className="uppercase text-sm">Good</span>
            </button>
             <button
              onClick={() => handleRating(4)}
              className="flex-1 py-3 bg-blue-100 hover:bg-blue-200 text-blue-700 font-bold rounded-xl flex flex-col items-center border border-blue-300 transition"
            >
               <span className="text-xs opacity-75 mb-1">4d</span>
               <span className="uppercase text-sm">Easy</span>
            </button>
          </div>
        )}
      </footer>
    </div>
  );
};

export default Flashcards;
