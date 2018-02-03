import * as _ from "lodash";
import React, { Component } from "react";
import { Button, Card } from "react-native-elements";
import { fillOrder } from "../../utils/orders";

export default class OrderDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      nonce: null,
      tx: null,
      receipt: null
    };
  }

  // fillOrder = async () => {
  //   const DECIMALS = 18;
  //   const NULL_ADDRESS = ZeroEx.NULL_ADDRESS;
  //   const WETH_ADDRESS = await zeroEx.tokenRegistry.getTokenAddressByNameIfExistsAsync("WETH");
  //   const ZRX_ADDRESS  = await zeroEx.tokenRegistry.getTokenAddressByNameIfExistsAsync("ZRX");
  //   const EXCHANGE_ADDRESS = zeroEx.exchange.getContractAddress();
  //   const ACCOUNTS = ["0x9bca8678b0239b604a26A57CBE76DC0D16d61e1F", "0x004a47EABdc8524Fe5A1cFB0e3D15C2c255479e3"];
  //   const [ MAKER_ADDRESS, TAKER_ADDRESS ] = ACCOUNTS;

  //   const FILL_AMOUNT = ZeroEx.toBaseUnitAmount(new BigNumber(0.001), DECIMALS);
  //   const SIGNED_ORDER = {
  //     "maker": "0x9bca8678b0239b604a26a57cbe76dc0d16d61e1f",
  //     "makerFee": new BigNumber(0),
  //     "makerTokenAddress": "0xd0a1e359811322d97991e03f863a0c30c2cf029c",
  //     "makerTokenAmount": FILL_AMOUNT,
  //     "taker": "0x0000000000000000000000000000000000000000",
  //     "takerFee": new BigNumber(0),
  //     "takerTokenAddress": "0x6ff6c0ff1d68b964901f986d4c9fa3ac68346570",
  //     "takerTokenAmount": FILL_AMOUNT,
  //     "expirationUnixTimestampSec": new BigNumber(1517436840),
  //     "feeRecipient": "0x0000000000000000000000000000000000000000",
  //     "salt": "54751811455608010816348406996480374731024727500157605891561219199821423714063",
  //     "ecSignature": {
  //       "v": 27,
  //       "r": "0x58eadc4e7bad41cf2c14d8e94a4ff24df5bb08faae38335323277ef6fc839fca",
  //       "s": "0x3c76e854e6ba433d3d2bfb76a57dd85be5c62d8508ec3d20ea368b044e0a98b6",
  //       "hash": "0xfd1272a6e7692ad5708b73fb180b78619183eda0f597e9453f8bcaa614b60087"
  //     },
  //     "exchangeContractAddress": "0x90fe2af704b34e0224bf2299c838e04d4dcf1364"
  //   }
  //   try {
  //     const TX_HASH = await zeroEx.exchange.fillOrderAsync(SIGNED_ORDER, FILL_AMOUNT, true, TAKER_ADDRESS.toLowerCase());
  //     console.warn(TX_HASH);
  //     console.warn(await zeroEx.awaitTransactionMinedAsync(TX_HASH));
  //   } catch(err) {
  //     console.error(err);
  //   }
  // };

  fillOrder = async () => {
    const { orderHash, ethereum, trade } = this.props;
    const { web3 } = ethereum;
    const { orders } = trade;
    const order = _.find(trade.orders, { orderHash });
    
    let receipt = await fillOrder(web3, order);
    console.warn(receipt);
  };

  render() {
    let { orderHash } = this.props;
    let order = _.find(this.props.trade.orders, { orderHash });
    return (
      <Card title={order.orderHash}>
        <Button
          large
          icon={{ name: "cached" }}
          title="Fill Order"
          onPress={this.fillOrder} />
      </Card>
    );
  }
}
