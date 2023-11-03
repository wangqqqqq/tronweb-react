import React from 'react';
const {ADDRESS_BASE58,ADDRESS_HEX,PRIVATE_KEY, FEE_LIMIT} = require('../util/config');
const testDeployRevert = require('../util/contracts').testDeployRevert;
const testTriggerError = require('../util/contracts').testTriggerError;
const tronWebBuilder = require('../util/tronWebBuilder');
const {equals, getValues} = require('../util/testUtils');
// const {loadTests} = require('../util/disk-utils');
const broadcaster = require('../util/broadcaster');
const wait = require('../util/wait');
const assert = require('assert');
const util = require('util');
import {json} from '../util/contract-interface'
import {json2} from '../util/contract-interface-abi2'

const utils = tronWebBuilder.utils

async function decodeParams1(){

  const tronWeb = tronWebBuilder.createInstance();
  const types = ['string', 'string', 'uint8', 'bytes32', 'uint256'];
  const output = '0x00000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000e00000000000000000000000000000000000000000000000000000000000000012dc03b7993bad736ad595eb9e3ba51877ac17ecc31d2355f8f270125b9427ece700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000011506920446179204e30306220546f6b656e00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000035049450000000000000000000000000000000000000000000000000000000000';

  const expected = [
    'Pi Day N00b Token',
    'PIE',
    18,
    '0xdc03b7993bad736ad595eb9e3ba51877ac17ecc31d2355f8f270125b9427ece7',
    0
  ];

  const result = tronWeb.utils.abi.decodeParams([],types, output);

  for(let i = 0; i < expected.length; i++) {
    assert.equal(result[i], expected[i]);
  }
}

async function decodeParams2(){

  const tronWeb = tronWebBuilder.createInstance();
  const names = ['Token', 'Graph', 'Qty', 'Bytes', 'Total'];
  const types = ['string', 'string', 'uint8', 'bytes32', 'uint256'];
  const output = '0x00000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000e00000000000000000000000000000000000000000000000000000000000000012dc03b7993bad736ad595eb9e3ba51877ac17ecc31d2355f8f270125b9427ece700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000011506920446179204e30306220546f6b656e00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000035049450000000000000000000000000000000000000000000000000000000000';

  const expected = {
    Token: 'Pi Day N00b Token',
    Graph: 'PIE',
    Qty: 18,
    Bytes: '0xdc03b7993bad736ad595eb9e3ba51877ac17ecc31d2355f8f270125b9427ece7',
    Total: 0
  };

  const result = tronWeb.utils.abi.decodeParams(names, types, output);
  for(let i in expected) {
    assert.equal(result[i], expected[i]);
  }
}

async function decodeParams3(){
  let tronWeb = tronWebBuilder.createInstance();
  let types = ['string', 'string', 'uint8', 'bytes32', 'uint256'];
  let output =
      '00000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000e00000000000000000000000000000000000000000000000000000000000000012dc03b7993bad736ad595eb9e3ba51877ac17ecc31d2355f8f270125b9427ece700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000011506920446179204e30306220546f6b656e00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000035049450000000000000000000000000000000000000000000000000000000000';
  assert.throws(() => {
    tronWeb.utils.abi.decodeParams([], types, output)
  }, 'invalid arrayify value');

  tronWeb = tronWebBuilder.createInstance();
  types = ['string', 'string', 'uint8', 'bytes32', 'uint256'];
  output = '0x00000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000e00000000000000000000000000000000000000000000000000000000000000012dc03b7993bad736ad595eb9e3ba51877ac17ecc31d2355f8f270125b9427ece700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000011506920446179204e30306220546f6b656e0000000000000000000000000000005049450000000000000000000000000000000000000000000000000000000000';

  assert.throws(() => {
    tronWeb.utils.abi.decodeParams([], types, output)
  }, 'overflow');

  tronWeb = tronWebBuilder.createInstance();
  types = ['string'];
  output = '0x6630f88f000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000046173646600000000000000000000000000000000000000000000000000000000';

  assert.throws(() => {
    tronWeb.utils.abi.decodeParams([],types, output)
  }, 'The encoded string is not valid. Its length must be a multiple of 64.');

  tronWeb = tronWebBuilder.createInstance();
  types = ['string'];
  output = '0x6630f88f000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000046173646600000000000000000000000000000000000000000000000000000000';

  const result = tronWeb.utils.abi.decodeParams([],types, output, true)
  assert.equal(result, 'asdf')
}

async function encodeParams1() {
  const tronWeb = tronWebBuilder.createInstance();
  const types = ['string', 'string', 'uint8', 'bytes32', 'uint256'];
  const values = [
    'Pi Day N00b Token',
    'PIE',
    18,
    '0xdc03b7993bad736ad595eb9e3ba51877ac17ecc31d2355f8f270125b9427ece7',
    0
  ];

  const expected = '0x00000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000e00000000000000000000000000000000000000000000000000000000000000012dc03b7993bad736ad595eb9e3ba51877ac17ecc31d2355f8f270125b9427ece700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000011506920446179204e30306220546f6b656e00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000035049450000000000000000000000000000000000000000000000000000000000';


  const result = tronWeb.utils.abi.encodeParams(types, values);

  for(let i = 0; i < expected.length; i++) {
    assert.equal(result[i], expected[i]);
  }
}

async function encodeParams2() {
  const tronWeb = tronWebBuilder.createInstance();
  const types = ['string', 'address', 'address'];
  const values = [
    'Onwer',
    ADDRESS_HEX,
    ADDRESS_BASE58
  ];

  const expected = '0x00000000000000000000000000000000000000000000000000000000000000600000000000000000000000005624c12e308b03a1a6b21d9b86e3942fac1ab92b0000000000000000000000005624c12e308b03a1a6b21d9b86e3942fac1ab92b00000000000000000000000000000000000000000000000000000000000000054f6e776572000000000000000000000000000000000000000000000000000000';
  const result = tronWeb.utils.abi.encodeParams(types, values);

  for(let i = 0; i < expected.length; i++) {
    console.log("result["+i+"]:"+result[i]+",expected["+i+"]:"+expected[i])
    assert.equal(result[i], expected[i]);
  }
}

async function encodeParamsV2ByABI_v1_input() {
  const tronWeb = tronWebBuilder.createInstance();
  let coder = tronWeb.utils.abi;

  json.forEach((test) => {
    let { normalizedValues, result, interfac } = test;
    const funcABI = JSON.parse(interfac);
    const inputValues = getValues(JSON.parse(normalizedValues))
    funcABI[0].inputs = funcABI[0].outputs;
    let title = test.name + ' => (' + test.types + ') = (' + test.normalizedValues + ')';
    const encoded = coder.encodeParamsV2ByABI(funcABI[0], inputValues);
    console.log("encoded: ",encoded)
    assert.ok(equals(encoded, result), 'encoded data - ' + title);
  });
}

async function encodeParamsV2ByABI_v2_input() {
  const tronWeb = tronWebBuilder.createInstance();
  let coder = tronWeb.utils.abi;

  json2.forEach((test) => {
    let { values, result, interfac } = test;
    const funcABI = JSON.parse(interfac);
    const inputValues = getValues(JSON.parse(values));
    funcABI[0].inputs = funcABI[0].outputs;
    let title = test.name + ' => (' + test.types + ') = (' + test.normalizedValues + ')';
    const encoded = coder.encodeParamsV2ByABI(funcABI[0], inputValues);
    assert.ok(equals(encoded, result), 'encoded data - ' + title);
  });
}

async function decodeParamsV2ByABI_v1_input() {
  const tronWeb = tronWebBuilder.createInstance();
  let coder = tronWeb.utils.abi;

  json.forEach((test) => {
    let { normalizedValues, result, interfac } = test;
    const funcABI = JSON.parse(interfac);
    const outputValues = getValues(JSON.parse(normalizedValues))
    let title = test.name + ' => (' + test.types + ') = (' + test.normalizedValues + ')';
    const decoded = coder.decodeParamsV2ByABI(funcABI[0], result);
    assert.ok(equals(decoded, outputValues), 'decoded data - ' + title);
  });
}

async function decodeParamsV2ByABI_v2_input() {
  const tronWeb = tronWebBuilder.createInstance();
  let coder = tronWeb.utils.abi;

  json2.forEach((test) => {
    let { values, result, interfac } = test;
    const funcABI = JSON.parse(interfac);
    const outputValues = getValues(JSON.parse(values))
    let title = test.name + ' => (' + test.types + ') = (' + test.normalizedValues + ')';
    const decoded = coder.decodeParamsV2ByABI(funcABI[0], result);
    assert.ok(equals(decoded, outputValues), 'decoded data - ' + title);
  });
}

async function abiTestAll(){
  console.log("abiTestAll start")
  await decodeParams1();
  await decodeParams2();
  await decodeParams3();
  await encodeParams1();
  await encodeParams2();
  await encodeParamsV2ByABI_v1_input();
  await encodeParamsV2ByABI_v2_input();
  await decodeParamsV2ByABI_v1_input();
  await decodeParamsV2ByABI_v2_input();
  console.log("abiTestAll end")
}

export{
  abiTestAll
}