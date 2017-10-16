'use strict';

var solfege = require('../solfege');
var Helpers = require('../lib/helper');

//Scale
QUnit.test( "scaleCreate", function( assert ) {
    let scale,note;
    note = solfege.note('C3')

    //Basic creation
    scale = solfege.scale(note,'major')
    assert.equal(scale.getTonic() ,note);
    assert.equal(scale.getType() ,'major');
    assert.equal(scale.getNotes()[0].getName() ,'C3');
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
    assert.equal(chords[4].getName(),'C major dominant')
    assert.equal(chords[4].getNotesName()[3],'F4')
});










