module.exports = {
    testDeployRevert: {
        contractName: "contractUnknownException",
        abi: [
            {
                "inputs":[
                ],
                "payable":true,
                "stateMutability":"payable",
                "type":"constructor"
            }
        ],
        bytecode: "0x60806040526000600a6040516012906087565b6040518091039082f080158015602c573d6000803e3d6000fd5b5090509050806001600160a01b031663946644cd6040518163ffffffff1660e01b8152600401600060405180830381600087803b158015606b57600080fd5b505af1158015607e573d6000803e3d6000fd5b50505050506092565b60078060dc83390190565b603d80609f6000396000f3fe6080604052600080fdfea26474726f6e5820ec9f264886a0a6be93041d24b4fe16bccd2e9784596c51c231ca1e223d1f05fd64736f6c634300050c00316080604052fefe"
    },
    testTriggerError: {
        contractName: "Test",
        abi: [
            {
                "constant":false,
                "inputs":[
                    {
                        "name":"x",
                        "type":"uint256"
                    }],
                "name":"testOutOfMem",
                "outputs":[
                    {
                        "name":"r",
                        "type":"bytes32"
                    }],
                "payable":false,
                "stateMutability":"nonpayable",
                "type":"function"
            },
            {
                "constant":false,
                "inputs":[
                ],
                "name":"testBadJumpDestination",
                "outputs":[
                ],
                "payable":false,
                "stateMutability":"nonpayable",
                "type":"function"
            }
        ],
        bytecode: "0x608060405234801561001057600080fd5b50d3801561001d57600080fd5b50d2801561002a57600080fd5b5061011f8061003a6000396000f30060806040526004361060485763ffffffff7c01000000000000000000000000000000000000000000000000000000006000350416634ef5a0088114604d5780639093b95b14608c575b600080fd5b348015605857600080fd5b50d38015606457600080fd5b50d28015607057600080fd5b50607a60043560b8565b60408051918252519081900360200190f35b348015609757600080fd5b50d3801560a357600080fd5b50d2801560af57600080fd5b5060b660ee565b005b600060608260405190808252806020026020018201604052801560e5578160200160208202803883390190505b50905050919050565b6001805600a165627a7a7230582092ba162087e13f41c6d6c00ba493edc5a5a6250a3840ece5f99aa38b66366a700029"
    },
    trc20Contract: {
        contractName: "trc20Contract",
        abi: [
            {
                "inputs": [{
                    "internalType": "address",
                    "name": "_addressFounder",
                    "type": "address"
                }],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "constructor"
            }, {
                "anonymous": false,
                "inputs": [{
                    "indexed": true,
                    "internalType": "address",
                    "name": "_owner",
                    "type": "address"
                }, {
                    "indexed": true,
                    "internalType": "address",
                    "name": "_spender",
                    "type": "address"
                }, {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "_value",
                    "type": "uint256"
                }],
                "name": "Approval",
                "type": "event"
            }, {
                "anonymous": false,
                "inputs": [{
                    "indexed": true,
                    "internalType": "address",
                    "name": "_from",
                    "type": "address"
                }, {
                    "indexed": true,
                    "internalType": "address",
                    "name": "_to",
                    "type": "address"
                }, {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "_value",
                    "type": "uint256"
                }],
                "name": "Transfer",
                "type": "event"
            }, {
                "constant": true,
                "inputs": [{
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }, {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }],
                "name": "allowance",
                "outputs": [{
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            }, {
                "constant": false,
                "inputs": [{
                    "internalType": "address",
                    "name": "_spender",
                    "type": "address"
                }, {
                    "internalType": "uint256",
                    "name": "_value",
                    "type": "uint256"
                }],
                "name": "approve",
                "outputs": [{
                    "internalType": "bool",
                    "name": "success",
                    "type": "bool"
                }],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            }, {
                "constant": true,
                "inputs": [{
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }],
                "name": "balanceOf",
                "outputs": [{
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            }, {
                "constant": false,
                "inputs": [{
                    "internalType": "uint256",
                    "name": "_value",
                    "type": "uint256"
                }],
                "name": "burn",
                "outputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            }, {
                "constant": true,
                "inputs": [],
                "name": "decimals",
                "outputs": [{
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            }, {
                "constant": true,
                "inputs": [],
                "name": "name",
                "outputs": [{
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            }, {
                "constant": false,
                "inputs": [{
                    "internalType": "string",
                    "name": "_name",
                    "type": "string"
                }],
                "name": "setName",
                "outputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            }, {
                "constant": false,
                "inputs": [],
                "name": "start",
                "outputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            }, {
                "constant": false,
                "inputs": [],
                "name": "stop",
                "outputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            }, {
                "constant": true,
                "inputs": [],
                "name": "stopped",
                "outputs": [{
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            }, {
                "constant": true,
                "inputs": [],
                "name": "symbol",
                "outputs": [{
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            }, {
                "constant": true,
                "inputs": [],
                "name": "totalSupply",
                "outputs": [{
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            }, {
                "constant": false,
                "inputs": [{
                    "internalType": "address",
                    "name": "_to",
                    "type": "address"
                }, {
                    "internalType": "uint256",
                    "name": "_value",
                    "type": "uint256"
                }],
                "name": "transfer",
                "outputs": [{
                    "internalType": "bool",
                    "name": "success",
                    "type": "bool"
                }],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            }, {
                "constant": false,
                "inputs": [{
                    "internalType": "address",
                    "name": "_from",
                    "type": "address"
                }, {
                    "internalType": "address",
                    "name": "_to",
                    "type": "address"
                }, {
                    "internalType": "uint256",
                    "name": "_value",
                    "type": "uint256"
                }],
                "name": "transferFrom",
                "outputs": [{
                    "internalType": "bool",
                    "name": "success",
                    "type": "bool"
                }],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            }],
        bytecode: "60c060405260066080819052650a8e4dedcd2f60d31b60a09081526100279160009190610135565b5060408051808201909152600580825264054524332360dc1b602090920191825261005491600191610135565b5060066002819055600060055580546001600160a81b031916905534801561007b57600080fd5b50d3801561008857600080fd5b50d2801561009557600080fd5b50604051610b09380380610b09833981810160405260208110156100b857600080fd5b505160068054610100600160a81b0319163361010002179055655af3107a400060058190556001600160a01b0382166000818152600360209081526040808320859055805194855251929391927fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9281900390910190a3506101d0565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061017657805160ff19168380011785556101a3565b828001600101855582156101a3579182015b828111156101a3578251825591602001919060010190610188565b506101af9291506101b3565b5090565b6101cd91905b808211156101af57600081556001016101b9565b90565b61092a806101df6000396000f3fe608060405234801561001057600080fd5b50d3801561001d57600080fd5b50d2801561002a57600080fd5b50600436106101045760003560e01c806370a08231116100a6578063a9059cbb11610080578063a9059cbb1461027b578063be9a6555146102a7578063c47f0027146102af578063dd62ed3e1461035557610104565b806370a082311461024557806375f12b211461026b57806395d89b411461027357610104565b806318160ddd116100e257806318160ddd146101d057806323b872dd146101ea578063313ce5671461022057806342966c681461022857610104565b806306fdde031461010957806307da68f514610186578063095ea7b314610190575b600080fd5b610111610383565b6040805160208082528351818301528351919283929083019185019080838360005b8381101561014b578181015183820152602001610133565b50505050905090810190601f1680156101785780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b61018e610411565b005b6101bc600480360360408110156101a657600080fd5b506001600160a01b038135169060200135610439565b604080519115158252519081900360200190f35b6101d86104ee565b60408051918252519081900360200190f35b6101bc6004803603606081101561020057600080fd5b506001600160a01b038135811691602081013590911690604001356104f4565b6101d861060f565b61018e6004803603602081101561023e57600080fd5b5035610615565b6101d86004803603602081101561025b57600080fd5b50356001600160a01b03166106ac565b6101bc6106be565b6101116106c7565b6101bc6004803603604081101561029157600080fd5b506001600160a01b038135169060200135610721565b61018e6107e9565b61018e600480360360208110156102c557600080fd5b8101906020810181356401000000008111156102e057600080fd5b8201836020820111156102f257600080fd5b8035906020019184600183028401116401000000008311171561031457600080fd5b91908080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525092955061080e945050505050565b6101d86004803603604081101561036b57600080fd5b506001600160a01b038135811691602001351661083e565b6000805460408051602060026001851615610100026000190190941693909304601f810184900484028201840190925281815292918301828280156104095780601f106103de57610100808354040283529160200191610409565b820191906000526020600020905b8154815290600101906020018083116103ec57829003601f168201915b505050505081565b60065461010090046001600160a01b0316331461042a57fe5b6006805460ff19166001179055565b60065460009060ff161561044957fe5b3361045057fe5b81158061047e57503360009081526004602090815260408083206001600160a01b0387168452909152902054155b61048757600080fd5b3360008181526004602090815260408083206001600160a01b03881680855290835292819020869055805186815290519293927f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925929181900390910190a350600192915050565b60055481565b60065460009060ff161561050457fe5b3361050b57fe5b6001600160a01b03841660009081526003602052604090205482111561053057600080fd5b6001600160a01b038316600090815260036020526040902054828101101561055757600080fd5b6001600160a01b038416600090815260046020908152604080832033845290915290205482111561058757600080fd5b6001600160a01b03808416600081815260036020908152604080832080548801905593881680835284832080548890039055600482528483203384528252918490208054879003905583518681529351929391927fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9281900390910190a35060019392505050565b60025481565b3360009081526003602052604090205481111561063157600080fd5b336000818152600360209081526040808320805486900390558280527f3617319a054d772f909f7c479a2cebe5066e836a939412e32403c99029b92eff805486019055805185815290519293927fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef929181900390910190a350565b60036020526000908152604090205481565b60065460ff1681565b60018054604080516020600284861615610100026000190190941693909304601f810184900484028201840190925281815292918301828280156104095780601f106103de57610100808354040283529160200191610409565b60065460009060ff161561073157fe5b3361073857fe5b3360009081526003602052604090205482111561075457600080fd5b6001600160a01b038316600090815260036020526040902054828101101561077b57600080fd5b336000818152600360209081526040808320805487900390556001600160a01b03871680845292819020805487019055805186815290519293927fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef929181900390910190a350600192915050565b60065461010090046001600160a01b0316331461080257fe5b6006805460ff19169055565b60065461010090046001600160a01b0316331461082757fe5b805161083a90600090602084019061085b565b5050565b600460209081526000928352604080842090915290825290205481565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061089c57805160ff19168380011785556108c9565b828001600101855582156108c9579182015b828111156108c95782518255916020019190600101906108ae565b506108d59291506108d9565b5090565b6108f391905b808211156108d557600081556001016108df565b9056fea26474726f6e5820b6dfbf7d9fafd8751ff6c41564fd16f53ec48884e57e72d342297d68a9a29d9564736f6c634300050f0031"
    },
    trc721Contract: {
        contractName: "trc721",
        abi: [
            {
                "constant":true,
                "inputs":[
                ],
                "name":"name",
                "outputs":[
                    {
                        "name":"",
                        "type":"string"
                    }],
                "payable":false,
                "stateMutability":"view",
                "type":"function"
            },
            {
                "constant":true,
                "inputs":[
                    {
                        "name":"tokenId",
                        "type":"uint256"
                    }],
                "name":"getApproved",
                "outputs":[
                    {
                        "name":"",
                        "type":"address"
                    }],
                "payable":false,
                "stateMutability":"view",
                "type":"function"
            },
            {
                "constant":false,
                "inputs":[
                    {
                        "name":"to",
                        "type":"address"
                    },
                    {
                        "name":"tokenId",
                        "type":"uint256"
                    }],
                "name":"approve",
                "outputs":[
                ],
                "payable":false,
                "stateMutability":"nonpayable",
                "type":"function"
            },
            {
                "constant":true,
                "inputs":[
                ],
                "name":"gateway",
                "outputs":[
                    {
                        "name":"",
                        "type":"address"
                    }],
                "payable":false,
                "stateMutability":"view",
                "type":"function"
            },
            {
                "constant":false,
                "inputs":[
                    {
                        "name":"from",
                        "type":"address"
                    },
                    {
                        "name":"to",
                        "type":"address"
                    },
                    {
                        "name":"tokenId",
                        "type":"uint256"
                    }],
                "name":"transferFrom",
                "outputs":[
                ],
                "payable":false,
                "stateMutability":"nonpayable",
                "type":"function"
            },
            {
                "constant":false,
                "inputs":[
                    {
                        "name":"to",
                        "type":"address"
                    },
                    {
                        "name":"tokenId",
                        "type":"uint256"
                    }],
                "name":"mint",
                "outputs":[
                ],
                "payable":false,
                "stateMutability":"nonpayable",
                "type":"function"
            },
            {
                "constant":false,
                "inputs":[
                    {
                        "name":"tokenId",
                        "type":"uint256"
                    },
                    {
                        "name":"txData",
                        "type":"bytes"
                    }],
                "name":"withdrawal",
                "outputs":[
                ],
                "payable":false,
                "stateMutability":"nonpayable",
                "type":"function"
            },
            {
                "constant":true,
                "inputs":[
                    {
                        "name":"tokenId",
                        "type":"uint256"
                    }],
                "name":"ownerOf",
                "outputs":[
                    {
                        "name":"",
                        "type":"address"
                    }],
                "payable":false,
                "stateMutability":"view",
                "type":"function"
            },
            {
                "constant":true,
                "inputs":[
                    {
                        "name":"owner",
                        "type":"address"
                    }],
                "name":"balanceOf",
                "outputs":[
                    {
                        "name":"",
                        "type":"uint256"
                    }],
                "payable":false,
                "stateMutability":"view",
                "type":"function"
            },
            {
                "constant":true,
                "inputs":[
                ],
                "name":"symbol",
                "outputs":[
                    {
                        "name":"",
                        "type":"string"
                    }],
                "payable":false,
                "stateMutability":"view",
                "type":"function"
            },
            {
                "constant":false,
                "inputs":[
                    {
                        "name":"to",
                        "type":"address"
                    },
                    {
                        "name":"approved",
                        "type":"bool"
                    }],
                "name":"setApprovalForAll",
                "outputs":[
                ],
                "payable":false,
                "stateMutability":"nonpayable",
                "type":"function"
            },
            {
                "constant":false,
                "inputs":[
                    {
                        "name":"to",
                        "type":"address"
                    },
                    {
                        "name":"tokenId",
                        "type":"uint256"
                    }],
                "name":"transfer",
                "outputs":[
                ],
                "payable":false,
                "stateMutability":"nonpayable",
                "type":"function"
            },
            {
                "constant":true,
                "inputs":[
                    {
                        "name":"owner",
                        "type":"address"
                    },
                    {
                        "name":"operator",
                        "type":"address"
                    }],
                "name":"isApprovedForAll",
                "outputs":[
                    {
                        "name":"",
                        "type":"bool"
                    }],
                "payable":false,
                "stateMutability":"view",
                "type":"function"
            },
            {
                "inputs":[
                    {
                        "name":"_gateway",
                        "type":"address"
                    },
                    {
                        "name":"_name",
                        "type":"string"
                    },
                    {
                        "name":"_symbol",
                        "type":"string"
                    }],
                "payable":false,
                "stateMutability":"nonpayable",
                "type":"constructor"
            },
            {
                "anonymous":false,
                "inputs":[
                    {
                        "indexed":true,
                        "name":"from",
                        "type":"address"
                    },
                    {
                        "indexed":true,
                        "name":"to",
                        "type":"address"
                    },
                    {
                        "indexed":true,
                        "name":"tokenId",
                        "type":"uint256"
                    }],
                "name":"Transfer",
                "type":"event"
            },
            {
                "anonymous":false,
                "inputs":[
                    {
                        "indexed":true,
                        "name":"owner",
                        "type":"address"
                    },
                    {
                        "indexed":true,
                        "name":"approved",
                        "type":"address"
                    },
                    {
                        "indexed":true,
                        "name":"tokenId",
                        "type":"uint256"
                    }],
                "name":"Approval",
                "type":"event"
            },
            {
                "anonymous":false,
                "inputs":[
                    {
                        "indexed":true,
                        "name":"owner",
                        "type":"address"
                    },
                    {
                        "indexed":true,
                        "name":"operator",
                        "type":"address"
                    },
                    {
                        "indexed":false,
                        "name":"approved",
                        "type":"bool"
                    }],
                "name":"ApprovalForAll",
                "type":"event"
            }
        ],
        bytecode: "0x608060405234801561001057600080fd5b50d3801561001d57600080fd5b50d2801561002a57600080fd5b50604051610d84380380610d8483398101604090815281516020808401519284015160048054600160a060020a031916600160a060020a0385161790559284018051929490930191610082916005919085019061009f565b50805161009690600690602084019061009f565b5050505061013a565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106100e057805160ff191683800117855561010d565b8280016001018555821561010d579182015b8281111561010d5782518255916020019190600101906100f2565b5061011992915061011d565b5090565b61013791905b808211156101195760008155600101610123565b90565b610c3b806101496000396000f3006080604052600436106100c45763ffffffff7c010000000000000000000000000000000000000000000000000000000060003504166306fdde0381146100c9578063081812fc1461016d578063095ea7b3146101bb578063116191b6146101fb57806323b872dd1461022a57806340c10f191461026e57806349e11893146102ac5780636352211e1461032457806370a082311461035657806395d89b41146103a3578063a22cb465146103d2578063a9059cbb14610412578063e985e9c514610450575b600080fd5b3480156100d557600080fd5b50d380156100e257600080fd5b50d280156100ef57600080fd5b506100f86104a5565b6040805160208082528351818301528351919283929083019185019080838360005b8381101561013257818101518382015260200161011a565b50505050905090810190601f16801561015f5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34801561017957600080fd5b50d3801561018657600080fd5b50d2801561019357600080fd5b5061019f600435610533565b60408051600160a060020a039092168252519081900360200190f35b3480156101c757600080fd5b50d380156101d457600080fd5b50d280156101e157600080fd5b506101f9600160a060020a0360043516602435610565565b005b34801561020757600080fd5b50d3801561021457600080fd5b50d2801561022157600080fd5b5061019f61061b565b34801561023657600080fd5b50d3801561024357600080fd5b50d2801561025057600080fd5b506101f9600160a060020a036004358116906024351660443561062a565b34801561027a57600080fd5b50d3801561028757600080fd5b50d2801561029457600080fd5b506101f9600160a060020a036004351660243561064f565b3480156102b857600080fd5b50d380156102c557600080fd5b50d280156102d257600080fd5b5060408051602060046024803582810135601f81018590048502860185019096528585526101f99583359536956044949193909101919081908401838280828437509497506107269650505050505050565b34801561033057600080fd5b50d3801561033d57600080fd5b50d2801561034a57600080fd5b5061019f600435610896565b34801561036257600080fd5b50d3801561036f57600080fd5b50d2801561037c57600080fd5b50610391600160a060020a03600435166108c0565b60408051918252519081900360200190f35b3480156103af57600080fd5b50d380156103bc57600080fd5b50d280156103c957600080fd5b506100f86108f3565b3480156103de57600080fd5b50d380156103eb57600080fd5b50d280156103f857600080fd5b506101f9600160a060020a0360043516602435151561094e565b34801561041e57600080fd5b50d3801561042b57600080fd5b50d2801561043857600080fd5b506101f9600160a060020a03600435166024356109d2565b34801561045c57600080fd5b50d3801561046957600080fd5b50d2801561047657600080fd5b50610491600160a060020a03600435811690602435166109e1565b604080519115158252519081900360200190f35b6005805460408051602060026001851615610100026000190190941693909304601f8101849004840282018401909252818152929183018282801561052b5780601f106105005761010080835404028352916020019161052b565b820191906000526020600020905b81548152906001019060200180831161050e57829003601f168201915b505050505081565b600061053e82610a0f565b151561054957600080fd5b50600090815260016020526040902054600160a060020a031690565b600061057082610896565b9050600160a060020a03838116908216141561058b57600080fd5b33600160a060020a03821614806105a757506105a781336109e1565b15156105b257600080fd5b600082815260016020526040808220805473ffffffffffffffffffffffffffffffffffffffff1916600160a060020a0387811691821790925591518593918516917f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92591a4505050565b600454600160a060020a031681565b6106343382610a2c565b151561063f57600080fd5b61064a838383610a8b565b505050565b600454600160a060020a0316331461066657600080fd5b600160a060020a038216151561067b57600080fd5b61068481610a0f565b1561068e57600080fd5b600081815260208181526040808320805473ffffffffffffffffffffffffffffffffffffffff1916600160a060020a038716908117909155835260029091529020546106db906001610ba6565b600160a060020a0383166000818152600260205260408082209390935591518392907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef908290a45050565b60045460009061073f90600160a060020a0316846109d2565b600480546040517fcb912b1e0000000000000000000000000000000000000000000000000000000081523392810183815260248201879052606060448301908152865160648401528651600160a060020a039094169463cb912b1e949093899389939092909160840190602085019080838360005b838110156107cc5781810151838201526020016107b4565b50505050905090810190601f1680156107f95780820380516001836020036101000a031916815260200191505b50945050505050602060405180830381600087803b15801561081a57600080fd5b505af115801561082e573d6000803e3d6000fd5b505050506040513d602081101561084457600080fd5b505190507fffffffff0000000000000000000000000000000000000000000000000000000081167fcb912b1e000000000000000000000000000000000000000000000000000000001461064a57600080fd5b600081815260208190526040812054600160a060020a03168015156108ba57600080fd5b92915050565b6000600160a060020a03821615156108d757600080fd5b50600160a060020a031660009081526002602052604090205490565b6006805460408051602060026001851615610100026000190190941693909304601f8101849004840282018401909252818152929183018282801561052b5780601f106105005761010080835404028352916020019161052b565b600160a060020a03821633141561096457600080fd5b336000818152600360209081526040808320600160a060020a03871680855290835292819020805460ff1916861515908117909155815190815290519293927f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31929181900390910190a35050565b6109dd338383610a8b565b5050565b600160a060020a03918216600090815260036020908152604080832093909416825291909152205460ff1690565b600090815260208190526040902054600160a060020a0316151590565b600080610a3883610896565b905080600160a060020a031684600160a060020a03161480610a73575083600160a060020a0316610a6884610533565b600160a060020a0316145b80610a835750610a8381856109e1565b949350505050565b82600160a060020a0316610a9e82610896565b600160a060020a031614610ab157600080fd5b600160a060020a0382161515610ac657600080fd5b610acf81610bb3565b600160a060020a038316600090815260026020526040902054610af990600163ffffffff610bfd16565b600160a060020a038085166000908152600260205260408082209390935590841681522054610b2f90600163ffffffff610ba616565b600160a060020a03808416600081815260026020908152604080832095909555858252819052838120805473ffffffffffffffffffffffffffffffffffffffff1916831790559251849391928716917fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef91a4505050565b818101828110156108ba57fe5b600081815260016020526040902054600160a060020a031615610bfa576000818152600160205260409020805473ffffffffffffffffffffffffffffffffffffffff191690555b50565b600082821115610c0957fe5b509003905600a165627a7a72305820fd4516641e72b9245cd9ec59332d38dae59860fc29fb28933cbf477cb46c1cba0029"
    },
    transferTokenContract: {
        contractName: "transferTokenContract",
        abi: [
            {
                "constant":false,
                "inputs":[
                ],
                "name":"getResultInCon",
                "outputs":[
                    {
                        "name":"",
                        "type":"trcToken"
                    },
                    {
                        "name":"",
                        "type":"uint256"
                    },
                    {
                        "name":"",
                        "type":"uint256"
                    }],
                "payable":true,
                "stateMutability":"payable",
                "type":"function"
            },
            {
                "constant":false,
                "inputs":[
                    {
                        "name":"toAddress",
                        "type":"address"
                    },
                    {
                        "name":"id",
                        "type":"trcToken"
                    },
                    {
                        "name":"amount",
                        "type":"uint256"
                    }],
                "name":"TransferTokenTo",
                "outputs":[
                ],
                "payable":true,
                "stateMutability":"payable",
                "type":"function"
            },
            {
                "constant":false,
                "inputs":[
                ],
                "name":"msgTokenValueAndTokenIdTest",
                "outputs":[
                    {
                        "name":"",
                        "type":"trcToken"
                    },
                    {
                        "name":"",
                        "type":"uint256"
                    },
                    {
                        "name":"",
                        "type":"uint256"
                    }],
                "payable":true,
                "stateMutability":"payable",
                "type":"function"
            },
            {
                "inputs":[
                ],
                "payable":true,
                "stateMutability":"payable",
                "type":"constructor"
            }
        ],
        bytecode: "6080604052d3600055d2600155346002556101418061001f6000396000f3006080604052600436106100565763ffffffff7c010000000000000000000000000000000000000000000000000000000060003504166305c24200811461005b5780633be9ece71461008157806371dc08ce146100aa575b600080fd5b6100636100b2565b60408051938452602084019290925282820152519081900360600190f35b6100a873ffffffffffffffffffffffffffffffffffffffff600435166024356044356100c0565b005b61006361010d565b600054600154600254909192565b60405173ffffffffffffffffffffffffffffffffffffffff84169082156108fc029083908590600081818185878a8ad0945050505050158015610107573d6000803e3d6000fd5b50505050565bd3d2349091925600a165627a7a72305820a2fb39541e90eda9a2f5f9e7905ef98e66e60dd4b38e00b05de418da3154e7570029"
    },
    testRevert: {
        /*
        pragma solidity ^0.4.18;
        contract TestRevert {
            address owner;
            constructor() public {
            }
            function setOwner(address addr) public {
                require(addr != 0xb6e447d1d576dE6c7f767C32a649F0AD50aE5975, "Address forbidden :-)");
                // TSeFTBYCy3r2kZNYsj86G6Yz6rsmPdYdFs
                owner = addr;
            }
            function getOwner(uint check) public view returns (address) {
                require(check == 1, "Wrong check");
                return owner;
            }
            function getOwner2(uint check) public view returns (address) {
                require(check == 1);
                return owner;
            }
        }
        */
        contractName: "TestRevert",
        abi: [
            {
                "inputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "constructor"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "name": "addr",
                        "type": "address"
                    }
                ],
                "name": "setOwner",
                "outputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [
                    {
                        "name": "check",
                        "type": "uint256"
                    }
                ],
                "name": "getOwner",
                "outputs": [
                    {
                        "name": "",
                        "type": "address"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [
                    {
                        "name": "check",
                        "type": "uint256"
                    }
                ],
                "name": "getOwner2",
                "outputs": [
                    {
                        "name": "",
                        "type": "address"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            }
        ],
        bytecode: "0x608060405234801561001057600080fd5b5061037d806100206000396000f300608060405260043610610057576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806313af40351461005c578063877333461461009f578063c41a360a1461010c575b600080fd5b34801561006857600080fd5b5061009d600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610179565b005b3480156100ab57600080fd5b506100ca60048036038101908080359060200190929190505050610274565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34801561011857600080fd5b50610137600480360381019080803590602001909291905050506102ae565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b73b6e447d1d576de6c7f767c32a649f0ad50ae597573ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1614151515610231576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260158152602001807f41646472657373206d75737420626520213d203078000000000000000000000081525060200191505060405180910390fd5b806000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b600060018214151561028557600080fd5b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050919050565b6000600182141515610328576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252600b8152602001807f57726f6e6720636865636b00000000000000000000000000000000000000000081525060200191505060405180910390fd5b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1690509190505600a165627a7a7230582070775fabe424bfe924ea8b9a9f4863306d35202b9c074f195334273994260ef20029"
    },
    testConstant: {
        contractName: "testConstantContract",
        abi: [
            {
                "constant": true,
                "inputs": [
                    {
                        "name": "x",
                        "type": "uint256"
                    },
                    {
                        "name": "y",
                        "type": "uint256"
                    }
                ],
                "name": "testPure",
                "outputs": [
                    {
                        "name": "z",
                        "type": "uint256"
                    }
                ],
                "payable": false,
                "stateMutability": "pure",
                "type": "function"
            }
        ],
        bytecode: "0x608060405234801561001057600080fd5b50d3801561001d57600080fd5b50d2801561002a57600080fd5b5060e5806100396000396000f300608060405260043610603f576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806307fb8ea6146044575b600080fd5b348015604f57600080fd5b50d38015605b57600080fd5b50d28015606757600080fd5b50608e600480360381019080803590602001909291908035906020019092919050505060a4565b6040518082815260200191505060405180910390f35b600080600190508284820101915050929150505600a165627a7a72305820ba2dba126dd3285cfaee13187fa53bf7d9bc09517d6afd04cd7d71098a1f90ee0029"
    },
    testSetVal: {
        "contractName": "SetVal",
        "abi": [
            {
                "constant": false,
                "inputs": [
                    {
                        "name": "_val",
                        "type": "uint256"
                    }
                ],
                "name": "set",
                "outputs": [
                    {
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            }
        ],
        "bytecode": "0x60806040526000805534801561001457600080fd5b50d3801561002157600080fd5b50d2801561002e57600080fd5b5060e08061003d6000396000f3fe6080604052348015600f57600080fd5b50d38015601b57600080fd5b50d28015602757600080fd5b5060043610605d576000357c01000000000000000000000000000000000000000000000000000000009004806360fe47b1146062575b600080fd5b608b60048036036020811015607657600080fd5b810190808035906020019092919050505060a1565b6040518082815260200191505060405180910390f35b600081600081905550600054905091905056fea165627a7a72305820392f2cf7f1b37873349bf7ce496fb370bc80c6539de204bded6197106c530e700029"
    },
    testEmptyAbi: {
        "contractName": "SetVal",
        "abi": [],
        "bytecode": "0x60806040526000805534801561001457600080fd5b50d3801561002157600080fd5b50d2801561002e57600080fd5b5060e08061003d6000396000f3fe6080604052348015600f57600080fd5b50d38015601b57600080fd5b50d28015602757600080fd5b5060043610605d576000357c01000000000000000000000000000000000000000000000000000000009004806360fe47b1146062575b600080fd5b608b60048036036020811015607657600080fd5b810190808035906020019092919050505060a1565b6040518082815260200191505060405180910390f35b600081600081905550600054905091905056fea165627a7a72305820392f2cf7f1b37873349bf7ce496fb370bc80c6539de204bded6197106c530e700029"
    },
    arrayParam: {
        "contractName": "ArrayParam",
        "abi": [
            {
                "constant": true,
                "inputs": [
                    {
                        "name": "",
                        "type": "address"
                    }
                ],
                "name": "balances",
                "outputs": [
                    {
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "name": "addresses",
                        "type": "address[]"
                    },
                    {
                        "name": "initialBalances",
                        "type": "uint256[]"
                    }
                ],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "constructor"
            }
        ],
        "bytecode": "0x608060405234801561001057600080fd5b50d3801561001d57600080fd5b50d2801561002a57600080fd5b506040516102a83803806102a88339810180604052604081101561004d57600080fd5b81019080805164010000000081111561006557600080fd5b8281019050602081018481111561007b57600080fd5b815185602082028301116401000000008211171561009857600080fd5b505092919060200180516401000000008111156100b457600080fd5b828101905060208101848111156100ca57600080fd5b81518560208202830111640100000000821117156100e757600080fd5b5050929190505050600082511115156100ff57600080fd5b8051825114151561010f57600080fd5b60008090505b825181101561019c57818181518110151561012c57fe5b90602001906020020151600080858481518110151561014757fe5b9060200190602002015173ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508080600101915050610115565b50505060fb806101ad6000396000f3fe6080604052348015600f57600080fd5b50d38015601b57600080fd5b50d28015602757600080fd5b5060043610605d576000357c01000000000000000000000000000000000000000000000000000000009004806327e235e3146062575b600080fd5b60a160048036036020811015607657600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919050505060b7565b6040518082815260200191505060405180910390f35b6000602052806000526040600020600091509050548156fea165627a7a723058207d447cc574baeda0c964d154c92f29b2c72be467d5118d30741788a8c03c185d0029"
    },
    shieldContract: {
        contractName: "shield",
        abi: [
            {
                "inputs": [{
                    "internalType": "address",
                    "name": "trc20ContractAddress",
                    "type": "address"
                }, {
                    "internalType": "uint256",
                    "name": "scalingFactorExponent",
                    "type": "uint256"
                }],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "constructor"
            }, {
                "anonymous": false,
                "inputs": [{
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "position",
                    "type": "uint256"
                }, {
                    "indexed": false,
                    "internalType": "bytes32",
                    "name": "cm",
                    "type": "bytes32"
                }, {
                    "indexed": false,
                    "internalType": "bytes32",
                    "name": "cv",
                    "type": "bytes32"
                }, {
                    "indexed": false,
                    "internalType": "bytes32",
                    "name": "epk",
                    "type": "bytes32"
                }, {
                    "indexed": false,
                    "internalType": "bytes32[21]",
                    "name": "c",
                    "type": "bytes32[21]"
                }],
                "name": "BurnNewLeaf",
                "type": "event"
            }, {
                "anonymous": false,
                "inputs": [{
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "position",
                    "type": "uint256"
                }, {
                    "indexed": false,
                    "internalType": "bytes32",
                    "name": "cm",
                    "type": "bytes32"
                }, {
                    "indexed": false,
                    "internalType": "bytes32",
                    "name": "cv",
                    "type": "bytes32"
                }, {
                    "indexed": false,
                    "internalType": "bytes32",
                    "name": "epk",
                    "type": "bytes32"
                }, {
                    "indexed": false,
                    "internalType": "bytes32[21]",
                    "name": "c",
                    "type": "bytes32[21]"
                }],
                "name": "MintNewLeaf",
                "type": "event"
            }, {
                "anonymous": false,
                "inputs": [{
                    "indexed": false,
                    "internalType": "bytes32",
                    "name": "nf",
                    "type": "bytes32"
                }],
                "name": "NoteSpent",
                "type": "event"
            }, {
                "anonymous": false,
                "inputs": [{
                    "indexed": false,
                    "internalType": "address",
                    "name": "to",
                    "type": "address"
                }, {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "value",
                    "type": "uint256"
                }, {
                    "indexed": false,
                    "internalType": "bytes32[3]",
                    "name": "ciphertext",
                    "type": "bytes32[3]"
                }],
                "name": "TokenBurn",
                "type": "event"
            }, {
                "anonymous": false,
                "inputs": [{
                    "indexed": false,
                    "internalType": "address",
                    "name": "from",
                    "type": "address"
                }, {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "value",
                    "type": "uint256"
                }],
                "name": "TokenMint",
                "type": "event"
            }, {
                "anonymous": false,
                "inputs": [{
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "position",
                    "type": "uint256"
                }, {
                    "indexed": false,
                    "internalType": "bytes32",
                    "name": "cm",
                    "type": "bytes32"
                }, {
                    "indexed": false,
                    "internalType": "bytes32",
                    "name": "cv",
                    "type": "bytes32"
                }, {
                    "indexed": false,
                    "internalType": "bytes32",
                    "name": "epk",
                    "type": "bytes32"
                }, {
                    "indexed": false,
                    "internalType": "bytes32[21]",
                    "name": "c",
                    "type": "bytes32[21]"
                }],
                "name": "TransferNewLeaf",
                "type": "event"
            }, {
                "constant": false,
                "inputs": [{
                    "internalType": "bytes32[10]",
                    "name": "input",
                    "type": "bytes32[10]"
                }, {
                    "internalType": "bytes32[2]",
                    "name": "spendAuthoritySignature",
                    "type": "bytes32[2]"
                }, {
                    "internalType": "uint256",
                    "name": "rawValue",
                    "type": "uint256"
                }, {
                    "internalType": "bytes32[2]",
                    "name": "bindingSignature",
                    "type": "bytes32[2]"
                }, {
                    "internalType": "address",
                    "name": "payTo",
                    "type": "address"
                }, {
                    "internalType": "bytes32[3]",
                    "name": "burnCipher",
                    "type": "bytes32[3]"
                }, {
                    "internalType": "bytes32[9][]",
                    "name": "output",
                    "type": "bytes32[9][]"
                }, {
                    "internalType": "bytes32[21][]",
                    "name": "c",
                    "type": "bytes32[21][]"
                }],
                "name": "burn",
                "outputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            }, {
                "constant": true,
                "inputs": [{
                    "internalType": "uint256",
                    "name": "position",
                    "type": "uint256"
                }],
                "name": "getPath",
                "outputs": [{
                    "internalType": "bytes32",
                    "name": "",
                    "type": "bytes32"
                }, {
                    "internalType": "bytes32[32]",
                    "name": "",
                    "type": "bytes32[32]"
                }],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            }, {
                "constant": true,
                "inputs": [],
                "name": "latestRoot",
                "outputs": [{
                    "internalType": "bytes32",
                    "name": "",
                    "type": "bytes32"
                }],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            }, {
                "constant": true,
                "inputs": [],
                "name": "leafCount",
                "outputs": [{
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            }, {
                "constant": false,
                "inputs": [{
                    "internalType": "uint256",
                    "name": "rawValue",
                    "type": "uint256"
                }, {
                    "internalType": "bytes32[9]",
                    "name": "output",
                    "type": "bytes32[9]"
                }, {
                    "internalType": "bytes32[2]",
                    "name": "bindingSignature",
                    "type": "bytes32[2]"
                }, {
                    "internalType": "bytes32[21]",
                    "name": "c",
                    "type": "bytes32[21]"
                }],
                "name": "mint",
                "outputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            }, {
                "constant": true,
                "inputs": [{
                    "internalType": "bytes32",
                    "name": "",
                    "type": "bytes32"
                }],
                "name": "noteCommitment",
                "outputs": [{
                    "internalType": "bytes32",
                    "name": "",
                    "type": "bytes32"
                }],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            }, {
                "constant": true,
                "inputs": [{
                    "internalType": "bytes32",
                    "name": "",
                    "type": "bytes32"
                }],
                "name": "nullifiers",
                "outputs": [{
                    "internalType": "bytes32",
                    "name": "",
                    "type": "bytes32"
                }],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            }, {
                "constant": true,
                "inputs": [{
                    "internalType": "bytes32",
                    "name": "",
                    "type": "bytes32"
                }],
                "name": "roots",
                "outputs": [{
                    "internalType": "bytes32",
                    "name": "",
                    "type": "bytes32"
                }],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            }, {
                "constant": true,
                "inputs": [],
                "name": "scalingFactor",
                "outputs": [{
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            }, {
                "constant": false,
                "inputs": [{
                    "internalType": "bytes32[10][]",
                    "name": "input",
                    "type": "bytes32[10][]"
                }, {
                    "internalType": "bytes32[2][]",
                    "name": "spendAuthoritySignature",
                    "type": "bytes32[2][]"
                }, {
                    "internalType": "bytes32[9][]",
                    "name": "output",
                    "type": "bytes32[9][]"
                }, {
                    "internalType": "bytes32[2]",
                    "name": "bindingSignature",
                    "type": "bytes32[2]"
                }, {
                    "internalType": "bytes32[21][]",
                    "name": "c",
                    "type": "bytes32[21][]"
                }],
                "name": "transfer",
                "outputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            }, {
                "constant": true,
                "inputs": [{
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }],
                "name": "tree",
                "outputs": [{
                    "internalType": "bytes32",
                    "name": "",
                    "type": "bytes32"
                }],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            }
        ],
        bytecode: "6104806040527f010000000000000000000000000000000000000000000000000000000000000060809081527f817de36ab2d57feb077634bca77819c8e0bd298c04f6fed0e6a83cc1356ca15560a0527fffe9fc03f18b176c998806439ff0bb8ad193afdb27b2ccbc88856916dd804e3460c0527fd8283386ef2ef07ebdbb4383c12a739a953a4d6e0d6fb1139a4036d693bfbb6c60e0527fe110de65c907b9dea4ae0bd83a4b0a51bea175646a64c12b4c9f931b2cb31b49610100527f912d82b2c2bca231f71efcf61737fbf0a08befa0416215aeef53e8bb6d23390a610120527f8ac9cf9c391e3fd42891d27238a81a8a5c1d3a72b1bcbea8cf44a58ce7389613610140527fd6c639ac24b46bd19341c91b13fdcab31581ddaf7f1411336a271f3d0aa52813610160527f7b99abdc3730991cc9274727d7d82d28cb794edbc7034b4f0053ff7c4b680444610180527f43ff5457f13b926b61df552d4e402ee6dc1463f99a535f9a713439264d5b616b6101a0527fba49b659fbd0b7334211ea6a9d9df185c757e70aa81da562fb912b84f49bce726101c0527f4777c8776a3b1e69b73a62fa701fa4f7a6282d9aee2c7a6b82e7937d7081c23c6101e0527fec677114c27206f5debc1c1ed66f95e2b1885da5b7be3d736b1de98579473048610200527f1b77dac4d24fb7258c3c528704c59430b630718bec486421837021cf75dab651610220527fbd74b25aacb92378a871bf27d225cfc26baca344a1ea35fdd94510f3d157082c610240527fd6acdedf95f608e09fa53fb43dcd0990475726c5131210c9e5caeab97f0e642f610260527f1ea6675f9551eeb9dfaaa9247bc9858270d3d3a4c5afa7177a984d5ed1be2451610280527f6edb16d01907b759977d7650dad7e3ec049af1a3d875380b697c862c9ec5d51c6102a0527fcd1c8dbf6e3acc7a80439bc4962cf25b9dce7c896f3a5bd70803fc5a0e33cf006102c0527f6aca8448d8263e547d5ff2950e2ed3839e998d31cbc6ac9fd57bc6002b1592166102e0527f8d5fa43e5a10d11605ac7430ba1f5d81fb1b68d29a640405767749e841527673610300527f08eeab0c13abd6069e6310197bf80f9c1ea6de78fd19cbae24d4a520e6cf3023610320527f0769557bc682b1bf308646fd0b22e648e8b9e98f57e29f5af40f6edb833e2c49610340527f4c6937d78f42685f84b43ad3b7b00f81285662f85c6a68ef11d62ad1a3ee0850610360527ffee0e52802cb0c46b1eb4d376c62697f4759f6c8917fa352571202fd778fd712610380527f16d6252968971a83da8521d65382e61f0176646d771c91528e3276ee45383e4a6103a0527fd2e1642c9a462229289e5b0e3b7f9008e0301cbb93385ee0e21da2545073cb586103c0527fa5122c08ff9c161d9ca6fc462073396c7d7d38e8ee48cdb3bea7e2230134ed6a6103e0527f28e7b841dcbc47cceb69d7cb8d94245fb7cb2ba3a7a6bc18f13f945f7dbd6e2a610400527fe1f34b034d4a3cd28557e2907ebf990c918f64ecb50a94f01d6fda5ca5c7ef72610420527f12935f14b676509b81eb49ef25f39269ed72309238b4c145803544b646dca62d610440527fb2eed031d4d6a4f02a097f80b54cc1541d4163c6b6f5971f88b6e41d35c5381461046052620004b390602890602062000580565b50348015620004c157600080fd5b50d38015620004cf57600080fd5b50d28015620004dd57600080fd5b506040516200354738038062003547833981016040819052620005009162000615565b604d811062000546576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016200053d90620006b5565b60405180910390fd5b600a0a60005560488054336001600160a01b031991821617909155604980549091166001600160a01b039290921691909117905562000713565b8260208101928215620005b1579160200282015b82811115620005b157825182559160200191906001019062000594565b50620005bf929150620005c3565b5090565b620005e091905b80821115620005bf5760008155600101620005ca565b90565b8051620005f081620006ee565b620005fb81620006d0565b9392505050565b80516200060f8162000708565b92915050565b600080604083850312156200062957600080fd5b6000620006378585620005e3565b92505060206200064a8582860162000602565b9150509250929050565b600062000663602a83620006c7565b7f546865207363616c696e67466163746f724578706f6e656e74206973206f757481527f206f662072616e67652100000000000000000000000000000000000000000000602082015260400192915050565b602080825281016200060f8162000654565b90815260200190565b60006001600160a01b0382166200060f565b6001600160a81b031690565b620006f981620006e2565b81146200070557600080fd5b50565b620006f981620005e0565b612e2480620007236000396000f3fe608060405234801561001057600080fd5b50d3801561001d57600080fd5b50d2801561002a57600080fd5b50600436106100c35760003560e01c80639110a55b1161008b5780639110a55b14610134578063ae6dead714610147578063cc1058751461015a578063d7b0fef11461016d578063e176507314610175578063ed3437f814610196576100c3565b80632997e86b146100c85780632a6bb45a146100f157806330e69fc314610104578063313529361461010c578063855d175e1461011f575b600080fd5b6100db6100d6366004611c30565b61019e565b6040516100e89190612a7d565b60405180910390f35b6100db6100ff366004611c30565b6101b0565b6100db6101c2565b6100db61011a366004611c30565b6101c8565b61013261012d366004611c6c565b6101da565b005b610132610142366004611a3d565b6105a9565b6100db610155366004611c30565b610bd4565b610132610168366004611b22565b610be6565b6100db61106c565b610188610183366004611c30565b611072565b6040516100e8929190612a8b565b6100db6111c5565b60036020526000908152604090205481565b60066020526000908152604090205481565b60015481565b60056020526000908152604090205481565b6049546040516323b872dd60e01b815233916000916001600160a01b03909116906323b872dd9061021390859030908b90600401612852565b602060405180830381600087803b15801561022d57600080fd5b505af1158015610241573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052506102659190810190611c12565b90508061028d5760405162461bcd60e51b815260040161028490612ad8565b60405180910390fd5b8435600090815260066020526040902054156102bb5760405162461bcd60e51b815260040161028490612b58565b60006102c6876111cb565b905060006002308389886040516020016102e394939291906127fc565b60408051601f19818403018152908290526102fd91612846565b602060405180830381855afa15801561031a573d6000803e3d6000fd5b5050506040513d601f19601f8201168201806040525061033d9190810190611c4e565b90506060630100000188888585600760015460405161036196959493929190612a1d565b600060405180830381855afa15801561037e573d6000803e3d6000fd5b5050503d80600081146103ad576040519150601f19603f3d011682016040523d82523d6000602084013e6103b2565b606091505b5090506000816000815181106103c457fe5b602002602001015160001c9050806001146103f15760405162461bcd60e51b815260040161028490612b68565b60008260018151811061040057fe5b60209081029190910181015160015463ffffffff016000818152600590935260409092208c359055915081610435578a356007555b60015b826001018110156104aa576002600019830104915084816001018151811061045c57fe5b60200260200101516005600084815260200190815260200160002081905550828114156104a2576000828152600560205260409020546007846021811061049f57fe5b01555b600101610438565b508382600201815181106104ba57fe5b60209081029190910181015160028190556000818152600490925260408220558b906020020135600660008d81602090810291909101358252810191909152604001600090812091909155600180548082019091557fbe22cbc129fd01d04b02a7b3258b72e8c8ae5bfcf054d7f0359779be627a6b27918d9060200201358d600160200201358e600260200201358d60405161055a959493929190612bb8565b60405180910390a17f36bf5aa3964be01dbd95a0154a8930793fe68353bdc580871ffb2c911366bbc7888d60405161059392919061287a565b60405180910390a1505050505050505050505050565b600188108015906105bb575060028811155b6105d75760405162461bcd60e51b815260040161028490612b98565b8786146105f65760405162461bcd60e51b815260040161028490612b08565b60018410801590610608575060028411155b6106245760405162461bcd60e51b815260040161028490612b18565b8381146106435760405162461bcd60e51b815260040161028490612b38565b60005b8881101561070757600360008b8b8481811061065e57fe5b905061014002016000600a811061067157fe5b60200201358152602001908152602001600020546000801b146106a65760405162461bcd60e51b815260040161028490612ba8565b600460008b8b848181106106b657fe5b905061014002016001600a81106106c957fe5b60200201358152602001908152602001600020546000801b14156106ff5760405162461bcd60e51b815260040161028490612af8565b600101610646565b5060005b84811015610773576006600087878481811061072357fe5b9050610120020160006009811061073657fe5b60200201358152602001908152602001600020546000801b1461076b5760405162461bcd60e51b815260040161028490612ae8565b60010161070b565b5060006002308b8b898988886040516020016107959796959493929190612751565b60408051601f19818403018152908290526107af91612846565b602060405180830381855afa1580156107cc573d6000803e3d6000fd5b5050506040513d601f19601f820116820180604052506107ef9190810190611c4e565b9050606063010000028b8b8b8b8b8b8b896000600760015460405161081e9b9a999897969594939291906128bd565b600060405180830381855afa15801561083b573d6000803e3d6000fd5b5050503d806000811461086a576040519150601f19603f3d011682016040523d82523d6000602084013e61086f565b606091505b50905060008160008151811061088157fe5b602002602001015160001c9050806001146108ae5760405162461bcd60e51b815260040161028490612b68565b600160005b888110156109d95760008483806001019450815181106108cf57fe5b602090810291909101015160015490915063ffffffff018b8b848181106108f257fe5b9050610120020160006009811061090557fe5b60008381526005602090815260409091209102919091013590558161094c578b8b8481811061093057fe5b9050610120020160006009811061094357fe5b60200201356007555b60015b826001018110156109c4576002600019830104915086858060010196508151811061097657fe5b60200260200101516005600084815260200190815260200160002081905550828114156109bc57600082815260056020526040902054600784602181106109b957fe5b01555b60010161094f565b505060018054810181559190910190506108b3565b508281815181106109e657fe5b60209081029190910181015160028190556000818152600490925260408220555b8c811015610a8f5760008e8e83818110610a1d57fe5b905061014002016000600a8110610a3057fe5b602002013590508060036000838152602001908152602001600020819055507fd13faa8100906cf559aebacf9c16532cfc9708645c198c8f15798ee049dbcfc181604051610a7e9190612a7d565b60405180910390a150600101610a07565b5060005b88811015610bc457898982818110610aa757fe5b90506101200201600060098110610aba57fe5b6020020135600660008c8c85818110610acf57fe5b90506101200201600060098110610ae257fe5b60200201358152602001908152602001600020819055507f0f190e6ff1f0e1c1f4ec51aecdafdd02278c568898b57df5ca7dccba83a8181c818b8b905003600154038b8b84818110610b3057fe5b90506101200201600060098110610b4357fe5b60200201358c8c85818110610b5457fe5b90506101200201600160098110610b6757fe5b60200201358d8d86818110610b7857fe5b90506101200201600260098110610b8b57fe5b60200201358b8b87818110610b9c57fe5b90506102a00201604051610bb4959493929190612bb8565b60405180910390a1600101610a93565b5050505050505050505050505050565b60046020526000908152604090205481565b6000610bf1896111cb565b905060006002308d888888888e89604051602001610c16989796959493929190612795565b60408051601f1981840301815290829052610c3091612846565b602060405180830381855afa158015610c4d573d6000803e3d6000fd5b5050506040513d601f19601f82011682018060405250610c709190810190611c4e565b8c356000818152600360209081526040909120549293509091908e01359015610cab5760405162461bcd60e51b815260040161028490612ba8565b600081815260046020526040902054610cd65760405162461bcd60e51b815260040161028490612af8565b6001871115610cf75760405162461bcd60e51b815260040161028490612b28565b868514610d165760405162461bcd60e51b815260040161028490612b88565b86610d9d57600063010000038f8f878f88604051610d389594939291906129cc565b602060405180830381855afa158015610d55573d6000803e3d6000fd5b5050506040513d601f19601f82011682018060405250610d789190810190611c12565b905080610d975760405162461bcd60e51b815260040161028490612b68565b50610f21565b610f218e600a806020026040519081016040528092919082600a60200280828437600081840152601f19601f8201169050808301925050505050508e6002806020026040519081016040528092919082600260200280828437600081840152601f19601f820116905080830192505050505050868e6002806020026040519081016040528092919082600260200280828437600081840152601f19601f820116905080830192505050505050878d8d808060200260200160405190810160405280939291908181526020016000905b82821015610eae576040805161012081810190925290808402870190600990839083908082843760009201919091525050508152600190910190602001610e6c565b50505050508c8c808060200260200160405190810160405280939291908181526020016000905b82821015610f1757604080516102a081810190925290808402870190601590839083908082843760009201919091525050508152600190910190602001610ed5565b505050505061124e565b60008281526003602052604090819020839055517fd13faa8100906cf559aebacf9c16532cfc9708645c198c8f15798ee049dbcfc190610f62908490612a7d565b60405180910390a16000604960009054906101000a90046001600160a01b03166001600160a01b031663a9059cbb8c8f6040518363ffffffff1660e01b8152600401610faf92919061287a565b602060405180830381600087803b158015610fc957600080fd5b505af1158015610fdd573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052506110019190810190611c12565b9050806110205760405162461bcd60e51b815260040161028490612b48565b7f1daf70c304f467a9efbc9ac1ca7bfe859a478aa6c4b88131b4dbb1547029b9728b8e8c60405161105393929190612895565b60405180910390a1505050505050505050505050505050565b60025481565b600061107c611842565b600154831061109d5760405162461bcd60e51b815260040161028490612b78565b63ffffffff83016110ac611842565b60006110b7866115ab565b905060006110c587836115fa565b905060005b60208163ffffffff1610156111b4578263ffffffff168163ffffffff16141561110d57818482601f0363ffffffff166020811061110357fe5b60200201526111a2565b600285066111415760056000600187038152602001908152602001600020548482601f0363ffffffff166020811061110357fe5b60018501600090815260056020526040902054156111715760018501600090815260056020526040902054611187565b60288163ffffffff166020811061118457fe5b01545b8482601f0363ffffffff166020811061119c57fe5b60200201525b600260001986010494506001016110ca565b505060025494509092505050915091565b60005481565b60008082116111ec5760405162461bcd60e51b815260040161028490612ac8565b60005461120090839063ffffffff61174c16565b1561121d5760405162461bcd60e51b815260040161028490612ab8565b6000805461123290849063ffffffff61179516565b9050677fffffffffffffff811061124857600080fd5b92915050565b60008260008151811061125d57fe5b602002602001015160006009811061127157fe5b6020020151905060066000828152602001908152602001600020546000801b146112ad5760405162461bcd60e51b815260040161028490612ae8565b604080516001808252818301909252606091816020015b6112cc611861565b8152602001906001900390816112c457905050905088816000815181106112ef57fe5b6020908102919091010152604080516001808252818301909252606091816020015b611319611880565b815260200190600190039081611311579050509050888160008151811061133c57fe5b6020026020010181905250606063010000028383888b8b8e600760015460405161136d98979695949392919061294e565b600060405180830381855afa15801561138a573d6000803e3d6000fd5b5050503d80600081146113b9576040519150601f19603f3d011682016040523d82523d6000602084013e6113be565b606091505b5090506000816000815181106113d057fe5b602002602001015160001c9050806001146113fd5760405162461bcd60e51b815260040161028490612b68565b60008260018151811061140c57fe5b60209081029190910181015160015463ffffffff016000818152600590935260409092208890559150816114405760078790555b60015b826001018110156114b5576002600019830104915084816001018151811061146757fe5b60200260200101516005600084815260200190815260200160002081905550828114156114ad57600082815260056020526040902054600784602181106114aa57fe5b01555b600101611443565b508382600201815181106114c557fe5b602090810291909101810151600281905560008181526004835260408082209290925589815260069092528120889055600180548082019091558a517f3814d251636df4a739162facca3862684b45af01ce54bcc56ea488fa6a69412d928a918d919061152e57fe5b602002602001015160016009811061154257fe5b60200201518c60008151811061155457fe5b602002602001015160026009811061156857fe5b60200201518c60008151811061157a57fe5b6020026020010151604051611593959493929190612bfb565b60405180910390a15050505050505050505050505050565b60015460009063ffffffff83019063fffffffe01825b60026000198301046002600019850104146115f25760026000198401049250600260001983010491506001016115c1565b949350505050565b60015463fffffffe0160008181526005602052604081205490918291829163ffffffff8088019290871661167b578183101561163c5794506112489350505050565b8183141561167b576002830661166b575050600019016000908152600560205260409020549250611248915050565b5050602854935061124892505050565b60005b8763ffffffff168163ffffffff16101561174057600283066116ba576000198301600090815260056020526040902054955090935083906116d5565b81955060288163ffffffff16602081106116d057fe5b015494505b63010000048187876040516116ec93929190612c3e565b602060405180830381855afa158015611709573d6000803e3d6000fd5b5050506040513d601f19601f8201168201806040525061172c9190810190611c4e565b91506002600019840104925060010161167e565b50979650505050505050565b600061178e83836040518060400160405280601881526020017f536166654d6174683a206d6f64756c6f206279207a65726f00000000000000008152506117d7565b9392505050565b600061178e83836040518060400160405280601a81526020017f536166654d6174683a206469766973696f6e206279207a65726f00000000000081525061180b565b600081836117f85760405162461bcd60e51b81526004016102849190612aa7565b5082848161180257fe5b06949350505050565b6000818361182c5760405162461bcd60e51b81526004016102849190612aa7565b50600083858161183857fe5b0495945050505050565b6040518061040001604052806020906020820280388339509192915050565b604051806101400160405280600a906020820280388339509192915050565b60405180604001604052806002906020820280388339509192915050565b80356118a981612d93565b61178e81612cbd565b60008083601f8401126118c457600080fd5b50813567ffffffffffffffff8111156118dc57600080fd5b602083019150836101408202830111156118f557600080fd5b9250929050565b60008083601f84011261190e57600080fd5b50813567ffffffffffffffff81111561192657600080fd5b602083019150836102a08202830111156118f557600080fd5b60008083601f84011261195157600080fd5b50813567ffffffffffffffff81111561196957600080fd5b6020830191508360408202830111156118f557600080fd5b60008083601f84011261199357600080fd5b50813567ffffffffffffffff8111156119ab57600080fd5b602083019150836101208202830111156118f557600080fd5b80610140810183101561124857600080fd5b806102a0810183101561124857600080fd5b806040810183101561124857600080fd5b806060810183101561124857600080fd5b80610120810183101561124857600080fd5b805161124881612daa565b803561124881612db3565b805161124881612db3565b600080600080600080600080600060c08a8c031215611a5b57600080fd5b893567ffffffffffffffff811115611a7257600080fd5b611a7e8c828d016118b2565b995099505060208a013567ffffffffffffffff811115611a9d57600080fd5b611aa98c828d0161193f565b975097505060408a013567ffffffffffffffff811115611ac857600080fd5b611ad48c828d01611981565b95509550506060611ae78c828d016119e8565b93505060a08a013567ffffffffffffffff811115611b0457600080fd5b611b108c828d016118fc565b92509250509295985092959850929598565b6000806000806000806000806000806102a08b8d031215611b4257600080fd5b6000611b4e8d8d6119c4565b9a5050610140611b608d828e016119e8565b995050610180611b728d828e01611a27565b9850506101a0611b848d828e016119e8565b9750506101e0611b968d828e0161189e565b965050610200611ba88d828e016119f9565b9550506102608b013567ffffffffffffffff811115611bc657600080fd5b611bd28d828e01611981565b94509450506102808b013567ffffffffffffffff811115611bf257600080fd5b611bfe8d828e016118fc565b92509250509295989b9194979a5092959850565b600060208284031215611c2457600080fd5b60006115f28484611a1c565b600060208284031215611c4257600080fd5b60006115f28484611a27565b600060208284031215611c6057600080fd5b60006115f28484611a32565b6000806000806104208587031215611c8357600080fd5b6000611c8f8787611a27565b9450506020611ca087828801611a0a565b935050610140611cb2878288016119e8565b925050610180611cc4878288016119d6565b91505092959194509250565b6000611cdc838361203e565b50506101400190565b6000611cdc838361204f565b6000611cfd83836120a3565b50506102a00190565b6000611d1283836120fc565b505060400190565b6000611d128383612154565b6000611d32838361224b565b50506101200190565b6000611d328383612258565b6000611d5383836122a4565b505060200190565b611d6481612cbd565b82525050565b611d64611d7682612cbd565b612d55565b6000611d878385612cab565b9350611d9282612c59565b8060005b85811015611dc857611da88284612cb9565b611db28882611cd0565b9750611dbd83612c8a565b925050600101611d96565b509495945050505050565b6000611ddf8385612cb4565b9350611dea82612c59565b8060005b85811015611dc857611e008284612cb9565b611e0a8882611cd0565b9750611e1583612c8a565b925050600101611dee565b6000611e2b82612c62565b611e358185612cab565b9350611e4083612c5c565b8060005b83811015611dc8578151611e588882611ce5565b9750611e6383612c5c565b925050600101611e44565b6000611e7a8385612cb4565b9350611e8582612c59565b8060005b85811015611dc857611e9b8284612cb9565b611ea58882611cf1565b9750611eb083612c91565b925050600101611e89565b6000611ec78385612cab565b9350611ed282612c59565b8060005b85811015611dc857611ee88284612cb9565b611ef28882611d06565b9750611efd83612c98565b925050600101611ed6565b6000611f1382612c62565b611f1d8185612cab565b9350611f2883612c5c565b8060005b83811015611dc8578151611f408882611d1a565b9750611f4b83612c5c565b925050600101611f2c565b6000611f628385612cab565b9350611f6d82612c59565b8060005b85811015611dc857611f838284612cb9565b611f8d8882611d26565b9750611f9883612c9e565b925050600101611f71565b6000611faf8385612cb4565b9350611fba82612c59565b8060005b85811015611dc857611fd08284612cb9565b611fda8882611d26565b9750611fe583612c9e565b925050600101611fbe565b6000611ffb82612c62565b6120058185612cab565b935061201083612c5c565b8060005b83811015611dc85781516120288882611d3b565b975061203383612c5c565b925050600101612014565b61204b6101408383612d06565b5050565b61205881612c66565b6120628184612cb4565b925061206d82612c59565b8060005b8381101561209b5781516120858782611d47565b965061209083612c5c565b925050600101612071565b505050505050565b61204b6102a08383612d06565b6120b981612c6c565b6120c38184612cb4565b92506120ce82612c59565b8060005b8381101561209b5781516120e68782611d47565b96506120f183612c5c565b9250506001016120d2565b61204b60408383612d06565b61211181612c72565b61211b8184612cb4565b925061212682612c59565b8060005b8381101561209b57815161213e8782611d47565b965061214983612c5c565b92505060010161212a565b61215d81612c72565b6121678184612cb4565b925061217282612c59565b8060005b8381101561209b57815161218a8782611d47565b965061219583612c5c565b925050600101612176565b6121a981612c78565b6121b38184612cb4565b92506121be82612c59565b8060005b8381101561209b5781516121d68782611d47565b96506121e183612c5c565b9250506001016121c2565b6121f581612c7e565b6121ff8184612cb4565b925061220a82612c59565b8060005b8381101561209b5761221f82612d71565b6122298782611d47565b965061223483612ca5565b92505060010161220e565b61204b60608383612d06565b61204b6101208383612d06565b61226181612c84565b61226b8184612cb4565b925061227682612c59565b8060005b8381101561209b57815161228e8782611d47565b965061229983612c5c565b92505060010161227a565b611d6481612c59565b60006122b882612c62565b6122c28185612cb4565b93506122d2818560208601612d12565b9290920192915050565b611d6481612cfb565b60006122f082612c62565b6122fa8185612cab565b935061230a818560208601612d12565b61231381612d7d565b9093019392505050565b600061232a603183612cab565b7f56616c7565206d75737420626520696e7465676572206d756c7469706c6573208152706f66207363616c696e67466163746f722160781b602082015260400192915050565b600061237d601783612cab565b7f56616c7565206d75737420626520706f73697469766521000000000000000000815260200192915050565b60006123b6601483612cab565b735472616e7366657246726f6d206661696c65642160601b815260200192915050565b60006123e6601983612cab565b7f4475706c6963617465206e6f7465436f6d6d69746d656e742100000000000000815260200192915050565b600061241f601683612cab565b7554686520616e63686f72206d7573742065786973742160501b815260200192915050565b6000612451603d83612cab565b7f496e707574206e756d626572206d75737420626520657175616c20746f20737081527f656e64417574686f726974795369676e6174757265206e756d62657221000000602082015260400192915050565b60006124b0601d83612cab565b7f4f7574707574206e756d626572206d7573742062652031206f72203221000000815260200192915050565b60006124e9601e83612cab565b7f4f7574707574206e756d6265722063616e6e6f74206578636565642031210000815260200192915050565b6000612522602883612cab565b7f4f7574707574206e756d626572206d75737420626520657175616c20746f2063815267206e756d6265722160c01b602082015260400192915050565b600061256c601083612cab565b6f5472616e73666572206661696c65642160801b815260200192915050565b6000612598601a83612cab565b7f4475706c6963617465206e6f7465436f6d6d69746d656e747321000000000000815260200192915050565b60006125d1603f83612cab565b7f5468652070726f6f6620616e64207369676e61747572652068617665206e6f7481527f206265656e2076657269666965642062792074686520636f6e74726163742100602082015260400192915050565b6000612630602a83612cab565b7f506f736974696f6e2073686f756c6420626520736d616c6c6572207468616e208152696c656166436f756e742160b01b602082015260400192915050565b600061267c602b83612cab565b7f4f7574707574206e756d626572206d75737420626520657175616c20746f206c81526a656e677468206f6620632160a81b602082015260400192915050565b60006126c9601c83612cab565b7f496e707574206e756d626572206d7573742062652031206f7220322100000000815260200192915050565b6000612702602083612cab565b7f546865206e6f74652068617320616c7265616479206265656e207370656e7421815260200192915050565b611d6481612ce5565b611d6481612cee565b611d6461274c82612cee565b612d66565b600061275d828a611d6a565b60148201915061276e82888a611dd3565b915061277b828688611fa3565b9150612788828486611e6e565b9998505050505050505050565b60006127a1828b611d6a565b6014820191506127b1828a61203e565b610140820191506127c382888a611fa3565b91506127d0828688611e6e565b91506127dc8285611d6a565b6014820191506127ec8284612740565b5060080198975050505050505050565b60006128088287611d6a565b6014820191506128188286612740565b600882019150612828828561224b565b6101208201915061283982846120a3565b506102a001949350505050565b600061178e82846122ad565b606081016128608286611d5b565b61286d6020830185611d5b565b6115f260408301846122a4565b604081016128888285611d5b565b61178e60208301846122a4565b60a081016128a38286611d5b565b6128b060208301856122a4565b6115f2604083018461223f565b61052080825281016128d0818d8f611d7b565b905081810360208301526128e5818b8d611ebb565b905081810360408301526128fa81898b611f56565b905061290960608301886120fc565b61291660a08301876122a4565b61292360c08301866122dc565b61293060e08301856121ec565b61293e6105008301846122a4565b9c9b505050505050505050505050565b6105208082528101612960818b611e20565b90508181036020830152612974818a611f08565b905081810360408301526129888189611ff0565b90506129976060830188612108565b6129a460a08301876122a4565b6129b160c0830186612737565b6129be60e08301856121ec565b6127886105008301846122a4565b61020081016129db828861203e565b6129e96101408301876120fc565b6129f7610180830186612737565b612a056101a08301856120fc565b612a136101e08301846122a4565b9695505050505050565b6105e08101612a2c828961224b565b612a3a6101208301886120fc565b612a48610160830187612737565b612a566101808301866122a4565b612a646101a08301856121ec565b612a726105c08301846122a4565b979650505050505050565b6020810161124882846122a4565b6104208101612a9a82856122a4565b61178e60208301846121a0565b6020808252810161178e81846122e5565b602080825281016112488161231d565b6020808252810161124881612370565b60208082528101611248816123a9565b60208082528101611248816123d9565b6020808252810161124881612412565b6020808252810161124881612444565b60208082528101611248816124a3565b60208082528101611248816124dc565b6020808252810161124881612515565b602080825281016112488161255f565b602080825281016112488161258b565b60208082528101611248816125c4565b6020808252810161124881612623565b602080825281016112488161266f565b60208082528101611248816126bc565b60208082528101611248816126f5565b6103208101612bc782886122a4565b612bd460208301876122a4565b612be160408301866122a4565b612bee60608301856122a4565b612a1360808301846120a3565b6103208101612c0a82886122a4565b612c1760208301876122a4565b612c2460408301866122a4565b612c3160608301856122a4565b612a1360808301846120b0565b60608101612c4c828661272e565b61286d60208301856122a4565b90565b60200190565b5190565b50600a90565b50601590565b50600290565b50602090565b50602190565b50600990565b6101400190565b6102a00190565b60400190565b6101200190565b60010190565b90815260200190565b919050565b5090565b600061124882612ccd565b151590565b6001600160a01b031690565b6001600160a81b031690565b63ffffffff1690565b67ffffffffffffffff1690565b600061124882612cee565b82818337506000910152565b60005b83811015612d2d578181015183820152602001612d15565b83811115612d3c576000848401525b50505050565b6000611248612d5083612c59565b612c59565b600061124882600061124882612d8d565b600061124882612d87565b60006112488254612d42565b601f01601f191690565b60c01b90565b60601b90565b612d9c81612cd9565b8114612da757600080fd5b50565b612d9c81612cc8565b612d9c81612c5956fea36474726f6e58207ef421e01e827fa1d2e384579b655503e18aef0f4bf9ff3e5176a254c97da9036c6578706572696d656e74616cf564736f6c637828302e352e31322d646576656c6f702e323032302e362e31352b636f6d6d69742e34323336323638380065"
    },
    fallbackOldVersionTest: {
        contractName: "Test0",
        abi:[{
            "anonymous": false,
            "inputs": [{
                "indexed": false,
                "internalType": "string",
                "name": "data",
                "type": "string"
            }, {
                "indexed": false,
                "internalType": "bytes",
                "name": "msg",
                "type": "bytes"
            }],
            "name": "FallbackCall",
            "type": "event"
        }, {
            "payable": true,
            "stateMutability": "payable",
            "type": "fallback"
        }],
        bytecode:"608060405234801561001057600080fd5b50d3801561001d57600080fd5b50d2801561002a57600080fd5b506101d98061003a6000396000f3fe60c0604052600860808190526766616c6c6261636b60c01b60a0908152610029916000919061010a565b506040805181815260008054600260001961010060018416150201909116049282018390527f1f0af026fd1015e37743a803fa8c7b92c09a6fc99890b1681a1e3c888427c25e9290918291369190819060208201906060830190869080156100d25780601f106100a7576101008083540402835291602001916100d2565b820191906000526020600020905b8154815290600101906020018083116100b557829003601f168201915b50508381038252848152602001858580828437600083820152604051601f909101601f191690920182900397509095505050505050a1005b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061014b57805160ff1916838001178555610178565b82800160010185558215610178579182015b8281111561017857825182559160200191906001019061015d565b50610184929150610188565b5090565b6101a291905b80821115610184576000815560010161018e565b9056fea26474726f6e5820e77b862582c00095aa34fd5c2839c0d8f209bdac194c0adeec660fa15a08fbe464736f6c634300050f0031"
    },
    fallbackOldversionCall: {
        contractName: "Call",
        abi:[{
            "constant": false,
            "inputs": [{
                "internalType": "contract Test0",
                "name": "test",
                "type": "address"
            }],
            "name": "call",
            "outputs": [{
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }],
            "payable": true,
            "stateMutability": "payable",
            "type": "function"
        }],
        bytecode:"608060405234801561001057600080fd5b50d3801561001d57600080fd5b50d2801561002a57600080fd5b506101748061003a6000396000f3fe60806040526004361061001e5760003560e01c8063f55332ab14610023575b600080fd5b6100496004803603602081101561003957600080fd5b50356001600160a01b031661005d565b604080519115158252519081900360200190f35b60408051600481526024810182526020810180516001600160e01b031663f85396d760e01b1781529151815160009384936001600160a01b038716939092909182918083835b602083106100c25780518252601f1990920191602091820191016100a3565b6001836020036101000a0380198251168184511680821785525050505050509050019150506000604051808303816000865af19150503d8060008114610124576040519150601f19603f3d011682016040523d82523d6000602084013e610129565b606091505b505090508061013757600080fd5b5060019291505056fea26474726f6e58203498e1c23a661ae640e44836405d25839850ec79748cabd2dab945fd13ee0c7c64736f6c634300050f0031"
    },
    Caller: {
        contractName: "Caller",
        abi:[{
            "inputs": [{
                "internalType": "contract Test0",
                "name": "test",
                "type": "address"
            }],
            "name": "callTest0",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        }, {
            "inputs": [{
                "internalType": "address",
                "name": "test",
                "type": "address"
            }],
            "name": "callTest1",
            "outputs": [{
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }],
            "stateMutability": "nonpayable",
            "type": "function"
        }, {
            "inputs": [{
                "internalType": "address",
                "name": "test",
                "type": "address"
            }],
            "name": "callTest2",
            "outputs": [{
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }],
            "stateMutability": "payable",
            "type": "function"
        }, {
            "inputs": [{
                "internalType": "contract TestPayable",
                "name": "test",
                "type": "address"
            }],
            "name": "callTestPayable1",
            "outputs": [{
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }],
            "stateMutability": "payable",
            "type": "function"
        }],
        bytecode:"608060405234801561001057600080fd5b50d3801561001d57600080fd5b50d2801561002a57600080fd5b5061045e8061003a6000396000f3fe60806040526004361061003f5760003560e01c80637b09404c1461004457806381cd8690146100a557806383d9d8e2146100cb578063fd8a3f72146100e1575b600080fd5b34801561005057600080fd5b50d3801561005d57600080fd5b50d2801561006a57600080fd5b506100916004803603602081101561008157600080fd5b50356001600160a01b0316610130565b604080519115158252519081900360200190f35b610091600480360360208110156100bb57600080fd5b50356001600160a01b031661026e565b6100916004803603602081101561008157600080fd5b3480156100ed57600080fd5b50d380156100fa57600080fd5b50d2801561010757600080fd5b5061012e6004803603602081101561011e57600080fd5b50356001600160a01b031661034d565b005b60408051600481526024810182526020810180516001600160e01b031663f85396d760e01b1781529151815160009384936001600160a01b038716939092909182918083835b602083106101955780518252601f199092019160209182019101610176565b6001836020036101000a0380198251168184511680821785525050505050509050019150506000604051808303816000865af19150503d80600081146101f7576040519150601f19603f3d011682016040523d82523d6000602084013e6101fc565b606091505b505090508061020a57600080fd5b6040516001600160a01b03841690600081818181865af19150503d8060008114610250576040519150601f19603f3d011682016040523d82523d6000602084013e610255565b606091505b5050809150508061026557600080fd5b50600192915050565b60408051600481526024810182526020810180516001600160e01b031663f85396d760e01b1781529151815160009384936001600160a01b038716936103e893919290918291908083835b602083106102d85780518252601f1990920191602091820191016102b9565b6001836020036101000a03801982511681845116808217855250505050505090500191505060006040518083038185875af1925050503d806000811461033a576040519150601f19603f3d011682016040523d82523d6000602084013e61033f565b606091505b505090508061026557600080fd5b60408051600481526024810182526020810180516001600160e01b031663f85396d760e01b178152915181516000936001600160a01b0386169392918291908083835b602083106103af5780518252601f199092019160209182019101610390565b6001836020036101000a0380198251168184511680821785525050505050509050019150506000604051808303816000865af19150503d8060008114610411576040519150601f19603f3d011682016040523d82523d6000602084013e610416565b606091505b505090508061042457600080fd5b505056fea2646970667358221220a8ba92701840ebc55cfbea4dde793d8c6d1dea0ad717bb4b990a64ad6a3f6d6a64736f6c63430006000033"
    },
    Test0: {
        contractName: "Test0",
        abi:[{
            "anonymous": false,
            "inputs": [{
                "indexed": false,
                "internalType": "bytes",
                "name": "data",
                "type": "bytes"
            }, {
                "indexed": false,
                "internalType": "uint256",
                "name": "a",
                "type": "uint256"
            }],
            "name": "FuncCalled",
            "type": "event"
        }],
        bytecode:"6080604052348015600f57600080fd5b50d38015601b57600080fd5b50d28015602757600080fd5b50603f8060356000396000f3fe6080604052600080fdfea264697066735822122024bb1ec3ccbbf5f175773883eecb29e15f63a9ac8ea21b2b896824c218b5e4ac64736f6c63430006000033"
    },
    Test1: {
        contractName: "Test1",
        abi:[{
            "anonymous": false,
            "inputs": [{
                "indexed": false,
                "internalType": "string",
                "name": "a",
                "type": "string"
            }],
            "name": "FuncCalled",
            "type": "event"
        }, {
            "stateMutability": "nonpayable",
            "type": "fallback"
        }],
        bytecode:"608060405234801561001057600080fd5b50d3801561001d57600080fd5b50d2801561002a57600080fd5b506101db8061003a6000396000f3fe608060405234801561001057600080fd5b50d3801561001d57600080fd5b50d2801561002a57600080fd5b506040805180820190915260088082526766616c6c6261636b60c01b602090920191825261005a9160009161010a565b5060408051602080825260008054600260001961010060018416150201909116049183018290527f10c0f70f19b90dec441dc2d497deea85691c944270c9b00cb5743d55f60644ec939092918291820190849080156100fa5780601f106100cf576101008083540402835291602001916100fa565b820191906000526020600020905b8154815290600101906020018083116100dd57829003601f168201915b50509250505060405180910390a1005b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061014b57805160ff1916838001178555610178565b82800160010185558215610178579182015b8281111561017857825182559160200191906001019061015d565b50610184929150610188565b5090565b6101a291905b80821115610184576000815560010161018e565b9056fea2646970667358221220ffc66ea2b1cb16a6d7d26da40c280f75e73eac93c7e707ce82e6b2a42af6d67e64736f6c63430006000033"
    },
    Test2: {
        contractName: "Test2",
        abi:[{
            "anonymous": false,
            "inputs": [{
                "indexed": false,
                "internalType": "string",
                "name": "data",
                "type": "string"
            }],
            "name": "FuncCalled",
            "type": "event"
        }, {
            "stateMutability": "payable",
            "type": "fallback"
        }],
        bytecode:"608060405234801561001057600080fd5b50d3801561001d57600080fd5b50d2801561002a57600080fd5b506101aa8061003a6000396000f3fe60c0604052600860808190526766616c6c6261636b60c01b60a090815261002991600091906100d9565b5060408051602080825260008054600260001961010060018416150201909116049183018290527f10c0f70f19b90dec441dc2d497deea85691c944270c9b00cb5743d55f60644ec939092918291820190849080156100c95780601f1061009e576101008083540402835291602001916100c9565b820191906000526020600020905b8154815290600101906020018083116100ac57829003601f168201915b50509250505060405180910390a1005b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061011a57805160ff1916838001178555610147565b82800160010185558215610147579182015b8281111561014757825182559160200191906001019061012c565b50610153929150610157565b5090565b61017191905b80821115610153576000815560010161015d565b9056fea2646970667358221220f97a67f88304f8e5520cb93af2e3fbb6382554f5af816510e623146ae22df8b464736f6c63430006000033"
    },
    TestPayable: {
        contractName: "TestPayable",
        abi:[{
            "anonymous": false,
            "inputs": [{
                "indexed": false,
                "internalType": "string",
                "name": "a",
                "type": "string"
            }],
            "name": "FuncCalled",
            "type": "event"
        }, {
            "stateMutability": "payable",
            "type": "fallback"
        }, {
            "stateMutability": "payable",
            "type": "receive"
        }],
        bytecode:"608060405234801561001057600080fd5b50d3801561001d57600080fd5b50d2801561002a57600080fd5b506101e38061003a6000396000f3fe6080604052366100e757604080518082019091526007808252667265636569766560c81b602090920191825261003791600091610112565b5060408051602080825260008054600260001961010060018416150201909116049183018290527f10c0f70f19b90dec441dc2d497deea85691c944270c9b00cb5743d55f60644ec939092918291820190849080156100d75780601f106100ac576101008083540402835291602001916100d7565b820191906000526020600020905b8154815290600101906020018083116100ba57829003601f168201915b50509250505060405180910390a1005b6040805180820190915260088082526766616c6c6261636b60c01b6020909201918252610037916000915b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061015357805160ff1916838001178555610180565b82800160010185558215610180579182015b82811115610180578251825591602001919060010190610165565b5061018c929150610190565b5090565b6101aa91905b8082111561018c5760008155600101610196565b9056fea2646970667358221220475f9be6275cfaeda61b73a80462165b5fcc0051f77b4749c029bfc07eb73c5564736f6c63430006000033"
    },
    rawParam: {
        /*
            pragma solidity ^0.4.18;
            contract rawParam {
                uint256 public check;

                constructor(uint256 _check) public {
                    check = _check;
                }

                function setCheck(uint256 _check) public {
                    check = _check;
                }
            }
        */
        contractName: "rawParam",
        abi: [
            {
                constant: false,
                inputs: [
                    {
                        name: "_check",
                        type: "uint256",
                    },
                ],
                name: "setCheck",
                outputs: [],
                payable: false,
                stateMutability: "nonpayable",
                type: "function",
            },
            {
                constant: true,
                inputs: [],
                name: "check",
                outputs: [
                    {
                        name: "",
                        type: "uint256",
                    },
                ],
                payable: false,
                stateMutability: "view",
                type: "function",
            },
        ],
        bytecode:
            "0x608060405234801561001057600080fd5b5060405160208061012583398101806040528101908080519060200190929190505050806000819055505060dc806100496000396000f3006080604052600436106049576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680632c948bd214604e578063919840ad146078575b600080fd5b348015605957600080fd5b5060766004803603810190808035906020019092919050505060a0565b005b348015608357600080fd5b50608a60aa565b6040518082815260200191505060405180910390f35b8060008190555050565b600054815600a165627a7a7230582084a638eb1bcab674b68b98bc8407c96a2e186016c5da95ffcf421c1d40d0feb60029",
    },
    /**
     * contract TronToken {

    string public name = "Tronix";      //  token name
    string public symbol = "TRX";           //  token symbol
    uint256 public decimals = 6;            //  token digit

    mapping (address => uint256) public balanceOf;
    mapping (address => mapping (address => uint256)) public allowance;

    uint256 public totalSupply = 0;
    bool public stopped = false;

    address owner = address(0x0);

    modifier isOwner {
        assert(owner == msg.sender);
        _;
    }

    modifier validAddress {
        assert(address(0x0) != msg.sender);
        _;
    }

    constructor(address _addressFounder,uint256 valueFounder) public {
        owner = msg.sender;
        totalSupply = valueFounder;
        balanceOf[_addressFounder] = valueFounder;
        emit Transfer(address(0x0), _addressFounder, valueFounder);
    }

    function transfer(address _to, uint256 _value) validAddress public returns (bool success) {
        require(balanceOf[msg.sender] >= _value);
        require(balanceOf[_to] + _value >= balanceOf[_to]);
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;
        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    function approve(address _spender, uint256 _value) validAddress public returns (bool success) {
        require(_value == 0 || allowance[msg.sender][_spender] == 0);
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    function setName(string memory _name) isOwner public {
        name = _name;
    }

    function burn(uint256 _value) public {
        require(balanceOf[msg.sender] >= _value);
        balanceOf[msg.sender] -= _value;
        balanceOf[address(0x0)] += _value;
        emit Transfer(msg.sender, address(0x0), _value);
    }

    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    event Approval(address indexed _owner, address indexed _spender, uint256 _value);
}
     */
    tronToken: {
        contractName: "TronToken",
        abi:[{
            "constant": true,
            "inputs": [],
            "name": "name",
            "outputs": [{
                "name": "",
                "type": "string"
            }],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        }, {
            "constant": false,
            "inputs": [{
                "name": "_spender",
                "type": "address"
            }, {
                "name": "_value",
                "type": "uint256"
            }],
            "name": "approve",
            "outputs": [{
                "name": "success",
                "type": "bool"
            }],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        }, {
            "constant": true,
            "inputs": [],
            "name": "totalSupply",
            "outputs": [{
                "name": "",
                "type": "uint256"
            }],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        }, {
            "constant": true,
            "inputs": [],
            "name": "decimals",
            "outputs": [{
                "name": "",
                "type": "uint256"
            }],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        }, {
            "constant": false,
            "inputs": [{
                "name": "_value",
                "type": "uint256"
            }],
            "name": "burn",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        }, {
            "constant": true,
            "inputs": [{
                "name": "",
                "type": "address"
            }],
            "name": "balanceOf",
            "outputs": [{
                "name": "",
                "type": "uint256"
            }],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        }, {
            "constant": true,
            "inputs": [],
            "name": "stopped",
            "outputs": [{
                "name": "",
                "type": "bool"
            }],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        }, {
            "constant": true,
            "inputs": [],
            "name": "symbol",
            "outputs": [{
                "name": "",
                "type": "string"
            }],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        }, {
            "constant": false,
            "inputs": [{
                "name": "_to",
                "type": "address"
            }, {
                "name": "_value",
                "type": "uint256"
            }],
            "name": "transfer",
            "outputs": [{
                "name": "success",
                "type": "bool"
            }],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        }, {
            "constant": false,
            "inputs": [{
                "name": "_name",
                "type": "string"
            }],
            "name": "setName",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        }, {
            "constant": true,
            "inputs": [{
                "name": "",
                "type": "address"
            }, {
                "name": "",
                "type": "address"
            }],
            "name": "allowance",
            "outputs": [{
                "name": "",
                "type": "uint256"
            }],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        }, {
            "inputs": [{
                "name": "_addressFounder",
                "type": "address"
            }, {
                "name": "valueFounder",
                "type": "uint256"
            }],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "constructor"
        }, {
            "anonymous": false,
            "inputs": [{
                "indexed": true,
                "name": "_from",
                "type": "address"
            }, {
                "indexed": true,
                "name": "_to",
                "type": "address"
            }, {
                "indexed": false,
                "name": "_value",
                "type": "uint256"
            }],
            "name": "Transfer",
            "type": "event"
        }, {
            "anonymous": false,
            "inputs": [{
                "indexed": true,
                "name": "_owner",
                "type": "address"
            }, {
                "indexed": true,
                "name": "_spender",
                "type": "address"
            }, {
                "indexed": false,
                "name": "_value",
                "type": "uint256"
            }],
            "name": "Approval",
            "type": "event"
        }],
        bytecode:"60c0604052600660808190527f54726f6e6978000000000000000000000000000000000000000000000000000060a090815261003e9160009190610168565b506040805180820190915260038082527f5452580000000000000000000000000000000000000000000000000000000000602090920191825261008391600191610168565b5060066002819055600060055580546001600160a81b03191690553480156100aa57600080fd5b50d380156100b757600080fd5b50d280156100c457600080fd5b50604051610931380380610931833981810160405260408110156100e757600080fd5b50805160209182015160068054610100600160a81b031916336101000217905560058190556001600160a01b03821660008181526003855260408082208490558051848152905194959394929391927fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef929181900390910190a35050610203565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106101a957805160ff19168380011785556101d6565b828001600101855582156101d6579182015b828111156101d65782518255916020019190600101906101bb565b506101e29291506101e6565b5090565b61020091905b808211156101e257600081556001016101ec565b90565b61071f806102126000396000f3fe608060405234801561001057600080fd5b50d3801561001d57600080fd5b50d2801561002a57600080fd5b50600436106100c35760003560e01c806370a082311161008b57806370a08231146101c657806375f12b21146101ec57806395d89b41146101f4578063a9059cbb146101fc578063c47f002714610228578063dd62ed3e146102ce576100c3565b806306fdde03146100c8578063095ea7b31461014557806318160ddd14610185578063313ce5671461019f57806342966c68146101a7575b600080fd5b6100d06102fc565b6040805160208082528351818301528351919283929083019185019080838360005b8381101561010a5781810151838201526020016100f2565b50505050905090810190601f1680156101375780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b6101716004803603604081101561015b57600080fd5b506001600160a01b03813516906020013561038a565b604080519115158252519081900360200190f35b61018d610431565b60408051918252519081900360200190f35b61018d610437565b6101c4600480360360208110156101bd57600080fd5b503561043d565b005b61018d600480360360208110156101dc57600080fd5b50356001600160a01b03166104d4565b6101716104e6565b6100d06104ef565b6101716004803603604081101561021257600080fd5b506001600160a01b038135169060200135610549565b6101c46004803603602081101561023e57600080fd5b81019060208101813564010000000081111561025957600080fd5b82018360208201111561026b57600080fd5b8035906020019184600183028401116401000000008311171561028d57600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250929550610603945050505050565b61018d600480360360408110156102e457600080fd5b506001600160a01b0381358116916020013516610633565b6000805460408051602060026001851615610100026000190190941693909304601f810184900484028201840190925281815292918301828280156103825780601f1061035757610100808354040283529160200191610382565b820191906000526020600020905b81548152906001019060200180831161036557829003601f168201915b505050505081565b60003361039357fe5b8115806103c157503360009081526004602090815260408083206001600160a01b0387168452909152902054155b6103ca57600080fd5b3360008181526004602090815260408083206001600160a01b03881680855290835292819020869055805186815290519293927f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925929181900390910190a350600192915050565b60055481565b60025481565b3360009081526003602052604090205481111561045957600080fd5b336000818152600360209081526040808320805486900390558280527f3617319a054d772f909f7c479a2cebe5066e836a939412e32403c99029b92eff805486019055805185815290519293927fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef929181900390910190a350565b60036020526000908152604090205481565b60065460ff1681565b60018054604080516020600284861615610100026000190190941693909304601f810184900484028201840190925281815292918301828280156103825780601f1061035757610100808354040283529160200191610382565b60003361055257fe5b3360009081526003602052604090205482111561056e57600080fd5b6001600160a01b038316600090815260036020526040902054828101101561059557600080fd5b336000818152600360209081526040808320805487900390556001600160a01b03871680845292819020805487019055805186815290519293927fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef929181900390910190a350600192915050565b60065461010090046001600160a01b0316331461061c57fe5b805161062f906000906020840190610650565b5050565b600460209081526000928352604080842090915290825290205481565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061069157805160ff19168380011785556106be565b828001600101855582156106be579182015b828111156106be5782518255916020019190600101906106a3565b506106ca9291506106ce565b5090565b6106e891905b808211156106ca57600081556001016106d4565b9056fea26474726f6e5820beed41f928b5943738d1025b93669ec2de5bf400228e6c96355cc6540fc16f4664736f6c63430005090031"
    },
    /**
     *contract TestAddressArray {
    string public name = "Tronix";
    string public symbol = "TRX";
    uint256 public decimals = 6;

    mapping (address => uint256) public balanceOf;
    uint256 public totalSupply = 0;
    uint256 constant valueFounder = 100000000000000000;
    address owner = address(0x0);

    constructor(address[3] memory _addressFounders) public {
        owner = msg.sender;
        totalSupply = valueFounder;
        for (uint i = 0; i < 3; i++) {
            balanceOf[_addressFounders[i]] = 100000000;
            emit Transfer(address(0x0), _addressFounders[i], 100000000);
        }
        balanceOf[owner] = valueFounder;
        emit Transfer(address(0x0), owner, valueFounder);
    }

    function transferWith2(address[2] memory _to, uint256[2] memory _value) public returns (bool success) {
        for (uint i = 0; i < 2; i++) {
            require(balanceOf[msg.sender] >= _value[i]);
            require(balanceOf[_to[i]] + _value[i] >= balanceOf[_to[i]]);
            balanceOf[msg.sender] -= _value[i];
            balanceOf[_to[i]] += _value[i];
            emit Transfer(msg.sender, _to[i], _value[i]);
        }
        return true;
    }

    function transferWithArray(address[] memory _to, uint256[] memory _value) public returns (bool success) {
        for (uint i = 0; i < _to.length; i++) {
            require(balanceOf[msg.sender] >= _value[i]);
            require(balanceOf[_to[i]] + _value[i] >= balanceOf[_to[i]]);
            balanceOf[msg.sender] -= _value[i];
            balanceOf[_to[i]] += _value[i];
            emit Transfer(msg.sender, _to[i], _value[i]);
        }
        return true;
    }

    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    }
     */
    testAddressArray: {
        contractName: "TestAddressArray",
        abi:[{
            "inputs": [{
                "internalType": "address[3]",
                "name": "_addressFounders",
                "type": "address[3]"
            }],
            "stateMutability": "nonpayable",
            "type": "constructor"
        }, {
            "anonymous": false,
            "inputs": [{
                "indexed": true,
                "internalType": "address",
                "name": "_from",
                "type": "address"
            }, {
                "indexed": true,
                "internalType": "address",
                "name": "_to",
                "type": "address"
            }, {
                "indexed": false,
                "internalType": "uint256",
                "name": "_value",
                "type": "uint256"
            }],
            "name": "Transfer",
            "type": "event"
        }, {
            "inputs": [{
                "internalType": "address",
                "name": "",
                "type": "address"
            }],
            "name": "balanceOf",
            "outputs": [{
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }],
            "stateMutability": "view",
            "type": "function"
        }, {
            "inputs": [],
            "name": "decimals",
            "outputs": [{
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }],
            "stateMutability": "view",
            "type": "function"
        }, {
            "inputs": [],
            "name": "name",
            "outputs": [{
                "internalType": "string",
                "name": "",
                "type": "string"
            }],
            "stateMutability": "view",
            "type": "function"
        }, {
            "inputs": [],
            "name": "symbol",
            "outputs": [{
                "internalType": "string",
                "name": "",
                "type": "string"
            }],
            "stateMutability": "view",
            "type": "function"
        }, {
            "inputs": [],
            "name": "totalSupply",
            "outputs": [{
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }],
            "stateMutability": "view",
            "type": "function"
        }, {
            "inputs": [{
                "internalType": "address[2]",
                "name": "_to",
                "type": "address[2]"
            }, {
                "internalType": "uint256[2]",
                "name": "_value",
                "type": "uint256[2]"
            }],
            "name": "transferWith2",
            "outputs": [{
                "internalType": "bool",
                "name": "success",
                "type": "bool"
            }],
            "stateMutability": "nonpayable",
            "type": "function"
        }, {
            "inputs": [{
                "internalType": "address[]",
                "name": "_to",
                "type": "address[]"
            }, {
                "internalType": "uint256[]",
                "name": "_value",
                "type": "uint256[]"
            }],
            "name": "transferWithArray",
            "outputs": [{
                "internalType": "bool",
                "name": "success",
                "type": "bool"
            }],
            "stateMutability": "nonpayable",
            "type": "function"
        }],
        bytecode:"60c060405260066080819052650a8e4dedcd2f60d31b60a090815261002791600091906101cf565b50604080518082019091526003808252620a8a4b60eb1b6020909201918252610052916001916101cf565b5060066002556000600455600580546001600160a01b031916905534801561007957600080fd5b50d3801561008657600080fd5b50d2801561009357600080fd5b50604051610a90380380610a90833981810160405260608110156100b657600080fd5b50600580546001600160a01b0319163317905567016345785d8a000060045560005b6003811015610175576305f5e100600360008484600381106100f657fe5b60200201516001600160a01b03166001600160a01b031681526020019081526020016000208190555081816003811061012b57fe5b60200201516001600160a01b031660006001600160a01b0316600080516020610a708339815191526305f5e1006040518082815260200191505060405180910390a36001016100d8565b50600580546001600160a01b03908116600090815260036020908152604080832067016345785d8a0000908190559454815195865290519316939192600080516020610a708339815191529281900390910190a350610262565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061021057805160ff191683800117855561023d565b8280016001018555821561023d579182015b8281111561023d578251825591602001919060010190610222565b5061024992915061024d565b5090565b5b80821115610249576000815560010161024e565b6107ff806102716000396000f3fe608060405234801561001057600080fd5b50d3801561001d57600080fd5b50d2801561002a57600080fd5b50600436106100975760003560e01c8063442c0d0a11610075578063442c0d0a1461013b57806361267ff2146101c357806370a08231146102ea57806395d89b411461031057610097565b806306fdde031461009c57806318160ddd14610119578063313ce56714610133575b600080fd5b6100a4610318565b6040805160208082528351818301528351919283929083019185019080838360005b838110156100de5781810151838201526020016100c6565b50505050905090810190601f16801561010b5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b6101216103a6565b60408051918252519081900360200190f35b6101216103ac565b6101af6004803603608081101561015157600080fd5b6040805180820182529183019291818301918390600290839083908082843760009201919091525050604080518082018252929594938181019392509060029083908390808284376000920191909152509194506103b29350505050565b604080519115158252519081900360200190f35b6101af600480360360408110156101d957600080fd5b8101906020810181356401000000008111156101f457600080fd5b82018360208201111561020657600080fd5b8035906020019184602083028401116401000000008311171561022857600080fd5b919080806020026020016040519081016040528093929190818152602001838360200280828437600092019190915250929594936020810193503591505064010000000081111561027857600080fd5b82018360208201111561028a57600080fd5b803590602001918460208302840111640100000000831117156102ac57600080fd5b919080806020026020016040519081016040528093929190818152602001838360200280828437600092019190915250929550610575945050505050565b6101216004803603602081101561030057600080fd5b50356001600160a01b031661075d565b6100a461076f565b6000805460408051602060026001851615610100026000190190941693909304601f8101849004840282018401909252818152929183018282801561039e5780601f106103735761010080835404028352916020019161039e565b820191906000526020600020905b81548152906001019060200180831161038157829003601f168201915b505050505081565b60045481565b60025481565b6000805b600281101561056b578281600281106103cb57fe5b602002015160036000336001600160a01b03166001600160a01b0316815260200190815260200160002054101561040157600080fd5b6003600085836002811061041157fe5b60200201516001600160a01b03166001600160a01b031681526020019081526020016000205483826002811061044357fe5b60200201516003600087856002811061045857fe5b60200201516001600160a01b03166001600160a01b031681526020019081526020016000205401101561048a57600080fd5b82816002811061049657fe5b602090810291909101513360009081526003909252604090912080549190910390558281600281106104c457fe5b6020020151600360008684600281106104d957fe5b602090810291909101516001600160a01b031682528101919091526040016000208054909101905583816002811061050d57fe5b60200201516001600160a01b0316337fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef85846002811061054957fe5b60200201516040518082815260200191505060405180910390a36001016103b6565b5060019392505050565b6000805b835181101561056b5782818151811061058e57fe5b602002602001015160036000336001600160a01b03166001600160a01b031681526020019081526020016000205410156105c757600080fd5b600360008583815181106105d757fe5b60200260200101516001600160a01b03166001600160a01b031681526020019081526020016000205483828151811061060c57fe5b60200260200101516003600087858151811061062457fe5b60200260200101516001600160a01b03166001600160a01b031681526020019081526020016000205401101561065957600080fd5b82818151811061066557fe5b602090810291909101810151336000908152600390925260409091208054919091039055825183908290811061069757fe5b6020026020010151600360008684815181106106af57fe5b60200260200101516001600160a01b03166001600160a01b03168152602001908152602001600020600082825401925050819055508381815181106106f057fe5b60200260200101516001600160a01b0316336001600160a01b03167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef85848151811061073857fe5b60200260200101516040518082815260200191505060405180910390a3600101610579565b60036020526000908152604090205481565b60018054604080516020600284861615610100026000190190941693909304601f8101849004840282018401909252818152929183018282801561039e5780601f106103735761010080835404028352916020019161039e56fea26469706673582212208d688f20093b0a2c7c148046aa5eec414133ef86914a378392414d6df3cb1e5764736f6c63430007000033ddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"
    },
    /**
     * contract trcTokenTest{
     trcToken idCon = 0;
     uint256 tokenValueCon=0;
     uint256 callValueCon = 0;

     function TransferTokenTo(address payable toAddress, trcToken id, uint256 amount) public payable{
         toAddress.transferToken(amount,id);
     }

     constructor(address payable toAddress, trcToken id, uint256 amount) public payable {
         idCon = msg.tokenid;
         tokenValueCon = msg.tokenvalue;
         callValueCon = msg.value;
         toAddress.transferToken(amount, id);
     }

     function getResultInCon() public payable returns(trcToken, uint256, uint256) {
         return (idCon, tokenValueCon, callValueCon);
     }
    }
     */
    trcTokenTest070: {
        contractName: "trcTokenTest",
        abi:[{
            "inputs": [{
                "internalType": "address payable",
                "name": "toAddress",
                "type": "address"
            }, {
                "internalType": "trcToken",
                "name": "id",
                "type": "trcToken"
            }, {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }],
            "stateMutability": "payable",
            "type": "constructor"
        }, {
            "inputs": [{
                "internalType": "address payable",
                "name": "toAddress",
                "type": "address"
            }, {
                "internalType": "trcToken",
                "name": "id",
                "type": "trcToken"
            }, {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }],
            "name": "TransferTokenTo",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
        }, {
            "inputs": [],
            "name": "getResultInCon",
            "outputs": [{
                "internalType": "trcToken",
                "name": "",
                "type": "trcToken"
            }, {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }, {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }],
            "stateMutability": "payable",
            "type": "function"
        }],
        bytecode:"608060405260008055600060015560006002556040516102143803806102148339818101604052606081101561003457600080fd5b5080516020820151604090920151d3600055d2600155346002559091906001600160a01b03831681156108fc0282848015801561007057600080fd5b50806780000000000000001115801561008857600080fd5b5080620f42401015801561009b57600080fd5b50604051600081818185878a8ad09450505050501580156100c0573d6000803e3d6000fd5b50505050610141806100d36000396000f3fe6080604052600436106100295760003560e01c806305c242001461002e5780633be9ece714610054575b600080fd5b610036610088565b60408051938452602084019290925282820152519081900360600190f35b6100866004803603606081101561006a57600080fd5b506001600160a01b038135169060208101359060400135610096565b005b600054600154600254909192565b6001600160a01b03831681156108fc028284801580156100b557600080fd5b5080678000000000000000111580156100cd57600080fd5b5080620f4240101580156100e057600080fd5b50604051600081818185878a8ad0945050505050158015610105573d6000803e3d6000fd5b5050505056fea2646970667358221220a6d3097688ad04359dcb76e491a45f7c4f39a04739bd5209ad46ac46937ddb0f64736f6c63430007000033"
    },
    trcTokenTest059: {
        contractName: "trcTokenTest",
        abi:[{
            "constant": false,
            "inputs": [],
            "name": "getResultInCon",
            "outputs": [{
                "name": "",
                "type": "trcToken"
            }, {
                "name": "",
                "type": "uint256"
            }, {
                "name": "",
                "type": "uint256"
            }],
            "payable": true,
            "stateMutability": "payable",
            "type": "function"
        }, {
            "constant": false,
            "inputs": [{
                "name": "toAddress",
                "type": "address"
            }, {
                "name": "id",
                "type": "trcToken"
            }, {
                "name": "amount",
                "type": "uint256"
            }],
            "name": "TransferTokenTo",
            "outputs": [],
            "payable": true,
            "stateMutability": "payable",
            "type": "function"
        }, {
            "inputs": [{
                "name": "toAddress",
                "type": "address"
            }, {
                "name": "id",
                "type": "trcToken"
            }, {
                "name": "amount",
                "type": "uint256"
            }],
            "payable": true,
            "stateMutability": "payable",
            "type": "constructor"
        }],
        bytecode:"608060405260008055600060015560006002556040516102123803806102128339818101604052606081101561003457600080fd5b5080516020820151604090920151d3600055d2600155346002559091906001600160a01b03831681156108fc0282848015801561007057600080fd5b50806780000000000000001115801561008857600080fd5b5080620f42401015801561009b57600080fd5b50604051600081818185878a8ad09450505050501580156100c0573d6000803e3d6000fd5b5050505061013f806100d36000396000f3fe6080604052600436106100295760003560e01c806305c242001461002e5780633be9ece714610054575b600080fd5b610036610088565b60408051938452602084019290925282820152519081900360600190f35b6100866004803603606081101561006a57600080fd5b506001600160a01b038135169060208101359060400135610096565b005b600054600154600254909192565b6001600160a01b03831681156108fc028284801580156100b557600080fd5b5080678000000000000000111580156100cd57600080fd5b5080620f4240101580156100e057600080fd5b50604051600081818185878a8ad0945050505050158015610105573d6000803e3d6000fd5b5050505056fea26474726f6e5820b3903cb5f98dfab275d27fa71f437645d2ff94eac94d9a0c30c2c9836819ab7d64736f6c63430005090031"
    },
}
