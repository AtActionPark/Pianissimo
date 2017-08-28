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
    return typeof obj == 'object' && obj.name
  },
  getRandomNote(octave1,octave2){
    let note =  this.pickRandomProperty(Theory.rootNotes)
    let octave = this.getRandomInt(octave1,octave2)
  
    return new Note(note+octave)
  },
  getRandomNoteFull(octave1,octave2){
    let note =  this.pickRandomProperty(Theory.fullNotesList)
    let octave = this.getRandomInt(octave1,octave2)
  
    return new Note(note+octave)
  }
}
    