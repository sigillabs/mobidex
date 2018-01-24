import React, { Component } from "react";
import { View, Text } from "react-native";
import { Link } from "react-router-native";
import BigNumber from "bignumber.js";
import Web3 from "web3";
import { ZeroEx } from "0x.js";
import { HttpClient } from "@0xproject/connect";

// Local account
// const address = "0x9bca8678b0239b604a26A57CBE76DC0D16d61e1F";
// const privateKey = "0x2e3a718ef4b1cc2ab905cec11430fa0f89acbfed6cd55639923adf2af17d3bc3";

// Kovan account
const address = "0x004a47EABdc8524Fe5A1cFB0e3D15C2c255479e3";
const privateKey = "0x63861eae41f4291336420cc3730abcb4633ae89c231ce989f90472a3231fbdca";

const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
const zeroEx = new ZeroEx(web3.currentProvider, { networkId: 42 });

export default class OrderDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      nonce: null,
      tx: null,
      receipt: null
    };
  }

  async componentDidMount() {
    const DECIMALS = 18;
    const NULL_ADDRESS = ZeroEx.NULL_ADDRESS;
    const WETH_ADDRESS = await zeroEx.tokenRegistry.getTokenAddressByNameIfExistsAsync("WETH");
    const ZRX_ADDRESS  = await zeroEx.tokenRegistry.getTokenAddressByNameIfExistsAsync("ZRX");
    const EXCHANGE_ADDRESS = zeroEx.exchange.getContractAddress();
    const ACCOUNTS = ["0x9bca8678b0239b604a26A57CBE76DC0D16d61e1F", "0x004a47EABdc8524Fe5A1cFB0e3D15C2c255479e3"];
    const [ MAKER_ADDRESS, TAKER_ADDRESS ] = ACCOUNTS;

    const FILL_AMOUNT = ZeroEx.toBaseUnitAmount(new BigNumber(0.001), DECIMALS);
    const SIGNED_ORDER = {
      "maker": "0x9bca8678b0239b604a26a57cbe76dc0d16d61e1f",
      "makerFee": new BigNumber(0),
      "makerTokenAddress": "0xd0a1e359811322d97991e03f863a0c30c2cf029c",
      "makerTokenAmount": FILL_AMOUNT,
      "taker": "0x0000000000000000000000000000000000000000",
      "takerFee": new BigNumber(0),
      "takerTokenAddress": "0x6ff6c0ff1d68b964901f986d4c9fa3ac68346570",
      "takerTokenAmount": FILL_AMOUNT,
      "expirationUnixTimestampSec": new BigNumber(1517436840),
      "feeRecipient": "0x0000000000000000000000000000000000000000",
      "salt": "54751811455608010816348406996480374731024727500157605891561219199821423714063",
      "ecSignature": {
        "v": 27,
        "r": "0x58eadc4e7bad41cf2c14d8e94a4ff24df5bb08faae38335323277ef6fc839fca",
        "s": "0x3c76e854e6ba433d3d2bfb76a57dd85be5c62d8508ec3d20ea368b044e0a98b6",
        "hash": "0xfd1272a6e7692ad5708b73fb180b78619183eda0f597e9453f8bcaa614b60087"
      },
      "exchangeContractAddress": "0x90fe2af704b34e0224bf2299c838e04d4dcf1364"
    }
    try {
      const TX_HASH = await zeroEx.exchange.fillOrderAsync(SIGNED_ORDER, FILL_AMOUNT, true, TAKER_ADDRESS.toLowerCase());
      console.warn(TX_HASH);
      console.warn(await zeroEx.awaitTransactionMinedAsync(TX_HASH));
    } catch(err) {
      console.error(err);
    }
  }

  render() {
    return (
      <View>
        <Text>Order Details</Text>
        <View>
          <Link to="/accounts">
            <Text>Accounts</Text>
          </Link>
        </View>
        <View>
          <Link to="/orders">
            <Text>Trade</Text>
          </Link>
        </View>
        <View>
          <Link to="/orders/1/details">
            <Text>Order Details</Text>
          </Link>
        </View>
        <View>
          <Link to="/orders/create">
            <Text>Create Order</Text>
          </Link>
        </View>
      </View>
    );
  }
}
