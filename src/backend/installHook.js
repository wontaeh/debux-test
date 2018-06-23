  const parseFunction = (fn) => {
  const string = `${fn}`;

  const match = string.match(/function/);
  if (match == null) return 'fn()';

  const firstIndex = match[0] ? string.indexOf(match[0]) + match[0].length + 1 : null;
  if (firstIndex == null) return 'fn()';

  const lastIndex = string.indexOf('(');
  const fnName = string.slice(firstIndex, lastIndex);
  if (!fnName.length) return 'fn()';
  return `${fnName} ()`;
};
///////////////////////////////////////////////////////////////////
var __ReactSightDebugMode = (false);
let __ReactSightStore;

/** TODO - get objects to work
  *
  * Parse the props for React 16 components
  */
 const props16 = (node) => {
  try {
    const props = {};
    const keys = Object.keys(node.memoizedProps);

    keys.forEach((prop) => {
      const value = node.memoizedProps[prop];
      if (typeof value === 'function') props[prop] = parseFunction(value);
      // TODO - get these objects to work, almost always children property
      else if (typeof node.memoizedProps[prop] === 'object') {
        // console.log("PROP Object: ", node.memoizedProps[prop]);
        props[prop] = 'object*';

        // TODO - parse object
      }
      else props[prop] = node.memoizedProps[prop];
    });
    console.log('PROPS: ',props);
    return props;
  } catch (e) {
    return {};
  }
};

/** TODO: Get Props
 *
 * Traverse through vDOM (React 16) and build up JSON data
 *
 */
  const recur16 = (node, parentArr) => {
  const newComponent = {
    name: '',
    children: [],
    state: null,
    props: null,
    id: null,
    isDOM: null,
  };

  // TODO ** only works on local host **
  // get ID
  if (node._debugID) newComponent.id = node._debugID;

  // get name and type
  if (node.type) {
    if (node.type.name) {
      newComponent.name = node.type.name;
      newComponent.isDOM = false;
    }
    else {
      newComponent.name = node.type;
      newComponent.isDOM = true;
    }
  }

  // get state
  if (node.memoizedState) newComponent.state = node.memoizedState;

  // get props
  if (node.memoizedProps) newComponent.props = props16(node);

  // get store
  if (node.type && node.type.propTypes) {
    if (node.type.propTypes.hasOwnProperty('store')) {
      __ReactSightStore = node.stateNode.store.getState();
    }
  }
  newComponent.children = [];
  parentArr.push(newComponent);
  if (node.child != null) recur16(node.child, newComponent.children);
  if (node.sibling != null) recur16(node.sibling, parentArr);
};

/**
 * Traversal Method for React 16
 *
 * If the application is using React Fiber, run this method to crawl the virtual DOM.
 * First, find the React mount point, then walk through each node
 * For each node, grab the state and props if present
 * Finally, POST data to window to be recieved by content-scripts
 *
 * @param {array} components - array containing parsed virtual DOM
 *
 */
 const traverse16 = (fiberDOM) => {
  if (typeof fiberDOM === 'undefined') return;
  if (__ReactSightDebugMode) console.log('[ReactSight] traverse16 vDOM: ', fiberDOM);
  const components = [];
  recur16(fiberDOM.current.stateNode.current, components);
  if (__ReactSightDebugMode) console.log('[ReactSight] traverse16 data: ', components);
  const data = {
    data: components,
    store: __ReactSightStore,
  };
  data.data = data.data[0].children[0].children;
  const ReactSightData = { data: components, store: __ReactSightStore };
  const clone = JSON.parse(JSON.stringify(ReactSightData));
  if (__ReactSightDebugMode) console.log('[ReactSight] retrieved data --> posting to content-scripts...: ', ReactSightData);
  if (__ReactSightDebugMode) console.log('[ReactSight] SENDING -> ', clone);
  window.postMessage(clone, '*');
  console.log("COMPONENTS: ", components)
};

//////////////////////////////////////////////

var __ReactSightDebugMode = (false);
// let __ReactSightStore;
//may need to rename this instead of commenting
/**
 * Parse Component's props. Handle nested objects and functions
 *
 * @param {object} props - Object representing a component's props
 */
  const parseProps = (props, i = 0) => {
  if (!props) return null;
  if (props.hasOwnProperty(window) || props.hasOwnProperty('prevObject') || props.hasOwnProperty(Window)) return null; // window was causing infinite loops
  if (typeof props !== 'object') return props;

  // check if current props has PROPS property..don't traverse further just grab name property
  if (Object.prototype.hasOwnProperty.call(props, 'props')) {
    if (!props.hasOwnProperty('type')) return undefined;
    else if (props.type.hasOwnProperty('name') && props.type.name.length) return props.type.name;
    else if (props.type.hasOwnProperty('displayName') && props.type.displayName.length) return props.type.displayName;
    else if (props.hasOwnProperty('type')) return `${props.type}`;
  }

  // otherwise parse the props
  else {
    const parsedProps = {};
    // TODO remove for in loop
    for (const key in props) {
      if (!props[key]) parsedProps[key] = null;

      // stringify methods
      else if (key === 'routes') return;
      else if (typeof props[key] === 'function') parsedProps[key] = parseFunction(props[key]);
      // array parse parseProps forEach element
      else if (Array.isArray(props[key]) && key === 'children') parsedProps[key] = parseArray(props[key]);

      // else if type is an object
      else if (typeof props[key] === 'object') {
        // handle custom objects and components with one child
        if (props[key] && Object.keys(props[key]).length) {
          if (i < 3) { // limit this func
            const iterator = i + 1;
            parsedProps[key] = parseProps(props[key], iterator);
          } else parsedProps[key] = 'obj*'; // end recursion so we dont get infinite loops
        }
      }
      // handle text nodes and other random values
      else parsedProps[key] = props[key];
    }
    return parsedProps;
  }
};

/**
 * Recursively walk through virtual DOM and build up JSON representation
 *
 * @param {react component} component - a react component
 * @param {array} parentArr - array representing component's parent
 */
 const traverseAllChildren = (component, parentArr) => {
  if (!component._currentElement) return;

  const newComponent = {
    children: [],
    id: null,
    idDOM: false,
    name: 'default',
    state: null,
    props: null,
    ref: null,
    key: null,
  };

  __ReactSightStore = getStore(component);

  newComponent.state = getState(component);
  newComponent.key = getKey(component);
  newComponent.ref = getRef(component);
  newComponent.name = getName(component);
  newComponent.props = getProps(component);

  const id = getId(component);
  newComponent.id = id.id;
  newComponent.isDOM = id.isDOM;

  // Add new component to parent's array
  parentArr.push(newComponent);

  const { _renderedChildren, _renderedComponent } = component;

  // traverse child or children of current component
  if (_renderedComponent) traverseAllChildren(_renderedComponent, newComponent.children);
  else if (_renderedChildren) {
    const keys = Object.keys(_renderedChildren);
    keys.forEach(key => traverseAllChildren(_renderedChildren[key], newComponent.children));
  }
};

/**
 * Traverse React's virtual DOM and POST the object to the window.
 * The message will be recieved by React Sight chrome extension (the content script)
 *
 * 1. define rootElement of virtual DOM
 * 2. recursively traverse down through props chain, starting from root element

 * @param {array} components - array containing parsed virtual DOM
 */
  const getData = (reactDOM) => {
  if (__ReactSightDebugMode) console.log('vDOM', reactDOM);
  const components = [];
  const rootElement = reactDOM.Mount._instancesByReactRootID[1]._renderedComponent;
  traverseAllChildren(rootElement, components);
  const ReactSightData = { data: components, store: __ReactSightStore };
  const clone = JSON.parse(JSON.stringify(ReactSightData));
  if (__ReactSightDebugMode) console.log('SENDING -> ', ReactSightData);
  window.postMessage(JSON.parse(JSON.stringify(clone)), '*');
};

// ***************
// *** HELPERS ***
// ***************

/**
 * Parse an array and it's elements. Accepts and array and returns an array
 *
 * @param {array} arr
 */
const parseArray = arr => arr.map(elem => parseProps(elem));

/**
 * Returns a React component's props, if any
 * @param {React Element} component
 */
const getProps = (component) => {
  if (component._currentElement && component._currentElement.props) return parseProps(component._currentElement.props);
  return null;
};

/**
 * Return's a React component's state, if any
 * @param {React Element} component
 */
  const getState = (component) => {
  if (component._instance && component._instance.state) return component._instance.state;
  return null;
};

  const getStore = (component) => {
  // call getState() on react-redux.connect()
  if (component._currentElement.type && component._currentElement.type.propTypes && component._currentElement.type.propTypes.hasOwnProperty('store')) {
    return component._instance.store.getState();
  }
  return null;
};

/**
 * Returns a React component's key, if any
 * @param {React Element} component
 */
  const getKey = (component) => {
  if (component._currentElement && component._currentElement.key) return component._currentElement.key;
  return null;
};

/**
 * Returns a React component's ref, if any
 * @param {React Element} component
 */
  const getRef = (component) => {
  if (component._currentElement && component._currentElement.ref) return component._currentElement.ref;
  return null;
};

/**
 * Returns a React component's name, if any
 * @param {React Element} component
 */
  const getName = (component) => {
  if (component && component._currentElement && component._currentElement.type) {
    if (component._currentElement.type.displayName) return component._currentElement.type.displayName;
    else if (component._currentElement.type.name) return component._currentElement.type.name;
    return component._currentElement.type;
  }
  return 'default';
};

/**
 * Returns a React component's id, if any
 * @param {React Element} component
 */
 const getId = (component) => {
  if (component._debugID) return { id: component._debugID, isDOM: true };
  if (component._domID) return { id: component._domID, isDOM: true };
  return { id: component._mountOrder * 100, isDOM: false };
};



///////////////////////////////////////////////////////////////////////////////
//  Created by Grant Kang, William He, and David Sally on 9/10/17.
//  Copyright © 2018 React Sight. All rights reserved.

/* eslint brace-style: off, camelcase: off, max-len: off, no-prototype-builtins: off, no-restricted-syntax: off, consistent-return: off, no-inner-declarations: off */

// import { traverse16 } from './fiber-hook';
// import { getData } from './react-15-hook';

var __ReactSightDebugMode = (false);

// Notes... might need additional testing..renderers provides a list of all imported React instances
var __ReactSightHasRun; // memoize installing the hook

if (!__ReactSightHasRun) {
  if (!window.__REACT_DEVTOOLS_GLOBAL_HOOK__) console.warn('[React-Sight]: React Sight requires React Dev Tools to be installed.');
  const reactInstances = window.__REACT_DEVTOOLS_GLOBAL_HOOK__._renderers || null;
  const instance = reactInstances[Object.keys(reactInstances)[0]];
  // const reactRoot = window.document.body.childNodes;
  const devTools = window.__REACT_DEVTOOLS_GLOBAL_HOOK__;

  // grab the first instance of imported React library

  let __ReactSightThrottle = false;
  let __ReactSightFiberDOM;
  let __ReactSight_ReactVersion;

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
      __ReactSight_ReactVersion = instance.version;
      if (__ReactSightDebugMode) console.log('version: ', __ReactSight_ReactVersion);
      devTools.onCommitFiberRoot = (function (original) {
        return function (...args) {
          __ReactSightFiberDOM = args[1];
          if (__ReactSightDebugMode) console.log('DOM: ', __ReactSightFiberDOM);
          traverse16(__ReactSightFiberDOM);
          return original(...args);
        };
      })(devTools.onCommitFiberRoot);
    }
    // React 15 or lower
    else if (instance && instance.Reconciler) {
      // hijack receiveComponent method which runs after a component is rendered
      instance.Reconciler.receiveComponent = (function (original) {
        return function (...args) {
          if (!__ReactSightThrottle) {
            __ReactSightThrottle = true;
            setTimeout(() => {
              getData(instance);
              __ReactSightThrottle = false;
            }, 10);
          }
          return original(...args);
        };
      })(instance.Reconciler.receiveComponent);
    }
    else console.log('[React Sight] React not found');
  })();
  /* eslint-enable */

  // listener for initial load
  if (instance) {
    window.addEventListener('reactsight', () => {
      if (parseInt(__ReactSight_ReactVersion, 10) >= 16) traverse16(__ReactSightFiberDOM);
      else getData(instance);
    });
  }
  __ReactSightHasRun = true;
}
