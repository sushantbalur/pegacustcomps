import styled, { css } from 'styled-components';

// Podium order: 2nd on the left, 1st in the center, 3rd on the right.
// The DOM stays in rank order (1, 2, 3) so screen readers and narrow layouts follow rank.
const desktopOrder = { 1: 2, 2: 1, 3: 3 } as const;
const stepHeight = { 1: '9rem', 2: '6.5rem', 3: '4.5rem' } as const;

type Rank = 1 | 2 | 3;

export default styled.div(() => {
  return css`
    container-type: inline-size;
  `;
});

export const StyledPodium = styled.ol(() => {
  return css`
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    align-items: end;
    gap: 0.5rem;
    list-style: none;
    margin: 0;
    padding: 0;

    @container (max-width: 30rem) {
      grid-template-columns: minmax(0, 1fr);
    }
  `;
});

export const StyledPodiumPlace = styled.li<{ $rank: Rank }>(({ $rank }) => {
  return css`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    min-width: 0;
    text-align: center;
    overflow-wrap: anywhere;
    order: ${desktopOrder[$rank]};

    @container (max-width: 30rem) {
      order: ${$rank};
    }
  `;
});

export const StyledStep = styled.div<{ $rank: Rank; $accent: string; $background: string }>(
  ({ $rank, $accent, $background }) => {
    return css`
      display: flex;
      align-items: center;
      justify-content: center;
      height: ${stepHeight[$rank]};
      background: ${$background};
      border-top: 0.25rem solid ${$accent};
      border-radius: 0.25rem 0.25rem 0 0;

      @container (max-width: 30rem) {
        height: 3rem;
      }
    `;
  }
);
