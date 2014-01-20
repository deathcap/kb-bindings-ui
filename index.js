'use strict';

if (typeof window === 'undefined') return; // requires browser

var datgui = require('dat-gui');
var vkey = require('vkey');

module.exports = function(game, opts) {
  return new BindingsUI(game, opts);
};

module.exports.pluginInfo = {
  loadAfter: ['voxel-debug', 'voxel-plugins-ui'] // optional to load after and reuse same gui
};

function BindingsUI(game, opts) {
  this.game = game;

  opts = opts || {};

  this.kb = opts.kb || (game && game.buttons);
  if (!this.kb) throw 'kb-bindings-ui requires "kb" option set to kb-bindings instance, or voxel-engine game with kb-bindings for game.buttons';
  if (!this.kb.bindings) throw 'kb-bindings-ui "kb" option could not find kb-bindings\' bindings, not set to kb-bindings instance? (vs kb-controls)';
  this.gui = opts.gui || (game && game.plugins && game.plugins.get('voxel-debug') ? game.plugins.get('voxel-debug').gui : new datgui.GUI());
  this.hideKeys = opts.hideKeys || ['ime-', 'launch-', 'browser-']; // too long

  this.folder = this.gui.addFolder('keys');

  this.vkey2code = {};
  this.vkeyBracket2Bare = {};
  this.vkeyBare2Bracket = {};
  this.keyListing = [];
  for (var code in vkey) {
    var keyName = vkey[code];

    this.vkey2code[keyName] = code;

    var keyNameBare = keyName.replace('<', '').replace('>', '');
    this.vkeyBracket2Bare[keyName] = keyNameBare;
    this.vkeyBare2Bracket[keyNameBare] = keyName;

    if (!this.shouldHideKey(keyNameBare))
      this.keyListing.push(keyNameBare);
  }

  this.binding2Key = {};
  for (var key in this.kb.bindings) {
    var binding = this.kb.bindings[key];
    this.binding2Key[binding] = this.vkeyBracket2Bare[key];
    this.addBinding(binding);
  }
}

BindingsUI.prototype.shouldHideKey = function(name) {
  for (var i = 0; i < this.hideKeys.length; ++i) {
    if (name.indexOf(this.hideKeys[i]) === 0) return true;
  }
  return false;
};

BindingsUI.prototype.addBinding = function (binding) {
  var item = this.folder.add(this.binding2Key, binding, this.keyListing);

  item.onChange(updateBinding(this, binding));
};

function updateBinding(self, binding) {
  return function(newKeyNameBare) {
    //if (self.vkey2code[newKeyName] === undefined) // invalid vkey

    var newKeyName = self.vkeyBare2Bracket[newKeyNameBare];

    self.removeBindings(binding);

    self.kb.bindings[newKeyName] = binding;
  };
}

// remove all keys bound to given binding
BindingsUI.prototype.removeBindings = function(binding) {
  for (var key in this.kb.bindings) {
    var thisBinding = this.kb.bindings[key];
    if (thisBinding === binding) {
      delete this.kb.bindings[key];
    }
  }
};

