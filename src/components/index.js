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

export const Panel = styled.div`
    width: 100%;
    height: 100%;
    minHeight: 300px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    border-radius: 12px;
    background-color: ${({ theme }) => theme.advancedBG};
    padding: 1.25rem;
    box-sizing: border-box;
    box-shadow: 0 1.1px 2.8px -9px rgba(0, 0, 0, 0.008), 0 2.7px 6.7px -9px rgba(0, 0, 0, 0.012),
                0 5px 12.6px -9px rgba(0, 0, 0, 0.015), 0 8.9px 22.6px -9px rgba(0, 0, 0, 0.018),
                0 16.7px 42.2px -9px rgba(0, 0, 0, 0.022), 0 40px 101px -9px rgba(0, 0, 0, 0.03);
`;