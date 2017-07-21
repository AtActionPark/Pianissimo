let rootNotes = {
  'C': 261.626,
  'C#': 277.183,
  'D': 293.665,
  'D#': 311.127,
  'E': 329.628,
  'F': 349.228,
  'F#': 369.994,
  'G': 391.995,
  'G#': 415.305,
  'A': 440,
  'A#': 466.164,
  'B': 493.883
};
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
  'Bbb': 'A'
};

function getNextNote(note) {
  let oct = note.slice(-1);
  let rootNote = note.slice(0, -1);

  let octResult = rootNote == 'B' ? parseInt(oct) + 1 : oct;

  let notes = Object.keys(rootNotes);
  let n = notes.indexOf(rootNote) + 1;
  let rootNoteResult = rootNote == 'B' ? 'C' : notes[n];

  return rootNoteResult + octResult;
}

let getFrequency = function (note) {
  let oct = note.slice(-1);
  let rootNote = note.slice(0, -1);

  if ("undefined" === typeof rootNotes[rootNote]) {
    if (rootNote === 'B#' || rootNote === 'B#') {
      return rootNotes[enharmonics[rootNote]] * Math.pow(2, oct - 2);
    } else if (rootNote === 'Cb' || rootNote === 'Cbb') {
      return rootNotes[enharmonics[rootNote]] * Math.pow(2, oct - 4);
    } else {
      return rootNotes[enharmonics[rootNote]] * Math.pow(2, oct - 3);
    }
  } else return rootNotes[rootNote] * Math.pow(2, oct - 3);
};
let getRandomNoteSimple = function () {
  let note = pickRandomProperty(rootNotes);
  let octave = getRandomInt(3, 4);

  return note + octave;
};
let getRandomNoteFull = function () {
  let note = pickRandomProperty(notesOrder);
  let octave = getRandomInt(3, 4);

  return note + octave;
};

let waves = {
  0: 'sine',
  1: 'square',
  2: 'triangle',
  3: 'sawtooth'
};
let noises = {
  0: 'white',
  1: 'pink',
  2: 'brownian'
};
let filters = {
  0: 'lowpass',
  1: 'highpass',
  2: 'bandpass',
  3: 'lowshelf',
  4: 'highshelf',
  5: 'peaking',
  6: 'allpass'

  //SEEDED RANDOMS. Stolen somewhere
  // Establish the parameters of the generator
};let m = 25;
// a - 1 should be divisible by m's prime factors
let a = 11;
// c and m should be co-prime
let c = 17;
let rand = function () {
  // define the recurrence relationship
  seed = (a * seed + c) % m;
  // return an integer
  // Could return a float in (0, 1) by dividing by m
  return seed / m;
};

function getRandomFloat(a, b) {
  return rand() * (b - a) + a;
}
function getRandomInt(a, b) {
  return Math.floor(rand() * (b - a + 1)) + a;
}
function pickRandomProperty(obj) {
  let keys = Object.keys(obj);
  return keys[keys.length * rand() << 0];
}
function pickRandomArray(arr) {
  return arr[arr.length * rand() << 0];
}
function getRandomWave() {
  return waves[pickRandomProperty(waves)];
}
function getRandomNoise() {
  return noises[pickRandomProperty(noises)];
}
function getRandomFilter() {
  return filters[pickRandomProperty(filters)];
}

function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function getKeyByValue(object, value) {
  return Object.keys(object).find(key => object[key] === value);
}

//Taken from Kevin Cennis: http://jsbin.com/kabodeqapuqu/4/edit?html,css,js,output
function Oscilloscope(ac, canvas) {
  if (!ac) {
    throw new Error('No AudioContext provided');
  }
  if (!canvas) {
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
Oscilloscope.prototype.reset = function (ac) {
  this.stop();
  this.ac = ac;
  this.input = ac.createGain();
  this.analyzer = ac.createAnalyser();
  this.analyzer.fftSize = oscFFTSize;
  this.input.connect(this.analyzer);
  this.freqData = new Uint8Array(this.analyzer.frequencyBinCount);
  this.rAF = null;
};
// borrowed from https://github.com/cwilso/oscilloscope/blob/master/js/oscilloscope.js 
Oscilloscope.prototype.findZeroCrossing = function (data, width) {
  let i = 0,
      last = -1,
      min = (this.sensitivity - 0) * (256 - 128) / (100 - 0) + 128,
      s;

  while (i < width && data[i] > 128) {
    i++;
  }

  if (i >= width) {
    return 0;
  }

  while (i < width && (s = data[i]) < min) {
    last = s >= 128 ? last === -1 ? i : last : -1;
    i++;
  }

  last = last < 0 ? i : last;

  return i === width ? 0 : last;
};
Oscilloscope.prototype.start = function () {
  this.rAF = requestAnimationFrame(this.draw.bind(this));
};
Oscilloscope.prototype.stop = function () {
  cancelAnimationFrame(this.rAF);
  this.rAF = null;
};
Oscilloscope.prototype.draw = function () {
  let len = this.freqData.length,
      scale = this.height / 256 / 2,
      i = j = 50,
      magnitude;

  // grid
  this.ctx.fillStyle = '#002233';
  this.ctx.fillRect(0, 0, this.width, this.height);
  this.ctx.lineWidth = 0;
  this.ctx.strokeStyle = 'rgba(60,180,220,0.05)';
  this.ctx.beginPath();
  for (; i < this.width; i += 50) {
    this.ctx.moveTo(i, 0);
    this.ctx.lineTo(i, this.height);
    for (j = 0; j < this.height; j += 50) {
      this.ctx.moveTo(0, j);
      this.ctx.lineTo(this.width, j);
    }
  }
  this.ctx.stroke();

  // x axis
  this.ctx.strokeStyle = 'rgba(60,180,220,0.22)';
  this.ctx.beginPath();
  this.ctx.moveTo(0, this.height / 2);
  this.ctx.lineTo(this.width, this.height / 2);
  this.ctx.stroke();

  // waveform
  this.analyzer.getByteTimeDomainData(this.freqData);
  i = this.findZeroCrossing(this.freqData, this.width);
  this.ctx.lineWidth = 2.5;
  this.ctx.strokeStyle = this.strokeStyle;
  this.ctx.beginPath();
  this.ctx.moveTo(0, (256 - this.freqData[i]) * scale + this.height / 4);
  for (j = 0; i < len && j < this.width; i++, j++) {
    magnitude = (256 - this.freqData[i]) * scale + this.height / 4;
    this.ctx.lineTo(j, magnitude);
  }

  this.ctx.stroke();

  this.rAF = requestAnimationFrame(this.draw.bind(this));
};

//Stolen from somewhere
let createWhiteNoise = function (data, volume) {
  for (i = 0; i < data.length; i++) {
    data[i] = (Math.random() - 0.5) * 2 * volume;
  }
  return data;
};
let createPinkNoise = function (data, volume) {
  let b0, b1, b2, b3, b4, b5, b6;
  b0 = b1 = b2 = b3 = b4 = b5 = b6 = 0.0;
  for (let i = 0; i < data.length; i++) {
    let white = Math.random() * 2 - 1;
    b0 = 0.99886 * b0 + white * 0.0555179;
    b1 = 0.99332 * b1 + white * 0.0750759;
    b2 = 0.96900 * b2 + white * 0.1538520;
    b3 = 0.86650 * b3 + white * 0.3104856;
    b4 = 0.55000 * b4 + white * 0.5329522;
    b5 = -0.7616 * b5 - white * 0.0168980;
    data[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
    data[i] *= 0.11 * volume; // (roughly) compensate for gain
    b6 = white * 0.115926;
  }
  return data;
};
let createBrownianNoise = function (data, volume) {
  let lastOut = 0.0;
  for (let i = 0; i < data.length; i++) {
    let white = Math.random() * 2 - 1;
    data[i] = (lastOut + 0.02 * white) / 1.02;
    lastOut = data[i];
    data[i] *= 3.5 * volume; // (roughly) compensate for gain
  }
  return data;
};
let noiseBuffer = function (context) {
  let bufferSize = context.sampleRate;
  let buffer = context.createBuffer(1, bufferSize, context.sampleRate);
  let output = buffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i++) {
    output[i] = Math.random() * 2 - 1;
  }

  return buffer;
};

/*! NoSleep.js v0.7.0 - git.io/vfn01 - Rich Tibbett - MIT license */
(function webpackUniversalModuleDefinition(root, factory) {
  if (typeof exports === 'object' && typeof module === 'object') module.exports = factory();else if (typeof define === 'function' && define.amd) define([], factory);else if (typeof exports === 'object') exports["NoSleep"] = factory();else root["NoSleep"] = factory();
})(this, function () {
  return (/******/function (modules) {
      // webpackBootstrap
      /******/ // The module cache
      /******/var installedModules = {};
      /******/
      /******/ // The require function
      /******/function __webpack_require__(moduleId) {
        /******/
        /******/ // Check if module is in cache
        /******/if (installedModules[moduleId]) {
          /******/return installedModules[moduleId].exports;
          /******/
        }
        /******/ // Create a new module (and put it into the cache)
        /******/var module = installedModules[moduleId] = {
          /******/i: moduleId,
          /******/l: false,
          /******/exports: {}
          /******/ };
        /******/
        /******/ // Execute the module function
        /******/modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
        /******/
        /******/ // Flag the module as loaded
        /******/module.l = true;
        /******/
        /******/ // Return the exports of the module
        /******/return module.exports;
        /******/
      }
      /******/
      /******/
      /******/ // expose the modules object (__webpack_modules__)
      /******/__webpack_require__.m = modules;
      /******/
      /******/ // expose the module cache
      /******/__webpack_require__.c = installedModules;
      /******/
      /******/ // define getter function for harmony exports
      /******/__webpack_require__.d = function (exports, name, getter) {
        /******/if (!__webpack_require__.o(exports, name)) {
          /******/Object.defineProperty(exports, name, {
            /******/configurable: false,
            /******/enumerable: true,
            /******/get: getter
            /******/ });
          /******/
        }
        /******/
      };
      /******/
      /******/ // getDefaultExport function for compatibility with non-harmony modules
      /******/__webpack_require__.n = function (module) {
        /******/var getter = module && module.__esModule ?
        /******/function getDefault() {
          return module['default'];
        } :
        /******/function getModuleExports() {
          return module;
        };
        /******/__webpack_require__.d(getter, 'a', getter);
        /******/return getter;
        /******/
      };
      /******/
      /******/ // Object.prototype.hasOwnProperty.call
      /******/__webpack_require__.o = function (object, property) {
        return Object.prototype.hasOwnProperty.call(object, property);
      };
      /******/
      /******/ // __webpack_public_path__
      /******/__webpack_require__.p = "";
      /******/
      /******/ // Load entry module and return exports
      /******/return __webpack_require__(__webpack_require__.s = 0);
      /******/
    }(
    /************************************************************************/
    /******/[
    /* 0 */
    /***/function (module, exports, __webpack_require__) {

      "use strict";

      var _createClass = function () {
        function defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
          }
        }return function (Constructor, protoProps, staticProps) {
          if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
        };
      }();

      function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      }

      var mediaFile = __webpack_require__(1);

      // Detect iOS browsers < version 10
      var oldIOS = typeof navigator !== 'undefined' && parseFloat(('' + (/CPU.*OS ([0-9_]{3,4})[0-9_]{0,1}|(CPU like).*AppleWebKit.*Mobile/i.exec(navigator.userAgent) || [0, ''])[1]).replace('undefined', '3_2').replace('_', '.').replace('_', '')) < 10 && !window.MSStream;

      var NoSleep = function () {
        function NoSleep() {
          _classCallCheck(this, NoSleep);

          if (oldIOS) {
            this.noSleepTimer = null;
          } else {
            // Set up no sleep video element
            this.noSleepVideo = document.createElement('video');

            this.noSleepVideo.setAttribute('playsinline', '');
            this.noSleepVideo.setAttribute('src', mediaFile);

            this.noSleepVideo.addEventListener('timeupdate', function (e) {
              if (this.noSleepVideo.currentTime > 0.5) {
                this.noSleepVideo.currentTime = Math.random();
              }
            }.bind(this));
          }
        }

        _createClass(NoSleep, [{
          key: 'enable',
          value: function enable() {
            if (oldIOS) {
              this.disable();
              this.noSleepTimer = window.setInterval(function () {
                window.location.href = '/';
                window.setTimeout(window.stop, 0);
              }, 15000);
            } else {
              this.noSleepVideo.play();
            }
          }
        }, {
          key: 'disable',
          value: function disable() {
            if (oldIOS) {
              if (this.noSleepTimer) {
                window.clearInterval(this.noSleepTimer);
                this.noSleepTimer = null;
              }
            } else {
              this.noSleepVideo.pause();
            }
          }
        }]);

        return NoSleep;
      }();

      ;

      module.exports = NoSleep;

      /***/
    },
    /* 1 */
    /***/function (module, exports, __webpack_require__) {

      "use strict";

      module.exports = 'data:video/mp4;base64,AAAAIGZ0eXBtcDQyAAACAGlzb21pc28yYXZjMW1wNDEAAAAIZnJlZQAACKBtZGF0AAAC8wYF///v3EXpvebZSLeWLNgg2SPu73gyNjQgLSBjb3JlIDE0MiByMjQ3OSBkZDc5YTYxIC0gSC4yNjQvTVBFRy00IEFWQyBjb2RlYyAtIENvcHlsZWZ0IDIwMDMtMjAxNCAtIGh0dHA6Ly93d3cudmlkZW9sYW4ub3JnL3gyNjQuaHRtbCAtIG9wdGlvbnM6IGNhYmFjPTEgcmVmPTEgZGVibG9jaz0xOjA6MCBhbmFseXNlPTB4MToweDExMSBtZT1oZXggc3VibWU9MiBwc3k9MSBwc3lfcmQ9MS4wMDowLjAwIG1peGVkX3JlZj0wIG1lX3JhbmdlPTE2IGNocm9tYV9tZT0xIHRyZWxsaXM9MCA4eDhkY3Q9MCBjcW09MCBkZWFkem9uZT0yMSwxMSBmYXN0X3Bza2lwPTEgY2hyb21hX3FwX29mZnNldD0wIHRocmVhZHM9NiBsb29rYWhlYWRfdGhyZWFkcz0xIHNsaWNlZF90aHJlYWRzPTAgbnI9MCBkZWNpbWF0ZT0xIGludGVybGFjZWQ9MCBibHVyYXlfY29tcGF0PTAgY29uc3RyYWluZWRfaW50cmE9MCBiZnJhbWVzPTMgYl9weXJhbWlkPTIgYl9hZGFwdD0xIGJfYmlhcz0wIGRpcmVjdD0xIHdlaWdodGI9MSBvcGVuX2dvcD0wIHdlaWdodHA9MSBrZXlpbnQ9MzAwIGtleWludF9taW49MzAgc2NlbmVjdXQ9NDAgaW50cmFfcmVmcmVzaD0wIHJjX2xvb2thaGVhZD0xMCByYz1jcmYgbWJ0cmVlPTEgY3JmPTIwLjAgcWNvbXA9MC42MCBxcG1pbj0wIHFwbWF4PTY5IHFwc3RlcD00IHZidl9tYXhyYXRlPTIwMDAwIHZidl9idWZzaXplPTI1MDAwIGNyZl9tYXg9MC4wIG5hbF9ocmQ9bm9uZSBmaWxsZXI9MCBpcF9yYXRpbz0xLjQwIGFxPTE6MS4wMACAAAAAOWWIhAA3//p+C7v8tDDSTjf97w55i3SbRPO4ZY+hkjD5hbkAkL3zpJ6h/LR1CAABzgB1kqqzUorlhQAAAAxBmiQYhn/+qZYADLgAAAAJQZ5CQhX/AAj5IQADQGgcIQADQGgcAAAACQGeYUQn/wALKCEAA0BoHAAAAAkBnmNEJ/8ACykhAANAaBwhAANAaBwAAAANQZpoNExDP/6plgAMuSEAA0BoHAAAAAtBnoZFESwr/wAI+SEAA0BoHCEAA0BoHAAAAAkBnqVEJ/8ACykhAANAaBwAAAAJAZ6nRCf/AAsoIQADQGgcIQADQGgcAAAADUGarDRMQz/+qZYADLghAANAaBwAAAALQZ7KRRUsK/8ACPkhAANAaBwAAAAJAZ7pRCf/AAsoIQADQGgcIQADQGgcAAAACQGe60Qn/wALKCEAA0BoHAAAAA1BmvA0TEM//qmWAAy5IQADQGgcIQADQGgcAAAAC0GfDkUVLCv/AAj5IQADQGgcAAAACQGfLUQn/wALKSEAA0BoHCEAA0BoHAAAAAkBny9EJ/8ACyghAANAaBwAAAANQZs0NExDP/6plgAMuCEAA0BoHAAAAAtBn1JFFSwr/wAI+SEAA0BoHCEAA0BoHAAAAAkBn3FEJ/8ACyghAANAaBwAAAAJAZ9zRCf/AAsoIQADQGgcIQADQGgcAAAADUGbeDRMQz/+qZYADLkhAANAaBwAAAALQZ+WRRUsK/8ACPghAANAaBwhAANAaBwAAAAJAZ+1RCf/AAspIQADQGgcAAAACQGft0Qn/wALKSEAA0BoHCEAA0BoHAAAAA1Bm7w0TEM//qmWAAy4IQADQGgcAAAAC0Gf2kUVLCv/AAj5IQADQGgcAAAACQGf+UQn/wALKCEAA0BoHCEAA0BoHAAAAAkBn/tEJ/8ACykhAANAaBwAAAANQZvgNExDP/6plgAMuSEAA0BoHCEAA0BoHAAAAAtBnh5FFSwr/wAI+CEAA0BoHAAAAAkBnj1EJ/8ACyghAANAaBwhAANAaBwAAAAJAZ4/RCf/AAspIQADQGgcAAAADUGaJDRMQz/+qZYADLghAANAaBwAAAALQZ5CRRUsK/8ACPkhAANAaBwhAANAaBwAAAAJAZ5hRCf/AAsoIQADQGgcAAAACQGeY0Qn/wALKSEAA0BoHCEAA0BoHAAAAA1Bmmg0TEM//qmWAAy5IQADQGgcAAAAC0GehkUVLCv/AAj5IQADQGgcIQADQGgcAAAACQGepUQn/wALKSEAA0BoHAAAAAkBnqdEJ/8ACyghAANAaBwAAAANQZqsNExDP/6plgAMuCEAA0BoHCEAA0BoHAAAAAtBnspFFSwr/wAI+SEAA0BoHAAAAAkBnulEJ/8ACyghAANAaBwhAANAaBwAAAAJAZ7rRCf/AAsoIQADQGgcAAAADUGa8DRMQz/+qZYADLkhAANAaBwhAANAaBwAAAALQZ8ORRUsK/8ACPkhAANAaBwAAAAJAZ8tRCf/AAspIQADQGgcIQADQGgcAAAACQGfL0Qn/wALKCEAA0BoHAAAAA1BmzQ0TEM//qmWAAy4IQADQGgcAAAAC0GfUkUVLCv/AAj5IQADQGgcIQADQGgcAAAACQGfcUQn/wALKCEAA0BoHAAAAAkBn3NEJ/8ACyghAANAaBwhAANAaBwAAAANQZt4NExC//6plgAMuSEAA0BoHAAAAAtBn5ZFFSwr/wAI+CEAA0BoHCEAA0BoHAAAAAkBn7VEJ/8ACykhAANAaBwAAAAJAZ+3RCf/AAspIQADQGgcAAAADUGbuzRMQn/+nhAAYsAhAANAaBwhAANAaBwAAAAJQZ/aQhP/AAspIQADQGgcAAAACQGf+UQn/wALKCEAA0BoHCEAA0BoHCEAA0BoHCEAA0BoHCEAA0BoHCEAA0BoHAAACiFtb292AAAAbG12aGQAAAAA1YCCX9WAgl8AAAPoAAAH/AABAAABAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADAAAAGGlvZHMAAAAAEICAgAcAT////v7/AAAF+XRyYWsAAABcdGtoZAAAAAPVgIJf1YCCXwAAAAEAAAAAAAAH0AAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAEAAAAAAygAAAMoAAAAAACRlZHRzAAAAHGVsc3QAAAAAAAAAAQAAB9AAABdwAAEAAAAABXFtZGlhAAAAIG1kaGQAAAAA1YCCX9WAgl8AAV+QAAK/IFXEAAAAAAAtaGRscgAAAAAAAAAAdmlkZQAAAAAAAAAAAAAAAFZpZGVvSGFuZGxlcgAAAAUcbWluZgAAABR2bWhkAAAAAQAAAAAAAAAAAAAAJGRpbmYAAAAcZHJlZgAAAAAAAAABAAAADHVybCAAAAABAAAE3HN0YmwAAACYc3RzZAAAAAAAAAABAAAAiGF2YzEAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAygDKAEgAAABIAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAY//8AAAAyYXZjQwFNQCj/4QAbZ01AKOyho3ySTUBAQFAAAAMAEAAr8gDxgxlgAQAEaO+G8gAAABhzdHRzAAAAAAAAAAEAAAA8AAALuAAAABRzdHNzAAAAAAAAAAEAAAABAAAB8GN0dHMAAAAAAAAAPAAAAAEAABdwAAAAAQAAOpgAAAABAAAXcAAAAAEAAAAAAAAAAQAAC7gAAAABAAA6mAAAAAEAABdwAAAAAQAAAAAAAAABAAALuAAAAAEAADqYAAAAAQAAF3AAAAABAAAAAAAAAAEAAAu4AAAAAQAAOpgAAAABAAAXcAAAAAEAAAAAAAAAAQAAC7gAAAABAAA6mAAAAAEAABdwAAAAAQAAAAAAAAABAAALuAAAAAEAADqYAAAAAQAAF3AAAAABAAAAAAAAAAEAAAu4AAAAAQAAOpgAAAABAAAXcAAAAAEAAAAAAAAAAQAAC7gAAAABAAA6mAAAAAEAABdwAAAAAQAAAAAAAAABAAALuAAAAAEAADqYAAAAAQAAF3AAAAABAAAAAAAAAAEAAAu4AAAAAQAAOpgAAAABAAAXcAAAAAEAAAAAAAAAAQAAC7gAAAABAAA6mAAAAAEAABdwAAAAAQAAAAAAAAABAAALuAAAAAEAADqYAAAAAQAAF3AAAAABAAAAAAAAAAEAAAu4AAAAAQAAOpgAAAABAAAXcAAAAAEAAAAAAAAAAQAAC7gAAAABAAA6mAAAAAEAABdwAAAAAQAAAAAAAAABAAALuAAAAAEAAC7gAAAAAQAAF3AAAAABAAAAAAAAABxzdHNjAAAAAAAAAAEAAAABAAAAAQAAAAEAAAEEc3RzegAAAAAAAAAAAAAAPAAAAzQAAAAQAAAADQAAAA0AAAANAAAAEQAAAA8AAAANAAAADQAAABEAAAAPAAAADQAAAA0AAAARAAAADwAAAA0AAAANAAAAEQAAAA8AAAANAAAADQAAABEAAAAPAAAADQAAAA0AAAARAAAADwAAAA0AAAANAAAAEQAAAA8AAAANAAAADQAAABEAAAAPAAAADQAAAA0AAAARAAAADwAAAA0AAAANAAAAEQAAAA8AAAANAAAADQAAABEAAAAPAAAADQAAAA0AAAARAAAADwAAAA0AAAANAAAAEQAAAA8AAAANAAAADQAAABEAAAANAAAADQAAAQBzdGNvAAAAAAAAADwAAAAwAAADZAAAA3QAAAONAAADoAAAA7kAAAPQAAAD6wAAA/4AAAQXAAAELgAABEMAAARcAAAEbwAABIwAAAShAAAEugAABM0AAATkAAAE/wAABRIAAAUrAAAFQgAABV0AAAVwAAAFiQAABaAAAAW1AAAFzgAABeEAAAX+AAAGEwAABiwAAAY/AAAGVgAABnEAAAaEAAAGnQAABrQAAAbPAAAG4gAABvUAAAcSAAAHJwAAB0AAAAdTAAAHcAAAB4UAAAeeAAAHsQAAB8gAAAfjAAAH9gAACA8AAAgmAAAIQQAACFQAAAhnAAAIhAAACJcAAAMsdHJhawAAAFx0a2hkAAAAA9WAgl/VgIJfAAAAAgAAAAAAAAf8AAAAAAAAAAAAAAABAQAAAAABAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAACsm1kaWEAAAAgbWRoZAAAAADVgIJf1YCCXwAArEQAAWAAVcQAAAAAACdoZGxyAAAAAAAAAABzb3VuAAAAAAAAAAAAAAAAU3RlcmVvAAAAAmNtaW5mAAAAEHNtaGQAAAAAAAAAAAAAACRkaW5mAAAAHGRyZWYAAAAAAAAAAQAAAAx1cmwgAAAAAQAAAidzdGJsAAAAZ3N0c2QAAAAAAAAAAQAAAFdtcDRhAAAAAAAAAAEAAAAAAAAAAAACABAAAAAArEQAAAAAADNlc2RzAAAAAAOAgIAiAAIABICAgBRAFQAAAAADDUAAAAAABYCAgAISEAaAgIABAgAAABhzdHRzAAAAAAAAAAEAAABYAAAEAAAAABxzdHNjAAAAAAAAAAEAAAABAAAAAQAAAAEAAAAUc3RzegAAAAAAAAAGAAAAWAAAAXBzdGNvAAAAAAAAAFgAAAOBAAADhwAAA5oAAAOtAAADswAAA8oAAAPfAAAD5QAAA/gAAAQLAAAEEQAABCgAAAQ9AAAEUAAABFYAAARpAAAEgAAABIYAAASbAAAErgAABLQAAATHAAAE3gAABPMAAAT5AAAFDAAABR8AAAUlAAAFPAAABVEAAAVXAAAFagAABX0AAAWDAAAFmgAABa8AAAXCAAAFyAAABdsAAAXyAAAF+AAABg0AAAYgAAAGJgAABjkAAAZQAAAGZQAABmsAAAZ+AAAGkQAABpcAAAauAAAGwwAABskAAAbcAAAG7wAABwYAAAcMAAAHIQAABzQAAAc6AAAHTQAAB2QAAAdqAAAHfwAAB5IAAAeYAAAHqwAAB8IAAAfXAAAH3QAAB/AAAAgDAAAICQAACCAAAAg1AAAIOwAACE4AAAhhAAAIeAAACH4AAAiRAAAIpAAACKoAAAiwAAAItgAACLwAAAjCAAAAFnVkdGEAAAAObmFtZVN0ZXJlbwAAAHB1ZHRhAAAAaG1ldGEAAAAAAAAAIWhkbHIAAAAAAAAAAG1kaXJhcHBsAAAAAAAAAAAAAAAAO2lsc3QAAAAzqXRvbwAAACtkYXRhAAAAAQAAAABIYW5kQnJha2UgMC4xMC4yIDIwMTUwNjExMDA=';

      /***/
    }])
  );
});

function enableNoSleep() {
  noSleep.enable();
  document.removeEventListener('touchstart', enableNoSleep, false);
}

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
let sqrChaos = chaos * chaos;

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

let keyboard = new Keyboard('keyboard', 3, 800, 200);

let intervals = [];

let intervalParams = {
  'nbOfTimePlayed': 3,
  'timeBetweenRepetitions': 3,
  'timeBetweenNotes': 0.9,
  'noteDuration': 1.5,
  'talk': true,
  'order': 'both'
};

let seed = Math.random(100);
let debug = true;
let displayOsc = false;
let pause = true;
let aug4ToTritone = true;
let changedPreset = false;
let locked = true;
let playing = false;

let noSleep;
let globalMessage;

$(document).ready(function () {
  const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  window.AudioContext = window.AudioContext || window.webkitAudioContext;

  if (iOS) {
    window.addEventListener("touchend", iosHandler, false);
  }

  noSleep = new NoSleep();
  document.addEventListener('touchstart', enableNoSleep, false);
  keyboard.start();

  resetAndConnectContext();
  instr = new Instrument(context);

  if (displayOsc) {
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
    if (!$('.dropdown-toggle').is(e.target) && $('.dropdown-toggle').has(e.target).length === 0 && $('.open').has(e.target).length === 0) {
      $('.dropdown-toggle').removeClass('open');
    }
  });
});

function iosHandler(e) {
  if (locked) {
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
function start() {
  if (pause) {
    document.addEventListener('touchstart', enableNoSleep, false);
    pause = false;
    $('.start').text('Stop');

    getUserParams();
    if (changedPreset) {
      changePreset();
      changedPreset = false;
    }

    if (!playing) {
      playRandomInterval();
      playing = true;
    }
  } else {
    pause = true;
    $('.start').text('Start');
    noSleep.disable();
  }
}
function allNone() {
  let checked = $("#allNone").is(":checked");

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

  getUserParams();
}
function getUserParams() {
  intervalParams['nbOfTimePlayed'] = parseFloat($("#nbOfTimePlayed").val());
  intervalParams['timeBetweenRepetitions'] = parseFloat($("#timeBetweenRepetitions").val());
  intervalParams['timeBetweenNotes'] = parseFloat($("#timeBetweenNotes").val());
  intervalParams['noteDuration'] = parseFloat($("#noteDuration").val());
  intervalParams['order'] = $("#order").val();

  intervalParams['talk'] = $("#talk").is(":checked");
  intervals = [];

  if ($("#unison").is(":checked")) intervals.push('P1');
  if ($("#minorSecond").is(":checked")) intervals.push('m2');
  if ($("#majorSecond").is(":checked")) intervals.push('M2');
  if ($("#minorThird").is(":checked")) intervals.push('m3');
  if ($("#majorThird").is(":checked")) intervals.push('M3');
  if ($("#perfectFourth").is(":checked")) intervals.push('P4');
  if ($("#tritone").is(":checked")) intervals.push('A4');
  if ($("#perfectFifth").is(":checked")) intervals.push('P5');
  if ($("#minorSixth").is(":checked")) intervals.push('m6');
  if ($("#majorSixth").is(":checked")) intervals.push('M6');
  if ($("#minorSeventh").is(":checked")) intervals.push('m7');
  if ($("#majorSeventh").is(":checked")) intervals.push('M7');
  if ($("#octave").is(":checked")) intervals.push('P8');
  if ($("#minorNinth").is(":checked")) intervals.push('m9');
  if ($("#majorNinth").is(":checked")) intervals.push('M9');
  if ($("#minorTenth").is(":checked")) intervals.push('m10');
  if ($("#majorTenth").is(":checked")) intervals.push('M10');
  if ($("#perfectEleventh").is(":checked")) intervals.push('P11');
  if ($("#octaveTritone").is(":checked")) intervals.push('A11');
  if ($("#perfectTwelfth").is(":checked")) intervals.push('P12');
  if ($("#minorThirteenth").is(":checked")) intervals.push('m13');
  if ($("#majorThirteenth").is(":checked")) intervals.push('M13');
  if ($("#minorFourteenth").is(":checked")) intervals.push('m14');
  if ($("#majorFourteenth").is(":checked")) intervals.push('M14');
  if ($("#doubleOctave").is(":checked")) intervals.push('P15');
}
function speak(message, time) {
  if (pause) return;
  if (aug4ToTritone && message == 'augmented fourth') message = 'tritone';
  if (aug4ToTritone && message == 'augmented eleventh') message = 'octave tritone';

  globalMessage = message;
  
  //msg.lang = 'en-US';
  setTimeout(function () {
    if (pause) return;
    
    $('#trigger_me').trigger('click')},time);
    //window.speechSynthesis.speak(msg)}, time);
}
function speech_text() {
  var msg = new SpeechSynthesisUtterance(globalMessage);
  msg.lang = 'en-US';
  window.speechSynthesis.speak(msg);
}

function playRandomInterval() {
  if (pause) return;
  if (intervals.length == 0) return;

  let nbOfTimePlayed = intervalParams['nbOfTimePlayed'];
  let timeBetweenNotes = intervalParams['timeBetweenNotes'];
  let timeBetweenRepetitions = intervalParams['timeBetweenRepetitions'];

  let noteDuration = intervalParams['noteDuration'];
  let talk = intervalParams['talk'];

  let note1 = getRandomNoteFull();
  let order = intervalParams['order'];
  if (intervalParams['order'] == 'both') order = Math.random() < 0.5 ? 'ascending' : 'descending';

  //returns [note1, note2, intervalText]
  let note1PlusInterval = getNoteFromInterval(note1, pickRandomArray(intervals), order);

  instr.playNotesWithRepeat(note1PlusInterval.slice(0, 2), context.currentTime, noteDuration, timeBetweenNotes, nbOfTimePlayed, timeBetweenRepetitions);
  let t = nbOfTimePlayed * (timeBetweenNotes + timeBetweenRepetitions) * 1000;

  if (talk) {
    speak(note1PlusInterval[2], t);
  }

  setTimeout(function () {
    playing = false;
    playRandomInterval(intervalParams);
  }, t + 3000);
}
function resetAndConnectContext() {
  if (context) context.close();
  context = new AudioContext();

  mixNode = context.createGain();
  mixNode.gain.value = 1;

  compressor = context.createDynamicsCompressor();
  compressor.threshold.value = compressorThreshold;
  compressor.attack.value = 0;

  mixNode.connect(compressor);
  compressor.connect(context.destination);
}
function randomize() {
  resetAndConnectContext();
  instr = new Instrument(context);
  instr.randomize();
  if (displayOsc) initOsc();
}
function changePreset() {
  let preset = parseInt($("#synthPreset").val());
  instr.changePreset(preset);
  changedPreset = true;
}
function initCanvas() {
  canvas = $('<canvas width="' + oscWidth + '" height="' + oscHeight + '"></canvas>');
  $('#osc').append(canvas);
  if (typeof G_vmlCanvasManager !== 'undefined') G_vmlCanvasManager.initElement(canvas[0]);
}
function initOsc() {
  if (!scope) {
    initCanvas();

    scope = new Oscilloscope(context, canvas[0]);
    var slider = document.querySelector('#min');
    var label = document.querySelector('#label');

    slider.value = scope.sensitivity;
    label.textContent = ~~scope.sensitivity;
    slider.addEventListener('input', function () {
      scope.sensitivity = slider.value;
      label.textContent = slider.value;
    }, false);
  } else scope.reset(context);
  mixNode.connect(scope.input);
  scope.start();
}

///INSTRUMENTS///
function Instrument(context) {
  this.context = context;
  this.oscillators = [];
  this.noises = [];

  //Default params
  this.oscillatorsParams = [{ wave: 'sine', detune: 0 }];
  this.noisesParams = [];
  this.envelopeParams = { peakLevel: 0.8,
    sustainLevel: 0.3,
    attackTime: 0.08,
    decayTime: 0.05,
    releaseTime: 0.1,
    sustainTime: 0.05 };

  this.instrGainNode = this.context.createGain();
  this.instrGainNode.gain.value = 0.85;

  this.filter = this.context.createBiquadFilter();
  this.filter.type = 'lowpass';
  this.filter.frequency.value = 20000;

  this.distortion = this.context.createWaveShaper();

  //hard coded pseudo limiter
  this.compressor = this.context.createDynamicsCompressor();
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
  this.voices = [];
  for (let i = 0; i < 8; i++) {
    this.voices.push(new Voice(this.context, i + 1, this.oscillatorsParams, this.noisesParams, this.envelopeParams, this.instrGainNode, this.filter));
  }
}
//Takes input params and create osc list
Instrument.prototype.setOscillators = function () {
  let args = Array.prototype.slice.call(arguments);
  let osc = this.oscillatorsParams;
  args.forEach(function (a) {
    osc.push(a);
  });
  this.oscillatorsParams = osc;
};
//Takes input params and create noise list
Instrument.prototype.setNoises = function () {
  let args = Array.prototype.slice.call(arguments);
  let noise = this.noisesParams;
  args.forEach(function (a) {
    noise.push(a);
  });
  this.noisesParams = noise;
};
//Takes input params and set instrument params
Instrument.prototype.setEnvelope = function (peak, sustain, a, d, r, s) {
  this.envelopeParams.peakLevel = peak || 0.3;
  this.envelopeParams.sustainLevel = sustain || 0.1;
  this.envelopeParams.attackTime = a || 0.5;
  this.envelopeParams.decayTime = d || 0.5;
  this.envelopeParams.releaseTime = r || 0.5;
  this.envelopeParams.sustainTime = s || 0.5;
};
//Takes input params and set instrument params
Instrument.prototype.setFilter = function (type, freq, detune, Q, gain) {
  this.filter.type = type;
  this.filter.frequency.value = freq;
  this.filter.Q.value = Q;
  this.filter.detune.value = detune;
  this.filter.gain.value = gain;
};
//Takes input params and set instrument params
Instrument.prototype.setDistortion = function (amount) {
  if (amount === 0) return;
  let k = typeof amount === 'number' ? amount : 50,
      n_samples = 44100,
      curve = new Float32Array(n_samples),
      deg = Math.PI / 180,
      i = 0,
      x;
  for (; i < n_samples; ++i) {
    x = i * 2 / n_samples - 1;
    curve[i] = (3 + k) * x * 20 * deg / (Math.PI + k * Math.abs(x));
  }

  this.distortion.curve = curve;
};
Instrument.prototype.randomize = function () {
  let limit = false;
  let nbOsc = getRandomInt(1, baseOscNumber + sqrChaos * baseOscNumber);
  let distortion = getRandomFloat(0.0, sqrChaos / 10);
  let peakLevel = getRandomFloat(0.04, 0.06 + sqrChaos / 5);
  let sustainLevel = getRandomFloat(0.04, 0.06 + sqrChaos / 5);
  let attack = getRandomFloat(0, 0.5 + sqrChaos * 3);
  let decay = getRandomFloat(0, 0.5 + sqrChaos * 3);
  let release = getRandomFloat(0, 1.5 + sqrChaos * 3);
  let sustain = getRandomFloat(0, 0.1 + sqrChaos * 3);

  let filterType = getRandomFilter();
  let filterFreq = getRandomInt(200, 10000);
  //highpass has a tendency to lower the volume a lot. We will limit and level later
  if (filterType == 'highpass') {
    filterFreq = getRandomInt(200, 4000);
    limit = true;
  }

  let filterDetune = getRandomInt(-sqrChaos * 10, sqrChaos * 10);
  let Q = getRandomFloat(0, 1) * sqrChaos;
  let gain = getRandomFloat(0, 1) * sqrChaos;

  let noiseType = getRandomNoise();
  let noiseFilterType = getRandomFilter();
  let noiseFilterCutoff = getRandomInt(200, 10000);
  let noiseFilterVolume = getRandomFloat(0.5, 5) * sqrChaos;

  this.setDistortion(distortion);

  this.setEnvelope(peakLevel, sustainLevel, attack, decay, release, sustain);
  this.setFilter(filterType, filterFreq, filterDetune, Q, gain);
  this.setNoises({ type: noiseType, filterType: noiseFilterType, cutoff: noiseFilterCutoff, volume: noiseFilterVolume });
  if (limit) this.createLimiter();
  for (let i = 0; i < nbOsc; i++) {
    let wave = getRandomWave();
    //beautiful
    let detune = getRandomInt(-baseDetune - sqrChaos * sqrChaos * sqrChaos * sqrChaos * 10, sqrChaos * sqrChaos * sqrChaos * sqrChaos * 10 + baseDetune);
    this.setOscillators({ wave: wave, detune: detune });
  }
};
//Compresses and raises the gain by a fixed value
Instrument.prototype.createLimiter = function () {
  this.limiter.threshold.value = -24;
  this.limiter.knee.value = 0.0;
  this.limiter.ratio.value = 20.0;
  this.limiter.attack.value = 0.005;
  this.limiter.release.value = 0.050;
  this.instrGainNode.gain.value += 0.15;

  this.filter.connect(this.limiter);
  this.limiter.connect(this.distortion);
};
//notes arg can be a single note or array, either written as a frequency, or string 'C#4'
Instrument.prototype.playNotes = function (notes, time, duration, timeBetweenNotes) {
  if (!Array.isArray(notes)) notes = [notes];

  for (let i = 0; i < notes.length; i++) {
    this.voices[i].playWithSetDuration(notes[i], time + i * timeBetweenNotes, duration);
  }
};
Instrument.prototype.playNotesWithRepeat = function (notes, time, duration, timeBetweenNotes, repeat, intervalBetweenRepeat) {
  for (let i = 0; i < repeat; i++) {
    this.playNotes(notes, time + i * (intervalBetweenRepeat + timeBetweenNotes), duration, timeBetweenNotes);
  }
};
Instrument.prototype.changePreset = function (nb) {
  this.noisesParams = [];
  this.envelopeParams = { peakLevel: 0.8,
    sustainLevel: 0.3,
    attackTime: 0.08,
    decayTime: 0.05,
    releaseTime: 0.1,
    sustainTime: 0.05 };
  this.filter = this.context.createBiquadFilter();
  this.filter.type = 'lowpass';
  this.filter.frequency.value = 20000;
  this.distortion = this.context.createWaveShaper();
  this.filter.connect(this.distortion);
  this.distortion.connect(this.compressor);
  this.compressor.connect(this.instrGainNode);
  this.instrGainNode.connect(mixNode);

  switch (nb) {
    case 1:
      {
        this.oscillatorsParams = [{ wave: 'sine', detune: 0 }];
        this.instrGainNode.gain.value = 0.85;
        break;
      }
    case 2:
      {
        this.oscillatorsParams = [{ wave: 'sine', detune: 0 }, { wave: 'square', detune: 0 }, { wave: 'sine', detune: 0 }, { wave: 'sine', detune: 0 }];
        this.instrGainNode.gain.value = 0.5;
        break;
      }
  }

  this.voices = [];
  for (let i = 0; i < 8; i++) {
    this.voices.push(new Voice(this.context, i + 1, this.oscillatorsParams, this.noisesParams, this.envelopeParams, this.instrGainNode, this.filter));
  }
};

///VOICES///
function Voice(context, number, oscillatorsParams, noisesParams, envelopeParams, instrGainNode, filter) {
  this.name = "empty";
  this.number = number;
  this.status = "notPlaying";
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
Voice.prototype.start = function (freq, time) {
  let f = freq;
  if (!isNumber(freq)) f = getFrequency(freq);

  this.gainNode.gain.cancelScheduledValues(time);

  this.gainNode.gain.exponentialRampToValueAtTime(0.001, time);
  this.gainNode.gain.setValueAtTime(0, time);

  this.oscillators = [];
  this.noises = [];

  this.oscillatorsParams.forEach(o => {
    let osc = this.createOsc(o.wave, f + o.detune, this.gainNode);
    this.oscillators.push(osc);
    osc.start(time);
  });

  this.noisesParams.forEach(n => {
    let noise = this.createNoise(n.type, n.filterType, n.cutoff, n.volume, this.gainNode);
    this.noises.push(noise);
    noise.start(time);
  });

  this.gainNode.gain.linearRampToValueAtTime(this.envelopeParams.peakLevel, time + this.envelopeParams.attackTime);
  this.gainNode.gain.setValueAtTime(this.envelopeParams.peakLevel, time + this.envelopeParams.attackTime);

  this.gainNode.gain.linearRampToValueAtTime(this.envelopeParams.sustainLevel, time + this.envelopeParams.attackTime + this.envelopeParams.decayTime);
  this.gainNode.gain.setValueAtTime(this.envelopeParams.sustainLevel, time + this.envelopeParams.attackTime + this.envelopeParams.decayTime);

  let nb = this.number;

  //setTimeout(function () {
  //    console.log("playing: " + freq + " on voice " + nb)
  //}, (time-context.currentTime)*1000);
};
Voice.prototype.stop = function (time) {

  let t = time + this.envelopeParams.releaseTime;
  //this.gainNode.gain.setValueAtTime(this.envelopeParams.sustainLevel,time + this.envelopeParams.sustainTime);
  this.gainNode.gain.exponentialRampToValueAtTime(0.001, t);

  this.oscillators.forEach(o => {
    o.stop(t);
  });
  this.noises.forEach(n => {
    n.stop(t);
  });
};
Voice.prototype.playWithSetDuration = function (freq, time, duration) {
  this.start(freq, time);
  this.stop(time + duration);
};
//Helper to create and connect an osc 
Voice.prototype.createOsc = function (wave, freq, gainNode) {
  let source = this.context.createOscillator();
  source.frequency.value = freq;
  source.type = wave;
  source.connect(gainNode);
  return source;
};
//Helper to create and connect a noise
Voice.prototype.createNoise = function (type, filterType, cutoff, volume, gainNode) {
  let bufferSize = 2 * this.context.sampleRate;
  let buffer = this.context.createBuffer(1, bufferSize, this.context.sampleRate);
  let data = buffer.getChannelData(0);
  if (type == 'white') data = createWhiteNoise(data, volume);else if (type == 'pink') data = createPinkNoise(data, volume);else if (type == 'brownian') data = createBrownianNoise(data, volume);
  let source = this.context.createBufferSource();
  source.loop = true;
  source.buffer = buffer;

  let filter = this.context.createBiquadFilter();
  filter.type = filterType;
  filter.frequency.value = cutoff;

  source.connect(filter);
  filter.connect(gainNode);
  return source;
};

///INTERVALS///
let notesOrder = {
  'Cb': -1,
  'C': 0,
  'C#': 1,
  'Db': 1,
  'D': 2,
  'D#': 3,
  'Eb': 3,
  'E': 4,
  'E#': 5,
  'Fb': 4,
  'F': 5,
  'F#': 6,
  'Gb': 6,
  'G': 7,
  'G#': 8,
  'Ab': 8,
  'A': 9,
  'A#': 10,
  'Bb': 10,
  'B': 11,
  'B#': 12
};
let wholeNotesOrder = {
  'C': 1,
  'D': 2,
  'E': 3,
  'F': 4,
  'G': 5,
  'A': 6,
  'B': 7
};
let qualityDict = {
  m: "minor",
  M: "major",
  P: "perfect",
  A: "augmented",
  d: "diminished"
};
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
  15: "fifteenth"
};
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
};
function getIntervalInSemitones(note1, note2) {
  let oct1 = note1.slice(-1);
  let rootNote1 = note1.slice(0, -1);

  let oct2 = note2.slice(-1);
  let rootNote2 = note2.slice(0, -1);

  let diff = notesOrder[rootNote2] - notesOrder[rootNote1] + (oct2 - oct1) * 12;
  return diff;
}
function getIntervalNumber(note1, note2) {
  let oct1 = note1.slice(-1);
  let rootNote1 = note1.slice(0, 1);

  let oct2 = note2.slice(-1);
  let rootNote2 = note2.slice(0, 1);

  let diff = wholeNotesOrder[rootNote2] - wholeNotesOrder[rootNote1] + 1 + (oct2 - oct1) * 7;

  if (oct2 > oct1 || oct2 == oct1 && wholeNotesOrder[rootNote2] >= wholeNotesOrder[rootNote1]) return diff;else return 2 - diff;
}
function getIntervalQuality(note1, note2) {
  let oct1 = note1.slice(-1);
  let rootNote1 = note1.slice(0, -1);

  let oct2 = note2.slice(-1);
  let rootNote2 = note2.slice(0, -1);

  let nb = Math.abs(getIntervalNumber(note1, note2));
  let semitones = Math.abs(getIntervalInSemitones(note1, note2));
  let quality;

  switch (semitones) {
    case 0:
      if (nb == 1) quality = 'P';else if (nb == 2) quality = 'd';
      break;
    case 1:
      if (nb == 1) quality = 'A';else if (nb == 2) quality = 'm';
      break;
    case 2:
      if (nb == 2) quality = 'M';else if (nb == 3) quality = 'd';
      break;
    case 3:
      if (nb == 2) quality = 'A';else if (nb == 3) quality = 'm';
      break;
    case 4:
      if (nb == 3) quality = 'M';else if (nb == 4) quality = 'd';
      break;
    case 5:
      if (nb == 3) quality = 'A';else if (nb == 4) quality = 'P';
      break;
    case 6:
      if (nb == 4) quality = 'A';else if (nb == 5) quality = 'd';
      break;
    case 7:
      if (nb == 5) quality = 'P';else if (nb == 6) quality = 'd';
      break;
    case 8:
      if (nb == 5) quality = 'A';else if (nb == 6) quality = 'm';
      break;
    case 9:
      if (nb == 7) quality = 'd';else if (nb == 6) quality = 'M';
      break;
    case 10:
      if (nb == 7) quality = 'm';else if (nb == 6) quality = 'A';
      break;
    case 11:
      if (nb == 7) quality = 'M';else if (nb == 8) quality = 'd';
      break;
    case 12:
      if (nb == 8) quality = 'P';else if (nb == 7) quality = 'A';else if (nb == 9) quality = 'd';
      break;
    case 13:
      if (nb == 8) quality = 'A';else if (nb == 9) quality = 'm';
      break;
    case 14:
      if (nb == 9) quality = 'M';else if (nb == 10) quality = 'd';
      break;
    case 15:
      if (nb == 9) quality = 'A';else if (nb == 10) quality = 'm';
      break;
    case 16:
      if (nb == 10) quality = 'M';else if (nb == 11) quality = 'd';
      break;
    case 17:
      if (nb == 10) quality = 'A';else if (nb == 11) quality = 'P';
      break;
    case 18:
      if (nb == 11) quality = 'A';else if (nb == 12) quality = 'd';
      break;
    case 19:
      if (nb == 12) quality = 'P';else if (nb == 6) quality = '13';
      break;
    case 20:
      if (nb == 12) quality = 'A';else if (nb == 13) quality = 'm';
      break;
    case 21:
      if (nb == 14) quality = 'd';else if (nb == 13) quality = 'M';
      break;
    case 22:
      if (nb == 14) quality = 'm';else if (nb == 13) quality = 'A';
      break;
    case 23:
      if (nb == 14) quality = 'M';else if (nb == 15) quality = 'd';
      break;
    case 24:
      if (nb == 48) quality = 'P';else if (nb == 14) quality = 'A';
      break;
  }
  return quality;
}
function getIntervalOrdern(note1, note2) {
  let interval = getIntervalInSemitones(note1, note2);
  if (interval > 0) return 'ascending';else if (interval < 0) return 'descending';else return '';
}
function displayInterval(n1, n2) {

  let order = getIntervalOrder(n1, n2);
  let quality = getIntervalQuality(n1, n2);
  let number = getIntervalNumber(n1, n2);

  let qualityText = qualityDict[quality];
  let numberText = numberDict[number];

  if (debug) {
    console.log("Notes : " + n1 + " - " + n2);
    console.log("Distance : " + getIntervalInSemitones(n1, n2) + " semitones");
    console.log("Interval : " + order + " " + qualityText + " " + numberText);
  }

  return [getIntervalInSemitones(n1, n2), quality, number];
}
function getNoteFromInterval(note, interval, intervalOrder) {
  let oct = parseInt(note.slice(-1));
  let rootNote = note.slice(0, -1);

  let intervalNumber = parseInt(interval.substring(1));
  let intervalQuality = interval.substring(0, 1);

  let order = intervalOrder == "ascending" ? 1 : -1;

  let resultNote = (wholeNotesOrder[rootNote.substring(0, 1)] + order * (intervalNumber - 1)) % 7;

  if (resultNote == 0) resultNote = 7;
  if (resultNote < 0) resultNote += 7;

  let resultNoteName = getKeyByValue(wholeNotesOrder, resultNote);

  let semitones = order * intervalsDict[interval];

  let resultOctave = oct;

  while (semitones > 12) {
    resultOctave += 1;
    semitones -= 12;
  }
  while (semitones < -12) {
    resultOctave -= 1;
    semitones += 12;
  }
  if (semitones == 12) resultOctave += 1;
  if (semitones == -12) resultOctave -= 1;

  let diffFromNames = (notesOrder[resultNoteName] - notesOrder[rootNote]) * order;

  if (diffFromNames < 0 || Math.sign(diffFromNames) == -0) {
    diffFromNames += 12;
    resultOctave += order * 1;

    //horrible
    if ((intervalNumber == 1 || intervalNumber == 8 || intervalNumber == 15) && intervalQuality != 'd') resultOctave -= 1 * order;
    if ((intervalNumber == 7 || intervalNumber == 14) && intervalQuality == 'A') resultOctave -= 1 * order;
  }

  let d = order * diffFromNames - semitones;
  if (d > 2) d -= 12;
  if (d < -2) d += 12;

  let mod = '';
  if (d == 1) mod = 'b';
  if (d == -1) mod = '#';

  if (d == 2) mod = 'bb';
  if (d == -2) mod = '##';

  //looking for triple alteration - start again with a new root note (ex G# doest have a D2 but F# does)
  if (d >= 3 || d <= -3) {
    console.log('Can not build a ' + intervalOrder + ' ' + interval + " on " + note + '. Picking a new random note');
    return getNoteFromInterval(getRandomNoteFull(), interval, intervalOrder);
  }

  let result = resultNoteName + mod + resultOctave;

  let qualityText = qualityDict[intervalQuality];
  let numberText = numberDict[intervalNumber];
  if (interval == "P1" || interval == "d2") intervalOrder = '';

  let answer = qualityText + " " + numberText;

  if (debug) {
    console.log("Notes : " + note + " - " + result);
    console.log("Distance : " + order * intervalsDict[interval] + " semitones");
    console.log("Interval : " + intervalOrder + " " + answer);
  }

  return [note, result, answer];
}

///KEYBOARD
let mouseIsDown = false;
let playedColor = '#ecec71';
let keyboardMap = {};
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
  'Ý': "F#4"
};

function Keyboard(divID, octaves, width, height) {
  this.divID = divID;
  this.octaves = octaves;
  this.width = width;
  this.noteWidth = width / (octaves * 7);
  this.noteHeight = height;
}
Keyboard.prototype.start = function () {
  let self = this;
  let div = '#' + this.divID;
  $(div).addClass('ckeyboard');

  $(div).append('<ul style=" list-style-type: none;position: relative;" ondragstart="return false;" ondrop="return false;"></ul>');
  let id = 0;
  for (let i = 0; i < this.octaves * 7; i++) {
    $(div + " ul").append('<li>' + this.createNote('white', this.noteWidth * i, id) + '</li>');
    id++;
    if (i % 7 != 2 && i % 7 != 6) {
      $(div + " ul").append('<li>' + this.createNote('black', this.noteWidth * i + this.noteWidth / 3 * 2, id) + '</li>');
      id++;
    }
  }
  let startNote = 'C3';
  keyboardMap[0] = startNote;
  for (let i = 1; i < this.octaves * 13; i++) {
    keyboardMap[i] = getNextNote(startNote);
    startNote = keyboardMap[i];
  }

  $(".ckeyboard .note").mousedown(function () {
    let id = $(this).attr('id');
    mouseIsDown = true;
    self.pressNote(id);
  });
  $(".ckeyboard .note").mouseup(function () {
    let id = $(this).attr('id');
    self.releaseNote(id);
  });
  $(".ckeyboard .note").mouseenter(function () {
    if (!mouseIsDown) return;
    let id = $(this).attr('id');
    self.pressNote(id);
  });
  $(".ckeyboard .note").mouseleave(function () {
    if (!mouseIsDown) return;
    if ($(this).hasClass('played')) {
      let id = $(this).attr('id');
      self.releaseNote(id);
    }
  });
  $(document).mouseup(function () {
    mouseIsDown = false;
  });
  document.onkeydown = function (evt) {
    keyPressed = evt.keyCode || window.event;
    if (keyPressed in keysDown) return;
    keysDown[keyPressed] = true;

    let pressed = String.fromCharCode(keyPressed);

    keyboard.pressNote(getKeyByValue(keyboardMap, keysMap[pressed]));
  };
  document.onkeyup = function (evt) {
    keyPressed = evt.keyCode || window.event;

    delete keysDown[keyPressed];

    let pressed = String.fromCharCode(keyPressed);
    if (!(pressed in keysMap)) return;
    keyboard.releaseNote(getKeyByValue(keyboardMap, keysMap[pressed]));
  };
};
Keyboard.prototype.createNote = function (color, position, id) {
  let w = color == 'white' ? this.noteWidth : this.noteWidth * 2 / 3;
  let h = color == 'white' ? this.noteHeight : this.noteHeight * 5.5 / 9;

  let classes = '"class="note ' + color + '"';
  let pos = 'position:absolute; left:' + position + 'px;';
  let width = 'width:' + w + 'px;';
  let height = 'height:' + h + 'px;';

  let styling = 'border: 1px solid black; background-color: ' + color + ';';
  let zIndex = color == 'black' ? 'z-index: 10;' : '';

  return '<div  id="' + id + classes + '" style = "' + pos + width + height + styling + zIndex + '"></div>';
};
Keyboard.prototype.pressNote = function (id) {
  if ("undefined" === typeof keyboardMap[id]) return;
  $('.ckeyboard #' + id).css('background-color', playedColor);
  $('.ckeyboard #' + id).addClass('played');

  let freq = getFrequency(keyboardMap[id]);
  now = context.currentTime;

  //find free voice if possible
  for (let i = 0; i < instr.voices.length; i++) {
    if (instr.voices[i].status == "notPlaying") {
      instr.voices[i].start(freq, now);
      instr.voices[i].status = "playing";
      instr.voices[i].name = freq;
      break;
    }
  }
};
Keyboard.prototype.releaseNote = function (id) {
  if ("undefined" === typeof keyboardMap[id]) return;
  let c = $('.ckeyboard #' + id).hasClass('white') ? 'white' : 'black';
  $('.ckeyboard #' + id).css('background-color', c);
  $('.ckeyboard #' + id).removeClass('played');

  let freq = getFrequency(keyboardMap[id]);
  now = context.currentTime;

  //find voice playing the released note
  for (let i = 0; i < instr.voices.length; i++) {
    if (instr.voices[i].status == "playing" && instr.voices[i].name == freq) {
      instr.voices[i].stop(now);
      instr.voices[i].status = "notPlaying";
      instr.voices[i].name = "empty";
      break;
    }
  }
};