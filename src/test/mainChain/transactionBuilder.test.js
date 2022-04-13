import React from 'react';
const {ADDRESS_BASE58,ADDRESS_HEX,PRIVATE_KEY, UPDATED_TEST_TOKEN_OPTIONS, TOKEN_ID, getTokenOptions, isProposalApproved, FEE_LIMIT} = require('../util/config');
const { equals, getValues } = require('../util/testUtils');
const {testRevert, testConstant, arrayParam, tronToken, testAddressArray, trcTokenTest070, trcTokenTest059, funcABIV2, funcABIV2_2, funcABIV2_3, funcABIV2_4, abiV2Test1} = require('../util/contracts');
const tronWebBuilder = require('../util/tronWebBuilder');
const assertEqualHex = require('../util/assertEqualHex');
const waitChainData = require('../util/waitChainData');
const pollAccountFor = require('../util/pollAccountFor');
const publicMethod = require('../util/PublicMethod');
const assertThrow = require('../util/assertThrow');
const broadcaster = require('../util/broadcaster');
const txPars = require('../util/txPars');
const TronWeb = tronWebBuilder.TronWeb;
const wait = require('../util/wait');
const chai = require('chai');
const assert = chai.assert;
const util = require('util');
let tronWeb;
let emptyAccounts;
let isAllowSameTokenNameApproved
let emptyAccount6;

async function transactionBuilderBefore(){
  tronWeb = tronWebBuilder.createInstance();
  emptyAccounts = await TronWeb.createAccount();
  isAllowSameTokenNameApproved = await isProposalApproved(tronWeb, 'getAllowSameTokenName')
  emptyAccount6 = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount6.address.hex,5000000000,{privateKey: PRIVATE_KEY})

  assert.instanceOf(tronWeb.transactionBuilder, TronWeb.TransactionBuilder);
  console.log("transactionBuilderBefore excute success")
}

async function sendTrx(){
  const emptyAccount = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount.address.hex,5000000000,{privateKey: PRIVATE_KEY})
  const emptyAccount1 = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount1.address.hex,5000000000,{privateKey: PRIVATE_KEY})
  const emptyAccount2 = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount2.address.hex,5000000000,{privateKey: PRIVATE_KEY})
  const emptyAccount3 = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount3.address.hex,5000000000,{privateKey: PRIVATE_KEY})

  let params = [
    [emptyAccount1.address.base58, 10, {permissionId: 2}],
    [emptyAccount1.address.base58, 10]
  ];
  for (let param of params) {
    const transaction = await tronWeb.transactionBuilder.sendTrx(...param);

    const parameter = txPars(transaction);

    assert.equal(transaction.txID.length, 64);
    assert.equal(parameter.value.amount, 10);
    assert.equal(parameter.value.owner_address, ADDRESS_HEX);
    assert.equal(parameter.value.to_address, emptyAccount1.address.hex.toLowerCase());
    assert.equal(parameter.type_url, 'type.googleapis.com/protocol.TransferContract');
    assert.equal(transaction.raw_data.contract[0].Permission_id || 0, param[2] ? param[2]['permissionId'] : 0);
  }

  params = [
    [emptyAccount1.address.base58, 10, emptyAccount.address.base58, {permissionId: 2}],
    [emptyAccount1.address.base58, 10, emptyAccount.address.base58]
  ];
  for (let param of params) {
    const transaction = await tronWeb.transactionBuilder.sendTrx(...param);
    const parameter = txPars(transaction);

    assert.equal(transaction.txID.length, 64);
    assert.equal(parameter.value.amount, 10);
    assert.equal(parameter.value.owner_address, emptyAccount.address.hex.toLowerCase());
    assert.equal(parameter.value.to_address, emptyAccount1.address.hex.toLowerCase());
    assert.equal(parameter.type_url, 'type.googleapis.com/protocol.TransferContract');
    assert.equal(transaction.raw_data.contract[0].Permission_id || 0, param[3] ? param[3]['permissionId'] : 0);
  }

  await assertThrow(
      tronWeb.transactionBuilder.sendTrx('40f0b27e3d16060a5b0e8e995120e00', 10),
      'Invalid recipient address provided'
  );

  await assertThrow(
      tronWeb.transactionBuilder.sendTrx(emptyAccount2.address.hex, -10),
      'Invalid amount provided'
  );

  await assertThrow(
      tronWeb.transactionBuilder.sendTrx(emptyAccount3.address.hex, 10, '40f0b27e3d16060a5b0e8e995120e00'),
      'Invalid origin address provided'
  );

  await assertThrow(
      tronWeb.transactionBuilder.sendTrx(emptyAccount3.address.hex, 10, emptyAccount3.address.hex),
      'Cannot transfer TRX to the same account'
  );

  await assertThrow(
      tronWeb.transactionBuilder.sendTrx(emptyAccount3.address.hex, 10, emptyAccounts.address.base58),
      null,
      'ContractValidateException'
  );
}

async function createToken(){
  const emptyAccount1 = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount1.address.hex,5000000000,{privateKey: PRIVATE_KEY})
  const emptyAccount2 = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount2.address.hex,5000000000,{privateKey: PRIVATE_KEY})
  const emptyAccount3 = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount3.address.hex,5000000000,{privateKey: PRIVATE_KEY})
  const emptyAccount4 = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount4.address.hex,5000000000,{privateKey: PRIVATE_KEY})
  const emptyAccount5 = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount5.address.hex,5000000000,{privateKey: PRIVATE_KEY})

  let options = getTokenOptions();

  for (let i = 0; i < 2; i++) {
    if (i === 1) {
      options.permissionId = 2;
    }
    const transaction = await tronWeb.transactionBuilder.createToken(options, emptyAccount1.address.base58);
    const parameter = txPars(transaction);
    assert.equal(transaction.txID.length, 64);
    assert.equal(parameter.value.total_supply, options.totalSupply);
    await assertEqualHex(parameter.value.abbr, options.abbreviation);
    assert.equal(parameter.value.owner_address, emptyAccount1.address.hex.toLowerCase());
    assert.equal(parameter.type_url, 'type.googleapis.com/protocol.AssetIssueContract');
    assert.equal(transaction.raw_data.contract[0].Permission_id || 0, options.permissionId || 0);
  }

  if (isAllowSameTokenNameApproved) {
    const options = getTokenOptions();
    options.voteScore = 5;
    options.precision = 4;

    let tempAccount = emptyAccount2;

    for (let i = 0; i < 2; i++) {
      if (i === 1) {
        options.permissionId = 2;
        tempAccount = emptyAccount3;
      }
      console.log("111")
      options.saleStart = options.saleStart + 20000;
      const transaction = await tronWeb.transactionBuilder.createToken(options, tempAccount.address.base58);
      console.log("222")

      const parameter = txPars(transaction);
      assert.equal(transaction.txID.length, 64);
      assert.equal(parameter.value.vote_score, options.voteScore);
      assert.equal(parameter.value.precision, options.precision);
      assert.equal(parameter.value.total_supply, options.totalSupply);
      await assertEqualHex(parameter.value.abbr, options.abbreviation);
      assert.equal(parameter.value.owner_address, tempAccount.address.hex.toLowerCase());
      assert.equal(parameter.type_url, 'type.googleapis.com/protocol.AssetIssueContract');
      assert.equal(transaction.raw_data.contract[0].Permission_id || 0, options.permissionId || 0);

      const triggerTx = await broadcaster.broadcaster(null, tempAccount.privateKey, transaction)
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
      console.log("tempAccount.address.base58:"+tempAccount.address.base58)
      const tokenList = await tronWeb.trx.getTokensIssuedByAddress(tempAccount.address.base58)
      console.log("tokenList:"+util.inspect(tokenList,true,null,true))
      const tokenID = tokenList[options.name].id
      const token = await tronWeb.trx.getTokenByID(tokenID)

      assert.equal(token.vote_score, options.voteScore);
      assert.equal(token.precision, options.precision);
    }
  } else {
    this.skip()
  }

  console.log("3333")
  options = getTokenOptions();
  options.totalSupply = '100'
  options.frozenAmount = '5'
  options.frozenDuration = '2'
  let accounts = await tronWebBuilder.getTestAccountsInMain(2);
  for (let i = 0; i < 2; i++) {
    if (i === 1) options.permissionId = 2;
    const transaction = await tronWeb.transactionBuilder.createToken(options,accounts.hex[i]);
    const parameter = txPars(transaction);
    await assertEqualHex(parameter.value.abbr, options.abbreviation);
    assert.equal(transaction.raw_data.contract[0].Permission_id || 0, options.permissionId || 0);
  }

  console.log("4444")
  options = getTokenOptions();
  options.totalSupply = '100'
  options.frozenAmount = '0'
  options.frozenDuration = '0'

  for (let i = 0; i < 2; i++) {
    if (i === 1) options.permissionId = 2;
    const transaction = await tronWeb.transactionBuilder.createToken(options,accounts.hex[i]);
    const parameter = txPars(transaction);
    await assertEqualHex(parameter.value.abbr, options.abbreviation);
    assert.equal(transaction.raw_data.contract[0].Permission_id || 0, options.permissionId || 0);
  }


  if (isAllowSameTokenNameApproved) {

    const options = getTokenOptions();

    console.log("5555")

    options.precision = 0;
    let transaction = await tronWeb.transactionBuilder.createToken(options, emptyAccount4.address.base58);
    let parameter = txPars(transaction);
    console.log("parameter: "+util.inspect(parameter,true,null,true));
    const precision = typeof (parameter.value.precision) === 'number' ? (parameter.value.precision) : 0;
    assert.equal(transaction.txID.length, 64);
    assert.equal(parameter.value.vote_score, options.voteScore);
    assert.equal(precision, options.precision);
    assert.equal(parameter.value.total_supply, options.totalSupply);
    await assertEqualHex(parameter.value.abbr, options.abbreviation);
    assert.equal(parameter.value.owner_address, emptyAccount4.address.hex.toLowerCase());
    assert.equal(parameter.type_url, 'type.googleapis.com/protocol.AssetIssueContract');
    await broadcaster.broadcaster(null, emptyAccount4.privateKey, transaction)
    let tokenList = await tronWeb.trx.getTokensIssuedByAddress(emptyAccount4.address.base58)
    let tokenID = tokenList[options.name].id
    let token = await tronWeb.trx.getTokenByID(tokenID)
    const tokenPrecision = typeof (token.precision) === 'number' ? (token.precision) : 0;
    assert.equal(tokenPrecision, options.precision);

    console.log("66666")
    options.precision = 6;

    transaction = await tronWeb.transactionBuilder.createToken(options, emptyAccount5.address.base58);
    parameter = txPars(transaction);
    console.log("parameter: "+util.inspect(parameter,true,null,true));
    assert.equal(transaction.txID.length, 64);
    assert.equal(parameter.value.vote_score, options.voteScore);
    assert.equal(parameter.value.precision, options.precision);
    assert.equal(parameter.value.total_supply, options.totalSupply);
    await assertEqualHex(parameter.value.abbr, options.abbreviation);
    assert.equal(parameter.value.owner_address, emptyAccount5.address.hex.toLowerCase());
    assert.equal(parameter.type_url, 'type.googleapis.com/protocol.AssetIssueContract');
    await broadcaster.broadcaster(null, emptyAccount5.privateKey, transaction)
    tokenList = await tronWeb.trx.getTokensIssuedByAddress(emptyAccount5.address.base58)
    tokenID = tokenList[options.name].id
    token = await tronWeb.trx.getTokenByID(tokenID)
    assert.equal(token.precision, options.precision);
  } else {
    this.skip()
  }

  tronWeb.setPrivateKey(accounts.pks[0])
  options = getTokenOptions();
  options.name = 123;
  await assertThrow(
      tronWeb.transactionBuilder.createToken(options),
      'Invalid token name provided'
  );

  options = getTokenOptions();
  options.abbreviation = 123;
  await assertThrow(
      tronWeb.transactionBuilder.createToken(options),
      'Invalid token abbreviation provided'
  );

  options = getTokenOptions();
  options.totalSupply = [];
  await assertThrow(
      tronWeb.transactionBuilder.createToken(options),
      'Supply amount must be a positive integer'
  );

  options = getTokenOptions();
  options.trxRatio = {};
  await assertThrow(
      tronWeb.transactionBuilder.createToken(options),
      'TRX ratio must be a positive integer'
  );

  options = getTokenOptions();
  options.tokenRatio = 'tokenRatio';
  await assertThrow(
      tronWeb.transactionBuilder.createToken(options),
      'Token ratio must be a positive integer'
  );

  options = getTokenOptions();
  options.saleStart = Date.now() - 1;
  await assertThrow(
      tronWeb.transactionBuilder.createToken(options),
      'Invalid sale start timestamp provided'
  );

  options.saleStart = 'something';
  await assertThrow(
      tronWeb.transactionBuilder.createToken(options),
      'Invalid sale start timestamp provided'
  );

  options = getTokenOptions();
  options.saleEnd = Date.now() - 1000;

  await assertThrow(
      tronWeb.transactionBuilder.createToken(options),
      'Invalid sale end timestamp provided'
  );

  options.saleEnd = 'something';
  await assertThrow(
      tronWeb.transactionBuilder.createToken(options),
      'Invalid sale end timestamp provided'
  );

  options = getTokenOptions();
  options.description = 123;

  await assertThrow(
      tronWeb.transactionBuilder.createToken(options),
      'Invalid token description provided'
  );

  options.description = '';
  await assertThrow(
      tronWeb.transactionBuilder.createToken(options),
      'Invalid token description provided'
  );

  options = getTokenOptions();
  options.url = 123;
  await assertThrow(
      tronWeb.transactionBuilder.createToken(options),
      'Invalid token url provided'
  );

  options.url = '';
  await assertThrow(
      tronWeb.transactionBuilder.createToken(options),
      'Invalid token url provided'
  );

  options.url = '//www.example.com';
  await assertThrow(
      tronWeb.transactionBuilder.createToken(options),
      'Invalid token url provided'
  );

  options = getTokenOptions();
  options.freeBandwidth = -1;
  await assertThrow(
      tronWeb.transactionBuilder.createToken(options),
      'Invalid Free bandwidth amount provided'
  );

  options.freeBandwidth = 'something';
  await assertThrow(
      tronWeb.transactionBuilder.createToken(options),
      'Invalid Free bandwidth amount provided'
  );

  options = getTokenOptions();
  options.freeBandwidth = 10;
  delete options.freeBandwidthLimit;
  await assertThrow(
      tronWeb.transactionBuilder.createToken(options),
      'Invalid Free bandwidth limit provided'
  );

  options.freeBandwidthLimit = 'something';
  await assertThrow(
      tronWeb.transactionBuilder.createToken(options),
      'Invalid Free bandwidth limit provided'
  );

  options = getTokenOptions();
  options.frozenAmount = -1;
  await assertThrow(
      tronWeb.transactionBuilder.createToken(options),
      'Invalid Frozen supply provided'
  );

  options.frozenAmount = 'something';
  await assertThrow(
      tronWeb.transactionBuilder.createToken(options),
      'Invalid Frozen supply provided'
  );

  options = getTokenOptions();
  options.frozenDuration = 'something';
  await assertThrow(
      tronWeb.transactionBuilder.createToken(options),
      'Invalid Frozen duration provided'
  );

  options = getTokenOptions();
  await assertThrow(
      tronWeb.transactionBuilder.createToken(options, '0xzzzww'),
      'Invalid issuer address provided'
  );

  options = getTokenOptions();
  options.precision = -1;

  await assertThrow(
      tronWeb.transactionBuilder.createToken(options),
      'precision must be a positive integer >= 0 and <= 6'
  );

  options.precision = 7;
  await assertThrow(
      tronWeb.transactionBuilder.createToken(options),
      'precision must be a positive integer >= 0 and <= 6'
  );

  console.log("777777")
  options = getTokenOptions();
  const transaction = await tronWeb.transactionBuilder.createAsset(options, emptyAccount6.address.base58);
  const parameter = txPars(transaction);
  assert.equal(transaction.txID.length, 64);
  assert.equal(parameter.value.total_supply, options.totalSupply);
  await assertEqualHex(parameter.value.abbr, options.abbreviation);
  assert.equal(parameter.value.owner_address, emptyAccount6.address.hex.toLowerCase());
  assert.equal(parameter.type_url, 'type.googleapis.com/protocol.AssetIssueContract');

  console.log("execute createToken success")
}

async function updateToken(){
  const emptyAccount1 = emptyAccount6;

  let tokenOptions = getTokenOptions();

  let tokenID;
  await broadcaster.broadcaster(tronWeb.transactionBuilder.createToken(tokenOptions, emptyAccount1.address.base58), emptyAccount1.privateKey)
  let tokenList
  while (!tokenList) {
    tokenList = await tronWeb.trx.getTokensIssuedByAddress(emptyAccount1.address.base58)
  }
  if (isAllowSameTokenNameApproved) {
    tokenID = tokenList[tokenOptions.name].id
  } else {
    tokenID = tokenList[tokenOptions.name].name
  }

  for (let i = 0; i < 2; i++) {
    if (i === 1) UPDATED_TEST_TOKEN_OPTIONS.permissionId = 2;
    const transaction = await tronWeb.transactionBuilder.updateToken(UPDATED_TEST_TOKEN_OPTIONS, emptyAccount1.address.base58);
    const parameter = txPars(transaction);
    assert.equal(transaction.txID.length, 64);
    await assertEqualHex(parameter.value.description, UPDATED_TEST_TOKEN_OPTIONS.description);
    await assertEqualHex(parameter.value.url, UPDATED_TEST_TOKEN_OPTIONS.url);
    assert.equal(parameter.value.owner_address, emptyAccount1.address.hex.toLowerCase());
    assert.equal(parameter.type_url, 'type.googleapis.com/protocol.UpdateAssetContract');
    assert.equal(transaction.raw_data.contract[0].Permission_id || 0, UPDATED_TEST_TOKEN_OPTIONS.permissionId || 0);
  }

  let options = _.clone(UPDATED_TEST_TOKEN_OPTIONS);
  options.description = 123;
  await assertThrow(
      tronWeb.transactionBuilder.updateToken(options, emptyAccount1.address.hex),
      'Invalid token description provided'
  );

  options.description = '';
  await assertThrow(
      tronWeb.transactionBuilder.updateToken(options, emptyAccount1.address.hex),
      'Invalid token description provided'
  );

  options = _.clone(UPDATED_TEST_TOKEN_OPTIONS);
  options.url = 123;
  await assertThrow(
      tronWeb.transactionBuilder.updateToken(options, emptyAccount1.address.hex),
      'Invalid token url provided'
  );

  options.url = '';
  await assertThrow(
      tronWeb.transactionBuilder.updateToken(options, emptyAccount1.address.hex),
      'Invalid token url provided'
  );

  options.url = '//www.example.com';
  await assertThrow(
      tronWeb.transactionBuilder.updateToken(options, emptyAccount1.address.hex),
      'Invalid token url provided'
  );

  options = _.clone(UPDATED_TEST_TOKEN_OPTIONS);
  options.freeBandwidth = -1;
  await assertThrow(
      tronWeb.transactionBuilder.updateToken(options, emptyAccount1.address.hex),
      'Free bandwidth amount must be a positive integer'
  );

  options.freeBandwidth = 'something';
  await assertThrow(
      tronWeb.transactionBuilder.updateToken(options, emptyAccount1.address.hex),
      'Free bandwidth amount must be a positive integer'
  );

  options = _.clone(UPDATED_TEST_TOKEN_OPTIONS);
  options.freeBandwidth = 10;
  delete options.freeBandwidthLimit;
  await assertThrow(
      tronWeb.transactionBuilder.updateToken(options, emptyAccount1.address.hex),
      'Free bandwidth limit must be a positive integer'
  );

  options.freeBandwidthLimit = 'something';
  await assertThrow(
      tronWeb.transactionBuilder.updateToken(options, emptyAccount1.address.hex),
      'Free bandwidth limit must be a positive integer'
  );

  await assertThrow(
      tronWeb.transactionBuilder.updateToken(UPDATED_TEST_TOKEN_OPTIONS, '0xzzzww'),
      'Invalid issuer address provided'
  );

  const transaction = await tronWeb.transactionBuilder.updateAsset(UPDATED_TEST_TOKEN_OPTIONS, emptyAccount1.address.base58);
  const parameter = txPars(transaction);
  assert.equal(transaction.txID.length, 64);
  await assertEqualHex(parameter.value.description, UPDATED_TEST_TOKEN_OPTIONS.description);
  await assertEqualHex(parameter.value.url, UPDATED_TEST_TOKEN_OPTIONS.url);
  assert.equal(parameter.value.owner_address, emptyAccount1.address.hex.toLowerCase());
  assert.equal(parameter.type_url, 'type.googleapis.com/protocol.UpdateAssetContract');

  console.log("execute updateToken success")
}

async function purchaseToken(){
  const emptyAccount1 = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount1.address.hex,3000000000,{privateKey: PRIVATE_KEY})
  const emptyAccount2 = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount2.address.hex,3000000000,{privateKey: PRIVATE_KEY})
  const emptyAccount3 = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount3.address.hex,3000000000,{privateKey: PRIVATE_KEY})

  let tokenOptions = getTokenOptions();
  let tokenID
  await broadcaster.broadcaster(tronWeb.transactionBuilder.createToken(tokenOptions, emptyAccount1.address.base58), emptyAccount1.privateKey)
  let tokenList
  while (!tokenList) {
    tokenList = await tronWeb.trx.getTokensIssuedByAddress(emptyAccount1.address.base58)
  }
  if (isAllowSameTokenNameApproved) {
    tokenID = tokenList[tokenOptions.name].id
  } else {
    tokenID = tokenList[tokenOptions.name].name
  }
  assert.equal(tokenList[tokenOptions.name].abbr, tokenOptions.abbreviation)

  let token
  if (isAllowSameTokenNameApproved) {
    token = await tronWeb.trx.getTokenByID(tokenID)
    assert.equal(token.id, tokenID)
  } else {
    token = await tronWeb.trx.getTokenFromID(tokenID)
  }
  assert.equal(token.name, tokenOptions.name)

  const params = [
    [emptyAccount1.address.base58, tokenID, 20, emptyAccount2.address.base58, {permissionId: 2}],
    [emptyAccount1.address.base58, tokenID, 20, emptyAccount2.address.base58]
  ];
  for (let param of params) {
    await wait(20)

    const transaction = await tronWeb.transactionBuilder.purchaseToken(...param);
    const parameter = txPars(transaction);
    assert.equal(transaction.txID.length, 64);
    assert.equal(parameter.value.amount, 20);
    assert.equal(parameter.value.owner_address, emptyAccount2.address.hex.toLowerCase());
    assert.equal(parameter.value.to_address, emptyAccount1.address.hex.toLowerCase());
    assert.equal(parameter.type_url, 'type.googleapis.com/protocol.ParticipateAssetIssueContract');
    assert.equal(transaction.raw_data.contract[0].Permission_id || 0, param[4] ? param[4]['permissionId'] : 0);
  }

  await assertThrow(
      tronWeb.transactionBuilder.purchaseToken('sasdsadasfa', tokenID, 20, emptyAccount2.address.base58),
      'Invalid issuer address provided'
  )

  await assertThrow(
      tronWeb.transactionBuilder.purchaseToken(emptyAccount3.address.base58, tokenID, 20, emptyAccount2.address.base58),
      null,
      'The asset is not issued by'
  )

  await assertThrow(
      tronWeb.transactionBuilder.purchaseToken(emptyAccount1.address.base58, 123432, 20, emptyAccount2.address.base58),
      'Invalid token ID provided'
  )

  await assertThrow(
      tronWeb.transactionBuilder.purchaseToken(emptyAccount1.address.base58, '1110000', 20, emptyAccount2.address.base58),
      null,
      'No asset named '
  )

  await assertThrow(
      tronWeb.transactionBuilder.purchaseToken(emptyAccount1.address.base58, tokenID, 20, 'sasdadasdas'),
      'Invalid buyer address provided'
  );

  await assertThrow(
      tronWeb.transactionBuilder.purchaseToken(emptyAccount1.address.base58, tokenID, -3, emptyAccount2.address.base58),
      'Invalid amount provided'
  )

  await assertThrow(
      tronWeb.transactionBuilder.purchaseToken(emptyAccount1.address.base58, tokenID, "some-amount", emptyAccount2.address.base58),
      'Invalid amount provided'
  )

  console.log("execute purchaseToken success")
}

async function sendToken(){
  console.log("sendToken excute start")
  const emptyAccount1 = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount1.address.hex,3000000000,{privateKey: PRIVATE_KEY})
  const emptyAccount2 = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount2.address.hex,3000000000,{privateKey: PRIVATE_KEY})
  const emptyAccount3 = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount3.address.hex,3000000000,{privateKey: PRIVATE_KEY})

  let tokenOptions = getTokenOptions();
  let tokenID
  await broadcaster.broadcaster(tronWeb.transactionBuilder.createToken(tokenOptions, emptyAccount1.address.base58), emptyAccount1.privateKey)
  let tokenList
  while (!tokenList) {
    tokenList = await tronWeb.trx.getTokensIssuedByAddress(emptyAccount1.address.base58)
  }
  if (isAllowSameTokenNameApproved) {
    tokenID = tokenList[tokenOptions.name].id
  } else {
    tokenID = tokenList[tokenOptions.name].name
  }

  let token
  if (isAllowSameTokenNameApproved) {
    token = await tronWeb.trx.getTokenByID(tokenID)
    assert.equal(token.id, tokenID)
  } else {
    token = await tronWeb.trx.getTokenFromID(tokenID)
  }
  assert.equal(token.name, tokenOptions.name)

  let params = [
    [emptyAccount2.address.base58, 5, tokenID, emptyAccount3.address.base58, {permissionId: 2}],
    [emptyAccount2.address.base58, 5, tokenID, emptyAccount3.address.base58]
  ];
  for (let param of params) {
    await wait(20)

    console.log("token: "+util.inspect(token,true,null,true));
    console.log("now datatime: "+util.inspect(Date.now(),true,null,true));

    await broadcaster.broadcaster(tronWeb.transactionBuilder.purchaseToken(emptyAccount1.address.base58, tokenID, 50, emptyAccount3.address.base58), emptyAccount3.privateKey)

    await wait(10)

    console.log("22222")

    const transaction = await tronWeb.transactionBuilder.sendToken(...param)

    const parameter = txPars(transaction)

    assert.equal(parameter.value.amount, 5)
    assert.equal(parameter.value.owner_address, emptyAccount3.address.hex.toLowerCase());
    assert.equal(parameter.value.to_address, emptyAccount2.address.hex.toLowerCase());
    assert.equal(transaction.raw_data.contract[0].Permission_id || 0, param[4] ? param[4]['permissionId'] : 0);
  }

  params = [
    [emptyAccount2.address.base58, 5, tokenID, emptyAccount1.address.base58, {permissionId: 2}],
    [emptyAccount2.address.base58, 5, tokenID, emptyAccount1.address.base58]
  ];
  for (let param of params) {
    console.log("33333")
    const transaction = await tronWeb.transactionBuilder.sendToken(...param)

    const parameter = txPars(transaction);

    assert.equal(parameter.value.amount, 5)
    assert.equal(parameter.value.owner_address, emptyAccount1.address.hex.toLowerCase());
    assert.equal(parameter.value.to_address, emptyAccount2.address.hex.toLowerCase());
    assert.equal(transaction.raw_data.contract[0].Permission_id || 0, param[4] ? param[4]['permissionId'] : 0);
  }

  await assertThrow(
      tronWeb.transactionBuilder.sendToken('sadasfdfsgdfgssa', 5, tokenID, emptyAccount3.address.base58),
      'Invalid recipient address provided'
  )

  await assertThrow(
      tronWeb.transactionBuilder.sendToken(emptyAccount2.address.base58, 5, 143234, emptyAccount3.address.base58),
      'Invalid token ID provided'
  )

  await assertThrow(
      tronWeb.transactionBuilder.sendToken(emptyAccount2.address.base58, 5, tokenID, 213253453453),
      'Invalid origin address provided'
  )

  await assertThrow(
      tronWeb.transactionBuilder.sendToken(emptyAccount2.address.base58, -5, tokenID, emptyAccount3.address.base58),
      'Invalid amount provided'
  )

  await assertThrow(
      tronWeb.transactionBuilder.sendToken(emptyAccount2.address.base58, 'amount', tokenID, emptyAccount3.address.base58),
      'Invalid amount provided'
  )
  console.log("sendToken excute success")
}

async function createProposal(){
  const emptyAccount1 = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount1.address.hex,10000000000,{privateKey: PRIVATE_KEY})

  let parameters = [{"key": 0, "value": 100000}, {"key": 1, "value": 2}]

  let inputs = [
    [parameters[0], ADDRESS_BASE58, {permissionId: 2}],
    [parameters[0], ADDRESS_BASE58]
  ];
  // tronex have no witness account TODO
  /*for (let input of inputs) {
    const transaction = await tronWeb.transactionBuilder.createProposal(...input)

    const parameter = txPars(transaction);

    assert.equal(parameter.value.owner_address, ADDRESS_HEX);
    assert.equal(parameter.value.parameters[0].value, parameters[0].value);
    assert.equal(parameter.type_url, 'type.googleapis.com/protocol.ProposalCreateContract');
    assert.equal(transaction.raw_data.contract[0].Permission_id || 0, input[2] ? input[2]['permissionId'] : 0);
  }*/

  for (let input of inputs) {
    await assertThrow(
        tronWeb.transactionBuilder.createProposal(...input),
        'class org.tron.core.exception.ContractValidateException : Witness[415624c12e308b03a1a6b21d9b86e3942fac1ab92b] not exists'
    )
  }

  await assertThrow(
      tronWeb.transactionBuilder.createProposal(parameters, 'sadasdsffdgdf'),
      'Invalid issuer address provided'
  )

  await assertThrow(
      tronWeb.transactionBuilder.createProposal(parameters, emptyAccount1.address.base58),
      null,
      `Witness[${emptyAccount1.address.hex.toLowerCase()}] not exists`
  )
}

async function deleteProposal(){
  // TODO
  /*let parameters = [{"key": 0, "value": 100000}, {"key": 1, "value": 2}]
  await broadcaster.broadcaster(tronWeb.transactionBuilder.createProposal(parameters, ADDRESS_BASE58), PRIVATE_KEY)
  let proposals = await tronWeb.trx.listProposals();

  const params = [
    [proposals[0].proposal_id, {permissionId: 2}],
    [proposals[0].proposal_id]
  ];
  for (let param of params) {
    const transaction = await tronWeb.transactionBuilder.deleteProposal(...param)
    const parameter = txPars(transaction);

    assert.equal(parameter.value.owner_address, ADDRESS_HEX);
    assert.equal(parameter.value.proposal_id, proposals[0].proposal_id);
    assert.equal(parameter.type_url, 'type.googleapis.com/protocol.ProposalDeleteContract');
    assert.equal(transaction.raw_data.contract[0].Permission_id || 0, param[1] ? param[1]['permissionId'] : 0);
  }

  await broadcaster.broadcaster(await tronWeb.transactionBuilder.deleteProposal(proposals[0].proposal_id));
  await assertThrow(
      tronWeb.transactionBuilder.deleteProposal(proposals[0].proposal_id),
      null,
      `Proposal[${proposals[0].proposal_id}] canceled`);

  proposals = await tronWeb.trx.listProposals();
  for (let proposal of proposals) {
    if (proposal.state !== 'CANCELED')
      await broadcaster.broadcaster(tronWeb.transactionBuilder.deleteProposal(proposal.proposal_id), PRIVATE_KEY)
  }*/

  await assertThrow(
      tronWeb.transactionBuilder.deleteProposal("99999", "TReevbKLeP7uArHa6xkTboAYgfnaXwzNpq"),
      'class org.tron.core.exception.ContractValidateException : Account[41abffbfaa1e34af1a8ad15b0d1f4be07cd02aece4] not exists'
  )

  await assertThrow(
      tronWeb.transactionBuilder.deleteProposal("99999"),
      'class org.tron.core.exception.ContractValidateException : Proposal[99999] not exists'
  )
}

async function applyForSR(){
  let url = 'https://xtron.network';

  const emptyAccount1 = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount1.address.hex,10100000000,{privateKey: PRIVATE_KEY})

  const transaction = await tronWeb.transactionBuilder.applyForSR(emptyAccount1.address.base58, url);
  const parameter = txPars(transaction);

  assert.equal(parameter.value.owner_address, emptyAccount1.address.hex.toLowerCase());
  await assertEqualHex(parameter.value.url, url);
  assert.equal(parameter.type_url, 'type.googleapis.com/protocol.WitnessCreateContract');
}

async function freezeBalance(){
  const emptyAccount1 = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount1.address.hex,3000000000,{privateKey: PRIVATE_KEY})

  const params = [
    [100e6, 3, 'BANDWIDTH', emptyAccount1.address.base58, {permissionId: 2}],
    [100e6, 3, 'BANDWIDTH', emptyAccount1.address.base58]
  ];

  for (let param of params) {
    const transaction = await tronWeb.transactionBuilder.freezeBalance(...param)

    const parameter = txPars(transaction);
    // jlog(parameter)
    assert.equal(parameter.value.owner_address, emptyAccount1.address.hex.toLowerCase());
    assert.equal(parameter.value.frozen_balance, 100e6);
    assert.equal(parameter.value.frozen_duration, 3);
    assert.equal(parameter.type_url, 'type.googleapis.com/protocol.FreezeBalanceContract');
    assert.equal(transaction.raw_data.contract[0].Permission_id || 0, param[4] ? param[4]['permissionId'] : 0);
  }
}

async function vote(){
  const emptyAccount1 = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount1.address.hex,10010000000,{privateKey: PRIVATE_KEY})
  const emptyAccount2 = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount2.address.hex,3000000000,{privateKey: PRIVATE_KEY})

  let url = 'https://xtron.network';
  // let witnesses;

  await broadcaster.broadcaster(tronWeb.transactionBuilder.applyForSR(emptyAccount1.address.base58, url), emptyAccount1.privateKey)
  await broadcaster.broadcaster(tronWeb.transactionBuilder.freezeBalance(100e6, 3, 'BANDWIDTH', emptyAccount2.address.base58), emptyAccount2.privateKey)

  let votes = {}
  votes[emptyAccount1.address.hex] = 5

  const transaction = await tronWeb.transactionBuilder.vote(votes, emptyAccount2.address.base58)
  const parameter = txPars(transaction);

  assert.equal(parameter.value.owner_address, emptyAccount2.address.hex.toLowerCase());
  assert.equal(parameter.value.votes[0].vote_address, emptyAccount1.address.hex.toLowerCase());
  assert.equal(parameter.value.votes[0].vote_count, 5);
  assert.equal(parameter.type_url, 'type.googleapis.com/protocol.VoteWitnessContract');
}

async function createSmartContract(){
  const emptyAccount1 = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount1.address.hex,3000000000,{privateKey: PRIVATE_KEY})
  const emptyAccount2 = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount2.address.hex,3000000000,{privateKey: PRIVATE_KEY})
  const emptyAccount3 = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount3.address.hex,3000000000,{privateKey: PRIVATE_KEY})
  const emptyAccount4 = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount4.address.hex,3000000000,{privateKey: PRIVATE_KEY})
  const emptyAccount5 = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount5.address.hex,3000000000,{privateKey: PRIVATE_KEY})

  let options = {
    abi: testRevert.abi,
    bytecode: testRevert.bytecode
  };
  for (let i = 0; i < 2; i++) {
    if (i === 1) options.permissionId = 2;
    const tx = await tronWeb.transactionBuilder.createSmartContract(options)
    assert.equal(tx.raw_data.contract[0].parameter.value.new_contract.consume_user_resource_percent, 100);
    assert.equal(tx.raw_data.contract[0].parameter.value.new_contract.origin_energy_limit, 1e7);
    assert.equal(tx.raw_data.fee_limit, 15e7);
    assert.equal(tx.raw_data.contract[0].Permission_id || 0, options.permissionId || 0);
  }

  const bals = [1000, 2000, 3000, 4000];
  options = {
    abi: arrayParam.abi,
    bytecode: arrayParam.bytecode,
    permissionId: 2,
    parameters: [
      [emptyAccount1.address.hex, emptyAccount2.address.hex, emptyAccount3.address.hex, emptyAccount4.address.hex],
      [bals[0], bals[1], bals[2], bals[3]]
    ]
  };
  const transaction = await tronWeb.transactionBuilder.createSmartContract(options, emptyAccount5.address.hex);
  await broadcaster.broadcaster(null, emptyAccount5.privateKey, transaction);
  console.log("transaction.txID: "+transaction.txID)
  while (true) {
    const tx = await tronWeb.trx.getTransactionInfo(transaction.txID);
    if (Object.keys(tx).length === 0) {
      await wait(3);
      continue;
    } else {
      break;
    }
  }
  const deployed = await tronWeb.contract().at(transaction.contract_address);
  let bal = await deployed.balances(emptyAccount1.address.hex).call();
  bal = bal.toNumber();
  assert.equal(bal, bals[0]);
  bal = await deployed.balances(emptyAccount2.address.hex).call();
  bal = bal.toNumber();
  assert.equal(bal, bals[1]);
  bal = await deployed.balances(emptyAccount3.address.hex).call();
  bal = bal.toNumber();
  assert.equal(bal, bals[2]);
  bal = await deployed.balances(emptyAccount4.address.hex).call();
  bal = bal.toNumber();
  assert.equal(bal, bals[3]);


  options = {
    abi: testRevert.abi,
    bytecode: testRevert.bytecode,
    userFeePercentage: 30,
    originEnergyLimit: 9e6,
    feeLimit: 9e8
  };
  for (let i = 0; i < 2; i++) {
    if (i === 1) options.permissionId = 2;
    const tx = await tronWeb.transactionBuilder.createSmartContract(options)
    assert.equal(tx.raw_data.contract[0].parameter.value.new_contract.consume_user_resource_percent, 30);
    assert.equal(tx.raw_data.contract[0].parameter.value.new_contract.origin_energy_limit, 9e6);
    assert.equal(tx.raw_data.fee_limit, 9e8);
    assert.equal(tx.raw_data.contract[0].Permission_id || 0, options.permissionId || 0);
  }
  console.log("createSmartContract excute success");
}

async function createSmartContractWithArray3(){
  const emptyAccount1 = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount1.address.hex,1000000,{privateKey: PRIVATE_KEY})
  const emptyAccount2 = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount2.address.hex,1000000,{privateKey: PRIVATE_KEY})
  const emptyAccount3 = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount3.address.hex,1000000,{privateKey: PRIVATE_KEY})
  const emptyAccount4 = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount4.address.hex,1000000000,{privateKey: PRIVATE_KEY})

  const options = {
    abi: testAddressArray.abi,
    bytecode: testAddressArray.bytecode,
    permissionId: 2,
    parameters: [
      [emptyAccount1.address.hex, emptyAccount2.address.hex, emptyAccount3.address.hex]
    ]
  };
  console.log("ADDRESS_HEX:"+ADDRESS_HEX);
  console.log("PRIVATE_KEY:"+PRIVATE_KEY);
  console.log("PRIVATE_KEY:"+util.inspect(await tronWeb.trx.getAccount(ADDRESS_HEX),true,null,true));
  const transaction = await tronWeb.transactionBuilder.createSmartContract(options, emptyAccount4.address.hex);
  const createTx = await broadcaster.broadcaster(null, emptyAccount4.privateKey, transaction);
  assert.equal(createTx.transaction.txID.length, 64);
  while (true) {
    const tx = await tronWeb.trx.getTransactionInfo(createTx.transaction.txID);
    if (Object.keys(tx).length === 0) {
      await wait(3);
      continue;
    } else {
      break;
    }
  }
  const deployed = await tronWeb.contract().at(transaction.contract_address);
  let bal = await deployed.balanceOf(emptyAccount1.address.hex).call();
  bal = bal.toNumber();
  assert.equal(bal, 100000000);
  bal = await deployed.balanceOf(emptyAccount2.address.hex).call();
  bal = bal.toNumber();
  assert.equal(bal, 100000000);
  bal = await deployed.balanceOf(emptyAccount3.address.hex).call();
  bal = bal.toNumber();
  assert.equal(bal, 100000000);

  console.log("createSmartContractWithArray3 excute success");
}

async function createSmartContractWithTrctokenAndStateMutability(){
  const emptyAccount1 = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount1.address.hex,1000000,{privateKey: PRIVATE_KEY})

  // before token balance
  const accountbefore = await tronWeb.trx.getAccount(ADDRESS_HEX);
  const accountTrc10BalanceBefore = accountbefore.assetV2.filter((item)=> item.key == TOKEN_ID)[0].value;
  console.log("accountTrc10BalanceBefore:"+accountTrc10BalanceBefore);
  const options = {
    abi: trcTokenTest070.abi,
    bytecode: trcTokenTest070.bytecode,
    parameters: [
      emptyAccount1.address.hex, TOKEN_ID, 123
    ],
    callValue:321,
    tokenId:TOKEN_ID,
    tokenValue:1e3
  };
  const transaction = await tronWeb.transactionBuilder.createSmartContract(options, ADDRESS_HEX);
  await broadcaster.broadcaster(null, PRIVATE_KEY, transaction);
  let createInfo
  while (true) {
    createInfo = await tronWeb.trx.getTransactionInfo(transaction.txID);
    if (Object.keys(createInfo).length === 0) {
      await wait(3);
      continue;
    } else {
      break;
    }
  }

  // after token balance
  const accountAfter = await tronWeb.trx.getAccount(ADDRESS_HEX);
  const accountTrc10BalanceAfter = accountAfter.assetV2.filter((item)=> item.key == TOKEN_ID)[0].value;
  console.log("accountTrc10BalanceAfter:"+accountTrc10BalanceAfter);
  const toAddressAfter = await tronWeb.trx.getAccount(emptyAccount1.address.hex);
  const toAddressTrc10BalanceAfter = toAddressAfter.assetV2.filter((item)=> item.key == TOKEN_ID)[0].value;
  console.log("toAddressTrc10BalanceAfter:"+toAddressTrc10BalanceAfter);
  assert.equal(accountTrc10BalanceAfter,(accountTrc10BalanceBefore-1e3));
  assert.equal(toAddressTrc10BalanceAfter,123);

  console.log("createSmartContractWithTrctokenAndStateMutability excute success");
}

async function createSmartContractWithPayable(){
  const emptyAccount1 = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount1.address.hex,1000000,{privateKey: PRIVATE_KEY})

  // before token balance
  const accountbefore = await tronWeb.trx.getAccount(ADDRESS_HEX);
  const accountTrc10BalanceBefore = accountbefore.assetV2.filter((item)=> item.key == TOKEN_ID)[0].value;
  console.log("accountTrc10BalanceBefore:"+accountTrc10BalanceBefore);
  const options = {
    abi: trcTokenTest059.abi,
    bytecode: trcTokenTest059.bytecode,
    parameters: [
      emptyAccount1.address.hex, TOKEN_ID, 123
    ],
    callValue:321,
    tokenId:TOKEN_ID,
    tokenValue:1e3
  };
  const transaction = await tronWeb.transactionBuilder.createSmartContract(options, ADDRESS_HEX);
  await broadcaster.broadcaster(null, PRIVATE_KEY, transaction);
  let createInfo
  while (true) {
    createInfo = await tronWeb.trx.getTransactionInfo(transaction.txID);
    if (Object.keys(createInfo).length === 0) {
      await wait(3);
      continue;
    } else {
      break;
    }
  }

  // after token balance
  const accountAfter = await tronWeb.trx.getAccount(ADDRESS_HEX);
  const accountTrc10BalanceAfter = accountAfter.assetV2.filter((item)=> item.key == TOKEN_ID)[0].value;
  console.log("accountTrc10BalanceAfter:"+accountTrc10BalanceAfter);
  const toAddressAfter = await tronWeb.trx.getAccount(emptyAccount1.address.hex);
  const toAddressTrc10BalanceAfter = toAddressAfter.assetV2.filter((item)=> item.key == TOKEN_ID)[0].value;
  console.log("toAddressTrc10BalanceAfter:"+toAddressTrc10BalanceAfter);
  assert.equal(accountTrc10BalanceAfter,(accountTrc10BalanceBefore-1e3));
  assert.equal(toAddressTrc10BalanceAfter,123);

  console.log("createSmartContractWithPayable excute success");
}

async function triggerConstantContract(){
  console.log("triggerConstantContract excute start");
  const emptyAccount1 = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount1.address.hex,3000000000,{privateKey: PRIVATE_KEY})

  let transaction;
  transaction = await tronWeb.transactionBuilder.createSmartContract({
    abi: testConstant.abi,
    bytecode: testConstant.bytecode
  }, emptyAccount1.address.hex);
  await broadcaster.broadcaster(null, emptyAccount1.privateKey, transaction);
  while (true) {
    const tx = await tronWeb.trx.getTransactionInfo(transaction.txID);
    if (Object.keys(tx).length === 0) {
      await wait(3);
      continue;
    } else {
      break;
    }
  }

  const contractAddress = transaction.contract_address;
  const issuerAddress = emptyAccount1.address.hex;
  const functionSelector = 'testPure(uint256,uint256)';
  const parameter = [
    {type: 'uint256', value: 1},
    {type: 'uint256', value: 2}
  ]
  const options = {};
  for (let i = 0; i < 2; i++) {
    if (i === 1) options.permissionId = 2;
    transaction = await tronWeb.transactionBuilder.triggerConstantContract(contractAddress, functionSelector, options,
        parameter, issuerAddress);
    assert.isTrue(transaction.result.result &&
        transaction.transaction.raw_data.contract[0].parameter.type_url === 'type.googleapis.com/protocol.TriggerSmartContract');
    assert.equal(transaction.constant_result, '0000000000000000000000000000000000000000000000000000000000000004');
    transaction = await broadcaster.broadcaster(null, emptyAccount1.privateKey, transaction.transaction);
    assert.isTrue(transaction.receipt.result)
    assert.equal(transaction.transaction.raw_data.contract[0].Permission_id || 0, options.permissionId || 0);
  }
  console.log("triggerConstantContract excute success");
}

async function triggerComfirmedConstantContract(){
  console.log("triggerComfirmedConstantContract excute start");
  const emptyAccount1 = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount1.address.hex,3000000000,{privateKey: PRIVATE_KEY})

  let transaction = await tronWeb.transactionBuilder.createSmartContract({
    abi: testConstant.abi,
    bytecode: testConstant.bytecode
  }, emptyAccount1.address.hex);
  await broadcaster.broadcaster(null, emptyAccount1.privateKey, transaction);
  while (true) {
    const tx = await tronWeb.trx.getTransactionInfo(transaction.txID);
    if (Object.keys(tx).length === 0) {
      await wait(3);
      continue;
    } else {
      break;
    }
  }

  const contractAddress = transaction.contract_address;
  const issuerAddress = emptyAccount1.address.hex;
  const functionSelector = 'testPure(uint256,uint256)';
  const parameter = [
    {type: 'uint256', value: 1},
    {type: 'uint256', value: 2}
  ]
  const options = {};

  for (let i = 0; i < 2; i++) {
    if (i === 1) options.permissionId = 2;
    transaction = await tronWeb.transactionBuilder.triggerConfirmedConstantContract(contractAddress, functionSelector, options,
        parameter, issuerAddress);
    assert.isTrue(transaction.result.result &&
        transaction.transaction.raw_data.contract[0].parameter.type_url === 'type.googleapis.com/protocol.TriggerSmartContract');
    assert.equal(transaction.constant_result, '0000000000000000000000000000000000000000000000000000000000000004');
    transaction = await broadcaster.broadcaster(null, emptyAccount1.privateKey, transaction.transaction);
    assert.isTrue(transaction.receipt.result)
    assert.equal(transaction.transaction.raw_data.contract[0].Permission_id || 0, options.permissionId || 0);
  }
  console.log("triggerComfirmedConstantContract excute success");
}

async function clearabi(){
  console.log("clearabi excute start");
  const emptyAccount1 = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount1.address.hex,3000000000,{privateKey: PRIVATE_KEY})

  let contract;
  let transaction = await tronWeb.transactionBuilder.createSmartContract({
    abi: testConstant.abi,
    bytecode: testConstant.bytecode
  }, emptyAccount1.address.hex);
  await broadcaster.broadcaster(null, emptyAccount1.privateKey, transaction);
  while (true) {
    const tx = await tronWeb.trx.getTransactionInfo(transaction.txID);
    if (Object.keys(tx).length === 0) {
      await wait(3);
      continue;
    } else {
      break;
    }
  }

  const contractAddress = transaction.contract_address;
  const ownerAddress = emptyAccount1.address.hex;

  // verify contract abi before
  contract = await tronWeb.trx.getContract(contractAddress);
  assert.isTrue(Object.keys(contract.abi).length > 0)

  // clear abi
  transaction = await tronWeb.transactionBuilder.clearABI(contractAddress, ownerAddress);
  assert.isTrue(!transaction.visible &&
      transaction.raw_data.contract[0].parameter.type_url === 'type.googleapis.com/protocol.ClearABIContract');
  transaction = await broadcaster.broadcaster(null, emptyAccount1.privateKey, transaction);
  assert.isTrue(transaction.receipt.result);

  // verify contract abi after
  while (true) {
    contract = await tronWeb.trx.getContract(contractAddress);
    if (Object.keys(contract.abi).length > 0) {
      await wait(3);
      continue;
    } else {
      break;
    }
  }
  assert.isTrue(Object.keys(contract.abi).length === 0);
  console.log("clearabi excute success");
}

async function updateBrokerage(){
  const emptyAccount1 = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount1.address.hex,10010000000,{privateKey: PRIVATE_KEY})

  let url = 'https://xtron2.network';
  // let witnesses;

  await broadcaster.broadcaster(tronWeb.transactionBuilder.applyForSR(emptyAccount1.address.base58, url), emptyAccount1.privateKey)


  console.log("emptyAccount1:"+emptyAccount1.address.base58)
  const transaction = await tronWeb.transactionBuilder.updateBrokerage(10, emptyAccount1.address.hex);

  await assertThrow(
      tronWeb.transactionBuilder.updateBrokerage(null, emptyAccount1.address.hex),
      'Invalid brokerage provided'
  );

  let brokerages = [-1, 101]
  for (let brokerage of brokerages) {
    await assertThrow(
        tronWeb.transactionBuilder.updateBrokerage(brokerage, emptyAccount1.address.hex),
        'Brokerage must be an integer between 0 and 100'
    );
  }

  await assertThrow(
      tronWeb.transactionBuilder.updateBrokerage(10, 'abcd'),
      'Invalid owner address provided'
  );
  console.log("updateBrokerage excute success")
}

async function withdrawBlockRewards(){
  // TODO
}

async function triggerSmartContract(){
  const emptyAccount1 = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount1.address.hex,3000000000,{privateKey: PRIVATE_KEY})

  let transaction = await tronWeb.transactionBuilder.createSmartContract({
    abi: testConstant.abi,
    bytecode: testConstant.bytecode
  }, emptyAccount1.address.hex);
  await broadcaster.broadcaster(null, emptyAccount1.privateKey, transaction);
  while (true) {
    const tx = await tronWeb.trx.getTransactionInfo(transaction.txID);
    if (Object.keys(tx).length === 0) {
      await wait(3);
      continue;
    } else {
      break;
    }
  }

  const contractAddress = transaction.contract_address;
  const issuerAddress = emptyAccount1.address.hex;
  const functionSelector = 'testPure(uint256,uint256)';
  const parameter = [
    {type: 'uint256', value: 1},
    {type: 'uint256', value: 2}
  ]
  const options = {};

  for (let i = 0; i < 2; i++) {
    if (i === 1) options.permissionId = 2;
    transaction = await tronWeb.transactionBuilder.triggerSmartContract(contractAddress, functionSelector, options,
        parameter, issuerAddress);
    assert.isTrue(transaction.result.result &&
        transaction.transaction.raw_data.contract[0].parameter.type_url === 'type.googleapis.com/protocol.TriggerSmartContract');
    assert.equal(transaction.constant_result, '0000000000000000000000000000000000000000000000000000000000000004');
    transaction = await broadcaster.broadcaster(null, emptyAccount1.privateKey, transaction.transaction);
    assert.isTrue(transaction.receipt.result)
    assert.equal(transaction.transaction.raw_data.contract[0].Permission_id || 0, options.permissionId || 0);
  }
  console.log("triggerSmartContract excute success")
}

async function triggerSmartContractWithArrays(){
  const emptyAccount1 = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount1.address.hex,1000000,{privateKey: PRIVATE_KEY})
  const emptyAccount2 = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount2.address.hex,1000000,{privateKey: PRIVATE_KEY})
  const emptyAccount3 = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount3.address.hex,1000000,{privateKey: PRIVATE_KEY})
  const emptyAccount4 = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount4.address.hex,100000000,{privateKey: PRIVATE_KEY})

  let transaction = await tronWeb.transactionBuilder.createSmartContract({
    abi: testAddressArray.abi,
    bytecode: testAddressArray.bytecode,
    parameters: [
      [emptyAccount1.address.hex, emptyAccount2.address.hex, emptyAccount3.address.hex]
    ]
  }, ADDRESS_HEX);
  await broadcaster.broadcaster(null, PRIVATE_KEY, transaction);
  while (true) {
    const tx = await tronWeb.trx.getTransactionInfo(transaction.txID);
    if (Object.keys(tx).length === 0) {
      await wait(3);
      continue;
    } else {
      break;
    }
  }
  let contractAddressWithArray = transaction.contract_address;

  let functionSelector = 'transferWith2(address[2],uint256[2])';
  let parameter = [
    {type: 'address[2]', value: [emptyAccount1.address.hex, emptyAccount2.address.hex]},
    {type: 'uint256[2]', value: [123456, 123456]}
  ]
  transaction = await tronWeb.transactionBuilder.triggerSmartContract(contractAddressWithArray,  functionSelector, {},
      parameter, ADDRESS_HEX);
  await broadcaster.broadcaster(null, PRIVATE_KEY, transaction.transaction);
  while (true) {
    const tx = await tronWeb.trx.getTransactionInfo(transaction.transaction.txID);
    if (Object.keys(tx).length === 0) {
      await wait(3);
      continue;
    } else {
      break;
    }
  }
  let deployed = await tronWeb.contract().at(contractAddressWithArray);
  let bal = await deployed.balanceOf(emptyAccount1.address.hex).call();
  bal = bal.toNumber();
  assert.equal(bal, 100123456);
  bal = await deployed.balanceOf(emptyAccount2.address.hex).call();
  bal = bal.toNumber();
  assert.equal(bal, 100123456);
  bal = await deployed.balanceOf(emptyAccount3.address.hex).call();
  bal = bal.toNumber();
  assert.equal(bal, 100000000);

  functionSelector = 'transferWithArray(address[],uint256[])';
  parameter = [
    {type: 'address[]', value: [emptyAccount1.address.hex, emptyAccount2.address.hex]},
    {type: 'uint256[]', value: [123456, 123456]}
  ]
  transaction = await tronWeb.transactionBuilder.triggerSmartContract(contractAddressWithArray,  functionSelector, {},
      parameter, ADDRESS_HEX);
  await broadcaster.broadcaster(null, PRIVATE_KEY, transaction.transaction);
  while (true) {
    const tx = await tronWeb.trx.getTransactionInfo(transaction.transaction.txID);
    if (Object.keys(tx).length === 0) {
      await wait(3);
      continue;
    } else {
      break;
    }
  }
  deployed = await tronWeb.contract().at(contractAddressWithArray);
  bal = await deployed.balanceOf(emptyAccount1.address.hex).call();
  bal = bal.toNumber();
  assert.equal(bal, 100246912);
  bal = await deployed.balanceOf(emptyAccount2.address.hex).call();
  bal = bal.toNumber();
  assert.equal(bal, 100246912);

  console.log("triggerSmartContractWithArrays excute success");
}

async function triggerSmartContractWithTrctoken(){
  let accounts = await tronWebBuilder.getTestAccountsInMain(7);
  const emptyAccount1 = await TronWeb.createAccount();

  const options = {
    abi: trcTokenTest070.abi,
    bytecode: trcTokenTest070.bytecode,
    parameters: [
      emptyAccount1.address.hex, TOKEN_ID, 123
    ],
    callValue:321,
    tokenId:TOKEN_ID,
    tokenValue:1e3
  };
  let transaction = await tronWeb.transactionBuilder.createSmartContract(options, ADDRESS_HEX);
  await broadcaster.broadcaster(null, PRIVATE_KEY, transaction);
  let createInfo
  while (true) {
    createInfo = await tronWeb.trx.getTransactionInfo(transaction.txID);
    if (Object.keys(createInfo).length === 0) {
      await wait(3);
      continue;
    } else {
      break;
    }
  }
  let contractAddressWithTrctoken = transaction.contract_address;

  // before token balance
  const accountbefore = await tronWeb.trx.getAccount(contractAddressWithTrctoken);
  const accountTrc10BalanceBefore = accountbefore.assetV2.filter((item)=> item.key == TOKEN_ID)[0].value;
  console.log("accountTrc10BalanceBefore:"+accountTrc10BalanceBefore);

  const functionSelector = 'TransferTokenTo(address,trcToken,uint256)';
  const parameter = [
    {type: 'address', value: emptyAccount1.address.hex},
    {type: 'trcToken', value: TOKEN_ID},
    {type: 'uint256', value: 123}
  ];
  transaction = await tronWeb.transactionBuilder.triggerSmartContract(contractAddressWithTrctoken,  functionSelector, {},
      parameter, accounts.hex[6]);
  await broadcaster.broadcaster(null, accounts.pks[6], transaction.transaction);
  while (true) {
    const tx = await tronWeb.trx.getTransactionInfo(transaction.transaction.txID);
    if (Object.keys(tx).length === 0) {
      await wait(3);
      continue;
    } else {
      break;
    }
  }
  // after token balance
  const accountAfter = await tronWeb.trx.getAccount(contractAddressWithTrctoken);
  const accountTrc10BalanceAfter = accountAfter.assetV2.filter((item)=> item.key == TOKEN_ID)[0].value;
  console.log("accountTrc10BalanceAfter:"+accountTrc10BalanceAfter);
  const toAddressAfter = await tronWeb.trx.getAccount(emptyAccount1.address.hex);
  const toAddressTrc10BalanceAfter = toAddressAfter.assetV2.filter((item)=> item.key == TOKEN_ID)[0].value;
  console.log("toAddressTrc10BalanceAfter:"+toAddressTrc10BalanceAfter);
  assert.equal(accountTrc10BalanceAfter,(accountTrc10BalanceBefore-123));
  assert.equal(toAddressTrc10BalanceAfter,246);

  console.log("triggerSmartContractWithTrctoken excute success");
}

async function createTokenExchange(){
  let tokenNames = [];
  const emptyAccount1 = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount1.address.hex,3000000000,{privateKey: PRIVATE_KEY})
  const emptyAccount2 = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount2.address.hex,3000000000,{privateKey: PRIVATE_KEY})
  const emptyAccount3 = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount3.address.hex,3000000000,{privateKey: PRIVATE_KEY})
  const emptyAccount4 = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount4.address.hex,3000000000,{privateKey: PRIVATE_KEY})

  // create token
  let tempAccount = emptyAccount1;
  for (let i = 0; i < 2; i++) {
    const options = getTokenOptions();

    const transaction = await tronWeb.transactionBuilder.createToken(options, tempAccount.address.hex);
    await broadcaster.broadcaster(null, tempAccount.privateKey, transaction);
    await waitChainData('token', tempAccount.address.hex);
    const token = await tronWeb.trx.getTokensIssuedByAddress(tempAccount.address.hex);
    await waitChainData('tokenById', token[Object.keys(token)[0]]['id']);
    await broadcaster.broadcaster(null, tempAccount.privateKey, await tronWeb.transactionBuilder.sendToken(
        emptyAccount3.address.hex,
        10e4,
        token[Object.keys(token)[0]]['id'],
        token[Object.keys(token)[0]]['owner_address']
    ));
    await waitChainData('sendToken', emptyAccount3.address.hex, 0);
    await broadcaster.broadcaster(null, tempAccount.privateKey, await tronWeb.transactionBuilder.sendToken(
        emptyAccount4.address.hex,
        10e4,
        token[Object.keys(token)[0]]['id'],
        token[Object.keys(token)[0]]['owner_address']
    ));
    await waitChainData('sendToken', emptyAccount4.address.hex, 0);
    tokenNames.push(token[Object.keys(token)[0]]['id']);

    tempAccount = emptyAccount2;
  }

  let transaction = await tronWeb.transactionBuilder.createTokenExchange(tokenNames[0], 10e3, tokenNames[1], 10e3, emptyAccount3.address.hex);
  let parameter = txPars(transaction);

  assert.equal(transaction.txID.length, 64);
  assert.equal(TronWeb.toUtf8(parameter.value.first_token_id), tokenNames[0]);
  assert.equal(TronWeb.toUtf8(parameter.value.second_token_id), tokenNames[1]);
  assert.equal(parameter.type_url, 'type.googleapis.com/protocol.ExchangeCreateContract');
  assert.isUndefined(transaction.raw_data.contract[0].Permission_id);

  transaction = await tronWeb.transactionBuilder.createTokenExchange(tokenNames[0], 10e3, tokenNames[1], 10e3, emptyAccount3.address.hex, {permissionId: 2});
  parameter = txPars(transaction);

  assert.equal(transaction.txID.length, 64);
  assert.equal(TronWeb.toUtf8(parameter.value.first_token_id), tokenNames[0]);
  assert.equal(TronWeb.toUtf8(parameter.value.second_token_id), tokenNames[1]);
  assert.equal(parameter.type_url, 'type.googleapis.com/protocol.ExchangeCreateContract');
  assert.equal(transaction.raw_data.contract[0].Permission_id, 2);
}

async function createTRXExchange(){
  // TODO
}

async function injectExchangeTokens(){
  // TODO
}

async function withdrawExchangeTokens(){
  // TODO
}

async function tradeExchangeTokens(){
  // TODO
}

async function alterExistentTransactions(){
  const emptyAccount1 = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount1.address.hex,3000000000,{privateKey: PRIVATE_KEY})
  const emptyAccount2 = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount2.address.hex,3000000000,{privateKey: PRIVATE_KEY})
  const emptyAccount3 = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount3.address.hex,3000000000,{privateKey: PRIVATE_KEY})
  const emptyAccount4 = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount4.address.hex,3000000000,{privateKey: PRIVATE_KEY})
  const emptyAccount5 = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount5.address.hex,3000000000,{privateKey: PRIVATE_KEY})
  const emptyAccount6 = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount6.address.hex,3000000000,{privateKey: PRIVATE_KEY})

  let receiver = emptyAccount3.address.base58
  let sender = emptyAccount4.address.hex
  let privateKey = emptyAccount4.privateKey
  let balance = await tronWeb.trx.getUnconfirmedBalance(sender);
  let transaction = await tronWeb.transactionBuilder.sendTrx(receiver, 10, sender);
  let previousId = transaction.txID;
  transaction = await tronWeb.transactionBuilder.extendExpiration(transaction, 3600);
  await broadcaster.broadcaster(null, privateKey, transaction);
  assert.notEqual(transaction.txID, previousId)
  assert.equal(balance - await tronWeb.trx.getUnconfirmedBalance(sender), 10);

  receiver = emptyAccount5.address.base58
  sender = emptyAccount6.address.hex
  privateKey = emptyAccount6.privateKey
  balance = await tronWeb.trx.getUnconfirmedBalance(sender);
  transaction = await tronWeb.transactionBuilder.sendTrx(receiver, 10, sender);
  let data = "Sending money to Bill.";
  transaction = await tronWeb.transactionBuilder.addUpdateData(transaction, data);
  let id = transaction.txID;
  await broadcaster.broadcaster(null, privateKey, transaction);
  await waitChainData('tx', id);
  assert.equal(balance - await tronWeb.trx.getUnconfirmedBalance(sender), 10);
  let unconfirmedTx = await tronWeb.trx.getTransaction(id)
  assert.equal(tronWeb.toUtf8(unconfirmedTx.raw_data.data), data);

  receiver = emptyAccount1.address.base58
  sender = emptyAccount2.address.hex
  privateKey = emptyAccount2.privateKey
  // const balance = await tronWeb.trx.getUnconfirmedBalance(sender);
  transaction = await tronWeb.transactionBuilder.sendTrx(receiver, 10, sender);
  previousId = transaction.txID;
  data = "Sending money to Bill.";
  transaction = await tronWeb.transactionBuilder.alterTransaction(transaction, {data});
  id = transaction.txID;
  assert.notEqual(id, previousId)
  await broadcaster.broadcaster(null, privateKey, transaction);
  await waitChainData('tx', id);
  unconfirmedTx = await tronWeb.trx.getTransaction(id)
  assert.equal(tronWeb.toUtf8(unconfirmedTx.raw_data.data), data);
}

async function rawParameter(){
  const emptyAccount1 = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount1.address.hex,1000000000,{privateKey: PRIVATE_KEY})
  let param1;
  let param2;
  let contractAddress1;
  let contractAddress2;
  let contractAddress3;
  const totalSupply = 100000000000000000;
  param1 = await publicMethod.to64String(ADDRESS_HEX)+ await publicMethod.to64String(TronWeb.fromDecimal(totalSupply));
  param2 = await publicMethod.to64String(emptyAccount1.address.hex)+await publicMethod.to64String(TronWeb.fromDecimal(123));
  const tx1 = await broadcaster.broadcaster(tronWeb.transactionBuilder.createSmartContract(
      {
        abi: [],
        bytecode: tronToken.bytecode,
        rawParameter: param1,
      },
      ADDRESS_BASE58
  ), PRIVATE_KEY);
  contractAddress1 = tronWeb.address.fromHex(tx1.transaction.contract_address)

  const tx2 = await broadcaster.broadcaster(tronWeb.transactionBuilder.createSmartContract(
      {
        abi: [{}],
        bytecode: tronToken.bytecode,
        rawParameter: param1,
      },
      ADDRESS_BASE58
  ), PRIVATE_KEY)
  contractAddress2 = tronWeb.address.fromHex(tx2.transaction.contract_address)

  const tx3 = await broadcaster.broadcaster(tronWeb.transactionBuilder.createSmartContract(
      {
        abi: tronToken.abi,
        bytecode: tronToken.bytecode,
        rawParameter: param1,
      },
      ADDRESS_BASE58
  ), PRIVATE_KEY)
  contractAddress3 = tronWeb.address.fromHex(tx3.transaction.contract_address)


  // abi:[]
  let triggerTransaction = await tronWeb.transactionBuilder.triggerSmartContract(
      contractAddress1, "transfer(address,uint256)",
      {
        rawParameter: param2,
      },
      [], ADDRESS_BASE58);
  const triggerTx = await broadcaster.broadcaster(null, PRIVATE_KEY, triggerTransaction.transaction);
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
  assert.equal("SUCCESS", triggerInfo.receipt.result);
  let functionSelector = 'balanceOf(address)';
  let param3 = await publicMethod.to64String(ADDRESS_HEX);
  let transaction = await tronWeb.transactionBuilder.triggerConstantContract(contractAddress1, functionSelector, {rawParameter: param3},
      [], ADDRESS_BASE58);
  let ownerBalanceAfter = tronWeb.BigNumber(transaction.constant_result[0], 16);
  assert.equal(ownerBalanceAfter, totalSupply-123);
  let param4 = await publicMethod.to64String(emptyAccount1.address.hex);
  transaction = await tronWeb.transactionBuilder.triggerConstantContract(contractAddress1, functionSelector, {rawParameter: param4},
      [], ADDRESS_BASE58);
  let newAccount1BalanceAfter = tronWeb.BigNumber(transaction.constant_result[0], 16);
  assert.equal(newAccount1BalanceAfter, 123);

  // abi:[{}]
  const triggerTransaction2 = await tronWeb.transactionBuilder.triggerSmartContract(
      contractAddress2, "transfer(address,uint256)",
      {
        rawParameter: param2,
      },
      [], ADDRESS_BASE58);
  const triggerTx2 = await broadcaster.broadcaster(null, PRIVATE_KEY, triggerTransaction2.transaction);
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
  assert.equal("SUCCESS", triggerInfo2.receipt.result);
  functionSelector = 'balanceOf(address)';
  param3 = await publicMethod.to64String(ADDRESS_HEX);
  transaction = await tronWeb.transactionBuilder.triggerConstantContract(contractAddress2, functionSelector, {rawParameter: param3},
      [], ADDRESS_BASE58);
  ownerBalanceAfter = tronWeb.BigNumber(transaction.constant_result[0], 16);
  assert.equal(ownerBalanceAfter, totalSupply-123);
  param4 = await publicMethod.to64String(emptyAccount1.address.hex);
  transaction = await tronWeb.transactionBuilder.triggerConstantContract(contractAddress2, functionSelector, {rawParameter: param4},
      [], ADDRESS_BASE58);
  newAccount1BalanceAfter = tronWeb.BigNumber(transaction.constant_result[0], 16);
  assert.equal(newAccount1BalanceAfter, 123);

  // trigger have abi with address and number
  triggerTransaction = await tronWeb.transactionBuilder.triggerSmartContract(
      contractAddress3, "transfer(address,uint256)",
      {
        rawParameter: param2,
      },
      [], ADDRESS_BASE58);
  await broadcaster.broadcaster(null, PRIVATE_KEY, triggerTransaction.transaction);
  assert.equal(triggerTransaction.transaction.txID.length, 64);
  let triggerInfo3;
  while (true) {
    triggerInfo3 = await tronWeb.trx.getTransactionInfo(triggerTransaction.transaction.txID);
    if (Object.keys(triggerInfo3).length === 0) {
      await wait(3);
      continue;
    } else {
      console.log("triggerInfo3:"+util.inspect(triggerInfo3))
      break;
    }
  }
  assert.equal("SUCCESS", triggerInfo3.receipt.result);
  functionSelector = 'balanceOf(address)';
  param3 = await publicMethod.to64String(ADDRESS_HEX);
  transaction = await tronWeb.transactionBuilder.triggerConstantContract(contractAddress3, functionSelector, {rawParameter: param3},
      [], ADDRESS_BASE58);
  ownerBalanceAfter = tronWeb.BigNumber(transaction.constant_result[0], 16);
  assert.equal(ownerBalanceAfter, totalSupply-123);
  param4 = await publicMethod.to64String(emptyAccount1.address.hex);
  transaction = await tronWeb.transactionBuilder.triggerConstantContract(contractAddress3, functionSelector, {rawParameter: param4},
      [], ADDRESS_BASE58);
  newAccount1BalanceAfter = tronWeb.BigNumber(transaction.constant_result[0], 16);
  assert.equal(newAccount1BalanceAfter, 123);

  // abi:{}
  // clear abi
  console.log("clear abi")
  const clearAbiTransaction = await tronWeb.transactionBuilder.clearABI(contractAddress3, ADDRESS_BASE58);
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
  triggerTransaction = await tronWeb.transactionBuilder.triggerSmartContract(
      contractAddress3, "transfer(address,uint256)",
      {
        rawParameter: param2,
      },
      [], ADDRESS_BASE58);
  await broadcaster.broadcaster(null, PRIVATE_KEY, triggerTransaction.transaction);
  assert.equal(triggerTransaction.transaction.txID.length, 64);
  let triggerInfo4;
  while (true) {
    triggerInfo4 = await tronWeb.trx.getTransactionInfo(triggerTransaction.transaction.txID);
    if (Object.keys(triggerInfo4).length === 0) {
      await wait(3);
      continue;
    } else {
      console.log("triggerInfo4:"+util.inspect(triggerInfo4))
      break;
    }
  }
  assert.equal("SUCCESS", triggerInfo4.receipt.result);
  functionSelector = 'balanceOf(address)';
  param3 = await publicMethod.to64String(ADDRESS_HEX);
  transaction = await tronWeb.transactionBuilder.triggerConstantContract(contractAddress3, functionSelector, {rawParameter: param3},
      [], ADDRESS_BASE58);
  ownerBalanceAfter = tronWeb.BigNumber(transaction.constant_result[0], 16);
  assert.equal(ownerBalanceAfter, totalSupply-246);
  param4 = await publicMethod.to64String(emptyAccount1.address.hex);
  transaction = await tronWeb.transactionBuilder.triggerConstantContract(contractAddress3, functionSelector, {rawParameter: param4},
      [], ADDRESS_BASE58);
  newAccount1BalanceAfter = tronWeb.BigNumber(transaction.constant_result[0], 16);
  assert.equal(newAccount1BalanceAfter, 246);
}

async function triggerSmartContractWithFuncABIV2_V1_input(){
  const transaction = await tronWeb.transactionBuilder.createSmartContract(
      {
        abi: funcABIV2.abi,
        bytecode: funcABIV2.bytecode,
        funcABIV2: funcABIV2.abi[0],
        parametersV2: [1]
      },
      ADDRESS_HEX
  );
  await broadcaster.broadcaster(null, PRIVATE_KEY, transaction);
  while (true) {
    const tx = await tronWeb.trx.getTransactionInfo(
        transaction.txID
    );
    if (Object.keys(tx).length === 0) {
      await wait(3);
      continue;
    } else {
      break;
    }
  }

  const deployed = await tronWeb.contract().at(transaction.contract_address);
  let check = await deployed.check().call();
  assert.ok(check.eq(1));

  /* test send method */
  const sendTxId = await deployed.setCheck(8).send({}, PRIVATE_KEY);
  while (true) {
    const tx = await tronWeb.trx.getTransactionInfo(
        sendTxId
    );
    if (Object.keys(tx).length === 0) {
      await wait(3);
      continue;
    } else {
      break;
    }
  }
  let check1 = await deployed.check().call();
  assert.ok(check1.eq(8));

  /* test triggersmartcontract */
  const setTransaction = await tronWeb.transactionBuilder.triggerSmartContract(
      transaction.contract_address,
      "setCheck(uint256)",
      {
        funcABIV2: funcABIV2.abi[2],
        parametersV2: [
          16
        ]
      },
      [],
      ADDRESS_HEX
  );
  await broadcaster.broadcaster(null, PRIVATE_KEY, setTransaction.transaction);

  check = await deployed.check().call();
  assert.ok(check.eq(16));
}

async function triggerSmartContractWithFuncABIV2_V2_input(){
  let coder = tronWeb.utils.abi;
  const abi = JSON.parse(funcABIV2_2.interface);
  const bytecode = funcABIV2_2.bytecode;
  const outputValues = getValues(JSON.parse(funcABIV2_2.values))
  let transaction = await tronWeb.transactionBuilder.createSmartContract(
      {
        abi,
        bytecode,
      },
      ADDRESS_HEX
  );
  await broadcaster.broadcaster(null, PRIVATE_KEY, transaction);
  while (true) {
    const tx = await tronWeb.trx.getTransactionInfo(
        transaction.txID
    );
    if (Object.keys(tx).length === 0) {
      await wait(3);
      continue;
    } else {
      break;
    }
  }

  let deployed = await tronWeb
  .contract(abi, transaction.contract_address)
  let check = await deployed.test().call();
  assert.ok(equals(check[0], outputValues[0]));

  transaction = await tronWeb.transactionBuilder.createSmartContract(
      {
        abi: funcABIV2_3.abi,
        bytecode: funcABIV2_3.bytecode,
      },
      ADDRESS_HEX
  );
  await broadcaster.broadcaster(null, PRIVATE_KEY, transaction);
  while (true) {
    const tx = await tronWeb.trx.getTransactionInfo(
        transaction.txID
    );
    if (Object.keys(tx).length === 0) {
      await wait(3);
      continue;
    } else {
      break;
    }
  }
  deployed = await tronWeb
  .contract(funcABIV2_3.abi, transaction.contract_address)
  let txID = await deployed.setStruct(['TPL66VK2gCXNCD7EJg9pgJRfqcRazjhUZY','TPL66VK2gCXNCD7EJg9pgJRfqcRazjhUZY','TPL66VK2gCXNCD7EJg9pgJRfqcRazjhUZY']).send();
  while (true) {
    const tx = await tronWeb.trx.getTransactionInfo(txID);
    if (Object.keys(tx).length === 0) {
      await wait(3);
      continue;
    } else {
      break;
    }
  }
  check = await deployed.s(0).call();
  assert.ok(equals(check, ['TPL66VK2gCXNCD7EJg9pgJRfqcRazjhUZY','TPL66VK2gCXNCD7EJg9pgJRfqcRazjhUZY','TPL66VK2gCXNCD7EJg9pgJRfqcRazjhUZY']));

  transaction = await tronWeb.transactionBuilder.createSmartContract(
      {
        abi: funcABIV2_4.abi,
        bytecode: funcABIV2_4.bytecode,
      },
      ADDRESS_HEX
  );
  await broadcaster.broadcaster(null, PRIVATE_KEY, transaction);
  while (true) {
    const tx = await tronWeb.trx.getTransactionInfo(
        transaction.txID
    );
    if (Object.keys(tx).length === 0) {
      await wait(3);
      continue;
    } else {
      break;
    }
  }
  deployed = await tronWeb
  .contract(funcABIV2_4.abi, transaction.contract_address);
  txID = await deployed.setStruct(['TPL66VK2gCXNCD7EJg9pgJRfqcRazjhUZY', 1000100, 'TPL66VK2gCXNCD7EJg9pgJRfqcRazjhUZY']).send();
  while (true) {
    const tx = await tronWeb.trx.getTransactionInfo(txID);
    if (Object.keys(tx).length === 0) {
      await wait(3);
      continue;
    } else {
      break;
    }
  }

  check = await deployed.s(0).call();
  assert.ok(equals(check, ['TPL66VK2gCXNCD7EJg9pgJRfqcRazjhUZY', 1000100, 'TPL66VK2gCXNCD7EJg9pgJRfqcRazjhUZY']));
}

async function encodeABIV2test1_V1_input(){
  let contractInstance;
  let contractAddress;
  // createSmartContract
  const options = {
    abi: abiV2Test1.abi,
    bytecode: abiV2Test1.bytecode,
    feeLimit:FEE_LIMIT,
    funcABIV2: abiV2Test1.abi[0],
    parametersV2: [
      [5],
      ADDRESS_BASE58,
      TOKEN_ID,
      ["q","w","e"],
      ["0xf579f9c22b185800e3b6e6886ffc8584215c05a5","0xd9dcae335acd3d4ffd2e6915dc702a59136ab46f"]
    ],
  };
  let transaction = await tronWeb.transactionBuilder.createSmartContract(options, ADDRESS_BASE58);
  await broadcaster.broadcaster(null, PRIVATE_KEY, transaction);
  console.log("transaction.txID:"+transaction.txID)
  assert.equal(transaction.txID.length, 64);
  let createInfo;
  contractAddress="41674f4632185a848b5cb18172de090112c6ab5676";
  while (true) {
    createInfo = await tronWeb.trx.getTransactionInfo(transaction.txID);
    if (Object.keys(createInfo).length === 0) {
      await wait(3);
      continue;
    } else {
      contractAddress = transaction.contract_address;
      console.log("contractAddress:"+contractAddress)
      break;
    }
  }
  contractInstance = await tronWeb.contract(abiV2Test1.abi,contractAddress);

  // strs
  let triggerTransaction = await tronWeb.transactionBuilder.triggerSmartContract(
      contractAddress, "changeStrs(string[])", {feeLimit:FEE_LIMIT}, [
        {type: 'string[]', value: ["o","p"]}
      ], ADDRESS_BASE58);
  let triggerTx = await broadcaster.broadcaster(null, PRIVATE_KEY, triggerTransaction.transaction);
  assert.equal(triggerTx.transaction.txID.length, 64);
  let triggerInfo;
  while (true) {
    triggerInfo = await tronWeb.trx.getTransactionInfo(triggerTx.transaction.txID);
    if (Object.keys(triggerInfo).length === 0) {
      await wait(3);
      continue;
    } else {
      break;
    }
  }
  transaction = await tronWeb.transactionBuilder.triggerConstantContract(
      contractAddress,
      "getStrs()",
      {},
      []);
  assert.equal(transaction.constant_result[0].substr(320,64),'6f00000000000000000000000000000000000000000000000000000000000000')
  assert.equal(transaction.constant_result[0].substr(448,64),'7000000000000000000000000000000000000000000000000000000000000000')

  // bys
  triggerTransaction = await tronWeb.transactionBuilder.triggerSmartContract(
      contractAddress, "changeBys(bytes[])", {feeLimit:FEE_LIMIT}, [
        {type: 'bytes[]', value: ["0x298fa36a9e2ebd6d3698e552987294fa8b65cd00","0x60f68c9b9e50"]}
      ], ADDRESS_BASE58);
  triggerTx = await broadcaster.broadcaster(null, PRIVATE_KEY, triggerTransaction.transaction);
  assert.equal(triggerTx.transaction.txID.length, 64);
  while (true) {
    triggerInfo = await tronWeb.trx.getTransactionInfo(triggerTx.transaction.txID);
    if (Object.keys(triggerInfo).length === 0) {
      await wait(3);
      continue;
    } else {
      break;
    }
  }
  transaction = await tronWeb.transactionBuilder.triggerConstantContract(
      contractAddress,
      "getBys()",
      {},
      []);
  assert.equal(transaction.constant_result[0].substr(320,40),'298fa36a9e2ebd6d3698e552987294fa8b65cd00')
  assert.equal(transaction.constant_result[0].substr(448,12),'60f68c9b9e50')

  // bool
  triggerTransaction = await tronWeb.transactionBuilder.triggerSmartContract(
      contractAddress, "changeBool(bool)", {feeLimit:FEE_LIMIT},
      [
        {type: 'bool', value: false}
      ], ADDRESS_BASE58);
  triggerTx = await broadcaster.broadcaster(null, PRIVATE_KEY, triggerTransaction.transaction);
  assert.equal(triggerTx.transaction.txID.length, 64);
  while (true) {
    triggerInfo = await tronWeb.trx.getTransactionInfo(triggerTx.transaction.txID);
    if (Object.keys(triggerInfo).length === 0) {
      await wait(3);
      continue;
    } else {
      break;
    }
  }
  transaction = await tronWeb.transactionBuilder.triggerConstantContract(
      contractAddress,
      "getBool()",
      {},
      []);
  assert.equal(parseInt(transaction.constant_result[0].substr(63,1),16),0);

  // int
  triggerTransaction = await tronWeb.transactionBuilder.triggerSmartContract(
      contractAddress, "changeInt(int256)", {feeLimit:FEE_LIMIT},
      [
        {type: 'int256', value: 37497}
      ], ADDRESS_BASE58);
  triggerTx = await broadcaster.broadcaster(null, PRIVATE_KEY, triggerTransaction.transaction);
  assert.equal(triggerTx.transaction.txID.length, 64);
  while (true) {
    triggerInfo = await tronWeb.trx.getTransactionInfo(triggerTx.transaction.txID);
    if (Object.keys(triggerInfo).length === 0) {
      await wait(3);
      continue;
    } else {
      break;
    }
  }
  transaction = await tronWeb.transactionBuilder.triggerConstantContract(
      contractAddress,
      "getInt()",
      {},
      []);
  assert.equal(parseInt(transaction.constant_result[0],16),37497);

  // negativeInt
  triggerTransaction = await tronWeb.transactionBuilder.triggerSmartContract(
      contractAddress, "changeNegativeInt(int256)", {feeLimit:FEE_LIMIT},
      [
        {type: 'int256', value: -37497}
      ], ADDRESS_BASE58);
  triggerTx = await broadcaster.broadcaster(null, PRIVATE_KEY, triggerTransaction.transaction);
  assert.equal(triggerTx.transaction.txID.length, 64);

  while (true) {
    triggerInfo = await tronWeb.trx.getTransactionInfo(triggerTx.transaction.txID);
    if (Object.keys(triggerInfo).length === 0) {
      await wait(3);
      continue;
    } else {
      break;
    }
  }
  transaction = await tronWeb.transactionBuilder.triggerConstantContract(
      contractAddress,
      "getNegativeInt()",
      {},
      []);
  assert.equal(transaction.constant_result[0],'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff6d87');
}

async function encodeABIV2test1_V2_input(){
  let contractInstance;
  let contractAddress;
  // createSmartContract
  const options = {
    abi: abiV2Test1.abi,
    bytecode: abiV2Test1.bytecode,
    feeLimit:FEE_LIMIT,
    funcABIV2: abiV2Test1.abi[0],
    parametersV2: [
      [5],
      ADDRESS_BASE58,
      TOKEN_ID,
      ["q","w","e"],
      ["0xf579f9c22b185800e3b6e6886ffc8584215c05a5","0xd9dcae335acd3d4ffd2e6915dc702a59136ab46f"]
    ],
  };
  let transaction = await tronWeb.transactionBuilder.createSmartContract(options, ADDRESS_BASE58);
  await broadcaster.broadcaster(null, PRIVATE_KEY, transaction);
  console.log("transaction.txID:"+transaction.txID)
  assert.equal(transaction.txID.length, 64);
  let createInfo;
  contractAddress="41674f4632185a848b5cb18172de090112c6ab5676";
  while (true) {
    createInfo = await tronWeb.trx.getTransactionInfo(transaction.txID);
    if (Object.keys(createInfo).length === 0) {
      await wait(3);
      continue;
    } else {
      contractAddress = transaction.contract_address;
      console.log("contractAddress:"+contractAddress)
      break;
    }
  }
  contractInstance = await tronWeb.contract(abiV2Test1.abi,contractAddress);
  const originAddress = await contractInstance.origin().call();
  assert.ok(equals(originAddress, ADDRESS_BASE58));
  const token = parseInt(await contractInstance.token().call(), 10);
  assert.ok(equals(token, TOKEN_ID));
  let strs = await contractInstance.getStrs().call();
  assert.ok(equals(strs, ["q","w","e"]));
  let bys = await contractInstance.getBys().call();
  assert.ok(equals(bys, ["0xf579f9c22b185800e3b6e6886ffc8584215c05a5","0xd9dcae335acd3d4ffd2e6915dc702a59136ab46f"]));

  // send&call--------------------------------------------------------------------------------------------
  // strs
  await contractInstance.changeStrs(["z","x"]).send({}, PRIVATE_KEY);
  strs = await contractInstance.getStrs().call();
  assert.ok(equals(strs, ["z","x"]));

  // bys
  await contractInstance.changeBys(["0x60F68C9B9e50","0x298fa36a9e2ebd6d3698e552987294fa8b65cd00"]).send({}, PRIVATE_KEY);
  bys = await contractInstance.getBys().call();
  assert.ok(equals(bys, ["0x60F68C9B9e50".toLowerCase(),"0x298fa36a9e2ebd6d3698e552987294fa8b65cd00"]));

  // data
  let txid=await contractInstance.changeMapAll(0,["a","s"],0,["0x60F68C9B9e50","0x298fa36a9e2ebd6d3698e552987294fa8b65cd00"],[687],[9,0,23,1],ADDRESS_BASE58,TOKEN_ID).send({}, PRIVATE_KEY);
  let triggerInfo;
  while (true) {
    triggerInfo = await tronWeb.trx.getTransactionInfo(txid);
    if (Object.keys(triggerInfo).length === 0) {
      await wait(3);
      continue;
    } else {
      break;
    }
  }
  assert.equal(triggerInfo.contractResult[0].substr(88,40),ADDRESS_HEX.substr(2))
  assert.equal(parseInt(triggerInfo.contractResult[0].substr(192,64),16),4)
  assert.equal(parseInt(triggerInfo.contractResult[0].substr(256,64),16),9)
  assert.equal(parseInt(triggerInfo.contractResult[0].substr(320,64),16),0)
  assert.equal(parseInt(triggerInfo.contractResult[0].substr(384,64),16),23)
  assert.equal(parseInt(triggerInfo.contractResult[0].substr(448,64),16),1)

  // changeMapAll2--3ceng struct
  txid=await contractInstance.changeMapAll2(0,["a","s"],0,["0x60F68C9B9e50","0x298fa36a9e2ebd6d3698e552987294fa8b65cd00"],[[[687],[9,0,23,1],"TJEuSMoC7tbs99XkbGhSDk7cM1xnxR931s",1000007]]).send({}, PRIVATE_KEY);
  while (true) {
    triggerInfo = await tronWeb.trx.getTransactionInfo(txid);
    if (Object.keys(triggerInfo).length === 0) {
      await wait(3);
      continue;
    } else {
      break;
    }
  }
  assert.equal(parseInt(triggerInfo.contractResult[0].substr(0,64),16),1000007)
  assert.equal(triggerInfo.contractResult[0].substr(88,40),"5ab90009b529c5406b4f8a6fc4dab8a2bc778c75")
  assert.equal(parseInt(triggerInfo.contractResult[0].substr(192,64),16),4)
  assert.equal(parseInt(triggerInfo.contractResult[0].substr(256,64),16),9)
  assert.equal(parseInt(triggerInfo.contractResult[0].substr(320,64),16),0)
  assert.equal(parseInt(triggerInfo.contractResult[0].substr(384,64),16),23)
  assert.equal(parseInt(triggerInfo.contractResult[0].substr(448,64),16),1)

  // changeMapAll3--4ceng struct
  txid=await contractInstance.changeMapAll3(0,["a","s"],0,["0x60F68C9B9e50","0x298fa36a9e2ebd6d3698e552987294fa8b65cd00"],[[[[67],[11,2,2323,1001],"TJEuSMoC7tbs99XkbGhSDk7cM1xnxR931s",1000007]]]).send({}, PRIVATE_KEY);
  while (true) {
    triggerInfo = await tronWeb.trx.getTransactionInfo(txid);
    if (Object.keys(triggerInfo).length === 0) {
      await wait(3);
      continue;
    } else {
      break;
    }
  }
  assert.equal(parseInt(triggerInfo.contractResult[0].substr(0,64),16),1000007)
  assert.equal(triggerInfo.contractResult[0].substr(88,40),"5ab90009b529c5406b4f8a6fc4dab8a2bc778c75")
  assert.equal(parseInt(triggerInfo.contractResult[0].substr(192,64),16),4)
  assert.equal(parseInt(triggerInfo.contractResult[0].substr(256,64),16),11)
  assert.equal(parseInt(triggerInfo.contractResult[0].substr(320,64),16),2)
  assert.equal(parseInt(triggerInfo.contractResult[0].substr(384,64),16),2323)
  assert.equal(parseInt(triggerInfo.contractResult[0].substr(448,64),16),1001)

  // StructArray
  txid=await contractInstance.changeStructArray([3],[4]).send({}, PRIVATE_KEY);
  while (true) {
    const tx = await tronWeb.trx.getTransactionInfo(txid);
    if (Object.keys(tx).length === 0) {
      await wait(3);
      continue;
    } else {
      break;
    }
  }
  const structArray = await contractInstance.getStructArray().call();
  assert.equal(structArray[1],3);
  assert.equal(structArray[2],4);
  contractInstance.getStructArray().call((err, data)=>{
    assert.equal(data.toString(),structArray.toString())
  });

  // bool
  await contractInstance.changeBool(true).send({}, PRIVATE_KEY);
  const bool = await contractInstance.getBool().call();
  assert.ok(equals(bool, true));

  // int
  await contractInstance.changeInt(68236424).send({}, PRIVATE_KEY);
  const intValue = await contractInstance.getInt().call();
  assert.ok(equals(intValue, 68236424));

  // negativeInt
  await contractInstance.changeNegativeInt(-68236424).send({}, PRIVATE_KEY);
  const negativeIntValue = await contractInstance.getNegativeInt().call();
  assert.ok(equals(negativeIntValue, -68236424));
  contractInstance.getNegativeInt().call((err, data)=>{
    assert.equal(data.toString(),negativeIntValue.toString())
  });

  // triggerSmartContract&triggerConstantContract--------------------------------------------------------------------------------------------
  // strs
  let triggerTransaction = await tronWeb.transactionBuilder.triggerSmartContract(
      contractAddress, "changeStrs(string[])", {feeLimit:FEE_LIMIT,funcABIV2:abiV2Test1.abi[15],parametersV2:[["o","p"]]}, [], ADDRESS_BASE58);
  let triggerTx = await broadcaster.broadcaster(null, PRIVATE_KEY, triggerTransaction.transaction);
  assert.equal(triggerTx.transaction.txID.length, 64);
  while (true) {
    triggerInfo = await tronWeb.trx.getTransactionInfo(triggerTx.transaction.txID);
    if (Object.keys(triggerInfo).length === 0) {
      await wait(3);
      continue;
    } else {
      break;
    }
  }
  transaction = await tronWeb.transactionBuilder.triggerConstantContract(
      contractAddress,
      "getStrs()",
      {},
      []);
  assert.equal(transaction.constant_result[0].substr(320,64),'6f00000000000000000000000000000000000000000000000000000000000000')
  assert.equal(transaction.constant_result[0].substr(448,64),'7000000000000000000000000000000000000000000000000000000000000000')

  // bys
  triggerTransaction = await tronWeb.transactionBuilder.triggerSmartContract(
      contractAddress, "changeBys(bytes[])", {feeLimit:FEE_LIMIT,funcABIV2:abiV2Test1.abi[9],parametersV2:[["0x298fa36a9e2ebd6d3698e552987294fa8b65cd00","0x60f68c9b9e50"]]}, [], ADDRESS_BASE58);
  triggerTx = await broadcaster.broadcaster(null, PRIVATE_KEY, triggerTransaction.transaction);
  assert.equal(triggerTx.transaction.txID.length, 64);
  while (true) {
    triggerInfo = await tronWeb.trx.getTransactionInfo(triggerTx.transaction.txID);
    if (Object.keys(triggerInfo).length === 0) {
      await wait(3);
      continue;
    } else {
      break;
    }
  }
  transaction = await tronWeb.transactionBuilder.triggerConstantContract(
      contractAddress,
      "getBys()",
      {},
      []);
  assert.equal(transaction.constant_result[0].substr(320,40),'298fa36a9e2ebd6d3698e552987294fa8b65cd00')
  assert.equal(transaction.constant_result[0].substr(448,12),'60f68c9b9e50')

  // data
  triggerTransaction = await tronWeb.transactionBuilder.triggerSmartContract(
      contractAddress, "changeMapAll(uint256,string[],uint256,bytes[],(uint256),uint256[],address,trcToken)", {feeLimit:FEE_LIMIT,funcABIV2:abiV2Test1.abi[11],parametersV2:[0,["a","s"],0,["0x60F68C9B9e50","0x298fa36a9e2ebd6d3698e552987294fa8b65cd00"],[687],[9,0,23,1],ADDRESS_BASE58,TOKEN_ID]},
      [], ADDRESS_BASE58);
  triggerTx = await broadcaster.broadcaster(null, PRIVATE_KEY, triggerTransaction.transaction);
  assert.equal(triggerTx.transaction.txID.length, 64);
  while (true) {
    triggerInfo = await tronWeb.trx.getTransactionInfo(triggerTx.transaction.txID);
    if (Object.keys(triggerInfo).length === 0) {
      await wait(3);
      continue;
    } else {
      break;
    }
  }
  console.log("triggerInfo:"+util.inspect(triggerInfo))
  assert.equal(triggerInfo.contractResult[0].substr(88,40),ADDRESS_HEX.substr(2))
  assert.equal(parseInt(triggerInfo.contractResult[0].substr(192,64),16),4)
  assert.equal(parseInt(triggerInfo.contractResult[0].substr(256,64),16),9)
  assert.equal(parseInt(triggerInfo.contractResult[0].substr(320,64),16),0)
  assert.equal(parseInt(triggerInfo.contractResult[0].substr(384,64),16),23)
  assert.equal(parseInt(triggerInfo.contractResult[0].substr(448,64),16),1)

  // changeMapAll2--3ceng struct
  triggerTransaction = await tronWeb.transactionBuilder.triggerSmartContract(
      contractAddress, "changeMapAll2(uint256,string[],uint256,bytes[],(((uint256),uint256[],address,trcToken)))", {feeLimit:FEE_LIMIT,funcABIV2:abiV2Test1.abi[12],parametersV2:[0,["a","s"],0,["0x60F68C9B9e50","0x298fa36a9e2ebd6d3698e552987294fa8b65cd00"],[[[683],[5,6,68,9],"TV75jZpdmP2juMe1dRwGrwpV6AMU6mr1EU",1000008]]]},
      [], ADDRESS_BASE58);
  triggerTx = await broadcaster.broadcaster(null, PRIVATE_KEY, triggerTransaction.transaction);
  assert.equal(triggerTx.transaction.txID.length, 64);
  while (true) {
    triggerInfo = await tronWeb.trx.getTransactionInfo(triggerTx.transaction.txID);
    if (Object.keys(triggerInfo).length === 0) {
      await wait(3);
      continue;
    } else {
      break;
    }
  }
  assert.equal(parseInt(triggerInfo.contractResult[0].substr(0,64),16),1000008)
  assert.equal(triggerInfo.contractResult[0].substr(88,40),'d1e7a6bc354106cb410e65ff8b181c600ff14292')
  assert.equal(parseInt(triggerInfo.contractResult[0].substr(192,64),16),4)
  assert.equal(parseInt(triggerInfo.contractResult[0].substr(256,64),16),5)
  assert.equal(parseInt(triggerInfo.contractResult[0].substr(320,64),16),6)
  assert.equal(parseInt(triggerInfo.contractResult[0].substr(384,64),16),68)
  assert.equal(parseInt(triggerInfo.contractResult[0].substr(448,64),16),9)

  // changeMapAll2--4ceng struct
  triggerTransaction = await tronWeb.transactionBuilder.triggerSmartContract(
      contractAddress, "changeMapAll3(uint256,string[],uint256,bytes[],((((uint256),uint256[],address,trcToken))))", {feeLimit:FEE_LIMIT,funcABIV2:abiV2Test1.abi[13],parametersV2:[0,["a","s"],0,["0x60F68C9B9e50","0x298fa36a9e2ebd6d3698e552987294fa8b65cd00"],[[[[683],[5,6,68,9],"TV75jZpdmP2juMe1dRwGrwpV6AMU6mr1EU",1000008]]]]},
      [], ADDRESS_BASE58);
  triggerTx = await broadcaster.broadcaster(null, PRIVATE_KEY, triggerTransaction.transaction);
  assert.equal(triggerTx.transaction.txID.length, 64);
  while (true) {
    triggerInfo = await tronWeb.trx.getTransactionInfo(triggerTx.transaction.txID);
    if (Object.keys(triggerInfo).length === 0) {
      await wait(3);
      continue;
    } else {
      break;
    }
  }
  console.log("changeMapAll3:"+util.inspect(triggerInfo))
  assert.equal(parseInt(triggerInfo.contractResult[0].substr(0,64),16),1000008)
  assert.equal(triggerInfo.contractResult[0].substr(88,40),'d1e7a6bc354106cb410e65ff8b181c600ff14292')
  assert.equal(parseInt(triggerInfo.contractResult[0].substr(192,64),16),4)
  assert.equal(parseInt(triggerInfo.contractResult[0].substr(256,64),16),5)
  assert.equal(parseInt(triggerInfo.contractResult[0].substr(320,64),16),6)
  assert.equal(parseInt(triggerInfo.contractResult[0].substr(384,64),16),68)
  assert.equal(parseInt(triggerInfo.contractResult[0].substr(448,64),16),9)

  // StructArray
  triggerTransaction = await tronWeb.transactionBuilder.triggerSmartContract(
      contractAddress, "changeStructArray((uint256),(uint256))", {feeLimit:FEE_LIMIT,funcABIV2:abiV2Test1.abi[16],parametersV2:[[909],[404]]},
      [], ADDRESS_BASE58);
  triggerTx = await broadcaster.broadcaster(null, PRIVATE_KEY, triggerTransaction.transaction);
  assert.equal(triggerTx.transaction.txID.length, 64);
  console.log("StructArray  tx: "+triggerTx.transaction.txID)
  while (true) {
    triggerInfo = await tronWeb.trx.getTransactionInfo(triggerTx.transaction.txID);
    if (Object.keys(triggerInfo).length === 0) {
      await wait(3);
      continue;
    } else {
      break;
    }
  }
  transaction = await tronWeb.transactionBuilder.triggerConstantContract(
      contractAddress,
      "getStructArray()",
      {},
      []);
  assert.equal(parseInt(transaction.constant_result[0].substr(transaction.constant_result[0].length-128,64),16),909);
  assert.equal(parseInt(transaction.constant_result[0].substr(transaction.constant_result[0].length-64,64),16),404);

  // bool
  triggerTransaction = await tronWeb.transactionBuilder.triggerSmartContract(
      contractAddress, "changeBool(bool)", {feeLimit:FEE_LIMIT,funcABIV2:abiV2Test1.abi[8],parametersV2:[false]},
      [], ADDRESS_BASE58);
  triggerTx = await broadcaster.broadcaster(null, PRIVATE_KEY, triggerTransaction.transaction);
  assert.equal(triggerTx.transaction.txID.length, 64);
  while (true) {
    triggerInfo = await tronWeb.trx.getTransactionInfo(triggerTx.transaction.txID);
    if (Object.keys(triggerInfo).length === 0) {
      await wait(3);
      continue;
    } else {
      break;
    }
  }
  transaction = await tronWeb.transactionBuilder.triggerConstantContract(
      contractAddress,
      "getBool()",
      {},
      []);
  assert.equal(parseInt(transaction.constant_result[0].substr(63,1),16),0);

  // int
  triggerTransaction = await tronWeb.transactionBuilder.triggerSmartContract(
      contractAddress, "changeInt(int256)", {feeLimit:FEE_LIMIT,funcABIV2:abiV2Test1.abi[10],parametersV2:[37497]},
      [], ADDRESS_BASE58);
  triggerTx = await broadcaster.broadcaster(null, PRIVATE_KEY, triggerTransaction.transaction);
  assert.equal(triggerTx.transaction.txID.length, 64);
  while (true) {
    triggerInfo = await tronWeb.trx.getTransactionInfo(triggerTx.transaction.txID);
    if (Object.keys(triggerInfo).length === 0) {
      await wait(3);
      continue;
    } else {
      break;
    }
  }
  transaction = await tronWeb.transactionBuilder.triggerConstantContract(
      contractAddress,
      "getInt()",
      {},
      []);
  assert.equal(parseInt(transaction.constant_result[0],16),37497);

  // negativeInt
  triggerTransaction = await tronWeb.transactionBuilder.triggerSmartContract(
      contractAddress, "changeNegativeInt(int256)", {feeLimit:FEE_LIMIT,funcABIV2:abiV2Test1.abi[14],parametersV2:[-37497]},
      [], ADDRESS_BASE58);
  triggerTx = await broadcaster.broadcaster(null, PRIVATE_KEY, triggerTransaction.transaction);
  assert.equal(triggerTx.transaction.txID.length, 64);

  while (true) {
    triggerInfo = await tronWeb.trx.getTransactionInfo(triggerTx.transaction.txID);
    if (Object.keys(triggerInfo).length === 0) {
      await wait(3);
      continue;
    } else {
      break;
    }
  }
  transaction = await tronWeb.transactionBuilder.triggerConstantContract(
      contractAddress,
      "getNegativeInt()",
      {},
      []);
  assert.equal(transaction.constant_result[0],'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff6d87');
}

async function transactionBuilderTestAll(){
  console.log("transactionBuilderTestAll start")
  await transactionBuilderBefore();
  await sendTrx();
  await createToken();
  await updateToken();
  await purchaseToken();
  await sendToken();
  await createProposal();
  await deleteProposal();
  await applyForSR();
  await freezeBalance();
  await vote();
  await createSmartContract();
  await createSmartContractWithArray3();
  await createSmartContractWithTrctokenAndStateMutability();
  await createSmartContractWithPayable();
  await triggerConstantContract();
  await triggerComfirmedConstantContract();
  await clearabi();
  await updateBrokerage();
  await withdrawBlockRewards();
  await triggerSmartContract();
  await triggerSmartContractWithArrays();
  await triggerSmartContractWithTrctoken();
  await createTokenExchange();
  await createTRXExchange();
  await injectExchangeTokens();
  await withdrawExchangeTokens();
  await tradeExchangeTokens();
  await alterExistentTransactions();
  await withdrawBlockRewards();
  await rawParameter();
  await triggerSmartContractWithFuncABIV2_V1_input();
  await triggerSmartContractWithFuncABIV2_V2_input();
  await encodeABIV2test1_V1_input();
  await encodeABIV2test1_V2_input();
  console.log("transactionBuilderTestAll end")
}

export{
  transactionBuilderTestAll
}
