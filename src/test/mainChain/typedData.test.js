import React from 'react';
const chai = require('chai');
const tronWebBuilder = require('../util/tronWebBuilder');
import {eip712json} from '../util/eip712'
import {json2} from "../util/contract-interface-abi2";
const assert = chai.assert;
const {ADDRESS_BASE58,PRIVATE_KEY} = require('../util/config');
const TronWeb = tronWebBuilder.TronWeb;
const utils = TronWeb.utils;


async function typedDataEncoder(){
    eip712json.forEach((test) => {
        let {domain, primaryType, data, encoded,types,digest } = test;
        const encoder = utils._TypedDataEncoder.from(types);
        assert.equal(
            encoder.primaryType,
            primaryType,
            'instance.primaryType'
        );
        assert.equal(
            encoder.encode(data),
            encoded,
            'instance.encode()'
        );
        assert.equal(
            utils._TypedDataEncoder.getPrimaryType(types),
            primaryType,
            'getPrimaryType'
        );
        assert.equal(
            utils._TypedDataEncoder.hash(
                domain,
                types,
                data),
            digest,
            'digest'
        );
    });
}

async function SignatureAndVerification(){
    let tronWeb = tronWebBuilder.createInstance();
    eip712json.forEach(async (test) => {
        let {domain, primaryType, data, encoded,types,digest } = test;
        console.log(`domain: ${JSON.stringify(domain)}`)
        console.log(`types: ${JSON.stringify(types)}`)
        console.log(`data: ${JSON.stringify(data)}`)
        const signature = await tronWeb.trx._signTypedData(domain, types, data, PRIVATE_KEY);
        console.log(`signature: ${signature}`)
        let result = await tronWeb.trx.verifyTypedData(domain, types, data, signature,ADDRESS_BASE58);
        assert.isTrue(signature.startsWith('0x'));
        console.log(`result: ${JSON.stringify(result)}`)
        assert.isTrue(result);

        // test verifyTypedData use Signature.from
        let newSignedMsg;
        if (signature.substring(signature.length-2,signature.length) == "1c")
            newSignedMsg = signature.substring(0, signature.length-2) + "01"
        else if(signature.substring(signature.length-2,signature.length) == "1b")
            newSignedMsg = signature.substring(0, signature.length-2) + "00"
        console.log(`newSignedMsg: ${newSignedMsg}`)
        result = await tronWeb.trx.verifyTypedData(test.domain, test.types, test.data, newSignedMsg,ADDRESS_BASE58);
        assert.isTrue(result);

    });
}

async function typedDataEncoderwithTrcToken(){
        //bytecode from https://nile.tronscan.org/#/contract/TBsRXfm94zoXVc2ZayZpc25Y2VEDmeciJ8/code
        const domain = {
            name: 'TrcToken Test',
            version: '1',
            chainId: '0xd698d4192c56cb6be724a558448e2684802de4d6cd8690dc',
            verifyingContract: '0x5ab90009b529c5406b4f8a6fc4dab8a2bc778c75',
            salt: "0xf2d857f4a3edcb9b78b4d503bfe733db1e3f6cdc2b7971ee739626c97e86a558",
        };

        const types = {
            FromPerson: [
                { name: 'name', type: 'string' },
                { name: 'wallet', type: 'address' },
                { name: 'trcTokenId', type: 'trcToken' },
            ],
            ToPerson: [
                { name: 'name', type: 'string' },
                { name: 'wallet', type: 'address' },
                { name: 'trcTokenArr', type: 'trcToken[]' },
            ],
            Mail: [
                { name: 'from', type: 'FromPerson' },
                { name: 'to', type: 'ToPerson' },
                { name: 'contents', type: 'string' },
                { name: 'tAddr', type: 'address[]' },
                { name: 'trcTokenId', type: 'trcToken' },
                { name: 'trcTokenArr', type: 'trcToken[]' },
            ],
        };

        const value = {
            from: {
                name: 'Cow',
                wallet: '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
                trcTokenId: '1002000',
            },
            to: {
                name: 'Bob',
                wallet: '0xd1e7a6bc354106cb410e65ff8b181c600ff14292',
                trcTokenArr: ['1002000', '1002000'],
            },
            contents: 'Hello, Bob!',
            tAddr: [
                '0xd1e7a6bc354106cb410e65ff8b181c600ff14292',
                '0xd1e7a6bc354106cb410e65ff8b181c600ff14292',
            ],
            trcTokenId: '1002000',
            trcTokenArr: ['1002000', '1002000'],
        };
        assert.equal(
            utils._TypedDataEncoder.hashDomain(domain),
            '0x386c29f5a78395fbf19723fa491bd1a28ea8d1036d653c28cb49563ffca3ec00'
        );
        assert.equal(
            utils._TypedDataEncoder.hashStruct(
                'FromPerson',
                types,
                value.from
            ),
            '0x73b79ecc2530586800050c46ee7361ed28c013dfa3d062ed216295cbd5e6a55d'
        );
        assert.equal(
            utils._TypedDataEncoder.hashStruct(
                'ToPerson',
                types,
                value.to
            ),
            '0xcf70da7edc68556245231d76401fdbc5622e3388466e0a088e668766879f2404'
        );
        assert.equal(
            utils._TypedDataEncoder.hashStruct('Mail', types, value),
            '0x5f3caedfeb1e096d359db31f0924f23acdfc72f21e5f3c59af3eec03cdf2a5f7'
        );
        assert.equal(
            utils._TypedDataEncoder.hash(domain, types, value),
            '0x659ab4906c8bff9cb393df578d620fb8cd7a2b6544e861896a3da5cff7a73548'
        );
        const value1 = {
            from: {
                name: 'Cow----\'\"\\',
                wallet: '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
                trcTokenId: '1002000',
            },
            to: {
                name: 'Bob!@@#$%%^^&*())+{}{].,,',
                wallet: '0xd1e7a6bc354106cb410e65ff8b181c600ff14292',
                trcTokenArr: ['1002000', '1002000'],
            },
            contents: 'Hello, ___====$$###^&**!@@Bob!',
            tAddr: [
                '0xd1e7a6bc354106cb410e65ff8b181c600ff14292',
                '0xd1e7a6bc354106cb410e65ff8b181c600ff14292',
            ],
            trcTokenId: '1002000',
            trcTokenArr: ['1002000', '1002000'],
        };
        assert.equal(
            utils._TypedDataEncoder.hash(domain, types, value1),
            '0xb3857c4712b229ead81002827194dc5070036238a338d679972e5c3aef687d51'
        );
}

async function typedDataAll() {
    console.log("typedDataAll start")
    await typedDataEncoder();
    await SignatureAndVerification();
    await typedDataEncoderwithTrcToken();
    console.log("typedDataAll end")
}

export{
    typedDataAll
}