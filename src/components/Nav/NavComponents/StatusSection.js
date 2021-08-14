import React from 'react';
import styled from 'styled-components';

const StatusSectionWrapper = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    color: ${({ theme }) => theme.colors.lightGray};
`;

const StatusRow = styled.div`
    padding-left: ${({ theme }) => theme.paddings.SideNavLeftPadding};
    font-size: 10px;
`;

const StatusSection = () => {
    return (
        <StatusSectionWrapper>
            <StatusRow>
                Status: LIVE
            </StatusRow>
            <StatusRow>
                Last Update: NEVER
            </StatusRow>
        </StatusSectionWrapper>
    )
}

export default StatusSection
