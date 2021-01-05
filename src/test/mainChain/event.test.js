import React from 'react';
const {ADDRESS_BASE58,ADDRESS_HEX,PRIVATE_KEY, FEE_LIMIT} = require('../util/config');
const testDeployRevert = require('../util/contracts').testDeployRevert;
const testTriggerError = require('../util/contracts').testTriggerError;
const trc20Contract = require('../util/contracts').trc20Contract;
const tronWebBuilder = require('../util/tronWebBuilder');
const broadcaster = require('../util/broadcaster');
const publicMethod = require('../util/PublicMethod');
const TronWeb = tronWebBuilder.TronWeb;
const wait = require('../util/wait');
const chai = require('chai');
const assert = chai.assert;
const util = require('util');
let accounts;
let tronWeb;
let contractAddress ="";
let contract;
let eventLength = 0;
let emptyAccount;

async function eventBefore(){
  tronWeb = tronWebBuilder.createInstance();

  const result = await broadcaster.broadcaster(tronWeb.transactionBuilder.createSmartContract({
    abi: [
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "name": "_sender",
            "type": "address"
          },
          {
            "indexed": false,
            "name": "_receiver",
            "type": "address"
          },
          {
            "indexed": false,
            "name": "_amount",
            "type": "uint256"
          }
        ],
        "name": "SomeEvent",
        "type": "event"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_receiver",
            "type": "address"
          },
          {
            "name": "_someAmount",
            "type": "uint256"
          }
        ],
        "name": "emitNow",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      }
    ],
    bytecode: "0x608060405234801561001057600080fd5b50610145806100206000396000f300608060405260043610610041576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff168063bed7111f14610046575b600080fd5b34801561005257600080fd5b50610091600480360381019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919080359060200190929190505050610093565b005b3373ffffffffffffffffffffffffffffffffffffffff167f9f08738e168c835bbaf7483705fb1c0a04a1a3258dd9687f14d430948e04e3298383604051808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018281526020019250505060405180910390a250505600a165627a7a7230582033629e2b0bba53f7b5c49769e7e360f2803ae85ac80e69dd61c7bb48f9f401f30029"
  }, ADDRESS_HEX), PRIVATE_KEY)

  contractAddress = result.receipt.transaction.contract_address
  // setTimeout(10000)
  console.log("contractAddress: "+contractAddress)
  contract = await tronWeb.contract().at(contractAddress)
}

async function generateAccount(){
  const newAccount = await tronWeb.createAccount();
  assert.equal(newAccount.privateKey.length, 64);
  assert.equal(newAccount.publicKey.length, 130);
  let address = tronWeb.address.fromPrivateKey(newAccount.privateKey);
  assert.equal(address, newAccount.address.base58);

  assert.equal(tronWeb.address.toHex(address), newAccount.address.hex.toLowerCase());
  console.log("execute generateAccount success")
}

async function getEventsByTransactionIDWithUnconfirmed(){
  assert.instanceOf(tronWeb.event, TronWeb.Event);
  const emptyAccount1 = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount1.address.hex,1000000000,{privateKey: PRIVATE_KEY})
  setTimeout(60000)

  let txId = await contract.emitNow(emptyAccount1.address.hex, 2000).send({
    from: ADDRESS_HEX
  })
  console.log("txId:"+txId)

  eventLength++
  let events
  while(true) {
    events = await tronWeb.event.getEventsByTransactionID(txId)
    if (events.length) {
      break
    }
    await wait(0.5)
  }

  assert.equal(events[0].result._receiver.substring(2), emptyAccount1.address.hex.substring(2).toLowerCase())
  assert.equal(events[0].result._sender.substring(2), ADDRESS_HEX.substring(2).toLowerCase())
  assert.equal(events[0].result._amount, "2000")
  assert.equal(events[0].resourceNode, 'fullNode')
  console.log("execute getEventsByTransactionIDWithUnconfirmed success")
}

async function getEventsByTransactionIDWithConfirmation(){
  const emptyAccount1 = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount1.address.hex,100000000,{privateKey: PRIVATE_KEY})
  setTimeout(60000)

  let output = await contract.emitNow(emptyAccount1.address.hex, 2000).send({
    from: ADDRESS_HEX,
    shouldPollResponse: true,
    rawResponse: true
  })
  let txId = output.id
  console.log("txId:"+txId)
  eventLength++

  let events
  while(true) {
    events = await tronWeb.event.getEventsByTransactionID(txId)
    if (events.length) {
      break
    }
    await wait(0.5)
  }

  assert.equal(events[0].result._receiver.substring(2), emptyAccount1.address.hex.substring(2).toLowerCase())
  assert.equal(events[0].result._sender.substring(2), ADDRESS_HEX.substring(2).toLowerCase())
  assert.equal(events[0].result._amount, "2000")
  assert.equal(events[0].resourceNode, 'solidityNode')
  console.log("execute getEventsByTransactionIDWithConfirmation success")
}

async function getEventsByContractAddress(){
  emptyAccount = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount.address.hex,1000000000,{privateKey: PRIVATE_KEY})
  setTimeout(60000)

  await contract.emitNow(emptyAccount.address.hex, 4000).send({
    from: ADDRESS_HEX
  })
  eventLength++
  let events
  while(true) {
    events = await tronWeb.event.getEventsByContractAddress(contractAddress, {
      eventName: 'SomeEvent',
      sort: 'block_timestamp'
    })
    if (events.length === eventLength) {
      break
    }
    await wait(0.5)
  }

  const event = events[events.length - 1]

  assert.equal(event.result._receiver.substring(2), emptyAccount.address.hex.substring(2).toLowerCase())
  assert.equal(event.result._sender.substring(2), ADDRESS_HEX.substring(2).toLowerCase())
  assert.equal(event.result._amount, "4000")
  assert.equal(event.resourceNode, 'fullNode')
  console.log("execute getEventsByContractAddress success")
}


async function getEventResult(){
  let tronWeb = tronWebBuilder.createInstance();
  const result = await broadcaster.broadcaster(tronWeb.transactionBuilder.createSmartContract({
    abi: [
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "name": "_sender",
            "type": "address"
          },
          {
            "indexed": false,
            "name": "_receiver",
            "type": "address"
          },
          {
            "indexed": false,
            "name": "_amount",
            "type": "uint256"
          }
        ],
        "name": "SomeEvent",
        "type": "event"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_receiver",
            "type": "address"
          },
          {
            "name": "_someAmount",
            "type": "uint256"
          }
        ],
        "name": "emitNow",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      }
    ],
    bytecode: "0x608060405234801561001057600080fd5b50610145806100206000396000f300608060405260043610610041576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff168063bed7111f14610046575b600080fd5b34801561005257600080fd5b50610091600480360381019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919080359060200190929190505050610093565b005b3373ffffffffffffffffffffffffffffffffffffffff167f9f08738e168c835bbaf7483705fb1c0a04a1a3258dd9687f14d430948e04e3298383604051808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018281526020019250505060405180910390a250505600a165627a7a7230582033629e2b0bba53f7b5c49769e7e360f2803ae85ac80e69dd61c7bb48f9f401f30029"
  }, ADDRESS_HEX), PRIVATE_KEY)
  let contractAddress = result.receipt.transaction.contract_address
  let contract = await tronWeb.contract().at(contractAddress)
  let eventLength = 0

  setTimeout(80000)
  let txId = await contract.emitNow(emptyAccount.address.hex, 3000).send({
    from: ADDRESS_HEX
  })
  eventLength++
  let events
  while (true) {
    events = await tronWeb.getEventResult(contractAddress, {
      eventName: 'SomeEvent',
      sort: 'block_timestamp'
    })
    if (events.length === eventLength) {
      break
    }
    await wait(0.5)
  }

  const event = events[events.length - 1]

  assert.equal(event.result._receiver.substring(2), emptyAccount.address.hex.substring(2).toLowerCase())
  assert.equal(event.result._sender.substring(2), ADDRESS_HEX.substring(2).toLowerCase())
  assert.equal(event.result._amount, "3000")
  assert.equal(event.resourceNode, 'fullNode')
  console.log("execute getEventResult success")
}

async function watchForAnEvent(){
  setTimeout(20000)

  let watchTest = await contract.SomeEvent().watch((err, res) => {
    if(res) {
      assert.equal(res.result._sender.substring(2), ADDRESS_HEX.substring(2).toLowerCase())
      assert.equal(res.result._receiver.substring(2), emptyAccount.address.hex.substring(2).toLowerCase())
      assert.equal(res.result._amount, 4000)

      watchTest.stop() // Calls stop on itself when successful
    }
  })

  contract.emitNow(emptyAccount.address.hex, 4000).send({
    from: ADDRESS_HEX
  })
  console.log("execute watchForAnEvent success")
}

async function watchForAnEventWithGivenFilters(){
  setTimeout(20000)

  let watchTest = await contract.SomeEvent().watch({filters: {"_amount": "4000"}}, (err, res) => {
    if(res) {
      assert.equal(res.result._sender.substring(2), ADDRESS_HEX.substring(2).toLowerCase())
      assert.equal(res.result._receiver.substring(2), emptyAccount.address.hex.substring(2).toLowerCase())
      assert.equal(res.result._amount, 4000)

      watchTest.stop() // Calls stop on itself when successful
    }
  })

  contract.emitNow(emptyAccount.address.hex, 4000).send({
    from: ADDRESS_HEX
  })
  console.log("execute watchForAnEventWithGivenFilters success")
}

async function eventTestAll(){
  console.log("eventTestAll start")
  await eventBefore();
  await generateAccount();
  await getEventsByTransactionIDWithUnconfirmed();
  await getEventsByTransactionIDWithConfirmation();
  await getEventsByContractAddress();
  await getEventResult();
  await watchForAnEvent();
  await watchForAnEventWithGivenFilters();
  console.log("eventTestAll end")
}

export{
  eventBefore,
  getEventsByTransactionIDWithUnconfirmed,
  getEventsByTransactionIDWithConfirmation,
  getEventsByContractAddress,
  getEventResult,
  watchForAnEvent,
  watchForAnEventWithGivenFilters,
  eventTestAll
}
