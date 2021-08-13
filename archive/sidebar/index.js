import React from 'react';
import styled from 'styled-components';

const SidebarWrapper = styled.div`

`;


const Sidebar = ({ toggleLightTheme, toggleChain }) => {
    return (
        <div>
            <button onClick={toggleLightTheme}>Do the funny thing</button>
            <button onClick={toggleChain}>Do the difficult thing</button>
        </div>
    )
}

export default Sidebar
