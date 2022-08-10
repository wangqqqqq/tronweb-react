import React from 'react';
const {ADDRESS_BASE58,ADDRESS_HEX,PRIVATE_KEY } = require('../util/config');
const tronWebBuilder = require('../util/tronWebBuilder');
const broadcaster = require('../util/broadcaster');
const TronWeb = tronWebBuilder.TronWeb;
const wait = require('../util/wait');
const chai = require('chai');
const assert = chai.assert;
const util = require('util');
let emptyAccount;
let tronWeb;
const {typedDataTest1,typedDataTest2,typedDataTest3,typedDataTest4,typedDataTest5 } = require('../util/contracts');
import {eip712json} from '../util/eip712'
tronWeb = tronWebBuilder.createInstance();
let contractAddress;
let domain;
let domain2;
let types;
let value;

async function before(){
  emptyAccount = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount.address.hex,1000000000,{privateKey: PRIVATE_KEY})
  console.log("emptyAccount:"+emptyAccount.address.base58);
  await wait(60);
  // All properties on a domain are optional
  domain = {
    name: 'TrcToken Test',
    version: '1',
    chainId: '0xd698d4192c56cb6be724a558448e2684802de4d6cd8690dc',
    verifyingContract: '0x5AB90009b529c5406B4F8a6fc4dab8a2bc778C75',
  };
  domain2 = {
    ...domain,
    salt: "0xf2d857f4a3edcb9b78b4d503bfe733db1e3f6cdc2b7971ee739626c97e86a558",
  };

  // The named list of all type definitions
  types = {
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

  // The data to sign
  value = {
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
    tAddr: ['0xd1e7a6bc354106cb410e65ff8b181c600ff14292', '0xd1e7a6bc354106cb410e65ff8b181c600ff14292'],
    trcTokenId: '1002000',
    trcTokenArr: ['1002000', '1002000'],
  };
}

async function createContract(option) {
  const createTransaction = await tronWeb.transactionBuilder.createSmartContract(option, ADDRESS_BASE58);
  const createTx = await broadcaster.broadcaster(null, PRIVATE_KEY, createTransaction);
  assert.equal(createTx.transaction.txID.length, 64);
  let createInfo;
  while (true) {
    createInfo = await tronWeb.trx.getTransactionInfo(createTx.transaction.txID);
    if (Object.keys(createInfo).length === 0) {
      await wait(3);
      continue;
    } else {
      // console.log("createInfo:" + util.inspect(createInfo))
      break;
    }
  }
  const ca = createInfo.contract_address.toString();
  return ca;
}

async function signTypedData() {
  const signature = await tronWeb.trx._signTypedData(domain, types, value);
  const result = await tronWeb.trx.verifyTypedData(domain, types, value, signature);

  assert.equal(signature, '0xe2948026e46c27e60751823e8e515749afbeac5845856fba956610182e6470ab5669f5446f7db8da1b44e20eab8249c2e267173e45de55352e4738b9050acfe61c');
  assert.isTrue(result);

  tronWeb.trx._signTypedData(domain, types, value, (err, signature) => {
    tronWeb.trx.verifyTypedData(domain, types, value, signature, (err, result) => {
          assert.isTrue(signature.startsWith('0x'));
          assert.isTrue(result);
        }
    );
  });
  console.log("signTypedData run success")
}

async function signTypedData2() {
  const signature = await tronWeb.trx._signTypedData(domain2, types, value);
  const result = await tronWeb.trx.verifyTypedData(domain2, types, value, signature);

  assert.equal(signature, '0x38edd939ef1708bd707439c9612b81e1341daf10fc34385278461799abe6c4ec33c18724d3622083bdd8d8bb0dd7f28f94bfda99758b0e13819c5da43cdac0321c');
  assert.isTrue(result);

  tronWeb.trx._signTypedData(domain2, types, value, (err, signature) => {
    tronWeb.trx.verifyTypedData(domain2, types, value, signature, (err, result) => {
          assert.isTrue(signature.startsWith('0x'));
          assert.isTrue(result);
        }
    );
  });
  console.log("signTypedData2 run success")
}

async function signTypedDataWithPrivateKey() {
  const signature = TronWeb.Trx._signTypedData(domain, types, value, emptyAccount.privateKey);
  //Convert to TRON address
  const tDomain = {
    ...domain,
    verifyingContract: 'TJEuSMoC7tbs99XkbGhSDk7cM1xnxR931s',
  };
  const tValue = {
    ...value,
    from: {
      ...value.from,
      wallet: 'TUg28KYvCXWW81EqMUeZvCZmZw2BChk1HQ',
    },
    to: {
      ...value.to,
      wallet: 'TV75jZpdmP2juMe1dRwGrwpV6AMU6mr1EU',
    },
    tAddr: [
      'TV75jZpdmP2juMe1dRwGrwpV6AMU6mr1EU',
      'TV75jZpdmP2juMe1dRwGrwpV6AMU6mr1EU',
    ],
  };
  const tSignature = TronWeb.Trx._signTypedData(
      tDomain,
      types,
      tValue,
      emptyAccount.privateKey
  );

  const result = TronWeb.Trx.verifyTypedData(domain, types, value, signature, emptyAccount.address.base58);

  assert.isTrue(signature.startsWith('0x'));
  assert.equal(tSignature, signature);
  assert.isTrue(result);
  console.log("signTypedDataWithPrivateKey run seccess")
}

async function signatureNotMatch() {
  try {
    const signature = TronWeb.Trx._signTypedData(domain, types, value, emptyAccount.privateKey);
    TronWeb.Trx.verifyTypedData(domain, types, value, signature, emptyAccount.address.base58);
  } catch (error) {
    assert.equal(error, 'Signature does not match')
    console.log(error);
  }
  console.log("signatureNotMatch run success");
}

async function consistentWithContractTest1() {
  const option = {
    abi: typedDataTest1.abi,
    bytecode: typedDataTest1.bytecode,
    parameters: [],
    feeLimit: 1000e6
  };
  contractAddress = await createContract(option)
  console.log("contractAddress:" + contractAddress);
  const signatureO = await tronWeb.trx._signTypedData(domain, types, value,   emptyAccount.privateKey);
  const signature = signatureO.slice(2);
  const functionSelector =
      'verifyMail(address,((string,address,trcToken),(string,address,trcToken[]),string,address[],trcToken,trcToken[]),uint8,bytes32,bytes32)';
  const options = {
    funcABIV2: {
      inputs: [
        {
          internalType: 'address',
          name: 'sender',
          type: 'address'
        },
        {
          components: [
            {
              components: [
                {
                  internalType: 'string',
                  name: 'name',
                  type: 'string'
                },
                {
                  internalType: 'address',
                  name: 'wallet',
                  type: 'address'
                },
                {
                  internalType: 'trcToken',
                  name: 'trcTokenId',
                  type: 'trcToken'
                }
              ],
              internalType: 'struct TIP712.FromPerson',
              name: 'from',
              type: 'tuple'
            },
            {
              components: [
                {
                  internalType: 'string',
                  name: 'name',
                  type: 'string'
                },
                {
                  internalType: 'address',
                  name: 'wallet',
                  type: 'address'
                },
                {
                  internalType: 'trcToken[]',
                  name: 'trcTokenArr',
                  type: 'trcToken[]'
                }
              ],
              internalType: 'struct TIP712.ToPerson',
              name: 'to',
              type: 'tuple'
            },
            {
              internalType: 'string',
              name: 'contents',
              type: 'string'
            },
            {
              internalType: 'address[]',
              name: 'tAddr',
              type: 'address[]'
            },
            {
              internalType: 'trcToken',
              name: 'trcTokenId',
              type: 'trcToken'
            },
            {
              internalType: 'trcToken[]',
              name: 'trcTokenArr',
              type: 'trcToken[]'
            }
          ],
          internalType: 'struct TIP712.Mail',
          name: 'mail',
          type: 'tuple'
        },
        {
          internalType: 'uint8',
          name: 'v',
          type: 'uint8'
        },
        {
          internalType: 'bytes32',
          name: 'r',
          type: 'bytes32'
        },
        {
          internalType: 'bytes32',
          name: 's',
          type: 'bytes32'
        }
      ],
      name: 'verifyMail',
      outputs: [
        {
          internalType: 'bool',
          name: '',
          type: 'bool'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    parametersV2: [
      emptyAccount.address.base58,
      [
        ['Cow', '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826', 1002000],
        ['Bob', '0xd1e7a6bc354106cb410e65ff8b181c600ff14292', [1002000, 1002000]],
        'Hello, Bob!',
        ['0xd1e7a6bc354106cb410e65ff8b181c600ff14292', '0xd1e7a6bc354106cb410e65ff8b181c600ff14292'],
        1002000,
        [1002000, 1002000]
      ],
      `0x${signature.slice(128, 130)}`,
      `0x${signature.slice(0, 64)}`,
      `0x${signature.slice(64, 128)}`
    ]
  };
  const result = await tronWeb.transactionBuilder.triggerSmartContract(contractAddress, functionSelector, {_isConstant: true, ...options}, []);
  assert.equal(result.constant_result[0], '0000000000000000000000000000000000000000000000000000000000000001');
  console.log("consistentWithContractTest1 run test")
}

async function inconsistentWithContractTest1() {
  const tDomain = {
    ...domain,
    chainId: '1',  //Modify chainid,the verification should fail
  };
  const signatureO = await tronWeb.trx._signTypedData(tDomain, types, value, emptyAccount.privateKey);
  const signature = signatureO.slice(2);
  const functionSelector =
      'verifyMail(address,((string,address,trcToken),(string,address,trcToken[]),string,address[],trcToken,trcToken[]),uint8,bytes32,bytes32)';
  const options = {
    funcABIV2: {
      inputs: [
        {
          internalType: 'address',
          name: 'sender',
          type: 'address'
        },
        {
          components: [
            {
              components: [
                {
                  internalType: 'string',
                  name: 'name',
                  type: 'string'
                },
                {
                  internalType: 'address',
                  name: 'wallet',
                  type: 'address'
                },
                {
                  internalType: 'trcToken',
                  name: 'trcTokenId',
                  type: 'trcToken'
                }
              ],
              internalType: 'struct TIP712.FromPerson',
              name: 'from',
              type: 'tuple'
            },
            {
              components: [
                {
                  internalType: 'string',
                  name: 'name',
                  type: 'string'
                },
                {
                  internalType: 'address',
                  name: 'wallet',
                  type: 'address'
                },
                {
                  internalType: 'trcToken[]',
                  name: 'trcTokenArr',
                  type: 'trcToken[]'
                }
              ],
              internalType: 'struct TIP712.ToPerson',
              name: 'to',
              type: 'tuple'
            },
            {
              internalType: 'string',
              name: 'contents',
              type: 'string'
            },
            {
              internalType: 'address[]',
              name: 'tAddr',
              type: 'address[]'
            },
            {
              internalType: 'trcToken',
              name: 'trcTokenId',
              type: 'trcToken'
            },
            {
              internalType: 'trcToken[]',
              name: 'trcTokenArr',
              type: 'trcToken[]'
            }
          ],
          internalType: 'struct TIP712.Mail',
          name: 'mail',
          type: 'tuple'
        },
        {
          internalType: 'uint8',
          name: 'v',
          type: 'uint8'
        },
        {
          internalType: 'bytes32',
          name: 'r',
          type: 'bytes32'
        },
        {
          internalType: 'bytes32',
          name: 's',
          type: 'bytes32'
        }
      ],
      name: 'verifyMail',
      outputs: [
        {
          internalType: 'bool',
          name: '',
          type: 'bool'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    parametersV2: [
        emptyAccount.address.base58,
      [
        ['Cow', '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826', 1002000],
        ['Bob', '0xd1e7a6bc354106cb410e65ff8b181c600ff14292', [1002000, 1002000]],
        'Hello, Bob!',
        ['0xd1e7a6bc354106cb410e65ff8b181c600ff14292', '0xd1e7a6bc354106cb410e65ff8b181c600ff14292'],
        1002000,
        [1002000, 1002000]
      ],
      `0x${signature.slice(128, 130)}`,
      `0x${signature.slice(0, 64)}`,
      `0x${signature.slice(64, 128)}`
    ]
  };
  const result = await tronWeb.transactionBuilder.triggerSmartContract(contractAddress, functionSelector, {_isConstant: true, ...options}, []);
  // console.log('testVerify :', tronWeb.address.toHex(  emptyAccount.address.base58), result.constant_result[0]);
  assert.equal(result.constant_result[0], '0000000000000000000000000000000000000000000000000000000000000000');
  console.log("inconsistentWithContractTest1 run success")
}

async function consistentWithContractTest2() {
  const option2 = {
    abi: typedDataTest2.abi,
    bytecode: typedDataTest2.bytecode,
    parameters: [],
    feeLimit: 1000e6
  };
  contractAddress = await createContract(option2);
  console.log("contractAddress:" + contractAddress);
  const signatureO = await tronWeb.trx._signTypedData(domain2, types, value, emptyAccount.privateKey);
  const signature = signatureO.slice(2);
  const functionSelector =
      'verifyMail(address,((string,address,trcToken),(string,address,trcToken[]),string,address[],trcToken,trcToken[]),uint8,bytes32,bytes32)';
  const options = {
    funcABIV2: {
      inputs: [
        {
          internalType: 'address',
          name: 'sender',
          type: 'address'
        },
        {
          components: [
            {
              components: [
                {
                  internalType: 'string',
                  name: 'name',
                  type: 'string'
                },
                {
                  internalType: 'address',
                  name: 'wallet',
                  type: 'address'
                },
                {
                  internalType: 'trcToken',
                  name: 'trcTokenId',
                  type: 'trcToken'
                }
              ],
              internalType: 'struct TIP712.FromPerson',
              name: 'from',
              type: 'tuple'
            },
            {
              components: [
                {
                  internalType: 'string',
                  name: 'name',
                  type: 'string'
                },
                {
                  internalType: 'address',
                  name: 'wallet',
                  type: 'address'
                },
                {
                  internalType: 'trcToken[]',
                  name: 'trcTokenArr',
                  type: 'trcToken[]'
                }
              ],
              internalType: 'struct TIP712.ToPerson',
              name: 'to',
              type: 'tuple'
            },
            {
              internalType: 'string',
              name: 'contents',
              type: 'string'
            },
            {
              internalType: 'address[]',
              name: 'tAddr',
              type: 'address[]'
            },
            {
              internalType: 'trcToken',
              name: 'trcTokenId',
              type: 'trcToken'
            },
            {
              internalType: 'trcToken[]',
              name: 'trcTokenArr',
              type: 'trcToken[]'
            }
          ],
          internalType: 'struct TIP712.Mail',
          name: 'mail',
          type: 'tuple'
        },
        {
          internalType: 'uint8',
          name: 'v',
          type: 'uint8'
        },
        {
          internalType: 'bytes32',
          name: 'r',
          type: 'bytes32'
        },
        {
          internalType: 'bytes32',
          name: 's',
          type: 'bytes32'
        }
      ],
      name: 'verifyMail',
      outputs: [
        {
          internalType: 'bool',
          name: '',
          type: 'bool'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    parametersV2: [
      emptyAccount.address.base58,
      [
        ['Cow', '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826', 1002000],
        ['Bob', '0xd1e7a6bc354106cb410e65ff8b181c600ff14292', [1002000, 1002000]],
        'Hello, Bob!',
        ['0xd1e7a6bc354106cb410e65ff8b181c600ff14292', '0xd1e7a6bc354106cb410e65ff8b181c600ff14292'],
        1002000,
        [1002000, 1002000]
      ],
      `0x${signature.slice(128, 130)}`,
      `0x${signature.slice(0, 64)}`,
      `0x${signature.slice(64, 128)}`
    ]
  };
  const result = await tronWeb.transactionBuilder.triggerSmartContract(contractAddress, functionSelector, {_isConstant: true, ...options}, []);
  assert.equal(result.constant_result[0], '0000000000000000000000000000000000000000000000000000000000000001');
  console.log("consistentWithContractTest2 run success");
}

async function consistentWithContractTest3() {
  const option3 = {
    abi: typedDataTest3.abi,
    bytecode: typedDataTest3.bytecode,
    parameters: [],
    feeLimit: 1000e6
  };
  contractAddress = await createContract(option3);
  console.log("contractAddress3:" + contractAddress);

  const domain3 = {
    name: 'TrcToken Test',
    version: '1',
  };
  const signatureO = await tronWeb.trx._signTypedData(domain3, types, value, emptyAccount.privateKey);
  const signature = signatureO.slice(2);
  const functionSelector =
      'verifyMail(address,((string,address,trcToken),(string,address,trcToken[]),string,address[],trcToken,trcToken[]),uint8,bytes32,bytes32)';
  const options = {
    funcABIV2: {
      inputs: [
        {
          internalType: 'address',
          name: 'sender',
          type: 'address'
        },
        {
          components: [
            {
              components: [
                {
                  internalType: 'string',
                  name: 'name',
                  type: 'string'
                },
                {
                  internalType: 'address',
                  name: 'wallet',
                  type: 'address'
                },
                {
                  internalType: 'trcToken',
                  name: 'trcTokenId',
                  type: 'trcToken'
                }
              ],
              internalType: 'struct TIP712.FromPerson',
              name: 'from',
              type: 'tuple'
            },
            {
              components: [
                {
                  internalType: 'string',
                  name: 'name',
                  type: 'string'
                },
                {
                  internalType: 'address',
                  name: 'wallet',
                  type: 'address'
                },
                {
                  internalType: 'trcToken[]',
                  name: 'trcTokenArr',
                  type: 'trcToken[]'
                }
              ],
              internalType: 'struct TIP712.ToPerson',
              name: 'to',
              type: 'tuple'
            },
            {
              internalType: 'string',
              name: 'contents',
              type: 'string'
            },
            {
              internalType: 'address[]',
              name: 'tAddr',
              type: 'address[]'
            },
            {
              internalType: 'trcToken',
              name: 'trcTokenId',
              type: 'trcToken'
            },
            {
              internalType: 'trcToken[]',
              name: 'trcTokenArr',
              type: 'trcToken[]'
            }
          ],
          internalType: 'struct TIP712.Mail',
          name: 'mail',
          type: 'tuple'
        },
        {
          internalType: 'uint8',
          name: 'v',
          type: 'uint8'
        },
        {
          internalType: 'bytes32',
          name: 'r',
          type: 'bytes32'
        },
        {
          internalType: 'bytes32',
          name: 's',
          type: 'bytes32'
        }
      ],
      name: 'verifyMail',
      outputs: [
        {
          internalType: 'bool',
          name: '',
          type: 'bool'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    parametersV2: [
      emptyAccount.address.base58,
      [
        ['Cow', '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826', 1002000],
        ['Bob', '0xd1e7a6bc354106cb410e65ff8b181c600ff14292', [1002000, 1002000]],
        'Hello, Bob!',
        ['0xd1e7a6bc354106cb410e65ff8b181c600ff14292', '0xd1e7a6bc354106cb410e65ff8b181c600ff14292'],
        1002000,
        [1002000, 1002000]
      ],
      `0x${signature.slice(128, 130)}`,
      `0x${signature.slice(0, 64)}`,
      `0x${signature.slice(64, 128)}`
    ]
  };
  const result = await tronWeb.transactionBuilder.triggerSmartContract(contractAddress, functionSelector, {_isConstant: true, ...options}, []);
  assert.equal(result.constant_result[0], '0000000000000000000000000000000000000000000000000000000000000001');
  console.log("consistentWithContractTest3 run success");
}

async function consistentWithContractTest4() {
  const option4 = {
    abi: typedDataTest4.abi,
    bytecode: typedDataTest4.bytecode,
    parameters: [],
    feeLimit: 1000e6
  };
  contractAddress = await createContract(option4);
  console.log("contractAddress4:" + contractAddress);

  const domain4 = {};
  const signatureO = await tronWeb.trx._signTypedData(domain4, types, value, emptyAccount.privateKey);
  const signature = signatureO.slice(2);
  const functionSelector =
      'verifyMail(address,((string,address,trcToken),(string,address,trcToken[]),string,address[],trcToken,trcToken[]),uint8,bytes32,bytes32)';
  const options = {
    funcABIV2: {
      inputs: [
        {
          internalType: 'address',
          name: 'sender',
          type: 'address'
        },
        {
          components: [
            {
              components: [
                {
                  internalType: 'string',
                  name: 'name',
                  type: 'string'
                },
                {
                  internalType: 'address',
                  name: 'wallet',
                  type: 'address'
                },
                {
                  internalType: 'trcToken',
                  name: 'trcTokenId',
                  type: 'trcToken'
                }
              ],
              internalType: 'struct TIP712.FromPerson',
              name: 'from',
              type: 'tuple'
            },
            {
              components: [
                {
                  internalType: 'string',
                  name: 'name',
                  type: 'string'
                },
                {
                  internalType: 'address',
                  name: 'wallet',
                  type: 'address'
                },
                {
                  internalType: 'trcToken[]',
                  name: 'trcTokenArr',
                  type: 'trcToken[]'
                }
              ],
              internalType: 'struct TIP712.ToPerson',
              name: 'to',
              type: 'tuple'
            },
            {
              internalType: 'string',
              name: 'contents',
              type: 'string'
            },
            {
              internalType: 'address[]',
              name: 'tAddr',
              type: 'address[]'
            },
            {
              internalType: 'trcToken',
              name: 'trcTokenId',
              type: 'trcToken'
            },
            {
              internalType: 'trcToken[]',
              name: 'trcTokenArr',
              type: 'trcToken[]'
            }
          ],
          internalType: 'struct TIP712.Mail',
          name: 'mail',
          type: 'tuple'
        },
        {
          internalType: 'uint8',
          name: 'v',
          type: 'uint8'
        },
        {
          internalType: 'bytes32',
          name: 'r',
          type: 'bytes32'
        },
        {
          internalType: 'bytes32',
          name: 's',
          type: 'bytes32'
        }
      ],
      name: 'verifyMail',
      outputs: [
        {
          internalType: 'bool',
          name: '',
          type: 'bool'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    parametersV2: [
      emptyAccount.address.base58,
      [
        ['Cow', '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826', 1002000],
        ['Bob', '0xd1e7a6bc354106cb410e65ff8b181c600ff14292', [1002000, 1002000]],
        'Hello, Bob!',
        ['0xd1e7a6bc354106cb410e65ff8b181c600ff14292', '0xd1e7a6bc354106cb410e65ff8b181c600ff14292'],
        1002000,
        [1002000, 1002000]
      ],
      `0x${signature.slice(128, 130)}`,
      `0x${signature.slice(0, 64)}`,
      `0x${signature.slice(64, 128)}`
    ]
  };
  const result = await tronWeb.transactionBuilder.triggerSmartContract(contractAddress, functionSelector, {_isConstant: true, ...options}, []);
  assert.equal(result.constant_result[0], '0000000000000000000000000000000000000000000000000000000000000001');
  console.log("consistentWithContractTest4 run success");
}

  //Add some data types ,like bool uint[],bytes9[2][]
async function consistentWithContractTest5() {
  const option5 = {
    abi: typedDataTest5.abi,
    bytecode: typedDataTest5.bytecode,
    parameters: [], feeLimit: 1000e6
  };
  contractAddress = await createContract(option5);
  console.log("contractAddress5:" + contractAddress);

  const domain5 = {
    ...domain,
    salt: "0xf2d857f4a3edcb9b78b4d503bfe733db1e3f6cdc2b7971ee739626c97e86a558",
  };
  const types5 = {
    FromPerson: [
      {name: 'name', type: 'string'},
      {name: 'wallet', type: 'address'},
      {name: 'trcTokenId', type: 'trcToken'},
      {name: 'flag', type: 'bool'},
      {name: 'amount', type: 'uint256'},
      {name: 'ams', type: 'uint256[]'},
      {name: 'bytesNine', type: 'bytes9[2][]'},
    ],
    ToPerson: [
      {name: 'name', type: 'string'},
      {name: 'wallet', type: 'address'},
      {name: 'trcTokenArr', type: 'trcToken[]'},
      {name: 'flag', type: 'bool'},
    ],
    Mail: [
      {name: 'from', type: 'FromPerson'},
      {name: 'to', type: 'ToPerson'},
      {name: 'contents', type: 'string'},
      {name: 'tAddr', type: 'address[]'},
      {name: 'trcTokenId', type: 'trcToken'},
      {name: 'trcTokenArr', type: 'trcToken[]'},
      {name: 'kl', type: 'bool'},
    ],
  };
  const value5 = {
    from: {
      name: 'Cow----\'\"\\',
      wallet: '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
      trcTokenId: '1002000',
      flag: true,
      amount: 100,
      ams: ["11056554404658930133150874045898657776356285215494026110264991123212628047076",
        "28642429005959472156842324419307827288639989824857677552763720238605764979095",
        "60726410065911965915389471010958483980331937590671913817781923654636547669698"],
      bytesNine: [["0x984ed0dffc8163a771", "0xcf6f8e49e5a45099e7"], ["0xed139eddc5ccd6e349", "0xbaca9a31329f9011f9"], ["0xda39ed4979f3beb331", "0x37822de88e0dcdf499"]],
    },
    to: {
      name: 'Bob!@@#$%%^^&*())+{}{].,,',
      wallet: '0xd1e7a6bc354106cb410e65ff8b181c600ff14292',
      trcTokenArr: ['1002000', '1002000'],
      flag: false,
    },
    contents: 'Hello, ___====$$###^&**!@@Bob!',
    tAddr: ['0xd1e7a6bc354106cb410e65ff8b181c600ff14292', '0xd1e7a6bc354106cb410e65ff8b181c600ff14292'],
    trcTokenId: '1002000',
    trcTokenArr: ['1002000', '1002000'],
    kl: false,
  };
  //should be the correct hash
  assert.equal(
      TronWeb.utils._TypedDataEncoder.hash(domain5, types5, value5),
      '0xaae24ca6a59355c6acd89093fda364f247433f338cde1f51cc35b714cfd6c880'
  );

  const signatureO = await tronWeb.trx._signTypedData(domain5, types5, value5, emptyAccount.privateKey);
  const signature = signatureO.slice(2);
  const functionSelector =
      'verifyMail(address,((string,address,trcToken,bool,uint256,uint256[],bytes9[2][]),(string,address,trcToken[],bool),string,address[],trcToken,trcToken[],bool),uint8,bytes32,bytes32)';
  const options = {
    funcABIV2: {
      inputs: [
        {
          internalType: 'address',
          name: 'sender',
          type: 'address'
        },
        {
          components: [
            {
              components: [
                {
                  internalType: 'string',
                  name: 'name',
                  type: 'string'
                },
                {
                  internalType: 'address',
                  name: 'wallet',
                  type: 'address'
                },
                {
                  internalType: 'trcToken',
                  name: 'trcTokenId',
                  type: 'trcToken'
                },
                {
                  internalType: 'bool',
                  name: 'flag',
                  type: 'bool'
                },
                {
                  internalType: 'uint256',
                  name: 'amount',
                  type: 'uint256'
                },
                {
                  internalType: 'uint256[]',
                  name: 'ams',
                  type: 'uint256[]'
                },
                {
                  internalType: 'bytes9[2][]',
                  name: 'bytesNine',
                  type: 'bytes9[2][]'
                },
              ],
              internalType: 'struct TIP712.FromPerson',
              name: 'from',
              type: 'tuple'
            },
            {
              components: [
                {
                  internalType: 'string',
                  name: 'name',
                  type: 'string'
                },
                {
                  internalType: 'address',
                  name: 'wallet',
                  type: 'address'
                },
                {
                  internalType: 'trcToken[]',
                  name: 'trcTokenArr',
                  type: 'trcToken[]'
                },
                {
                  internalType: 'bool',
                  name: 'flag',
                  type: 'bool'
                }
              ],
              internalType: 'struct TIP712.ToPerson',
              name: 'to',
              type: 'tuple'
            },
            {
              internalType: 'string',
              name: 'contents',
              type: 'string'
            },
            {
              internalType: 'address[]',
              name: 'tAddr',
              type: 'address[]'
            },
            {
              internalType: 'trcToken',
              name: 'trcTokenId',
              type: 'trcToken'
            },
            {
              internalType: 'trcToken[]',
              name: 'trcTokenArr',
              type: 'trcToken[]'
            },
            {
              internalType: 'bool',
              name: 'kl',
              type: 'bool'
            }
          ],
          internalType: 'struct TIP712.Mail',
          name: 'mail',
          type: 'tuple'
        },
        {
          internalType: 'uint8',
          name: 'v',
          type: 'uint8'
        },
        {
          internalType: 'bytes32',
          name: 'r',
          type: 'bytes32'
        },
        {
          internalType: 'bytes32',
          name: 's',
          type: 'bytes32'
        }
      ],
      name: 'verifyMail',
      outputs: [
        {
          internalType: 'bool',
          name: '',
          type: 'bool'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    parametersV2: [
      emptyAccount.address.base58,
      [
        ['Cow----\'\"\\', '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826', 1002000, true, 100,
          ["11056554404658930133150874045898657776356285215494026110264991123212628047076",
            "28642429005959472156842324419307827288639989824857677552763720238605764979095",
            "60726410065911965915389471010958483980331937590671913817781923654636547669698"],
          [["0x984ed0dffc8163a771", "0xcf6f8e49e5a45099e7"], ["0xed139eddc5ccd6e349", "0xbaca9a31329f9011f9"], ["0xda39ed4979f3beb331", "0x37822de88e0dcdf499"]],
        ],
        ['Bob!@@#$%%^^&*())+{}{].,,', '0xd1e7a6bc354106cb410e65ff8b181c600ff14292', [1002000, 1002000], false],
        'Hello, ___====$$###^&**!@@Bob!',
        ['0xd1e7a6bc354106cb410e65ff8b181c600ff14292', '0xd1e7a6bc354106cb410e65ff8b181c600ff14292'],
        1002000,
        [1002000, 1002000],
        false
      ],
      `0x${signature.slice(128, 130)}`,
      `0x${signature.slice(0, 64)}`,
      `0x${signature.slice(64, 128)}`
    ]
  };
  const result = await tronWeb.transactionBuilder.triggerSmartContract(contractAddress, functionSelector, {_isConstant: true, ...options}, []);
  assert.equal(result.constant_result[0], '0000000000000000000000000000000000000000000000000000000000000001');
  console.log("consistentWithContractTest5 run success");
}

async function eip712TestAll(){
  console.log("eip712TestAll start")
  await before();
  await signTypedData();
  await signTypedData2();
  await signTypedDataWithPrivateKey();
  await signatureNotMatch();
  await consistentWithContractTest1();
  await inconsistentWithContractTest1();
  await consistentWithContractTest2();
  await consistentWithContractTest3();
  await consistentWithContractTest4();
  await consistentWithContractTest5();
  console.log("eip712TestAll end");
}

export{
  eip712TestAll
}