'use strict';

var Note = require('./lib/note');
var Interval = require('./lib/interval');
var Chord = require('./lib/chord');
var Scale = require('./lib/scale');
var Helpers = require('./lib/helper');
var Theory = require('./lib/theory');

function noteConstructor(name){
    return new Note(name)
}
function intervalConstructor(arg1,arg2){
    return new Interval(arg1,arg2)
}
function scaleConstructor(tonic,type){
    return new Scale(tonic,type)
}
function chordConstructor(arg1,arg2){
    return new Chord(arg1,arg2)
}
function getRandomNote(octave1,octave2){
    octave1 = octave1||3
    octave2 = octave2||3
    let note =  Helpers.pickRandomArray(Theory.fullNotesList)
    let octave = Helpers.getRandomInt(octave1,octave2)
  
    return new Note(note+octave)
}
function getRandomInterval(){
    let intervalName =  Helpers.pickRandomProperty(Theory.intervalsDict)
    let intervalOrder = Math.random()<0.5? 'ascending' : 'descending'
  
    return new Interval(intervalName, intervalOrder)
}
function getRandomScale(note){
    note = note || getRandomNote();
    let scaleType = Helpers.pickRandomProperty(Theory.scalesDict)

    return new Scale(note,scaleType)
}   

function setA4(frequency){
    Theory.A4Freq = frequency
}

let solfege = {
    note:noteConstructor,
    interval:intervalConstructor,
    scale:scaleConstructor,
    chord:chordConstructor,
    randomNote:getRandomNote,
    randomInterval:getRandomInterval,
    randomScale:getRandomScale,
    setA4:setA4,
    Note:Note,
    Interval:Interval,
    Chord:Chord,
    Scale:Scale,
}
exports = module.exports = solfege











 





