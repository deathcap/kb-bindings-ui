// # vim: set shiftwidth=2 tabstop=2 softtabstop=2 expandtab:
  
var datgui = require('dat-gui');
var vkey = require('vkey');

module.exports = function(game, opts) {
  return new BindingsUI(game, opts);
};

function BindingsUI(game, opts) {
  this.game = game;

  opts = opts || {};

  this.kb = opts.kb;
  if (!this.kb) throw 'kb-bindings-ui requires "kb" option set to kb-bindings instance';
  this.gui = opts.gui || new datgui.GUI();
  this.hideKeys = opts.hideKeys || ['ime-', 'launch-', 'browser-']; // too long

  this.folder = this.gui.addFolder('keys');

  if (!this.kb.bindings) throw 'kb-bindings-ui "kb" option could not find kb-bindings\' bindings';

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

    var oldKeyName = self.kb.bindings[binding];

    //TODO delete self.kb.bindings[oldKeyName];

    self.kb.bindings[newKeyName] = binding;
  };
}

