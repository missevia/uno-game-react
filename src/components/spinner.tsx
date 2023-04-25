import React from 'react'; 
import styled from 'styled-components';

const StyledSpinner = styled.div`
    height: 120px;
    width: 120px;
    border: 6px solid;
    border-color: white transparent white transparent;
    border-radius: 50%;
    animation: spin 1.3s linear infinite;
    /* position: absolute; */

    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }
`;

const Spinner = () => {
	return (
		<StyledSpinner />
	);
};

export default Spinner;