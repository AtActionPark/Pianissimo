'use strict';

const pianissimo = require('../pianissimo');

// Chord
QUnit.test('chordCreate', function(assert) {
  let chord;
  const note = pianissimo.note('C3');

  // basic creation
  chord = pianissimo.chord(note, 'major');
  for (let i = 0; i < 3; i++) {
    assert.equal(chord.getNotesName()[i], ['C3', 'E3', 'G3'][i]);
  }
  // or with note name only
  chord = pianissimo.chord('C3', 'major');
  for (let i = 0; i < 3; i++) {
    assert.equal(chord.getNotesName()[i], ['C3', 'E3', 'G3'][i]);
  }
  // or with notes array
  chord = pianissimo.chord(['C3', 'E3', 'G3'], 'major');
  for (let i = 0; i < 3; i++) {
    assert.equal(chord.getNotesName()[i], ['C3', 'E3', 'G3'][i]);
  }
  // or with combined notation
  chord = pianissimo.chord('Dob7b9');
  for (let i = 0; i < 3; i++) {
    assert.equal(chord.getNotesName()[i], ['Dob3', 'Mib3', 'Solb3', 'Sibb3', 'Reb4'][i]);
  }

  chord = pianissimo.chord(note, 'min');
  for (let i = 0; i < 3; i++) {
    assert.equal(chord.getNotesName()[i], ['C3', 'Eb3', 'G3'][i]);
  }
  chord = pianissimo.chord(note, '7b5');
  for (let i = 0; i < 4; i++) {
    assert.equal(chord.getNotesName()[i], ['C3', 'E3', 'Gb3', 'Bb3'][i]);
  }
  chord = pianissimo.chord(note, '#9');
  for (let i = 0; i < 5; i++) {
    assert.equal(chord.getNotesName()[i], ['C3', 'E3', 'G3', 'D#4'][i]);
  }
  chord = pianissimo.chord(note, '13#9b5');
  for (let i = 0; i < 7; i++) {
    assert.equal(chord.getNotesName()[i], ['C3', 'E3', 'Gb3', 'Bb3', 'D#4', 'F4', 'A4'][i]);
  }
  chord = pianissimo.chord(note, '7sus4');
  for (let i = 0; i < 4; i++) {
    assert.equal(chord.getNotesName()[i], ['C3', 'F3', 'G3', 'Bb3'][i]);
  }
  chord = pianissimo.chord(note, 'addb9');
  for (let i = 0; i < 4; i++) {
    assert.equal(chord.getNotesName()[i], ['C3', 'E3', 'G3', 'Db4'][i]);
  }
  chord = pianissimo.chord(note, 'm(b9b5b7b11)');
  for (let i = 0; i < 6; i++) {
    assert.equal(chord.getNotesName()[i], ['C3', 'Eb3', 'Gb3', 'Bb3', 'Db4', 'Fb4'][i]);
  }
  chord = pianissimo.chord(note, 'ø');
  for (let i = 0; i < 4; i++) {
    assert.equal(chord.getNotesName()[i], ['C3', 'Eb3', 'Gb3', 'Bb3'][i]);
  }
  chord = pianissimo.chord(note, 'mM7');
  for (let i = 0; i < 4; i++) {
    assert.equal(chord.getNotesName()[i], ['C3', 'Eb3', 'G3', 'B3'][i]);
  }
  chord = pianissimo.chord(note, 'add9');
  for (let i = 0; i < 4; i++) {
    assert.equal(chord.getNotesName()[i], ['C3', 'E3', 'G3', 'D4'][i]);
  }
  chord = pianissimo.chord(note, 'o7');
  for (let i = 0; i < 4; i++) {
    assert.equal(chord.getNotesName()[i], ['C3', 'Eb3', 'Gb3', 'Bbb3'][i]);
  }
  chord = pianissimo.chord(note, '5');
  for (let i = 0; i < 3; i++) {
    assert.equal(chord.getNotesName()[i], ['C3', 'G3', 'C4'][i]);
  }
  chord = pianissimo.chord(note, '9no5');
  for (let i = 0; i < 4; i++) {
    assert.equal(chord.getNotesName()[i], ['C3', 'E3', 'Bb3', 'D4'][i]);
  }
  chord = pianissimo.chord(note, 'dom7dim5');
  for (let i = 0; i < 4; i++) {
    assert.equal(chord.getNotesName()[i], ['C3', 'E3', 'Gb3', 'Bb3'][i]);
  }
});

QUnit.test('chordCreate2', function(assert) {
  let chord;
  const note = pianissimo.note('C3');

  // Major
  chord = pianissimo.chord(note, '');
  for (let i = 0; i < 3; i++) {
    assert.equal(chord.getNotesName()[i], ['C3', 'E3', 'G3'][i]);
  }
  chord = pianissimo.chord(note, 'M');
  for (let i = 0; i < 3; i++) {
    assert.equal(chord.getNotesName()[i], ['C3', 'E3', 'G3'][i]);
  }
  chord = pianissimo.chord(note, 'maj');
  for (let i = 0; i < 3; i++) {
    assert.equal(chord.getNotesName()[i], ['C3', 'E3', 'G3'][i]);
  }
  chord = pianissimo.chord(note, 'Major');
  for (let i = 0; i < 3; i++) {
    assert.equal(chord.getNotesName()[i], ['C3', 'E3', 'G3'][i]);
  }
  // Minor
  chord = pianissimo.chord(note, 'm');
  for (let i = 0; i < 3; i++) {
    assert.equal(chord.getNotesName()[i], ['C3', 'Eb3', 'G3'][i]);
  }
  chord = pianissimo.chord(note, '-');
  for (let i = 0; i < 3; i++) {
    assert.equal(chord.getNotesName()[i], ['C3', 'Eb3', 'G3'][i]);
  }
  chord = pianissimo.chord(note, 'min');
  for (let i = 0; i < 3; i++) {
    assert.equal(chord.getNotesName()[i], ['C3', 'Eb3', 'G3'][i]);
  }
  chord = pianissimo.chord(note, 'Minor');
  for (let i = 0; i < 3; i++) {
    assert.equal(chord.getNotesName()[i], ['C3', 'Eb3', 'G3'][i]);
  }
  // augmented
  chord = pianissimo.chord(note, '+');
  for (let i = 0; i < 3; i++) {
    assert.equal(chord.getNotesName()[i], ['C3', 'E3', 'G#3'][i]);
  }
  chord = pianissimo.chord(note, '#5');
  for (let i = 0; i < 3; i++) {
    assert.equal(chord.getNotesName()[i], ['C3', 'E3', 'G#3'][i]);
  }
  chord = pianissimo.chord(note, '+5');
  for (let i = 0; i < 3; i++) {
    assert.equal(chord.getNotesName()[i], ['C3', 'E3', 'G#3'][i]);
  }
  chord = pianissimo.chord(note, 'aug');
  for (let i = 0; i < 3; i++) {
    assert.equal(chord.getNotesName()[i], ['C3', 'E3', 'G#3'][i]);
  }
  chord = pianissimo.chord(note, 'Augmented');
  for (let i = 0; i < 3; i++) {
    assert.equal(chord.getNotesName()[i], ['C3', 'E3', 'G#3'][i]);
  }
  // b5
  chord = pianissimo.chord(note, 'b5');
  for (let i = 0; i < 3; i++) {
    assert.equal(chord.getNotesName()[i], ['C3', 'E3', 'Gb3'][i]);
  }
  chord = pianissimo.chord(note, 'Mb5');
  for (let i = 0; i < 3; i++) {
    assert.equal(chord.getNotesName()[i], ['C3', 'E3', 'Gb3'][i]);
  }
  // dim
  chord = pianissimo.chord(note, '°');
  for (let i = 0; i < 3; i++) {
    assert.equal(chord.getNotesName()[i], ['C3', 'Eb3', 'Gb3'][i]);
  }
  chord = pianissimo.chord(note, 'mb5');
  for (let i = 0; i < 3; i++) {
    assert.equal(chord.getNotesName()[i], ['C3', 'Eb3', 'Gb3'][i]);
  }
  chord = pianissimo.chord(note, '°5');
  for (let i = 0; i < 3; i++) {
    assert.equal(chord.getNotesName()[i], ['C3', 'Eb3', 'Gb3'][i]);
  }
  chord = pianissimo.chord(note, 'dim');
  for (let i = 0; i < 3; i++) {
    assert.equal(chord.getNotesName()[i], ['C3', 'Eb3', 'Gb3'][i]);
  }
  chord = pianissimo.chord(note, 'Diminished');
  for (let i = 0; i < 3; i++) {
    assert.equal(chord.getNotesName()[i], ['C3', 'Eb3', 'Gb3'][i]);
  }
  // sus2
  chord = pianissimo.chord(note, 'sus2');
  for (let i = 0; i < 3; i++) {
    assert.equal(chord.getNotesName()[i], ['C3', 'D3', 'G3'][i]);
  }
  // sus4
  chord = pianissimo.chord(note, 'sus4');
  for (let i = 0; i < 3; i++) {
    assert.equal(chord.getNotesName()[i], ['C3', 'F3', 'G3'][i]);
  }
  // 6
  chord = pianissimo.chord(note, '6');
  for (let i = 0; i < 4; i++) {
    assert.equal(chord.getNotesName()[i], ['C3', 'E3', 'G3', 'A3'][i]);
  }
  chord = pianissimo.chord(note, 'M6');
  for (let i = 0; i < 4; i++) {
    assert.equal(chord.getNotesName()[i], ['C3', 'E3', 'G3', 'A3'][i]);
  }
  chord = pianissimo.chord(note, 'Maj6');
  for (let i = 0; i < 4; i++) {
    assert.equal(chord.getNotesName()[i], ['C3', 'E3', 'G3', 'A3'][i]);
  }
  // m6
  chord = pianissimo.chord(note, 'm6');
  for (let i = 0; i < 4; i++) {
    assert.equal(chord.getNotesName()[i], ['C3', 'Eb3', 'G3', 'A3'][i]);
  }
  chord = pianissimo.chord(note, '6m');
  for (let i = 0; i < 4; i++) {
    assert.equal(chord.getNotesName()[i], ['C3', 'Eb3', 'G3', 'A3'][i]);
  }
  chord = pianissimo.chord(note, 'min6');
  for (let i = 0; i < 4; i++) {
    assert.equal(chord.getNotesName()[i], ['C3', 'Eb3', 'G3', 'A3'][i]);
  }
  // 7
  chord = pianissimo.chord(note, '7');
  for (let i = 0; i < 4; i++) {
    assert.equal(chord.getNotesName()[i], ['C3', 'E3', 'G3', 'Bb3'][i]);
  }
  chord = pianissimo.chord(note, 'dom');
  for (let i = 0; i < 4; i++) {
    assert.equal(chord.getNotesName()[i], ['C3', 'E3', 'G3', 'Bb3'][i]);
  }
  // M7
  chord = pianissimo.chord(note, 'M7');
  for (let i = 0; i < 4; i++) {
    assert.equal(chord.getNotesName()[i], ['C3', 'E3', 'G3', 'B3'][i]);
  }
  chord = pianissimo.chord(note, 'Ma7');
  for (let i = 0; i < 4; i++) {
    assert.equal(chord.getNotesName()[i], ['C3', 'E3', 'G3', 'B3'][i]);
  }
  chord = pianissimo.chord(note, 'Δ7');
  for (let i = 0; i < 4; i++) {
    assert.equal(chord.getNotesName()[i], ['C3', 'E3', 'G3', 'B3'][i]);
  }
  chord = pianissimo.chord(note, 'Δ');
  for (let i = 0; i < 4; i++) {
    assert.equal(chord.getNotesName()[i], ['C3', 'E3', 'G3', 'B3'][i]);
  }
  chord = pianissimo.chord(note, 'Maj7');
  for (let i = 0; i < 4; i++) {
    assert.equal(chord.getNotesName()[i], ['C3', 'E3', 'G3', 'B3'][i]);
  }
  // M7sus2
  chord = pianissimo.chord(note, 'M7sus2');
  for (let i = 0; i < 4; i++) {
    assert.equal(chord.getNotesName()[i], ['C3', 'D3', 'G3', 'B3'][i]);
  }
  chord = pianissimo.chord(note, 'Ma7sus2');
  for (let i = 0; i < 4; i++) {
    assert.equal(chord.getNotesName()[i], ['C3', 'D3', 'G3', 'B3'][i]);
  }
  chord = pianissimo.chord(note, 'MΔ7sus2');
  for (let i = 0; i < 4; i++) {
    assert.equal(chord.getNotesName()[i], ['C3', 'D3', 'G3', 'B3'][i]);
  }
  chord = pianissimo.chord(note, 'MΔsus2');
  for (let i = 0; i < 4; i++) {
    assert.equal(chord.getNotesName()[i], ['C3', 'D3', 'G3', 'B3'][i]);
  }
  chord = pianissimo.chord(note, 'Maj7sus2');
  for (let i = 0; i < 4; i++) {
    assert.equal(chord.getNotesName()[i], ['C3', 'D3', 'G3', 'B3'][i]);
  }
  chord = pianissimo.chord(note, 'Major7sus2');
  for (let i = 0; i < 4; i++) {
    assert.equal(chord.getNotesName()[i], ['C3', 'D3', 'G3', 'B3'][i]);
  }
  // m7
  chord = pianissimo.chord(note, 'm7');
  for (let i = 0; i < 4; i++) {
    assert.equal(chord.getNotesName()[i], ['C3', 'Eb3', 'G3', 'Bb3'][i]);
  }
  chord = pianissimo.chord(note, '-7');
  for (let i = 0; i < 4; i++) {
    assert.equal(chord.getNotesName()[i], ['C3', 'Eb3', 'G3', 'Bb3'][i]);
  }
  chord = pianissimo.chord(note, 'min7');
  for (let i = 0; i < 4; i++) {
    assert.equal(chord.getNotesName()[i], ['C3', 'Eb3', 'G3', 'Bb3'][i]);
  }
  // mM7
  chord = pianissimo.chord(note, 'mM7');
  for (let i = 0; i < 4; i++) {
    assert.equal(chord.getNotesName()[i], ['C3', 'Eb3', 'G3', 'B3'][i]);
  }
  chord = pianissimo.chord(note, 'm#7');
  for (let i = 0; i < 4; i++) {
    assert.equal(chord.getNotesName()[i], ['C3', 'Eb3', 'G3', 'B3'][i]);
  }
  chord = pianissimo.chord(note, '-M7');
  for (let i = 0; i < 4; i++) {
    assert.equal(chord.getNotesName()[i], ['C3', 'Eb3', 'G3', 'B3'][i]);
  }
  chord = pianissimo.chord(note, '-Δ7');
  for (let i = 0; i < 4; i++) {
    assert.equal(chord.getNotesName()[i], ['C3', 'Eb3', 'G3', 'B3'][i]);
  }
  chord = pianissimo.chord(note, '-Δ');
  for (let i = 0; i < 4; i++) {
    assert.equal(chord.getNotesName()[i], ['C3', 'Eb3', 'G3', 'B3'][i]);
  }
  chord = pianissimo.chord(note, 'minmaj7');
  for (let i = 0; i < 4; i++) {
    assert.equal(chord.getNotesName()[i], ['C3', 'Eb3', 'G3', 'B3'][i]);
  }
  // +M7
  chord = pianissimo.chord(note, '+M7');
  for (let i = 0; i < 4; i++) {
    assert.equal(chord.getNotesName()[i], ['C3', 'E3', 'G#3', 'B3'][i]);
  }
  chord = pianissimo.chord(note, '+Δ');
  for (let i = 0; i < 4; i++) {
    assert.equal(chord.getNotesName()[i], ['C3', 'E3', 'G#3', 'B3'][i]);
  }
  chord = pianissimo.chord(note, 'M7#5');
  for (let i = 0; i < 4; i++) {
    assert.equal(chord.getNotesName()[i], ['C3', 'E3', 'G#3', 'B3'][i]);
  }
  chord = pianissimo.chord(note, 'M7+5');
  for (let i = 0; i < 4; i++) {
    assert.equal(chord.getNotesName()[i], ['C3', 'E3', 'G#3', 'B3'][i]);
  }
  chord = pianissimo.chord(note, 'Δ#5');
  for (let i = 0; i < 4; i++) {
    assert.equal(chord.getNotesName()[i], ['C3', 'E3', 'G#3', 'B3'][i]);
  }
  chord = pianissimo.chord(note, 'Δ+5');
  for (let i = 0; i < 4; i++) {
    assert.equal(chord.getNotesName()[i], ['C3', 'E3', 'G#3', 'B3'][i]);
  }
  chord = pianissimo.chord(note, 'augmaj7');
  for (let i = 0; i < 4; i++) {
    assert.equal(chord.getNotesName()[i], ['C3', 'E3', 'G#3', 'B3'][i]);
  }
  // +7
  chord = pianissimo.chord(note, '+7');
  for (let i = 0; i < 4; i++) {
    assert.equal(chord.getNotesName()[i], ['C3', 'E3', 'G#3', 'Bb3'][i]);
  }
  chord = pianissimo.chord(note, '7#5');
  for (let i = 0; i < 4; i++) {
    assert.equal(chord.getNotesName()[i], ['C3', 'E3', 'G#3', 'Bb3'][i]);
  }
  chord = pianissimo.chord(note, '7+5');
  for (let i = 0; i < 4; i++) {
    assert.equal(chord.getNotesName()[i], ['C3', 'E3', 'G#3', 'Bb3'][i]);
  }
  chord = pianissimo.chord(note, 'aug7');
  for (let i = 0; i < 4; i++) {
    assert.equal(chord.getNotesName()[i], ['C3', 'E3', 'G#3', 'Bb3'][i]);
  }
  // CØ
  chord = pianissimo.chord(note, 'Ø');
  for (let i = 0; i < 4; i++) {
    assert.equal(chord.getNotesName()[i], ['C3', 'Eb3', 'Gb3', 'Bb3'][i]);
  }
  chord = pianissimo.chord(note, 'Ø7');
  for (let i = 0; i < 4; i++) {
    assert.equal(chord.getNotesName()[i], ['C3', 'Eb3', 'Gb3', 'Bb3'][i]);
  }
  chord = pianissimo.chord(note, 'ø');
  for (let i = 0; i < 4; i++) {
    assert.equal(chord.getNotesName()[i], ['C3', 'Eb3', 'Gb3', 'Bb3'][i]);
  }
  chord = pianissimo.chord(note, 'ø7');
  for (let i = 0; i < 4; i++) {
    assert.equal(chord.getNotesName()[i], ['C3', 'Eb3', 'Gb3', 'Bb3'][i]);
  }
  chord = pianissimo.chord(note, 'm7b5');
  for (let i = 0; i < 4; i++) {
    assert.equal(chord.getNotesName()[i], ['C3', 'Eb3', 'Gb3', 'Bb3'][i]);
  }
  chord = pianissimo.chord(note, 'm7°5');
  for (let i = 0; i < 4; i++) {
    assert.equal(chord.getNotesName()[i], ['C3', 'Eb3', 'Gb3', 'Bb3'][i]);
  }
  chord = pianissimo.chord(note, 'm-7b5');
  for (let i = 0; i < 4; i++) {
    assert.equal(chord.getNotesName()[i], ['C3', 'Eb3', 'Gb3', 'Bb3'][i]);
  }
  chord = pianissimo.chord(note, 'm-7°5');
  for (let i = 0; i < 4; i++) {
    assert.equal(chord.getNotesName()[i], ['C3', 'Eb3', 'Gb3', 'Bb3'][i]);
  }
  chord = pianissimo.chord(note, 'min7dim5');
  for (let i = 0; i < 4; i++) {
    assert.equal(chord.getNotesName()[i], ['C3', 'Eb3', 'Gb3', 'Bb3'][i]);
  }
  // °7
  chord = pianissimo.chord(note, '°7');
  for (let i = 0; i < 4; i++) {
    assert.equal(chord.getNotesName()[i], ['C3', 'Eb3', 'Gb3', 'Bbb3'][i]);
  }
  chord = pianissimo.chord(note, 'o7');
  for (let i = 0; i < 4; i++) {
    assert.equal(chord.getNotesName()[i], ['C3', 'Eb3', 'Gb3', 'Bbb3'][i]);
  }
  chord = pianissimo.chord(note, 'dim7');
  for (let i = 0; i < 4; i++) {
    assert.equal(chord.getNotesName()[i], ['C3', 'Eb3', 'Gb3', 'Bbb3'][i]);
  }
  // 7b5
  chord = pianissimo.chord(note, '7b5');
  for (let i = 0; i < 4; i++) {
    assert.equal(chord.getNotesName()[i], ['C3', 'E3', 'Gb3', 'Bb3'][i]);
  }
  // 7#9
  chord = pianissimo.chord(note, '7#9');
  for (let i = 0; i < 5; i++) {
    assert.equal(chord.getNotesName()[i], ['C3', 'E3', 'G3', 'Bb3', 'D#4'][i]);
  }
  // M7#9
  chord = pianissimo.chord(note, 'M7#9');
  for (let i = 0; i < 5; i++) {
    assert.equal(chord.getNotesName()[i], ['C3', 'E3', 'G3', 'B3', 'D#4'][i]);
  }
  chord = pianissimo.chord(note, 'Ma7#9');
  for (let i = 0; i < 5; i++) {
    assert.equal(chord.getNotesName()[i], ['C3', 'E3', 'G3', 'B3', 'D#4'][i]);
  }
  chord = pianissimo.chord(note, 'Δ7#9');
  for (let i = 0; i < 5; i++) {
    assert.equal(chord.getNotesName()[i], ['C3', 'E3', 'G3', 'B3', 'D#4'][i]);
  }
  chord = pianissimo.chord(note, 'Δ#9');
  for (let i = 0; i < 5; i++) {
    assert.equal(chord.getNotesName()[i], ['C3', 'E3', 'G3', 'B3', 'D#4'][i]);
  }
  // cm7#9
  chord = pianissimo.chord(note, 'm7#9');
  for (let i = 0; i < 5; i++) {
    assert.equal(chord.getNotesName()[i], ['C3', 'Eb3', 'G3', 'Bb3', 'D#4'][i]);
  }
  chord = pianissimo.chord(note, '-7#9');
  for (let i = 0; i < 5; i++) {
    assert.equal(chord.getNotesName()[i], ['C3', 'Eb3', 'G3', 'Bb3', 'D#4'][i]);
  }
  // 7sus4
  chord = pianissimo.chord(note, '7sus4');
  for (let i = 0; i < 4; i++) {
    assert.equal(chord.getNotesName()[i], ['C3', 'F3', 'G3', 'Bb3'][i]);
  }
  // 7sus2
  chord = pianissimo.chord(note, '7sus2');
  for (let i = 0; i < 4; i++) {
    assert.equal(chord.getNotesName()[i], ['C3', 'D3', 'G3', 'Bb3'][i]);
  }
  // 7#11
  chord = pianissimo.chord(note, '7#11');
  for (let i = 0; i < 5; i++) {
    assert.equal(chord.getNotesName()[i], ['C3', 'E3', 'G3', 'Bb3', 'F#4'][i]);
  }
  // 7M7#11
  chord = pianissimo.chord(note, 'M7#11');
  for (let i = 0; i < 5; i++) {
    assert.equal(chord.getNotesName()[i], ['C3', 'E3', 'G3', 'B3', 'F#4'][i]);
  }
  chord = pianissimo.chord(note, 'Δ7#11');
  for (let i = 0; i < 5; i++) {
    assert.equal(chord.getNotesName()[i], ['C3', 'E3', 'G3', 'B3', 'F#4'][i]);
  }
  // m7#11
  chord = pianissimo.chord(note, 'm7#11');
  for (let i = 0; i < 5; i++) {
    assert.equal(chord.getNotesName()[i], ['C3', 'Eb3', 'G3', 'Bb3', 'F#4'][i]);
  }
  chord = pianissimo.chord(note, '-7#11');
  for (let i = 0; i < 5; i++) {
    assert.equal(chord.getNotesName()[i], ['C3', 'Eb3', 'G3', 'Bb3', 'F#4'][i]);
  }
  // 7susb13
  chord = pianissimo.chord(note, '7susb13');
  for (let i = 0; i < 5; i++) {
    assert.equal(chord.getNotesName()[i], ['C3', 'F3', 'G3', 'Bb3', 'Ab4'][i]);
  }
  // M9
  chord = pianissimo.chord(note, 'M9');
  for (let i = 0; i < 5; i++) {
    assert.equal(chord.getNotesName()[i], ['C3', 'E3', 'G3', 'B3', 'D4'][i]);
  }
  chord = pianissimo.chord(note, 'Δ9');
  for (let i = 0; i < 5; i++) {
    assert.equal(chord.getNotesName()[i], ['C3', 'E3', 'G3', 'B3', 'D4'][i]);
  }
  chord = pianissimo.chord(note, 'maj9');
  for (let i = 0; i < 5; i++) {
    assert.equal(chord.getNotesName()[i], ['C3', 'E3', 'G3', 'B3', 'D4'][i]);
  }
  // 9
  chord = pianissimo.chord(note, '9');
  for (let i = 0; i < 5; i++) {
    assert.equal(chord.getNotesName()[i], ['C3', 'E3', 'G3', 'Bb3', 'D4'][i]);
  }
  chord = pianissimo.chord(note, 'dom9');
  for (let i = 0; i < 5; i++) {
    assert.equal(chord.getNotesName()[i], ['C3', 'E3', 'G3', 'Bb3', 'D4'][i]);
  }
  // mM9
  chord = pianissimo.chord(note, 'mM9');
  for (let i = 0; i < 5; i++) {
    assert.equal(chord.getNotesName()[i], ['C3', 'Eb3', 'G3', 'B3', 'D4'][i]);
  }
  chord = pianissimo.chord(note, '-M9');
  for (let i = 0; i < 5; i++) {
    assert.equal(chord.getNotesName()[i], ['C3', 'Eb3', 'G3', 'B3', 'D4'][i]);
  }
  chord = pianissimo.chord(note, 'minM9');
  for (let i = 0; i < 5; i++) {
    assert.equal(chord.getNotesName()[i], ['C3', 'Eb3', 'G3', 'B3', 'D4'][i]);
  }
  // m9
  chord = pianissimo.chord(note, 'm9');
  for (let i = 0; i < 5; i++) {
    assert.equal(chord.getNotesName()[i], ['C3', 'Eb3', 'G3', 'Bb3', 'D4'][i]);
  }
  chord = pianissimo.chord(note, '-9');
  for (let i = 0; i < 5; i++) {
    assert.equal(chord.getNotesName()[i], ['C3', 'Eb3', 'G3', 'Bb3', 'D4'][i]);
  }
  chord = pianissimo.chord(note, 'min9');
  for (let i = 0; i < 5; i++) {
    assert.equal(chord.getNotesName()[i], ['C3', 'Eb3', 'G3', 'Bb3', 'D4'][i]);
  }
  // +M9
  chord = pianissimo.chord(note, '+M9');
  for (let i = 0; i < 5; i++) {
    assert.equal(chord.getNotesName()[i], ['C3', 'E3', 'G#3', 'B3', 'D4'][i]);
  }
  chord = pianissimo.chord(note, 'augmaj9');
  for (let i = 0; i < 5; i++) {
    assert.equal(chord.getNotesName()[i], ['C3', 'E3', 'G#3', 'B3', 'D4'][i]);
  }
  // +9
  chord = pianissimo.chord(note, '+9');
  for (let i = 0; i < 5; i++) {
    assert.equal(chord.getNotesName()[i], ['C3', 'E3', 'G#3', 'Bb3', 'D4'][i]);
  }
  chord = pianissimo.chord(note, '9#5');
  for (let i = 0; i < 5; i++) {
    assert.equal(chord.getNotesName()[i], ['C3', 'E3', 'G#3', 'Bb3', 'D4'][i]);
  }
  chord = pianissimo.chord(note, 'aug9');
  for (let i = 0; i < 5; i++) {
    assert.equal(chord.getNotesName()[i], ['C3', 'E3', 'G#3', 'Bb3', 'D4'][i]);
  }
  // ø9
  chord = pianissimo.chord(note, 'ø9');
  for (let i = 0; i < 5; i++) {
    assert.equal(chord.getNotesName()[i], ['C3', 'Eb3', 'Gb3', 'Bb3', 'D4'][i]);
  }
  // øb9
  chord = pianissimo.chord(note, 'øb9');
  for (let i = 0; i < 5; i++) {
    assert.equal(chord.getNotesName()[i], ['C3', 'Eb3', 'Gb3', 'Bb3', 'Db4'][i]);
  }
  // dim9
  chord = pianissimo.chord(note, 'dim9');
  for (let i = 0; i < 5; i++) {
    assert.equal(chord.getNotesName()[i], ['C3', 'Eb3', 'Gb3', 'Bbb3', 'D4'][i]);
  }
  chord = pianissimo.chord(note, '°9');
  for (let i = 0; i < 5; i++) {
    assert.equal(chord.getNotesName()[i], ['C3', 'Eb3', 'Gb3', 'Bbb3', 'D4'][i]);
  }
  // dimb9
  chord = pianissimo.chord(note, 'dimb9');
  for (let i = 0; i < 5; i++) {
    assert.equal(chord.getNotesName()[i], ['C3', 'Eb3', 'Gb3', 'Bbb3', 'Db4'][i]);
  }
  chord = pianissimo.chord(note, '°b9');
  for (let i = 0; i < 5; i++) {
    assert.equal(chord.getNotesName()[i], ['C3', 'Eb3', 'Gb3', 'Bbb3', 'Db4'][i]);
  }
  // M11
  chord = pianissimo.chord(note, 'M11');
  for (let i = 0; i < 6; i++) {
    assert.equal(chord.getNotesName()[i], ['C3', 'E3', 'G3', 'B3', 'D4', 'F4'][i]);
  }
  chord = pianissimo.chord(note, 'Δ11');
  for (let i = 0; i < 6; i++) {
    assert.equal(chord.getNotesName()[i], ['C3', 'E3', 'G3', 'B3', 'D4', 'F4'][i]);
  }
  chord = pianissimo.chord(note, 'maj11');
  for (let i = 0; i < 6; i++) {
    assert.equal(chord.getNotesName()[i], ['C3', 'E3', 'G3', 'B3', 'D4', 'F4'][i]);
  }
  // m11
  chord = pianissimo.chord(note, 'm11');
  for (let i = 0; i < 6; i++) {
    assert.equal(chord.getNotesName()[i], ['C3', 'Eb3', 'G3', 'Bb3', 'D4', 'F4'][i]);
  }
  chord = pianissimo.chord(note, '-11');
  for (let i = 0; i < 6; i++) {
    assert.equal(chord.getNotesName()[i], ['C3', 'Eb3', 'G3', 'Bb3', 'D4', 'F4'][i]);
  }
  chord = pianissimo.chord(note, 'min11');
  for (let i = 0; i < 6; i++) {
    assert.equal(chord.getNotesName()[i], ['C3', 'Eb3', 'G3', 'Bb3', 'D4', 'F4'][i]);
  }
  // mM11
  chord = pianissimo.chord(note, 'mM11');
  for (let i = 0; i < 6; i++) {
    assert.equal(chord.getNotesName()[i], ['C3', 'Eb3', 'G3', 'B3', 'D4', 'F4'][i]);
  }
  chord = pianissimo.chord(note, '-M11');
  for (let i = 0; i < 6; i++) {
    assert.equal(chord.getNotesName()[i], ['C3', 'Eb3', 'G3', 'B3', 'D4', 'F4'][i]);
  }
  chord = pianissimo.chord(note, 'minmaj11');
  for (let i = 0; i < 6; i++) {
    assert.equal(chord.getNotesName()[i], ['C3', 'Eb3', 'G3', 'B3', 'D4', 'F4'][i]);
  }
  // 11
  chord = pianissimo.chord(note, '11');
  for (let i = 0; i < 6; i++) {
    assert.equal(chord.getNotesName()[i], ['C3', 'E3', 'G3', 'Bb3', 'D4', 'F4'][i]);
  }
  // M13
  chord = pianissimo.chord(note, 'M13');
  for (let i = 0; i < 7; i++) {
    assert.equal(chord.getNotesName()[i], ['C3', 'E3', 'G3', 'B3', 'D4', 'F4', 'A4'][i]);
  }
  chord = pianissimo.chord(note, 'Δ13');
  for (let i = 0; i < 7; i++) {
    assert.equal(chord.getNotesName()[i], ['C3', 'E3', 'G3', 'B3', 'D4', 'F4', 'A4'][i]);
  }
  chord = pianissimo.chord(note, 'maj13');
  for (let i = 0; i < 7; i++) {
    assert.equal(chord.getNotesName()[i], ['C3', 'E3', 'G3', 'B3', 'D4', 'F4', 'A4'][i]);
  }
  // m13
  chord = pianissimo.chord(note, 'm13');
  for (let i = 0; i < 7; i++) {
    assert.equal(chord.getNotesName()[i], ['C3', 'Eb3', 'G3', 'Bb3', 'D4', 'F4', 'A4'][i]);
  }
  chord = pianissimo.chord(note, '-13');
  for (let i = 0; i < 7; i++) {
    assert.equal(chord.getNotesName()[i], ['C3', 'Eb3', 'G3', 'Bb3', 'D4', 'F4', 'A4'][i]);
  }
  chord = pianissimo.chord(note, 'min13');
  for (let i = 0; i < 7; i++) {
    assert.equal(chord.getNotesName()[i], ['C3', 'Eb3', 'G3', 'Bb3', 'D4', 'F4', 'A4'][i]);
  }
  // 13
  chord = pianissimo.chord(note, '13');
  for (let i = 0; i < 7; i++) {
    assert.equal(chord.getNotesName()[i], ['C3', 'E3', 'G3', 'Bb3', 'D4', 'F4', 'A4'][i]);
  }
  chord = pianissimo.chord(note, 'dom13');
  for (let i = 0; i < 7; i++) {
    assert.equal(chord.getNotesName()[i], ['C3', 'E3', 'G3', 'Bb3', 'D4', 'F4', 'A4'][i]);
  }
});

QUnit.test('chordTranspose', function(assert) {
  let chord;

  // basic creation
  chord = pianissimo.chord('Cdim7');
  chord.transpose('m2', 'descending');
  for (let i = 0; i < 3; i++) {
    assert.equal(chord.getNotesName()[i], ['B2', 'D3', 'F3', 'Ab3'][i]);
  }
  assert.equal(chord.getName(), 'Bdim7');

  chord = pianissimo.chord('Cmajor/G');
  chord.transpose('P5');
  for (let i = 0; i < 3; i++) {
    assert.equal(chord.getNotesName()[i], ['D3', 'G3', 'B3'][i]);
  }
  assert.equal(chord.getName(), 'Gmajor/D');
});

QUnit.test('chordNamer', function(assert) {
  let chord;

  chord = pianissimo.chord(['C3', 'E3', 'G3']);
  assert.equal(chord.getName(), 'C');

  chord = pianissimo.chord(['C3', 'Eb3', 'G3']);
  assert.equal(chord.getName(), 'Cm');

  chord = pianissimo.chord(['C3', 'E3', 'G#3']);
  assert.equal(chord.getName(), 'C+');

  chord = pianissimo.chord(['C3', 'E3', 'Gb3']);
  assert.equal(chord.getName(), 'C♭5');

  chord = pianissimo.chord(['C3', 'Eb3', 'Gb3']);
  assert.equal(chord.getName(), 'Cdim');

  chord = pianissimo.chord(['C3', 'D3', 'G3']);
  assert.equal(chord.getName(), 'Csus2');

  chord = pianissimo.chord(['C3', 'F3', 'G3']);
  assert.equal(chord.getName(), 'Csus4');

  chord = pianissimo.chord(['C3', 'E3', 'G3', 'A3']);
  assert.equal(chord.getName(), 'C6');

  chord = pianissimo.chord(['C3', 'Eb3', 'G3', 'A3']);
  assert.equal(chord.getName(), 'Cm6');

  chord = pianissimo.chord(['C3', 'E3', 'G3', 'Bb3']);
  assert.equal(chord.getName(), 'C7');

  chord = pianissimo.chord(['C3', 'Eb3', 'G3', 'Bb3']);
  assert.equal(chord.getName(), 'Cm7');

  chord = pianissimo.chord(['C3', 'E3', 'G3', 'B3']);
  assert.equal(chord.getName(), 'CΔ');

  chord = pianissimo.chord(['C3', 'Eb3', 'G3', 'B3']);
  assert.equal(chord.getName(), 'CmΔ');

  chord = pianissimo.chord(['C3', 'E3', 'G#3', 'B3']);
  assert.equal(chord.getName(), 'C+Δ');

  chord = pianissimo.chord(['C3', 'E3', 'G#3', 'Bb3']);
  assert.equal(chord.getName(), 'C+7');

  chord = pianissimo.chord(['C3', 'E3', 'Gb3', 'Bb3']);
  assert.equal(chord.getName(), 'C7♭5');

  chord = pianissimo.chord(['C3', 'Eb3', 'Gb3', 'Bb3']);
  assert.equal(chord.getName(), 'Cø');

  chord = pianissimo.chord(['C3', 'E3', 'G3', 'Bb3', 'D#4']);
  assert.equal(chord.getName(), 'C7♯9');

  chord = pianissimo.chord(['C3', 'E3', 'G3', 'B3', 'D#4']);
  assert.equal(chord.getName(), 'CΔ♯9');

  chord = pianissimo.chord(['C3', 'Eb3', 'G3', 'Bb3', 'D#4']);
  assert.equal(chord.getName(), 'Cm7♯9');

  chord = pianissimo.chord(['C3', 'F3', 'G3', 'Bb3']);
  assert.equal(chord.getName(), 'C7sus4');

  chord = pianissimo.chord(['C3', 'D3', 'G3', 'Bb3']);
  assert.equal(chord.getName(), 'C7sus2');

  chord = pianissimo.chord(['C3', 'E3', 'G3', 'Bb3', 'F#4']);
  assert.equal(chord.getName(), 'C7♯11');

  chord = pianissimo.chord(['C3', 'E3', 'G3', 'B3', 'F#4']);
  assert.equal(chord.getName(), 'CΔ♯11');

  chord = pianissimo.chord(['C3', 'Eb3', 'G3', 'Bb3', 'F#4']);
  assert.equal(chord.getName(), 'Cm7♯11');

  chord = pianissimo.chord(['C3', 'F3', 'G3', 'Bb3', 'Ab4']);
  assert.equal(chord.getName(), 'C7sus4♭13');

  chord = pianissimo.chord(['C3', 'E3', 'G3', 'Bb3', 'D4']);
  assert.equal(chord.getName(), 'C9');

  chord = pianissimo.chord(['C3', 'E3', 'G3', 'B3', 'D4']);
  assert.equal(chord.getName(), 'CΔ9');

  chord = pianissimo.chord(['C3', 'Eb3', 'G3', 'B3', 'D4']);
  assert.equal(chord.getName(), 'CmΔ9');

  chord = pianissimo.chord(['C3', 'Eb3', 'G3', 'Bb3', 'D4']);
  assert.equal(chord.getName(), 'Cm9');

  chord = pianissimo.chord(['C3', 'E3', 'G#3', 'B3', 'D4']);
  assert.equal(chord.getName(), 'C+Δ9');

  chord = pianissimo.chord(['C3', 'E3', 'G#3', 'Bb3', 'D4']);
  assert.equal(chord.getName(), 'C+9');

  chord = pianissimo.chord(['C3', 'Eb3', 'Gb3', 'Bb3', 'D4']);
  assert.equal(chord.getName(), 'Cm9♭5');

  chord = pianissimo.chord(['C3', 'Eb3', 'Gb3', 'Bb3', 'Db4']);
  assert.equal(chord.getName(), 'Cø♭9');

  chord = pianissimo.chord(['C3', 'Eb3', 'Gb3', 'Bbb3', 'D4']);
  assert.equal(chord.getName(), 'Cdim9');

  chord = pianissimo.chord(['C3', 'Eb3', 'Gb3', 'Bbb3', 'Db4']);
  assert.equal(chord.getName(), 'Cdim7♭9');

  chord = pianissimo.chord(['C3', 'E3', 'G3', 'B3', 'D4', 'F4']);
  assert.equal(chord.getName(), 'CΔ11');

  chord = pianissimo.chord(['C3', 'Eb3', 'G3', 'Bb3', 'D4', 'F4']);
  assert.equal(chord.getName(), 'Cm11');

  chord = pianissimo.chord(['C3', 'Eb3', 'G3', 'B3', 'D4', 'F4']);
  assert.equal(chord.getName(), 'CmΔ11');

  chord = pianissimo.chord(['C3', 'E3', 'G3', 'Bb3', 'D4', 'F4']);
  assert.equal(chord.getName(), 'C11');

  chord = pianissimo.chord(['C3', 'E3', 'G3', 'B3', 'D4', 'F4', 'A4']);
  assert.equal(chord.getName(), 'CΔ13');

  chord = pianissimo.chord(['C3', 'Eb3', 'G3', 'B3', 'D4', 'F4', 'A4']);
  assert.equal(chord.getName(), 'CmΔ13');

  chord = pianissimo.chord(['C3', 'Eb3', 'G3', 'Bb3', 'D4', 'F4', 'A4']);
  assert.equal(chord.getName(), 'Cm13');

  chord = pianissimo.chord(['C3', 'E3', 'G3', 'Bb3', 'D4', 'F4', 'A4']);
  assert.equal(chord.getName(), 'C13');
});
