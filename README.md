# kb-bindings-ui

A graphical interface for [kb-bindings](https://github.com/deathcap/kb-bindings) using [dat-gui](https://code.google.com/p/dat-gui/).

![screenshot](http://i.imgur.com/Qn85CUW.png "Screenshot") 

## Usage

    var createBindingsUI = require('kb-bindings-ui');

    createBindingsUI(null, {
        kb: kb, // kb-bindings instance to control
        gui: gui, // datgui instance to add to (optional; created if not given)
        hideKeys: [], // array of vkeys to not show in list (optional)
    })

Like [voxel-plugins-ui](https://github.com/deathcap/voxel-plugins-ui) and 
[voxel-debug](https://github.com/shama/voxel-debug), you can pass an existing
datgui instance to add to an existing dialog window instead of creating a new one.

The key names shown come from the [vkey](https://github.com/chrisdickinson/vkey) module
(note, not all platforms may support all keys).

In the GUI you can change the key for each binding. The changes take effect immediately.

## License

MIT
