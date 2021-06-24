import React from 'react';
const {PRIVATE_KEY, ADDRESS_HEX, ADDRESS_BASE58} = require('../util/config');
const testRevertContract = require('../util/contracts').testRevert;
const testSetValContract = require('../util/contracts').testSetVal;
const testEmptyAbi = require('../util/contracts').testEmptyAbi;
const tronWebBuilder = require('../util/tronWebBuilder');
const assertThrow = require('../util/assertThrow');
const broadcaster = require('../util/broadcaster');
const wait = require('../util/wait');
const TronWeb = tronWebBuilder.TronWeb;
const chai = require('chai');
const util = require('util');
const assert = chai.assert;
let tronWeb = tronWebBuilder.createInstance();
let contractAddress1;
let contractAddress2;
let contractAddress3;

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
  while (true) {
    triggerInfo = await tronWeb.trx.getTransactionInfo(triggerTx.transaction.txID);
    if (Object.keys(triggerInfo).length === 0) {
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
  while (true) {
    triggerInfo2 = await tronWeb.trx.getTransactionInfo(triggerTx2.transaction.txID);
    if (Object.keys(triggerInfo2).length === 0) {
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
  while (true) {
    let clearAbiInfo = await tronWeb.trx.getTransactionInfo(clearAbiTx.transaction.txID);
    if (Object.keys(clearAbiInfo).length === 0) {
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
  while (true) {
    triggerInfo3 = await tronWeb.trx.getTransactionInfo(triggerTx3.transaction.txID);
    if (Object.keys(triggerInfo3).length === 0) {
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

async function methodTestAll(){
  console.log("methodTestAll start")
  await send();
  await call();
  await emptyAbiBefore();
  await abiTest1();
  await abiTest2();
  await abiTest3();
  console.log("methodTestAll end")
}

export{
  methodTestAll
}
