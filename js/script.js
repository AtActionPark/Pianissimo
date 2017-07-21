"use strict";

// audio context params
let context;
let mixNode;
let compressor;
let compressorThreshold = -24;
let compressorRatio = 1;
let now;

//synth params
let baseDetune = 1;
let baseOscNumber = 10;
let chaos = 0.5;
let sqrChaos = chaos*chaos;


//oscilloscope params
var oscWidth = 1000;
var oscHeight = 300;
var oscFFTSize = 2048;
var oscBaseSensitivity = 42;
var scope;
var canvas;

let instr;

let keysDown = {};
let keyPressed;

let keyboard = new Keyboard('keyboard',3,800,200);


let intervals = [];

let intervalParams = {
		'nbOfTimePlayed':3,
		'timeBetweenRepetitions':3,
		'timeBetweenNotes':0.9,
		'noteDuration':1.5,
		'talk':true,
		'order':'both'
}

let seed = Math.random(100)
let debug = true;
let displayOsc = false;
let pause = true;
let aug4ToTritone = true;
let changedPreset = false;
let locked = true;
let playing = false;

let noSleep;
let globalMessage;



$(document).ready(function(){ 
	const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  	window.AudioContext = window.AudioContext || window.webkitAudioContext;

  	if(iOS){
	    window.addEventListener("touchend",iosHandler , false);
	}

	noSleep = new NoSleep()
	document.addEventListener('touchstart', enableNoSleep, false);
	keyboard.start()
	
	resetAndConnectContext();
	instr = new Instrument(context);
	
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
});

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
function start(){
	if(pause){
		document.addEventListener('touchstart', enableNoSleep, false);
		pause = false;
		$('.start').text('Stop')
		
		getUserParams();
		if(changedPreset){
			changePreset();
			changedPreset = false
		}
		
		if(!playing){
			playRandomInterval();
			playing = true;
		}
	}
	else{
		pause = true;
		$('.start').text('Start')
		noSleep.disable();
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
	if(pause)return 
	if(aug4ToTritone && message == 'augmented fourth')
		message = 'tritone'
	if(aug4ToTritone && message == 'augmented eleventh')
		message = 'octave tritone'

	
	//msg.lang = 'en-US';
	setTimeout(function () { 
		if(pause)return
		globalMessage = message;

		$('#trigger_me').trigger('click')
		//window.speechSynthesis.speak(msg)}, time);
	},time)
}
function speech_text(){
	var msg = new SpeechSynthesisUtterance(globalMessage);
	window.speechSynthesis.speak(msg)
}

function playRandomInterval(){
	if(pause)return
	if (intervals.length == 0) return

	let nbOfTimePlayed = intervalParams['nbOfTimePlayed']
	let timeBetweenNotes =  intervalParams['timeBetweenNotes']
	let timeBetweenRepetitions = intervalParams['timeBetweenRepetitions']
	
	let noteDuration = intervalParams['noteDuration']
	let talk = intervalParams['talk']

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

	setTimeout(function(){
		playing = false;
		playRandomInterval(intervalParams)}, t + 3000);
}
function resetAndConnectContext(){
	if(context)
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
	resetAndConnectContext();
	instr = new Instrument(context)
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


///INSTRUMENTS///
function Instrument(context){
	this.context = context;
	this.oscillators = [];
	this.noises = [];

	//Default params
	this.oscillatorsParams = [{wave: 'sine', detune: 0}];
	this.noisesParams = [];
	this.envelopeParams = {peakLevel:0.8,
				sustainLevel:0.3,
				attackTime:0.08,
				decayTime:0.05,
				releaseTime:0.1,
				sustainTime:0.05};

	this.instrGainNode = this.context.createGain();
	this.instrGainNode.gain.value = 0.85;

	this.filter = this.context.createBiquadFilter();
	this.filter.type = 'lowpass';
	this.filter.frequency.value = 20000;

 	this.distortion = this.context.createWaveShaper();

	//hard coded pseudo limiter
	this.compressor = this.context.createDynamicsCompressor()
	this.compressor.threshold.value = compressorThreshold;
	//this.compressor.reduction.value = compressorRatio;
	this.compressor.attack.value = 0;

	//optional additional limiter
	this.limiter = this.context.createDynamicsCompressor();

	//routing: osc + noise -> filter -> compressor -> gain -> general mix
	this.filter.connect(this.distortion);
	this.distortion.connect(this.compressor);
	this.compressor.connect(this.instrGainNode);
	this.instrGainNode.connect(mixNode);

	//voices
	this.voices = []
	for (let i =0;i<8;i++){
		this.voices.push(new Voice(this.context, i+1,this.oscillatorsParams,this.noisesParams,this.envelopeParams,this.instrGainNode,this.filter))
	}
}
//Takes input params and create osc list
Instrument.prototype.setOscillators= function(){
	let args = Array.prototype.slice.call(arguments);
	let osc = this.oscillatorsParams
	args.forEach(function(a){
		osc.push(a)
	})
	this.oscillatorsParams = osc
}
//Takes input params and create noise list
Instrument.prototype.setNoises= function(){
	let args = Array.prototype.slice.call(arguments);
	let noise = this.noisesParams
	args.forEach(function(a){
		noise.push(a)
	})
	this.noisesParams = noise
}
//Takes input params and set instrument params
Instrument.prototype.setEnvelope = function(peak,sustain,a,d,r,s){
	this.envelopeParams.peakLevel = peak || 0.3;
	this.envelopeParams.sustainLevel = sustain || 0.1;
	this.envelopeParams.attackTime = a || 0.5;
	this.envelopeParams.decayTime = d || 0.5;
	this.envelopeParams.releaseTime = r || 0.5;
	this.envelopeParams.sustainTime = s || 0.5;
}
//Takes input params and set instrument params
Instrument.prototype.setFilter = function(type,freq,detune,Q,gain){
	this.filter.type = type;
	this.filter.frequency.value = freq;
	this.filter.Q.value = Q;
	this.filter.detune.value = detune;
	this.filter.gain.value = gain;
}
//Takes input params and set instrument params
Instrument.prototype.setDistortion = function(amount){
	if(amount === 0)
		return
	let k = typeof amount === 'number' ? amount : 50,
    	n_samples = 44100,
    	curve = new Float32Array(n_samples),
    	deg = Math.PI / 180,
    	i = 0,
    	x;
	for ( ; i < n_samples; ++i ) {
	  x = i * 2 / n_samples - 1;
	  curve[i] = ( 3 + k ) * x * 20 * deg / ( Math.PI + k * Math.abs(x) );
	}

  	this.distortion.curve = curve
}
Instrument.prototype.randomize=function(){
	let limit = false
	let nbOsc = getRandomInt(1,baseOscNumber+sqrChaos*baseOscNumber);
	let distortion = getRandomFloat(0.0,sqrChaos/10);
	let peakLevel = getRandomFloat(0.04,0.06+sqrChaos/5);
	let sustainLevel = getRandomFloat(0.04,0.06+sqrChaos/5);
	let attack = getRandomFloat(0,0.5+sqrChaos*3);
	let decay = getRandomFloat(0,0.5+sqrChaos*3);
	let release = getRandomFloat(0,1.5+sqrChaos*3);
	let sustain = getRandomFloat(0,0.1+sqrChaos*3);


	let filterType = getRandomFilter();
	let filterFreq = getRandomInt(200,10000);
	//highpass has a tendency to lower the volume a lot. We will limit and level later
	if(filterType == 'highpass'){
		filterFreq = getRandomInt(200,4000)
		limit = true;
	}

	let filterDetune = getRandomInt(-sqrChaos*10,sqrChaos*10);
	let Q = getRandomFloat(0,1)*sqrChaos;
	let gain = getRandomFloat(0,1)*sqrChaos;

	let noiseType = getRandomNoise();
	let noiseFilterType = getRandomFilter()
	let noiseFilterCutoff = getRandomInt(200,10000);
	let noiseFilterVolume = getRandomFloat(0.5,5)*sqrChaos;


	this.setDistortion(distortion)

	this.setEnvelope(peakLevel,sustainLevel,attack,decay,release,sustain) 
	this.setFilter(filterType,filterFreq,filterDetune,Q,gain) 
	this.setNoises({type:noiseType,filterType:noiseFilterType,cutoff:noiseFilterCutoff,volume:noiseFilterVolume})
	if(limit)
		this.createLimiter()
	for(let i = 0;i<nbOsc;i++){
		let wave = getRandomWave();
		//beautiful
		let detune = getRandomInt(-baseDetune - sqrChaos*sqrChaos*sqrChaos*sqrChaos*10,sqrChaos*sqrChaos*sqrChaos*sqrChaos*10 + baseDetune)
		this.setOscillators({wave:wave,detune:detune})
	}
}
//Compresses and raises the gain by a fixed value
Instrument.prototype.createLimiter = function(){
	this.limiter.threshold.value = -24; 
	this.limiter.knee.value = 0.0; 
	this.limiter.ratio.value = 20.0;
	this.limiter.attack.value = 0.005; 
	this.limiter.release.value = 0.050; 
	this.instrGainNode.gain.value+=0.15

	this.filter.connect(this.limiter)
	this.limiter.connect(this.distortion)
}
//notes arg can be a single note or array, either written as a frequency, or string 'C#4'
Instrument.prototype.playNotes = function(notes, time,duration, timeBetweenNotes){
	if (!Array.isArray(notes))
		notes = [notes]

	for (let i = 0;i<notes.length;i++){
		this.voices[i].playWithSetDuration(notes[i],time + i*timeBetweenNotes,duration)
	}
}
Instrument.prototype.playNotesWithRepeat = function(notes,time,duration,timeBetweenNotes,repeat,intervalBetweenRepeat){
	for(let i = 0;i<repeat;i++){
		this.playNotes(notes,time + i*(intervalBetweenRepeat+timeBetweenNotes),duration, timeBetweenNotes)
	}
}
Instrument.prototype.changePreset = function(nb){
	this.noisesParams = [];
	this.envelopeParams = {peakLevel:0.8,
				sustainLevel:0.3,
				attackTime:0.08,
				decayTime:0.05,
				releaseTime:0.1,
				sustainTime:0.05};
	this.filter = this.context.createBiquadFilter();
	this.filter.type = 'lowpass';
	this.filter.frequency.value = 20000;
 	this.distortion = this.context.createWaveShaper();
 	this.filter.connect(this.distortion);
	this.distortion.connect(this.compressor);
	this.compressor.connect(this.instrGainNode);
	this.instrGainNode.connect(mixNode);


	switch(nb){
		case 1:{
			this.oscillatorsParams = [{wave: 'sine', detune: 0}];
			this.instrGainNode.gain.value = 0.85;
			break;
		}
		case 2:{
			this.oscillatorsParams = [{wave: 'sine', detune: 0},{wave: 'square', detune: 0},{wave: 'sine', detune: 0},{wave: 'sine', detune: 0}];
			this.instrGainNode.gain.value = 0.5;
			break;
		}
	}
	
	this.voices = []
	for (let i =0;i<8;i++){
		this.voices.push(new Voice(this.context, i+1,this.oscillatorsParams,this.noisesParams,this.envelopeParams,this.instrGainNode,this.filter))
	}
}



///VOICES///
function Voice(context, number, oscillatorsParams,noisesParams,envelopeParams,instrGainNode,filter){
	this.name = "empty";
	this.number = number;
	this.status = "notPlaying"
	this.context = context;
	this.filter = filter;
	this.oscillators = [];
	this.noises = [];
	this.oscillatorsParams = oscillatorsParams;
	this.noisesParams = noisesParams;
	this.instrGainNode = instrGainNode;
	this.envelopeParams = envelopeParams;
	this.gainNode = context.createGain();
	this.gainNode.gain.value = 0;
	this.gainNode.connect(this.filter);
}
Voice.prototype.start = function(freq, time){
	let f = freq
	if(!isNumber(freq))
		f = getFrequency(freq)

	this.gainNode.gain.cancelScheduledValues(time)

	this.gainNode.gain.exponentialRampToValueAtTime(0.001,time);
	this.gainNode.gain.setValueAtTime(0,time);

	this.oscillators = [];
	this.noises = [];

	this.oscillatorsParams.forEach(o => {
		let osc = this.createOsc(o.wave,f + o.detune,this.gainNode)
		this.oscillators.push(osc)
		osc.start(time)
	})

	this.noisesParams.forEach(n => {
		let noise = this.createNoise(n.type,n.filterType,n.cutoff, n.volume, this.gainNode)
		this.noises.push(noise)
		noise.start(time)
	})

    this.gainNode.gain.linearRampToValueAtTime(this.envelopeParams.peakLevel, time + this.envelopeParams.attackTime)
	this.gainNode.gain.setValueAtTime(this.envelopeParams.peakLevel,time + this.envelopeParams.attackTime);

    this.gainNode.gain.linearRampToValueAtTime(this.envelopeParams.sustainLevel, time + this.envelopeParams.attackTime + this.envelopeParams.decayTime) 
    this.gainNode.gain.setValueAtTime(this.envelopeParams.sustainLevel,time + this.envelopeParams.attackTime + this.envelopeParams.decayTime);

    let nb = this.number

	//setTimeout(function () {
    //    console.log("playing: " + freq + " on voice " + nb)
    //}, (time-context.currentTime)*1000);
}
Voice.prototype.stop = function(time){

	let t = time +  this.envelopeParams.releaseTime
	//this.gainNode.gain.setValueAtTime(this.envelopeParams.sustainLevel,time + this.envelopeParams.sustainTime);
	this.gainNode.gain.exponentialRampToValueAtTime(0.001,t);


	this.oscillators.forEach(o => {
		o.stop(t);
	});
	this.noises.forEach(n => {
		n.stop(t);
	});
}
Voice.prototype.playWithSetDuration = function(freq, time,duration){
	this.start(freq,time);
	this.stop(time+duration);
}
//Helper to create and connect an osc 
Voice.prototype.createOsc = function(wave,freq,gainNode){
	let source = this.context.createOscillator();
	source.frequency.value = freq
	source.type = wave;
	source.connect(gainNode);
	return source
}
//Helper to create and connect a noise
Voice.prototype.createNoise = function(type,filterType,cutoff,volume,gainNode){
	let bufferSize = 2*this.context.sampleRate
	let buffer = this.context.createBuffer(1,bufferSize,this.context.sampleRate);
	let data = buffer.getChannelData(0);
	if(type == 'white')
		data = createWhiteNoise(data,volume)
	else if (type == 'pink')
		data = createPinkNoise(data,volume)
	else if (type == 'brownian')
		data = createBrownianNoise(data,volume)
    let source = this.context.createBufferSource();
    source.loop = true;
    source.buffer = buffer
 	
 	let filter = this.context.createBiquadFilter();
	filter.type = filterType
	filter.frequency.value = cutoff

	source.connect(filter);
	filter.connect(gainNode)
	return source
}


///INTERVALS///
let notesOrder = {
  'Cb':-1,
  'C':0,
  'C#':1,
  'Db':1,
  'D':2,
  'D#':3,
  'Eb':3,
  'E':4,
  'E#':5,
  'Fb':4,
  'F':5,
  'F#':6,
  'Gb':6,
  'G':7,
  'G#':8,
  'Ab':8,
  'A':9,
  'A#':10,
  'Bb':10,
  'B':11,
  'B#':12
}
let wholeNotesOrder = {
  'C':1,
  'D':2,
  'E':3,
  'F':4,
  'G':5,
  'A':6,
  'B':7
}
let qualityDict = {
  m: "minor",
  M: "major",
  P: "perfect",
  A: "augmented",
  d: "diminished"
}
let numberDict = {
  1: "unison",
  2: "second",
  3: "third",
  4: "fourth",
  5: "fifth",
  6: "sixth",
  7: "seventh",
  8: "octave",
  9: "ninth",
  10: "tenth",
  11: "eleventh",
  12: "twelfth",
  13: "thirteenth",
  14: "fourteenth",
  15: "fifteenth",
}
let intervalsDict = {
  'P1': 0,
  'd2': 0,
  'm2': 1,
  'A1': 1,
  'M2': 2,
  'd3': 2,
  'm3': 3,
  'A2': 3,
  'M3': 4,
  'd4': 4,
  'P4': 5,
  'A3': 5,
  'd5': 6,
  'A4': 6,
  'P5': 7,
  'd6': 7,
  'm6': 8,
  'A5': 8,
  'M6': 9,
  'd7': 9,
  'm7': 10,
  'A6': 10,
  'M7': 11,
  'd8': 11,
  'P8': 12,
  'A7': 12,
  'd9': 12,
  'm9': 13,
  'A8': 13,
  'M9': 14,
  'd10': 14,
  'm10': 15,
  'A9': 15,
  'M10': 16,
  'd11': 16,
  'P11': 17,
  'A10': 17,
  'd12': 18,
  'A11': 18,
  'P12': 19,
  'A13': 19,
  'm13': 20,
  'A12': 20,
  'M13': 21,
  'd14': 21,
  'm14': 22,
  'A13': 22,
  'M14': 23,
  'd15': 23,
  'P15': 24,
  'A14': 24
}
function getIntervalInSemitones(note1,note2){
  let oct1 = note1.slice(-1);
  let rootNote1 = note1.slice(0, -1);

  let oct2 = note2.slice(-1);
  let rootNote2 = note2.slice(0, -1);

  let diff = notesOrder[rootNote2] - notesOrder[rootNote1] + (oct2-oct1)*12
  return diff
}
function getIntervalNumber(note1, note2){
  let oct1 = note1.slice(-1);
  let rootNote1 = note1.slice(0, 1);

  let oct2 = note2.slice(-1);
  let rootNote2 = note2.slice(0, 1);

  let diff = wholeNotesOrder[rootNote2] - wholeNotesOrder[rootNote1] + 1 + (oct2-oct1)*7

  if (oct2>oct1 || (oct2 == oct1 && wholeNotesOrder[rootNote2] >= wholeNotesOrder[rootNote1]))
    return  diff 
  else
    return  (2-diff)
}
function getIntervalQuality(note1,note2){
  let oct1 = note1.slice(-1);
  let rootNote1 = note1.slice(0, -1);

  let oct2 = note2.slice(-1);
  let rootNote2 = note2.slice(0, -1);

  let nb = Math.abs(getIntervalNumber(note1,note2))
  let semitones = Math.abs(getIntervalInSemitones(note1,note2))
  let quality;

  switch (semitones){
    case 0:
      if(nb == 1)
        quality = 'P';
      else if(nb == 2)
        quality = 'd';
      break;
    case 1:
      if(nb == 1)
        quality = 'A';
      else if(nb == 2)
        quality = 'm';
      break;
    case 2:
      if(nb == 2)
        quality = 'M';
      else if(nb == 3)
        quality = 'd';
      break;
    case 3:
      if(nb == 2)
        quality = 'A';
      else if(nb == 3)
        quality = 'm';
      break;
    case 4:
      if(nb == 3)
        quality = 'M';
      else if(nb == 4)
        quality = 'd';
      break;
    case 5:
      if(nb == 3)
        quality = 'A';
      else if(nb == 4)
        quality = 'P';
      break;
    case 6:
      if(nb == 4)
        quality = 'A';
      else if(nb == 5)
        quality = 'd';
      break;
    case 7:
      if(nb == 5)
        quality = 'P';
      else if(nb == 6)
        quality = 'd';
      break;
    case 8:
      if(nb == 5)
        quality = 'A';
      else if(nb == 6)
        quality = 'm';
      break;
    case 9:
      if(nb == 7)
        quality = 'd';
      else if(nb == 6)
        quality = 'M';
      break;
    case 10:
      if(nb == 7)
        quality = 'm';
      else if(nb == 6)
        quality = 'A';
      break;
    case 11:
      if(nb == 7)
        quality = 'M';
      else if(nb == 8)
        quality = 'd';
      break;
    case 12:
      if(nb == 8)
        quality = 'P';
      else if(nb == 7)
        quality = 'A';
      else if(nb == 9)
        quality = 'd';
      break;
    case 13:
      if(nb == 8)
        quality = 'A';
      else if(nb == 9)
        quality = 'm';
      break;
    case 14:
      if(nb == 9)
        quality = 'M';
      else if(nb == 10)
        quality = 'd';
      break;
    case 15:
      if(nb == 9)
        quality = 'A';
      else if(nb == 10)
        quality = 'm';
      break;
    case 16:
      if(nb == 10)
        quality = 'M';
      else if(nb == 11)
        quality = 'd';
      break;
    case 17:
      if(nb == 10)
        quality = 'A';
      else if(nb == 11)
        quality = 'P';
      break;
    case 18:
      if(nb == 11)
        quality = 'A';
      else if(nb == 12)
        quality = 'd';
      break;
    case 19:
      if(nb == 12)
        quality = 'P';
      else if(nb == 6)
        quality = '13';
      break;
    case 20:
      if(nb == 12)
        quality = 'A';
      else if(nb == 13)
        quality = 'm';
      break;
    case 21:
      if(nb == 14)
        quality = 'd';
      else if(nb == 13)
        quality = 'M';
      break;
    case 22:
      if(nb == 14)
        quality = 'm';
      else if(nb == 13)
        quality = 'A';
      break;
    case 23:
      if(nb == 14)
        quality = 'M';
      else if(nb == 15)
        quality = 'd';
      break;
    case 24:
      if(nb == 48)
        quality = 'P';
      else if(nb == 14)
        quality = 'A';
      break;
  }
  return  quality 
}
function getIntervalOrdern(note1,note2){
  let interval  = getIntervalInSemitones(note1,note2)
  if (interval>0)
    return 'ascending'
  else if (interval < 0)
    return 'descending'
  else
    return ''
}
function displayInterval(n1,n2){
  
  let order = getIntervalOrder(n1,n2);
  let quality = getIntervalQuality(n1,n2);
  let number = getIntervalNumber(n1,n2);

  let qualityText = qualityDict[quality];
  let numberText = numberDict[number];

  if(debug){
    console.log("Notes : " + n1 + " - " + n2)
    console.log("Distance : " + getIntervalInSemitones(n1,n2) + " semitones")
    console.log("Interval : " + order + " " + qualityText + " " + numberText ) 
  }

  return [getIntervalInSemitones(n1,n2), quality, number]
}
function getNoteFromInterval(note,interval, intervalOrder){
  let oct = parseInt(note.slice(-1));
  let rootNote = note.slice(0, -1);

  let intervalNumber = parseInt(interval.substring(1));
  let intervalQuality = interval.substring(0,1);

  let order = intervalOrder == "ascending"? 1 : -1

  let resultNote = (wholeNotesOrder[rootNote.substring(0,1)] + order*(intervalNumber-1))%7;

  if(resultNote == 0)
    resultNote = 7;
  if(resultNote < 0)
    resultNote += 7;

  let resultNoteName = getKeyByValue(wholeNotesOrder, resultNote);

  let semitones = order*intervalsDict[interval]

  let resultOctave = oct;

  while(semitones > 12){
    resultOctave+=1;
    semitones-=12
  }
  while(semitones < -12){
    resultOctave-=1;
    semitones+=12
  }
  if(semitones == 12)
    resultOctave+=1
  if(semitones == -12)
    resultOctave-=1


  let diffFromNames = (notesOrder[resultNoteName] - notesOrder[rootNote])*order

  if (diffFromNames<0 || Math.sign(diffFromNames) == -0){
    diffFromNames+=12
    resultOctave+=order*1

    //horrible
    if((intervalNumber == 1 || intervalNumber == 8 || intervalNumber == 15) && intervalQuality != 'd'  )
      resultOctave-=1*order
    if((intervalNumber == 7 || intervalNumber == 14) && intervalQuality == 'A'  )
      resultOctave-=1*order
  }

  let d = order*diffFromNames-semitones
  if(d>2)
    d-=12
  if(d<-2)
    d+=12


  let mod = ''
  if(d == 1)
    mod = 'b'
  if(d == -1)
    mod = '#'

  if(d == 2 )
    mod = 'bb'
  if(d == -2)
    mod = '##'

  //looking for triple alteration - start again with a new root note (ex G# doest have a D2 but F# does)
  if(d>=3 || d <=-3){
    console.log('Can not build a ' +intervalOrder + ' ' +interval + " on " + note + '. Picking a new random note')
    return getNoteFromInterval(getRandomNoteFull(), interval, intervalOrder)
  }

  let result = resultNoteName + mod + resultOctave

  let qualityText = qualityDict[intervalQuality];
  let numberText = numberDict[intervalNumber];
  if(interval == "P1" || interval == "d2")
    intervalOrder = ''

  let answer =  qualityText + " " + numberText

  if(debug){
    console.log("Notes : " + note + " - " + result)
    console.log("Distance : " + order*intervalsDict[interval] + " semitones")
    console.log("Interval : " + intervalOrder + " " + answer)
  }
  
  return [note, result,answer];
}


///KEYBOARD
let mouseIsDown = false;
let playedColor = '#ecec71'
let keyboardMap= {}
let keysMap = {
  'A': "C3",
  'S': "D3",
  'D': "E3",
  'F': "F3",
  'G': "G3",
  'H': "A3",
  'J': "B3",
  'K': "C4",
  'L': "D4",
  'º': "E4",
  'Þ': "F4",
  'Ü': "G4",
  'W': "C#3",
  'E': "D#3",
  'T': "F#3",
  'Y': "G#3",
  'U': "A#3",
  'O': "C#4",
  'P': "D#4",
  'Ý': "F#4",
}

function Keyboard(divID, octaves, width,height){
	this.divID = divID;
	this.octaves = octaves;
	this.width = width;
	this.noteWidth = width/(octaves*7);
	this.noteHeight = height;
}
Keyboard.prototype.start = function(){
	let self = this;
	let div = '#' + this.divID
	$(div).addClass('ckeyboard')

	$(div).append('<ul style=" list-style-type: none;position: relative;" ondragstart="return false;" ondrop="return false;"></ul>')
	let id = 0
	for(let i = 0;i<this.octaves*7;i++){
		$(div + " ul").append('<li>' + this.createNote('white',this.noteWidth*i,id)+ '</li>')
		id++;
		if(i%7 != 2 && i%7 != 6){
			$(div + " ul").append('<li>' + this.createNote('black',this.noteWidth*i+this.noteWidth/3*2,id)+ '</li>')
			id++;
		}
	}
	let startNote = 'C3'
	keyboardMap[0] = startNote
	for(let i = 1;i<this.octaves*13;i++){
		keyboardMap[i] = getNextNote(startNote)
		startNote = keyboardMap[i]
	}

	$(".ckeyboard .note").mousedown(function(){
		let id = $(this).attr('id')
		mouseIsDown = true;
		self.pressNote(id)
	});
	$(".ckeyboard .note").mouseup(function(){
		let id = $(this).attr('id')
		self.releaseNote(id)
	});
	$(".ckeyboard .note").mouseenter(function(){
		if(!mouseIsDown)
			return
		let id = $(this).attr('id')
		self.pressNote(id)
	});
	$(".ckeyboard .note").mouseleave(function(){
		if(!mouseIsDown)
			return
		if($(this).hasClass('played')){
			let id = $(this).attr('id')
			self.releaseNote(id)
		}
	});
	$(document).mouseup(function(){
		mouseIsDown = false;
	});
	document.onkeydown = function(evt) {
	    keyPressed = evt.keyCode || window.event;
	    if(keyPressed in keysDown)
	    	return;
	    keysDown[keyPressed] = true

	    let pressed = String.fromCharCode(keyPressed)

	    keyboard.pressNote(getKeyByValue(keyboardMap,keysMap[pressed]))
	};
	document.onkeyup = function(evt) {
		keyPressed = evt.keyCode || window.event;

	    delete keysDown[keyPressed];

	    let pressed = String.fromCharCode(keyPressed)
	    if (!(pressed in keysMap))
	    	return;
	    keyboard.releaseNote(getKeyByValue(keyboardMap,keysMap[pressed]))
	};
}
Keyboard.prototype.createNote = function(color, position, id){
	let w = color == 'white'? this.noteWidth : this.noteWidth*2/3;
	let h = color == 'white'? this.noteHeight : this.noteHeight*5.5/9;

	let classes = '"class="note ' + color + '"'
	let pos = 'position:absolute; left:' + position + 'px;'
	let width  = 'width:'+ w+'px;'
	let height  = 'height:'+ h+'px;'

	let styling = 'border: 1px solid black; background-color: ' + color + ';'
	let zIndex = color == 'black' ? 'z-index: 10;' : ''

	return  '<div  id="' + id + classes + '" style = "'+  pos + width +  height +  styling + zIndex +'"></div>'
}
Keyboard.prototype.pressNote = function(id){
	if("undefined" === typeof keyboardMap[id])
		return
	$('.ckeyboard #' + id).css('background-color', playedColor)
	$('.ckeyboard #' + id).addClass('played')

	let freq = getFrequency(keyboardMap[id])
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
}
Keyboard.prototype.releaseNote = function(id){
	if("undefined" === typeof keyboardMap[id])
		return
	let c = $('.ckeyboard #' + id).hasClass('white')? 'white': 'black'
	$('.ckeyboard #' + id).css('background-color', c)
	$('.ckeyboard #' + id).removeClass('played')

	let freq = getFrequency(keyboardMap[id])
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
}







