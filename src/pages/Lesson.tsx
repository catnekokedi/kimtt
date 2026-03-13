import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import levelsData from '../data/levels.json';

const Lesson = () => {
  const { id } = useParams<{ id: string }>(); // e.g. "1-1"
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

  // Find the lesson from data
  let lessonInfo = null;
  let levelColor = "bg-green-400";

  for (const level of levelsData) {
    const found = level.lessons.find(l => l.id === id);
    if (found) {
      lessonInfo = found;
      levelColor = level.color;
      break;
    }
  }

  if (!lessonInfo) {
    return <div>Lesson not found.</div>;
  }

  // Create mock lesson content based on the extracted title
  const lessonData = {
    title: `Lesson ${lessonInfo.lessonNumber}: ${lessonInfo.title}`,
    content: [
      {
        type: "theory",
        text: "Let's learn a new phrase:",
        ko: lessonInfo.ko || "Korean Phrase",
        en: lessonInfo.title || "English Translation"
      },
      {
        type: "quiz",
        question: `How do you say '${lessonInfo.title}'?`,
        options: [
          lessonInfo.ko || "Korean 1",
          "잘 먹겠습니다.",
          "죄송합니다.",
          "안녕하세요."
        ].sort(() => Math.random() - 0.5), // Shuffle options
        answer: lessonInfo.ko || "Korean 1"
      }
    ]
  };

  const handleNext = () => {
    if (currentStep < lessonData.content.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      alert("Lesson Complete! +10 XP");
      navigate('/');
    }
  };

  const currentItem = lessonData.content[currentStep];

  return (
    <div className="flex flex-col h-screen bg-white">
      <header className="flex items-center justify-between p-4 border-b">
        <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="flex-1 mx-4">
          <div className="h-3 w-full bg-gray-200 rounded-full overflow-hidden">
             <div
               className={`h-full ${levelColor.replace('bg-', 'bg-')} transition-all duration-300`}
               style={{ width: `${((currentStep + 1) / lessonData.content.length) * 100}%` }}
             ></div>
          </div>
        </div>
        <div className="flex items-center text-red-500 font-bold">
          ❤️ 5
        </div>
      </header>

      <main className="flex-1 p-6 flex flex-col justify-center">
        {currentItem.type === 'theory' ? (
          <div className="text-center animate-fade-in">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">{lessonData.title}</h2>
            <p className="text-lg text-gray-600 mb-8">{currentItem.text}</p>

            <div className="bg-blue-50 p-6 rounded-2xl mb-8 border-2 border-blue-200 shadow-sm">
              <p className="text-4xl font-bold text-gray-800 mb-2">{currentItem.ko}</p>
              <p className="text-xl text-gray-500">{currentItem.en}</p>
            </div>
          </div>
        ) : (
          <div className="animate-fade-in w-full max-w-sm mx-auto">
            <h2 className="text-2xl font-bold mb-8 text-gray-800 text-center">{currentItem.question}</h2>

            <div className="space-y-4">
              {currentItem.options?.map((option, idx) => (
                <button
                  key={idx}
                  className="w-full p-4 text-left text-lg font-medium border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-blue-400 transition"
                  onClick={handleNext}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}
      </main>

      <footer className="p-4 border-t border-gray-200 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <button
          onClick={handleNext}
          className={`w-full py-3 ${levelColor} hover:opacity-90 text-white font-bold text-lg rounded-xl shadow-[0_4px_0_0_rgba(0,0,0,0.1)] transition transform hover:translate-y-1 hover:shadow-none uppercase tracking-wide`}
        >
          {currentItem.type === 'theory' ? 'Continue' : 'Check'}
        </button>
      </footer>
    </div>
  );
};

export default Lesson;
