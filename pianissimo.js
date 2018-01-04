'use strict';

const Note = require('./lib/note');
const Interval = require('./lib/interval');
const Chord = require('./lib/chord');
const Scale = require('./lib/scale');
const Helpers = require('./lib/helper');
const Theory = require('./lib/theory');

function noteConstructor(name) {
  return new Note(name);
}
function intervalConstructor(arg1, arg2) {
  return new Interval(arg1, arg2);
}
function scaleConstructor(tonic, type) {
  return new Scale(tonic, type);
}
function chordConstructor(arg1, arg2) {
  return new Chord(arg1, arg2);
}
function getRandomNote(octave1, octave2) {
  octave1 = octave1 || 3;
  octave2 = octave2 || 3;
  const note = Helpers.pickRandomArray(Theory.fullNotesList);
  const octave = Helpers.getRandomInt(octave1, octave2);

  return new Note(note + octave);
}
function getRandomInterval() {
  const intervalName = Helpers.pickRandomProperty(Theory.intervalsDict);
  const intervalOrder = Math.random() < 0.5 ? 'ascending' : 'descending';

  return new Interval(intervalName, intervalOrder);
}
function getRandomScale(note) {
  note = note || getRandomNote();
  const scaleType = Helpers.pickRandomProperty(Theory.scalesDict);

  return new Scale(note, scaleType);
}

function setA4(frequency) {
  Theory.A4Freq = frequency;
}

const pianissimo = {
  note: noteConstructor,
  interval: intervalConstructor,
  scale: scaleConstructor,
  chord: chordConstructor,
  randomNote: getRandomNote,
  randomInterval: getRandomInterval,
  randomScale: getRandomScale,
  setA4: setA4,
  Note: Note,
  Interval: Interval,
  Chord: Chord,
  Scale: Scale,
};
exports = module.exports = pianissimo;
