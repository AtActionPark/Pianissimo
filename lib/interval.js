'use strict';
const Helpers = require('./helper');
const Theory = require('./theory');

// Use symbols for emulating private variables
const _name = Symbol('name');
const _semitones = Symbol('semitones');
const _order = Symbol('order');
const _number = Symbol('number');
const _quality = Symbol('quality');
const _qualityText = Symbol('qualityText');
const _numberText = Symbol('numberText');
const _note1 = Symbol('note1');
const _note2 = Symbol('note2');

exports = module.exports = Interval;

// The interval can be specified by givin a name (m2, P5, M9...) and order (ascending, descending)
// or by giving 2 notes
// Accepted names are a combination of quality (P,M,m,A,d) and note name(C,Db,F#,Solbb ...)
function Interval(arg1, arg2) {
  const Note = require('./note');

  // if 2 note objects are given
  if (arg1 instanceof Note && arg2 instanceof Note) {
    this[_note1] = arg1;
    this[_note2] = arg2;
    computeFromNotes(this);
  } else if (arg1 instanceof Note && Helpers.isValidNoteNotation(arg2)) {
    // else if we give a combination of note object and note notation
    this[_note1] = arg1;
    this[_note2] = new Note(arg2);
    computeFromNotes(this);
  } else if (Helpers.isValidNoteNotation(arg1) && arg2 && arg2 instanceof Note) {
    this[_note1] = new Note(arg1);
    this[_note2] = arg2;
    computeFromNotes(this);
  } else if (Helpers.isValidNoteNotation(arg1) && arg2 && Helpers.isValidNoteNotation(arg2)) {
    this[_note1] = new Note(arg1);
    this[_note2] = new Note(arg2);
    computeFromNotes(this);
  } else {
    // else, if we define the interval without notes
    this[_name] = arg1;
    this[_order] = arg2;

    parseName(this, this.getName(), this.getOrder());
  }

  // Duplicate of the name, for debugging purpose, is public but has no impact on anything
  this.interval = this[_name];
}

// Public getters
Interval.prototype.getName = function() {
  return this[_name];
};
Interval.prototype.getSemitones = function() {
  return this[_semitones];
};
Interval.prototype.getOrder = function() {
  return this[_order];
};
Interval.prototype.getNumber = function() {
  return this[_number];
};
Interval.prototype.getQuality = function() {
  return this[_quality];
};
Interval.prototype.getQualityText = function() {
  return this[_qualityText];
};
Interval.prototype.getNumberText = function() {
  return this[_numberText];
};
Interval.prototype.getNote1 = function() {
  return this[_note1];
};
Interval.prototype.getNote2 = function() {
  return this[_note2];
};
Interval.prototype.getNotes = function() {
  return [this[_note1], this[_note2]];
};
Interval.prototype.getNotesName = function() {
  return [this[_note1].getName(), this[_note2].getName()];
};
Interval.prototype.getNotesFrequencies = function() {
  return [this[_note1].getFrequency(), this[_note2].getFrequency()];
};
// return the order as "ascending" or "descending"
Interval.prototype.getOrderAsString = function() {
  if (this.getOrder() == '+' || (Number.isInteger(this.getOrder()) && this.getOrder() > 0)) return 'ascending';
  if (this.getOrder() == '-' || (Number.isInteger(this.getOrder()) && this.getOrder() < 0)) return 'descending';
  return this.getOrder();
};
// Inverts the interval and returns it
Interval.prototype.invert = function() {
  // an interval number and its inversion add up to 9
  // for compound intervals, remove the octaves
  const newNumber = 9 - this.getNumber() % 7;

  let newQuality = 'P';
  if (this.getQuality() == 'm') newQuality = 'M';
  if (this.getQuality() == 'M') newQuality = 'm';
  if (this.getQuality() == 'd') newQuality = 'A';
  if (this.getQuality() == 'A') newQuality = 'd';

  parseName(this, newQuality + newNumber, this.getOrder());

  if (this.getNote1() && this.getNote2()) {
    setNote1(this, this.getNote2());
    setNote2(this, this.getNote2().plusInterval(this));
  }

  return this;
};

// Privates
// Setters
const setName = function(interval, newName) {
  interval[_name] = newName;
};
const setSemitones = function(interval, newSemitones) {
  interval[_semitones] = newSemitones;
};
const setOrder = function(interval, newOrder) {
  interval[_order] = newOrder;
};
const setNumber = function(interval, newNumber) {
  interval[_number] = newNumber;
};
const setQuality = function(interval, newQuality) {
  interval[_quality] = newQuality;
};
const setQualityText = function(interval, newQualityText) {
  interval[_qualityText] = newQualityText;
};
const setNumberText = function(interval, newNumberText) {
  interval[_numberText] = newNumberText;
};
const setNote1 = function(interval, newNote1) {
  interval[_note1] = newNote1;
};
const setNote2 = function(interval, newNote2) {
  interval[_note2] = newNote2;
};

// if the interval is not defined, all the properties can be computed
// by specifying the 2 notes that form the interval
const computeFromNotes = function(interval) {
  setIntervalInSemitones(interval);
  setIntervalOrder(interval);
  setIntervalNumber(interval);
  setIntervalQuality(interval);

  setName(interval, '' + interval.getQuality() + '' + interval.getNumber());

  setQualityText(interval, Theory.intervalQualityDict[interval.getQuality()]);
  setNumberText(interval, Theory.intervalNumberDict[interval.getNumber()]);
  if (interval.getNumberText() == undefined) setNumberText(interval, interval.getNumber() + 'th');
};
const setIntervalInSemitones = function(interval) {
  const oct1 = interval.getNote1().getOctave();
  const rootNote1 = interval.getNote1().getRootAsLetter();

  const oct2 = interval.getNote2().getOctave();
  const rootNote2 = interval.getNote2().getRootAsLetter();

  const diff = Theory.notesOrder[rootNote2] - Theory.notesOrder[rootNote1] + (oct2 - oct1) * 12;
  setSemitones(interval, diff);
};
// Sets the interval's numbery (2nd,third...)
const setIntervalNumber = function(interval) {
  const oct1 = interval.getNote1().getOctave();
  const rootNote1 = interval.getNote1().getRootNameAsLetter();

  const oct2 = interval.getNote2().getOctave();
  const rootNote2 = interval.getNote2().getRootNameAsLetter();

  let diff = Theory.wholeNotesOrder[rootNote2] - Theory.wholeNotesOrder[rootNote1] + 1 + (oct2 - oct1) * 7;

  // special case for ##
  if (oct1 == oct2 && diff > 7) diff -= 7;

  if (oct2 > oct1 || (oct2 == oct1 && Theory.wholeNotesOrder[rootNote2] >= Theory.wholeNotesOrder[rootNote1])) {
    setNumber(interval, diff);
  } else {
    setNumber(interval, 2 - diff);
  }
};
// Sets the interval's quality (minor, major, perfect...)
const setIntervalQuality = function(interval) {
  const nb = interval.getNumber() % 7;
  const semitones = Math.abs(interval.getSemitones()) % 12;

  let quality;

  switch (semitones) {
    case 0:
      if (nb == 1) quality = 'P';
      else if (nb == 2) quality = 'd';
      else if (nb % 7 == 0) quality = 'A';
      break;
    case 1:
      if (nb == 1) quality = 'A';
      else if (nb == 2) quality = 'm';
      break;
    case 2:
      if (nb == 2) quality = 'M';
      else if (nb == 3) quality = 'd';
      break;
    case 3:
      if (nb == 2) quality = 'A';
      else if (nb == 3) quality = 'm';
      break;
    case 4:
      if (nb == 3) quality = 'M';
      else if (nb == 4) quality = 'd';
      break;
    case 5:
      if (nb == 3) quality = 'A';
      else if (nb == 4) quality = 'P';
      break;
    case 6:
      if (nb == 4) quality = 'A';
      else if (nb == 5) quality = 'd';
      break;
    case 7:
      if (nb == 5) quality = 'P';
      else if (nb == 6) quality = 'd';
      break;
    case 8:
      if (nb == 5) quality = 'A';
      else if (nb == 6) quality = 'm';
      break;
    case 9:
      if (nb % 7 == 0) quality = 'd';
      else if (nb == 7) quality = 'd';
      else if (nb == 6) quality = 'M';
      break;
    case 10:
      if (nb % 7 == 0) quality = 'm';
      else if (nb == 6) quality = 'A';
      break;
    case 11:
      if (nb % 7 == 0) quality = 'M';
      else if (nb % 7 == 1) quality = 'd';
      break;
    case 12:
      if (nb == 8) quality = 'P';
      else if (nb == 7) quality = 'A';
      else if (nb == 9) quality = 'd';
      break;
  }

  setQuality(interval, quality);
  if (interval.getQuality() == undefined) setQuality(interval, '$');
};
// Sets the interval order (ascending, descending)
const setIntervalOrder = function(interval) {
  const semitones = interval.getSemitones();

  if (semitones > 0) setOrder(interval, 'ascending');
  else if (semitones < 0) setOrder(interval, 'descending');
  else {
    setOrder(interval, '');
    const note1BaseName = interval.getNote1().getRootNameAsLetter();
    const note2BaseName = interval.getNote2().getRootNameAsLetter();

    let diff = Theory.wholeNotesOrder[note2BaseName] - Theory.wholeNotesOrder[note1BaseName];
    if (diff < -7) diff += 7;
    if (diff > 7) diff -= 7;
    setOrder(interval, diff >= 0 ? 'ascending' : 'descending');
  }
};
const parseName = function(interval, name, order) {
  setName(interval, name);
  setOrder(interval, order || 'ascending');

  const number = new RegExp('[0-9)]+', 'g');
  setNumber(interval, parseInt(interval.getName().match(number)[0]));

  const quality = new RegExp('[^0-9)]+', 'g');
  setQuality(interval, interval.getName().match(quality)[0]);
  setSemitones(interval, (interval.getOrderAsString() == 'ascending' ? 1 : -1) * setSemitonesFromName(interval));
  setQualityText(interval, Theory.intervalQualityDict[interval.getQuality()]);
  setNumberText(interval, Theory.intervalNumberDict[interval.getNumber()]);
  if (interval.getNumberText() == undefined) setNumberText(interval, interval.getNumber() + 'th');
};
const setSemitonesFromName = function(interval) {
  let x = interval.getNumber() - 1;

  let semitones = 0;

  if (interval.getNumber() <= 8) {
    semitones = Theory.intervalsDict[interval.getName()];
  } else {
    while (x >= 7) {
      x -= 7;
      semitones += 12;
    }

    const r = interval.getQuality() + interval.getNumber() % 7;
    semitones += Theory.intervalsDict[r];
  }
  return semitones;
};
