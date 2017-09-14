'use strict';

var solfege = require('../solfege');
var Helpers = require('../lib/helper');

//Chord
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

    chord = solfege.chord(note,'addb9')
    for(let i = 0;i<chord.getNotes().length;i++){
        assert.equal(chord.getNotesName()[i],['C3', 'E3', 'G3', 'Db4' ][i])
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









