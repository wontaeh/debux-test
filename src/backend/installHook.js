/* eslint brace-style: off, camelcase: off, max-len: off, no-prototype-builtins: off, no-restricted-syntax: off, consistent-return: off, no-inner-declarations: off */
import { traverse16 } from './fiber-hook';
import { getData } from './react-15-hook';

// var __DebuxDebugMode = (process.env.NODE_ENV === 'debug');
var __DebuxDebugMode = false;

// Notes... might need additional testing..renderers provides a list of all imported React instances
var __DebuxHasRun; // memoize installing the hook
if (!__DebuxHasRun) {
  if (!window.__REACT_DEVTOOLS_GLOBAL_HOOK__) console.warn('[De-Bux]: De-Bux requires React Dev Tools to be installed.');
  const reactInstances = window.__REACT_DEVTOOLS_GLOBAL_HOOK__._renderers || null;
  const instance = reactInstances[Object.keys(reactInstances)[0]];
  // const reactRoot = window.document.body.childNodes;
  const devTools = window.__REACT_DEVTOOLS_GLOBAL_HOOK__;
  // grab the first instance of imported React library

  let __DebuxThrottle = false;
  let __DebuxFiberDOM;
  let __Debux_ReactVersion;

  // locate instance of __REACT_DEVTOOLS_GLOBAL_HOOK__
  // __REACT_DEVTOOLS_GLOBAL_HOOK__ exists if React is imported in inspected Window

  /**
   * Begin monkey patch
   *
   *  IF __REACT_DEVTOOLS_GLOBAL_HOOK__ NOT present, assume website is not using React
   *  IF React 16 detected, patch 'onCommitFiberRoot' from react dev tools
   *  ELSE Patch React 15 (or lowers) reconciler method
   */
  /*eslint-disable */
  (function installHook() {
    // no instance of React detected
    if (!window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
      console.log('Error: React DevTools not present. React Sight uses React DevTools to patch React\'s reconciler');
      return;
    }
    // React fiber (16+)
    if (instance && instance.version) {
      __Debux_ReactVersion = instance.version;
      if (__DebuxDebugMode) console.log('version: ', __Debux_ReactVersion);
      devTools.onCommitFiberRoot = (function (original) {
        return function (...args) {
          __DebuxFiberDOM = args[1];
          if (__DebuxDebugMode) console.log('DOM: ', __DebuxFiberDOM);
          traverse16(__DebuxFiberDOM);
          return original(...args);
        };
      })(devTools.onCommitFiberRoot);
    }
    // React 15 or lower
    else if (instance && instance.Reconciler) {
      // hijack receiveComponent method which runs after a component is rendered
      instance.Reconciler.receiveComponent = (function (original) {
        return function (...args) {
          if (!__DebuxThrottle) {
            __DebuxThrottle = true;
            setTimeout(() => {
              getData(instance);
              __DebuxThrottle = false;
            }, 10);
          }
          return original(...args);
        };
      })(instance.Reconciler.receiveComponent);
    }
    else console.log('[De-Bux] React not found');
  })();
  /* eslint-enable */

  // listener for initial load
  if (instance) {
    window.addEventListener('debuxtest', () => {
      if (parseInt(__Debux_ReactVersion, 10) >= 16) traverse16(__DebuxFiberDOM);
      else getData(instance);
    });
  }
  __DebuxHasRun = true;
}
