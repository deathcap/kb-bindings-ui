'use strict';

var vkey = require('vkey');
var createDatgui = require('dat-gui')

module.exports = function(game, opts) {
  return new BindingsUI(game, opts);
};

module.exports.pluginInfo = {
  loadAfter: ['voxel-debug', 'voxel-plugins-ui'], // optional to load after and reuse same gui
  clientOnly: true
};

function BindingsUI(game, opts) {
  this.game = game;

  opts = opts || {};

  this.kb = opts.kb || (game && game.buttons); // might be undefined

  // try to latch on to an existing datgui, otherwise make our own
  this.gui = opts.gui;
  if (!this.gui) {
    if (game && game.plugins) {
      if (game.plugins.get('voxel-debug')) this.gui = game.plugins.get('voxel-debug').gui;
      else if (game.plugins.get('voxel-plugins-ui')) this.gui = game.plugins.get('voxel-plugins-ui').gui;
    }
  }
  if (!this.gui) this.gui = new createDatgui.GUI();

  this.hideKeys = opts.hideKeys || ['ime-', 'launch-', 'browser-']; // too long
  this.folder = this.gui.addFolder('keys');

  // clean up the valid key listing TODO: refactor with game-shell? it does almost the same
  this.vkey2code = {};
  this.vkeyBracket2Bare = {};
  this.vkeyBare2Bracket = {};
  this.keyListing = [];
  for (var code in vkey) {
    var keyName = vkey[code];

    this.vkey2code[keyName] = code;

    var keyNameBare = filtered_vkey(keyName);
    this.vkeyBracket2Bare[keyName] = keyNameBare;
    this.vkeyBare2Bracket[keyNameBare] = keyName;

    if (!this.shouldHideKey(keyNameBare))
      this.keyListing.push(keyNameBare);
  }

  this.enable();
}

// cleanup key name - based on https://github.com/mikolalysenko/game-shell/blob/master/shell.js
// TODO: refactor with game-shell? and voxel-engine?
var filtered_vkey = function(k) {
  if(k.charAt(0) === '<' && k.charAt(k.length-1) === '>') {
    k = k.substring(1, k.length-1)
  }
  k = k.replace(/\s/g, "-")
  return k
}

BindingsUI.prototype.enable = function() {
  this.populate();
  if (this.game.shell) {
    this.game.shell.on('bind', this.onBind = this.populate.bind(this));
    this.game.shell.on('unbind', this.onUnbind = this.populate.bind(this));
  }
}

BindingsUI.prototype.disable = function() {
  if (this.game.shell) {
    this.game.shell.removeListener('bind', this.onBind);
    this.game.shell.removeListener('unbind', this.onUnbind);
  }
}

BindingsUI.prototype.populate = function() {
  // get keybindings
  this.binding2Key = {};
  if (this.kb && this.kb.bindings) {
    // voxel-engine with kb-bindings - stores key -> binding
    for (var key in this.kb.bindings) {
      var binding = this.kb.bindings[key];
      this.binding2Key[binding] = this.vkeyBracket2Bare[key] || key;
      this.addBinding(binding);
    }
  } else if (this.game.shell && this.game.shell.bindings) {
    // game-shell - stores binding -> key(s)

    // first, remove all items, since this may be called multiple times
    if (this.addedItems) {
      for (var i = 0; i < this.addedItems.length; i += 1) {
        this.folder.remove(this.addedItems[i]);
      }
    }

    // then add everything
    this.addedItems = [];
    for (var binding in this.game.shell.bindings) {
      var key = this.game.shell.bindings[binding];

      if (Array.isArray(key)) {
        key = key[0]; // TODO: support multiple keys. for now, only taking first
      }

      this.binding2Key[binding] = this.vkeyBracket2Bare[key] || key;
      var item = this.addBinding(binding);
      this.addedItems.push(item);
    }
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

  return item;
};

function updateBinding(self, binding) {
  return function(newKeyNameBare) {
    //if (self.vkey2code[newKeyName] === undefined) // invalid vkey

    var newKeyName = self.vkeyBare2Bracket[newKeyNameBare];

    self.removeBindings(binding);

    if (self.kb && self.kb.bindings) {
      self.kb.bindings[newKeyName] = binding;
    } else {
      self.game.shell.bind(binding, newKeyName);
    }
  };
}

// remove all keys bound to given binding
BindingsUI.prototype.removeBindings = function(binding) {
  if (this.kb && this.kb.bindings) {
    for (var key in this.kb.bindings) {
      var thisBinding = this.kb.bindings[key];
      if (thisBinding === binding) {
        delete this.kb.bindings[key];
      }
    }
  } else {
    this.game.shell.unbind(binding);
  }
};

