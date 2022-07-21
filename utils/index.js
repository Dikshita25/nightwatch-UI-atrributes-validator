const fs = require('fs');

const readDataFromFS = (fileName, dontParseJson) => {
  return new Promise((resolve, reject) => {
    fs.readFile(fileName, 'utf8', (err, data) => {
      if(err) {
        reject(err);
      } else {
        if (dontParseJson) {
          resolve(data)
        } else {
          resolve(JSON.parse(data));
        }
      }
    });
  });
};

module.exports = { readDataFromFS };
