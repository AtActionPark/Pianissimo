'use strict';

const pianissimo = require('../pianissimo');
const Helpers = require('../lib/helper');

// Note
QUnit.test('noteCreate', function(assert) {
  let note = pianissimo.note('C3');
  assert.equal(note.getName(), 'C3');
  assert.equal(note.getRoot(), 'C');
  assert.equal(note.getOctave(), '3');
  assert.equal(note.getAlteration(), '');

  note = pianissimo.note('Bb6');
  assert.equal(note.getName(), 'Bb6');
  assert.equal(note.getRoot(), 'Bb');
  assert.equal(note.getOctave(), '6');
  assert.equal(note.getAlteration(), 'b');

  note = pianissimo.note('B##6');
  assert.equal(note.getName(), 'B##6');
  assert.equal(note.getRoot(), 'B##');
  assert.equal(note.getOctave(), '6');
  assert.equal(note.getAlteration(), '##');

  note = pianissimo.note('Solbb6');
  assert.equal(note.getName(), 'Solbb6');
  assert.equal(note.getRoot(), 'Solbb');
  assert.equal(note.getOctave(), '6');
  assert.equal(note.getAlteration(), 'bb');

  note = pianissimo.note('Do');
  assert.equal(note.getName(), 'Do3');
  assert.equal(note.getRoot(), 'Do');
  assert.equal(note.getOctave(), '3');
  assert.equal(note.getAlteration(), '');

  note = pianissimo.note('Fab1');
  assert.equal(note.getName(), 'Fab1');
  assert.equal(note.getRoot(), 'Fab');
  assert.equal(note.getOctave(), '1');
  assert.equal(note.getAlteration(), 'b');

  note = pianissimo.note('fab1');
  assert.equal(note.getName(), 'fab1');
  assert.equal(note.getRoot(), 'fab');
  assert.equal(note.getOctave(), '1');
  assert.equal(note.getAlteration(), 'b');

  note = pianissimo.note('Fab12');
  assert.equal(note.getName(), 'Fab12');
  assert.equal(note.getRoot(), 'Fab');
  assert.equal(note.getOctave(), '12');
  assert.equal(note.getAlteration(), 'b');

  note = pianissimo.note('5Cx');
  assert.equal(note.getName(), '5Cx');
  assert.equal(note.getRoot(), 'Cx');
  assert.equal(note.getOctave(), '5');
  assert.equal(note.getAlteration(), 'x');

  // with midi number (cf. http://www.inspiredacoustics.com/en/MIDI_note_numbers_and_center_frequencies)
  assert.equal(pianissimo.note(21).getName(), 'A0');
  assert.equal(pianissimo.note(22).getName(), 'A#0');
  assert.equal(pianissimo.note(23).getName(), 'B0');
  assert.equal(pianissimo.note(24).getName(), 'C1');
  assert.equal(pianissimo.note(25).getName(), 'C#1');
  assert.equal(pianissimo.note(26).getName(), 'D1');
  assert.equal(pianissimo.note(27).getName(), 'D#1');
  assert.equal(pianissimo.note(28).getName(), 'E1');
  assert.equal(pianissimo.note(29).getName(), 'F1');
  assert.equal(pianissimo.note(30).getName(), 'F#1');
  assert.equal(pianissimo.note(31).getName(), 'G1');
  assert.equal(pianissimo.note(32).getName(), 'G#1');
  assert.equal(pianissimo.note(33).getName(), 'A1');
  assert.equal(pianissimo.note(34).getName(), 'A#1');
  assert.equal(pianissimo.note(35).getName(), 'B1');
  assert.equal(pianissimo.note(36).getName(), 'C2');
  assert.equal(pianissimo.note(37).getName(), 'C#2');
  assert.equal(pianissimo.note(38).getName(), 'D2');
  assert.equal(pianissimo.note(39).getName(), 'D#2');
  assert.equal(pianissimo.note(40).getName(), 'E2');
  assert.equal(pianissimo.note(41).getName(), 'F2');
  assert.equal(pianissimo.note(42).getName(), 'F#2');
  assert.equal(pianissimo.note(43).getName(), 'G2');
  assert.equal(pianissimo.note(44).getName(), 'G#2');
  assert.equal(pianissimo.note(45).getName(), 'A2');
  assert.equal(pianissimo.note(46).getName(), 'A#2');
  assert.equal(pianissimo.note(47).getName(), 'B2');
  assert.equal(pianissimo.note(48).getName(), 'C3');
  assert.equal(pianissimo.note(49).getName(), 'C#3');
  assert.equal(pianissimo.note(50).getName(), 'D3');
  assert.equal(pianissimo.note(51).getName(), 'D#3');
  assert.equal(pianissimo.note(52).getName(), 'E3');
  assert.equal(pianissimo.note(53).getName(), 'F3');
  assert.equal(pianissimo.note(54).getName(), 'F#3');
  assert.equal(pianissimo.note(55).getName(), 'G3');
  assert.equal(pianissimo.note(56).getName(), 'G#3');
  assert.equal(pianissimo.note(57).getName(), 'A3');
  assert.equal(pianissimo.note(58).getName(), 'A#3');
  assert.equal(pianissimo.note(59).getName(), 'B3');
  assert.equal(pianissimo.note(60).getName(), 'C4');
  assert.equal(pianissimo.note(61).getName(), 'C#4');
  assert.equal(pianissimo.note(62).getName(), 'D4');
  assert.equal(pianissimo.note(63).getName(), 'D#4');
  assert.equal(pianissimo.note(64).getName(), 'E4');
  assert.equal(pianissimo.note(65).getName(), 'F4');
  assert.equal(pianissimo.note(66).getName(), 'F#4');
  assert.equal(pianissimo.note(67).getName(), 'G4');
  assert.equal(pianissimo.note(68).getName(), 'G#4');
  assert.equal(pianissimo.note(69).getName(), 'A4');
  assert.equal(pianissimo.note(70).getName(), 'A#4');
  assert.equal(pianissimo.note(71).getName(), 'B4');
  assert.equal(pianissimo.note(72).getName(), 'C5');
  assert.equal(pianissimo.note(73).getName(), 'C#5');
  assert.equal(pianissimo.note(74).getName(), 'D5');
  assert.equal(pianissimo.note(75).getName(), 'D#5');
  assert.equal(pianissimo.note(76).getName(), 'E5');
  assert.equal(pianissimo.note(77).getName(), 'F5');
  assert.equal(pianissimo.note(78).getName(), 'F#5');
  assert.equal(pianissimo.note(79).getName(), 'G5');
  assert.equal(pianissimo.note(80).getName(), 'G#5');
  assert.equal(pianissimo.note(81).getName(), 'A5');
  assert.equal(pianissimo.note(82).getName(), 'A#5');
  assert.equal(pianissimo.note(83).getName(), 'B5');
  assert.equal(pianissimo.note(84).getName(), 'C6');
  assert.equal(pianissimo.note(85).getName(), 'C#6');
  assert.equal(pianissimo.note(86).getName(), 'D6');
  assert.equal(pianissimo.note(87).getName(), 'D#6');
  assert.equal(pianissimo.note(88).getName(), 'E6');
  assert.equal(pianissimo.note(89).getName(), 'F6');
  assert.equal(pianissimo.note(90).getName(), 'F#6');
  assert.equal(pianissimo.note(91).getName(), 'G6');
  assert.equal(pianissimo.note(92).getName(), 'G#6');
  assert.equal(pianissimo.note(93).getName(), 'A6');
  assert.equal(pianissimo.note(94).getName(), 'A#6');
  assert.equal(pianissimo.note(95).getName(), 'B6');
  assert.equal(pianissimo.note(96).getName(), 'C7');
  assert.equal(pianissimo.note(97).getName(), 'C#7');
  assert.equal(pianissimo.note(98).getName(), 'D7');
  assert.equal(pianissimo.note(99).getName(), 'D#7');
  assert.equal(pianissimo.note(100).getName(), 'E7');
  assert.equal(pianissimo.note(101).getName(), 'F7');
  assert.equal(pianissimo.note(102).getName(), 'F#7');
  assert.equal(pianissimo.note(103).getName(), 'G7');
  assert.equal(pianissimo.note(104).getName(), 'G#7');
  assert.equal(pianissimo.note(105).getName(), 'A7');
  assert.equal(pianissimo.note(106).getName(), 'A#7');
  assert.equal(pianissimo.note(107).getName(), 'B7');
  assert.equal(pianissimo.note(108).getName(), 'C8');
  assert.equal(pianissimo.note(109).getName(), 'C#8');
  assert.equal(pianissimo.note(110).getName(), 'D8');
  assert.equal(pianissimo.note(111).getName(), 'D#8');
  assert.equal(pianissimo.note(112).getName(), 'E8');
  assert.equal(pianissimo.note(113).getName(), 'F8');
  assert.equal(pianissimo.note(114).getName(), 'F#8');
  assert.equal(pianissimo.note(115).getName(), 'G8');
  assert.equal(pianissimo.note(116).getName(), 'G#8');
  assert.equal(pianissimo.note(117).getName(), 'A8');
  assert.equal(pianissimo.note(118).getName(), 'A#8');
  assert.equal(pianissimo.note(119).getName(), 'B8');
  assert.equal(pianissimo.note(120).getName(), 'C9');
  assert.equal(pianissimo.note(121).getName(), 'C#9');
  assert.equal(pianissimo.note(122).getName(), 'D9');
  assert.equal(pianissimo.note(123).getName(), 'D#9');
  assert.equal(pianissimo.note(124).getName(), 'E9');
  assert.equal(pianissimo.note(125).getName(), 'F9');
  assert.equal(pianissimo.note(126).getName(), 'F#9');
  assert.equal(pianissimo.note(127).getName(), 'G9');

  note = pianissimo.note(127);
  assert.equal(note.getName(), 'G9');
  assert.equal(note.getRoot(), 'G');
  assert.equal(note.getOctave(), '9');
  assert.equal(note.getAlteration(), '');

  note = pianissimo.note(66);
  assert.equal(note.getName(), 'F#4');
  assert.equal(note.getRoot(), 'F#');
  assert.equal(note.getOctave(), '4');
  assert.equal(note.getAlteration(), '#');

  // no octave provided, should default to 3
  note = pianissimo.note('B');
  assert.equal(note.getName(), 'B3');
  assert.equal(note.getRoot(), 'B');
  assert.equal(note.getOctave(), '3');
  assert.equal(note.getAlteration(), '');

  // bad alteration, should throw error
  assert.throws(function() {
    pianissimo.note('B#b2');
  }, '#b is not a valid alteration');
  assert.throws(function() {
    pianissimo.note('B###b2');
  }, '### is not a valid alteration');
  assert.throws(function() {
    pianissimo.note('Solb#bb2');
  }, 'b#bb is not a valid alteration');

  // bad name, should throw error
  assert.throws(function() {
    pianissimo.note('H2');
  }, 'H is not a note');
  assert.throws(function() {
    pianissimo.note('Sil2');
  }, 'Sil is not a note');
});
QUnit.test('note.getFrequency', function(assert) {
  pianissimo.setA4(440);
  let noteFreq = pianissimo.note('A4').getFrequency();
  assert.equal(noteFreq, 440, 'A4 - 440hz');

  noteFreq = pianissimo.note('La5').getFrequency();
  assert.equal(noteFreq, 880, 'La5 - 880hz');

  noteFreq = pianissimo.note('C#3').getFrequency();
  const note2Freq = pianissimo.note('Reb3').getFrequency();
  assert.equal(noteFreq, note2Freq, 'C#3 = Bb3');

  pianissimo.setA4(442);
  noteFreq = pianissimo.note('La5').getFrequency();
  assert.equal(noteFreq, 884, 'A4 - 884hz');
});
QUnit.test('note.plusInterval', function(assert) {
  let note = pianissimo.note('C3');
  let interval = pianissimo.interval('m3', 'ascending');
  assert.equal(note.plusInterval(interval).getName(), 'Eb3');

  note = pianissimo.note('C3');
  interval = pianissimo.interval('P5', -1);
  assert.equal(note.plusInterval(interval).getName(), 'F2');

  note = pianissimo.note('Db3');
  interval = pianissimo.interval('m2', 'ascending');
  assert.equal(note.plusInterval(interval).getName(), 'Ebb3');

  note = pianissimo.note('F#5');
  interval = pianissimo.interval('P15', '-');
  assert.equal(note.plusInterval(interval).getName(), 'F#3');

  note = pianissimo.note('Solb2');
  interval = pianissimo.interval('P8', 1);
  assert.equal(note.plusInterval(interval).getName(), 'Solb3');
});
QUnit.test('note.toScale', function(assert) {
  let note = pianissimo.note('C3');
  let scale = note.toScale('major');
  assert.equal(scale.getNotes().length, 7);
  assert.equal(Helpers.isNote(scale.getNotes()[5]), true);
  assert.equal(scale.getNotes()[5].getName(), 'A3');

  note = pianissimo.note('Sol3');
  scale = note.toScale('minor');
  assert.equal(scale.getNotes().length, 7);
  assert.equal(Helpers.isNote(scale.getNotes()[5]), true);
  assert.equal(scale.getNotes()[5].getName(), 'Mib4');
});
QUnit.test('note.toChord', function(assert) {
  const note = pianissimo.note('C3');
  const chord = note.toChord('major');
  assert.equal(Helpers.isNote(chord.getNotes()[2]), true);
  assert.equal(chord.getNotes()[2].getName(), 'G3');
});
QUnit.test('note.getMidiNumber', function(assert) {
  for (let i=20; i<128; i++) {
    assert.equal(pianissimo.note(i).getMidiNumber(), i);
  }
});
