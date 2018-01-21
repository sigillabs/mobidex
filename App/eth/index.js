// import client from "./client";
// import ContractDefinitionLoader from "./ContractDefinitionLoader";
// import ContractDefinitions from "./ContractDefinitions";
// import config from "../config";

// const web3 = client();
// const Contracts = ContractDefinitionLoader({
//   web3: web3,
//   contractDefinitions: ContractDefinitions,
//   options: config.get("web3")
// });

// export { web3, ContractDefinitions, Contracts };

import getClient from "web3-contracts-loader";

const web3 = getClient();

export { web3 };
