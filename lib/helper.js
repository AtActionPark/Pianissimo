'use strict';
var Note = require('./note');
var Theory = require('./theory');

//Helpers
module.exports = {
  getRandomInt(a,b){
    return Math.floor(Math.random()*(b - a + 1)) + a;
  },
  pickRandomProperty(obj) {
      let keys = Object.keys(obj)
      return keys[ keys.length * Math.random() << 0 ];
  },
  pickRandomArray(arr) {
      return arr[arr.length * Math.random() << 0 ];
  },
  getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
  },
  isNote(obj){
    return typeof obj == 'object' && obj.getRootAsLetter() != undefined
  },
  isValidNoteName(name){
    return Theory.wholeNotesOrder[name] != undefined || this.getKeyByValue(Theory.letterToName,name.toLowerCase()) != undefined
  },
  isValidNoteNotation(name){
    if(this.isNote(name))
      return true
    let rootRe = new RegExp('[^0-9#bx)]+','g')
    root = name.match(rootRe)[0]
    return Theory.wholeNotesOrder[root] != undefined || this.getKeyByValue(Theory.letterToName,root.toLowerCase()) != undefined
  },
  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
}
    