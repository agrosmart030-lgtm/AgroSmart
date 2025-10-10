import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { 
  FaUniversalAccess, 
  FaMicrophone,
  FaMicrophoneSlash,
  FaTextHeight,
  FaMoon,
  FaSun,
  FaInfoCircle,
  FaShieldAlt
} from "react-icons/fa";
import { MdOutlineContrast } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import TwoFactorAuth from './TwoFactorAuth';
import { useAuth } from "../hooks/context/AuthContext";
import { useAccessibility } from "../contexts/AccessibilityContext";

// Componente de item do menu de acessibilidade
const AccessibilityMenuItem = ({ 
  icon: Icon, 
  label, 
  onClick, 
  isActive = false,
  ariaLabel,
  shortcut = null
}) => (
  <motion.button
    whileHover={{ scale: 1.03, backgroundColor: isActive ? "#e0f7fa" : "#f5f5f5" }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    style={{
      borderBottom: isActive ? '2px solid #007acc' : '2px solid transparent',
      padding: '10px',
      borderRadius: '6px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      textAlign: 'left',
      width: '100%',
      fontSize: '14px',
      color: isActive ? '#007acc' : '#333',
      transition: 'all 0.2s ease',
    }}
    aria-label={ariaLabel || label}
    aria-pressed={isActive}
    title={shortcut ? `${label} (${shortcut})` : label}
  >
    <Icon style={{ flexShrink: 0 }} />
    <span style={{ flex: 1 }}>{label}</span>
    {shortcut && (
      <span style={{
        background: 'rgba(0,0,0,0.1)',
        padding: '2px 6px',
        borderRadius: '4px',
        fontSize: '12px',
        fontFamily: 'monospace',
        display: 'inline-block',
        lineHeight: '1.2'
      }}>
        {shortcut}
      </span>
    )}
  </motion.button>
);

// Componente de controle deslizante
const SliderControl = ({ 
  label, 
  value, 
  min, 
  max, 
  onChange, 
  icon: Icon,
  formatValue = (v) => `${v}%`
}) => {
  const id = `slider-${label.replace(/\s+/g, '-').toLowerCase()}`;
  
  return (
    <div style={{ marginBottom: '10px' }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        marginBottom: '5px',
        gap: '8px',
        color: '#555'
      }}>
        {Icon && <Icon size={14} />}
        <label htmlFor={id} style={{ fontSize: '14px', flex: 1 }}>
          {label}: <strong>{formatValue(value)}</strong>
        </label>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={onChange}
        style={{
          width: '100%',
          height: '6px',
          borderRadius: '3px',
          background: '#e0e0e0',
          outline: 'none',
          WebkitAppearance: 'none',
        }}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-valuetext={formatValue(value)}
      />
    </div>
  );
};

const AccessibilityMenu = ({ onClose, open }) => {
  // Estados locais
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('geral');
  const recognitionRef = useRef(null);
  const [showHelp, setShowHelp] = useState(false);
  const [show2FAMenu, setShow2FAMenu] = useState(false);
  
  // Estados e funções do contexto de acessibilidade
  const {
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
    toggleScreenReader
  } = useAccessibility();
  
  // Referência para o menu
  const menuRef = useRef(null);
  const navigate = useNavigate();
  
  // Configuração do reconhecimento de voz
  const commands = [
    {
      command: ['navegar para *', 'ir para *', 'abrir *'],
      callback: (page) => handleNavigation(page)
    },
    {
      command: ['rolar para cima', 'subir'],
      callback: () => window.scrollBy(0, -200)
    },
    {
      command: ['rolar para baixo', 'descer'],
      callback: () => window.scrollBy(0, 200)
    },
    {
      command: ['voltar', 'página anterior'],
      callback: () => window.history.back()
    },
    {
      command: ['avançar', 'próxima página'],
      callback: () => window.history.forward()
    },
    {
      command: ['ativar modo escuro', 'modo escuro'],
      callback: () => setDarkMode(true)
    },
    {
      command: ['desativar modo escuro', 'modo claro'],
      callback: () => setDarkMode(false)
    },
    {
      command: ['aumentar fonte', 'aumentar texto'],
      callback: () => setFontScale(prev => Math.min(200, prev + 10))
    },
    {
      command: ['diminuir fonte', 'diminuir texto'],
      callback: () => setFontScale(prev => Math.max(80, prev - 10))
    },
    {
      command: ['aumentar contraste', 'alto contraste'],
      callback: () => setHighContrast(true)
    },
    {
      command: ['diminuir contraste', 'contraste normal'],
      callback: () => setHighContrast(false)
    },
    {
      command: ['aumentar entrelinha', 'aumentar espaço entre linhas'],
      callback: () => setLineHeight(prev => Math.min(3, prev + 0.2).toFixed(1))
    },
    {
      command: ['diminuir entrelinha', 'diminuir espaço entre linhas'],
      callback: () => setLineHeight(prev => Math.max(1, prev - 0.2).toFixed(1))
    },
    {
      command: ['ativar leitor de tela', 'leitor de tela'],
      callback: () => setScreenReaderEnabled(true)
    },
    {
      command: ['desativar leitor de tela', 'desligar leitor de tela'],
      callback: () => setScreenReaderEnabled(false)
    },
    {
      command: ['ajuda', 'o que posso dizer', 'comandos de voz'],
      callback: () => setShowHelp(true)
    },
    {
      command: ['fechar ajuda', 'esconder ajuda'],
      callback: () => setShowHelp(false)
    }
  ];
  
  // Função para falar o texto
  const speak = useCallback((text) => {
    if ('speechSynthesis' in window) {
      // Cancela qualquer fala em andamento
      speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-BR';
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      
      speechSynthesis.speak(utterance);
    }
  }, []);
  
  // Função para navegação por voz
  const handleNavigation = useCallback((page) => {
    const normalizedPage = page.toLowerCase().trim();
    
    // Mapeamento de comandos de voz para rotas
    const routeMap = {
      // Páginas principais
      'início': '/',
      'home': '/',
      'sobre': '/sobre',
      'sobre nós': '/sobre',
      'contato': '/contato',
      'fale conosco': '/contato',
      'login': '/login',
      'entrar': '/login',
      'cadastro': '/cadastro',
      'registro': '/cadastro',
      'configurações': '/configuracao',
      'configuração': '/configuracao',
      'dashboard': '/dashboard',
      'cotações': '/cotacoes',
      'cotação': '/cotacoes',
      'ajuda': '/ajuda',
      'faq': '/ajuda',
      'perfil': '/perfil',
      'configurações de acessibilidade': '/configuracao/acessibilidade',
      'configuração de acessibilidade': '/configuracao/acessibilidade',
      'configurações de conta': '/configuracao/conta',
      'configuração de conta': '/configuracao/conta',
      'configurações de notificação': '/configuracao/notificacoes',
      'configuração de notificação': '/configuracao/notificacoes',
      'configurações de segurança': '/configuracao/seguranca',
      'configuração de segurança': '/configuracao/seguranca',
      'configurações de privacidade': '/configuracao/privacidade',
      'configuração de privacidade': '/configuracao/privacidade',
      'configurações de tema': '/configuracao/tema',
      'configuração de tema': '/configuracao/tema',
      'configurações de idioma': '/configuracao/idioma',
      'configuração de idioma': '/configuracao/idioma',
      'configurações de exibição': '/configuracao/exibicao',
      'configuração de exibição': '/configuracao/exibicao',
      'configurações de som': '/configuracao/som',
      'configuração de som': '/configuracao/som',
      'configurações de notificações': '/configuracao/notificacoes',
      'configuração de notificações': '/configuracao/notificacoes',
      'configurações de email': '/configuracao/email',
      'configuração de email': '/configuracao/email',
      'configurações de senha': '/configuracao/senha',
      'configuração de senha': '/configuracao/senha',
      'configurações de conta de usuário': '/configuracao/conta',
      'configuração de conta de usuário': '/configuracao/conta',
      'configurações de perfil': '/perfil/editar',
      'configuração de perfil': '/perfil/editar',
      'clima': '/clima',
      'previsão do tempo': '/clima',
      'tempo': '/clima',
      'editar perfil': '/perfil/editar',
      'minha conta': '/perfil',
      'meu perfil': '/perfil',
      'sair': '/sair',
      'logout': '/sair',
      'desconectar': '/sair',
      'fazer logout': '/sair',
      'sair da conta': '/sair',
      'desconectar da conta': '/sair',
      'voltar': -1,
      'avançar': 1,
    };
    
    const path = routeMap[normalizedPage];
    
    // Se não encontrar a rota, tenta encontrar uma correspondência parcial
    if (!path) {
      // Tenta encontrar uma correspondência parcial
      const matchingRoute = Object.entries(routeMap).find(([key]) => 
        normalizedPage.includes(key) || key.includes(normalizedPage)
      );
      
      if (matchingRoute) {
        const [matchedKey, matchedPath] = matchingRoute;
        console.log(`Navegando para: ${matchedPath} (correspondência parcial para '${matchedKey}')`);
        if (typeof matchedPath === 'number') {
          navigate(matchedPath);
        } else {
          navigate(matchedPath);
        }
        speak(`Navegando para ${matchedKey}`);
      } else {
        console.log(`Página não encontrada: ${page}`);
        speak(`Desculpe, não consegui encontrar a página ${page}. Você pode tentar dizer 'ajuda' para ver as opções disponíveis.`);
      }
      return;
    }
    
    console.log(`Navegando para: ${path}`);
    if (typeof path === 'number') {
      navigate(path);
      speak(`Navegando ${path > 0 ? 'para frente' : 'para trás'}`);
    } else {
      navigate(path);
      speak(`Navegando para ${normalizedPage}`);
    }
  }, [navigate, speak]);
  
  // Função para obter sugestões de comandos
  const getCommandSuggestions = (command) => {
    const allCommands = [
      // Navegação
      'navegar para [página]', 'ir para [página]', 'abrir [página]',
      // Configurações
      'ativar modo escuro', 'desativar modo escuro',
      'aumentar fonte', 'diminuir fonte', 'tamanho de fonte padrão',
      'aumentar contraste', 'diminuir contraste',
      'ativar leitor de tela', 'desativar leitor de tela',
      // Ajuda
      'ajuda', 'o que posso dizer', 'comandos de voz', 'fechar ajuda',
      // Navegação do sistema
      'voltar', 'avançar', 'atualizar', 'início', 'home',
      // Comandos específicos do AgroSmart
      'previsão do tempo', 'clima', 'temperatura', 'umidade', 'chuvas',
      'solo', 'plantio', 'colheita', 'irrigação', 'fertilizante',
      'pragas', 'doenças', 'mercado', 'preços', 'cotações',
      'análise de solo', 'recomendações', 'calendário agrícola'
    ];

    // Se o comando estiver vazio, retorna todos os comandos
    if (!command) return allCommands;

    // Filtra os comandos que contêm o termo de busca
    return allCommands.filter(cmd => 
      cmd.toLowerCase().includes(command.toLowerCase())
    );
  };

  // Função para processar comandos de voz
  const processVoiceCommand = useCallback((transcript) => {
    const command = transcript.toLowerCase().trim();
    console.log('Processando comando de voz:', command);
    
    // Comandos especiais que não são de navegação
    const specialCommands = {
      // Navegação
      'ir para o início': () => navigate('/'),
      'ir para o começo': () => navigate('/'),
      'página inicial': () => navigate('/'),
      'página principal': () => navigate('/'),
      
      // Ações comuns
      'rolar para cima': () => window.scrollTo({ top: 0, behavior: 'smooth' }),
      'rolar para baixo': () => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }),
      'rolar até o topo': () => window.scrollTo({ top: 0, behavior: 'smooth' }),
      'rolar até o final': () => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }),
      'atualizar página': () => window.location.reload(),
      'recarregar página': () => window.location.reload(),
      'voltar página': () => window.history.back(),
      'avançar página': () => window.history.forward(),
      
      // Acessibilidade
      'aumentar tamanho da fonte': () => setFontScale(prev => Math.min(200, prev + 10)),
      'diminuir tamanho da fonte': () => setFontScale(prev => Math.max(80, prev - 10)),
      'tamanho de fonte padrão': () => setFontScale(100),
      // Ajuda
      'ajuda': () => {
        setShowHelp(true);
        const commands = getCommandSuggestions('').slice(0, 5);
        speak(`Aqui estão alguns comandos disponíveis: ${commands.join(', ')}. Diga 'mais comandos' para ver mais opções.`);
      },
      'o que posso dizer': () => specialCommands['ajuda'](),
      'comandos de voz': () => specialCommands['ajuda'](),
      'mais comandos': () => {
        const moreCommands = getCommandSuggestions('').slice(5, 10);
        speak(`Mais comandos: ${moreCommands.join(', ')}. Diga 'ajuda' para ver os comandos iniciais.`);
      },
      'fechar ajuda': () => {
        setShowHelp(false);
        speak('Ajuda fechada');
      },
      'esconder ajuda': () => {
        setShowHelp(false);
        speak('Ajuda escondida');
      },
      'repetir comando': () => {
        if (lastCommand) {
          speak(`Repetindo o último comando: ${lastCommand}`);
          processVoiceCommand(lastCommand);
        } else {
          speak('Não há comando anterior para repetir');
        }
      },
      'qual é o comando': () => {
        if (lastCommand) {
          speak(`O último comando foi: ${lastCommand}`);
        } else {
          speak('Nenhum comando foi executado ainda');
        }
      },
      'cancelar': () => {
        stopListening();
        speak('Operação cancelada');
      },
      'parar': () => {
        stopListening();
        speak('Reconhecimento de voz parado');
      },
      
      // Leitor de tela
      'ativar leitor de tela': () => {
        setScreenReaderEnabled(true);
        speak('Leitor de tela ativado');
      },
      'desativar leitor de tela': () => {
        setScreenReaderEnabled(false);
        speak('Leitor de tela desativado');
      },
      
      // Comandos do AgroSmart - Clima e Tempo
      'clima': () => {
        speak('Abrindo previsão do tempo. Em breve você poderá verificar as condições climáticas da sua região.');
        navigate('/clima');
      },
      'temperatura': () => {
        // Simulação de leitura de temperatura
        const temp = Math.floor(Math.random() * 10) + 20; // Temperatura entre 20-30°C
        speak(`A temperatura atual é de aproximadamente ${temp} graus Celsius.`);
      },
      'umidade': () => {
        // Simulação de leitura de umidade
        const humidity = Math.floor(Math.random() * 30) + 50; // Umidade entre 50-80%
        speak(`A umidade relativa do ar está em aproximadamente ${humidity} por cento.`);
      },
      'previsão do tempo': () => specialCommands['clima'](),
      'previsao do tempo': () => specialCommands['clima'](),
      'previsão': () => specialCommands['clima'](),
      'previsao': () => specialCommands['clima'](),
      'tempo': () => specialCommands['clima'](),
      
      // Comandos Agrícolas
      'status da plantação': () => {
        const statuses = ['saudável', 'em desenvolvimento', 'precisa de atenção', 'com sinais de estresse'];
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
        speak(`Sua plantação está ${randomStatus}.`);
      },
      'umidade do solo': () => {
        const moisture = Math.floor(Math.random() * 50) + 30; // Umidade entre 30-80%
        speak(`A umidade do solo está em aproximadamente ${moisture} por cento.`);
      },
      'fase da lua': () => {
        const phases = ['nova', 'crescente', 'cheia', 'minguante'];
        const currentPhase = phases[Math.floor(Math.random() * phases.length)];
        speak(`A lua está na fase ${currentPhase}.`);
      },
      'previsão de chuva': () => {
        const rainChance = Math.floor(Math.random() * 100);
        speak(`Há ${rainChance} por cento de chance de chuva nas próximas 24 horas.`);
      },
      'horário do nascer do sol': () => {
        const hour = Math.floor(Math.random() * 2) + 5; // Entre 5-7h
        const minute = Math.floor(Math.random() * 60);
        speak(`O sol nascerá às ${hour} horas e ${minute} minutos.`);
      },
      'horário do pôr do sol': () => {
        const hour = Math.floor(Math.random() * 3) + 17; // Entre 17-20h
        const minute = Math.floor(Math.random() * 60);
        speak(`O sol se põe às ${hour} horas e ${minute} minutos.`);
      },
      'velocidade do vento': () => {
        const speed = (Math.random() * 15).toFixed(1); // Entre 0-15 km/h
        speak(`A velocidade do vento é de aproximadamente ${speed} quilômetros por hora.`);
      },
      'pressão atmosférica': () => {
        const pressure = Math.floor(Math.random() * 20) + 1000; // Entre 1000-1020 hPa
        speak(`A pressão atmosférica é de ${pressure} hectopascais.`);
      },
      'índice UV': () => {
        const uvIndex = Math.floor(Math.random() * 5) + 1; // Entre 1-5
        speak(`O índice UV atual é ${uvIndex}, que é ${uvIndex < 3 ? 'baixo' : uvIndex < 6 ? 'moderado' : 'alto'}.`);
      },
      'qualidade do ar': () => {
        const quality = ['boa', 'moderada', 'ruim', 'péssima'][Math.floor(Math.random() * 4)];
        speak(`A qualidade do ar está ${quality} no momento.`);
      },
      
      // Comandos de navegação do sistema
      'voltar': () => {
        speak('Voltando para a página anterior');
        navigate(-1);
      },
      'volta': () => {
        speak('Voltando para a página anterior');
        navigate(-1);
      },
      'avançar': () => {
        speak('Avançando para a próxima página');
        navigate(1);
      },
      'atualizar': () => {
        speak('Atualizando a página');
        window.location.reload();
      },
      'atualiza': () => {
        speak('Atualizando a página');
        window.location.reload();
      },
      'recarregar': () => {
        speak('Recarregando a página');
        window.location.reload();
      },
      'início': () => {
        speak('Navegando para a página inicial');
        navigate('/');
      },
      'home': () => {
        speak('Navegando para a página inicial');
        navigate('/');
      },
      
      // Comandos de acessibilidade
      'aumentar contraste': () => {
        setHighContrast(true);
        speak('Alto contraste ativado');
      },
      'diminuir contraste': () => {
        setHighContrast(false);
        speak('Contraste normal ativado');
      },
      'modo escuro': () => {
        setDarkMode(true);
        speak('Modo escuro ativado');
      },
      'modo claro': () => {
        setDarkMode(false);
        speak('Modo claro ativado');
      },
      'aumentar fonte': () => {
        setFontScale(prev => {
          const newSize = Math.min(200, prev + 10);
          speak(`Tamanho da fonte aumentado para ${newSize} por cento`);
          return newSize;
        });
      },
      'diminuir fonte': () => {
        setFontScale(prev => {
          const newSize = Math.max(80, prev - 10);
          speak(`Tamanho da fonte diminuído para ${newSize} por cento`);
          return newSize;
        });
      },
    };

    // Verifica se é um comando especial
    if (specialCommands[command]) {
      specialCommands[command]();
      return;
    }
    
    // Verifica os comandos de navegação
    const navigationMatch = command.match(/^(?:navegar para|ir para|abrir|mostrar|ver)\s+(.+)/i);
    if (navigationMatch) {
      const page = navigationMatch[1].trim();
      handleNavigation(page);
      return;
    }
    
    // Se não for um comando especial nem de navegação, tenta encontrar correspondências parciais
    if (command) {
      // Tenta encontrar comandos que contenham as palavras-chave
      const allCommands = Object.keys(specialCommands);
      const words = command.toLowerCase().split(/\s+/);
      
      // Encontra comandos que contêm todas as palavras-chave (ordem não importa)
      const matchingCommands = allCommands.filter(cmd => 
        words.every(word => cmd.includes(word))
      );
      
      // Se encontrou correspondências exatas ou parciais
      if (matchingCommands.length > 0) {
        // Ordena por relevância (comandos mais curtos primeiro, pois são mais provavelmente o que o usuário queria)
        matchingCommands.sort((a, b) => a.length - b.length);
        
        // Pega o comando mais provável
        const mostLikelyCommand = matchingCommands[0];
        
        // Se for uma correspondência exata, executa diretamente
        if (mostLikelyCommand === command) {
          specialCommands[mostLikelyCommand]();
          return;
        }
        
        // Se for uma correspondência parcial, pede confirmação
        speak(`Você quis dizer '${mostLikelyCommand}'? Diga 'sim' para confirmar ou 'não' para tentar novamente.`);
        
        // Configura um ouvinte temporário para a confirmação
        const handleConfirmation = (transcript) => {
          const response = transcript.trim().toLowerCase();
          if (response === 'sim' || response === 'sim, confirmar' || response === 'confirmar') {
            specialCommands[mostLikelyCommand]();
          } else if (response === 'não' || response === 'não, tente novamente' || response === 'tentar novamente') {
            speak('Por favor, repita o comando.');
          }
          // Remove o ouvinte após processar a resposta
          recognitionRef.current?.removeEventListener('result', handleConfirmation);
        };
        
        // Adiciona o ouvinte temporário
        if (recognitionRef.current) {
          recognitionRef.current.addEventListener('result', handleConfirmation);
          // Remove o ouvinte após 5 segundos se não houver resposta
          setTimeout(() => {
            recognitionRef.current?.removeEventListener('result', handleConfirmation);
          }, 5000);
        }
        
        return;
      }
      
      // Se não encontrou correspondências parciais, tenta encontrar sugestões
      const suggestions = getCommandSuggestions(command);
      
      if (suggestions.length > 0) {
        // Se encontrar sugestões, fala as principais
        const topSuggestions = suggestions.slice(0, 3);
        speak(`Comando não reconhecido. Você quis dizer: ${topSuggestions.join(', ')}?`);
      } else {
        // Se não encontrar sugestões, informa que não entendeu
        speak(`Desculpe, não entendi o comando '${command}'. Diga 'ajuda' para ver os comandos disponíveis.`);
      }
      
      // Se o comando contém 'clima' mas não foi reconhecido, oferece ajuda específica
      if (command.includes('clima') || command.includes('tempo') || command.includes('temperatura')) {
        speak('Para informações sobre o clima, tente dizer: "previsão do tempo", "qual a temperatura?" ou "como está o tempo hoje?".');
      }
    }
  }, [speak, setScreenReaderEnabled, handleNavigation, navigate, getCommandSuggestions, setShowHelp]);
  
  // Estado para armazenar o transcript de fala
  const [speechTranscript, setSpeechTranscript] = useState('');

  // Limpa o reconhecimento quando o componente for desmontado
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // Verifica se o navegador suporta reconhecimento de voz
  const isSpeechRecognitionSupported = useCallback(() => {
    return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
  }, []);

  // Inicializa o reconhecimento de voz
  const startListening = useCallback(() => {
    try {
      // Verifica se o navegador suporta a API de reconhecimento de fala
      if (!isSpeechRecognitionSupported()) {
        console.warn('Seu navegador não suporta reconhecimento de voz');
        speak('Seu navegador não suporta reconhecimento de voz. Tente usar o Google Chrome, Microsoft Edge ou Safari.');
        return false;
      }
      
      // Verifica se o usuário já negou permissão anteriormente
      if (window.localStorage.getItem('micPermissionDenied') === 'true') {
        speak('O acesso ao microfone foi negado anteriormente. Por favor, atualize as permissões do navegador para usar o reconhecimento de voz.');
        return false;
      }
      
      // Para qualquer reconhecimento em andamento
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      // Cria uma nova instância do reconhecimento de fala
      const recognition = new SpeechRecognition();
      recognition.lang = 'pt-BR';
      recognition.continuous = true;
      recognition.interimResults = false;
      
      let silenceTimer;
      const SILENCE_TIMEOUT = 5000; // 5 segundos de silêncio
      
      recognition.onstart = () => {
        console.log('Reconhecimento de voz iniciado');
        setListening(true);
        
        // Inicia o temporizador de silêncio
        silenceTimer = setTimeout(() => {
          if (recognitionRef.current) {
            speak('Não ouvi nada. Por favor, tente novamente.');
            stopListening();
          }
        }, SILENCE_TIMEOUT);
        
        speak('Ouvindo... Diga algo como: navegar para contato, ou ajuda para ver os comandos disponíveis.');
      };
      
      recognition.onresult = (event) => {
        // Reinicia o temporizador quando fala é detectada
        if (silenceTimer) {
          clearTimeout(silenceTimer);
        }
        
        const last = event.results.length - 1;
        const transcript = event.results[last][0].transcript.trim();
        
        // Verifica se o resultado é final
        if (event.results[last].isFinal) {
          console.log('Comando de voz reconhecido:', transcript);
          
          // Atualiza o transcript e processa o comando
          setSpeechTranscript(transcript);
          processVoiceCommand(transcript);
          
          // Para o reconhecimento após processar o comando
          // para evitar múltiplos acionamentos
          stopListening();
        }
      };
      
      recognition.onerror = (event) => {
        console.error('Erro no reconhecimento de voz:', event.error);
        
        // Limpa o temporizador
        if (silenceTimer) {
          clearTimeout(silenceTimer);
        }
        
        let errorMessage = 'Erro no reconhecimento de voz';
        let isPermanentError = false;
        
        switch(event.error) {
          case 'no-speech':
            errorMessage = 'Não foi detectada nenhuma fala. Por favor, fale mais perto do microfone e tente novamente.';
            break;
          case 'audio-capture':
            errorMessage = 'Não foi possível acessar o microfone. Verifique se outro aplicativo não está usando o microfone.';
            isPermanentError = true;
            break;
          case 'not-allowed':
          case 'permission-denied':
            errorMessage = 'Permissão para usar o microfone foi negada. Para ativar o reconhecimento de voz, atualize as permissões do seu navegador.';
            window.localStorage.setItem('micPermissionDenied', 'true');
            isPermanentError = true;
            break;
          case 'language-not-supported':
            errorMessage = 'O idioma português não é suportado pelo seu navegador. Tente usar o Google Chrome ou Microsoft Edge.';
            isPermanentError = true;
            break;
          case 'service-not-allowed':
            errorMessage = 'O serviço de reconhecimento de fala não está disponível. Verifique sua conexão com a internet.';
            isPermanentError = true;
            break;
          default:
            errorMessage = `Ocorreu um erro: ${event.error}. Tente novamente mais tarde.`;
        }
        
        console.error('Detalhes do erro:', event);
        speak(errorMessage);
        setListening(false);
        
        // Se for um erro permanente, não tenta reiniciar
        if (isPermanentError) {
          if (recognitionRef.current) {
            recognitionRef.current.stop();
            recognitionRef.current = null;
          }
          return;
        }
        
        // Tenta reiniciar o reconhecimento após um curto atraso
        setTimeout(() => {
          if (!listening) {
            startListening().catch(console.error);
          }
        }, 2000);
      };
      
      recognition.onend = () => {
        console.log('Reconhecimento de voz finalizado');
        
        // Limpa o temporizador
        if (silenceTimer) {
          clearTimeout(silenceTimer);
        }
        
        setListening(false);
        recognitionRef.current = null;
      };
      
      // Inicia o reconhecimento
      recognition.start();
      recognitionRef.current = recognition;
      
    } catch (error) {
      console.error('Erro ao iniciar reconhecimento de voz:', error);
      setListening(false);
      speak('Não foi possível iniciar o reconhecimento de voz. Por favor, verifique as permissões do microfone.');
    }
  }, [speak]);
  
  // Para o reconhecimento de voz
  const stopListening = useCallback(() => {
    try {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
      setListening(false);
    } catch (error) {
      console.error('Erro ao parar reconhecimento de voz:', error);
      setListening(false);
    }
  }, []);

  // Toggle voice control
  const toggleVoiceControl = useCallback(() => {
    if (listening) {
      stopListening();
    } else {
      startListening();
    }
  }, [listening, startListening, stopListening]);

  // Toggle screen reader functionality is provided by the context

  // Efeito para monitorar mudanças no transcript
  useEffect(() => {
    if (speechTranscript && speechTranscript !== lastCommand) {
      setLastCommand(speechTranscript);
      setVoiceCommands(prev => [...prev, speechTranscript].slice(-5));
    }
  }, [speechTranscript, lastCommand, setLastCommand, setVoiceCommands]);
  
  // Efeito para fechar o menu quando clicar fora dele
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        // Verifica se o clique foi fora do menu e não no botão de acessibilidade
        const accessibilityButton = document.querySelector('button[aria-label="Menu de Acessibilidade"]');
        if (!accessibilityButton || !accessibilityButton.contains(event.target)) {
          if (onClose) onClose();
        }
      }
    }
    
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open, onClose]);

  // Se o menu estiver fechado, não renderiza nada
  if (!open) return null;

  // Estilos
  const styles = {
    menuPanel: {
      position: 'fixed',
      top: '70px',
      right: '20px',
      background: 'var(--bg-color, #ffffff)',
      borderRadius: '12px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
      padding: '15px',
      width: '300px',
      maxHeight: 'calc(100vh - 90px)',
      overflowY: 'auto',
      zIndex: 1001,
    },
    tabList: {
      display: 'flex',
      borderBottom: '1px solid var(--border-color, #e0e0e0)',
      marginBottom: '15px',
      paddingBottom: '5px',
    },
    tab: {
      padding: '8px 12px',
      border: 'none',
      borderBottom: '2px solid transparent',
      background: 'none',
      cursor: 'pointer',
      color: 'var(--text-color, #333)',
      fontWeight: 500,
      fontSize: '14px',
      transition: 'all 0.2s ease',
      outline: 'none',
    },
    activeTab: {
      borderBottom: '2px solid var(--primary-color, #007acc)',
      color: 'var(--primary-color, #007acc)',
    },
    tabPanel: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
    },
  };

  // Se o menu estiver fechado, não renderiza nada
  if (!open) return null;

  return (
    <div ref={menuRef} style={styles.menuPanel}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--primary-color, #007acc)' }}>Acessibilidade</h3>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1.2rem',
            color: '#666',
            padding: '5px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '32px',
            height: '32px',
            transition: 'all 0.2s ease',
            ':hover': {
              backgroundColor: 'rgba(0,0,0,0.05)'
            }
          }}
          aria-label="Fechar menu de acessibilidade"
        >
          ×
        </button>
      </div>
      
      <div style={styles.tabList}>
        <button
          style={activeTab === 'geral' ? { ...styles.tab, ...styles.activeTab } : styles.tab}
          onClick={() => setActiveTab('geral')}
        >
          Geral
        </button>
        <button
          style={activeTab === 'visao' ? { ...styles.tab, ...styles.activeTab } : styles.tab}
          onClick={() => setActiveTab('visao')}
        >
          Visão
        </button>
        <button
          style={activeTab === 'leitura' ? { ...styles.tab, ...styles.activeTab } : styles.tab}
          onClick={() => setActiveTab('leitura')}
        >
          Leitura
        </button>
      </div>

      <div style={styles.tabPanel}>
        {activeTab === 'geral' && (
          <>
            <AccessibilityMenuItem
              icon={MdOutlineContrast}
              label={highContrast ? "Desativar alto contraste" : "Ativar alto contraste"}
              onClick={toggleHighContrast}
              isActive={highContrast}
              ariaLabel={highContrast ? "Desativar modo de alto contraste" : "Ativar modo de alto contraste"}
              shortcut="Alt + C"
            />
            <AccessibilityMenuItem
              icon={darkMode ? FaSun : FaMoon}
              label={darkMode ? "Modo Claro" : "Modo Escuro"}
              onClick={toggleDarkMode}
              isActive={darkMode}
              ariaLabel={darkMode ? "Mudar para modo claro" : "Mudar para modo escuro"}
              shortcut="Alt + D"
            />
            {user && (
              <AccessibilityMenuItem
                icon={FaShieldAlt}
                label="Segurança"
                onClick={() => setShow2FAMenu(true)}
                ariaLabel="Configurações de segurança"
              />
            )}
          </>
        )}

        {activeTab === 'visao' && (
          <>
            <SliderControl
              label="Tamanho do texto"
              value={fontScale}
              min={80}
              max={200}
              onChange={(e) => setFontScale(Number(e.target.value))}
              icon={FaTextHeight}
              formatValue={(v) => `${v}%`}
            />
            <SliderControl
              label="Espaçamento entre linhas"
              value={lineHeight * 100}
              min={100}
              max={200}
              onChange={(e) => setLineHeight(Number(e.target.value) / 100)}
              icon={FaTextHeight}
              formatValue={(v) => `${v}%`}
            />
            <SliderControl
              label="Espaçamento entre letras"
              value={letterSpacing * 10}
              min={0}
              max={20}
              onChange={(e) => setLetterSpacing(Number(e.target.value) / 10)}
              icon={FaTextHeight}
              formatValue={(v) => `${v / 10}px`}
            />
          </>
        )}

        {activeTab === 'leitura' && (
          <>
            <AccessibilityMenuItem
              icon={listening ? FaMicrophone : FaMicrophoneSlash}
              label={listening ? "Desativar reconhecimento de voz" : "Ativar reconhecimento de voz"}
              onClick={toggleVoiceControl}
              isActive={listening}
              ariaLabel={listening ? "Desativar reconhecimento de voz" : "Ativar reconhecimento de voz"}
              shortcut="Alt + V"
            />
            <AccessibilityMenuItem
              icon={FaUniversalAccess}
              label={screenReaderEnabled ? "Desativar leitor de tela" : "Ativar leitor de tela"}
              onClick={toggleScreenReader}
              isActive={screenReaderEnabled}
              ariaLabel={screenReaderEnabled ? "Desativar leitor de tela" : "Ativar leitor de tela"}
              shortcut="Alt + L"
            />
            
            {/* Mostra o status do reconhecimento de voz */}
            {listening && (
              <div style={{
                padding: '10px',
                margin: '10px 0',
                backgroundColor: 'rgba(0, 186, 124, 0.1)',
                borderRadius: '6px',
                borderLeft: '4px solid #00ba7c',
                fontSize: '14px',
                color: 'var(--text-color, #333)'
              }}>
                <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>Ouvindo... {listening && '🟢'}</p>
                {speechTranscript && (
                  <p style={{ margin: '5px 0 0 0', fontStyle: 'italic' }}>
                    <strong>Você disse:</strong> {speechTranscript}
                  </p>
                )}
                <p style={{ margin: '10px 0 0 0', fontSize: '12px' }}>
                  <strong>Comandos disponíveis:</strong> "navegar para [página]", "rolar para cima/baixo", 
                  "voltar", "avançar", "aumentar/diminuir fonte", "ajuda"
                </p>
              </div>
            )}
            
            <AccessibilityMenuItem
              icon={FaInfoCircle}
              label="Ajuda"
              onClick={() => setShowHelp(!showHelp)}
              ariaLabel="Mostrar ajuda de acessibilidade"
            />
            
            {showHelp && (
              <div style={{
                fontSize: '13px',
                color: 'var(--text-secondary, #666)',
                marginTop: '10px',
                padding: '10px',
                background: 'var(--bg-secondary, #f5f5f5)',
                borderRadius: '6px',
                lineHeight: 1.5,
              }}>
                <h4 style={{ margin: '0 0 10px 0', color: 'var(--primary-color, #007acc)' }}>Ajuda de Acessibilidade</h4>
                <p><strong>Reconhecimento de Voz:</strong> Ative o microfone e use comandos de voz para navegar no site.</p>
                <p><strong>Leitor de Tela:</strong> Ative o leitor de tela para ouvir o conteúdo ao navegar com o teclado.</p>
                <p><strong>Atalhos de Teclado:</strong></p>
                <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
                  <li><kbd>Alt + V</kbd> - Ativar/desativar reconhecimento de voz</li>
                  <li><kbd>Alt + L</kbd> - Ativar/desativar leitor de tela</li>
                  <li><kbd>Alt + C</kbd> - Alternar alto contraste</li>
                  <li><kbd>Alt + D</kbd> - Alternar modo escuro/claro</li>
                </ul>
              </div>
            )}
          </>
        )}
      </div>

      {show2FAMenu && (
        <TwoFactorAuth
          onClose={() => setShow2FAMenu(false)}
          onSuccess={() => {
            setShow2FAMenu(false);
          }}
        />
      )}

      <style>
        {`
          /* Estilos globais de acessibilidade */
          [data-high-contrast="true"] {
            --primary-color: #0000FF;
            --secondary-color: #FFFF00;
            --text-color: #000000;
            --bg-color: #FFFFFF;
            --border-color: #000000;
          }
          
          [data-theme="dark"] {
            --primary-color: #4dabf7;
            --secondary-color: #ffd43b;
            --text-color: #f1f3f5;
            --bg-color: #212529;
            --bg-secondary: #343a40;
            --border-color: #495057;
            --text-secondary: #adb5bd;
          }
          
          [data-high-contrast="true"] button,
          [data-high-contrast="true"] input,
          [data-high-contrast="true"] select,
          [data-high-contrast="true"] textarea {
            border: 2px solid #000 !important;
          }
          
          body {
            font-size: var(--font-scale);
            line-height: var(--line-height);
            letter-spacing: var(--letter-spacing);
            color: var(--text-color);
            background-color: var(--bg-color);
            transition: all 0.3s ease;
          }
          
          /* Melhorias de foco para acessibilidade */
          *:focus {
            outline: 3px solid var(--primary-color, #007acc);
            outline-offset: 2px;
          }
          
          /* Esconder o conteúdo do leitor de tela, mas mantê-lo acessível */
          .sr-only {
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            white-space: nowrap;
            border-width: 0;
          }
        `}
      </style>
    </div>
  );
};

export default AccessibilityMenu;
