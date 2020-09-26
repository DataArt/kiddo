const fs = require('fs-extra');
const concat = require('concat');
(async function build() {
    const files = [
        './dist/game_engine/runtime-es5.js',
        './dist/game_engine/polyfills-es5.js',
        './dist/game_engine/scripts.js',
        './dist/game_engine/main-es5.js',
        './dist/game_engine/vendor-es5.js',
        './dist/game_engine/styles-es5.js',
    ]
    await fs.ensureDir('dist/elements')
    await concat(files, 'dist/elements/kids-edu.js');
    await fs.copyFile('./dist/game_engine/index.html', 'dist/elements/index.html');
    await fs.copy('./dist/game_engine/assets/', 'dist/elements/assets/');
})()