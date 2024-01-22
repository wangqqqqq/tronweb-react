import React from 'react';
import Config from '../util/config.js'
const {ADDRESS_BASE58,ADDRESS_HEX,PRIVATE_KEY, FEE_LIMIT} = Config;
import Contract from '../util/contracts.js'
const {testDeployRevert,testTriggerError} = Contract;
import tronWebBuilder from '../util/tronWebBuilder.js';
import broadcaster from '../util/broadcaster.js';
import wait from '../util/wait.js';
import { assert } from 'chai';
import util from 'util';

async function byte2hexStr(){
    const tronWeb = tronWebBuilder.createInstance();

    assert.equal(tronWeb.utils.bytes.byte2hexStr(21), '15');
    assert.equal(tronWeb.utils.bytes.byte2hexStr(33), '21');
    assert.equal(tronWeb.utils.bytes.byte2hexStr(78), '4E');
    assert.equal(tronWeb.utils.bytes.byte2hexStr(156), '9C');
    assert.equal(tronWeb.utils.bytes.byte2hexStr(200), 'C8');
    //parameter type not check any more from 6.0.0
    /*assert.throws(() => {
        tronWeb.utils.bytes.byte2hexStr('15')
    }, 'Input must be a number');*/

    assert.throws(() => {
        tronWeb.utils.bytes.byte2hexStr(-15)
    }, 'Input must be a byte');

    assert.throws(() => {
        tronWeb.utils.bytes.byte2hexStr(1455)
    }, 'Input must be a byte');
}

async function bytesToString(){
    const tronWeb = tronWebBuilder.createInstance();

    assert.equal(tronWeb.utils.bytes.bytesToString([78, 112, 87, 69, 99, 65]), 'NpWEcA');

    assert.equal(tronWeb.utils.bytes.bytesToString([1178, 2112, 1087, 969]), 'Қࡀпω');

    //from 6.0.0, bytesToString not support string as parameter
    /*assert.equal(tronWeb.utils.bytes.bytesToString('NpWEcA'), 'NpWEcA');
    assert.equal(tronWeb.utils.bytes.bytesToString('Қࡀпω'), 'Қࡀпω');*/
}

async function hextoString(){
    const tronWeb = tronWebBuilder.createInstance();

    assert.equal(tronWeb.utils.bytes.hextoString('af43ed56aa77'), '¯CíVªw');
    assert.equal(tronWeb.utils.bytes.hextoString('0xaf43'), '¯C');
    assert.equal(tronWeb.utils.bytes.hextoString('49206C6F7665206461726B20636F6D6564696573'), 'I love dark comedies');
}

async function byteArray2hexStr(){
    const tronWeb = tronWebBuilder.createInstance();

    assert.equal(tronWeb.utils.bytes.byteArray2hexStr([73, 32, 108, 111, 118, 101, 32, 100, 97, 114, 107, 32, 99, 111, 109, 101, 100, 105, 101, 115]), '49206C6F7665206461726B20636F6D6564696573');

    assert.throws(() => {
        tronWeb.utils.bytes.byteArray2hexStr([73, -32, 108])
    }, 'Input must be a byte');
}

async function base64EncodeToString(){
    const tronWeb = tronWebBuilder.createInstance();

    let result = tronWeb.utils.bytes.base64EncodeToString([73, 32, 108, 111, 118, 101, 32, 100, 97, 114, 107, 32, 99, 111, 109, 101, 100, 105, 101, 115]
    );

    assert.equal(result, 'SSBsb3ZlIGRhcmsgY29tZWRpZXM=');
}

async function base64DecodeFromString(){
    const tronWeb = tronWebBuilder.createInstance();

    let result = tronWeb.utils.bytes.base64DecodeFromString('SSBsb3ZlIGRhcmsgY29tZWRpZXM=');

    let string = tronWeb.utils.bytes.bytesToString(result);
    assert.equal(string, 'I love dark comedies');
}

async function bytesTestAll(){
    console.log("bytesTestAll start")
    byte2hexStr();
    bytesToString();
    hextoString();
    byteArray2hexStr();
    base64EncodeToString();
    base64DecodeFromString();
    console.log("bytesTestAll end")
}

export{
    byte2hexStr,
    bytesToString,
    hextoString,
    byteArray2hexStr,
    base64EncodeToString,
    base64DecodeFromString,
    bytesTestAll
}