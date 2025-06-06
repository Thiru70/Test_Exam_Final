import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import imgback from '../../Asstes/Images/img_backgroundcomplete.svg';
import imageScreen from '../../Asstes/Images/img_screen.svg';
import imgVector from '../../Asstes/Images/img_vector.svg';
import imageCharecter from '../../Asstes/Images/img_character.svg';
import imageBubble from '../../Asstes/Images/img_speechbubble.png';
import imgGif from '../../Asstes/Images/img_gif.gif';

const TestCompletionPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const exitFullScreen = () => {
      const exitMethods = [
        'exitFullscreen',
        'webkitExitFullscreen', 
        'mozCancelFullScreen', 
        'msExitFullscreen'
      ];
      
  
      const exitMethod = exitMethods.find(method => document[method]);
      if (exitMethod) {
        document[exitMethod]();
      }
    };

   
    exitFullScreen();

    
    const resetBodyStyles = () => {
      Object.assign(document.body.style, { 
        userSelect: '', 
        webkitUserSelect: '', 
        mozUserSelect: '', 
        msUserSelect: '' 
      });
    };

    resetBodyStyles();

    
    const preventBackNavigation = () => {
      
      window.history.replaceState(null, '', window.location.href);
      
      
      for(let i = 0; i < 3; i++) {
        window.history.pushState(null, '', window.location.href);
      }
      
     const handlePopState = (event) => {
  event.preventDefault();
  event.stopPropagation();
  
  // Stay on the same page
  window.history.pushState(null, '', window.location.href);
  
  // Show user message
  alert('Test completed successfully! Please close this tab or navigate using the menu.');
};

      const handleBeforeUnload = (event) => {
       
        event.preventDefault();
        event.returnValue = 'Test completed successfully!';
        return event.returnValue;
      };

      window.addEventListener('popstate', handlePopState, true);
      window.addEventListener('beforeunload', handleBeforeUnload);

      // Cleanup function
      return () => {
        window.removeEventListener('popstate', handlePopState, true);
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    };

    const cleanupBackNavigation = preventBackNavigation();

    // Return cleanup function
    return () => {
      if (cleanupBackNavigation) {
        cleanupBackNavigation();
      }
    };
  }, [navigate]);

  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden">
      {/* Header */}
      <div className="w-full h-[80px] bg-[#14a7dc] flex-shrink-0">
        <h1 className="text-[28px] font-semibold text-white font-poppins leading-[42px] ml-[60px] mt-[19px]">
          Aptitude test
        </h1>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-4">
        <h2 className="text-[48px] font-bold text-black font-syne leading-[58px] text-center capitalize">
          Thanks For Participating
        </h2>
        
        <h3 className="text-[24px] font-medium text-black font-syne leading-[29px] text-center capitalize mt-[15px]">
          Your Test has completed !
        </h3>
        
        {/* Illustration */}
        <div className="relative mt-[20px] h-[280px] w-[390px] flex-shrink-0">
          {/* Background elements */}
          <img 
            src={imgback}
            alt="Background" 
            className="absolute left-[70px] top-[24px] w-[246px] h-[202px]"
          />
          <img 
            src={imageScreen}
            alt="Screen" 
            className="absolute left-[98px] top-[50px] w-[144px] h-[145px]"
          />
          <img 
            src={imgVector}
            alt="Vector" 
            className="absolute left-[70px] top-[248px] w-[244px]"
          />
          
          {/* Character */}
          <img 
            src={imageCharecter}
            alt="Character" 
            className="absolute left-[98px] top-[96px] w-[174px] h-[206px]"
          />
          
          {/* Speech bubble */}
          <img 
            src={imageBubble}
            alt="Speech bubble" 
            className="absolute left-[269px] top-[56px] w-[41px] h-[48px]"
          />
          
          {/* GIF Animation */}
          <img 
            src={imgGif}
            alt="Animation" 
            className="absolute left-[0px] top-[0px] w-[390px] h-[280px] object-contain"
          />
        </div>
        
        <p className="text-[16px] font-normal text-black font-montserrat leading-[19px] text-center mt-[15px]">
          You will be notified when you test results were released
        </p>
      </div>
    </div>
  );
};

export default TestCompletionPage;