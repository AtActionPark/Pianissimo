'use strict';

var Note = require('./lib/note');
var Interval = require('./lib/interval');
var Chord = require('./lib/chord');
var Helpers = require('./lib/helper');
var Theory = require('./lib/theory');

function noteConstructor(name){
    return new Note(name)
}
function intervalConstructor(arg1,arg2){
    return new Interval(arg1,arg2)
}
function getRandomNote(octave1,octave2){
    let note =  Helpers.pickRandomArray(Theory.fullNotesList)
    let octave = Helpers.getRandomInt(octave1,octave2)
  
    return new Note(note+octave)
}
function getRandomInterval(){
    let intervalName =  Helpers.pickRandomProperty(Theory.intervalsDict)
    let intervalOrder = Math.random()<0.5? 'ascending' : 'descending'
  
    return new Interval(intervalName, intervalOrder)
}
function setA4(frequency){
    Theory.A4Freq = frequency
}

let solfege = {
    note:noteConstructor,
    interval:intervalConstructor,
    randomNote:getRandomNote,
    randomInterval:getRandomInterval,
    setA4:setA4,
    Note:Note,
    Interval:Interval,
    Chord:Chord,
}
exports = module.exports = solfege

/* let note = solfege.randomNote(3,4)
let interval = solfege.randomInterval() */

/* let note = solfege.note('C4')
let interval = solfege.interval('A14', 'ascending')

let result = note.plusInterval(interval)
let computedInterval = solfege.interval(note,result)

console.log('Root note: ' + note.name)
console.log('Interval :' + interval.order + ' ' + interval.name)
console.log('Computed Interval :' + computedInterval.order + ' ' + computedInterval.name)
console.log('Result note: ' + result.name)


console.log(note.getFrequency()) */



let note1 = solfege.note('C4')
let note2 = solfege.note('G4')
let interval2 = solfege.interval(note1, note2)
interval2.invert()
console.log(interval2)

