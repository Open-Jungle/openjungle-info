// react basic import 
import React from 'react';
import styled from 'styled-components';

// context Providers
import { useDarkModeManager } from '../../../contexts/LocalStorage'

// assets
import { BiSun } from 'react-icons/bi';
import { BiMoon } from 'react-icons/bi';

const ThemeToggleWrapper = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-around;

`;

const Button = styled.div`
    color: ${({ theme }) => theme.colors.mainColor};
    cursor: pointer;

    :hover {
        color: ${({ theme }) => theme.colors.mainHoverColor};
    }
`;


const ThemeToggle = () => {

    const [ , toggleDarkMode] = useDarkModeManager();
    
    return (
        <ThemeToggleWrapper>
            <Button onClick={toggleDarkMode} >
                <BiSun />
            </Button>
            <Button onClick={toggleDarkMode} >
                <BiMoon />
            </Button>
        </ThemeToggleWrapper>
    )
}

export default ThemeToggle;
