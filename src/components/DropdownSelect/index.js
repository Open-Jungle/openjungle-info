import React, { useState } from 'react'
import styled from 'styled-components'

import Row, { RowBetween } from '../Rows'
import { AutoColumn } from '../Column'
import { ChevronDown as Arrow } from 'react-feather'
import { StyledIcon } from '..'

const Wrapper = styled.div`
    position: relative;
    background-color: ${({ theme }) => theme.panelColor};
    border: 1px solid ${({ open, color }) => (open ? color : 'rgba(0, 0, 0, 0.15);')} 
    width: 100px;
    padding: 4px 10px;
    padding-right: 6px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;

    :hover {
        cursor: pointer;
    }
`;

const Dropdown = styled.div`
    position: absolute;
    top: 34px;
    padding-top: 40px;
    width: calc(100% - 40px);
    background-color: ${({ theme }) => theme.bg1};
    border: 1px solid rgba(0, 0, 0, 0.15);
    padding: 10px 10px;
    border-radius: 8px;
    width: calc(100% - 20px);
    font-weight: 500;
    font-size: 1rem;
    color: black;
    
    :hover {
        cursor: pointer;
    }
`;

const ArrowStyled = styled(Arrow)`
    height: 20px;
    width: 20px;
    margin-left: 6px;
`;

const ActiveText = styled.div`
    font-weight: 500;
    font-size: 14px;
    color: ${({ theme }) => theme.text1};
`;

const OptionText = styled.div`
    font-weight: 400;
    font-size: 14px;
    color: ${({ theme }) => theme.colors.mainColor}
`;

const DropdownSelect = ({ options, active, setActive, color }) => {
    const [showDropdown, toggleDropdown] = useState(false)

    return (
        <Wrapper open={showDropdown} color={color}>
            <RowBetween onClick={() => toggleDropdown(!showDropdown)} justify="center">
                <ActiveText>{active}</ActiveText>
                <StyledIcon>
                    <ArrowStyled />
                </StyledIcon>
            </RowBetween>
            
            {showDropdown && (
                <Dropdown>
                    <AutoColumn gap="20px">
                        {Object.keys(options).map((key, index) => {
                            let option = options[key]
                            return (
                                option !== active && (
                                    <Row
                                        onClick={() => {
                                            toggleDropdown(!showDropdown)
                                            setActive(option)
                                        }}
                                        key={index}
                                    >
                                        <OptionText fontSize={14}>{option}</OptionText>
                                    </Row>
                                )
                            )
                        })}
                    </AutoColumn>
                </Dropdown>
            )}
        </Wrapper>
    )
}

export default DropdownSelect