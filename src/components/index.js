import React, { Component } from 'react';
import { render } from 'react-dom';
import Test from './Test';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reactVersion: null
    };
  }
  
  handleClick = () => {
    const query = 'window.__REACT_DEVTOOLS_GLOBAL_HOOK__';
    let that = this;
    chrome.devtools.inspectedWindow.eval( query, (result, isException) => { 
      if (isException) {
        console.log("err");
      } else {
        let instance = result._renderers[Object.keys(result._renderers)[0]];
        console.log('success: ', instance);
        that.setState({
          reactVersion: instance.version
        });
      }
    });
  }

  render() {

    return (
      <div>
        <button onClick={this.handleClick}>Click</button>
        React version: {this.state.reactVersion}

        <Test />
      </div>
    );
  }
}


render(
  <App />,
  document.getElementById('root')
);
