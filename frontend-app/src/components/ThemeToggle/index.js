import React from 'react'
import styled from 'styled-components'

// assets
import { BiSun } from 'react-icons/bi'
import { BiMoon } from 'react-icons/bi'

const ThemeToggleWrapper = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-around;
    color: ${({ theme }) => theme.colors.mainColor}
`;


const ThemeToggle = () => {

    //const [isLightTheme, toggleIsLightTheme] = useDarkModeManager()
    
    return (
        <ThemeToggleWrapper>
            <BiSun />
            <BiMoon />
        </ThemeToggleWrapper>
    )
}

export default ThemeToggle;
