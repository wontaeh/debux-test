import React, { Component } from 'react';
import ReactDOM from 'react-dom';
// import App from '../components/App';
import Components from '../components/Components';
import D3Tree from '../components/D3Tree';
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
      console.log('before makeTreeData - Data: ', updateData);
      this.makeTreeData(updateData, treeData);
      
      if(treeData) {
        this.setState({
          data: treeData
        });
      }
    }
  }
  render() {
    return (
      
      <div className='test'>
        <NavBar/>
        <button className="button" onClick={this.handleClick}>Click</button>
        <div className="rowCols">
        <ChartWindow treeType='Components:' treeData={this.state.data}/>
        <ChartWindow treeType='Store:'/>
        </div>
        <InfoWindow/>
        <br />
      </div>
    );
  }
}



ReactDOM.render(
  <App />,
  document.getElementById('root')
);

