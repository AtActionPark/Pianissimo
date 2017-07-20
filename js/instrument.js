function Instrument(){
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
	this.compressor.reduction.value = compressorRatio;
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
		this.voices.push(new Voice(i+1,this.oscillatorsParams,this.noisesParams,this.envelopeParams,this.instrGainNode,this.filter))
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
		this.voices.push(new Voice(i+1,this.oscillatorsParams,this.noisesParams,this.envelopeParams,this.instrGainNode,this.filter))
	}
}
