// *EXTERNALS*
import React from 'react';
import styled from 'styled-components';

const StyledBtn = styled.button<BtnProps>`
  width: ${({ width }) => (width ? width : 'initial')};
`;

interface BtnProps extends React.ComponentProps<'button'> {
  btnType?: string;
  width?: string;
  size?: 'sm' | 'md' | 'lg';
  children?: React.ReactNode;
}

const Button: React.FunctionComponent<BtnProps> = ({ btnType = 'primary', size = 'lg', width, children }) => {
  return (
    <StyledBtn className={`btn btn-${size} btn-${btnType}`} width={width}>
      {children}
    </StyledBtn>
  );
};

export default Button;
