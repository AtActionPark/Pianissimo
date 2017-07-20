function Voice(number, oscillatorsParams,noisesParams,envelopeParams,instrGainNode,filter){
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
	this.gainNode = this.context.createGain();
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