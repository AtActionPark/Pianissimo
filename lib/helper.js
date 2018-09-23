'use strict';
const Theory = require('./theory');

// Helpers
module.exports = {
  getRandomInt(a, b) {
    return Math.floor(Math.random() * (b - a + 1)) + a;
  },
  pickRandomProperty(obj) {
    const keys = Object.keys(obj);
    return keys[(keys.length * Math.random()) << 0];
  },
  pickRandomArray(arr) {
    return arr[(arr.length * Math.random()) << 0];
  },
  getKeyByValue(object, value) {
    return Object.keys(object).find((key) => object[key] === value);
  },
  isNote(obj) {
    return typeof obj == 'object' && obj.getRootAsLetter() != undefined;
  },
  isValidNoteName(name) {
    return (
      Theory.wholeNotesOrder[name] != undefined ||
      this.getKeyByValue(Theory.letterToName, name.toLowerCase()) != undefined
    );
  },
  isValidNoteNotation(name) {
    if (this.isNote(name)) return true;
    const rootRe = new RegExp('[^0-9#bx)]+', 'g');
    const root = name.match(rootRe)[0];
    return (
      Theory.wholeNotesOrder[root] != undefined ||
      this.getKeyByValue(Theory.letterToName, root.toLowerCase()) != undefined
    );
  },
  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  },
  isInterval(name) {
    const quality = name.slice(0, 1);
    const nb = name.slice(1);

    return (
      (quality == P || quality == M || quality == m || quality == d || quality == A) && Number.isInteger(parseInt(nb))
    );
  },
  nameToMidi(root, octave) {
    return 12 * (octave + 1) + Theory.midiNotesList.indexOf(root);
  },
  midiToName(midi) {
    const octave = Math.floor(midi / 12) - 1;
    const root = Theory.midiNotesList[midi % 12];

    return root + octave;
  },
  isValidAlteration(alteration) {
    return (
      alteration == '' ||
      alteration == '#' ||
      alteration == 'b' ||
      alteration == '##' ||
      alteration == 'x' ||
      alteration == 'bb'
    );
  },
};
