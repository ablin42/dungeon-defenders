import React from 'react';
import { Link } from 'react-router-dom';

const TakeMeHome = () => (
  <Link to="/">
    <button className="btn btn-primary btn-lg mb-4">Take Me Home</button>
  </Link>
);

export default TakeMeHome;
