const fs = require('fs');
const path = require('path');

const outputData = [];

for (let i = 1; i <= 10; i++) {
  const levelDir = `./Level ${i}`;
  if (!fs.existsSync(levelDir)) continue;

  const levelData = {
    id: i,
    title: `Level ${i}`,
    color: ['bg-green-400', 'bg-yellow-400', 'bg-orange-400', 'bg-red-400', 'bg-purple-400', 'bg-blue-400', 'bg-indigo-400', 'bg-pink-400', 'bg-teal-400', 'bg-cyan-400'][i-1],
    lessons: []
  };

  fs.readdirSync(levelDir).forEach(file => {
    if (file.endsWith('.html') && file.startsWith('Lesson')) {
      const titleMatch = file.match(/Lesson (\d+)\. (.*) _ (.*) –/);
      // fallback matching
      const titleMatch2 = file.match(/Lesson (\d+)\. (.*) –/);

      if (titleMatch) {
         levelData.lessons.push({
           id: `${i}-${titleMatch[1]}`,
           lessonNumber: parseInt(titleMatch[1]),
           title: titleMatch[2].trim(),
           ko: titleMatch[3].trim(),
         });
      } else if (titleMatch2) {
         levelData.lessons.push({
           id: `${i}-${titleMatch2[1]}`,
           lessonNumber: parseInt(titleMatch2[1]),
           title: titleMatch2[2].trim(),
           ko: "",
         });
      }
    }
  });

  levelData.lessons.sort((a, b) => a.lessonNumber - b.lessonNumber);
  outputData.push(levelData);
}

fs.writeFileSync('./src/data/levels.json', JSON.stringify(outputData, null, 2));
console.log('Levels parsed.');
