import logo from './logo.svg';
import React from 'react';
import './App.css';


// import TronWeb from './tronweb/src/index.js'
// const TronWeb = require('tronweb')
const TronWeb = require('./tronweb/dist/TronWeb.node');
const abiTest = require('./test/mainChain/abi.test');
const accountsTest = require('./test/mainChain/accounts.test');
const bytesTest = require('./test/mainChain/bytes.test');
const codeTest = require('./test/mainChain/code.test');
const eventTest = require('./test/mainChain/event.test');
const indexTest = require('./test/mainChain/index.test');
const methodTest = require('./test/mainChain/method.test');
const pluginTest = require('./test/mainChain/plugin.test');
const providersTest = require('./test/mainChain/providers.test');
const transactionBuilderTest = require('./test/mainChain/transactionBuilder.test');
const trxTestMain = require('./test/mainChain/trx.test');
const fallbackTest = require('./test/mainChain/fallback.test');
const ztronTest = require('./test/mainChain/ztron.test');
const ztron2Test = require('./test/mainChain/ztron2.test');
const trongridTest = require('./test/mainChain/trongrid.test');
const multiSignTestMain = require('./test/mainChain/multiSign.test.js');
const feelimitTest = require('./test/sideChain/feelimit.test');
const multiSignTestSide = require('./test/sideChain/multiSign.test.js');
const trc10Test = require('./test/sideChain/trc10.test.js');
const trc20Test = require('./test/sideChain/trc20.test.js');
const trc721Test = require('./test/sideChain/trc721.test.js');
const trxTestSide = require('./test/sideChain/trx.test.js');
const isConstantCall = require('./test/mainChain/isConstantCall.test.js');
const contractTypes = require('./test/mainChain/contractTypes.test.js');
const typedData = require('./test/mainChain/typedData.test.js');
const eip712Test = require('./test/mainChain/eip712Test.test.js');
const transactionTest = require('./test/mainChain/transaction.test.js');
const signVisibleTest = require('./test/mainChain/signVisible.test.js');
const tronWebBuilder = require('./test/util/tronWebBuilder');


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  test = async () => {
    /** need SIDE_CHAIN environment
     *  Use react default domain name in the browser
     */
    // await abiTest.abiTestAll();//yes
    // await accountsTest.accountsTestAll(); //yes
    // await bytesTest.bytesTestAll();//yes
    // await codeTest.codeTestAll();//yes
    // await contractTypes.contractTypesTestAll();//yes
    // await eip712Test.eip712TestAll();//yes
    // await fallbackTest.fallbackTestAll();//yes
    // await isConstantCall.isConstantCallTestAll(); //yes
    // await methodTest.methodTestAll();//yes
    // await multiSignTestMain.multiSignTestAll();//yes
    // await pluginTest.pluginTestAll();//yes
    // await providersTest.providersTestAll();//yes
   // await transactionBuilderTest.transactionBuilderTestAll();//yes
   //  await trxTestMain.trxTestAll();//yes
   //  await typedData.typedDataAll();//yes
   //  await transactionTest.transactionTestAll();//yes
    await signVisibleTest.signVisibleTestAll();//yes

    // await feelimitTest.feelimitTestAll();//yes
    //  await multiSignTestSide.multiSignTestAll();//yes
    // await trc721Test.trc721TestAll();// yes
    // await trc20Test.trc20TestAll();//
    // await trc10Test.trc10TestAll();// 
    // await trxTestSide.trxTestAll();// 

    /** need nile environment
     *  Use react default domain name in the browser
     */
    // await eventTest.eventTestAll();//yes
    // await indexTest.indexTestAll();//yes

    /** need fullHost: TEST_TRON_GRID_API environment
     *  The environment is not available, this use case ignores
     *  Use http://trongrid.myservice.com domain name in the browser
     */
    // await trongridTest.trongridTestAll();   // 运行时会有很多url返回401用例
    console.log("success all")
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
