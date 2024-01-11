import React from 'react';
import Config from '../util/config.js'
const {PRIVATE_KEY, ADDRESS_HEX, ADDRESS_BASE58,FEE_LIMIT, TOKEN_ID,getTokenOptions} = Config;
import Contract from '../util/contracts.js'
const {TestCustomError, testRevertContract, testSetValContract,testEmptyAbi, outputNameTest1, outputNameTest2, testConstantParameters } = Contract;
import tronWebBuilder from '../util/tronWebBuilder.js';
import assertThrow from '../util/assertThrow.js';
import broadcaster from '../util/broadcaster.js';
import publicMethod from '../util/PublicMethod.js';
import waitChainData from '../util/waitChainData.js';
const { equals, getValues } = TestUtils;
import wait from '../util/wait.js';
const TronWeb = tronWebBuilder.TronWeb;
import { assert } from 'chai';
import util from 'util';
let tronWeb = tronWebBuilder.createInstance();
let contractAddress1;
let contractAddress2;
let contractAddress3;
let contractInstance;
let contractAddress;
let contractAddressCall2;
let contractInstanceCall2;
let accounts;
let emptyAccount;

async function customError() {
  let accounts = await tronWebBuilder.getTestAccountsInMain(1);
  let tronWeb = tronWebBuilder.createInstance();

  const tx = await broadcaster.broadcaster(tronWeb.transactionBuilder.createSmartContract({
    abi: TestCustomError.abi,
    bytecode: TestCustomError.bytecode
  }, accounts.b58[0]), accounts.pks[0]);
  let customError = await tronWeb.contract(TestCustomError.abi, tx.transaction.contract_address);

  const txid = await customError.test(111).send();
  console.log("txid: "+txid);
  await wait(40);
  const data = await tronWeb.trx.getTransactionInfo(txid);
  const errorData = data.contractResult;
  const expectedErrorData =
      TronWeb.sha3('CustomError(uint256,uint256)', false).slice(0, 8) +
      '000000000000000000000000000000000000000000000000000000000000006f' + // 111
      '0000000000000000000000000000000000000000000000000000000000000001'; // 1
  assert.equal(errorData, expectedErrorData);
}

async function send() {
  const tx = await broadcaster.broadcaster(tronWeb.transactionBuilder.createSmartContract({
    abi: testRevertContract.abi,
    bytecode: testRevertContract.bytecode
  }, ADDRESS_HEX), PRIVATE_KEY);
  let testRevert = await tronWeb.contract().at(tx.transaction.contract_address);
  console.log("tx.transaction.contract_address:"+tx.transaction.contract_address);
  const tx2 = await broadcaster.broadcaster(tronWeb.transactionBuilder.createSmartContract({
    abi: testSetValContract.abi,
    bytecode: testSetValContract.bytecode
  }, ADDRESS_HEX), PRIVATE_KEY);
  let testSetVal = await tronWeb.contract().at(tx2.transaction.contract_address)
  console.log("tx2.transaction.contract_address:"+tx2.transaction.contract_address);

  const emptyAccount1 = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount1.address.hex,1000000000,{privateKey: PRIVATE_KEY})
  await testRevert.setOwner(emptyAccount1.address.base58).send()
  console.log("emptyAccount1: "+util.inspect(emptyAccount1,true,null,true));
  assert.equal(await testRevert.getOwner(1).call(), emptyAccount1.address.hex.toLowerCase())

  await assertThrow(testRevert.setOwner('TSeFTBYCy3r2kZNYsj86G6Yz6rsmPdYdFs').send({shouldPollResponse: true}),
      null,
      'REVERT'
  )

  let result = await testSetVal.set(123).send({
    shouldPollResponse: true,
    keepTxID: true
  })
  assert.equal(result[0].length, 64)
  assert.equal(result[1].toNumber(), 123)
}

async function call() {
  const tx = await broadcaster.broadcaster(tronWeb.transactionBuilder.createSmartContract({
    abi: testRevertContract.abi,
    bytecode: testRevertContract.bytecode
  }, ADDRESS_HEX), PRIVATE_KEY)
  const testRevert = await tronWeb.contract().at(tx.transaction.contract_address)
  const emptyAccount1 = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount1.address.hex,1000000000,{privateKey: PRIVATE_KEY})
  await testRevert.setOwner(emptyAccount1.address.base58).send()

  assert.equal(await testRevert.getOwner(1).call(), emptyAccount1.address.hex.toLowerCase())
  await assertThrow(testRevert.getOwner(2).call()
  )
  await assertThrow(testRevert.getOwner2(2).call()
  )
}

async function emptyAbiBefore() {
  const tx1 = await broadcaster.broadcaster(tronWeb.transactionBuilder.createSmartContract({
    abi: testEmptyAbi.abi,
    bytecode: testEmptyAbi.bytecode
  }, ADDRESS_HEX), PRIVATE_KEY)
  contractAddress1 = tronWeb.address.fromHex(tx1.transaction.contract_address)
  console.log("contractAddress1:"+contractAddress1);

  const tx2 = await broadcaster.broadcaster(tronWeb.transactionBuilder.createSmartContract({
    abi:[{}],
    bytecode: testEmptyAbi.bytecode
  }, ADDRESS_HEX), PRIVATE_KEY)
  contractAddress2 = tronWeb.address.fromHex(tx2.transaction.contract_address)
  console.log("contractAddress2:"+contractAddress2);

  const tx3 = await broadcaster.broadcaster(tronWeb.transactionBuilder.createSmartContract({
    abi: testSetValContract.abi,
    bytecode: testSetValContract.bytecode
  }, ADDRESS_HEX), PRIVATE_KEY)
  contractAddress3 = tronWeb.address.fromHex(tx3.transaction.contract_address)
  console.log("contractAddress3:"+contractAddress3);
}

async function abiTest1() {
  // abi is []
  const functionSelector = 'set(uint256)';
  const parameter = [
    {type: 'uint256', value: 123}
  ]
  // abi:[]
  const triggerTransaction = await tronWeb.transactionBuilder.triggerSmartContract(
      contractAddress1, functionSelector, {}, parameter, ADDRESS_BASE58);
  console.log("triggerTransaction:"+util.inspect(triggerTransaction))
  const triggerTx = await broadcaster.broadcaster(null, PRIVATE_KEY, triggerTransaction.transaction);
  console.log("triggerTx:"+util.inspect(triggerTx))
  assert.equal(triggerTx.transaction.txID.length, 64);
  let triggerInfo;
  let count = 0;
  while (true) {
    triggerInfo = await tronWeb.trx.getTransactionInfo(triggerTx.transaction.txID);
    if (Object.keys(triggerInfo).length === 0) {
      count +=1;
      if(count > 15){
        throw Error("time out failed!!");
      }
      await wait(3);
      continue;
    } else {
      console.log("triggerInfo:"+util.inspect(triggerInfo))
      break;
    }
  }
  const contractResult = triggerInfo &&new tronWeb.BigNumber(triggerInfo.contractResult[0], 16).valueOf();
  console.log("contractResult: "+contractResult);
}

async function abiTest2() {
  // abi is [{}]
  const functionSelector = 'set(uint256)';
  const parameter = [
    {type: 'uint256', value: 123}
  ]
  // abi:[{}]
  const triggerTransaction2 = await tronWeb.transactionBuilder.triggerSmartContract(
      contractAddress2, functionSelector, {}, parameter, ADDRESS_BASE58);
  console.log("triggerTransaction2:"+util.inspect(triggerTransaction2))
  const triggerTx2 = await broadcaster.broadcaster(null, PRIVATE_KEY, triggerTransaction2.transaction);
  console.log("triggerTx2:"+util.inspect(triggerTx2))
  assert.equal(triggerTx2.transaction.txID.length, 64);
  let triggerInfo2;
  let count = 0;
  while (true) {
    triggerInfo2 = await tronWeb.trx.getTransactionInfo(triggerTx2.transaction.txID);
    if (Object.keys(triggerInfo2).length === 0) {
      count +=1;
      if(count > 15){
        throw Error("time out failed!!");
      }
      await wait(3);
      continue;
    } else {
      console.log("triggerInfo2:"+util.inspect(triggerInfo2))
      break;
    }
  }
  const contractResult2 = triggerInfo2 &&new tronWeb.BigNumber(triggerInfo2.contractResult[0], 16).valueOf();
  console.log("contractResult2: "+contractResult2);
}

async function abiTest3() {
  // abi is {}
  const functionSelector = 'set(uint256)';
  const parameter = [
    {type: 'uint256', value: 123}
  ]
  // clear abi
  const clearAbiTransaction = await tronWeb.transactionBuilder.clearABI(contractAddress3, ADDRESS_HEX);
  console.log("clearAbiTransaction:"+util.inspect(clearAbiTransaction))
  const clearAbiTx = await broadcaster.broadcaster(null, PRIVATE_KEY, clearAbiTransaction);
  let count = 0;
  while (true) {
    let clearAbiInfo = await tronWeb.trx.getTransactionInfo(clearAbiTx.transaction.txID);
    if (Object.keys(clearAbiInfo).length === 0) {
      count +=1;
      if(count > 15){
        throw Error("time out failed!!");
      }
      await wait(3);
      continue;
    } else {
      console.log("clearAbiInfo:"+util.inspect(clearAbiInfo))
      break;
    }
  }
  // abi:{}
  const triggerTransaction3 = await tronWeb.transactionBuilder.triggerSmartContract(
      contractAddress3, functionSelector, {}, parameter, ADDRESS_BASE58);
  console.log("triggerTransaction3:"+util.inspect(triggerTransaction3))
  const triggerTx3 = await broadcaster.broadcaster(null, PRIVATE_KEY, triggerTransaction3.transaction);
  console.log("triggerTx3:"+util.inspect(triggerTx3))
  assert.equal(triggerTx3.transaction.txID.length, 64);
  let triggerInfo3;
  count = 0;
  while (true) {
    triggerInfo3 = await tronWeb.trx.getTransactionInfo(triggerTx3.transaction.txID);
    if (Object.keys(triggerInfo3).length === 0) {
      count +=1;
      if(count > 15){
        throw Error("time out failed!!");
      }
      await wait(3);
      continue;
    } else {
      console.log("triggerInfo3:"+util.inspect(triggerInfo3))
      break;
    }
  }
  const contractResult3 = triggerInfo3 &&new tronWeb.BigNumber(triggerInfo3.contractResult[0], 16).valueOf();
  console.log("contractResult3: "+contractResult3);
}

async function constantMethodWithParameters(){
  const tx3 = await broadcaster.broadcaster(tronWeb.transactionBuilder.createSmartContract({
    abi: testConstantParameters.abi,
    bytecode: testConstantParameters.bytecode,
    parameters: [],feeLimit:1000e6
  }, ADDRESS_HEX), PRIVATE_KEY);
  assert.equal(tx3.transaction.txID.length, 64);
  let createInfo3;
  let count = 0;
  while (true) {
    createInfo3 = await tronWeb.trx.getTransactionInfo(tx3.transaction.txID);
    if (Object.keys(createInfo3).length === 0) {
      count +=1;
      if(count > 15){
        throw Error("time out failed!!");
      }
      await wait(3);
      continue;
    } else {
      console.log("createInfo3:" + util.inspect(createInfo3))
      break;
    }
  }
  let contractConstantAddress = createInfo3.contract_address;
  console.log("contractConstantAddress:" + contractConstantAddress)

  const emptyAccount = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount.address.hex,10000000000,{privateKey: PRIVATE_KEY})
  let options = getTokenOptions();
  options.saleEnd = Date.now() + 2500000;
  options.saleStart = Date.now() + 100000;
  let transaction = await tronWeb.transactionBuilder.createToken(options, emptyAccount.address.hex);
  await broadcaster.broadcaster(null, emptyAccount.privateKey, transaction);
  await waitChainData('token', emptyAccount.address.hex);
  let token = await tronWeb.trx.getTokensIssuedByAddress(emptyAccount.address.hex);
  let tokenID = token[Object.keys(token)[0]]['id']
  console.log( "tokenID:",tokenID)

  let options1 = {
    parameters: [],
    callValue:0,
    tokenId:tokenID,
    tokenValue:1
  };
  transaction = await tronWeb.transactionBuilder.triggerConstantContract(contractConstantAddress, 'getm()', options1,
      [], emptyAccount.address.hex);
  assert.equal(transaction.constant_result[0].slice(0,64), '0000000000000000000000000000000000000000000000000000000000000001');
  const t = await publicMethod.to64String(parseInt(tokenID).toString(16))
  assert.equal(t,transaction.constant_result[0].slice(64));
};

async function callAndsendTest1Before(){
  // createSmartContract
  let options = {
    abi: outputNameTest1.abi,
    bytecode: outputNameTest1.bytecode,
    feeLimit:FEE_LIMIT,
    funcABIV2: outputNameTest1.abi[0],
    parametersV2: [
      [5],
      ADDRESS_BASE58,
      TOKEN_ID,
      ["q","w","e"],
      ["0xf579f9c22b185800e3b6e6886ffc8584215c05a5","0xd9dcae335acd3d4ffd2e6915dc702a59136ab46f"]
    ],
  };
  const transaction = await tronWeb.transactionBuilder.createSmartContract(options, ADDRESS_BASE58);
  await broadcaster.broadcaster(null, PRIVATE_KEY, transaction);
  console.log("transaction.txID:"+transaction.txID)
  assert.equal(transaction.txID.length, 64);
  let createInfo;
  let count = 0;
  while (true) {
    createInfo = await tronWeb.trx.getTransactionInfo(transaction.txID);
    if (Object.keys(createInfo).length === 0) {
      count +=1;
      if(count > 15){
        throw Error("time out failed!!");
      }
      await wait(3);
      continue;
    } else {
      contractAddress = transaction.contract_address;
      console.log("contractAddress:"+contractAddress)
      break;
    }
  }
  contractInstance = await tronWeb.contract(outputNameTest1.abi,contractAddress);
  const originAddress = await contractInstance.origin().call();
  assert.ok(equals(originAddress, ADDRESS_BASE58));
  const token = parseInt(await contractInstance.token().call(), 10);
  assert.ok(equals(token, TOKEN_ID));
  const strs = await contractInstance.getStrs().call();
  assert.equal(util.inspect(strs), "[ [ 'q', 'w', 'e' ], stringArrayData: [ 'q', 'w', 'e' ] ]");
  assert.ok(equals(strs.stringArrayData, ["q", "w", "e"]));
  const bys = await contractInstance.getBys().call();
  assert.equal(util.inspect(bys), "[ [ '0xf579f9c22b185800e3b6e6886ffc8584215c05a5',\n"
      + "    '0xd9dcae335acd3d4ffd2e6915dc702a59136ab46f' ],\n"
      + "  bytesArrayData: [ '0xf579f9c22b185800e3b6e6886ffc8584215c05a5',\n"
      + "    '0xd9dcae335acd3d4ffd2e6915dc702a59136ab46f' ] ]");
  assert.ok(equals(bys.bytesArrayData, ["0xf579f9c22b185800e3b6e6886ffc8584215c05a5","0xd9dcae335acd3d4ffd2e6915dc702a59136ab46f"]));
}

async function callAndsendTest1(){
  let result;
  // strs
  result = await contractInstance.changeStrs(["z","x"]).send({shouldPollResponse:true}, PRIVATE_KEY);
  const strs = await contractInstance.getStrs().call();
  assert.equal(util.inspect(result), util.inspect(strs));
  assert.equal(util.inspect(strs), "[ [ 'z', 'x' ], stringArrayData: [ 'z', 'x' ] ]");
  assert.ok(equals(strs.stringArrayData, ["z","x"]));

  // bys
  result = await contractInstance.changeBys(["0x60F68C9B9e50","0x298fa36a9e2ebd6d3698e552987294fa8b65cd00"]).send({shouldPollResponse:true}, PRIVATE_KEY);
  const bys = await contractInstance.getBys().call();
  assert.equal(util.inspect(result), util.inspect(bys));
  assert.equal(util.inspect(bys), "[ [ '0x60f68c9b9e50',\n"
      + "    '0x298fa36a9e2ebd6d3698e552987294fa8b65cd00' ],\n"
      + "  bytesArrayData: [ '0x60f68c9b9e50',\n"
      + "    '0x298fa36a9e2ebd6d3698e552987294fa8b65cd00' ] ]");
  assert.ok(equals(bys.bytesArrayData, ["0x60F68C9B9e50".toLowerCase(),"0x298fa36a9e2ebd6d3698e552987294fa8b65cd00"]));

  // data
  result = await contractInstance.changeMapAll(0,["a","s"],0,["0x60F68C9B9e50","0x298fa36a9e2ebd6d3698e552987294fa8b65cd00"],[687],[9,0,23,1],ADDRESS_BASE58,TOKEN_ID).send({shouldPollResponse:true}, PRIVATE_KEY);
  result.uintData.eq('0x00')
  assert.equal(result.addressData,'415624c12e308b03a1a6b21d9b86e3942fac1ab92b')
  result.uintArrayDate[0].eq('0x09')
  result.uintArrayDate[2].eq('0x17')

  // changeMapAll2--3ceng struct
  result = await contractInstance.changeMapAll2(0,["a","s"],0,["0x60F68C9B9e50","0x298fa36a9e2ebd6d3698e552987294fa8b65cd00"],[[[687],[9,0,23,1],"TJEuSMoC7tbs99XkbGhSDk7cM1xnxR931s",1000007]]).send({shouldPollResponse:true}, PRIVATE_KEY);
  console.log("changeMapAll2 result:",result)
  assert.equal(result.addressData,'415ab90009b529c5406b4f8a6fc4dab8a2bc778c75')
  result.tokenData.eq('0x0f4247')

  // // changeMapAll3--4ceng struct
  result = await contractInstance.changeMapAll3(0,["a","s"],0,["0x60F68C9B9e50","0x298fa36a9e2ebd6d3698e552987294fa8b65cd00"],[[[[67],[11,2,2323,1001],"TJEuSMoC7tbs99XkbGhSDk7cM1xnxR931s",1000007]]]).send({shouldPollResponse:true}, PRIVATE_KEY);
  console.log("changeMapAll3 result:",result)
  result.tokenData.eq('0x0f4247')

  // StructArray
  result = await contractInstance.changeStructArray([3],[4]).send({shouldPollResponse:true}, PRIVATE_KEY);
  const structArray = await contractInstance.getStructArray().call();
  console.log("structArray:"+util.inspect(structArray))
  assert.equal(util.inspect(result), util.inspect(structArray));
  contractInstance.getStructArray().call((err, data)=>{
    assert.equal(data.toString(),structArray.toString())
  });

  // bool
  result = await contractInstance.changeBool(true).send({shouldPollResponse:true}, PRIVATE_KEY);
  const bool = await contractInstance.getBool().call();
  assert.equal(util.inspect(result), util.inspect(bool));
  assert.equal(util.inspect(bool), "[ true, boolData: true ]");
  assert.ok(equals(bool.boolData, true));

  // int
  result = await contractInstance.changeInt(68236424).send({shouldPollResponse:true}, PRIVATE_KEY);
  const intValue = await contractInstance.getInt().call();
  assert.equal(util.inspect(result), util.inspect(intValue));
  console.log("changeInt result:",result)
  result.intData.eq('0x04113488')
  assert.ok(equals(intValue.intData, 68236424));
}

async function  callAndsendTest2Before(){
  emptyAccount = await TronWeb.createAccount();
  tronWeb = tronWebBuilder.createInstance();
  await tronWeb.trx.sendTrx(emptyAccount.address.hex,100000000,{privateKey: PRIVATE_KEY})

  const options = {
    abi: outputNameTest2.abi,
    bytecode: outputNameTest2.bytecode,
    parameters: [emptyAccount.address.hex, TOKEN_ID, ["1"], ["0xdCad3a6d3569DF655070DEd0"]],
    feeLimit: 1000e6
  };
  let createTransaction1 = await tronWeb.transactionBuilder.createSmartContract(options, ADDRESS_BASE58);
  let createTx1 = await broadcaster.broadcaster(null, PRIVATE_KEY, createTransaction1);
  assert.equal(createTx1.transaction.txID.length, 64);
  let createInfo1;
  let count =0;
  while (true) {
    createInfo1 = await tronWeb.trx.getTransactionInfo(createTx1.transaction.txID);
    if (Object.keys(createInfo1).length === 0) {
      count +=1;
      if(count > 15){
        throw Error("time out failed!!");
      }
      await wait(3);
      continue;
    } else {
      console.log("createInfo1:" + util.inspect(createInfo1))
      break;
    }
  }
  contractAddressCall2 = createInfo1.contract_address;
  console.log("contractAddressCall2:" + contractAddressCall2)
  contractInstanceCall2 = await tronWeb.contract(outputNameTest2.abi,contractAddressCall2);
}

async function  callAndsendTest2Int(){
  const val = 123;
  let result = await contractInstanceCall2.changeInt(val).send({
    feeLimit:1000000000,
    callValue:0,
    tokenId:0,
    tokenValue:0,
    shouldPollResponse:true
  })
  result.intData.eq('0x7b')
  const dataAfter = await contractInstanceCall2.getInt().call();
  assert.equal(util.inspect(result), util.inspect(dataAfter));
  const After = parseInt(dataAfter.intData._hex, 16);
  assert.equal(After, val);
}

async function  callAndsendTest2changeUint(){
  const val = 1123;
  let result = await contractInstanceCall2.changeUint(val).send({
    feeLimit:1000000000,
    callValue:0,
    tokenId:0,
    tokenValue:0,
    shouldPollResponse:true
  })
  result.uintData.eq('0x0463');
  const dataAfter = await contractInstanceCall2.getUint().call();
  assert.equal(util.inspect(result), util.inspect(dataAfter));
  const After = parseInt(dataAfter.uintData._hex, 16);
  assert.equal(After, val);
}

async function  callAndsendTest2changeAddress(){
  let result = await contractInstanceCall2.changeAddress(emptyAccount.address.hex).send({
    feeLimit:1000000000,
    callValue:0,
    tokenId:0,
    tokenValue:0,
    shouldPollResponse:true
  })
  const dataAfter = await contractInstanceCall2.getAddress().call();
  assert.equal(util.inspect(result), util.inspect(dataAfter));
  assert.equal(dataAfter.addressData, emptyAccount.address.hex.toLowerCase());
}

async function  callAndsendTest2changeBytes32() {
  const val = "0xb55a21aaee0ce8f1c8ffaa0dbd23105cb55a21aaee0ce8f1c8ffaa0dbd23105a";
  let result = await contractInstanceCall2.changeBytes32(val).send({
    feeLimit:1000000000,
    callValue:0,
    tokenId:0,
    tokenValue:0,
    shouldPollResponse:true
  })
  assert.equal(util.inspect(result), "[ '0xb55a21aaee0ce8f1c8ffaa0dbd23105cb55a21aaee0ce8f1c8ffaa0dbd23105a',\n"
      + "  bytes32Data: '0xb55a21aaee0ce8f1c8ffaa0dbd23105cb55a21aaee0ce8f1c8ffaa0dbd23105a' ]");
  const dataAfter = await contractInstanceCall2.getBytes32().call();
  assert.equal(util.inspect(result), util.inspect(dataAfter));
  assert.equal(dataAfter.bytes32Data, val);
  contractInstanceCall2.getBytes32().call((err, data)=>{
    assert.equal(data.toString(),dataAfter.toString())
  });
}

async function  callAndsendTest2changeBytes() {
  const val = "0xb55a21aaee0ce8f1c8ffaa0dbd23105cb55a21aaee0ce8f1c8ffaa0dbd23105890";
  let result = await contractInstanceCall2.changeBytes(val).send({
    feeLimit:1000000000,
    callValue:0,
    tokenId:0,
    tokenValue:0,
    shouldPollResponse:true
  })
  assert.equal(util.inspect(result), "[ '0xb55a21aaee0ce8f1c8ffaa0dbd23105cb55a21aaee0ce8f1c8ffaa0dbd23105890',\n"
      + "  bytesData: '0xb55a21aaee0ce8f1c8ffaa0dbd23105cb55a21aaee0ce8f1c8ffaa0dbd23105890' ]");
  const dataAfter = await contractInstanceCall2.getBytes().call();
  assert.equal(util.inspect(result), util.inspect(dataAfter));
  assert.equal(dataAfter.bytesData, val);
      contractInstanceCall2.getBytes().call((err, data)=>{
    assert.equal(data.toString(),dataAfter.toString())
  });
}

async function  callAndsendTest2changeString(){
  const val = "b55a21aaee0ce8f1c8ff122344400403lkkhhj";
  let result = await contractInstanceCall2.changeString(val).send({
    feeLimit:1000000000,
    callValue:0,
    tokenId:0,
    tokenValue:0,
    shouldPollResponse:true
  })
  assert.equal(util.inspect(result), "[ 'b55a21aaee0ce8f1c8ff122344400403lkkhhj',\n"
      + "  stringData: 'b55a21aaee0ce8f1c8ff122344400403lkkhhj' ]");

  const dataAfter = await contractInstanceCall2.getString().call();
  assert.equal(util.inspect(result), util.inspect(dataAfter));
  assert.equal(dataAfter.stringData, val);
}

async function callAndsendTest2ActionChoices() {
  const val = "3";
  let result = await contractInstanceCall2.changeActionChoices(val).send({
    feeLimit:1000000000,
    callValue:0,
    tokenId:0,
    tokenValue:0,
    shouldPollResponse:true
  })
  assert.equal(util.inspect(result), "[ 3, enumData: 3 ]");
  const dataAfter = await contractInstanceCall2.getActionChoices().call();
  assert.equal(util.inspect(result), util.inspect(dataAfter));
  assert.equal(dataAfter.enumData, val);
      contractInstanceCall2.getActionChoices().call((err, data)=>{
    assert.equal(data.toString(),dataAfter.toString())
  });
}

async function callAndsendTest2int64Array() {
  const val = [-111,123];
  let result = await contractInstanceCall2.changeInt64NegativeArray(val).send({
    feeLimit:1000000000,
    callValue:0,
    tokenId:0,
    tokenValue:0,
    shouldPollResponse:true
  })
  result.int64Data[0].eq('-0x6f')
  result.int64Data[1].eq('0x7b')

  const dataAfter = await contractInstanceCall2.getInt64NegativeArray().call();
  assert.equal(util.inspect(result), util.inspect(dataAfter));
  assert.equal(parseInt(dataAfter.int64Data[0]._hex, 16), val[0]);
  assert.equal(parseInt(dataAfter.int64Data[1]._hex, 16), val[1]);
      contractInstanceCall2.getInt64NegativeArray().call((err, data)=>{
    assert.equal(data.toString(),dataAfter.toString())
  });
}

async function callAndsendTest2uint32TwodimensionalArray() {
  const val = [[122, 332], [991, 884]];
  let result = await     contractInstanceCall2.changeInt32Array(val).send({
    feeLimit:1000000000,
    callValue:0,
    tokenId:0,
    tokenValue:0,
    shouldPollResponse:true
  })
  assert.equal(util.inspect(result), "[ [ [ 122, 332 ], [ 991, 884 ] ],\n"
      + "  uint32ArrayData: [ [ 122, 332 ], [ 991, 884 ] ] ]");

  const dataAfter = await contractInstanceCall2.getInt32Array().call();
  assert.equal(util.inspect(result), util.inspect(dataAfter));
  assert.equal(dataAfter.uint32ArrayData[0][0], val[0][0]);
  assert.equal(dataAfter.uint32ArrayData[0][1], val[0][1]);
  assert.equal(dataAfter.uint32ArrayData[1][0], val[1][0]);
  assert.equal(dataAfter.uint32ArrayData[1][1], val[1][1]);
      contractInstanceCall2.getInt32Array().call((err, data)=>{
    assert.equal(data.toString(),dataAfter.toString())
  });
}

async function callAndsendTest2uint256TwodimensionalArray() {
  const val = [[100, 122], [133, 144]];
  let result = await contractInstanceCall2.changeInt256Array(val).send({
    feeLimit:1000000000,
    callValue:0,
    tokenId:0,
    tokenValue:0,
    shouldPollResponse:true
  })
  result.uint256ArrayData[0][0].eq('0x64')
  result.uint256ArrayData[0][1].eq('0x7a')
  result.uint256ArrayData[1][0].eq('0x85')
  result.uint256ArrayData[1][1].eq('0x90')

  const dataAfter = await contractInstanceCall2.getInt256Array().call();
  assert.equal(util.inspect(result), util.inspect(dataAfter));
  assert.equal(dataAfter.uint256ArrayData[0][0], val[0][0]);
  assert.equal(dataAfter.uint256ArrayData[0][1], val[0][1]);
  assert.equal(dataAfter.uint256ArrayData[1][0], val[1][0]);
  assert.equal(dataAfter.uint256ArrayData[1][1], val[1][1]);
      contractInstanceCall2.getInt256Array().call((err, data)=>{
    assert.equal(data.toString(),dataAfter.toString())
  });
};

async function callAndsendTest2setMappinga() {
  const address = tronWeb.address.fromPrivateKey(PRIVATE_KEY);

  const val = 1122;
  let result = await contractInstanceCall2.setMappinga(val).send({
    feeLimit:1000000000,
    callValue:0,
    tokenId:0,
    tokenValue:0,
    shouldPollResponse:true
  });
  result.uint256Data.eq('0x0462')

  const dataAfter = await contractInstanceCall2.getMappinga(address).call();
  assert.equal(util.inspect(result), util.inspect(dataAfter));
  assert.equal(dataAfter.uint256Data, val);
      contractInstanceCall2.getMappinga(address).call((err, data)=>{
    assert.equal(data.toString(),dataAfter.toString())
  });
}

async function methodTestAll(){
  console.log("methodTestAll start")
  await customError();
  await send();
  await call();
  await emptyAbiBefore();
  await abiTest1();
  await abiTest2();
  await abiTest3();
  await constantMethodWithParameters();
  await callAndsendTest1Before();
  await callAndsendTest1();
  await callAndsendTest2Before();
  await callAndsendTest2Int();
  await callAndsendTest2changeUint();
  await callAndsendTest2changeAddress();
  await callAndsendTest2changeBytes32();
  await callAndsendTest2changeBytes();
  await callAndsendTest2changeString();
  await callAndsendTest2ActionChoices();
  await callAndsendTest2int64Array();
  await callAndsendTest2uint32TwodimensionalArray();
  await callAndsendTest2uint256TwodimensionalArray();
  await callAndsendTest2setMappinga();
  console.log("methodTestAll end")
}

export{
  methodTestAll
}
