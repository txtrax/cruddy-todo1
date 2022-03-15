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
  // var data = _.map(items, (text, id) => {
  //   return { id, text };
  // });
  // callback(null, data);
};

exports.readOne = (id, callback) => {
  var text = items[id];
  if (!text) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback(null, { id, text });
  }
};

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text });
  }
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

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
