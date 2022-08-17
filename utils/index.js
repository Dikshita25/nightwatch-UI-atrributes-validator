const fs = require('fs');

const readDataFromFS = (fileName, dontParseJson) => {
  return new Promise((resolve, reject) => {
    // Adding handling for js files
    if (!fileName.includes('json')) {
      resolve(require(fileName));
      return;
    }

    fs.readFile(fileName, 'utf8', (err, data) => {
      if (err) {
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
