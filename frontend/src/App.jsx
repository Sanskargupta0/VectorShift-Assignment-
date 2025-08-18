import { useState } from 'react';
import { Toaster } from 'sonner';
import { PipelineToolbar, ToolbarToggleButton } from './toolbar';
import { PipelineUI } from './ui';
import { SubmitButton } from './submit';

function App() {
  const [isToolbarVisible, setIsToolbarVisible] = useState(true);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      {/* Toast Container */}
      <Toaster 
        position="top-right" 
        richColors 
        closeButton 
        toastOptions={{
          duration: 4000,
          style: {
            background: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
          }
        }}
      />
      
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 200,
        pointerEvents: 'auto'
      }}>
        <ToolbarToggleButton 
          isVisible={isToolbarVisible} 
          onToggle={() => setIsToolbarVisible(!isToolbarVisible)}
        />
      </div>

      
      <div style={{
        position: 'absolute',
        top: '70px',
        left: 0,
        right: 0,
        zIndex: 100,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        padding: '10px 20px',
        gap: '20px',
        pointerEvents: 'none'
      }}>
        {/* Toolbar on the left */}
        <div style={{ 
          flex: 1, 
          maxWidth: '600px',
          pointerEvents: 'auto' 
        }}>
          <PipelineToolbar isVisible={isToolbarVisible} />
        </div>
        
        
        <div style={{ 
          flexShrink: 0,
          pointerEvents: 'auto' 
        }}>
          <SubmitButton />
        </div>
      </div>
      
    
      <div style={{ 
        width: '100%', 
        height: '100vh',
        paddingTop: '0px' 
      }}>
        <PipelineUI />
      </div>
    </div>
  );
}

export default App;
