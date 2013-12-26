var createBindingsUI = require('./');
var createKb = require('kb-bindings');
var createInteract = require('interact');
var raf = require('raf');

var bindings = {
  // for demonstration purposes, based no voxel-engine defaultButtons
  'W': 'forward'
, 'A': 'left'
, 'S': 'backward'
, 'D': 'right'
, '<up>': 'forward'
, '<left>': 'left'
, '<down>': 'backward'
, '<right>': 'right'
, '<mouse 1>': 'fire'
, '<mouse 3>': 'firealt'
, '<space>': 'jump'
, '<shift>': 'crouch'
, '<control>': 'alt'
, '<tab>': 'sprint'

, 'X': 'alert1'
, 'C': 'alert2'
};

var buttons = createKb(document.body, bindings);
buttons.disable();

buttons.down.on('alert1', function() {
  alert('You pressed alert1! Try changing the key for this binding, then retest.');
});

buttons.up.on('alert2', function() {
  alert('Now you pressed alert2. This is an example event handler triggered on key *up* (versus alert1, triggered on down).');
});

// Since kb-bindings prevents default mouse/keyboard interaction, it blocks use of
// the kb-bindings-ui datgui controls. To get around this, only enable kb-bindings
// when we have pointer lock enabled (click to enter, escape to exit).
var element = document.createElement('plaintext');
var interact = createInteract(element);
interact.on('attain', function() {
  buttons.enable();
});

interact.on('release', function() {
  buttons.disable();
});

// Show the polled state on every frame

element.textContent = 'loading...';
document.body.appendChild(element);

raf(document.body).on('data', function(dt) {
  var s = 'Click here to acquire pointer lock (escape to release), then press buttons to test:\n\n';
  for (var key in buttons) {
    if (typeof buttons[key] !== 'number') continue; // skip reserved

    s += key + ': ' + buttons[key] + '\n';
  }
  element.textContent = s;
});

createBindingsUI(null, {kb: buttons});

