import styled from 'styled-components'

export const PageWrapper = styled.div`
    display: flex;
    flex-direction: column;
    padding-top: 36px;
    padding-bottom: 80px;

    @media screen and (max-width: 600px) {
        padding: 0 12px;
    }
`;

export const ContentWrapper = styled.div`
    display: grid;
    justify-content: start;
    align-items: start;
    grid-template-columns: 1fr;
    grid-gap: 24px;
    max-width: 1440px;
    width: 100%;
    margin: 0 auto;
    padding: 0 2rem;
    box-sizing: border-box;
    @media screen and (max-width: 1180px) {
        grid-template-columns: 1fr;
        padding: 0 1rem;
    }
`;