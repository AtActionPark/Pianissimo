"use strict";

let context = new AudioContext;
let mixNode;
let compressor;
let compressorThreshold = -24;
let compressorRatio = 1;
let seed = Math.random(100)
let baseDetune = 1;

let baseOscNumber = 10;
let chaos = 0.5;
let sqrChaos = chaos*chaos;
let now

//oscilloscope
var oscWidth = 1000;
var oscHeight = 300;
var oscFFTSize = 2048;
var oscBaseSensitivity = 42;
var scope;
var canvas;

let instr;

let keysDown = {};
let keyPressed;

let debug = true;
let displayOsc = true;

let intervals = [];

let intervalParams = {
		'nbOfTimePlayed':3,
		'timeBetweenRepetitions':3,
		'timeBetweenNotes':0.9,
		'noteDuration':1.5,
		'talk':true,
		'order':'both'
	}

let pause = true;
let aug4ToTritone = true;
let changedPreset = false;
let locked = true;

function iosHandler(e){
  if (locked){
    alert("unlocked");
    locked = false;
    // create empty buffer
    let buffer = context.createBuffer(1, 1, 22050);
    let source = context.createBufferSource();
    source.buffer = buffer;
    source.connect(context.destination);
    source.noteOn(0);
  }
}


$(document).ready(function(){ 
	const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  	window.AudioContext = window.AudioContext || window.webkitAudioContext;

  	if(iOS){
	    window.addEventListener("touchend",iosHandler , false);
	    alert(' IOS')
	  }
	resetContext();
	instr = new Instrument();
	
	if(displayOsc){
		initCanvas();
		scope = new Oscilloscope(context, canvas[0]);
		scope.start();
		initOsc();
	}	

  //bootstrap toggles closes automatically on click - recreate the open/close behaviour manually
	$('.dropdown-toggle').on('click', function (event) {
		$(this).parent().toggleClass('open');
	});

	$('body').on('click', function (e) {
		if (!$('.dropdown-toggle').is(e.target) 
		    && $('.dropdown-toggle').has(e.target).length === 0 
		    && $('.open').has(e.target).length === 0){
		  $('.dropdown-toggle').removeClass('open');
		}
	});
	if(iOS)
		return;
	document.onkeydown = function(evt) {
	    keyPressed = evt.keyCode || window.event;
	    if(keyPressed in keysDown)
	    	return;

	    keysDown[keyPressed] = true


	    let pressed = String.fromCharCode(keyPressed)

	    if (!(pressed in keysMap))
	    	return;

	    let freq = getFrequency(keysMap[pressed])

	    now = context.currentTime

    	//find free voice if possible
	    for(let i = 0;i<instr.voices.length;i++){
	    	if(instr.voices[i].status == "notPlaying"){
	    		instr.voices[i].start(freq,now);
	    		instr.voices[i].status = "playing";
	    		instr.voices[i].name = freq;
	    		break;
	    	}
	    }
	};
	document.onkeyup = function(evt) {
		keyPressed = evt.keyCode || window.event;

	    delete keysDown[keyPressed];

	    let pressed = String.fromCharCode(keyPressed)
	    if (!(pressed in keysMap))
	    	return;
	    let freq = getFrequency(keysMap[pressed])
	    now = context.currentTime

	    //find voice playing the released note
	    for(let i = 0;i<instr.voices.length;i++){
	    	if(instr.voices[i].status == "playing" && instr.voices[i].name == freq){
	    		instr.voices[i].stop(now);
	    		instr.voices[i].status = "notPlaying";
	    		instr.voices[i].name = "empty";
	    		break;
	    	}
	    }
	};

});

let start = function(){
	if(pause){
		context.resume();
		getUserParams();
		if(changedPreset){
		changePreset();
		changedPreset = false
		}
		pause = false;
		$('.start').text('Pause')

		playRandomInterval(intervalParams);
	}
	else{
		pause = true;
		context.suspend();
		$('.start').text('Start')
	}
}

function allNone(){
	let checked = $("#allNone").is(":checked")

	$('#unison').prop('checked', checked);
	$('#minorSecond').prop('checked', checked);
	$('#majorSecond').prop('checked', checked);
	$('#minorThird').prop('checked', checked);
	$('#majorThird').prop('checked', checked);
	$('#perfectFourth').prop('checked', checked);
	$('#tritone').prop('checked', checked);
	$('#perfectFifth').prop('checked', checked);
	$('#minorSixth').prop('checked', checked);
	$('#majorSixth').prop('checked', checked);
	$('#minorSeventh').prop('checked', checked);
	$('#majorSeventh').prop('checked', checked);
	$('#octave').prop('checked', checked);
	$('#minorNinth').prop('checked', checked);
	$('#majorNinth').prop('checked', checked);
	$('#minorTenth').prop('checked', checked);
	$('#majorTenth').prop('checked', checked);
	$('#perfectEleventh').prop('checked', checked);
	$('#octaveTritone').prop('checked', checked);
	$('#perfectTwelfth').prop('checked', checked);
	$('#minorThirteenth').prop('checked', checked);
	$('#majorThirteenth').prop('checked', checked);
	$('#minorFourteenth').prop('checked', checked);
	$('#majorFourteenth').prop('checked', checked);
	$('#doubleOctave').prop('checked', checked);

	getUserParams()
}
function getUserParams(){
  intervalParams['nbOfTimePlayed'] = parseFloat($("#nbOfTimePlayed").val());
  intervalParams['timeBetweenRepetitions'] = parseFloat($("#timeBetweenRepetitions").val());
  intervalParams['timeBetweenNotes'] = parseFloat($("#timeBetweenNotes").val());
  intervalParams['noteDuration'] = parseFloat($("#noteDuration").val());
  intervalParams['order'] = $("#order").val();

  intervalParams['talk'] = $("#talk").is(":checked");
  intervals = []

  if($("#unison").is(":checked")) intervals.push('P1') 
  if($("#minorSecond").is(":checked")) intervals.push('m2')
  if($("#majorSecond").is(":checked")) intervals.push('M2')
  if($("#minorThird").is(":checked")) intervals.push('m3')
  if($("#majorThird").is(":checked")) intervals.push('M3')
  if($("#perfectFourth").is(":checked")) intervals.push('P4')
  if($("#tritone").is(":checked")) intervals.push('A4')
  if($("#perfectFifth").is(":checked")) intervals.push('P5')
  if($("#minorSixth").is(":checked")) intervals.push('m6')
  if($("#majorSixth").is(":checked")) intervals.push('M6')
  if($("#minorSeventh").is(":checked")) intervals.push('m7')
  if($("#majorSeventh").is(":checked")) intervals.push('M7')
  if($("#octave").is(":checked")) intervals.push('P8')
  if($("#minorNinth").is(":checked")) intervals.push('m9')
  if($("#majorNinth").is(":checked")) intervals.push('M9')
  if($("#minorTenth").is(":checked")) intervals.push('m10')
  if($("#majorTenth").is(":checked")) intervals.push('M10')
  if($("#perfectEleventh").is(":checked")) intervals.push('P11')
  if($("#octaveTritone").is(":checked")) intervals.push('A11')
  if($("#perfectTwelfth").is(":checked")) intervals.push('P12')
  if($("#minorThirteenth").is(":checked")) intervals.push('m13')
  if($("#majorThirteenth").is(":checked")) intervals.push('M13')
  if($("#minorFourteenth").is(":checked")) intervals.push('m14')
  if($("#majorFourteenth").is(":checked")) intervals.push('M14')
  if($("#doubleOctave").is(":checked")) intervals.push('P15')
}
function speak(message,time){
	if(aug4ToTritone && message == 'augmented fourth')
		message = 'tritone'
	if(aug4ToTritone && message == 'augmented eleventh')
		message = 'octave tritone'

	var msg = new SpeechSynthesisUtterance(message);
	//msg.lang = 'en-US';
	setTimeout(function () { window.speechSynthesis.speak(msg)}, time);
}
function playRandomInterval(){
	if(pause)return
	if (intervals.length == 0) return
	let args = Array.prototype.slice.call(arguments)[0];

	let nbOfTimePlayed = 3
	if(args['nbOfTimePlayed']!= undefined) nbOfTimePlayed = args['nbOfTimePlayed']
	let timeBetweenNotes = 0.9
	if(args['timeBetweenNotes'] != undefined) timeBetweenNotes = args['timeBetweenNotes']
	let timeBetweenRepetitions = 3
	if(args['timeBetweenRepetitions'] != undefined) timeBetweenRepetitions = args['timeBetweenRepetitions']
	let noteDuration = 1.5
	if(args['noteDuration'] != undefined) noteDuration = args['noteDuration']
	let talk = true
	if(args['talk'] != undefined) talk = args['talk']

	let note1 = getRandomNoteFull();
	let order = intervalParams['order'] 
	if(intervalParams['order'] == 'both')
		order = Math.random()<0.5? 'ascending': 'descending'

	//returns [note1, note2, intervalText]
	let note1PlusInterval = getNoteFromInterval(note1, pickRandomArray(intervals), order)

	instr.playNotesWithRepeat(note1PlusInterval.slice(0,2),context.currentTime,noteDuration,timeBetweenNotes,nbOfTimePlayed,timeBetweenRepetitions);
	let t = (nbOfTimePlayed)*(timeBetweenNotes+timeBetweenRepetitions)*1000

	if(talk){
		speak(note1PlusInterval[2],t)
	}

	setTimeout(function(){playRandomInterval(intervalParams)}, t + 3000);
	
}
function resetContext(){
	context.close()
	context = new AudioContext

	mixNode = context.createGain();
	mixNode.gain.value = 1;

	compressor = context.createDynamicsCompressor()
	compressor.threshold.value = compressorThreshold;
	compressor.attack.value = 0;

	mixNode.connect(compressor);
	compressor.connect(context.destination); 
}
function randomize(){
	resetContext();
	instr = new Instrument()
	instr.randomize();
	if(displayOsc)
		initOsc()
}

function changePreset(){
	let preset = parseInt($("#synthPreset").val());
	instr.changePreset(preset)
	changedPreset = true;
}

function initCanvas(){
	canvas = $('<canvas width="' + oscWidth + '" height="' + oscHeight + '"></canvas>');
    $('#osc').append(canvas);
    if (typeof G_vmlCanvasManager !== 'undefined')
       G_vmlCanvasManager.initElement(canvas[0]);
}
function initOsc(){
  if(!scope){
    initCanvas()

    scope = new Oscilloscope(context, canvas[0]);
    var slider = document.querySelector('#min');
    var label = document.querySelector('#label');

    slider.value = scope.sensitivity;
    label.textContent = ~~scope.sensitivity;
    slider.addEventListener('input', function() {
      scope.sensitivity = slider.value;
      label.textContent = slider.value;
    }, false );
  }
  else(
    scope.reset(context)
  )
  mixNode.connect(scope.input);
  scope.start();
}



