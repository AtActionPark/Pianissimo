'use strict';

var solfege = require('../index');
var Helpers = require('../lib/helper');

//Note
QUnit.test( "noteCreate", function( assert ) {
    let note;

    note = solfege.note('C3')
    assert.equal( note.name ,'C3');
    assert.equal( note.root ,'C');
    assert.equal( note.octave ,'3');
    assert.equal( note.alteration ,'');

    note = solfege.note('Bb6')
    assert.equal( note.name ,'Bb6');
    assert.equal( note.root ,'Bb');
    assert.equal( note.octave ,'6');
    assert.equal( note.alteration ,'b');

    note = solfege.note('B##6')
    assert.equal( note.name ,'B##6');
    assert.equal( note.root ,'B##');
    assert.equal( note.octave ,'6');
    assert.equal( note.alteration ,'##');

    note = solfege.note('Solbb6')
    assert.equal( note.name ,'Solbb6');
    assert.equal( note.root ,'Solbb');
    assert.equal( note.octave ,'6');
    assert.equal( note.alteration ,'bb');

    note = solfege.note('Do')
    assert.equal( note.name ,'Do3');
    assert.equal( note.root ,'Do');
    assert.equal( note.octave ,'3');
    assert.equal( note.alteration ,'');

    note = solfege.note('Fab1')
    assert.equal( note.name ,'Fab1');
    assert.equal( note.root ,'Fab');
    assert.equal( note.octave ,'1');
    assert.equal( note.alteration ,'b');

    //no octave provided, should default to 3
    note = solfege.note('B')
    assert.equal( note.name ,'B3');
    assert.equal( note.root ,'B');
    assert.equal( note.octave ,'3');
    assert.equal( note.alteration ,'');

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
    assert.equal(note.plusInterval(interval).name, 'Eb3')

    note = solfege.note('C3')
    interval = solfege.interval('P5', -1)
    assert.equal(note.plusInterval(interval).name, 'F2')

    note = solfege.note('Db3')
    interval = solfege.interval('m2', 'ascending')
    assert.equal(note.plusInterval(interval).name, 'Ebb3')

    note = solfege.note('F#5')
    interval = solfege.interval('P15', '-')
    assert.equal(note.plusInterval(interval).name, 'F#3')

    note = solfege.note('Solb2')
    interval = solfege.interval('P8', 1)
    assert.equal(note.plusInterval(interval).name, 'Solb3')

});
QUnit.test( "note.toScale", function( assert ) {
    let note, scale,result
    
    note = solfege.note('C3')
    scale = note.toScale('major')
    assert.equal(scale.getNotes().length, 8)
    assert.equal(scale.getNotes().length, 8)
    assert.equal(Helpers.isNote(scale.getNotes()[5]), true)
    assert.equal(scale.getNotes()[5].name, 'A3')

    note = solfege.note('Sol3')
    scale = note.toScale('minor')
    assert.equal(scale.getNotes().length, 8)
    assert.equal(scale.getNotes().length, 8)
    assert.equal(Helpers.isNote(scale.getNotes()[5]), true)
    assert.equal(scale.getNotes()[5].name, 'Mib4')
});

//Interval
QUnit.test( "intervalCreate", function( assert ) {
    let interval;

    interval = solfege.interval('m3','ascending')
    assert.equal( interval.name ,'m3');
    assert.equal( interval.order ,'ascending');
    assert.equal( interval.number ,'3');
    assert.equal( interval.quality ,'m');
    assert.equal( interval.semitones ,'3');
    assert.equal( interval.qualityText ,'minor');
    assert.equal( interval.numberText ,'third');

    //compound interval
    interval = solfege.interval('A14','descending')
    assert.equal( interval.name ,'A14');
    assert.equal( interval.order ,'descending');
    assert.equal( interval.number ,'14');
    assert.equal( interval.quality ,'A');
    assert.equal( interval.semitones ,'-24');
    assert.equal( interval.qualityText ,'augmented');
    assert.equal( interval.numberText ,'fourteenth');

    interval = solfege.interval('m9','ascending')
    assert.equal( interval.name ,'m9');
    assert.equal( interval.order ,'ascending');
    assert.equal( interval.number ,'9');
    assert.equal( interval.quality ,'m');
    assert.equal( interval.semitones ,'13');
    assert.equal( interval.qualityText ,'minor');
    assert.equal( interval.numberText ,'ninth');

    interval = solfege.interval('M17','ascending')
    assert.equal( interval.name ,'M17');
    assert.equal( interval.order ,'ascending');
    assert.equal( interval.number ,'17');
    assert.equal( interval.quality ,'M');
    assert.equal( interval.semitones ,'28');
    assert.equal( interval.qualityText ,'major');
    assert.equal( interval.numberText ,'17th');

    //short order notation
    interval = solfege.interval('d2','-')
    assert.equal( interval.name ,'d2');
    assert.equal( interval.order ,'-');
    assert.equal( interval.number ,'2');
    assert.equal( interval.quality ,'d');
    assert.equal( interval.semitones ,'0');
    assert.equal( interval.qualityText ,'diminished');
    assert.equal( interval.numberText ,'second');

     //creation with notes
     let note1 = solfege.note('C3')
     let note2 = solfege.note('G3')
     interval = solfege.interval(note1,note2)
     assert.equal( interval.name ,'P5');
     assert.equal( interval.order ,'ascending');
     assert.equal( interval.number ,'5');
     assert.equal( interval.quality ,'P');
     assert.equal( interval.semitones ,'7');
     assert.equal( interval.qualityText ,'perfect');
     assert.equal( interval.numberText ,'fifth');

     //short hand creation with notes
     interval = solfege.interval('C3','G3')
     assert.equal( interval.name ,'P5');
     assert.equal( interval.order ,'ascending');
     assert.equal( interval.number ,'5');
     assert.equal( interval.quality ,'P');
     assert.equal( interval.semitones ,'7');
     assert.equal( interval.qualityText ,'perfect');
     assert.equal( interval.numberText ,'fifth');

    
});
QUnit.test( "intervalComputeFromNotes", function( assert ) {
    let interval;

    let note1,note2
    note1 = solfege.note('C3')
    note2 = solfege.note('E3')
    interval = solfege.interval(note1,note2)
    assert.equal( interval.name ,'M3');
    assert.equal( interval.order ,'ascending');
    assert.equal( interval.number ,'3');
    assert.equal( interval.quality ,'M');
    assert.equal( interval.semitones ,'4');
    assert.equal( interval.qualityText ,'major');
    assert.equal( interval.numberText ,'third');

    note1 = solfege.note('C3')
    note2 = solfege.note('Fa#2')
    interval = solfege.interval(note1,note2)
    assert.equal( interval.name ,'d5');
    assert.equal( interval.order ,'descending');
    assert.equal( interval.number ,'5');
    assert.equal( interval.quality ,'d');
    assert.equal( interval.semitones ,'-6');
    assert.equal( interval.qualityText ,'diminished');
    assert.equal( interval.numberText ,'fifth');

    note1 = solfege.note('C3')
    note2 = solfege.note('C5')
    interval = solfege.interval(note1,note2)
    assert.equal( interval.name ,'P15');
    assert.equal( interval.order ,'ascending');
    assert.equal( interval.number ,'15');
    assert.equal( interval.quality ,'P');
    assert.equal( interval.semitones ,'24');
    assert.equal( interval.qualityText ,'perfect');
    assert.equal( interval.numberText ,'fifteenth');

    note1 = solfege.note('C3')
    note2 = solfege.note('C6')
    interval = solfege.interval(note1,note2)
    assert.equal( interval.name ,'P22');
    assert.equal( interval.order ,'ascending');
    assert.equal( interval.number ,'22');
    assert.equal( interval.quality ,'P');
    assert.equal( interval.semitones ,'36');
    assert.equal( interval.qualityText ,'perfect');
    assert.equal( interval.numberText ,'22th');
});
QUnit.test( "intervalInvert", function( assert ) {
    let interval;

    let note1,note2
    note1 = solfege.note('C3')
    note2 = solfege.note('G3')
    interval = solfege.interval(note1,note2).invert()
    assert.equal( interval.name ,'P4');
    assert.equal( interval.order ,'ascending');
    assert.equal( interval.number ,'4');
    assert.equal( interval.quality ,'P');
    assert.equal( interval.semitones ,'5');
    assert.equal( interval.qualityText ,'perfect');
    assert.equal( interval.numberText ,'fourth');

    note1 = solfege.note('G3')
    note2 = solfege.note('C3')
    interval = solfege.interval(note1,note2).invert()
    assert.equal( interval.name ,'P4');
    assert.equal( interval.order ,'descending');
    assert.equal( interval.number ,'4');
    assert.equal( interval.quality ,'P');
    assert.equal( interval.semitones ,'-5');
    assert.equal( interval.qualityText ,'perfect');
    assert.equal( interval.numberText ,'fourth');
});

//Scale
QUnit.test( "scaleCreate", function( assert ) {
    let scale,note;
    note = solfege.note('C3')

    //Basic creation
    scale = solfege.scale(note,'major')
    assert.equal(scale.getTonic() ,note);
    assert.equal(scale.getType() ,'major');
    assert.equal(scale.getNotes()[0] ,note);
    assert.equal(scale.getNotes()[4].name ,'G3');

    //Short hand creation
    scale = solfege.scale('C3','minor')
    assert.equal(scale.getTonic().name ,'C3');
    assert.equal(scale.getType() ,'minor');
    assert.equal(scale.getNotes()[0].name ,note.name);
    assert.equal(scale.getNotes()[4].name ,'G3');
});


//100 random tests to try to find forgotten edge cases
QUnit.test( "Interval to notes", function( assert ) {
    for(let i = 0;i<100;i++){
        let note = solfege.randomNote(3,4)
        let interval = solfege.randomInterval()
        let targetNote = note.plusInterval(interval)
        
        if(targetNote == 'impossible to compute')
            continue
        let computedInterval = solfege.interval(note,targetNote)
        if(computedInterval.quality == '$')
            continue
        
        
        assert.equal( interval.semitones ,computedInterval.semitones, "rootNote: " + note.name + '-' + targetNote.name + ' -  intervalNameBasic: '+ interval.name + ' -  intervalNameComputed: '+ computedInterval.name);
    } 
});
QUnit.test( "Notes to Interval", function( assert ) {
    for(let i = 0;i<100;i++){
        let note1 = solfege.randomNote(3,4)
        let note2 = solfege.randomNote(3,4)

        let interval = solfege.interval(note1,note2)

        let note = note1.plusInterval(interval)
        if(note == 'impossible to compute' ) continue

        assert.equal(note.name, note2.name,'Notes: '+note1.name+'-'+note2.name+' - Interval: ' + interval.name )
    } 
});  








