import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const NavigationManager = () => {
  const { pathname, hash } = useLocation();
  
  useEffect(() => {
    // If there is no hash, scroll to top on every route change
    if (!hash) {
      window.scrollTo({
        top: 0,
        behavior: 'instant'
      });
    } else {
      // If there IS a hash, find the element and scroll to it
      // Use a small timeout to ensure the DOM is ready (especially for lazy loaded components)
      const id = hash.replace('#', '');
      const element = document.getElementById(id);
      
      if (element) {
        // smooth scroll to the element with an offset for the floating navbar
        const offset = 100; // floating nav height approximation
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = element.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      } else {
        // If element not found immediately, retry after a short delay
        setTimeout(() => {
          const retryElement = document.getElementById(id);
          if (retryElement) {
             const offset = 100;
             const bodyRect = document.body.getBoundingClientRect().top;
             const elementRect = retryElement.getBoundingClientRect().top;
             const elementPosition = elementRect - bodyRect;
             const offsetPosition = elementPosition - offset;

             window.scrollTo({
               top: offsetPosition,
               behavior: 'smooth'
             });
          }
        }, 300);
      }
    }
  }, [pathname, hash]);

  return null;
};

export default NavigationManager;
