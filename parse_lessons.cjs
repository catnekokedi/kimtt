const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const level1Dir = './Level 1';
const outputData = [];

fs.readdirSync(level1Dir).forEach(file => {
  if (file.endsWith('.html') && file.startsWith('Lesson')) {
    const content = fs.readFileSync(path.join(level1Dir, file), 'utf8');
    const $ = cheerio.load(content);

    // Attempt to extract Korean and English text pairs.
    // The structure might vary, but usually Korean words are bolded or have specific classes,
    // and English is next to it.
    // Let's just grab the title for now to build the lesson list.
    const titleMatch = file.match(/Lesson (\d+)\. (.*) _ (.*) –/);
    if (titleMatch) {
       outputData.push({
         id: parseInt(titleMatch[1]),
         title: titleMatch[2].trim(),
         ko: titleMatch[3].trim(),
         file: file
       });
    }
  }
});

// Sort by lesson ID
outputData.sort((a, b) => a.id - b.id);

fs.writeFileSync('./src/data/lessons.json', JSON.stringify(outputData, null, 2));
console.log('Lessons parsed.');
