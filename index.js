// # vim: set shiftwidth=2 tabstop=2 softtabstop=2 expandtab:
  
var datgui = require('dat-gui');

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

  this.binding2Key = {};
  for (var key in this.kb.bindings) {
    var binding = this.kb.bindings[key];
    this.binding2Key[binding] = key;
    this.addBinding(binding);
  }
}

function isReserved(s) {
  return s === 'enabled' ||
       s === 'enable' ||
       s === 'disable' ||
       s === 'destroy' ||
       s === 'down' ||
       s === 'up';
}

BindingsUI.prototype.addBinding = function (name) {
  var item = this.folder.add(this.binding2Key, name);
  //item.onChange(updateBinding(this, name));
};

