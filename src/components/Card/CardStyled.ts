import styled from 'styled-components';
import cardBack from '../../assets/cards/backside.png';

interface CardStyledProps {
    highlight?: boolean
    mainPlayerHand?: boolean
    aiHand?: boolean
    isPile?: boolean
    noShadow?: boolean
    isNumeric: boolean;
    hovered: boolean;
}

export const CardStyled = styled.div<Partial<CardStyledProps>>`
  .wrapper {
    position: absolute;
    width: var(--cardWidth);
    height: var(--cardHeight);;
    display: inline-block;
    filter: ${({ highlight, mainPlayerHand }) =>
		highlight || !mainPlayerHand ? 'contrast(1)' : 'contrast(0.5)'};
    cursor: ${({ highlight }) => (highlight ? 'pointer' : 'default')};
    z-index: ${({ isPile, aiHand, highlight }) => (isPile ? '-1' : aiHand ? '1' : highlight ? 'auto' : '0')};
    transition: z-index 0.3s;
  }

  .card-front {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: white;
    border-radius: 13px;
    // remove this??
    box-shadow: ${({ noShadow }) => (noShadow ? 'none' : 'rgb(41, 39, 39) 0px 0px 10px;')};
  }

  .card-value,
  .card-number {
    position: absolute;
    width: 65%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .card-number {
    font-size: 7rem;
    display: flex;
    justify-content: center;
    font-weight: 800;
    text-shadow: black 4px 2px;
    font-family: sans-serif;
  }

  .card-back {
    width: var(--cardWidth);
    height: var(--cardHeight);
    box-shadow: rgb(41, 39, 39) 0px 0px 10px;
    background-image: url(${cardBack});
    background-size: cover;
    border-radius: 8px;
    cursor: pointer;

    position: absolute; 
    top: 0; 
    left: 0; 
  }

  .card-corner {
    position: absolute;
    font-size: 2.8rem;
    font-weight: 800;
    font-family: sans-serif;
    font-style: italic;
    -webkit-text-stroke: 1px black;
  }

  .top-left {
    top: ${({ isNumeric }) => (isNumeric ? '1rem' : '1.4rem')};
    left: ${({ isNumeric }) => (isNumeric ? '1rem' : '0.9rem')};
  }

  .bottom-right {
    bottom: ${({ isNumeric }) => (isNumeric ? '1rem' : '1.4rem')};
    right: ${({ isNumeric }) => (isNumeric ? '1rem' : '0.9rem')};
    transform: rotate(180deg);
  }

  .card-corner-image {
    width: 25%;
  }
`;