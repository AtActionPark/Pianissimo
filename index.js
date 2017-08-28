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

let solfege = {
    note:noteConstructor,
    interval:intervalConstructor,
    Note:Note,
    Interval:Interval,
    Chord:Chord,
}
exports = module.exports = solfege

let note = solfege.note('C4')
let interval = solfege.interval('m3')

let result = note.plusInterval(interval)

console.log(note.name)
console.log(interval.name)
console.log(result.name)



