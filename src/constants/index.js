export const SupportedNetwork = Object.freeze({
    ETH_MAINNET: 'ETH_MAINNET',
    BSC_MAINNET: 'BSC_MAINNET',
});

export const ChainId = Object.freeze({
    [SupportedNetwork.ETH_MAINNET]: 1,
    [SupportedNetwork.BSC_MAINNET]: 97
});

export const SupportedNetworkForChainId = Object.freeze({
    [ChainId[SupportedNetwork.ETH_MAINNET]]: SupportedNetwork.ETH_MAINNET,
    [ChainId[SupportedNetwork.BSC_MAINNET]]: SupportedNetwork.BSC_MAINNET,
});

export const NATIVE_CURRENCY_SYMBOL = {
    [SupportedNetwork.ETH_MAINNET]: "ETH",
    [SupportedNetwork.BSC_MAINNET]: "BNB",
};

export const timeframeOptions = {
    WEEK: '1 week',
    MONTH: '1 month',
    HALF_YEAR: '6 months',
    ALL_TIME: 'All time',
};

export const TOKEN_BLACKLIST = [
    '0x495c7f3a713870f68f8b418b355c085dfdc412c3',
    '0xc3761eb917cd790b30dad99f6cc5b4ff93c4f9ea',
    '0xe31debd7abff90b06bca21010dd860d8701fd901',
    '0xfc989fbb6b3024de5ca0144dc23c18a063942ac1',
    '0xf4eda77f0b455a12f3eb44f8653835f377e36b76',
    '0x93b2fff814fcaeffb01406e80b4ecd89ca6a021b',
    '0x9ea3b5b4ec044b70375236a281986106457b20ef',
    '0x05934eba98486693aaec2d00b0e9ce918e37dc3f',
    '0x3d7e683fc9c86b4d653c9e47ca12517440fad14e',
    '0xfae9c647ad7d89e738aba720acf09af93dc535f7',
    '0x7296368fe9bcb25d3ecc19af13655b907818cc09',
]