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
    scale:scaleConstructor,
    randomNote:getRandomNote,
    randomInterval:getRandomInterval,
    setA4:setA4,
    Note:Note,
    Interval:Interval,
    Chord:Chord,
    Scale:Scale,
}
exports = module.exports = solfege

let n1 = solfege.note('Bb3')
let i = solfege.interval('d8','descending')
let n2 = n1.plusInterval(i)
console.log(n2.name())

console.log(i) 
let computedI = solfege.interval(n1,n2)
console.log(computedI)









