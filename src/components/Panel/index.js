import { Box as RebassBox } from 'rebass'
import styled, { css } from 'styled-components'

const panelPseudo = css`
    :after {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        height: 10px;
    }

    @media only screen and (min-width: 40em) {
        :after { content: unset; }
    }
`;

const Panel = styled(RebassBox)`
    position: relative;
    background-color: ${({ theme }) => theme.advancedBG};
    padding: 1.25rem;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    border-radius: 8px;
    border: 1px solid ${({ theme }) => theme.bg3};
    box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.01), 0px 16px 24px rgba(0, 0, 0, 0.01), 0px 24px 32px rgba(0, 0, 0, 0.01);
    
    :hover {
        cursor: ${({ hover }) => hover && 'pointer'};
        border: ${({ hover, theme }) => hover && '1px solid' + theme.bg5};
    }

    ${(props) => props.background && `background-color: ${props.theme.advancedBG};`}

    ${(props) => (props.area ? `grid-area: ${props.area};` : null)}

    ${(props) => props.grouped && css`
        @media only screen and (min-width: 40em) {
            &:first-of-type { border-radius: 20px 20px 0 0; }
            &:last-of-type { border-radius: 0 0 20px 20px; }
        }
    `}

    ${(props) => props.rounded && css`
        border-radius: 8px;
        @media only screen and (min-width: 40em) {
            border-radius: 10px;
        }
    `};

    ${(props) => !props.last && panelPseudo}
`;

export default Panel