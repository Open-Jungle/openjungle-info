import React from 'react';
import styled from 'styled-components';

// react-icons at https://react-icons.github.io/react-icons
import { FaDiscord, FaTelegram, FaGithub } from 'react-icons/fa';
import { GiTwoCoins } from 'react-icons/gi';

const SocialLinksWrapper = styled.div`
    display: flex;
    justify-content: space-around;
    
`;

const Link = styled.a`
    color: ${({ theme }) => theme.colors.mainColor};
    
    :hover {
        color: ${({ theme }) => theme.colors.mainHoverColor};
    }
`;

const SocialLinks = () => {
    return (
        <SocialLinksWrapper>
            <Link href={'https://discord.gg/9wuRTJYvNv'} target={'_blank'} rel={'noopener noreferrer'}>
                <FaDiscord />
            </Link>
            <Link href={'https://t.me/JungleexJoinTeam'} target={'_blank'} rel={'noopener noreferrer'}>
                <FaTelegram />
            </Link>
            <Link href={'https://github.com/FredCoteMtl/jungleex-teamtoken'} target={'_blank'} rel={'noopener noreferrer'}>
                <FaGithub />
            </Link>
            <Link href={'https://jungle-team.netlify.app/'} target={'_blank'} rel={'noopener noreferrer'}>
                <GiTwoCoins />
            </Link>
        </SocialLinksWrapper>
    )
}

export default SocialLinks
