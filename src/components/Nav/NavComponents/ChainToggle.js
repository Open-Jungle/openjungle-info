import React from 'react';
import styled from 'styled-components';

// contexts
import { useSelectedNetwork } from '../../../contexts/Network'

// constants
import { SupportedNetwork } from '../../../constants'

// Network keys
const ETH_MAINNET = SupportedNetwork.ETH_MAINNET
const BSC_MAINNET = SupportedNetwork.BSC_MAINNET

const ChainToggleWrapper = styled.div`
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    color: ${({ theme }) => theme.colors.mainColor};
    font-size: 12px;
`;

const ToggleButton = styled.div`
    width: 50%;
    max-width: 150px;
    margin: auto;
    text-align: center;
    padding: 10px;
    border: 1px solid ${({ theme }) => theme.colors.mainColor};
    cursor: pointer;

    :hover {
        border: 3px solid ${({ theme }) => theme.colors.mainHoverColor};
        color: ${({ theme }) => theme.colors.mainHoverColor};
    }
`;

const ChainToggle = () => {

    const [ selectedNetwork , { updateSelectedNetwork }] = useSelectedNetwork()

    const handleNetworkChange = e => {
        e.preventDefault();
        updateSelectedNetwork(selectedNetwork === ETH_MAINNET ? BSC_MAINNET : ETH_MAINNET)
    }

    return (
        <ChainToggleWrapper>
            <ToggleButton onClick={handleNetworkChange}>
                Toggle Chain
            </ToggleButton>
        </ChainToggleWrapper>
    )
}

export default ChainToggle
