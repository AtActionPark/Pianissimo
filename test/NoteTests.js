'use strict';

var solfege = require('../solfege');
var Helpers = require('../lib/helper');

//Note
QUnit.test( "noteCreate", function( assert ) {
    let note;

    note = solfege.note('C3')
    assert.equal( note.getName() ,'C3');
    assert.equal( note.getRoot() ,'C');
    assert.equal( note.getOctave() ,'3');
    assert.equal( note.getAlteration() ,'');

    note = solfege.note('Bb6')
    assert.equal( note.getName() ,'Bb6');
    assert.equal( note.getRoot() ,'Bb');
    assert.equal( note.getOctave() ,'6');
    assert.equal( note.getAlteration() ,'b');

    note = solfege.note('B##6')
    assert.equal( note.getName() ,'B##6');
    assert.equal( note.getRoot() ,'B##');
    assert.equal( note.getOctave() ,'6');
    assert.equal( note.getAlteration() ,'##');

    note = solfege.note('Solbb6')
    assert.equal( note.getName() ,'Solbb6');
    assert.equal( note.getRoot() ,'Solbb');
    assert.equal( note.getOctave() ,'6');
    assert.equal( note.getAlteration() ,'bb');

    note = solfege.note('Do')
    assert.equal( note.getName() ,'Do3');
    assert.equal( note.getRoot() ,'Do');
    assert.equal( note.getOctave() ,'3');
    assert.equal( note.getAlteration() ,'');

    note = solfege.note('Fab1')
    assert.equal( note.getName() ,'Fab1');
    assert.equal( note.getRoot() ,'Fab');
    assert.equal( note.getOctave() ,'1');
    assert.equal( note.getAlteration() ,'b');

    note = solfege.note('fab1')
    assert.equal( note.getName() ,'fab1');
    assert.equal( note.getRoot() ,'fab');
    assert.equal( note.getOctave() ,'1');
    assert.equal( note.getAlteration() ,'b');

    note = solfege.note('Fab12')
    assert.equal( note.getName() ,'Fab12');
    assert.equal( note.getRoot() ,'Fab');
    assert.equal( note.getOctave() ,'12');
    assert.equal( note.getAlteration() ,'b');

    note = solfege.note('5Cx')
    assert.equal( note.getName() ,'5Cx');
    assert.equal( note.getRoot() ,'Cx');
    assert.equal( note.getOctave() ,'5');
    assert.equal( note.getAlteration() ,'x');

    //no octave provided, should default to 3
    note = solfege.note('B')
    assert.equal( note.getName() ,'B3');
    assert.equal( note.getRoot() ,'B');
    assert.equal( note.getOctave() ,'3');
    assert.equal( note.getAlteration() ,'');

    //bad alteration, should throw error
    assert.throws(function(){
        solfege.note('B#b2')},
        "#b is not a valid alteration"
    );
    assert.throws(function(){
        solfege.note('B###b2')},
        "### is not a valid alteration"
    );
    assert.throws(function(){
        solfege.note('Solb#bb2')},
        "b#bb is not a valid alteration"
    );

    //bad name, should throw error
    assert.throws(function(){
        solfege.note('H2')},
        "H is not a valid alteration"
    );
    assert.throws(function(){
        solfege.note('Sil2')},
        "Sil is not a valid alteration"
    );
});
QUnit.test( "note.getFrequency", function( assert ) {
    let noteFreq, note2Freq;
    solfege.setA4(440)
    noteFreq = solfege.note("A4").getFrequency()
    assert.equal( noteFreq ,440,"A4 - 440hz");

    noteFreq = solfege.note("La5").getFrequency()
    assert.equal( noteFreq ,880,"La5 - 880hz");

    noteFreq = solfege.note("C#3").getFrequency()
    note2Freq = solfege.note("Reb3").getFrequency()
    assert.equal( noteFreq ,note2Freq,"C#3 = Bb3");

    solfege.setA4(442)
    noteFreq = solfege.note("La5").getFrequency()
    assert.equal( noteFreq ,884,"A4 - 884hz");
});
QUnit.test( "note.plusInterval", function( assert ) {
    let note, interval,result
    
    note = solfege.note('C3')
    interval = solfege.interval('m3', 'ascending')
    assert.equal(note.plusInterval(interval).getName(), 'Eb3')

    note = solfege.note('C3')
    interval = solfege.interval('P5', -1)
    assert.equal(note.plusInterval(interval).getName(), 'F2')

    note = solfege.note('Db3')
    interval = solfege.interval('m2', 'ascending')
    assert.equal(note.plusInterval(interval).getName(), 'Ebb3')

    note = solfege.note('F#5')
    interval = solfege.interval('P15', '-')
    assert.equal(note.plusInterval(interval).getName(), 'F#3')

    note = solfege.note('Solb2')
    interval = solfege.interval('P8', 1)
    assert.equal(note.plusInterval(interval).getName(), 'Solb3')

});
QUnit.test( "note.toScale", function( assert ) {
    let note, scale
    
    note = solfege.note('C3')
    scale = note.toScale('major')
    assert.equal(scale.getNotes().length, 7)
    assert.equal(Helpers.isNote(scale.getNotes()[5]), true)
    assert.equal(scale.getNotes()[5].getName(), 'A3')

    note = solfege.note('Sol3')
    scale = note.toScale('minor')
    assert.equal(scale.getNotes().length, 7)
    assert.equal(Helpers.isNote(scale.getNotes()[5]), true)
    assert.equal(scale.getNotes()[5].getName(), 'Mib4')
});
QUnit.test( "note.toChord", function( assert ) {
    let note, chord
    
    note = solfege.note('C3')
    chord = note.toChord('major')
    assert.equal(Helpers.isNote(chord.getNotes()[2]), true)
    assert.equal(chord.getNotes()[2].getName(), 'G3')


});

