import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Volume2, VolumeX, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// Shared audio element to ensure only one audio plays at a time globally
const globalAudio = new Audio();

const AudioButton = ({ text }) => {
    const { i18n } = useTranslation();
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const isComponentMounted = useRef(true);

    useEffect(() => {
        isComponentMounted.current = true;
        return () => {
            isComponentMounted.current = false;
        };
    }, []);

    const stopSpeech = useCallback(() => {
        // Stop browser native speech
        if (window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel();
        }
        // Stop global audio element
        globalAudio.pause();
        globalAudio.currentTime = 0;
        globalAudio.src = "";

        if (isComponentMounted.current) {
            setIsSpeaking(false);
            setIsLoading(false);
        }
    }, []);

    const speak = () => {
        if (!text) return;
        const speechText = String(text).trim();
        if (!speechText) return;

        stopSpeech();
        setIsLoading(true);

        const langMap = {
            'en': 'en-IN',
            'hi': 'hi-IN',
            'mr': 'hi-IN',
            'ta': 'ta-IN'
        };

        const lang = langMap[i18n.language] || 'hi-IN';

        // Wait for voices to load
        const voices = window.speechSynthesis.getVoices();

        // Priority: Native Browser TTS
        if (voices.length > 0) {
            const utterance = new SpeechSynthesisUtterance(speechText);
            utterance.lang = lang;
            utterance.rate = 0.85;

            // Voice Match
            let voice = voices.find(v => (v.lang.replace('_', '-') === lang &&
                (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Premium') || v.name.includes('हिन्दी'))));

            if (!voice) voice = voices.find(v => v.lang.startsWith(lang.split('-')[0]));
            if (voice) utterance.voice = voice;

            utterance.onstart = () => {
                if (isComponentMounted.current) {
                    setIsLoading(false);
                    setIsSpeaking(true);
                }
            };
            utterance.onend = () => {
                if (isComponentMounted.current) setIsSpeaking(false);
            };
            utterance.onerror = (e) => {
                console.warn("Browser TTS error, using fallback API", e);
                handleFallback(speechText, lang);
            };

            window.speechSynthesis.speak(utterance);
        } else {
            handleFallback(speechText, lang);
        }
    };

    const handleFallback = (txt, lng) => {
        const cleanLang = lng.split('-')[0];
        // Split text into chunks for Google Translate TTS limit
        const chunks = txt.match(/.{1,180}(\s|$)|.{1,180}/g) || [txt];
        let chunkIndex = 0;

        const playChunk = () => {
            if (!isComponentMounted.current || chunkIndex >= chunks.length) {
                if (isComponentMounted.current) {
                    setIsSpeaking(false);
                    setIsLoading(false);
                }
                return;
            }

            const url = `https://translate.googleapis.com/translate_tts?client=gtx&sl=${cleanLang}&tl=${cleanLang}&dt=t&q=${encodeURIComponent(chunks[chunkIndex])}`;

            globalAudio.src = url;
            globalAudio.onplay = () => {
                if (isComponentMounted.current) {
                    setIsLoading(false);
                    setIsSpeaking(true);
                }
            };
            globalAudio.onended = () => {
                chunkIndex++;
                playChunk();
            };
            globalAudio.onerror = (e) => {
                console.error("Audio fallback error:", e);
                if (isComponentMounted.current) {
                    setIsSpeaking(false);
                    setIsLoading(false);
                }
            };

            globalAudio.play().catch(err => {
                console.warn("Autoplay blocked", err);
                if (isComponentMounted.current) {
                    setIsSpeaking(false);
                    setIsLoading(false);
                }
            });
        };

        playChunk();
    };

    return (
        <button
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                (isSpeaking || isLoading) ? stopSpeech() : speak();
            }}
            disabled={!text}
            className={`p-1.5 rounded-lg transition-all active:scale-95 shadow-sm shrink-0 inline-flex items-center justify-center min-w-[32px] min-h-[32px] ${isSpeaking ? 'bg-primary text-white animate-pulse ring-2 ring-primary/30' : isLoading ? 'bg-primary/20 text-primary cursor-wait' : 'bg-primary/10 text-primary hover:bg-primary hover:text-white disabled:opacity-30'}`}
            aria-label={isSpeaking ? "Stop speaking" : "Listen to this text"}
        >
            {isLoading ? <Loader2 size={16} className="animate-spin" /> : isSpeaking ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
    );
};

export default AudioButton;
