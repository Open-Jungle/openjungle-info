import React from 'react';
import styled from 'styled-components';

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

    return (
        <ChainToggleWrapper>
            <ToggleButton>
                Toggle Chain
            </ToggleButton>
        </ChainToggleWrapper>
    )
}

export default ChainToggle
