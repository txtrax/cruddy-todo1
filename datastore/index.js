const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

// var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, numberStr) => {
    if (err) {
      throw ('failed id');
    } else {
      //make a new file
      fs.writeFile(path.join(exports.dataDir, `${numberStr}.txt`), text, (err) => {
        if (err) {
          throw ('error in write file!');
        } else {
          //callback sends the response back?
          callback(null, { id: numberStr, text: text });
        }
      });
    }
  });
};

//returns an array of todos
//read the dataDir and build a list of files, use readdir
//do not read files!!!!!!!!!!
//when sent back to client, use id for the text of the todo
exports.readAll = (callback) => {
  fs.readdir(exports.dataDir, (err, arrayStr) => {
    if (err) {
      throw ('errorrrrrrr');
    } else {
      //return array of strings
      //call map on arrayStr
      //within map we want to create a new array where each element is an object
      const objArray = arrayStr.map( (file) => {
        const fileName = file.split('.')[0].toString();
        return { id: fileName, text: fileName };
      });
      callback(null, objArray);
    }
  });
};


//return the string within the todo file
//find the relevant file, read it, return the contents of that file
exports.readOne = (id, callback) => {
  //call read file on the expected file (given id)
  //if error, callback with error
  //if succeeds then pass back the contents of the file
  fs.readFile(path.join(exports.dataDir, `${id}.txt`), (err, text) => {
    if (err) {
      callback(new Error('no file found with that id'));
    } else {
      callback(null, { id: id, text: text.toString()});
    }
  });
};

exports.update = (id, text, callback) => {
  fs.readFile(path.join(exports.dataDir, `${id}.txt`), (err) => {
    if (err) {
      callback(new Error('womp womp'));
    } else {
      fs.writeFile(path.join(exports.dataDir, `${id}.txt`), text, (err) => {
        if (err) {
          callback(new Error('err'));
        } else {
          callback(null, {id: id, text: text });
        }
      });
    }
  });
};

exports.delete = (id, callback) => {
  fs.unlink(path.join(exports.dataDir, `${id}.txt`), (err) => {
    if (err) {
      callback(new Error('error'));
    } else {
      callback(null);
    }
  });
};

// Config+Initialization code -- DO NOT MODIFY //

//filepath to use when creating todo
exports.dataDir = path.join(__dirname, 'data');
// dirname = current directory
// .join adds /data to the current directory
// dataDir = currentDirectory/data

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
