'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
let interactive = true;

// Travis sets this variable
const isCI = exports.isCI = process.env.CI !== undefined && process.env.CI === 'true';

const setInteractive = exports.setInteractive = i => interactive = i.toString() === 'true';

const isInteractive = exports.isInteractive = () => !isCI && interactive;