import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Chat } from '@google/genai';
import { MessageCircle, X, Send, LoaderCircle, Bot, User, Compass } from 'lucide-react';

interface ChatMessage {
    role: 'user' | 'model';
    text: string;
}

interface ChatbotProps {
  navigateToSection: (section: string) => void;
}

const Chatbot: React.FC<ChatbotProps> = ({ navigateToSection }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [chat, setChat] = useState<Chat | null>(null);
    const [history, setHistory] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [quickReplies, setQuickReplies] = useState<string[]>([]);
    const [currentAction, setCurrentAction] = useState<string | null>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen && !chat) {
            try {
                const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
                const newChat = ai.chats.create({
                    model: 'gemini-2.5-flash',
                    config: {
                        systemInstruction: `You are the official AI assistant for the band Nafas. Your voice reflects the band's soul: artistic, warm, and charismatic.

                        **Your communication style:**
                        - **Clear and Personal:** Use simple, direct English that feels like a real, thoughtful conversation.
                        - **Artistic Tone:** Speak with warmth and passion. Be confident but approachable.
                        - **Engaging & Proactive:** Be interactive. Ask clarifying questions. Keep responses concise.

                        **Key Info:**
                        - **The Band:** We are Nafas, a duo (Sanna Sakil & Sheikh Sabir Ali) specializing in a soulful fusion of Sufi and Bollywood music.
                        - **Our Music:** We are currently focusing on creating magical live experiences with our unique interpretations and covers of Sufi and Bollywood classics. We don't have any original songs released online or anywhere else at the moment.
                        - **Booking:** The booking form on the website is the best way to inquire.
                        - **Payment:** A 50% advance payment is required to confirm a booking.

                        **SMART RULES:**
                        1.  **On Negotiations:** Gracefully decline discounts. Explain that pricing is fixed to ensure quality and fairness for all clients.
                        2.  **On Date Availability:** You don't have calendar access. Guide them to the official booking form for a definitive answer from management.

                        **RESPONSE FORMATTING (VERY IMPORTANT):**
                        1.  After EVERY response, you MUST provide 2-3 relevant follow-up questions. Format them like this at the very end of your message:
                            [QUICK_REPLIES]Question 1?|Question 2?|Another question?
                        2.  If your response is about booking, pricing, or availability, you MUST also include an action marker to guide the user to the booking form. Format it like this:
                            [ACTION:BOOKING]
                        
                        **Example Response about pricing:**
                        "Our prices start at ₹9,000 per hour for small gatherings. You can see all the details and calculate an estimate on our booking page. It's the best spot to get all the info.[ACTION:BOOKING][QUICK_REPLIES]Tell me about your most popular package.|What's included in a corporate event?|Do you travel for gigs?"`,
                    },
                });
                setChat(newChat);
                setHistory([{
                    role: 'model',
                    text: "Hey there, welcome. This is the official chat for Nafas. Happy to answer any questions you have about our music or booking a show."
                }]);
                setQuickReplies(["What kind of music do you play?", "How do I book you?", "What are your prices?"]);

            } catch(e) {
                console.error("Failed to initialize Gemini:", e);
                setHistory([{
                    role: 'model',
                    text: "Sorry, our digital assistant is having trouble connecting right now. Please check if an API key is configured or try again later."
                }]);
            }
        }
    }, [isOpen]);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [history, quickReplies]);

    const parseAndSetSuggestions = (fullText: string) => {
        const replyMatch = fullText.match(/\[QUICK_REPLIES\](.*)/);
        if (replyMatch && replyMatch[1]) {
            setQuickReplies(replyMatch[1].split('|').filter(s => s));
        } else {
            setQuickReplies([]);
        }

        const actionMatch = fullText.match(/\[ACTION:([^\]]+)\]/);
        if (actionMatch && actionMatch[1]) {
            setCurrentAction(actionMatch[1]);
        } else {
            setCurrentAction(null);
        }
    };
    
    const cleanMessageText = (text: string) => {
        return text.replace(/\[QUICK_REPLIES\].*/, '').replace(/\[ACTION:[^\]]+\]/, '').trim();
    };


    const sendMessage = async (messageText: string) => {
        if (!messageText.trim() || isLoading || !chat) return;

        setHistory(prev => [...prev, { role: 'user', text: messageText }]);
        setIsLoading(true);
        setQuickReplies([]);
        setCurrentAction(null);

        try {
            const resultStream = await chat.sendMessageStream({ message: messageText });
            
            let fullResponse = '';
            setHistory(prev => [...prev, { role: 'model', text: '' }]);

            for await (const chunk of resultStream) {
                const chunkText = chunk.text;
                fullResponse += chunkText;
                setHistory(prev => {
                    const newHistory = [...prev];
                    const lastMessage = newHistory[newHistory.length - 1];
                    if (lastMessage && lastMessage.role === 'model') {
                       lastMessage.text = cleanMessageText(fullResponse);
                    }
                    return newHistory;
                });
            }
            parseAndSetSuggestions(fullResponse);

        } catch (error) {
            console.error(error);
             setHistory(prev => {
                const newHistory = [...prev];
                const lastMessage = newHistory[newHistory.length - 1];
                if (lastMessage && lastMessage.role === 'model' && lastMessage.text === '') {
                   lastMessage.text = "Oops! Something went wrong on our end. Give it another shot?";
                } else {
                   return [...newHistory, { role: 'model', text: "Oops! Something went wrong on our end. Give it another shot?" }];
                }
                return newHistory;
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const userMessage = input;
        setInput('');
        await sendMessage(userMessage);
    };

    const handleQuickReplyClick = async (reply: string) => {
        await sendMessage(reply);
    };

    const handleGuideClick = () => {
        if (currentAction === 'BOOKING') {
            navigateToSection('booking');
            setIsOpen(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 z-[60] bg-gradient-to-r from-yellow-500 to-orange-500 text-black w-16 h-16 rounded-full flex items-center justify-center shadow-lg shadow-yellow-500/50 hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-yellow-400"
                aria-label="Open Chat"
            >
                {isOpen ? <X size={32} /> : <MessageCircle size={32} />}
            </button>

            {isOpen && (
                <div className="fixed bottom-24 right-6 z-50 w-[calc(100%-3rem)] max-w-sm h-[70vh] max-h-[600px] bg-gradient-to-br from-purple-900/80 to-indigo-900/80 backdrop-blur-xl rounded-2xl border border-yellow-500/30 shadow-2xl shadow-yellow-500/30 flex flex-col overflow-hidden transition-all duration-300 ease-in-out origin-bottom-right animate-slide-in">
                    <header className="flex-shrink-0 p-4 bg-black/30 border-b border-yellow-500/20 flex justify-between items-center">
                        <h3 className="text-xl font-bold text-yellow-300">Chat with Team Nafas</h3>
                        <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
                            <X size={24} />
                        </button>
                    </header>
                    
                    <div ref={chatContainerRef} className="flex-grow p-4 space-y-4 overflow-y-auto">
                        {history.map((msg, index) => (
                            <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                {msg.role === 'model' && <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center flex-shrink-0"><Bot size={20} className="text-yellow-300" /></div>}
                                
                                <div className={`max-w-[80%] rounded-xl px-4 py-3 ${msg.role === 'user' ? 'bg-yellow-500/20 text-yellow-200 rounded-br-none' : 'bg-white/10 text-gray-200 rounded-bl-none'}`}>
                                    <p className="whitespace-pre-wrap">{msg.text}</p>
                                </div>

                                {msg.role === 'user' && <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0"><User size={20} className="text-purple-300" /></div>}
                            </div>
                        ))}
                         {isLoading && (
                            <div className="flex items-start gap-3 justify-start">
                                <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center flex-shrink-0"><Bot size={20} className="text-yellow-300" /></div>
                                <div className="max-w-[80%] rounded-xl px-4 py-3 bg-white/10 text-gray-200 rounded-bl-none flex items-center">
                                    <div className="w-2 h-2 bg-yellow-300 rounded-full animate-bounce mr-2"></div>
                                    <div className="w-2 h-2 bg-yellow-300 rounded-full animate-bounce mr-2" style={{animationDelay: '0.2s'}}></div>
                                    <div className="w-2 h-2 bg-yellow-300 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                                </div>
                            </div>
                        )}
                    </div>
                    
                    <footer className="flex-shrink-0 p-4 bg-black/30 border-t border-yellow-500/20">
                        {!isLoading && (quickReplies.length > 0 || currentAction) && (
                            <div className="mb-2 overflow-x-auto scrollbar-hide">
                                <div className="flex items-center gap-2 pb-2">
                                    {currentAction === 'BOOKING' && (
                                         <button
                                            onClick={handleGuideClick}
                                            className="flex-shrink-0 px-3 py-1.5 bg-green-500/30 text-green-200 text-sm rounded-full border border-green-500/40 hover:bg-green-500/50 transition-colors flex items-center gap-2"
                                        >
                                            <Compass size={16} /> Guide me there
                                        </button>
                                    )}
                                    {quickReplies.map((reply, i) => (
                                        <button
                                            key={i}
                                            onClick={() => handleQuickReplyClick(reply)}
                                            className="flex-shrink-0 px-3 py-1.5 bg-yellow-500/20 text-yellow-200 text-sm rounded-full border border-yellow-500/30 hover:bg-yellow-500/40 transition-colors"
                                        >
                                            {reply}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                        <form onSubmit={handleFormSubmit} className="flex items-center gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask us anything..."
                                className="w-full bg-black/30 border border-yellow-500/30 rounded-lg px-4 py-2 focus:border-yellow-400 focus:outline-none text-white"
                                disabled={isLoading}
                            />
                            <button
                                type="submit"
                                disabled={isLoading || !input.trim()}
                                className="bg-yellow-500 text-black w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? <LoaderCircle size={20} className="animate-spin" /> : <Send size={20} />}
                            </button>
                        </form>
                    </footer>
                </div>
            )}
            <style>{`
                @keyframes slide-in {
                    from {
                        opacity: 0;
                        transform: translateY(20px) scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }
                .animate-slide-in {
                    animation: slide-in 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
                }
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </>
    );
};

export default Chatbot;