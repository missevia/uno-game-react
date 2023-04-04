import React, { useEffect } from 'react';
import CardComponent from './CardComponent';
import { Card } from '../utils/cardUtils';
import styled from 'styled-components';
import { observer } from 'mobx-react-lite';
import { toJS } from 'mobx';
import { v4 as uuidv4 } from 'uuid';

const AIHandStyled = styled.div`
    .ai-hand {
        display: flex;
    }
`

interface AIHandProps {
  handIndex: number;
  aiHand: Card[];
}

const AIHand: React.FC<AIHandProps> = observer(({ handIndex, aiHand }) => {

   return (
        <>
        <h2>AI Opponent {handIndex + 1} Hand</h2>
        <AIHandStyled>
            <div className={`ai-hand ${handIndex}`}>
                {aiHand.map((card, cardIndex) => (
                    <CardComponent key={uuidv4()} card={card} />
                ))}
            </div>
        </AIHandStyled>
        </>
    )
});

export default AIHand;