# kb-bindings-ui

A graphical interface for configuring [kb-bindings](https://github.com/deathcap/kb-bindings) using [dat-gui](https://code.google.com/p/dat-gui/).

![screenshot](http://i.imgur.com/Qn85CUW.png "Screenshot") 

To try the demo run `npm start` or visit [http://deathcap.github.io/kb-bindings-ui/](http://deathcap.github.io/kb-bindings-ui/).

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
Optionally, kb-bindings-ui can be loaded through [voxel-plugins](https://github.com/deathcap/voxel-plugins),
and it will load after voxel-debug and voxel-plugins-ui, reusing their datgui instance.

The key names shown come from the [vkey](https://github.com/chrisdickinson/vkey) module
(note, not all platforms may support all keys).

In the GUI you can change the key for each binding. The changes take effect immediately.

## License

MIT
