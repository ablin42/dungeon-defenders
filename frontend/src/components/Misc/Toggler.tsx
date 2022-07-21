import React, { useState, useEffect } from 'react';
import '../../index.css';

function Toggler() {
  const [state, setState] = useState({ isDarkMode: false });

  useEffect(() => {
    const darkThemeSelected =
      localStorage.getItem('themeSwitch') !== null && localStorage.getItem('themeSwitch') === 'dark';
    const checkbox = document.querySelector('input[name=theme]') as HTMLInputElement;
    if (checkbox) checkbox.checked = darkThemeSelected;

    darkThemeSelected
      ? document.documentElement.setAttribute('data-theme', 'dark')
      : document.documentElement.removeAttribute('data-theme');
  });

  const transitionTheme = () => {
    document.documentElement.classList.add('transition');
    window.setTimeout(() => {
      document.documentElement.classList.remove('transition');
    }, 750);
  };

  function handleToggler() {
    setState({ isDarkMode: !state.isDarkMode });

    if (state.isDarkMode) {
      transitionTheme();
      localStorage.setItem('themeSwitch', 'dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      transitionTheme();
      localStorage.removeItem('themeSwitch');
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }

  return (
    <div className="toggle-container">
      <input onChange={handleToggler} type="checkbox" id="toggler" name="theme" />
      <label htmlFor="toggler">Toggle</label>
    </div>
  );
}

export default Toggler;
