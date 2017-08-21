"use strict";

let intervals = [];
intervals.push('P1') 
intervals.push('m2')
intervals.push('M2')
intervals.push('m3')
intervals.push('M3')
intervals.push('P4')
intervals.push('A4')
intervals.push('P5')
intervals.push('m6')
intervals.push('M6')
intervals.push('m7')
intervals.push('M7')
intervals.push('P8')
intervals.push('m9')
intervals.push('M9')
intervals.push('m10')
intervals.push('M10')
intervals.push('P11')
intervals.push('A11')
intervals.push('P12')
intervals.push('m13')
intervals.push('M13')
intervals.push('m14')
intervals.push('M14')
intervals.push('P15')


let s

$(document).ready(function(){ 
  s = new Solfege()
  let note1 = s.getRandomNote(3,4);

  let order = Math.random()<0.5? 'ascending': 'descending'
  let randomInterval = intervals[intervals.length * Math.random() << 0 ]

  let note1PlusInterval = s.getNoteFromInterval(note1, randomInterval, order)
  s.getIntervalFromNotes(note1,note1PlusInterval[1]).display()

  //console.log(s.buildTriad('C3', 'minor'))
});






















