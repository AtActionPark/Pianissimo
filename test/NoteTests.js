'use strict';

var pianissimo = require('../pianissimo');
var Helpers = require('../lib/helper');

//Note
QUnit.test("noteCreate", function (assert) {
    let note;

    note = pianissimo.note('C3')
    assert.equal(note.getName(), 'C3');
    assert.equal(note.getRoot(), 'C');
    assert.equal(note.getOctave(), '3');
    assert.equal(note.getAlteration(), '');

    note = pianissimo.note('Bb6')
    assert.equal(note.getName(), 'Bb6');
    assert.equal(note.getRoot(), 'Bb');
    assert.equal(note.getOctave(), '6');
    assert.equal(note.getAlteration(), 'b');

    note = pianissimo.note('B##6')
    assert.equal(note.getName(), 'B##6');
    assert.equal(note.getRoot(), 'B##');
    assert.equal(note.getOctave(), '6');
    assert.equal(note.getAlteration(), '##');

    note = pianissimo.note('Solbb6')
    assert.equal(note.getName(), 'Solbb6');
    assert.equal(note.getRoot(), 'Solbb');
    assert.equal(note.getOctave(), '6');
    assert.equal(note.getAlteration(), 'bb');

    note = pianissimo.note('Do')
    assert.equal(note.getName(), 'Do3');
    assert.equal(note.getRoot(), 'Do');
    assert.equal(note.getOctave(), '3');
    assert.equal(note.getAlteration(), '');

    note = pianissimo.note('Fab1')
    assert.equal(note.getName(), 'Fab1');
    assert.equal(note.getRoot(), 'Fab');
    assert.equal(note.getOctave(), '1');
    assert.equal(note.getAlteration(), 'b');

    note = pianissimo.note('fab1')
    assert.equal(note.getName(), 'fab1');
    assert.equal(note.getRoot(), 'fab');
    assert.equal(note.getOctave(), '1');
    assert.equal(note.getAlteration(), 'b');

    note = pianissimo.note('Fab12')
    assert.equal(note.getName(), 'Fab12');
    assert.equal(note.getRoot(), 'Fab');
    assert.equal(note.getOctave(), '12');
    assert.equal(note.getAlteration(), 'b');

    note = pianissimo.note('5Cx')
    assert.equal(note.getName(), '5Cx');
    assert.equal(note.getRoot(), 'Cx');
    assert.equal(note.getOctave(), '5');
    assert.equal(note.getAlteration(), 'x');

    //with midi number
    note = pianissimo.note(0)
    assert.equal(note.getName(), 'C0');
    assert.equal(note.getRoot(), 'C');
    assert.equal(note.getOctave(), '0');
    assert.equal(note.getAlteration(), '');

    note = pianissimo.note(127)
    assert.equal(note.getName(), 'G10');
    assert.equal(note.getRoot(), 'G');
    assert.equal(note.getOctave(), '10');
    assert.equal(note.getAlteration(), '');

    note = pianissimo.note(66)
    assert.equal(note.getName(), 'F#5');
    assert.equal(note.getRoot(), 'F#');
    assert.equal(note.getOctave(), '5');
    assert.equal(note.getAlteration(), '#');

    //no octave provided, should default to 3
    note = pianissimo.note('B')
    assert.equal(note.getName(), 'B3');
    assert.equal(note.getRoot(), 'B');
    assert.equal(note.getOctave(), '3');
    assert.equal(note.getAlteration(), '');

    //bad alteration, should throw error
    assert.throws(function () {
        pianissimo.note('B#b2')
    },
        "#b is not a valid alteration"
    );
    assert.throws(function () {
        pianissimo.note('B###b2')
    },
        "### is not a valid alteration"
    );
    assert.throws(function () {
        pianissimo.note('Solb#bb2')
    },
        "b#bb is not a valid alteration"
    );

    //bad name, should throw error
    assert.throws(function () {
        pianissimo.note('H2')
    },
        "H is not a note"
    );
    assert.throws(function () {
        pianissimo.note('Sil2')
    },
        "Sil is not a note"
    );
});
QUnit.test("note.getFrequency", function (assert) {
    let noteFreq, note2Freq;
    pianissimo.setA4(440)
    noteFreq = pianissimo.note("A4").getFrequency()
    assert.equal(noteFreq, 440, "A4 - 440hz");

    noteFreq = pianissimo.note("La5").getFrequency()
    assert.equal(noteFreq, 880, "La5 - 880hz");

    noteFreq = pianissimo.note("C#3").getFrequency()
    note2Freq = pianissimo.note("Reb3").getFrequency()
    assert.equal(noteFreq, note2Freq, "C#3 = Bb3");

    pianissimo.setA4(442)
    noteFreq = pianissimo.note("La5").getFrequency()
    assert.equal(noteFreq, 884, "A4 - 884hz");
});
QUnit.test("note.plusInterval", function (assert) {
    let note, interval, result

    note = pianissimo.note('C3')
    interval = pianissimo.interval('m3', 'ascending')
    assert.equal(note.plusInterval(interval).getName(), 'Eb3')

    note = pianissimo.note('C3')
    interval = pianissimo.interval('P5', -1)
    assert.equal(note.plusInterval(interval).getName(), 'F2')

    note = pianissimo.note('Db3')
    interval = pianissimo.interval('m2', 'ascending')
    assert.equal(note.plusInterval(interval).getName(), 'Ebb3')

    note = pianissimo.note('F#5')
    interval = pianissimo.interval('P15', '-')
    assert.equal(note.plusInterval(interval).getName(), 'F#3')

    note = pianissimo.note('Solb2')
    interval = pianissimo.interval('P8', 1)
    assert.equal(note.plusInterval(interval).getName(), 'Solb3')

});
QUnit.test("note.toScale", function (assert) {
    let note, scale

    note = pianissimo.note('C3')
    scale = note.toScale('major')
    assert.equal(scale.getNotes().length, 7)
    assert.equal(Helpers.isNote(scale.getNotes()[5]), true)
    assert.equal(scale.getNotes()[5].getName(), 'A3')

    note = pianissimo.note('Sol3')
    scale = note.toScale('minor')
    assert.equal(scale.getNotes().length, 7)
    assert.equal(Helpers.isNote(scale.getNotes()[5]), true)
    assert.equal(scale.getNotes()[5].getName(), 'Mib4')
});
QUnit.test("note.toChord", function (assert) {
    let note, chord

    note = pianissimo.note('C3')
    chord = note.toChord('major')
    assert.equal(Helpers.isNote(chord.getNotes()[2]), true)
    assert.equal(chord.getNotes()[2].getName(), 'G3')


});

