import logo from './logo.svg';
import React from 'react';
import './App.css';


// import TronWeb from './tronweb/src/index.js'
// import TronWeb from 'tronweb';
// const TronWeb = require('./tronweb/dist/TronWeb.node');
// import {abiTestAll} from './test/mainChain/abi.test.js';
// import accountsTest from './test/mainChain/accounts.test';
// import bytesTest from './test/mainChain/bytes.test';
// import codeTest from './test/mainChain/code.test';
// import eventTest from './test/mainChain/event.test';
// import indexTest from './test/mainChain/index.test';
// import methodTest from './test/mainChain/method.test';
// import pluginTest from './test/mainChain/plugin.test';
// import providersTest from './test/mainChain/providers.test';
import {transactionBuilderTestAll} from './test/mainChain/transactionBuilder.test.js';
// import trxTestMain from './test/mainChain/trx.test';
// import fallbackTest from './test/mainChain/fallback.test';
// import ztronTest from './test/mainChain/ztron.test';
// import ztron2Test from './test/mainChain/ztron2.test';
// import trongridTest from './test/mainChain/trongrid.test';
// import multiSignTestMain from './test/mainChain/multiSign.test.js';
// import feelimitTest from './test/sideChain/feelimit.test';
// import multiSignTestSide from './test/sideChain/multiSign.test.js';
// import trc10Test from './test/sideChain/trc10.test.js';
// import trc20Test from './test/sideChain/trc20.test.js';
// import trc721Test from './test/sideChain/trc721.test.js';
// import trxTestSide from './test/sideChain/trx.test.js';
// import isConstantCall from './test/mainChain/isConstantCall.test.js';
// import contractTypes from './test/mainChain/contractTypes.test.js';
// import typedData from './test/mainChain/typedData.test.js';
// import eip712Test from './test/mainChain/eip712Test.test.js';
// import transactionTest from './test/mainChain/transaction.test.js';
// import signVisibleTest from './test/mainChain/signVisible.test.js';
import tronWebBuilder from './test/util/tronWebBuilder.js';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  test = async () => {
    /** need SIDE_CHAIN environment
     *  Use react default domain name in the browser
     */
    // await abiTestAll();//Yes 6.0.0 done
    // await accountsTest.accountsTestAll(); //Yes 6.0.0 done 需要学习
    // await bytesTest.bytesTestAll();//Yes 6.0.0 done
    // await codeTest.codeTestAll();//Yes   6.0.0:传错参数类型期待报错，但是没有报错
    // await contractTypes.contractTypesTestAll();//Yes  6.0.0 done
    // await eip712Test.eip712TestAll();//Yes  6.0.0 done
    // await fallbackTest.fallbackTestAll();//Yes  6.0.0 done
    // await isConstantCall.isConstantCallTestAll(); //Yes 6.0.0 done
    // await methodTest.methodTestAll();//Yes 6.0.0 done
    // await multiSignTestMain.multiSignTestAll();//Yes  6.0.0 done
    // await pluginTest.pluginTestAll();//yes  pulgin 6.0.0 done 还需要研究学习
    // await providersTest.providersTestAll();//Yes 6.0.0 done
     await transactionBuilderTestAll(); //6.0.0 done
    // await trxTestMain.trxTestAll();  //6.0.0 left await broadcastHex()
    // await typedData.typedDataAll();//Yes  6.0.0 done
    // await transactionTest.transactionTestAll();  //6.0.0 done
    // await signVisibleTest.signVisibleTestAll();//Yes 6.0.0 done

    //sideChain cases
    /* await feelimitTest.feelimitTestAll();//yes
       await multiSignTestSide.multiSignTestAll();//yes
       await trc721Test.trc721TestAll();// yes
       await trc20Test.trc20TestAll();//
       await trc10Test.trc10TestAll();//
       await trxTestSide.trxTestAll(); */

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
