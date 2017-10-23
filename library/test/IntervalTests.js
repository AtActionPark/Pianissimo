'use strict';

var solfege = require('../solfege');
var Helpers = require('../lib/helper');

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











