(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Solfege"] = factory();
	else
		root["Solfege"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 6);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = {
    fullNotesList: ['C', 'C#', 'Db', 'D', 'D#', 'Eb', 'E', 'F', 'F#', 'Gb', 'G', 'G#', 'Ab', 'A', 'A#', 'Bb', 'B'],
    midiNotesList: ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'],
    notesOrder: {
        'Cbb': -2,
        'Cb': -1,
        'C': 0,
        'C#': 1,
        'C##': 2,
        'Cx': 2,
        'Dbb': 0,
        'Db': 1,
        'D': 2,
        'D#': 3,
        'D##': 4,
        'x': 4,
        'Ebb': 2,
        'Eb': 3,
        'E': 4,
        'E#': 5,
        'E##': 6,
        'Ex': 6,
        'Fbb': 3,
        'Fb': 4,
        'F': 5,
        'F#': 6,
        'F##': 7,
        'Fx': 7,
        'Gbb': 5,
        'Gb': 6,
        'G': 7,
        'G#': 8,
        'G##': 9,
        'Gx': 9,
        'Abb': 7,
        'Ab': 8,
        'A': 9,
        'A#': 10,
        'A##': 11,
        'Ax': 11,
        'Bbb': 9,
        'Bb': 10,
        'B': 11,
        'B#': 12,
        'B##': 13,
        'Bx': 13
    },
    wholeNotesOrder: {
        'C': 1,
        'D': 2,
        'E': 3,
        'F': 4,
        'G': 5,
        'A': 6,
        'B': 7
    },
    letterToName: {
        A: 'la',
        B: 'si',
        C: 'do',
        D: 're',
        E: 'mi',
        F: 'fa',
        G: 'sol'
    },
    nameToLetter: {
        'la': 'A',
        'si': 'B',
        'do': 'C',
        're': 'D',
        'mi': 'E',
        'fa': 'F',
        'sol': 'G'
    },
    intervalQualityDict: {
        m: "minor",
        M: "major",
        P: "perfect",
        A: "augmented",
        d: "diminished",
        $: "magical"
    },
    intervalNumberDict: {
        1: "unison",
        2: "second",
        3: "third",
        4: "fourth",
        5: "fifth",
        6: "sixth",
        7: "seventh",
        8: "octave",
        9: "ninth",
        10: "tenth",
        11: "eleventh",
        12: "twelfth",
        13: "thirteenth",
        14: "fourteenth",
        15: "fifteenth",
    },
    intervalsDict: {
        'A0': 12,
        'm0': 10,
        'M0': 11,
        'd0': 9,
        'P1': 0,
        'd2': 0,
        'm2': 1,
        'A1': 1,
        'M2': 2,
        'd3': 2,
        'm3': 3,
        'A2': 3,
        'M3': 4,
        'd4': 4,
        'P4': 5,
        'A3': 5,
        'd5': 6,
        'A4': 6,
        'P5': 7,
        'd6': 7,
        'm6': 8,
        'A5': 8,
        'M6': 9,
        'd7': 9,
        'm7': 10,
        'A6': 10,
        'M7': 11,
        'd8': 11,
        'P8': 12,
        'A7': 12,
        'A8': 13
    },
    scalesDict: {
        //5 notes
        majorpentatonic: ['P1', 'M2', 'M3', 'P5', 'M6'],
        pentatonic: ['P1', 'M2', 'M3', 'P5', 'M6'],
        minorpentatonic: ['P1', 'm3', 'P4', 'P5', 'm7'],
        //6 notes
        blues: ['P1', 'm3', 'P4', 'd5', 'P5', 'm7'],
        wholetone: ['P1', 'M2', 'M3', 'A4', 'A5', 'A6'],
        augmented: ['P1', 'm3', 'M3', 'P5', 'A5', 'M7'],
        promotheus: ['P1', 'M2', 'M3', 'A4', 'M6', 'm7'],
        tritone: ['P1', 'm2', 'M2', 'A4', 'P5', 'm7'],
        //7 notes
        major: ['P1', 'M2', 'M3', 'P4', 'P5', 'M6', 'M7'],
        minor: ['P1', 'M2', 'm3', 'P4', 'P5', 'm6', 'm7'],
        melodicminor: ['P1', 'M2', 'm3', 'P4', 'P5', 'M6', 'M7'],
        harmonicminor: ['P1', 'M2', 'm3', 'P4', 'P5', 'm6', 'M7'],
        harmonicmajor: ['P1', 'M2', 'M3', 'P4', 'P5', 'm6', 'M7'],
        doubleharmonic: ['P1', 'm2', 'M3', 'P4', 'P5', 'm6', 'M7'],

        ionian: ['P1', 'M2', 'M3', 'P4', 'P5', 'M6', 'M7'],
        dorian: ['P1', 'M2', 'm3', 'P4', 'P5', 'M6', 'm7'],
        phrygian: ['P1', 'm2', 'm3', 'P4', 'P5', 'm6', 'm7'],
        lydian: ['P1', 'M2', 'M3', 'A4', 'P5', 'M6', 'M7'],
        mixolydian: ['P1', 'M2', 'M3', 'P4', 'P5', 'M6', 'm7'],
        aeolian: ['P1', 'M2', 'm3', 'P4', 'P5', 'm6', 'm7'],
        locrian: ['P1', 'm2', 'm3', 'P4', 'd5', 'm6', 'm7'],

        enigmatic: ['P1', 'm2', 'M3', 'A4', 'A5', 'A6', 'M7'],
        halfdimished: ['P1', 'M2', 'm3', 'P4', 'd5', 'm6', 'm7'],
        hungarianminor: ['P1', 'M2', 'm3', 'A4', 'P5', 'm6', 'm7'],

        //8 notes
        octatonic: ['P1', 'm2', 'm3', 'M3', 'A4', 'P5', 'M6', 'm7'],
        diminished: ['P1', 'M2', 'm3', 'P4', 'A4', 'A5', 'M6', 'M7'],
        //12 notes
        chromatic: ['P1', 'm2', 'M2', 'm3', 'M3', 'P4', 'A4', 'P5', 'm6', 'M6', 'm7', 'M7'],

    },
    A4Freq: 440,
    scaleTones: {
        1: 'tonic',
        2: 'supertonic',
        3: 'mediant',
        4: 'subdominant',
        5: 'dominant',
        6: 'submediant',
        7: 'leadingNote',
    }
}



/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var Theory = __webpack_require__(0);
var Interval = __webpack_require__(3);
var Scale = __webpack_require__(5);
var Chord = __webpack_require__(4);
var Helpers = __webpack_require__(2);

//Use symbols for emulating private variables
var _name = Symbol('name');
var _root = Symbol('root');
var _rootName = Symbol('rootName');
var _alteration = Symbol('alteration');
var _octave = Symbol('octave');
var _notationType = Symbol('notationType');

exports = module.exports = Note

//Name needs to be a capital letter + alterations/octave (D#2)  or a note name+ alt/octave (solb2)
function Note(name) {
  //if name is integer, assume midi note model
  if (Number.isInteger(name)) {
    name = Helpers.midiToName(name);
  }

  this[_name] = name;
  //Compute all properties depending on the name
  parseName(this)

  //Duplicate of the name, for debugging purpose, is public but has no impact on anything
  this.note = this[_name];
}

//Public getters - ex for C#3
Note.prototype.getName = function () { return this[_name] };                  // returns C#3
Note.prototype.getRoot = function () { return this[_root] };                  // returns C#
Note.prototype.getRootName = function () { return this[_rootName] };          // returns C
Note.prototype.getAlteration = function () { return this[_alteration] };      // returns #
Note.prototype.getOctave = function () { return this[_octave] };              // returns 3
Note.prototype.getNotationType = function () { return this[_notationType] };  // returns letter
Note.prototype.getMidiNumber = function () { return Helpers.nameToMidi(this.getRootAsLetter(), this.getOctave()) };    // returns 37

//Calculations are done based on letter name
Note.prototype.getRootAsLetter = function () {
  return Theory.wholeNotesOrder[this.getRootName()] != undefined ? this.getRoot() : Theory.nameToLetter[this.getRootName().toLowerCase()] + this.getAlteration()
}
Note.prototype.getRootNameAsLetter = function () {
  return Theory.wholeNotesOrder[this.getRootName()] != undefined ? this.getRootName() : Theory.nameToLetter[this.getRootName().toLowerCase()]
}
//Returns the note you end up on when adding an interval to the current note
Note.prototype.plusInterval = function (interval, intervalOrder) {
  if (typeof interval == 'string') {
    if (intervalOrder && typeof intervalOrder == 'string')
      interval = new Interval(interval, intervalOrder)
    else
      interval = new Interval(interval)
  }

  if (interval.getQuality() == '$')
    return 'impossible to compute'

  let initialOctave = this.getOctave();
  let octave = initialOctave;
  let rootNote = this.getRootAsLetter();
  let rootNoteBaseNoteName = this.getRootNameAsLetter();
  let rootNoteMod = this.getAlteration();
  let order = (interval.getOrderAsString() == "ascending" || interval.getOrderAsString() == '') ? 1 : -1

  let resultNoteName = findNoteNameFromInterval(this, interval)

  let semitones = interval.getSemitones();

  //Find the octave of the resulting note
  //for each 12 semitones, add one octave
  while (semitones > 12) {
    octave += 1;
    semitones -= 12
  }

  while (semitones < -12) {
    octave -= 1;
    semitones += 12
  }

  if (semitones == 12)
    octave += 1
  if (semitones == -12)
    octave -= 1

  //Find the difference in semitones
  let diffFromNames = (Theory.notesOrder[resultNoteName] - Theory.notesOrder[rootNote]) * order

  //special case for unisons,octaves and double octaves
  if (rootNoteBaseNoteName == resultNoteName) {
    diffFromNames = -order * (octave - initialOctave) * 12
    if (rootNoteMod == '#')
      semitones += 1
    if (rootNoteMod == 'b')
      semitones -= 1
  }

  if ((interval.getNumber() % 7 == 1) && interval.getQuality() != 'd')
    octave -= 1 * order
  if ((interval.getNumber() % 7 == 0) && interval.getQuality() == 'A')
    octave -= 1 * order


  if (diffFromNames < 0 || Math.sign(diffFromNames) == -0) {
    diffFromNames += 12
    octave += order * 1
  }

  // we checked the difference between the full initial note name and the target note name without alteration
  // if there is a difference, we need to alter the result note
  let remainingDiff = order * diffFromNames - semitones

  while (remainingDiff > 12)
    remainingDiff -= 12
  while (remainingDiff < -12)
    remainingDiff += 12
  if (remainingDiff > 2)
    remainingDiff -= 12
  if (remainingDiff < -2)
    remainingDiff += 12

  let mod = ''
  if (remainingDiff == 1)
    mod = 'b'
  if (remainingDiff == -1)
    mod = '#'

  if (remainingDiff == 2)
    mod = 'bb'
  if (remainingDiff == -2)
    mod = '##'


  //looking for impossible intervals/triple alteration (ex cant build an ascending D2 on Ab)
  if (remainingDiff > 2 || remainingDiff < -2) {
    return 'impossible to compute'
  }

  let result = new Note(resultNoteName + mod + octave)

  setNotationType(result, this.getNotationType())
  formatName(result)
  return result
}
//Returns a Scale objet, with type as specified in argument, and the current note as the tonic
Note.prototype.toScale = function (type, degree) {
  return new Scale(this, type, degree);
}
//Returns a Chord objet, with type as specified in argument, and the current note as the tonic
Note.prototype.toChord = function (type) {
  return new Chord(this, type);
}
//Returns a Scale objet, with type as specified in argument, and the current note as the tonic
Note.prototype.toInterval = function (note) {
  return new Interval(this, note);
}
//Returns the frequency in Hz of a note
Note.prototype.getFrequency = function () {
  let f0 = Theory.A4Freq;
  let a = Math.pow(2, 1 / 12)
  let n = Theory.notesOrder[this.getRootAsLetter()] - Theory.notesOrder['A'] + (this.getOctave() - 4) * 12

  //round to 2 decimals
  return Math.round(f0 * Math.pow(a, n) * 100) / 100
}

//Private
//Setters
const setName = function (note, newName) { note[_name] = newName };
const setRoot = function (note, newRoot) { note[_root] = newRoot };
const setRootName = function (note, newRootName) { note[_rootName] = newRootName };
const setAlteration = function (note, newAlteration) { note[_alteration] = newAlteration };
const setOctave = function (note, newOctave) { note[_octave] = newOctave };
const setNotationType = function (note, newNotationType) { note[_notationType] = newNotationType };

//will try to read the name argument, and fill all props from it
const parseName = function (note) {
  let octaveRe = new RegExp('[0-9]+', 'g')
  //if we find some numbers, take them as octave
  if (note.getName().match(octaveRe))
    setOctave(note, parseInt(note.getName().match(octaveRe)[0]))
  //if no octave is provided, assume 3
  else {
    setName(note, (note.getName() + '3').replace(/ /g, ''));
    setOctave(note, 3)
  }

  //from now on we work with only one set of symbols
  let name = note.getName()
  name = name.replace('♯', '#')
  name = name.replace('♭', 'b')
  name = name.replace('♮', '')

  //The root will be everything but the numbers
  setRoot(note, name.match(/[^0-9]+/g)[0])

  //and the rootName will be everything but numbers and alterations
  setRootName(note, name.match(/[^#bx0-9)]+/g)[0])

  if (!Helpers.isValidNoteName(note.getRootName()))
    throw note.getRootName() + ' is not a note'

  //the alterations have to be #,b or x
  let alteration = name.match(/[#bx)]+/g)
  alteration = alteration ? alteration[0] : ''

  if (!Helpers.isValidAlteration(alteration))
    throw alteration + ' is not a valid alteration'

  setAlteration(note, alteration)
  //check if the rootName is defined as a letter or as a note name (Do,re...)
  setNotationType(note, Theory.wholeNotesOrder[note.getRootName()] != undefined ? 'letter' : 'name')
}
//Add the interval number to the root note to find the result note
//We dont care about alterations, just about the note index in the wholeNotesOrder list
const findNoteNameFromInterval = function (note, interval) {
  //Add the interval number to the root note to find the result note
  //We dont care about alterations, just about the note index in the wholeNotesOrder list
  let rootNote = note.getRootAsLetter();
  let rootNoteBaseNoteName = note.getRootNameAsLetter();
  let order = (interval.getOrderAsString() == "ascending" || interval.getOrderAsString() == '') ? 1 : -1
  let resultNoteIndex = (Theory.wholeNotesOrder[rootNoteBaseNoteName] + order * (interval.getNumber() - 1)) % 7;

  if (resultNoteIndex == 0)
    resultNoteIndex = 7;
  if (resultNoteIndex < 0)
    resultNoteIndex += 7;
  let resultNoteName = Helpers.getKeyByValue(Theory.wholeNotesOrder, resultNoteIndex);

  return resultNoteName
}
//Calculations are based on letters, if the note was specified as name, reformat accordingly
const formatName = function (note) {
  if (note.getNotationType() == 'name') {
    setRootName(note, Helpers.capitalizeFirstLetter(Theory.letterToName[note.getRootName()]))
    setRoot(note, note.getRootName() + note.getAlteration())
    setName(note, note.getRoot() + note.getOctave())
  }
}



/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var Note = __webpack_require__(1);
var Theory = __webpack_require__(0);

//Helpers
module.exports = {
  getRandomInt(a, b) {
    return Math.floor(Math.random() * (b - a + 1)) + a;
  },
  pickRandomProperty(obj) {
    let keys = Object.keys(obj)
    return keys[keys.length * Math.random() << 0];
  },
  pickRandomArray(arr) {
    return arr[arr.length * Math.random() << 0];
  },
  getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
  },
  isNote(obj) {
    return typeof obj == 'object' && obj.getRootAsLetter() != undefined
  },
  isValidNoteName(name) {
    return Theory.wholeNotesOrder[name] != undefined || this.getKeyByValue(Theory.letterToName, name.toLowerCase()) != undefined
  },
  isValidNoteNotation(name) {
    if (this.isNote(name))
      return true
    let rootRe = new RegExp('[^0-9#bx)]+', 'g')
    let root = name.match(rootRe)[0]
    return Theory.wholeNotesOrder[root] != undefined || this.getKeyByValue(Theory.letterToName, root.toLowerCase()) != undefined
  },
  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  },
  isInterval(name) {
    let quality = name.slice(0, 1)
    let nb = name.slice(1)

    return (quality == P ||
      quality == M ||
      quality == m ||
      quality == d ||
      quality == A) &&
      Number.isInteger(parseInt(nb))
  },
  nameToMidi(root, octave) {
    console.log(root)
    return 12 * octave + Theory.midiNotesList.indexOf(root);
  },
  midiToName(midi) {
    let octave = Math.floor(midi / 12)
    let root = Theory.midiNotesList[midi % 12]

    return root + octave
  },
  isValidAlteration(alteration) {
    return alteration == "" ||
      alteration == "#" ||
      alteration == "b" ||
      alteration == "##" ||
      alteration == "x" ||
      alteration == "bb"
  }
}


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var Helpers = __webpack_require__(2);
var Theory = __webpack_require__(0);

//Use symbols for emulating private variables
var _name = Symbol('name');
var _semitones = Symbol('semitones');
var _order = Symbol('order');
var _number = Symbol('number');
var _quality = Symbol('quality');
var _qualityText = Symbol('qualityText');
var _numberText = Symbol('numberText');
var _note1 = Symbol('note1');
var _note2 = Symbol('note2');

exports = module.exports = Interval


//The interval can be specified by givin a name (m2, P5, M9...) and order (ascending, descending)
// or by giving 2 notes
//Accepted names are a combination of quality (P,M,m,A,d) and note name(C,Db,F#,Solbb ...)
function Interval(arg1, arg2) {
  var Note = __webpack_require__(1);

  //if 2 note objects are given
  if (Helpers.isNote(arg1) && Helpers.isNote(arg2)) {
    this[_note1] = arg1
    this[_note2] = arg2
    computeFromNotes(this)
  }

  //else if we give a combination of note object and note notation
  else if (Helpers.isNote(arg1) && Helpers.isValidNoteNotation(arg2)) {
    this[_note1] = arg1;
    this[_note2] = new Note(arg2);
    computeFromNotes(this)
  }
  else if (Helpers.isValidNoteNotation(arg1) && arg2 && Helpers.isNote(arg2)) {
    this[_note1] = new Note(arg1);
    this[_note2] = arg2;
    computeFromNotes(this)
  }
  else if (Helpers.isValidNoteNotation(arg1) && arg2 && Helpers.isValidNoteNotation(arg2)) {
    this[_note1] = new Note(arg1);
    this[_note2] = new Note(arg2);
    computeFromNotes(this)
  }
  //else, if we define the interval without notes
  else {
    this[_name] = arg1;
    this[_order] = arg2;

    parseName(this, this.getName(), this.getOrder())
  }

  //Duplicate of the name, for debugging purpose, is public but has no impact on anything
  this.interval = this[_name];
}

//Public getters
Interval.prototype.getName = function () { return this[_name] };
Interval.prototype.getSemitones = function () { return this[_semitones] };
Interval.prototype.getOrder = function () { return this[_order] };
Interval.prototype.getNumber = function () { return this[_number] };
Interval.prototype.getQuality = function () { return this[_quality] };
Interval.prototype.getQualityText = function () { return this[_qualityText] };
Interval.prototype.getNumberText = function () { return this[_numberText] };
Interval.prototype.getNote1 = function () { return this[_note1] };
Interval.prototype.getNote2 = function () { return this[_note2] };
Interval.prototype.getNotes = function () { return [this[_note1], this[_note2]] }
Interval.prototype.getNotesName = function () { return [this[_note1].getName(), this[_note2].getName()] }
Interval.prototype.getNotesFrequencies = function () { return [this[_note1].getFrequency(), this[_note2].getFrequency()] }
//return the order as "ascending" or "descending"
Interval.prototype.getOrderAsString = function () {
  if (this.getOrder() == '+' || (Number.isInteger(this.getOrder()) && this.getOrder() > 0))
    return 'ascending'
  if (this.getOrder() == '-' || (Number.isInteger(this.getOrder()) && this.getOrder() < 0))
    return 'descending'
  return this.getOrder()
}
//Inverts the interval and returns it
Interval.prototype.invert = function () {
  //an interval number and its inversion add up to 9
  // for compound intervals, remove the octaves
  let newNumber = 9 - this.getNumber() % 7

  let newQuality = 'P';
  if (this.getQuality() == 'm')
    newQuality = 'M'
  if (this.getQuality() == 'M')
    newQuality = 'm'
  if (this.getQuality() == 'd')
    newQuality = 'A'
  if (this.getQuality() == 'A')
    newQuality = 'd'

  parseName(this, newQuality + newNumber, this.getOrder())

  if (this.getNote1() && this.getNote2()) {
    setNote1(this, this.getNote2());
    setNote2(this, this.getNote2().plusInterval(this));
  }

  return this
}


//Privates
//Setters
const setName = function (interval, newName) { interval[_name] = newName };
const setSemitones = function (interval, newSemitones) { interval[_semitones] = newSemitones };
const setOrder = function (interval, newOrder) { interval[_order] = newOrder };
const setNumber = function (interval, newNumber) { interval[_number] = newNumber };
const setQuality = function (interval, newQuality) { interval[_quality] = newQuality };
const setQualityText = function (interval, newQualityText) { interval[_qualityText] = newQualityText };
const setNumberText = function (interval, newNumberText) { interval[_numberText] = newNumberText };
const setNote1 = function (interval, newNote1) { interval[_note1] = newNote1 };
const setNote2 = function (interval, newNote2) { interval[_note2] = newNote2 };

const displayNameAsText = function (interval) {
  let order = interval.getOrderAsString()
  if (interval.getName() == "P1" || interval.getName() == "d2")
    order = ''
  if (interval.getNumberText() == undefined)
    return '?'
  return order + " " + interval.getQualityText() + " " + interval.getNumberText()
}
//if the interval is not defined, all the properties can be computed
// by specifying the 2 notes that form the interval
const computeFromNotes = function (interval) {
  setIntervalInSemitones(interval)
  setIntervalOrder(interval);
  setIntervalNumber(interval);
  setIntervalQuality(interval);

  setName(interval, '' + interval.getQuality() + '' + interval.getNumber())

  setQualityText(interval, Theory.intervalQualityDict[interval.getQuality()]);
  setNumberText(interval, Theory.intervalNumberDict[interval.getNumber()]);
  if (interval.getNumberText() == undefined)
    setNumberText(interval, interval.getNumber() + 'th')
}
const setIntervalInSemitones = function (interval) {
  let oct1 = interval.getNote1().getOctave();
  let rootNote1 = interval.getNote1().getRootAsLetter();

  let oct2 = interval.getNote2().getOctave();
  let rootNote2 = interval.getNote2().getRootAsLetter();

  let diff = Theory.notesOrder[rootNote2] - Theory.notesOrder[rootNote1] + (oct2 - oct1) * 12
  setSemitones(interval, diff);
}
//Sets the interval's numbery (2nd,third...)
const setIntervalNumber = function (interval) {
  let oct1 = interval.getNote1().getOctave();
  let rootNote1 = interval.getNote1().getRootNameAsLetter();

  let oct2 = interval.getNote2().getOctave();
  let rootNote2 = interval.getNote2().getRootNameAsLetter();

  let diff = Theory.wholeNotesOrder[rootNote2] - Theory.wholeNotesOrder[rootNote1] + 1 + (oct2 - oct1) * 7

  //special case for ##
  if (oct1 == oct2 && diff > 7)
    diff -= 7

  if (oct2 > oct1 || (oct2 == oct1 && Theory.wholeNotesOrder[rootNote2] >= Theory.wholeNotesOrder[rootNote1])) {
    setNumber(interval, diff)
  }
  else {
    setNumber(interval, 2 - diff)
  }
}
//Sets the interval's quality (minor, major, perfect...)
const setIntervalQuality = function (interval) {
  let oct1 = interval.getNote1().getOctave();
  let rootNote1 = interval.getNote1().getRootAsLetter();

  let oct2 = interval.getNote2().getOctave();
  let rootNote2 = interval.getNote2().getRootAsLetter();

  let nb = interval.getNumber() % 7
  let semitones = Math.abs(interval.getSemitones()) % 12

  let quality;

  switch (semitones) {
    case 0:
      if (nb == 1)
        quality = 'P';
      else if (nb == 2)
        quality = 'd';
      else if (nb % 7 == 0)
        quality = 'A';
      break;
    case 1:
      if (nb == 1)
        quality = 'A';
      else if (nb == 2)
        quality = 'm';
      break;
    case 2:
      if (nb == 2)
        quality = 'M';
      else if (nb == 3)
        quality = 'd';
      break;
    case 3:
      if (nb == 2)
        quality = 'A';
      else if (nb == 3)
        quality = 'm';
      break;
    case 4:
      if (nb == 3)
        quality = 'M';
      else if (nb == 4)
        quality = 'd';
      break;
    case 5:
      if (nb == 3)
        quality = 'A';
      else if (nb == 4)
        quality = 'P';
      break;
    case 6:
      if (nb == 4)
        quality = 'A';
      else if (nb == 5)
        quality = 'd';
      break;
    case 7:
      if (nb == 5)
        quality = 'P';
      else if (nb == 6)
        quality = 'd';
      break;
    case 8:
      if (nb == 5)
        quality = 'A';
      else if (nb == 6)
        quality = 'm';
      break;
    case 9:
      if (nb % 7 == 0)
        quality = 'd';
      else if (nb == 7)
        quality = 'd';
      else if (nb == 6)
        quality = 'M';
      break;
    case 10:
      if (nb % 7 == 0)
        quality = 'm';
      else if (nb == 6)
        quality = 'A';
      break;
    case 11:
      if (nb % 7 == 0)
        quality = 'M';
      else if (nb % 7 == 1)
        quality = 'd';
      break;
    case 12:
      if (nb == 8)
        quality = 'P';
      else if (nb == 7)
        quality = 'A';
      else if (nb == 9)
        quality = 'd';
      break;
  }

  setQuality(interval, quality);
  if (interval.getQuality() == undefined) setQuality(interval, '$')
}
//Sets the interval order (ascending, descending)
const setIntervalOrder = function (interval) {
  let semitones = interval.getSemitones()

  if (semitones > 0)
    setOrder(interval, 'ascending')
  else if (semitones < 0)
    setOrder(interval, 'descending')
  else {
    setOrder(interval, '')
    let note1BaseName = interval.getNote1().getRootNameAsLetter()
    let note2BaseName = interval.getNote2().getRootNameAsLetter()

    let diff = Theory.wholeNotesOrder[note2BaseName] - Theory.wholeNotesOrder[note1BaseName]
    if (diff < -7)
      diff += 7
    if (diff > 7)
      diff -= 7
    setOrder(interval, diff >= 0 ? 'ascending' : 'descending')
  }
}
const parseName = function (interval, name, order) {
  setName(interval, name)
  setOrder(interval, order || 'ascending');

  let number = new RegExp('[0-9)]+', 'g')
  setNumber(interval, parseInt(interval.getName().match(number)[0]))

  let quality = new RegExp('[^0-9)]+', 'g')
  setQuality(interval, interval.getName().match(quality)[0])
  setSemitones(interval, (interval.getOrderAsString() == "ascending" ? 1 : -1) * setSemitonesFromName(interval))
  setQualityText(interval, Theory.intervalQualityDict[interval.getQuality()]);
  setNumberText(interval, Theory.intervalNumberDict[interval.getNumber()]);
  if (interval.getNumberText() == undefined)
    setNumberText(interval, interval.getNumber() + 'th')
}
const setSemitonesFromName = function (interval) {
  let x = interval.getNumber() - 1

  let semitones = 0;
  let i = 1

  if (interval.getNumber() <= 8) {
    semitones = Theory.intervalsDict[interval.getName()]
  }
  else {
    while (x >= 7) {
      x -= 7
      semitones += 12
    }

    let r = interval.getQuality() + (interval.getNumber() % 7)
    semitones += Theory.intervalsDict[r]

  }
  return semitones
}




/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Interval = __webpack_require__(3);
var Helpers = __webpack_require__(2);
var Theory = __webpack_require__(0);

module.exports = Chord

var _tonic = Symbol('tonic')
var _name = Symbol('name')
var _symbols = Symbol('symbols')
var _notes = Symbol('notes')
var _intervals = Symbol('intervals')

function Chord(arg1, name) {
  var Note = __webpack_require__(1);

  //if the first arg is an array, assume that we want to build the chord with an array of notes
  if (Array.isArray(arg1)) {
    //for each note in the array, we'll need to check if its a note object or a note name, and act accordingly
    this[_tonic] = Helpers.isNote(arg1[0]) ? arg1[0] : new Note(arg1[0]);
    this[_symbols] = 'not specified';
    this[_name] = name || 'no name';
    this[_notes] = arg1.map(note => Helpers.isNote(note) ? note : new Note(note))
    this[_intervals] = findIntervalsFromNotes(this.getNotes())

    //if no name was specified, try to find one
    if (name == undefined) {
      let possibleNames = findPossibleNames(this)
      setName(this, possibleNames[0][0])
    }
    //Duplicate of the name, for debugging purpose, is public but has no impact on anything
    this.chord = this.getName();

    return this
  }
  //if there is only one argument, assume it represents both the root and name in one combined string
  if (name == undefined) {
    let parsed = parseRootPlusName(arg1)
    name = parsed[1]
    arg1 = parsed[0]
  }
  if (!Helpers.isNote(arg1))
    arg1 = new Note(arg1);

  this[_tonic] = arg1;
  this[_symbols] = name;
  this[_name] = this.getTonic().getRoot() + this.getSymbols();
  this[_notes] = [];
  this[_intervals] = [];

  //parse everything we can find in the name
  let parsedName = parseName(this.getName())

  buildChord(this, parsedName)
  
  //Duplicate of the name, for debugging purpose, is public but has no impact on anything
  this.chord = this.getName();
}
//Public 
//Getters
Chord.prototype.getTonic = function () { return this[_tonic] }
Chord.prototype.getSymbols = function () { return this[_symbols] }
Chord.prototype.getName = function () { return this[_name] }
Chord.prototype.getNotes = function () { return this[_notes] }
Chord.prototype.getIntervals = function () { return this[_intervals] }
Chord.prototype.getNotesName = function () { return this.getNotes().map(n => n.getName()) };
Chord.prototype.getNotesFrequencies = function () { return this.getNotes().map(n => n.getFrequency()) };


Chord.prototype.transpose = function (interval, order) {
  //transpose each of the notes within the chord
  let notes = this.getNotes().map(x => x.plusInterval(interval, order));
  setNotes(this, notes);
  //find the new name
  let slash = this.getSymbols().match(/\/[^0-9]+/g, '');
  let symbols = this.getSymbols().replace(/\/[^0-9]+/g, '');
  let root = this.getTonic().plusInterval(interval, order).getRoot();
  if (slash)
    symbols += '/' + notes[0].getRoot()
  setName(this, root + symbols)
}
Chord.prototype.invert = function (order) {
  if (order < 1)
    return
  order = order || 1

  let notes = []
  let intervals = []
  for (let i = 0; i < order; i++) {
    let n = this.getNotes()
    let first = n.shift().plusInterval('P8')
    n.push(first)
    notes = n
    intervals = findIntervalsFromNotes(notes)
  }

  setNotes(this, notes)
  setIntervals(this, intervals)
}
Chord.prototype.findAlternateNames = function () {
  return findPossibleNames(this).map(x => x[1])
}
Chord.prototype.findBestName = function () {
  let bestName = 'randomLongAssStringThatMaybeShouldBeLonger';
  let possibleNames = findPossibleNames(this).map(x => x[0])
  possibleNames.forEach(function (name) {
    if (name.length < bestName.length)
      bestName = name
  })
  setName(this, bestName)
  return bestName
}


//Private
//Setters
const setTonic = function (chord, newTonic) { chord[_tonic] = newTonic }
const setSymbols = function (chord, newSymbols) { chord[_symbols] = newSymbols }
const setName = function (chord, newName) { chord[_name] = newName; chord.chord = newName}
const setNotes = function (chord, newNotes) { chord[_notes] = newNotes }
const setIntervals = function (chord, newIntervals) { chord[_intervals] = newIntervals }

//takes a chord name and returns the characteristics of the chord
const parseName = function (name) {
  let slash = name.match(/\/[^0-9]+/g)
  name = name.replace(/\/[^0-9]+/g, '');

  //special case for powerchords, if the first char is a 5
  let powerchord = false;
  if (name.charAt(1) == '5')
    powerchord = true;

  let no = name.match(/no\d+/g)
  name = name.replace(/no\d+/g, '');

  let majx = name.match(/(Major|Maj|maj|M|Δ|Ma|Δ)\d+|Δ/g)
  name = name.replace(/(Major|Maj|maj|M|Δ|Ma|Δ)\d+|Δ/g, '');

  let otherNum = name.match(/[^♯♭b#sd]\d+/g)

  let aug = name.match(/(♯♯|##|Aug|aug|Augmented|augmented|\+)/g)
  name = name.replace(/(♯♯|##|Aug|aug|Augmented|augmented|\+)/g, '');

  let dom = name.match(/(dom|Dom|dominant|Dominant)/g)
  name = name.replace(/(dom|Dom|dominant|Dominant)/g, '');

  let halfDim = name.match(/ø|Ø|hdin|halfDim/g)
  name = name.replace(/ø|Ø|hdin|halfDim/g, '');

  //the o symbol is problematic as it can appear in a bunch of places. Make sure its not the o in major, minor, do or sol
  let dim = name.match(/(♭♭|bb|Dim|dim|Diminished|diminished|°|[^jnDSds]o)♭*b*♯*#*\d*/g)
  //dont remove the b&# as we need them to add the note later
  name = name.replace(/(♭♭|bb|Dim|dim|Diminished|diminished|°|[^jnDSds]o)\d*/g, '');

  let major = name.match(/M|Major|major|maj/g)
  //dont remove M, as it is present in Minor
  name = name.replace(/Major|major|maj/g, '');

  let minor = name.match(/(m|min|Min|minor|Minor|-)/g)
  name = name.replace(/(m|min|Min|minor|Minor|-)/g, '');

  //look for add
  let add = name.match(/(\/|add(b*|#*|♭*|♯*))\d+/g)
  name = name.replace(/(\/|add(b*|#*|♭*|♯*))\d+/g, '');

  //look for #/b
  let sharps = name.match(/(♯|#|sharp)\d+/g)
  let flats = name.match(/(♭|b|flat)\d+/g)

  //look for sus

  let sus = name.match(/sus\d*/g)

  return {
    major,
    minor,
    majx,
    otherNum,
    dim,
    aug,
    dom,
    halfDim,
    sharps,
    flats,
    add,
    sus,
    powerchord,
    no,
    slash
  }
}
const parseRootPlusName = function (name) {
  let root = name.match(/^(Do|do|Re|re|Mi|mi|Fa|fa|Sol|sol|La|la|Si|si|A|a|B|b|C|c|D|d|E|e|F|f|G|g)#*b*♯*♭*/g)[0]
  name = name.replace(/^(Do|do|Re|re|Mi|mi|Fa|fa|Sol|sol|La|la|Si|si|A|a|B|b|C|c|D|d|E|e|F|f|G|g)#*b*♯*♭*/g, '');
  return [root, name]
}
const buildChord = function (chord, parsed) {
  let intervals = ['P1', 'M3', 'P5']
  if (parsed['otherNum'] != null) {
    for (let i = 0; i < parsed['otherNum'].length; i++) {
      let num = parsed['otherNum'][i].slice(1)

      if (num > 8) {
        intervals = addToIntervals(intervals, 'm7')
        for (let j = 9; j <= num; j += 2) {
          let quality = (j % 7 == 1 || j % 7 == 4 || j % 7 == 5) ? 'P' : 'M'
          intervals = addToIntervals(intervals, quality + j)
        }
      }
      if (num == 7) {
        intervals = addToIntervals(intervals, 'M3')
        intervals = addToIntervals(intervals, 'P5')
        intervals = addToIntervals(intervals, 'm7')
      }
      if (num == 6) {
        intervals = addToIntervals(intervals, 'M3')
        intervals = addToIntervals(intervals, 'P5')
        if (parsed['otherNum'][i].charAt(0) == 'm' || parsed['otherNum'][i].charAt(0) == 'b') {
          intervals = addToIntervals(intervals, 'm3')
          intervals = addToIntervals(intervals, 'M' + num)
        }

        else
          intervals = addToIntervals(intervals, 'M' + num)
      }
    }
  }
  if (parsed['major'] != null) {
    intervals = addToIntervals(intervals, 'M3')
    intervals = addToIntervals(intervals, 'P5')
  }
  if (parsed['majx'] != null) {
    for (let i = 0; i < parsed['majx'].length; i++) {
      let nb = parsed['majx'][i].match(/\d+/g)

      intervals = addToIntervals(intervals, 'M3')
      intervals = addToIntervals(intervals, 'P5')

      if (nb == undefined) {
        intervals = addToIntervals(intervals, 'M7')
      }
      else if (nb == 6) {
        intervals = addToIntervals(intervals, 'M6')
      }
      else {
        for (let j = 7; j <= nb; j += 2) {
          let q = j % 7 == 4 ? 'P' : 'M'
          intervals = addToIntervals(intervals, q + j)
        }
      }
    }
  }
  if (parsed['minor'] != null) {
    intervals = addToIntervals(intervals, 'm3')
    intervals = addToIntervals(intervals, 'P5')
  }
  if (parsed['aug'] != null) {
    intervals = addToIntervals(intervals, 'M3')
    intervals = addToIntervals(intervals, 'A5')
  }
  if (parsed['halfDim'] != null) {
    intervals = addToIntervals(intervals, 'm3')
    intervals = addToIntervals(intervals, 'd5')
    intervals = addToIntervals(intervals, 'm7')
  }
  if (parsed['sharps'] != null) {
    for (let i = 0; i < parsed['sharps'].length; i++) {
      let s = parsed['sharps'][i].match(/\d+/g)
      if (s == 7)
        intervals = addToIntervals(intervals, 'M7')
      else {
        intervals = addToIntervals(intervals, 'A' + s)
      }
    }
  }
  if (parsed['flats'] != null) {
    for (let i = 0; i < parsed['flats'].length; i++) {
      let f = parsed['flats'][i].match(/\d+/g)
      if (f % 7 == 1 || f % 7 == 4 || f % 7 == 5)
        intervals = addToIntervals(intervals, 'd' + f)
      else
        intervals = addToIntervals(intervals, 'm' + f)
    }
  }
  if (parsed['add'] != null) {
    for (let i = 0; i < parsed['add'].length; i++) {
      let s = parsed['add'][i].match(/\d+/g)
      let altb = parsed['add'][i].match(/b+|♭+/g)
      let alts = parsed['add'][i].match(/#+|♯+/g)
      let quality = (s % 7 == 1 || s % 7 == 4) ? 'P' : 'M'
      if (altb)
        quality = (s % 7 == 1 || s % 7 == 4) ? 'd' : 'm'
      else if (alts)
        quality = (s % 7 == 0) ? 'M' : 'A'

      intervals = addToIntervals(intervals, quality + s)
    }
  }
  if (parsed['dim'] != null) {
    intervals = addToIntervals(intervals, 'm3')
    intervals = addToIntervals(intervals, 'd5')

    let nb = parsed['dim'][0].match(/\d+/)
    if (nb == 3)
      intervals = addToIntervals(intervals, 'd3')
    if (nb >= 7)
      intervals = addToIntervals(intervals, 'd7')
  }
  if (parsed['sus'] != null) {
    for (let i = 0; i < parsed['sus'].length; i++) {
      let s = parsed['sus'][i].match(/\d+/g)
      intervals = removeArray(intervals, 'm3')
      intervals = removeArray(intervals, 'M3')

      if (s == 2 || s == 9)
        intervals = addToIntervals(intervals, 'M2')
      else if (s == 4)
        intervals = addToIntervals(intervals, 'P4')
      else if (s == 24) {
        intervals = addToIntervals(intervals, 'M2')
        intervals = addToIntervals(intervals, 'P4')
      }
      else if (s == null)
        intervals = addToIntervals(intervals, 'P4')
    }
  }
  if (parsed['dom'] != null) {
    intervals = addToIntervals(intervals, 'M3')
    intervals = addToIntervals(intervals, 'm7')
  }
  if (parsed['powerchord']) {
    intervals = removeArray(intervals, 'm3')
    intervals = removeArray(intervals, 'M3')
    intervals = addToIntervals(intervals, 'P8')
  }
  if (parsed['no'] != null) {
    for (let i = 0; i < parsed['no'].length; i++) {
      let nb = parsed['no'][i].match(/\d+/)
      intervals = removeArray(intervals, 'd' + nb)
      intervals = removeArray(intervals, 'm' + nb)
      intervals = removeArray(intervals, 'M' + nb)
      intervals = removeArray(intervals, 'P' + nb)
      intervals = removeArray(intervals, 'A' + nb)
    }
  }

  intervals = sortIntervals(intervals)
  setIntervals(chord, intervals)

  let tonic = chord.getTonic()
  let notes = intervals.map(x => tonic.plusInterval(x))
  setNotes(chord, notes)

  if (parsed['slash'] != null) {
    let note = parsed['slash'][0].replace(/\//, '')

    let index = hasNote(chord, note)
    if (index > 0) {
      let n = notes[index].plusInterval('P8', 'descending')
      notes.unshift(n)
      notes.splice(index + 1, 1)

      let interval = intervals[index]
      let newInterval = new Interval(interval).invert()
      intervals.unshift('-' + newInterval.getName())
      intervals.splice(index + 1, 1)

      setIntervals(chord, intervals)
      setNotes(chord, notes)
    }
    else if (index < 0) {

      let newInterval = new Interval(tonic, note + (tonic.getOctave() - 1))
      intervals.unshift('-' + newInterval.getName())

      let n = tonic.plusInterval(newInterval, 'descending')
      notes.unshift(n)

      setIntervals(chord, intervals)
      setNotes(chord, notes)
    }

  }
}
const removeArray = function (arr, el) {
  var index = arr.indexOf(el);
  if (index > -1) {
    arr.splice(index, 1);
  }
  return arr
}
const arrayRemoveCheck = function (arr, el) {
  var index = arr.indexOf(el);
  let present = false;
  if (index > -1) {
    arr.splice(index, 1);
    present = true
  }
  return present
}
const addToIntervals = function (intervals, interval) {
  //intervals = removeArray(intervals,interval)
  let nb = interval.slice(1)
  if (hasNumber(intervals, nb)) {
    intervals = removeArray(intervals, 'm' + nb)
    intervals = removeArray(intervals, 'M' + nb)
    intervals = removeArray(intervals, 'd' + nb)
    intervals = removeArray(intervals, 'P' + nb)
    intervals = removeArray(intervals, 'A' + nb)
  }
  intervals.push(interval)
  return intervals
}
const sortIntervals = function (intervals) {
  intervals = intervals.sort(function (a, b) {
    var nameA = parseInt(a.match(/\d+/)), nameB = parseInt(b.match(/\d+/));
    if (nameA < nameB) //sort string ascending
      return -1;
    if (nameA > nameB)
      return 1;
    return 0; //default return value (no sorting)
  });
  return intervals
}
const hasNumber = function (intervals, number) {
  return intervals.reduce(function (hasNumber, interval) {
    return hasNumber || (parseInt(interval.slice(1)) == number)
  }, false)
}
const hasNote = function (chord, note) {
  let notes = chord.getNotesName()
  for (let i = 0; i < notes.length; i++) {
    if (notes[i].replace(/\d+/, '') == note)
      return i;
  }
  return -1;
}
const findPermutations = function (notes) {
  let roots = []
  let intervals = []
  let slashNotes = []

  //case no slash
  for (let i = 0; i < notes.length; i++) {
    let c = new Chord(notes, 'dummyChord')
    c.invert(i)
    let inter = findIntervalsFromNotes(c.getNotes())

    roots.push(c.getNotes()[0])
    intervals.push(inter)
    slashNotes.push(null)
  }
  //case slash
  let slash = notes[0]
  let rNotes = notes.slice(1)
  for (let i = 0; i < rNotes.length; i++) {
    let c = new Chord(rNotes, 'dummyChord')
    c.invert(i)
    let inter = findIntervalsFromNotes(c.getNotes())

    roots.push(c.getNotes()[0])
    intervals.push(inter)
    slashNotes.push(slash)
  }

  return [roots, intervals, slashNotes]
}
const findNameFromPermutation = function (root, intervals, slash) {
  intervals = intervals.map(x => x.getName())

  let name = root.getRootName();
  let mods = '';
  let number = '';
  let powerChord = false;
  let no3 = false

  //check 3rd first
  if (arrayRemoveCheck(intervals, 'M3')) {
    if (arrayRemoveCheck(intervals, 'P5')) {
    } else if (arrayRemoveCheck(intervals, 'A5')) {
      name += '+';
    } else if (arrayRemoveCheck(intervals, 'd5')) {
      mods += '♭5';
    } else {
      mods += 'no5';
    }
    if (arrayRemoveCheck(intervals, 'M6')) {
      number += '6'
    }
  } else if (arrayRemoveCheck(intervals, 'm3')) {
    if (arrayRemoveCheck(intervals, 'P5')) {
      name += 'm';
    } else if (arrayRemoveCheck(intervals, 'd5')) {
      name += 'dim';
    } else if (arrayRemoveCheck(intervals, 'A5')) {
      name += 'm';
      mods += '#5';
    } else {
      name += 'm';
      mods += 'no5';
    }
    if (arrayRemoveCheck(intervals, 'M6')) {
      number += '6'
    }
  } else if (arrayRemoveCheck(intervals, 'M2')) {
    mods += 'sus2';
    if (arrayRemoveCheck(intervals, 'P4'))
      mods += '4'
    if (!arrayRemoveCheck(intervals, 'P5')) {
      mods += 'no5';
    }
    if (arrayRemoveCheck(intervals, 'M6')) {
      number += '6'
    }
  } else if (arrayRemoveCheck(intervals, 'P4')) {
    mods += 'sus4';
    if (!arrayRemoveCheck(intervals, 'P5')) {
      mods += 'no5';
    }
    if (arrayRemoveCheck(intervals, 'M6')) {
      number += '6'
    }

  } else if (arrayRemoveCheck(intervals, 'P5')) {
    if (arrayRemoveCheck(intervals, 'P8'))
      powerChord = true;
    else {
      no3 = true
      if (arrayRemoveCheck(intervals, 'M6')) {
        number += '6'
      }
    }
  } else {
    return 'cant find name';
  }
  if (arrayRemoveCheck(intervals, 'm7')) {
    number = '7';
    if (name.indexOf('dim') != -1) {
      if (mods.indexOf('♭5') == -1) mods += '♭5';
      name = name.replace('dim', 'm');
    }
    if (arrayRemoveCheck(intervals, 'M9')) {
      number = '9';
    }
    if (arrayRemoveCheck(intervals, 'P11')) {
      number = '11';
    }
    if (arrayRemoveCheck(intervals, 'M13')) {
      number = '13';
    }
  } else if (arrayRemoveCheck(intervals, 'M7')) {
    number = 'Δ';
    if (name.indexOf('dim') != -1) {
      if (mods.indexOf('♭5') == -1) mods += '♭5';
      name = name.replace('dim', 'm');
    }
    if (arrayRemoveCheck(intervals, 'M9')) {
      number = 'Δ9';
    }
    if (arrayRemoveCheck(intervals, 'P11')) {
      number = 'Δ11';
    }
    if (arrayRemoveCheck(intervals, 'M13')) {
      number = 'Δ13';
    }
  } else if (arrayRemoveCheck(intervals, 'd7')) {
    number = '7';
    if (arrayRemoveCheck(intervals, 'M9')) {
      number = '9';
    }
    if (arrayRemoveCheck(intervals, 'P11')) {
      number = '11';
    }
    if (arrayRemoveCheck(intervals, 'M13')) {
      number = '13';
    }
  }

  for (let i = 1; i < intervals.length; i++) {
    let x = intervals[i]
    if (x == 'A9')
      mods += '♯9'
    else if (x == 'm9')
      mods += '♭9'
    else if (x == 'A11')
      mods += '♯11'
    else if (x == 'd11')
      mods += '♭11'
    else if (x == 'A13')
      mods += '♯13'
    else if (x == 'm13')
      mods += '♭13'
    else {
      let n = x.match(/\d+/g)
      let q = x.slice(0, 1)
      if (n % 7 == 1 || n % 7 == 4 || n % 7 == 5) {
        if (q == 'P')
          mods += 'add' + n
        else if (q == 'A')
          mods += 'add♯' + n
        else if (q == 'd')
          mods += 'add♭' + n
      }
      else {
        if (q == 'M')
          mods += 'add' + n
        else if (q == 'm')
          mods += 'add♭' + n
        else if (q == 'A')
          mods += 'add♯' + n
        else if (q == 'd')
          mods += 'add♭♭' + n
      }
    }
  }

  if (powerChord) {
    if (number) {
      mods += 'no3';
    } else {
      number = '5';
    }
  }
  if (no3)
    mods += 'no3'

  if (slash != null)
    mods += '/' + slash.getRoot()

  let r = name + number + mods

  r = r.replace(/m7♭5/g, 'ø')


  return r

}
const findIntervalsFromNotes = function (notes) {
  let tonic = notes[0]
  let intervals = []

  for (let i = 0; i < notes.length; i++) {
    let inter = new Interval(tonic, notes[i])
    if (inter.getOrder() == 'descending')
      inter = inter.invert()
    intervals.push(inter)
  }

  return intervals
}
const findPossibleNames = function (chord) {
  let permutations = findPermutations(chord.getNotes())
  let length = permutations[0].length
  let possibleNames = []
  let slash = null

  for (let i = 0; i < length; i++) {
    let name = findNameFromPermutation(permutations[0][i], permutations[1][i], permutations[2][i])

    let x = []
    for (let j = 0; j < permutations[1][i].length; j++) {
      let p = permutations[0][i].plusInterval(permutations[1][i][j])
      if (p != 'impossible to compute')
        x.push(p)
      if (permutations[2][i] != null)
        slash = permutations[2][i]
    }
    if (slash != null)
      x.unshift(slash)
    x = x.map(n => n.getName())
    let s = name + ' - Notes: ' + x + ' - Intervals: ' + permutations[1][i].map(interval => interval.getName())

    possibleNames.push([name, s])
  }
  return possibleNames
}






/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var Interval = __webpack_require__(3);
var Chord = __webpack_require__(4);
var Helpers = __webpack_require__(2);
var Theory = __webpack_require__(0);

exports = module.exports = Scale;

//Use symbols for emulating private variables
var _tonic = Symbol('tonic');
var _type = Symbol('type');
var _degree = Symbol('degree');
var _notes = Symbol('notes');

function Scale(tonic, type, degree) {
    var Note = __webpack_require__(1);

    this[_tonic] = Helpers.isNote(tonic) ? tonic : new Note(tonic);
    this[_type] = type;
    this[_degree] = degree || 1;
    this[_notes] = [this.getTonic()];

    buildScale(this, this.getDegree());

    //Duplicate of the name, for debugging purpose, is public but has no impact on anything
    this.scale = this[_notes];
}
//Public Getters
Scale.prototype.getTonic = function () { return this[_tonic] };
Scale.prototype.getType = function () { return this[_type] };
Scale.prototype.getName = function () { return this.getTonic().getRootName() + ' ' + this.getType() };
Scale.prototype.getDegree = function () { return this[_degree] };
Scale.prototype.getNotes = function () { return this[_notes] };
Scale.prototype.getNotesName = function () { return this.getNotes().map(n => n.getName()) };
Scale.prototype.getNotesFrequencies = function () { return this.getNotes().map(n => n.getFrequency()) };

Scale.prototype.getChords = function (nb) {
    //if no nb, assume triad
    nb = nb || 3
    let chords = []
    let length = this.getNotes().length
    let root = this.getTonic().getRoot()

    for (let i = 0; i < length; i++) {
        let notes = []
        for (let j = 0; j < nb; j++) {
            let n = this.getNotes()[(2 * j + i) % length]
            if (2 * j + i > length) {
                let times = Math.floor((2 * j + i) / length)
                for (let k = 0; k < times; k++) {
                    n = n.plusInterval('P8')
                }
            }
            notes.push(n)
        }
        let name = root + ' ' + this.getType() + ' ' + Theory.scaleTones[i + 1]
        chords.push(new Chord(notes, name))
    }
    return chords;
}

//Private
//Setters
const setType = function (scale, newType) { scale[_type] = newType };
const setDegree = function (scale, newDegree) { scale[_degree] = newDegree };
const setNotes = function (scale, newNotes) { scale[_notes] = newNotes };

//Looks for the scale type in a dict and builds it on top of the tonic
const buildScale = function (scale, degree) {
    //account for values > 7 
    degree = degree % 7;

    let scaleType = Theory.scalesDict[scale.getType().toLowerCase()];

    let tonic = scale.getTonic()
    let notes = scaleType.map(note => tonic.plusInterval(note))

    if (degree > 1) {
        //mode calculation, start by switching the order of the notes
        // ex: for C dorian (degree 2)
        // [C3,D3,E3,F3,G3,A3,B3] => [D3,E3,F3,G3,A3,B3,C4]
        for (let i = 0; i < degree - 1; i++) {
            notes.push(notes[0].plusInterval('P8'))
            notes.shift()
        }

        //then transpose all the notes to get back to the tonic
        notes = notes.map(note => note.plusInterval(scaleType[degree - 1], 'descending'))
    }
    //Add the octave to the notes list
    //notes.push(notes[0].plusInterval('P8'));
    //And replace the notes object of the scale
    setNotes(scale, notes);
}


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Note = __webpack_require__(1);
var Interval = __webpack_require__(3);
var Chord = __webpack_require__(4);
var Scale = __webpack_require__(5);
var Helpers = __webpack_require__(2);
var Theory = __webpack_require__(0);


function noteConstructor(name){
    return new Note(name)
}
function intervalConstructor(arg1,arg2){
    return new Interval(arg1,arg2)
}
function scaleConstructor(tonic,type){
    return new Scale(tonic,type)
}
function chordConstructor(arg1,arg2){
    return new Chord(arg1,arg2)
}
function getRandomNote(octave1,octave2){
    octave1 = octave1||3
    octave2 = octave2||3
    let note =  Helpers.pickRandomArray(Theory.fullNotesList)
    let octave = Helpers.getRandomInt(octave1,octave2)
  
    return new Note(note+octave)
}
function getRandomInterval(){
    let intervalName =  Helpers.pickRandomProperty(Theory.intervalsDict)
    let intervalOrder = Math.random()<0.5? 'ascending' : 'descending'
  
    return new Interval(intervalName, intervalOrder)
}
function getRandomScale(note){
    note = note || getRandomNote();
    let scaleType = Helpers.pickRandomProperty(Theory.scalesDict)

    return new Scale(note,scaleType)
}   

function setA4(frequency){
    Theory.A4Freq = frequency
}

let solfege = {
    note:noteConstructor,
    interval:intervalConstructor,
    scale:scaleConstructor,
    chord:chordConstructor,
    randomNote:getRandomNote,
    randomInterval:getRandomInterval,
    randomScale:getRandomScale,
    setA4:setA4,
    Note:Note,
    Interval:Interval,
    Chord:Chord,
    Scale:Scale,
}
exports = module.exports = solfege

let c = solfege.chord(['C3','F#3','G3','D4'])
let c2 = solfege.chord(['C3', 'F#3', 'G3', 'D4'])
console.log(c) 
c2.findBestName()
console.log(c2) 



//browserify solfege.js --s module > solfegeBundle.js









 







/***/ })
/******/ ]);
});