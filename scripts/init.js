(function () {
  'use strict';
  const theme = localStorage.getItem('nhood-theme') || 'dark';
  if (theme === 'light') {
    document.documentElement.classList.add('nh-light');
  } else {
    document.documentElement.classList.remove('nh-light');
  }
})();
