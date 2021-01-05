import React from 'react';
const {ADDRESS_BASE58,ADDRESS_HEX,PRIVATE_KEY, UPDATED_TEST_TOKEN_OPTIONS, getTokenOptions, isProposalApproved} = require('../util/config');
const {testRevert, testConstant, arrayParam} = require('../util/contracts');
const tronWebBuilder = require('../util/tronWebBuilder');
const broadcaster = require('../util/broadcaster');
const assertEqualHex = require('../util/assertEqualHex');
const waitChainData = require('../util/waitChainData');
const pollAccountFor = require('../util/pollAccountFor');
const assertThrow = require('../util/assertThrow');
const txPars = require('../util/txPars');
const TronWeb = tronWebBuilder.TronWeb;
const wait = require('../util/wait');
const chai = require('chai');
const assert = chai.assert;
const util = require('util');
let tronWeb;
let emptyAccounts;
let isAllowSameTokenNameApproved

async function transactionBuilderBefore(){
  tronWeb = tronWebBuilder.createInstance();
  emptyAccounts = await TronWeb.createAccount();
  isAllowSameTokenNameApproved = await isProposalApproved(tronWeb, 'getAllowSameTokenName')

  assert.instanceOf(tronWeb.transactionBuilder, TronWeb.TransactionBuilder);
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
  const emptyAccount6 = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount6.address.hex,5000000000,{privateKey: PRIVATE_KEY})

  let options = getTokenOptions();
  for (let i = 0; i < 2; i++) {
    if (i === 1) {
      options.permissionId = 2;
      options.saleStart = Date.now() + 500;
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
      const transaction = await tronWeb.transactionBuilder.createToken(options, tempAccount.address.base58);

      const parameter = txPars(transaction);
      assert.equal(transaction.txID.length, 64);
      assert.equal(parameter.value.vote_score, options.voteScore);
      assert.equal(parameter.value.precision, options.precision);
      assert.equal(parameter.value.total_supply, options.totalSupply);
      await assertEqualHex(parameter.value.abbr, options.abbreviation);
      assert.equal(parameter.value.owner_address, tempAccount.address.hex.toLowerCase());
      assert.equal(parameter.type_url, 'type.googleapis.com/protocol.AssetIssueContract');
      assert.equal(transaction.raw_data.contract[0].Permission_id || 0, options.permissionId || 0);

      await broadcaster.broadcaster(null, tempAccount.privateKey, transaction)

      const tokenList = await tronWeb.trx.getTokensIssuedByAddress(tempAccount.address.base58)
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
  options.saleEnd = options.saleEnd.toString()
  for (let i = 0; i < 2; i++) {
    if (i === 1) options.permissionId = 2;
    const transaction = await tronWeb.transactionBuilder.createToken(options);
    const parameter = txPars(transaction);
    await assertEqualHex(parameter.value.abbr, options.abbreviation);
    assert.equal(transaction.raw_data.contract[0].Permission_id || 0, options.permissionId || 0);
  }

  console.log("4444")
  if (tronWeb.fullnodeSatisfies('^3.6.0')) {
    const options = getTokenOptions();
    options.totalSupply = '100'
    options.frozenAmount = '0'
    options.frozenDuration = '0'
    options.saleEnd = options.saleEnd.toString()
    for (let i = 0; i < 2; i++) {
      if (i === 1) options.permissionId = 2;
      const transaction = await tronWeb.transactionBuilder.createToken(options);
      const parameter = txPars(transaction);
      await assertEqualHex(parameter.value.abbr, options.abbreviation);
      assert.equal(transaction.raw_data.contract[0].Permission_id || 0, options.permissionId || 0);
    }
  } else {
    this.skip()
  }

  if (isAllowSameTokenNameApproved) {

    const options = getTokenOptions();

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

  options = getTokenOptions();
  const transaction = await tronWeb.transactionBuilder.createAsset(options, emptyAccount6.address.base58);
  const parameter = txPars(transaction);
  assert.equal(transaction.txID.length, 64);
  assert.equal(parameter.value.total_supply, options.totalSupply);
  await assertEqualHex(parameter.value.abbr, options.abbreviation);
  assert.equal(parameter.value.owner_address, emptyAccount6.address.hex.toLowerCase());
  assert.equal(parameter.type_url, 'type.googleapis.com/protocol.AssetIssueContract');
}

async function updateToken(){
  const emptyAccount1 = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount1.address.hex,5000000000,{privateKey: PRIVATE_KEY})

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
    await wait(10)

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
}

async function sendToken(){
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
    await wait(4)

    await broadcaster.broadcaster(tronWeb.transactionBuilder.purchaseToken(emptyAccount1.address.base58, tokenID, 50, emptyAccount3.address.base58), emptyAccount3.privateKey)

    await wait(10)

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
}

async function createProposal(){
  const emptyAccount1 = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount1.address.hex,10000000000,{privateKey: PRIVATE_KEY})

  let parameters = [{"key": 0, "value": 100000}, {"key": 1, "value": 2}]

  let inputs = [
    [parameters[0], ADDRESS_BASE58, {permissionId: 2}],
    [parameters[0], ADDRESS_BASE58]
  ];
  for (let input of inputs) {
    const transaction = await tronWeb.transactionBuilder.createProposal(...input)

    const parameter = txPars(transaction);

    assert.equal(parameter.value.owner_address, ADDRESS_HEX);
    assert.equal(parameter.value.parameters[0].value, parameters[0].value);
    assert.equal(parameter.type_url, 'type.googleapis.com/protocol.ProposalCreateContract');
    assert.equal(transaction.raw_data.contract[0].Permission_id || 0, input[2] ? input[2]['permissionId'] : 0);
  }

  inputs = [
    [parameters, ADDRESS_BASE58, {permissionId: 2}],
    [parameters, ADDRESS_BASE58]
  ];
  for (let input of inputs) {
    const transaction = await tronWeb.transactionBuilder.createProposal(...input)

    const parameter = txPars(transaction);

    assert.equal(parameter.value.owner_address, ADDRESS_HEX);
    assert.equal(parameter.value.parameters[0].value, parameters[0].value);
    assert.equal(parameter.type_url, 'type.googleapis.com/protocol.ProposalCreateContract');
    assert.equal(transaction.raw_data.contract[0].Permission_id || 0, input[2] ? input[2]['permissionId'] : 0);
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
  let parameters = [{"key": 0, "value": 100000}, {"key": 1, "value": 2}]
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
  }
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
    assert.equal(tx.raw_data.fee_limit, 4e7);
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

async function transactionBuilderTestAll(){
  console.log("transactionBuilderTestAll start")
  await transactionBuilderBefore();
  // await sendTrx();
  // await createToken();
  // await updateToken();
  // await purchaseToken();
  // await sendToken();
  // await createProposal();
  // await deleteProposal();
  // await applyForSR();
  // await freezeBalance();
  // await vote();
  // await createSmartContract();
  // await triggerConstantContract();
  // await triggerComfirmedConstantContract();
  // await clearabi();
  // await updateBrokerage();
  // await withdrawBlockRewards();
  // await triggerSmartContract();
  // await createTokenExchange();
  // await createTRXExchange();
  // await injectExchangeTokens();
  await withdrawExchangeTokens();
  await tradeExchangeTokens();
  await alterExistentTransactions();
  await withdrawBlockRewards();
  console.log("transactionBuilderTestAll end")
}

export{
  transactionBuilderTestAll
}
