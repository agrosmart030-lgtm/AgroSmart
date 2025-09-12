import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaUniversalAccess, FaSignLanguage, FaVolumeUp, FaMicrophone } from "react-icons/fa";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { useNavigate } from "react-router-dom";

const AccessibilityMenu = () => {
  const [open, setOpen] = useState(false);
  const [fontScale, setFontScale] = useState(() => Number(localStorage.getItem("fontScale")) || 100);
  const [voiceEnabled, setVoiceEnabled] = useState(() => localStorage.getItem("voiceEnabled") === "true");
  const [readingEnabled, setReadingEnabled] = useState(() => localStorage.getItem("readingEnabled") === "true");

  const navigate = useNavigate();

  const { transcript, listening, resetTranscript } = useSpeechRecognition();

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontScale}%`;
    localStorage.setItem("fontScale", fontScale);
  }, [fontScale]);

  useEffect(() => {
    localStorage.setItem("voiceEnabled", voiceEnabled);
    if (voiceEnabled) {
      SpeechRecognition.startListening({ continuous: true, language: "pt-BR" });
    } else {
      SpeechRecognition.stopListening();
    }
  }, [voiceEnabled]);

  useEffect(() => {
    localStorage.setItem("readingEnabled", readingEnabled);
    if (readingEnabled) {
      const speakText = document.body.innerText;
      const utterance = new SpeechSynthesisUtterance(speakText);
      utterance.lang = "pt-BR";
      speechSynthesis.cancel(); // Para qualquer leitura anterior
      speechSynthesis.speak(utterance);
    } else {
      speechSynthesis.cancel();
    }
  }, [readingEnabled]);

  // Detecção e navegação por voz
  useEffect(() => {
    const lowerTranscript = transcript.toLowerCase();
    if (lowerTranscript.includes("clima")) {
      navigate("/clima");
      resetTranscript();
    } else if (lowerTranscript.includes("dashboard")) {
      navigate("/dashboard");
      resetTranscript();
    } else if (lowerTranscript.includes("cotações") || lowerTranscript.includes("cotação")) {
      navigate("/cotacoes");
      resetTranscript();
    }else if (lowerTranscript.includes("faq")) {
      navigate("/faq");
      resetTranscript();
    }
    // Adicione outras rotas conforme necessário
  }, [transcript, navigate, resetTranscript]);

  const increaseFontSize = () => setFontScale(prev => Math.min(prev + 10, 200));
  const decreaseFontSize = () => setFontScale(prev => Math.max(prev - 10, 50));

  const toggleReading = () => setReadingEnabled(prev => !prev);
  const toggleVoice = () => setVoiceEnabled(prev => !prev);

  return (
    <div style={{
      position: "fixed",
      top: "50%",
      right: "20px",
      transform: "translateY(-50%)",
      zIndex: 1000,
    }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          background: "#007acc",
          border: "none",
          borderRadius: "50%",
          color: "white",
          padding: "12px",
          fontSize: "20px",
          cursor: "pointer",
        }}
        aria-label="Abrir menu de acessibilidade"
      >
        <FaUniversalAccess />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            style={{
              marginTop: "10px",
              background: "white",
              borderRadius: "8px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
              padding: "10px",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              width: "180px"
            }}
          >
            <motion.button
              whileHover={{ scale: 1.08, backgroundColor: "#e0f7fa" }}
              onClick={increaseFontSize}
              style={{ border: "none", background: "none", padding: "8px", borderRadius: "6px", cursor: "pointer" }}
            >
              Aumentar fonte
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.08, backgroundColor: "#e0f7fa" }}
              onClick={decreaseFontSize}
              style={{ border: "none", background: "none", padding: "8px", borderRadius: "6px", cursor: "pointer" }}
            >
              Diminuir fonte
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.08, backgroundColor: "#e0f7fa" }}
              onClick={toggleReading}
              style={{ border: "none", background: "none", padding: "8px", borderRadius: "6px", cursor: "pointer" }}
            >
              {readingEnabled ? "Parar leitura" : "Ler texto"}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.08, backgroundColor: "#e0f7fa" }}
              onClick={toggleVoice}
              style={{ border: "none", background: "none", padding: "8px", borderRadius: "6px", cursor: "pointer" }}
            >
              {voiceEnabled ? "Desativar voz" : "Ativar voz"}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AccessibilityMenu;