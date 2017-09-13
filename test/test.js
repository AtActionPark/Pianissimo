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

//Interval
QUnit.test( "intervalCreate", function( assert ) {
    let interval;

    interval = solfege.interval('m3','ascending')
    assert.equal( interval.getName() ,'m3');
    assert.equal( interval.getOrder() ,'ascending');
    assert.equal( interval.getNumber() ,'3');
    assert.equal( interval.getQuality() ,'m');
    assert.equal( interval.getSemitones() ,'3');
    assert.equal( interval.getQualityText() ,'minor');
    assert.equal( interval.getNumberText() ,'third');

    interval = solfege.interval('m9','ascending')
    assert.equal( interval.getName() ,'m9');
    assert.equal( interval.getOrder() ,'ascending');
    assert.equal( interval.getNumber() ,'9');
    assert.equal( interval.getQuality() ,'m');
    assert.equal( interval.getSemitones() ,'13');
    assert.equal( interval.getQualityText() ,'minor');
    assert.equal( interval.getNumberText() ,'ninth');

    interval = solfege.interval('M17','ascending')
    assert.equal( interval.getName() ,'M17');
    assert.equal( interval.getOrder() ,'ascending');
    assert.equal( interval.getNumber() ,'17');
    assert.equal( interval.getQuality() ,'M');
    assert.equal( interval.getSemitones() ,'28');
    assert.equal( interval.getQualityText() ,'major');
    assert.equal( interval.getNumberText() ,'17th');

    //short order notation
    interval = solfege.interval('d2','-')
    assert.equal( interval.getName() ,'d2');
    assert.equal( interval.getOrder() ,'-');
    assert.equal( interval.getNumber() ,'2');
    assert.equal( interval.getQuality() ,'d');
    assert.equal( interval.getSemitones() ,'0');
    assert.equal( interval.getQualityText() ,'diminished');
    assert.equal( interval.getNumberText() ,'second');

     //creation with notes
     let note1 = solfege.note('C3')
     let note2 = solfege.note('G3')
     interval = solfege.interval(note1,note2)
     assert.equal( interval.getName() ,'P5');
     assert.equal( interval.getOrder() ,'ascending');
     assert.equal( interval.getNumber() ,'5');
     assert.equal( interval.getQuality() ,'P');
     assert.equal( interval.getSemitones() ,'7');
     assert.equal( interval.getQualityText() ,'perfect');
     assert.equal( interval.getNumberText() ,'fifth');

     //short hand creation with notes
     interval = solfege.interval('C3','G3')
     assert.equal( interval.getName() ,'P5');
     assert.equal( interval.getOrder() ,'ascending');
     assert.equal( interval.getNumber() ,'5');
     assert.equal( interval.getQuality() ,'P');
     assert.equal( interval.getSemitones() ,'7');
     assert.equal( interval.getQualityText() ,'perfect');
     assert.equal( interval.getNumberText() ,'fifth');

    
});
QUnit.test( "intervalComputeFromNotes", function( assert ) {
    let interval;

    let note1,note2
    note1 = solfege.note('C3')
    note2 = solfege.note('E3')
    interval = solfege.interval(note1,note2)
    assert.equal( interval.getName() ,'M3');
    assert.equal( interval.getOrder() ,'ascending');
    assert.equal( interval.getNumber() ,'3');
    assert.equal( interval.getQuality() ,'M');
    assert.equal( interval.getSemitones() ,'4');
    assert.equal( interval.getQualityText() ,'major');
    assert.equal( interval.getNumberText() ,'third');

    note1 = solfege.note('C3')
    note2 = solfege.note('C5')
    interval = solfege.interval(note1,note2)
    assert.equal( interval.getName() ,'P15');
    assert.equal( interval.getOrder() ,'ascending');
    assert.equal( interval.getNumber() ,'15');
    assert.equal( interval.getQuality() ,'P');
    assert.equal( interval.getSemitones() ,'24');
    assert.equal( interval.getQualityText() ,'perfect');
    assert.equal( interval.getNumberText() ,'fifteenth');

    note1 = solfege.note('C3')
    note2 = solfege.note('C6')
    interval = solfege.interval(note1,note2)
    assert.equal( interval.getName() ,'P22');
    assert.equal( interval.getOrder() ,'ascending');
    assert.equal( interval.getNumber() ,'22');
    assert.equal( interval.getQuality() ,'P');
    assert.equal( interval.getSemitones() ,'36');
    assert.equal( interval.getQualityText() ,'perfect');
    assert.equal( interval.getNumberText() ,'22th');
});
QUnit.test( "intervalInvert", function( assert ) {
    let interval;

    let note1,note2
    note1 = solfege.note('C3')
    note2 = solfege.note('G3')
    interval = solfege.interval(note1,note2).invert()
    assert.equal( interval.getName() ,'P4');
    assert.equal( interval.getOrder() ,'ascending');
    assert.equal( interval.getNumber() ,'4');
    assert.equal( interval.getQuality() ,'P');
    assert.equal( interval.getSemitones() ,'5');
    assert.equal( interval.getQualityText() ,'perfect');
    assert.equal( interval.getNumberText() ,'fourth');
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
    assert.equal(scale.getNotes()[4].getName() ,'G3');

    //Short hand creation
    scale = solfege.scale('C3','minor')
    assert.equal(scale.getTonic().getName() ,'C3');
    assert.equal(scale.getType() ,'minor');
    assert.equal(scale.getNotes()[0].getName() ,note.getName());
    assert.equal(scale.getNotes()[4].getName() ,'G3');
});

QUnit.test( "scaleGetChords", function( assert ) {
    let scale,chords;
    scale = solfege.scale('C3','major')
    chords = scale.getChords(4)
    assert.equal(chords.length,7)
    assert.equal(chords[4].name,'C major dominant')
    assert.equal(chords[4].getNotesName()[3],'F4')
});

//Scale
QUnit.test( "chordCreate", function( assert ) {
    let chord,note;
    note = solfege.note('C3')

    //basic creation
    chord = solfege.chord(note,'major')
    for(let i = 0;i<chord.getNotes().length;i++){
        assert.equal(chord.getNotesName()[i],['C3','E3','G3'][i])
    }
    //or with note name only
    chord = solfege.chord('C3','major')
    for(let i = 0;i<chord.getNotes().length;i++){
        assert.equal(chord.getNotesName()[i],['C3','E3','G3'][i])
    }
    // or with notes array
    chord = solfege.chord(['C3','E3','G3'],'major')
    for(let i = 0;i<chord.getNotes().length;i++){
        assert.equal(chord.getNotesName()[i],['C3','E3','G3'][i])
    }

    chord = solfege.chord(note,'min')
    for(let i = 0;i<chord.getNotes().length;i++){
        assert.equal(chord.getNotesName()[i],['C3','Eb3','G3'][i])
    }

    chord = solfege.chord(note,'7b5')
    for(let i = 0;i<chord.getNotes().length;i++){
        assert.equal(chord.getNotesName()[i],['C3','E3','Gb3','Bb3'][i])
    }

    chord = solfege.chord(note,'#9')
    for(let i = 0;i<chord.getNotes().length;i++){
        assert.equal(chord.getNotesName()[i],['C3','E3','G3','Bb3','D#4'][i])
    }

    chord = solfege.chord(note,'13#9b5')
    for(let i = 0;i<chord.getNotes().length;i++){
        assert.equal(chord.getNotesName()[i],['C3', 'E3', 'Gb3', 'Bb3', 'D#4', 'F4', 'A4'][i])
    }

    chord = solfege.chord(note,'7sus4')
    for(let i = 0;i<chord.getNotes().length;i++){
        assert.equal(chord.getNotesName()[i],['C3', 'F3', 'G3', 'Bb3'][i])
    }

    chord = solfege.chord(note,'m(b9b5b7b11)')
    for(let i = 0;i<chord.getNotes().length;i++){
        assert.equal(chord.getNotesName()[i],['C3', 'Eb3', 'Gb3', 'Bb3', 'Db4', 'Fb4'][i])
    }

    chord = solfege.chord(note,'ø')
    for(let i = 0;i<chord.getNotes().length;i++){
        assert.equal(chord.getNotesName()[i],['C3', 'Eb3', 'Gb3', 'Bb3'][i])
    }
    chord = solfege.chord(note,'mM7')
    for(let i = 0;i<chord.getNotes().length;i++){
        assert.equal(chord.getNotesName()[i],['C3', 'Eb3', 'G3', 'B3'][i])
    }
    chord = solfege.chord(note,'add9')
    for(let i = 0;i<chord.getNotes().length;i++){
        assert.equal(chord.getNotesName()[i],['C3', 'E3', 'G3', 'D4'][i])
    }
    chord = solfege.chord(note,'o7')
    for(let i = 0;i<chord.getNotes().length;i++){
        assert.equal(chord.getNotesName()[i],['C3', 'Eb3', 'Gb3', 'Bb3'][i])
    }
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
        if(computedInterval.getQuality() == '$')
            continue
        
        
        assert.equal( interval.getSemitones() ,computedInterval.getSemitones(), "rootNote: " + note.getName() + '-' + targetNote.getName() + ' -  intervalNameBasic: '+ interval.getName() + ' -  intervalNameComputed: '+ computedInterval.getName());
    } 
});
QUnit.test( "Notes to Interval", function( assert ) {
    for(let i = 0;i<100;i++){
        let note1 = solfege.randomNote(3,4)
        let note2 = solfege.randomNote(3,4)

        let interval = solfege.interval(note1,note2)

        let note = note1.plusInterval(interval)
        if(note == 'impossible to compute' ) continue

        assert.equal(note.getName(), note2.getName(),'Notes: '+note1.getName()+'-'+note2.getName()+' - Interval: ' + interval.name )
    } 
});  









