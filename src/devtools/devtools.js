import React, { Component } from 'react';
import ReactDOM from 'react-dom';
// import App from '../components/App';
import Components from '../components/Components';
import D3Tree from '../components/D3Tree';

let curData;
let dispalyComp;

chrome.devtools.panels.create(
  'debux-test',
  null, // icon
  'devtools.html',
  () => {
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
  }
);



class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null
    };
  }
  
  makeTreeData = (data, arr) => {
    if(data) {
      if(data.children){
        if(data.children.length === 0) {
          let newObj = {
            name: data.name,
            // state: data.state,
            // props: data.props,
            children: data.children
          };
          arr.push(newObj);
          return ;
        } else {
          let newObj = {
            name: data.name,
            // state: data.state,
            // props: data.props,
            children: data.children
          };
          arr.push(newObj);
          for(let i = 0; i < data.children.length; i++) {
            this.makeTreeData(data.children[i], arr);
          }
        }
      }
    }
  }

  handleClick = () => {
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
    console.log('Data: ',curData);
    if(curData.data) {
      let updateData = curData.data[0];
      let treeData = [];
      this.makeTreeData(updateData, treeData);
      this.setState({
        data: treeData
      });
    }

  }

  render() {
    // let displayArr = [];
    // let displayComp = [];
    // let currentData = this.state.data;
    // if(currentData) {
    //   // let displayData = JSON.parse(currentData).data[0];
    //   let displayData = currentData.data[0];
    //   this.displayData(displayData, displayArr);
    //   for(let i = 0; i < displayArr.length; i++) {
    //     displayComp.push(<Components key={'comp'+i} name={displayArr[i].name} state={displayArr[i].state} props={displayArr[i].props}/>);
    //   }
    // }
    // let testArr = [];
    // for(let i = 0; i < 5; i++) {
    //   testArr.push(<Components key={i} />);
    // }
    // console.log('testArr: ',testArr);
    // console.log('displayArr: ', displayArr);
    return (
      <div>
        <button onClick={this.handleClick}>Click</button>
        <br />
        <D3Tree treeData={this.state.data}/>
      </div>
    );
  }
}



ReactDOM.render(
  <App />,
  document.getElementById('root')
);

