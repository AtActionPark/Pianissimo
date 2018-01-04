'use strict';

const Interval = require('./interval');
const Helpers = require('./helper');

module.exports = Chord;

const _tonic = Symbol('tonic');
const _name = Symbol('name');
const _symbols = Symbol('symbols');
const _notes = Symbol('notes');
const _intervals = Symbol('intervals');

function Chord(arg1, name) {
  const Note = require('./note');

  // if the first arg is an array, assume that we want to build the chord with an array of notes
  if (Array.isArray(arg1)) {
    // for each note in the array, we'll need to check if its a note object or a note name, and act accordingly
    this[_tonic] = Helpers.isNote(arg1[0]) ? arg1[0] : new Note(arg1[0]);
    this[_symbols] = 'not specified';
    this[_name] = name || 'no name';
    this[_notes] = arg1.map((note) => (Helpers.isNote(note) ? note : new Note(note)));
    this[_intervals] = findIntervalsFromNotes(this.getNotes());

    // if no name was specified, try to find one
    if (name == undefined) {
      const possibleNames = findPossibleNames(this);
      setName(this, possibleNames[0][0]);
    }
    // Duplicate of the name, for debugging purpose, is public but has no impact on anything
    this.chord = this.getName();

    return this;
  }
  // if there is only one argument, assume it represents both the root and name in one combined string
  if (name == undefined) {
    const parsed = parseRootPlusName(arg1);
    name = parsed[1];
    arg1 = parsed[0];
  }
  if (!Helpers.isNote(arg1)) {
    arg1 = new Note(arg1);
  }

  this[_tonic] = arg1;
  this[_symbols] = name;
  this[_name] = this.getTonic().getRoot() + this.getSymbols();
  this[_notes] = [];
  this[_intervals] = [];

  // parse everything we can find in the name
  const parsedName = parseName(this.getName());

  buildChord(this, parsedName);

  // Duplicate of the name, for debugging purpose, is public but has no impact on anything
  this.chord = this.getName();
}
// Public
// Getters
Chord.prototype.getTonic = function() {
  return this[_tonic];
};
Chord.prototype.getSymbols = function() {
  return this[_symbols];
};
Chord.prototype.getName = function() {
  return this[_name];
};
Chord.prototype.getNotes = function() {
  return this[_notes];
};
Chord.prototype.getIntervals = function() {
  return this[_intervals];
};
Chord.prototype.getNotesName = function() {
  return this.getNotes().map((n) => n.getName());
};
Chord.prototype.getNotesFrequencies = function() {
  return this.getNotes().map((n) => n.getFrequency());
};

Chord.prototype.transpose = function(interval, order) {
  // transpose each of the notes within the chord
  const notes = this.getNotes().map((x) => x.plusInterval(interval, order));
  setNotes(this, notes);
  // find the new name
  const slash = this.getSymbols().match(/\/[^0-9]+/g, '');
  let symbols = this.getSymbols().replace(/\/[^0-9]+/g, '');
  const root = this.getTonic()
    .plusInterval(interval, order)
    .getRoot();
  if (slash) {
    symbols += '/' + notes[0].getRoot();
  }
  setName(this, root + symbols);
};
Chord.prototype.invert = function(order) {
  if (order < 1) {
    return;
  }
  order = order || 1;

  let notes = [];
  let intervals = [];
  for (let i = 0; i < order; i++) {
    const n = this.getNotes();
    const first = n.shift().plusInterval('P8');
    n.push(first);
    notes = n;
    intervals = findIntervalsFromNotes(notes);
  }

  setNotes(this, notes);
  setIntervals(this, intervals);
};
Chord.prototype.findAlternateNames = function() {
  return findPossibleNames(this).map((x) => x[1]);
};
Chord.prototype.findBestName = function() {
  let bestName = 'randomLongAssStringThatMaybeShouldBeLonger';
  const possibleNames = findPossibleNames(this).map((x) => x[0]);
  possibleNames.forEach(function(name) {
    if (name.length < bestName.length) {
      bestName = name;
    }
  });
  setName(this, bestName);
  return bestName;
};

// Private
// Setters
const setName = function(chord, newName) {
  chord[_name] = newName;
  chord.chord = newName;
};
const setNotes = function(chord, newNotes) {
  chord[_notes] = newNotes;
};
const setIntervals = function(chord, newIntervals) {
  chord[_intervals] = newIntervals;
};

// takes a chord name and returns the characteristics of the chord
const parseName = function(name) {
  const slash = name.match(/\/[^0-9]+/g);
  name = name.replace(/\/[^0-9]+/g, '');

  // special case for powerchords, if the first char is a 5
  let powerchord = false;
  if (name.charAt(1) == '5') {
    powerchord = true;
  }

  const no = name.match(/no\d+/g);
  name = name.replace(/no\d+/g, '');

  const majx = name.match(/(Major|Maj|maj|M|Δ|Ma|Δ)\d+|Δ/g);
  name = name.replace(/(Major|Maj|maj|M|Δ|Ma|Δ)\d+|Δ/g, '');

  const otherNum = name.match(/[^♯♭b#sd]\d+/g);

  const aug = name.match(/(♯♯|##|Aug|aug|Augmented|augmented|\+)/g);
  name = name.replace(/(♯♯|##|Aug|aug|Augmented|augmented|\+)/g, '');

  const dom = name.match(/(dom|Dom|dominant|Dominant)/g);
  name = name.replace(/(dom|Dom|dominant|Dominant)/g, '');

  const halfDim = name.match(/ø|Ø|hdin|halfDim/g);
  name = name.replace(/ø|Ø|hdin|halfDim/g, '');

  // the o symbol is problematic as it can appear in a bunch of places.
  // Make sure its not the o in major, minor, do or sol
  const dim = name.match(/(♭♭|bb|Dim|dim|Diminished|diminished|°|[^jnDSds]o)♭*b*♯*#*\d*/g);
  // dont remove the b&# as we need them to add the note later
  name = name.replace(/(♭♭|bb|Dim|dim|Diminished|diminished|°|[^jnDSds]o)\d*/g, '');

  const major = name.match(/M|Major|major|maj/g);
  // dont remove M, as it is present in Minor
  name = name.replace(/Major|major|maj/g, '');

  const minor = name.match(/(m|min|Min|minor|Minor|-)/g);
  name = name.replace(/(m|min|Min|minor|Minor|-)/g, '');

  // look for add
  const add = name.match(/(\/|add(b*|#*|♭*|♯*))\d+/g);
  name = name.replace(/(\/|add(b*|#*|♭*|♯*))\d+/g, '');

  // look for #/b
  const sharps = name.match(/(♯|#|sharp)\d+/g);
  const flats = name.match(/(♭|b|flat)\d+/g);

  // look for sus

  const sus = name.match(/sus\d*/g);

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
    slash,
  };
};
const parseRootPlusName = function(name) {
  const root = name.match(/^(Do|do|Re|re|Mi|mi|Fa|fa|Sol|sol|La|la|Si|si|A|a|B|b|C|c|D|d|E|e|F|f|G|g)#*b*♯*♭*/g)[0];
  name = name.replace(/^(Do|do|Re|re|Mi|mi|Fa|fa|Sol|sol|La|la|Si|si|A|a|B|b|C|c|D|d|E|e|F|f|G|g)#*b*♯*♭*/g, '');
  return [root, name];
};
const buildChord = function(chord, parsed) {
  let intervals = ['P1', 'M3', 'P5'];
  if (parsed['otherNum'] != null) {
    for (let i = 0; i < parsed['otherNum'].length; i++) {
      const num = parsed['otherNum'][i].slice(1);

      if (num > 8) {
        intervals = addToIntervals(intervals, 'm7');
        for (let j = 9; j <= num; j += 2) {
          const quality = j % 7 == 1 || j % 7 == 4 || j % 7 == 5 ? 'P' : 'M';
          intervals = addToIntervals(intervals, quality + j);
        }
      }
      if (num == 7) {
        intervals = addToIntervals(intervals, 'M3');
        intervals = addToIntervals(intervals, 'P5');
        intervals = addToIntervals(intervals, 'm7');
      }
      if (num == 6) {
        intervals = addToIntervals(intervals, 'M3');
        intervals = addToIntervals(intervals, 'P5');
        if (parsed['otherNum'][i].charAt(0) == 'm' || parsed['otherNum'][i].charAt(0) == 'b') {
          intervals = addToIntervals(intervals, 'm3');
          intervals = addToIntervals(intervals, 'M' + num);
        } else {
          intervals = addToIntervals(intervals, 'M' + num);
        }
      }
    }
  }
  if (parsed['major'] != null) {
    intervals = addToIntervals(intervals, 'M3');
    intervals = addToIntervals(intervals, 'P5');
  }
  if (parsed['majx'] != null) {
    for (let i = 0; i < parsed['majx'].length; i++) {
      const nb = parsed['majx'][i].match(/\d+/g);

      intervals = addToIntervals(intervals, 'M3');
      intervals = addToIntervals(intervals, 'P5');

      if (nb == undefined) {
        intervals = addToIntervals(intervals, 'M7');
      } else if (nb == 6) {
        intervals = addToIntervals(intervals, 'M6');
      } else {
        for (let j = 7; j <= nb; j += 2) {
          const q = j % 7 == 4 ? 'P' : 'M';
          intervals = addToIntervals(intervals, q + j);
        }
      }
    }
  }
  if (parsed['minor'] != null) {
    intervals = addToIntervals(intervals, 'm3');
    intervals = addToIntervals(intervals, 'P5');
  }
  if (parsed['aug'] != null) {
    intervals = addToIntervals(intervals, 'M3');
    intervals = addToIntervals(intervals, 'A5');
  }
  if (parsed['halfDim'] != null) {
    intervals = addToIntervals(intervals, 'm3');
    intervals = addToIntervals(intervals, 'd5');
    intervals = addToIntervals(intervals, 'm7');
  }
  if (parsed['sharps'] != null) {
    for (let i = 0; i < parsed['sharps'].length; i++) {
      const s = parsed['sharps'][i].match(/\d+/g);
      if (s == 7) {
        intervals = addToIntervals(intervals, 'M7');
      } else {
        intervals = addToIntervals(intervals, 'A' + s);
      }
    }
  }
  if (parsed['flats'] != null) {
    for (let i = 0; i < parsed['flats'].length; i++) {
      const f = parsed['flats'][i].match(/\d+/g);
      if (f % 7 == 1 || f % 7 == 4 || f % 7 == 5) {
        intervals = addToIntervals(intervals, 'd' + f);
      } else {
        intervals = addToIntervals(intervals, 'm' + f);
      }
    }
  }
  if (parsed['add'] != null) {
    for (let i = 0; i < parsed['add'].length; i++) {
      const s = parsed['add'][i].match(/\d+/g);
      const altb = parsed['add'][i].match(/b+|♭+/g);
      const alts = parsed['add'][i].match(/#+|♯+/g);
      let quality = s % 7 == 1 || s % 7 == 4 ? 'P' : 'M';
      if (altb) {
        quality = s % 7 == 1 || s % 7 == 4 ? 'd' : 'm';
      } else if (alts) {
        quality = s % 7 == 0 ? 'M' : 'A';
      }

      intervals = addToIntervals(intervals, quality + s);
    }
  }
  if (parsed['dim'] != null) {
    intervals = addToIntervals(intervals, 'm3');
    intervals = addToIntervals(intervals, 'd5');

    const nb = parsed['dim'][0].match(/\d+/);
    if (nb == 3) {
      intervals = addToIntervals(intervals, 'd3');
    }
    if (nb >= 7) {
      intervals = addToIntervals(intervals, 'd7');
    }
  }
  if (parsed['sus'] != null) {
    for (let i = 0; i < parsed['sus'].length; i++) {
      const s = parsed['sus'][i].match(/\d+/g);
      intervals = removeArray(intervals, 'm3');
      intervals = removeArray(intervals, 'M3');

      if (s == 2 || s == 9) {
        intervals = addToIntervals(intervals, 'M2');
      } else if (s == 4) {
        intervals = addToIntervals(intervals, 'P4');
      } else if (s == 24) {
        intervals = addToIntervals(intervals, 'M2');
        intervals = addToIntervals(intervals, 'P4');
      } else if (s == null) {
        intervals = addToIntervals(intervals, 'P4');
      }
    }
  }
  if (parsed['dom'] != null) {
    intervals = addToIntervals(intervals, 'M3');
    intervals = addToIntervals(intervals, 'm7');
  }
  if (parsed['powerchord']) {
    intervals = removeArray(intervals, 'm3');
    intervals = removeArray(intervals, 'M3');
    intervals = addToIntervals(intervals, 'P8');
  }
  if (parsed['no'] != null) {
    for (let i = 0; i < parsed['no'].length; i++) {
      const nb = parsed['no'][i].match(/\d+/);
      intervals = removeArray(intervals, 'd' + nb);
      intervals = removeArray(intervals, 'm' + nb);
      intervals = removeArray(intervals, 'M' + nb);
      intervals = removeArray(intervals, 'P' + nb);
      intervals = removeArray(intervals, 'A' + nb);
    }
  }

  intervals = sortIntervals(intervals);
  setIntervals(chord, intervals);

  const tonic = chord.getTonic();
  const notes = intervals.map((x) => tonic.plusInterval(x));
  setNotes(chord, notes);

  if (parsed['slash'] != null) {
    const note = parsed['slash'][0].replace(/\//, '');

    const index = hasNote(chord, note);
    if (index > 0) {
      const n = notes[index].plusInterval('P8', 'descending');
      notes.unshift(n);
      notes.splice(index + 1, 1);

      const interval = intervals[index];
      const newInterval = new Interval(interval).invert();
      intervals.unshift('-' + newInterval.getName());
      intervals.splice(index + 1, 1);

      setIntervals(chord, intervals);
      setNotes(chord, notes);
    } else if (index < 0) {
      const newInterval = new Interval(tonic, note + (tonic.getOctave() - 1));
      intervals.unshift('-' + newInterval.getName());

      const n = tonic.plusInterval(newInterval, 'descending');
      notes.unshift(n);

      setIntervals(chord, intervals);
      setNotes(chord, notes);
    }
  }
};
const removeArray = function(arr, el) {
  const index = arr.indexOf(el);
  if (index > -1) {
    arr.splice(index, 1);
  }
  return arr;
};
const arrayRemoveCheck = function(arr, el) {
  const index = arr.indexOf(el);
  let present = false;
  if (index > -1) {
    arr.splice(index, 1);
    present = true;
  }
  return present;
};
const addToIntervals = function(intervals, interval) {
  // intervals = removeArray(intervals,interval)
  const nb = interval.slice(1);
  if (hasNumber(intervals, nb)) {
    intervals = removeArray(intervals, 'm' + nb);
    intervals = removeArray(intervals, 'M' + nb);
    intervals = removeArray(intervals, 'd' + nb);
    intervals = removeArray(intervals, 'P' + nb);
    intervals = removeArray(intervals, 'A' + nb);
  }
  intervals.push(interval);
  return intervals;
};
const sortIntervals = function(intervals) {
  intervals = intervals.sort(function(a, b) {
    const nameA = parseInt(a.match(/\d+/));
    const nameB = parseInt(b.match(/\d+/));
    if (nameA < nameB) {
      // sort string ascending
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0; // default return value (no sorting)
  });
  return intervals;
};
const hasNumber = function(intervals, number) {
  return intervals.reduce(function(hasNumber, interval) {
    return hasNumber || parseInt(interval.slice(1)) == number;
  }, false);
};
const hasNote = function(chord, note) {
  const notes = chord.getNotesName();
  for (let i = 0; i < notes.length; i++) {
    if (notes[i].replace(/\d+/, '') == note) {
      return i;
    }
  }
  return -1;
};
const findPermutations = function(notes) {
  const roots = [];
  const intervals = [];
  const slashNotes = [];

  // case no slash
  for (let i = 0; i < notes.length; i++) {
    const c = new Chord(notes, 'dummyChord');
    c.invert(i);
    const inter = findIntervalsFromNotes(c.getNotes());

    roots.push(c.getNotes()[0]);
    intervals.push(inter);
    slashNotes.push(null);
  }
  // case slash
  const slash = notes[0];
  const rNotes = notes.slice(1);
  for (let i = 0; i < rNotes.length; i++) {
    const c = new Chord(rNotes, 'dummyChord');
    c.invert(i);
    const inter = findIntervalsFromNotes(c.getNotes());

    roots.push(c.getNotes()[0]);
    intervals.push(inter);
    slashNotes.push(slash);
  }

  return [roots, intervals, slashNotes];
};
const findNameFromPermutation = function(root, intervals, slash) {
  intervals = intervals.map((x) => x.getName());

  let name = root.getRootName();
  let mods = '';
  let number = '';
  let powerChord = false;
  let no3 = false;

  // check 3rd first
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
      number += '6';
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
      number += '6';
    }
  } else if (arrayRemoveCheck(intervals, 'M2')) {
    mods += 'sus2';
    if (arrayRemoveCheck(intervals, 'P4')) {
      mods += '4';
    }
    if (!arrayRemoveCheck(intervals, 'P5')) {
      mods += 'no5';
    }
    if (arrayRemoveCheck(intervals, 'M6')) {
      number += '6';
    }
  } else if (arrayRemoveCheck(intervals, 'P4')) {
    mods += 'sus4';
    if (!arrayRemoveCheck(intervals, 'P5')) {
      mods += 'no5';
    }
    if (arrayRemoveCheck(intervals, 'M6')) {
      number += '6';
    }
  } else if (arrayRemoveCheck(intervals, 'P5')) {
    if (arrayRemoveCheck(intervals, 'P8')) {
      powerChord = true;
    } else {
      no3 = true;
      if (arrayRemoveCheck(intervals, 'M6')) {
        number += '6';
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
    const x = intervals[i];
    if (x == 'A9') {
      mods += '♯9';
    } else if (x == 'm9') {
      mods += '♭9';
    } else if (x == 'A11') {
      mods += '♯11';
    } else if (x == 'd11') {
      mods += '♭11';
    } else if (x == 'A13') {
      mods += '♯13';
    } else if (x == 'm13') {
      mods += '♭13';
    } else {
      const n = x.match(/\d+/g);
      const q = x.slice(0, 1);
      if (n % 7 == 1 || n % 7 == 4 || n % 7 == 5) {
        if (q == 'P') {
          mods += 'add' + n;
        } else if (q == 'A') {
          mods += 'add♯' + n;
        } else if (q == 'd') {
          mods += 'add♭' + n;
        }
      } else {
        if (q == 'M') {
          mods += 'add' + n;
        } else if (q == 'm') {
          mods += 'add♭' + n;
        } else if (q == 'A') {
          mods += 'add♯' + n;
        } else if (q == 'd') {
          mods += 'add♭♭' + n;
        }
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
  if (no3) {
    mods += 'no3';
  }

  if (slash != null) {
    mods += '/' + slash.getRoot();
  }

  let r = name + number + mods;

  r = r.replace(/m7♭5/g, 'ø');

  return r;
};
const findIntervalsFromNotes = function(notes) {
  const tonic = notes[0];
  const intervals = [];

  for (let i = 0; i < notes.length; i++) {
    let inter = new Interval(tonic, notes[i]);
    if (inter.getOrder() == 'descending') {
      inter = inter.invert();
    }
    intervals.push(inter);
  }

  return intervals;
};
const findPossibleNames = function(chord) {
  const permutations = findPermutations(chord.getNotes());
  const length = permutations[0].length;
  const possibleNames = [];
  let slash = null;

  for (let i = 0; i < length; i++) {
    const name = findNameFromPermutation(permutations[0][i], permutations[1][i], permutations[2][i]);

    let x = [];
    for (let j = 0; j < permutations[1][i].length; j++) {
      const p = permutations[0][i].plusInterval(permutations[1][i][j]);
      if (p != 'impossible to compute') {
        x.push(p);
      }
      if (permutations[2][i] != null) {
        slash = permutations[2][i];
      }
    }
    if (slash != null) {
      x.unshift(slash);
    }
    x = x.map((n) => n.getName());
    const s = name + ' - Notes: ' + x + ' - Intervals: ' + permutations[1][i].map((interval) => interval.getName());

    possibleNames.push([name, s]);
  }
  return possibleNames;
};
