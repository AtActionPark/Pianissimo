let keysMap = {
  'A': "C3",
  'S': "D3",
  'D': "E3",
  'F': "F3",
  'G': "G3",
  'H': "A3",
  'J': "B3",
  'K': "C4",
  'W': "C#3",
  'E': "D#3",
  'T': "F#3",
  'Y': "G#3",
  'U': "A#3",
}
let rootNotes = {
  'C': 261.626,
  'C#':277.183,
  'D':293.665,
  'D#':311.127,
  'E':329.628,
  'F':349.228,
  'F#':369.994,
  'G':391.995,
  'G#':415.305,
  'A':440,
  'A#':466.164,
  'B':493.883
}
let enharmonics = {
  'Db': 'C#',
  'Eb': 'D#',
  'E#': 'F',
  'Fb': 'E',
  'Gb': 'F#',
  'Ab': 'G#',
  'Bb': 'A#',
  'Cb': 'B',
  'B#': 'C',
  'C##': 'D',
  'Cbb': 'A#',
  'D##': 'E',
  'Dbb': 'C',
  'E##': 'F#',
  'Ebb': 'D',
  'F##': 'G',
  'Fbb': 'D#',
  'G##': 'A',
  'Gbb': 'F',
  'A##': 'B',
  'Abb': 'G',
  'B##': 'C#',
  'Bbb': 'A',
}

let getFrequency = function(note){
  let oct = note.slice(-1);
  let rootNote = note.slice(0, -1);

  if("undefined" === typeof rootNotes[rootNote] ){
    if(rootNote === 'B#' || rootNote === 'B#'){
      return rootNotes[enharmonics[rootNote]]*Math.pow(2,(oct-2));
    }
    else if (rootNote === 'Cb' || rootNote === 'Cbb'){
      return rootNotes[enharmonics[rootNote]]*Math.pow(2,(oct-4));
    }
    else{
      return rootNotes[enharmonics[rootNote]]*Math.pow(2,(oct-3));
    }
  }
  else
    return rootNotes[rootNote]*Math.pow(2,(oct-3));
}
let getRandomNoteSimple = function(){
  let note =  pickRandomProperty(rootNotes)
  let octave = getRandomInt(3,4)

  return note+octave
}
let getRandomNoteFull = function(){
  let note =  pickRandomProperty(notesOrder)
  let octave = getRandomInt(3,4)

  return note+octave
}


let waves = {
  0:'sine',
  1:'square',
  2:'triangle',
  3:'sawtooth',
}
let noises = {
  0:'white',
  1:'pink',
  2:'brownian',
}
let filters = {
  0:'lowpass',
  1:'highpass',
  2:'bandpass',
  3:'lowshelf',
  4:'highshelf',
  5:'peaking',
  6:'allpass'
}


//SEEDED RANDOMS. Stolen somewhere
// Establish the parameters of the generator
let m = 25;
// a - 1 should be divisible by m's prime factors
let a = 11;
// c and m should be co-prime
let c = 17;
let rand = function() {
  // define the recurrence relationship
  seed = (a * seed + c) % m;
  // return an integer
  // Could return a float in (0, 1) by dividing by m
  return seed/m;
};

function getRandomFloat(a,b){
  return rand()*(b-a) +a
}
function getRandomInt(a,b){
  return Math.floor(rand()*(b - a + 1)) + a;
}
function pickRandomProperty(obj) {
    let keys = Object.keys(obj)
    return keys[ keys.length * rand() << 0 ];
}
function pickRandomArray(arr) {
    return arr[arr.length * rand() << 0 ];
}
function getRandomWave(){
  return waves[pickRandomProperty(waves)]
}
function getRandomNoise(){
  return noises[pickRandomProperty(noises)]
}
function getRandomFilter(){
  return filters[pickRandomProperty(filters)]
}

function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function getKeyByValue(object, value) {
  return Object.keys(object).find(key => object[key] === value);
}

//Taken from Kevin Cennis: http://jsbin.com/kabodeqapuqu/4/edit?html,css,js,output
function Oscilloscope( ac, canvas ) {
  if ( !ac ) {
    throw new Error('No AudioContext provided');
  }
  if ( !canvas ) {
    throw new Error('No Canvas provided');
  } 
  this.ac = ac;
  this.canvas = canvas;
  this.ctx = canvas.getContext('2d');
  this.width = canvas.width;
  this.height = canvas.height;
  this.input = ac.createGain();
  this.analyzer = ac.createAnalyser();
  this.analyzer.fftSize = oscFFTSize;
  this.input.connect(this.analyzer);
  this.freqData = new Uint8Array(this.analyzer.frequencyBinCount);
  this.rAF = null;
  this.strokeStyle = '#6cf';
  this.sensitivity = oscBaseSensitivity;
}
Oscilloscope.prototype.reset = function(ac){
  this.stop()
  this.ac = ac;
  this.input = ac.createGain();
  this.analyzer = ac.createAnalyser();
  this.analyzer.fftSize = oscFFTSize;
  this.input.connect(this.analyzer);
  this.freqData = new Uint8Array(this.analyzer.frequencyBinCount);
  this.rAF = null;
}
// borrowed from https://github.com/cwilso/oscilloscope/blob/master/js/oscilloscope.js 
Oscilloscope.prototype.findZeroCrossing = function( data, width ) {
  let i = 0, 
    last = -1, 
    min = ( this.sensitivity - 0 ) * ( 256 - 128 ) / ( 100 - 0 ) + 128,
    s;
  
  while ( i < width && ( data[ i ] > 128 ) ) {
    i++;
  }

  if ( i >= width ) {
    return 0;
  }

  while ( i < width && ( ( s = data[ i ] ) < min ) ) {
    last = s >= 128 ? last === -1 ? i : last : -1;
    i++;
  }
  
  last = last < 0 ? i : last;
  
  return i === width ? 0 : last;
};
Oscilloscope.prototype.start = function() {
  this.rAF = requestAnimationFrame( this.draw.bind( this ) );
};
Oscilloscope.prototype.stop = function() {
  cancelAnimationFrame( this.rAF );
  this.rAF = null;
};
Oscilloscope.prototype.draw = function() {
  let len = this.freqData.length,
    scale = this.height / 256 / 2,
    i = j = 50,
    magnitude;

  // grid
  this.ctx.fillStyle = '#002233';
  this.ctx.fillRect( 0, 0, this.width, this.height );
  this.ctx.lineWidth = 0;
  this.ctx.strokeStyle = 'rgba(60,180,220,0.05)';
  this.ctx.beginPath();
  for ( ; i < this.width; i += 50 ) {
    this.ctx.moveTo( i, 0 );
    this.ctx.lineTo( i, this.height );
    for ( j = 0; j < this.height; j += 50 ) {
      this.ctx.moveTo( 0, j );
      this.ctx.lineTo( this.width, j );
    }
  }
  this.ctx.stroke();
  
  // x axis
  this.ctx.strokeStyle = 'rgba(60,180,220,0.22)';
  this.ctx.beginPath();
  this.ctx.moveTo( 0, this.height / 2 );
  this.ctx.lineTo( this.width, this.height / 2 );
  this.ctx.stroke();

  // waveform
  this.analyzer.getByteTimeDomainData( this.freqData );
  i = this.findZeroCrossing( this.freqData, this.width );
  this.ctx.lineWidth = 2.5;
  this.ctx.strokeStyle = this.strokeStyle;
  this.ctx.beginPath();
  this.ctx.moveTo( 0, ( 256 - this.freqData[ i ] ) * scale + this.height / 4 );
  for ( j = 0; i < len && j < this.width; i++, j++ ) {
    magnitude = ( 256 - this.freqData[ i ] ) * scale + this.height / 4;
    this.ctx.lineTo( j, magnitude );
  }

  this.ctx.stroke();

  this.rAF = requestAnimationFrame( this.draw.bind( this ) );
};

//Stolen from somewhere
createWhiteNoise = function(data,volume){
  for (i = 0; i < data.length; i++) {
    data[i] = (Math.random() - 0.5) * 2*volume;
  }
  return data
}
createPinkNoise = function(data,volume){
  let b0, b1, b2, b3, b4, b5, b6;
      b0 = b1 = b2 = b3 = b4 = b5 = b6 = 0.0;
  for (i = 0; i < data.length; i++) {
        let white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        data[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        data[i] *= 0.11*volume; // (roughly) compensate for gain
        b6 = white * 0.115926;
    }
    return data
}
createBrownianNoise = function(data,volume){
  let lastOut = 0.0;
  for (i = 0; i < data.length; i++) {
        let white = Math.random() * 2 - 1;
            data[i] = (lastOut + (0.02 * white)) / 1.02;
            lastOut = data[i];
            data[i] *= 3.5*volume; // (roughly) compensate for gain
    }
    return data
}
noiseBuffer = function(context) {
  let bufferSize = context.sampleRate;
  let buffer = context.createBuffer(1, bufferSize, context.sampleRate);
  let output = buffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i++) {
    output[i] = Math.random() * 2 - 1;
  }

  return buffer;
};