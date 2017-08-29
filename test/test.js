'use strict';

var solfege = require('../index');
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

QUnit.test( "getFrequency", function( assert ) {
    let noteFreq, note2Freq;

    noteFreq = solfege.note("A3").getFrequency()
    assert.equal( noteFreq ,440,"A3 - 440hz");

    noteFreq = solfege.note("A4").getFrequency()
    assert.equal( noteFreq ,880,"A4 - 880hz");

    noteFreq = solfege.note("C#3").getFrequency()
    note2Freq = solfege.note("Db3").getFrequency()
    assert.equal( noteFreq ,note2Freq,"C#3 = Bb3");
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









