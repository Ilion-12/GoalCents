const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                    window.navigator.standalone || 
                    document.referrer.includes('android-app://');

const hasSeenSplash = sessionStorage.getItem('splashShown');

const shouldShowSplash = isStandalone && !hasSeenSplash;

if (shouldShowSplash) {
  const splashScreen = document.getElementById('splash-screen');
  if (splashScreen) {
    splashScreen.classList.add('show');
    sessionStorage.setItem('splashShown', 'true');
    
    window.addEventListener('load', () => {
      setTimeout(() => {
        splashScreen.classList.add('fade-out');
        setTimeout(() => {
          splashScreen.style.display = 'none';
        }, 500);
      }, 1500);
    });
  }
}
