import React, { Component } from 'react';
import ReactDOM from 'react-dom';
// import App from '../components/App';
import InfoWindow from '../components/InfoWindow';
import '../styles/App.css';
import NavBar from '../components/NavBar';
import ChartWindow from '../components/ChartWindow';

let curData;

//styles
document.body.style = 'background: #242d3d;';

chrome.devtools.panels.create(
  'debux-test',
  null, // icon
  'devtools.html',
  () => {
    console.log('In panel create func');
    const port = chrome.extension.connect({ name: 'debux-test' });
    console.log('port: ', port);
    // establishes a connection between devtools and background page
    port.postMessage({
      name: 'connect',
      tabId: chrome.devtools.inspectedWindow.tabId,
    });

    port.onMessage.addListener((msg) => {
      if (!msg.data) return; // abort if data not present, or if not of type object
      if (typeof msg !== 'object') return;
      console.log('msg: ', msg);
      curData = msg; // assign global data object
    });
  }
);



class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reactVersion: null,
      data: null,
      state: [],
      props: [],
      components:[],
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
        // excuteInstallHook(result);
        that.setState({
          reactVersion: instance.version
        });
      }
    });
    const port = chrome.extension.connect({ name: 'debux-test' });
    port.postMessage({
      name: 'connect',
      tabId: chrome.devtools.inspectedWindow.tabId,
    });
    port.onMessage.addListener((msg) => {
      if (!msg.data) return; // abort if data not present, or if not of type object
      if (typeof msg !== 'object') return;
      curData = msg; // assign global data object
    });
    let updateData = null;
    if(curData) updateData = curData.data[0].children[0];
    console.log('updateData: ',updateData);
    let updateState = Object.keys(updateData.state);
    console.log('updateState: ', updateState);
    let updateComp = updateData.children[0].children;
    
    if(updateState) {
      this.setState({
        // data: updateData,
        state: updateState,
        // components: updateComp
      });
    }
  }
  render() {
    let states = this.state.state.map((el) => {
      return <div>{el}</div>
    });
    console.log(states);
    return (
      
      <div className='test'>
        <NavBar/>
        <div className="rowCols">
        <ChartWindow treeType='Components:'/>
        <ChartWindow treeType='Store:'/>
        </div>
        <InfoWindow/>
        <button onClick={this.handleClick}>Click</button>
        <br />
        Data: {this.state.data} <br />
        {states} <br />
        {this.state.components} <br />
        React version: {this.state.reactVersion}
      </div>
    );
  }
}



ReactDOM.render(
  <App />,
  document.getElementById('root')
);