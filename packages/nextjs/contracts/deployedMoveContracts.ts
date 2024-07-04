
import { GenericContractsDeclaration } from "~~/utils/scaffold-eth/contract";

const deployedContracts = {
  "devnet": {
    onchain_bio:
    {
      "bytecode": "0xa11ceb0b060000000a010006020608030e0f051d1307304a087a4010ba01220adc01090ce501340d99020200000101010200030e0002040700000500010000060203000109050000010501080103060c080108010001080001060c0b6f6e636861696e5f62696f067369676e657206737472696e670342696f06537472696e67076765745f62696f087265676973746572046e616d650362696f0a616464726573735f6f664295cca96321b2807473c0df06fa0ec4b1e22e612f8577cc36406d8c0e67630c0000000000000000000000000000000000000000000000000000000000000001126170746f733a3a6d657461646174615f76310e000001076765745f62696f010100000202070801080801000100010003050b002b0010001402010104010004100a001102290004080a0011022c00010b010b0212000c030b000b032d0002000100",
      "abi": {
        "address": "0x4295cca96321b2807473c0df06fa0ec4b1e22e612f8577cc36406d8c0e67630c",
        "name": "onchain_bio",
        "friends": [],
        "exposed_functions": [
          {
            "name": "get_bio",
            "visibility": "public",
            "is_entry": false,
            "is_view": true,
            "generic_type_params": [],
            "params": [
              "address"
            ],
            "return": [
              "0x1::string::String"
            ]
          },
          {
            "name": "register",
            "visibility": "public",
            "is_entry": true,
            "is_view": false,
            "generic_type_params": [],
            "params": [
              "&signer",
              "0x1::string::String",
              "0x1::string::String"
            ],
            "return": []
          }
        ],
        "structs": [
          {
            "name": "Bio",
            "is_native": false,
            "abilities": [
              "drop",
              "store",
              "key"
            ],
            "generic_type_params": [],
            "fields": [
              {
                "name": "name",
                "type": "0x1::string::String"
              },
              {
                "name": "bio",
                "type": "0x1::string::String"
              }
            ]
          }
        ]
      }
    },
    onchain_poems:
    {
      "bytecode": "0xa11ceb0b060000000b010004020408030c0a05161207284c08744006b4010a10be013a0af8010c0c8402260daa02020000010100020e000103070000040001000005020300010501080104060c080108010801000108000d6f6e636861696e5f706f656d7306737472696e670b496e736372697074696f6e06537472696e67086765745f706f656d08726567697374657204706f656d057469746c6506617574686f724295cca96321b2807473c0df06fa0ec4b1e22e612f8577cc36406d8c0e67630c000000000000000000000000000000000000000000000000000000000000000103080100000000000000126170746f733a3a6d657461646174615f7631260101000000000000000d455f414c52454144595f484153000001086765745f706f656d010100000203060801070801080801000100010003050b002b00100014020101040004090b010b020b0312000c040b000b042d0002000000",
      "abi": {
        "address": "0x4295cca96321b2807473c0df06fa0ec4b1e22e612f8577cc36406d8c0e67630c",
        "name": "onchain_poems",
        "friends": [],
        "exposed_functions": [
          {
            "name": "get_poem",
            "visibility": "public",
            "is_entry": false,
            "is_view": true,
            "generic_type_params": [],
            "params": [
              "address"
            ],
            "return": [
              "0x1::string::String"
            ]
          },
          {
            "name": "register",
            "visibility": "public",
            "is_entry": true,
            "is_view": false,
            "generic_type_params": [],
            "params": [
              "&signer",
              "0x1::string::String",
              "0x1::string::String",
              "0x1::string::String"
            ],
            "return": []
          }
        ],
        "structs": [
          {
            "name": "Inscription",
            "is_native": false,
            "abilities": [
              "drop",
              "store",
              "key"
            ],
            "generic_type_params": [],
            "fields": [
              {
                "name": "poem",
                "type": "0x1::string::String"
              },
              {
                "name": "title",
                "type": "0x1::string::String"
              },
              {
                "name": "author",
                "type": "0x1::string::String"
              }
            ]
          }
        ]
      }
    },
    onchain_poems_with_table:
    {
      "bytecode": "0xa11ceb0b060000000c01000a020a14031e23044106054739078001bb0108bb024006fb020a1085033a0abf031c0cdb036f0dca0404000001010102010301040005070000060800030707000410040203010001000800010000090201000212020400041306010203020114080101060415010a02030403050407050504060c0802080208020001060c040308000708010501050203080003070b03020900090109000901010800010900010801010b030209000901186f6e636861696e5f706f656d735f776974685f7461626c65056576656e74067369676e657206737472696e67057461626c6504506f656d08506f656d4c69737406537472696e670b6372656174655f706f656d106372656174655f706f656d5f6c69737407706f656d5f6964076164647265737304706f656d057469746c6506617574686f7205706f656d73055461626c650c706f656d5f636f756e7465720a616464726573735f6f660675707365727404656d6974036e65774295cca96321b2807473c0df06fa0ec4b1e22e612f8577cc36406d8c0e67630c000000000000000000000000000000000000000000000000000000000000000103080100000000000000126170746f733a3a6d657461646174615f76312601010000000000000011455f4e4f545f494e495449414c495a4544000104506f656d010400000002050a030b050c08020d08020e08020102020f0b03020308001103000104010103250b0011020c070a072901040705090700270a072a010c060a06100014060100000000000000160c040a040b070b010b020b0312000c050a060f010a040a0538000b040b060f00150b05380102010104000908380206000000000000000012010c010b000b012d01020101010000",
      "abi": {
        "address": "0x4295cca96321b2807473c0df06fa0ec4b1e22e612f8577cc36406d8c0e67630c",
        "name": "onchain_poems_with_table",
        "friends": [],
        "exposed_functions": [
          {
            "name": "create_poem",
            "visibility": "public",
            "is_entry": true,
            "is_view": false,
            "generic_type_params": [],
            "params": [
              "&signer",
              "0x1::string::String",
              "0x1::string::String",
              "0x1::string::String"
            ],
            "return": []
          },
          {
            "name": "create_poem_list",
            "visibility": "public",
            "is_entry": true,
            "is_view": false,
            "generic_type_params": [],
            "params": [
              "&signer"
            ],
            "return": []
          }
        ],
        "structs": [
          {
            "name": "Poem",
            "is_native": false,
            "abilities": [
              "copy",
              "drop",
              "store"
            ],
            "generic_type_params": [],
            "fields": [
              {
                "name": "poem_id",
                "type": "u64"
              },
              {
                "name": "address",
                "type": "address"
              },
              {
                "name": "poem",
                "type": "0x1::string::String"
              },
              {
                "name": "title",
                "type": "0x1::string::String"
              },
              {
                "name": "author",
                "type": "0x1::string::String"
              }
            ]
          },
          {
            "name": "PoemList",
            "is_native": false,
            "abilities": [
              "key"
            ],
            "generic_type_params": [],
            "fields": [
              {
                "name": "poems",
                "type": "0x1::table::Table<u64, 0x4295cca96321b2807473c0df06fa0ec4b1e22e612f8577cc36406d8c0e67630c::onchain_poems_with_table::Poem>"
              },
              {
                "name": "poem_counter",
                "type": "u64"
              }
            ]
          }
        ]
      }
    }
  }
} as const;

export default deployedContracts satisfies GenericContractsDeclaration;
