import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import styled from 'styled-components';

const StyledLink = styled.a`
  text-decoration: none;
`;

const Footer = () => {
  return (
    <footer className="text-muted py-5">
      <div className="container">
        <p className="float-end mb-1">
          <StyledLink href="#">Back to top</StyledLink>
        </p>
        <p className="mb-1">
          Made with ❤️ by
          <StyledLink target="_blank" rel="noreferrer" href="https://github.com/rkhadder">
            {' rkhadder '}
            <FontAwesomeIcon icon={faGithub} fontSize={25} color="#456cd1" />
          </StyledLink>
          {' & '}
          <StyledLink target="_blank" rel="noreferrer" href="https://github.com/ablin42">
            {'0xharb '}
            <FontAwesomeIcon icon={faGithub} fontSize={25} color="#456cd1" />
          </StyledLink>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
