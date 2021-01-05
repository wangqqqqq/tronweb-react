import logo from './logo.svg';
import React from 'react';
import './App.css';


// import TronWeb from './tronweb/src/index.js'
const TronWeb = require('./tronweb/dist/TronWeb.node');
const feelimitTest = require('./test/sideChain/feelimit.test');
// const abiTest = require('./test/mainChain/abi.test');
// const base58Test = require('./test/mainChain/base58.test');
// const bytesTest = require('./test/mainChain/bytes.test');etae
// const codeTest = require('./test/mainChain/code.test');
// const eventTest = require('./test/mainChain/event.test');
// const indexTest = require('./test/mainChain/index.test');
// const methodTest = require('./test/mainChain/method.test');
// const pluginTest = require('./test/mainChain/plugin.test');
// const providersTest = require('./test/mainChain/providers.test');
const transactionBuilderTest = require('./test/mainChain/transactionBuilder.test');
const trxTest = require('./test/mainChain/trx.test');
const tronWebBuilder = require('./test/util/tronWebBuilder');


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  test = async () => {
    // await feelimitTest.feelimitTestAll(); // 剩余侧链部分
    // await abiTest.abiTestAll(); // completed
    // await base58Test.base58TestAll(); // completed
    // await bytesTest.bytesTestAll(); // completed
    // await codeTest.codeTestAll(); // completed
    // await eventTest.eventTestAll(); // completed
    // await indexTest.indexTestAll(); // completed
    // await methodTest.methodTestAll(); // completed
    // await pluginTest.pluginTestAll(); // completed
    // await providersTest.providersTestAll(); // completed
    // await transactionBuilderTest.transactionBuilderTestAll(); // completed
    await trxTest.trxTestAll(); // completed

    console.log("success")
  }

  async componentDidMount() {
    window.tronWeb1 = tronWebBuilder.createInstance();
    await this.test();
  }

  send = e => {};

  render() {
    return (
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <p>
              Edit <code>src/App.js</code> and save to reload.
            </p>
            <a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
              Learn React
            </a>
          </header>
        </div>
    );
  }
}

export default App;
