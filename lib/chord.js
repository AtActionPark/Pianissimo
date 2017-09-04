'use strict';
var Note = require('./note');
var Interval = require('./interval');
var Helpers = require('./helper');
var Theory = require('./theory');

module.exports = Chord

function Chord(args){
    this.root = args.root;
    this.quality = args.quality;
    this.name = root + quality;
    this.notes = [];
  }


