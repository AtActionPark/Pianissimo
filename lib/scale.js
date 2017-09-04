'use strict';

var Interval = require('./interval');
var Helpers = require('./helper');
var Theory = require('./theory');

exports = module.exports = Scale;

function Scale(_tonic,_type){
    var Note = require('./note');
    //console.log(Interval)
    let tonic = Helpers.isNote(_tonic)? _tonic : new Note(_tonic);
    let type = _type;
    let notes = [tonic];

    this.getNotes = function(){return notes};
    this.getNotesName = function(){return notes.map(n => n.name)};
    this.setNotes = function(newNotes){notes = newNotes};

    this.getType = function(){return type};
    this.setType = function(newType){type = newType};

    this.getTonic = function(){return tonic};

    this.buildChord();
}


Scale.prototype.buildChord = function(){
    let scaleType = Theory.scalesDict[this.getType()];
    let notes = this.getNotes();
    //start at 1 as the tonic is already in the array
    for(let i = 1;i<scaleType.length;i++){
        notes.push(notes[0].plusInterval(scaleType[i]));
    }
    notes.push(notes[0].plusInterval('P8'));
    this.setNotes(notes);
}