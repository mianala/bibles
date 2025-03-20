const { getVerses } = require('./dist');

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