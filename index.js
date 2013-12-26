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
  this.folder = this.gui.addFolder('keys');

  if (!this.kb.bindings) throw 'kb-bindings-ui "kb" option could not find kb-bindings\' bindings';

  this.vkey2code = {};
  this.vkeyNamesHTML = [];
  for (var code in vkey) {
    this.vkey2code[vkey[code]] = code;

    var vkeyNameHTML = vkey[code].replace('<', '&lt;'); // TODO
    this.vkeyNamesHTML.push(vkeyNameHTML);
  }

  this.binding2Key = {};
  for (var key in this.kb.bindings) {
    var binding = this.kb.bindings[key];
    this.binding2Key[binding] = key;
    this.addBinding(binding);
  }
}

BindingsUI.prototype.addBinding = function (binding) {
  var item = this.folder.add(this.binding2Key, binding, this.vkeyNamesHTML);

  //item.onFinishChange(updateBinding(this, binding));
};

/*
function updateBinding(self, binding) {
  return function(newKeyName) {
    if (self.vkey2code[newKeyName] !== undefined) {

    }
  };
}
*/
