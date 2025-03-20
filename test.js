const { getVerses, listBooks, countVerses, chapterCount, versesCount } = require('./dist');

// Test single verse
console.log('\nSingle verse:');
console.log(getVerses('mg', 'jaona 3:16'));

// Test verse range
console.log('\nVerse range:');
console.log(getVerses('diem', 'jaona 3:16-18'));

// Test multiple verses
console.log('\nMultiple verses:');
console.log(getVerses('mg', 'jaona 3:16,18'));

// Test whole chapter
console.log('\nWhole chapter:');
console.log(getVerses('diem', 'jaona 3'));

// List all books in a version
console.log('\nList books in MG version:');
console.log(listBooks('mg'));

// Test verse counting
console.log('\nVerse counting:');
console.log('Total verses in Jaona:', countVerses('mg', 'jaona'));
console.log('Number of chapters in Jaona:', chapterCount('mg', 'jaona'));
console.log('Verses in Jaona chapter 3:', versesCount('mg', 'jaona', 3));

console.log('\nPsalms counting:');
console.log('Total verses in Salamo:', countVerses('mg', 'salamo'));
console.log('Number of chapters in Salamo:', chapterCount('mg', 'salamo'));
console.log('Verses in Salamo chapter 119:', versesCount('mg', 'salamo', 119)); 