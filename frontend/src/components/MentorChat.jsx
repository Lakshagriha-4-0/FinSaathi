import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Bot, User, Sparkles, Mic, MicOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import AudioButton from './AudioButton';

const MentorChat = () => {
    const { t, i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [chat, setChat] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const scrollRef = useRef(null);

    // Speech Recognition Setup
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = useRef(null);

    useEffect(() => {
        if (SpeechRecognition) {
            recognition.current = new SpeechRecognition();
            recognition.current.continuous = false;
            recognition.current.interimResults = false;

            recognition.current.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setMessage(transcript);
                setIsListening(false);
            };

            recognition.current.onerror = (event) => {
                console.error("Speech Recognition Error:", event.error);
                setIsListening(false);
            };

            recognition.current.onend = () => {
                setIsListening(false);
            };
        }
    }, [SpeechRecognition]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [chat]);

    const toggleListening = () => {
        if (isListening) {
            recognition.current?.stop();
            setIsListening(false);
        } else {
            // Set language based on app state
            const langMap = { 'en': 'en-IN', 'hi': 'hi-IN', 'mr': 'hi-IN', 'ta': 'ta-IN' };
            recognition.current.lang = langMap[i18n.language] || 'en-IN';

            try {
                recognition.current?.start();
                setIsListening(true);
            } catch (err) {
                console.error("Failed to start recognition:", err);
            }
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!message.trim() || loading) return;

        const userMsg = { role: 'user', parts: [{ text: message }] };
        setChat(prev => [...prev, { sender: 'user', text: message }]);
        setMessage('');
        setLoading(true);

        try {
            const { data } = await api.post('/mentorship/chat', {
                message,
                history: chat.map(c => ({
                    role: c.sender === 'user' ? 'user' : 'model',
                    parts: [{ text: c.text }]
                })),
                lang: i18n.language
            });

            setChat(prev => [...prev, { sender: 'ai', text: data.reply }]);
        } catch (err) {
            setChat(prev => [...prev, { sender: 'ai', text: 'Connection issue. Please try again later.' }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 pointer-events-none">
            {/* Chat Bubble Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`pointer-events-auto h-16 w-16 rounded-full bg-primary text-white shadow-2xl flex items-center justify-center transition-all active:scale-90 ${isOpen ? 'rotate-90 opacity-0 scale-0' : 'scale-100'}`}
            >
                <MessageSquare size={28} />
                <div className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full border-2 border-white animate-bounce" />
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="pointer-events-auto absolute bottom-0 right-0 w-[90vw] md:w-[400px] h-[600px] max-h-[80vh] bg-white rounded-[40px] shadow-2xl border border-gray-100 overflow-hidden flex flex-col transition-all transform origin-bottom-right">
                    {/* Header */}
                    <div className="p-6 bg-primary text-white flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-white/20 rounded-xl flex items-center justify-center">
                                <Bot size={24} />
                            </div>
                            <div>
                                <h3 className="font-display font-black leading-none">{t('mentor_chat_title')}</h3>
                                <span className="text-[10px] opacity-70 font-bold uppercase tracking-widest">Always Online</span>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-full">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Chat Area */}
                    <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/50">
                        {chat.length === 0 && (
                            <div className="text-center py-10 space-y-4">
                                <div className="p-4 bg-white rounded-[32px] shadow-sm inline-block border border-gray-100">
                                    <Sparkles className="text-primary mx-auto mb-2" />
                                    <p className="text-sm font-bold text-gray-700">Namaste! I am your {t('mentor_chat_title')}.</p>
                                    <p className="text-xs text-gray-400 font-medium mt-1 uppercase tracking-wider">Ask me anything in Hindi or English</p>
                                </div>
                                <div className="grid grid-cols-1 gap-2">
                                    {[
                                        i18n.language === 'hi' ? "मैं हर महीने 1000 कैसे बचाऊं?" : "How to save 1000 every month?",
                                        i18n.language === 'hi' ? "यूपीआई सुरक्षा टिप्स" : "UPI safety tips",
                                        i18n.language === 'hi' ? "क्या डिजिटल गोल्ड सुरक्षित है?" : "Is digital gold safe?"
                                    ].map((q, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setMessage(q)}
                                            className="p-3 text-xs bg-white text-gray-600 font-bold rounded-2xl border border-gray-100 hover:border-primary hover:text-primary transition-all"
                                        >
                                            {q}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {chat.map((msg, i) => (
                            <div key={i} className={`flex items-start gap-2 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                <div className={`max-w-[85%] p-4 rounded-[28px] relative ${msg.sender === 'user' ? 'bg-primary text-white rounded-tr-sm' : 'bg-white text-gray-800 rounded-tl-sm shadow-sm border border-gray-100'}`}>
                                    <p className="text-sm font-medium leading-relaxed">{msg.text}</p>
                                </div>
                                <div className="mt-2">
                                    <AudioButton text={msg.text} />
                                </div>
                            </div>
                        ))}

                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-white p-4 rounded-[28px] shadow-sm border border-gray-100 flex gap-2">
                                    <div className="w-2 h-2 bg-gray-200 rounded-full animate-bounce" />
                                    <div className="w-2 h-2 bg-gray-200 rounded-full animate-bounce [animation-delay:0.2s]" />
                                    <div className="w-2 h-2 bg-gray-200 rounded-full animate-bounce [animation-delay:0.4s]" />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input Area */}
                    <div className="p-4 bg-white border-t border-gray-100 space-y-3">
                        {isListening && (
                            <div className="flex items-center justify-center gap-2 text-primary font-bold animate-pulse text-xs uppercase tracking-widest">
                                <div className="h-2 w-2 rounded-full bg-red-500 shadow-[0_0_8px_red]" />
                                Listening...
                            </div>
                        )}
                        <form onSubmit={handleSend} className="flex gap-2">
                            <button
                                type="button"
                                onClick={toggleListening}
                                className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-all ${isListening ? 'bg-red-500 text-white shadow-lg shadow-red-200' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}
                            >
                                {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                            </button>
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder={t('ask_mentor')}
                                className="flex-1 px-5 py-3 bg-gray-50 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                            <button
                                type="submit"
                                disabled={!message.trim() || loading}
                                className="h-12 w-12 bg-primary text-white rounded-2xl flex items-center justify-center disabled:opacity-50 transition-all hover:scale-105 active:scale-95"
                            >
                                <Send size={20} />
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MentorChat;
