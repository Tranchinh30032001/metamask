interface Window {
  // pick one
  ethereum: EthereumProvider;
  // ethereum: ExternalProvider
  // ethereum: AbstractProvider
}

// ExternalProvider seems to be the official ethersproject type for the window.ethereum object, however, `new Web3(ethereum)` does not like it so we must improvise.
declare type ExternalProvider =
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  import("@ethersproject/providers").ExternalProvider;
declare type AbstractProvider =
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  import("web3/node_modules/web3-core/types").AbstractProvider;
interface EthereumProvider extends ExternalProvider {
  _state: any;
  sendAsync: AbstractProvider["sendAsync"];
}
