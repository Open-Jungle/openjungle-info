import styled from 'styled-components'

export const OptionButton = styled.div`
    font-weight: 500;
    width: fit-content;
    white-space: nowrap;
    padding: 6px;
    border-radius: 6px;
    border: 1px solid ${({ theme }) => theme.bg4};
    background-color: ${({ active, theme }) => active && theme.bg3};
    color: ${({ theme }) => theme.text1};

    :hover {
        cursor: ${({ disabled }) => !disabled && 'pointer'};
    }
`