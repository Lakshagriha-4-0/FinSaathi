import React from 'react';
import { Volume2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const AudioButton = ({ text }) => {
    const { i18n } = useTranslation();

    const speak = () => {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);

        // Match voice language to app language
        const langMap = {
            'en': 'en-US',
            'hi': 'hi-IN',
            'mr': 'hi-IN', // Use Hindi voice as fallback for Marathi
            'ta': 'ta-IN'
        };

        utterance.lang = langMap[i18n.language] || 'en-US';
        utterance.rate = 0.9; // Slightly slower for clarity
        window.speechSynthesis.speak(utterance);
    };

    return (
        <button
            onClick={speak}
            className="p-1.5 bg-primary/10 text-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
            title="Listen"
        >
            <Volume2 size={16} />
        </button>
    );
};

export default AudioButton;
