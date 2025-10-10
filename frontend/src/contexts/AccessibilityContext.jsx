import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';

const AccessibilityContext = createContext();

export const AccessibilityProvider = ({ children }) => {
  // Carrega as configurações do localStorage ou usa valores padrão
  const loadSetting = (key, defaultValue) => {
    if (typeof window === 'undefined') return defaultValue;
    try {
      const saved = localStorage.getItem(`accessibility_${key}`);
      return saved !== null ? JSON.parse(saved) : defaultValue;
    } catch (error) {
      console.error(`Erro ao carregar configuração ${key}:`, error);
      return defaultValue;
    }
  };

  // Estados para as configurações de acessibilidade
  const [fontScale, setFontScale] = useState(() => loadSetting('fontScale', 100));
  const [highContrast, setHighContrast] = useState(() => loadSetting('highContrast', false));
  const [darkMode, setDarkMode] = useState(() => loadSetting('darkMode', false));
  const [lineHeight, setLineHeight] = useState(() => loadSetting('lineHeight', 1.5));
  const [letterSpacing, setLetterSpacing] = useState(() => loadSetting('letterSpacing', 1));
  const [screenReaderEnabled, setScreenReaderEnabled] = useState(() => 
    loadSetting('screenReaderEnabled', false)
  );
  const [listening, setListening] = useState(false);
  const [voiceCommands, setVoiceCommands] = useState([]);
  const [lastCommand, setLastCommand] = useState('');
  
  // Salva uma configuração no localStorage
  const saveSetting = useCallback((key, value) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(`accessibility_${key}`, JSON.stringify(value));
      } catch (error) {
        console.error(`Erro ao salvar configuração ${key}:`, error);
      }
    }
  }, []);

  // Aplica as configurações de acessibilidade na inicialização
  useEffect(() => {
    // Aplica o tema escuro/claro
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    
    // Aplica o contraste alto
    if (highContrast) {
      document.documentElement.setAttribute('data-high-contrast', 'true');
    } else {
      document.documentElement.removeAttribute('data-high-contrast');
    }
    
    // Aplica o leitor de tela
    if (screenReaderEnabled) {
      document.body.setAttribute('role', 'document');
      document.body.setAttribute('aria-live', 'polite');
      document.body.setAttribute('aria-atomic', 'true');
    } else {
      document.body.removeAttribute('role');
      document.body.removeAttribute('aria-live');
      document.body.removeAttribute('aria-atomic');
    }
    
    // Aplica os estilos de fonte e espaçamento
    document.documentElement.style.setProperty('--font-scale', `${fontScale}%`);
    document.body.style.fontSize = `${fontScale}%`;
    document.documentElement.style.setProperty('--line-height', lineHeight);
    document.body.style.lineHeight = lineHeight;
    document.documentElement.style.setProperty('--letter-spacing', `${letterSpacing}px`);
    document.body.style.letterSpacing = `${letterSpacing}px`;
  }, [darkMode, highContrast, screenReaderEnabled, fontScale, lineHeight, letterSpacing]);

  // Salva as configurações no localStorage sempre que mudarem
  useEffect(() => {
    saveSetting('fontScale', fontScale);
    document.documentElement.style.setProperty('--font-scale', `${fontScale}%`);
    document.body.style.fontSize = `${fontScale}%`;
  }, [fontScale, saveSetting]);

  useEffect(() => {
    saveSetting('highContrast', highContrast);
    if (highContrast) {
      document.documentElement.setAttribute('data-high-contrast', 'true');
    } else {
      document.documentElement.removeAttribute('data-high-contrast');
    }
  }, [highContrast, saveSetting]);

  useEffect(() => {
    saveSetting('darkMode', darkMode);
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode, saveSetting]);

  useEffect(() => {
    saveSetting('lineHeight', lineHeight);
    document.documentElement.style.setProperty('--line-height', lineHeight);
    document.body.style.lineHeight = lineHeight;
  }, [lineHeight, saveSetting]);

  useEffect(() => {
    saveSetting('letterSpacing', letterSpacing);
    document.documentElement.style.setProperty('--letter-spacing', `${letterSpacing}px`);
    document.body.style.letterSpacing = `${letterSpacing}px`;
  }, [letterSpacing, saveSetting]);

  useEffect(() => {
    saveSetting('screenReaderEnabled', screenReaderEnabled);
    if (screenReaderEnabled) {
      document.body.setAttribute('role', 'document');
      document.body.setAttribute('aria-live', 'polite');
      document.body.setAttribute('aria-atomic', 'true');
    } else {
      document.body.removeAttribute('role');
      document.body.removeAttribute('aria-live');
      document.body.removeAttribute('aria-atomic');
    }
  }, [screenReaderEnabled, saveSetting]);

  // Funções auxiliares
  const toggleDarkMode = useCallback(() => {
    setDarkMode(prev => !prev);
  }, [setDarkMode]);
  
  const toggleHighContrast = useCallback(() => {
    setHighContrast(prev => !prev);
  }, [setHighContrast]);
  
  // Toggle screen reader
  const toggleScreenReader = useCallback(() => {
    const newState = !screenReaderEnabled;
    setScreenReaderEnabled(newState);
    
    // Create or update ARIA live region for screen reader announcements
    let liveRegion = document.getElementById('a11y-announcement');
    
    if (!liveRegion) {
      liveRegion = document.createElement('div');
      liveRegion.id = 'a11y-announcement';
      liveRegion.setAttribute('role', 'status');
      liveRegion.setAttribute('aria-live', 'polite');
      liveRegion.setAttribute('aria-atomic', 'true');
      liveRegion.style.cssText = `
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border-width: 0;
      `;
      document.body.appendChild(liveRegion);
    }
    
    // Announce the new state
    liveRegion.textContent = newState ? 'Leitor de tela ativado. Use as teclas de seta para navegar e Enter para ativar itens.' : 'Leitor de tela desativado';
    
    // Add/remove screen reader specific classes and attributes
    if (newState) {
      document.body.classList.add('screen-reader-active');
      document.documentElement.setAttribute('data-screen-reader', 'active');
      
      // Add keyboard event listeners for screen reader navigation
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          toggleScreenReader();
        }
        
        // Skip if the event is already handled or if it's a key we don't care about
        if (e.defaultPrevented || !['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter', ' '].includes(e.key)) {
          return;
        }
        
        // Get all focusable elements
        const focusableElements = Array.from(document.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )).filter(el => {
          return !el.hasAttribute('disabled') && 
                 !el.getAttribute('aria-hidden') &&
                 el.offsetParent !== null;
        });
        
        const currentIndex = focusableElements.indexOf(document.activeElement);
        let nextIndex = currentIndex;
        
        switch (e.key) {
          case 'ArrowDown':
          case 'ArrowRight':
            e.preventDefault();
            nextIndex = currentIndex < focusableElements.length - 1 ? currentIndex + 1 : 0;
            break;
          case 'ArrowUp':
          case 'ArrowLeft':
            e.preventDefault();
            nextIndex = currentIndex > 0 ? currentIndex - 1 : focusableElements.length - 1;
            break;
          case ' ':
          case 'Enter':
            if (document.activeElement) {
              e.preventDefault();
              document.activeElement.click();
            }
            return;
          default:
            return;
        }
        
        if (focusableElements[nextIndex]) {
          focusableElements[nextIndex].focus();
          // Announce the focused element
          const label = focusableElements[nextIndex].getAttribute('aria-label') || 
                       focusableElements[nextIndex].textContent.trim() || 
                       focusableElements[nextIndex].tagName.toLowerCase();
          liveRegion.textContent = label;
        }
      };
      
      document.addEventListener('keydown', handleKeyDown, true);
      
      // Focus the first focusable element when screen reader is activated
      setTimeout(() => {
        const firstFocusable = document.querySelector(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (firstFocusable) {
          firstFocusable.focus();
          const label = firstFocusable.getAttribute('aria-label') || 
                       firstFocusable.textContent.trim() || 
                       firstFocusable.tagName.toLowerCase();
          liveRegion.textContent = `Navegação ativada. ${label} está em foco.`;
        }
      }, 100);
      
      return () => {
        document.removeEventListener('keydown', handleKeyDown, true);
        document.body.classList.remove('screen-reader-active');
        document.documentElement.removeAttribute('data-screen-reader');
      };
    } else {
      document.body.classList.remove('screen-reader-active');
      document.documentElement.removeAttribute('data-screen-reader');
    }
  }, [screenReaderEnabled, setScreenReaderEnabled]);
  
  // Função para redefinir todas as configurações de acessibilidade
  const resetAccessibilitySettings = useCallback(() => {
    setFontScale(100);
    setHighContrast(false);
    setLineHeight(1.5);
    setLetterSpacing(1);
    setScreenReaderEnabled(false);
    setListening(false);
    setVoiceCommands([]);
    setLastCommand('');
  }, [
    setFontScale, 
    setHighContrast, 
    setDarkMode, 
    setLineHeight, 
    setLetterSpacing, 
    setScreenReaderEnabled, 
    setListening, 
    setVoiceCommands, 
    setLastCommand
  ]);

  // Valor do contexto
  const value = {
    // Estados
    fontScale,
    highContrast,
    darkMode,
    lineHeight,
    letterSpacing,
    screenReaderEnabled,
    listening,
    voiceCommands,
    lastCommand,

    // Setters
    setFontScale,
    setHighContrast,
    setDarkMode,
    setLineHeight,
    setLetterSpacing,
    setScreenReaderEnabled,
    setListening,
    setVoiceCommands,
    setLastCommand,

    // Funções auxiliares
    toggleDarkMode,
    toggleHighContrast,
    toggleScreenReader,
    resetAccessibilitySettings
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
};

// Hook personalizado para usar o contexto
export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility deve ser usado dentro de um AccessibilityProvider');
  }
  return context;
};

export default AccessibilityContext;
