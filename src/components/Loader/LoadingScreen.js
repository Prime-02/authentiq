import React from 'react';
import styled, { keyframes } from 'styled-components';

const Wrapper = styled.div`
  text-align: center;
  font-family: "Gill sans", sans-serif;
  width: 80%;
`;

const LoaderContainer = styled.div`
  height: 100px;
  width: 20%;
  text-align: center;
  padding: 1em;
  display: inline-block;
  vertical-align: top;
`;

const fillColor = '#1e293b';

const scaleAnimation = keyframes`
  0% { transform: scale(1, 1); }
  50% { transform: scale(1, 3); }
  100% { transform: scale(1, 1); }
`;

const Bar = styled.rect`
  fill: ${fillColor};
  animation: ${scaleAnimation} 0.6s ease-in-out infinite;
`;

const FirstBar = styled(Bar)`
  animation-delay: 0s;
`;

const SecondBar = styled(Bar)`
  animation-delay: 0.2s;
`;

const ThirdBar = styled(Bar)`
  animation-delay: 0.4s;
`;
const ForthBar = styled(Bar)`
  animation-delay: 0.6s;
`;
const FifthBar = styled(Bar)`
  animation-delay: 0.8s;
`;

export default function LoadingScreen() {
  return (
    <Wrapper>
      <LoaderContainer title="3">
        <svg
          version="1.1"
          id="Layer_1"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          x="0px"
          y="0px"
          width="24px"
          height="24px"
          viewBox="0 0 24 24"
          style={{ enableBackground: 'new 0 0 50 50' }}
          xmlSpace="preserve"
        >
          <FirstBar x="0" y="0" width="4" height="7" />
          <SecondBar x="10" y="0" width="4" height="7" />
          <ThirdBar x="20" y="0" width="4" height="7" />
          <ForthBar x="30" y="0" width="4" height="7" />
          <FifthBar x="40" y="0" width="4" height="7" />
        </svg>
      </LoaderContainer>
    </Wrapper>
  );
}
