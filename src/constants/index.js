export const SupportedNetwork = Object.freeze({
    ETH_MAINNET: 'ETH_MAINNET',
    XDAI: 'XDAI',
    MATIC: 'MATIC',
    BSC_MAINNET: 'BSC_MAINNET',
});

export const ChainId = Object.freeze({
    [SupportedNetwork.ETH_MAINNET]: 1,
    [SupportedNetwork.XDAI]: 100,
    [SupportedNetwork.MATIC]: 137,
    [SupportedNetwork.BSC_MAINNET]: 97
});

export const SupportedNetworkForChainId = Object.freeze({
    [ChainId[SupportedNetwork.ETH_MAINNET]]: SupportedNetwork.ETH_MAINNET,
    [ChainId[SupportedNetwork.XDAI]]: SupportedNetwork.XDAI,
    [ChainId[SupportedNetwork.MATIC]]: SupportedNetwork.MATIC,
    [ChainId[SupportedNetwork.BSC_MAINNET]]: SupportedNetwork.BSC_MAINNET,
});

export const NATIVE_CURRENCY_SYMBOL = {
    [SupportedNetwork.ETH_MAINNET]: "ETH",
    [SupportedNetwork.XDAI]: "xDAI",
    [SupportedNetwork.MATIC]: "MATIC",
    [SupportedNetwork.BSC_MAINNET]: "BSC",
};