import React from 'react';
import { Link } from 'react-router-dom';
import levelsData from '../data/levels.json';

const Home = () => {
  return (
    <div className="p-4 overflow-y-auto h-full pb-20">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-primary">Kimtt</h1>
        <div className="flex items-center space-x-2">
          <span className="text-orange-500 font-bold flex items-center">
            🔥 12
          </span>
          <span className="text-blue-500 font-bold flex items-center">
            💎 340
          </span>
        </div>
      </header>

      <div className="space-y-8 relative">
        {levelsData.map((level, levelIndex) => (
          <div key={level.id} className="flex flex-col items-center relative">
            <h2 className="text-xl font-bold mb-4 text-gray-700">{level.title}</h2>

            <div className="flex flex-col items-center space-y-4">
              {level.lessons.map((lesson, index) => {
                // Create a zig-zag pattern
                const offset = index % 2 === 0 ? '-translate-x-6' : 'translate-x-6';
                const isFirst = index === 0;

                return (
                  <React.Fragment key={lesson.id}>
                    {isFirst ? (
                      <Link to={`/lesson/${lesson.id}`}>
                        <div className={`w-20 h-20 rounded-full ${level.color} shadow-lg flex items-center justify-center border-b-4 border-opacity-50 border-black transform transition hover:-translate-y-1`}>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                          </svg>
                        </div>
                      </Link>
                    ) : (
                      <div className={`flex flex-col items-center ${offset}`}>
                        <Link to={`/lesson/${lesson.id}`}>
                          <div className={`w-16 h-16 rounded-full ${level.color} shadow-md flex items-center justify-center border-b-4 border-opacity-50 border-black transform transition hover:-translate-y-1`}>
                            <span className="text-white font-bold">{lesson.lessonNumber}</span>
                          </div>
                        </Link>
                      </div>
                    )}
                    {index < level.lessons.length - 1 && (
                      <div className="w-2 h-8 bg-gray-200"></div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            {levelIndex < levelsData.length - 1 && (
               <div className="w-2 h-16 bg-gray-200 mt-4"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
