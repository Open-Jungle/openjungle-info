import styled from 'styled-components';
import { Link as RouterLink } from 'react-router-dom';

export const ServiceRouterLink = styled(RouterLink)`
    padding-left: ${({ theme }) => theme.paddings.SideNavLeftPadding};
    text-decoration: none;
    font-size: 18px;
    line-height: 36px;
    font-weight: bold;
    color: ${({ theme }) => theme.colors.lightGray};

    :hover {
        color: ${({ theme }) => theme.colors.lightGrayHover};
    }
`;

export const CustomRouterLink = styled(RouterLink)`
    text-decoration: none;
    font-size: 14px;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.link};

    &:visited {
        color: ${({ theme }) => theme.colors.link};
    }

    &:hover {
        cursor: pointer;
        text-decoration: none;
        underline: none;
        color: ${({ theme }) => theme.colors.link};
    }
`