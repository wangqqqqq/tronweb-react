import React from 'react';
const {ADDRESS_BASE58,ADDRESS_HEX,PRIVATE_KEY, FEE_LIMIT} = require('../util/config');
const testDeployRevert = require('../util/contracts').testDeployRevert;
const testTriggerError = require('../util/contracts').testTriggerError;
const tronWebBuilder = require('../util/tronWebBuilder');
const broadcaster = require('../util/broadcaster');
const wait = require('../util/wait');
const chai = require('chai');
const assert = chai.assert;
const util = require('util');

async function bin2String(){
  const tronWeb = tronWebBuilder.createInstance();

  assert.equal(tronWeb.utils.code.bin2String([78, 112, 87, 69, 99, 65]), 'NpWEcA');
}

async function arrayEquals(){
  const tronWeb = tronWebBuilder.createInstance();

  const a = [78, 112, 87, 69, 99, 65];
  const b = [78, 112, 69, 99, 65];
  const c = [78, 112, 69, 99, 65];
  const d = [78, 'casa', {a: 1}, 99, [65, 2]];
  const e = [78, 'casa', {a: 1}, 99, [65, 2]];

  assert.isTrue(tronWeb.utils.code.arrayEquals(a, a));
  assert.isTrue(tronWeb.utils.code.arrayEquals(b, c));
  assert.isTrue(tronWeb.utils.code.arrayEquals(d, e));

  assert.isFalse(tronWeb.utils.code.arrayEquals(a, b));
  assert.isFalse(tronWeb.utils.code.arrayEquals(d, e, true));
}

async function stringToBytes(){
  const tronWeb = tronWebBuilder.createInstance();

  const a = 'Қࡀпω';

  assert.isTrue(tronWeb.utils.code.arrayEquals(tronWeb.utils.code.stringToBytes('Қࡀпω'), [210, 154, 224, 161, 128, 208, 191, 207, 137], true));

  assert.equal(tronWeb.utils.bytes.bytesToString([1178, 2112, 1087, 969]), 'Қࡀпω');

  assert.throws(() => {
    tronWeb.utils.code.stringToBytes([210, 154, 224, 161, 128, 208, 191, 207, 137])
  }, 'The passed string is not a string');

  assert.throws(() => {
    tronWeb.utils.code.stringToBytes(356253)
  }, 'The passed string is not a string');
}

async function hexChar2byte(){
  const tronWeb = tronWebBuilder.createInstance();

  assert.equal(tronWeb.utils.code.hexChar2byte('0'), 0);
  assert.equal(tronWeb.utils.code.hexChar2byte('D'), 13);
  assert.equal(tronWeb.utils.code.hexChar2byte('d'), 13);
  assert.equal(tronWeb.utils.code.hexChar2byte('7'), 7);

  assert.throws(() => {
    tronWeb.utils.code.hexChar2byte(12)
  }, 'The passed hex char is not a valid hex char');

  assert.throws(() => {
    tronWeb.utils.code.hexChar2byte('Z')
  }, 'The passed hex char is not a valid hex char');
}

async function isHexChar(){
  const tronWeb = tronWebBuilder.createInstance();

  assert.equal(tronWeb.utils.code.isHexChar('0'), 1);
  assert.equal(tronWeb.utils.code.isHexChar('e'), 1);
  assert.equal(tronWeb.utils.code.isHexChar('D'), 1);

  assert.equal(tronWeb.utils.code.isHexChar('Z'), 0);
  assert.equal(tronWeb.utils.code.isHexChar(66), 0);
}

async function hexStr2byteArray(){
  const tronWeb = tronWebBuilder.createInstance();

  assert.isTrue(tronWeb.utils.code.arrayEquals(tronWeb.utils.code.hexStr2byteArray('49206C6F7665206461726B20636F6D6564696573'), [73, 32, 108, 111, 118, 101, 32, 100, 97, 114, 107, 32, 99, 111, 109, 101, 100, 105, 101, 115]));

  assert.throws(() => {
    tronWeb.utils.code.hexStr2byteArray('ZASSyue')
  }, 'The passed hex char is not a valid hex string');

  assert.throws(() => {
    tronWeb.utils.code.hexStr2byteArray(123)
  }, 'The passed string is not a string');
}

async function strToDate(){
  const tronWeb = tronWebBuilder.createInstance();

  let input = '2018-09-23 13-45-03';
  let regex = RegExp('Sep 23 2018 13:45:03')
  assert.isTrue(regex.test(tronWeb.utils.code.strToDate(input).toString()));

  input = '2018-09-23';
  regex = RegExp('Sep 23 2018 00:00:00')
  assert.isTrue(regex.test(tronWeb.utils.code.strToDate(input).toString()));

  assert.throws(() => {
    tronWeb.utils.code.strToDate('2018-02-')
  }, 'The passed date string is not valid');

  assert.throws(() => {
    tronWeb.utils.code.strToDate(123)
  }, 'The passed date string is not valid');

  assert.throws(() => {
    tronWeb.utils.code.strToDate('2018-0212')
  }, 'The passed date string is not valid');

  assert.throws(() => {
    tronWeb.utils.code.strToDate('90-22-21')
  }, 'The passed date string is not valid');
}

async function isNumbers(){
  const tronWeb = tronWebBuilder.createInstance();

  assert.equal(tronWeb.utils.code.isNumber('0'), 1);
  assert.equal(tronWeb.utils.code.isHexChar('Z'), 0);
}

async function getStringType(){
  const tronWeb = tronWebBuilder.createInstance();

  assert.equal(tronWeb.utils.code.getStringType('bf7e69851988c80e5484e52f4f6aca99479458b6'), 1);

  assert.equal(tronWeb.utils.code.getStringType('4136b9c3690c3be15a4ad697965b1e5e088ae131f2'), 3);

  assert.equal(tronWeb.utils.code.getStringType('3534'), 2);
  assert.equal(tronWeb.utils.code.getStringType('ERC20Token'), 3);

  assert.equal(tronWeb.utils.code.getStringType(3.45), -1);
}

async function codeTestAll(){
  console.log("codeTestAll start")
  this.bin2String();
  this.arrayEquals();
  this.stringToBytes();
  this.hexChar2byte();
  this.isHexChar();
  this.hexStr2byteArray();
  this.strToDate();
  this.isNumbers();
  this.getStringType();
  console.log("codeTestAll end")
}

export{
  bin2String,
  arrayEquals,
  stringToBytes,
  hexChar2byte,
  isHexChar,
  hexStr2byteArray,
  strToDate,
  isNumbers,
  getStringType,
  codeTestAll
}