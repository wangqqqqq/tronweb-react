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
let contractAddress2 ="";
let contract;
let contract2;
let eventLength = 0;
let eventLength2 = 0;
let emptyAccount;

async function eventBefore(){
  tronWeb = tronWebBuilder.createInstance();

  let result = await broadcaster.broadcaster(tronWeb.transactionBuilder.createSmartContract({
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
  console.log("contractAddress: "+contractAddress)
  contract = await tronWeb.contract().at(contractAddress)

  let result2 = await broadcaster.broadcaster(tronWeb.transactionBuilder.createSmartContract({
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
  contractAddress2 = result2.receipt.transaction.contract_address
  console.log("contractAddress2: "+contractAddress2)
  contract2 = await tronWeb.contract().at(contractAddress2)
  accounts = await tronWebBuilder.getTestAccountsInMain(5);
  emptyAccount = await tronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount.address.hex,10000000,{privateKey: PRIVATE_KEY})
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
  const emptyAccount1 = await tronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount1.address.hex,1000000000,{privateKey: PRIVATE_KEY})

  let txId = await contract.emitNow(emptyAccount1.address.hex, 2000).send({
    from: ADDRESS_HEX
  })
  console.log("txId:"+txId)
  eventLength++
  let events
  while(true) {
    events = await tronWeb.event.getEventsByTransactionID(txId)
    if (events.length) {
      console.log("events:"+util.inspect(events,true,null,true))
      break
    }
    await wait(0.5)
  }

  console.log("events[0].result:"+util.inspect(events[0].result,true,null,true))
  if (!JSON.stringify('_receiver' in events[0].result)) {
    assert.equal(events[0].result._receiver.substring(2), emptyAccount1.address.hex.substring(2).toLowerCase())
    assert.equal(events[0].result._sender.substring(2), ADDRESS_HEX.substring(2).toLowerCase())
    assert.equal(events[0].result._amount, "2000")
  }
  assert.equal(events[0].resourceNode, 'fullNode')
  console.log("execute getEventsByTransactionIDWithUnconfirmed success")
}

async function getEventsByTransactionIDWithConfirmation(){
  const emptyAccount1 = await tronWeb.createAccount();
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
  await wait(90)

  let events
  while(true) {
    events = await tronWeb.event.getEventsByTransactionID(txId)
    if (events.length) {
      break
    }
    await wait(0.5)
  }

  if (!JSON.stringify('_receiver' in events[0].result)) {
    assert.equal(events[0].result._receiver.substring(2), emptyAccount1.address.hex.substring(2).toLowerCase())
    assert.equal(events[0].result._sender.substring(2), ADDRESS_HEX.substring(2).toLowerCase())
    assert.equal(events[0].result._amount, "2000")
  }
  assert.equal(events[0].resourceNode, 'solidityNode')
  console.log("execute getEventsByTransactionIDWithConfirmation success")
}

async function getEventsByContractAddress(){
  let output = await contract.emitNow(emptyAccount.address.hex, 4000).send({
    from: ADDRESS_HEX,
    rawResponse: true
  })
  let txId = output.id
  console.log("output:"+output)
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
  console.log("event:"+util.inspect(event,true,null,true))

  if (!JSON.stringify('_receiver' in events[0].result)) {
    assert.equal(events[0].result._receiver.substring(2), emptyAccount.address.hex.substring(2).toLowerCase())
    assert.equal(events[0].result._sender.substring(2), ADDRESS_HEX.substring(2).toLowerCase())
    assert.equal(events[0].result._amount, "4000")
  }
  assert.equal(event.resourceNode, 'fullNode')
  console.log("execute getEventsByContractAddress success")
}

async function onlyConfirmed(){
  console.log("accounts.pks[3]:"+accounts.pks[3])
  tronWeb.setPrivateKey(accounts.pks[3])
  for(var i = 0; i < 5; i++) {
    await contract2.emitNow(accounts.hex[4], 4000).send({
      from: accounts.hex[3]
    })
    eventLength++
  }
  await wait(60)

  let events
  // onlyConfirmed: false
  events = await tronWeb.getEventResult(contractAddress2, {
    eventName: 'SomeEvent',
    sort: 'block_timestamp',
    onlyConfirmed: false
  })
  console.log("events2:"+util.inspect(events,true,null,true))
  assert.equal(events.length, 5)
  for(var i = 0; i < events.length; i++) {
    if (Object.keys(events[i]).length == 7) {
      assert.equal(events[i].unconfirmed, undefined);
    } else if (Object.keys(events[i]).length == 8) {
      assert.isTrue(events[i].unconfirmed);
      assert.equal(events[i].resourceNode, 'fullNode')
    } else {
      assert.isTrue(false);
    }
  }

  await wait(60)
  for(var i = 0; i < 5; i++) {
    await contract2.emitNow(accounts.hex[4], 4000).send({
      from: accounts.hex[3]
    })
    eventLength++
  }
  // onlyConfirmed: true
  events = await tronWeb.getEventResult(contractAddress2, {
    eventName: 'SomeEvent',
    sort: 'block_timestamp',
    onlyConfirmed: true
  })

  console.log("events1:"+util.inspect(events,true,null,true))
  for(var i = 0; i < events.length; i++) {
    assert.equal(Object.keys(events[i]).length, 7);
    assert.equal(events[i].unconfirmed, undefined);
    assert.equal(events[i].resourceNode, 'solidityNode')
  }

  const event = events[events.length - 1]
  assert.equal(event.result._receiver.substring(2), accounts.hex[4].substring(2))
  assert.equal(event.result._sender.substring(2), accounts.hex[3].substring(2))

  console.log("execute onlyConfirmed success")
}

async function onlyUnconfirmed(){
  tronWeb.setPrivateKey(accounts.pks[3])
  for(var i = 0; i < 10; i++) {
    await contract2.emitNow(accounts.hex[4], 4000).send({
      from: accounts.hex[3]
    })
    eventLength++
  }
  console.log("contractAddress2:"+contractAddress2)
  await wait(50)



  let events
  // onlyUnconfirmed: true
  events = await tronWeb.getEventResult(contractAddress2, {
    eventName: 'SomeEvent',
    sort: 'block_timestamp',
    onlyUnconfirmed: true
  })
  console.log("events1:"+util.inspect(events,true,null,true))
  for(var i = 0; i < events.length; i++) {
    if (events[i].fingerprint == undefined) {
      assert.equal(Object.keys(events[i]).length, 8);
    } else {
      assert.equal(Object.keys(events[i]).length, 9);
    }
    assert.isTrue(events[i].unconfirmed);
    assert.equal(events[i].resourceNode, 'fullNode')
  }

  // onlyUnconfirmed: false
  let fingerprint = "";
  do{
    if (fingerprint == "") {
      events = await tronWeb.getEventResult(contractAddress2, {
        eventName: 'SomeEvent',
        sort: 'block_timestamp',
        onlyUnconfirmed: false,
      })
      assert.equal(events.length, 20)
    } else {
      events = await tronWeb.getEventResult(contractAddress2, {
        eventName: 'SomeEvent',
        sort: 'block_timestamp',
        onlyUnconfirmed: false,
        fingerprint: fingerprint,
      })
    }
    console.log("events2-"+fingerprint+":"+util.inspect(events,true,null,true))

    fingerprint = false;
    for(var i = 0; i < events.length; i++) {
      if (Object.keys(events[i]).length == 7) {
        assert.equal(events[i].unconfirmed, undefined);
        assert.equal(events[i].resourceNode, 'solidityNode')
      } else if (Object.keys(events[i]).length == 8) {
        if (events[i].resourceNode == 'fullNode') {
          assert.isTrue(events[i].unconfirmed);
        } else {
          assert.equal(events[i].unconfirmed, undefined);
        }
      } else {
        if (events[i].fingerprint == undefined) {
          assert.isTrue(false);
        }
      }
      // has next page
      fingerprint = events[i].fingerprint == undefined ? "" : events[i].fingerprint;
    }

    if (events.length > 0) {
      const event = events[events.length - 1]
      assert.equal(event.result._receiver.substring(2), accounts.hex[4].substring(2))
      assert.equal(event.result._sender.substring(2), accounts.hex[3].substring(2))
    }
  } while (fingerprint.length > 7);

  console.log("execute onlyUnconfirmed success")
}

async function onlyConfirmedAndOnlyUnconfirmed(){
  tronWeb.setPrivateKey(accounts.pks[3])
  for(var i = 0; i < 10; i++) {
    await contract2.emitNow(accounts.hex[4], 4000).send({
      from: accounts.hex[3]
    })
    eventLength++
  }
  await wait(50)

  let events
  // onlyConfirmed: false,onlyUnconfirmed: true
  events = await tronWeb.getEventResult(contractAddress2, {
    eventName: 'SomeEvent',
    sort: 'block_timestamp',
    onlyConfirmed: false,
    onlyUnconfirmed: true
  })
  console.log("events5:"+util.inspect(events,true,null,true))
  for(var i = 0; i < events.length; i++) {
    assert.equal(Object.keys(events[i]).length, 8);
    assert.isTrue(events[i].unconfirmed);
    assert.equal(events[i].resourceNode, 'fullNode')
  }

  // onlyConfirmed: true,onlyUnconfirmed: false
  events = await tronWeb.getEventResult(contractAddress2, {
    eventName: 'SomeEvent',
    sort: 'block_timestamp',
    onlyConfirmed: true,
    onlyUnconfirmed: false,
    size:40,
  })
  console.log("events6:"+util.inspect(events,true,null,true))
  for(var i = 0; i < events.length; i++) {
    assert.equal(Object.keys(events[i]).length, 7);
    assert.equal(events[i].unconfirmed, undefined);
    assert.equal(events[i].resourceNode, 'solidityNode')
  }

  // onlyConfirmed: false,onlyUnconfirmed: false
  events = await tronWeb.getEventResult(contractAddress2, {
    eventName: 'SomeEvent',
    sort: 'block_timestamp',
    onlyConfirmed: false,
    onlyUnconfirmed: false,
    size:40
  })
  assert.equal(events.length, 30)
  console.log("events7:"+util.inspect(events,true,null,true))
  for(var i = 0; i < events.length; i++) {
    if (Object.keys(events[i]).length == 7) {
      assert.equal(events[i].unconfirmed, undefined);
      assert.equal(events[i].resourceNode, 'solidityNode')
    } else if (Object.keys(events[i]).length == 8) {
      if (events[i].resourceNode == 'fullNode') {
        assert.isTrue(events[i].unconfirmed);
      } else {
        assert.equal(events[i].unconfirmed, undefined);
      }
    } else {
      if (events[i].fingerprint == undefined) {
        assert.isTrue(false);
      }
    }
  }

  const event = events[events.length - 1]
  assert.equal(event.result._receiver.substring(2), accounts.hex[4].substring(2))
  assert.equal(event.result._sender.substring(2), accounts.hex[3].substring(2))

  console.log("execute onlyConfirmedAndOnlyUnconfirmed success")
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

async function watchWithSize(){
  let index = 0
  contract = await tronWeb.contract().at("41ea51342dabbb928ae1e576bd39eff8aaf070a8c6")
  let watchTest = await contract.Transfer().watch({size: "2"}, (err, res) => {
    if(res) {
      index++
      console.log("res:"+util.inspect(res))
      if (index == 2) {
        watchTest.stop() // Calls stop on itself when successful
      }
    }
  })
  console.log("execute watchWithSize success")
}

async function eventTestAll(){
  console.log("eventTestAll start")
  await eventBefore();
  await generateAccount();
  await getEventsByTransactionIDWithUnconfirmed();
  await getEventsByTransactionIDWithConfirmation();
  await getEventsByContractAddress();
  await onlyConfirmed();
  await onlyUnconfirmed();
  await onlyConfirmedAndOnlyUnconfirmed();
  await watchForAnEvent();
  await watchForAnEventWithGivenFilters();
  await watchWithSize();
  console.log("eventTestAll end")
}

export{
  eventTestAll
}
