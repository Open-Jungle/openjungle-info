import React from 'react'
import { useMedia } from 'react-use';
import styled from 'styled-components'

const TitleSectionWrapper = styled.div`
    width: 100%;
`;

const MainTitle = styled.div`
    font-weight: 200;
    font-size: 36px;
    color: ${({ theme }) => theme.colors.lightGray};

    @media screen and (max-width: 768px){
        margin-top: 10px;
        font-size: 22px;
    }
`;

const BoldTitle = styled.div`
    font-weight: bold;
    font-size: 24px;
    margin-top: 20px;
    color: ${({ theme }) => theme.colors.whiteBlack};

    @media screen and (max-width: 768px){
        font-size: 16px;
        margin-top: 7px;
    }
`;

const Subtitle = styled.div`
    font-weight: bold;
    font-size: 12px;
    margin-top: 20px;
    color: ${({ theme }) => theme.colors.mainColor};

    @media screen and (max-width: 768px){
        font-size: 10px;
        margin-top: 7px;
    }
`;

const Spliter = styled.div`
    height: 2px;
    width: 90%;
    margin: auto;
    background: ${({ theme }) => theme.colors.lightGray};
    margin-top: 20px;

    @media screen and (max-width: 768px){
        margin-top: 7px;
    }
`;



const TitleSection = () => {

    const below1080 = useMedia('(max-width: 768px)');

    return (
        <TitleSectionWrapper>
            <MainTitle>Your portal to decentralization</MainTitle>
            <BoldTitle>{below1080 ? 'We bring the top projects to you' : 'We track the top projects in DeFi and bring them to you'}</BoldTitle>
            <Subtitle>{below1080 ? 'Use the Open Jungle to never miss an opportinity' : 'Use the Open Jungle platform to never miss an opportinity in the world of DeFi'}</Subtitle>
            <Spliter />
        </TitleSectionWrapper>
    )
}

export default TitleSection
