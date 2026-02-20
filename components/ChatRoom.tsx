
import React, { useState, useRef, useEffect } from 'react';
import { UserProfile, ChatMessage } from '../types';
import { ArrowLeft, Send, Sparkles, Mic } from 'lucide-react';

interface ChatRoomProps {
  partner: UserProfile;
  currentUser: UserProfile;
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  onBack: () => void;
}

const ChatRoom: React.FC<ChatRoomProps> = ({ partner, currentUser, messages, onSendMessage, onBack }) => {
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [permissionError, setPermissionError] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    // Initialize SpeechRecognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false; // Stop after one utterance
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'zh-CN';

      recognitionRef.current.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }
        setInputText(prev => prev + finalTranscript + interimTranscript);
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
        if (event.error === 'not-allowed') {
          setPermissionError(true);
        }
      };
    } else {
      console.warn('Speech Recognition API not supported in this browser.');
      setPermissionError(true); // Treat as permission error if API not supported
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const startRecording = () => {
    if (recognitionRef.current) {
      setInputText(''); // Clear previous input
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (inputText.trim()) {
      onSendMessage(inputText.trim());
      setInputText('');
    }
  };

  // 模拟 AI 建议的开场白
  const aiSuggestions = [
    `你好 ${partner.name}，我也很喜欢${partner.interests[0] || '社交'}，有空一起交流吗？`,
    `看到你的介绍说住在${partner.region}，我离那里也不远呢！`,
    `看到你被推荐给我，感觉我们会很投缘！`
  ];

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col max-w-2xl mx-auto shadow-2xl animate-in slide-in-from-right duration-300">
      {/* 聊天头部 */}
      <header className="bg-orange-50 p-4 border-b border-orange-100 flex items-center gap-4 sticky top-0 z-10">
        <button onClick={onBack} className="p-2 hover:bg-orange-100 rounded-full text-orange-600 transition-colors">
          <ArrowLeft size={28} />
        </button>
        <div className="flex items-center gap-3">
          <img src={partner.avatar} alt="" className="w-12 h-12 rounded-xl object-cover border-2 border-white shadow-sm" />
          <div>
            <h2 className="text-xl font-bold text-gray-900">{partner.name}</h2>
            <p className="text-xs text-green-600 font-bold">在线</p>
          </div>
        </div>
      </header>

      {/* AI 破冰建议 */}
      <div className="bg-orange-50/30 p-3 border-b border-orange-100 overflow-x-auto">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles size={14} className="text-orange-500" />
          <span className="text-xs font-bold text-orange-700 uppercase tracking-wider">AI 建议开场白</span>
        </div>
        <div className="flex gap-2 pb-1">
          {aiSuggestions.map((suggestion, idx) => (
            <button
              key={idx}
              onClick={() => setInputText(suggestion)}
              className="whitespace-nowrap bg-white border border-orange-200 px-4 py-2 rounded-full text-sm text-gray-700 hover:bg-orange-500 hover:text-white transition-all shadow-sm active:scale-95"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>

      {/* 消息列表 */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6 bg-[#FDFBF7]">
        {messages.length === 0 && (
          <div className="text-center py-10 opacity-50">
            <p className="text-gray-500">快来和 {partner.name} 打个招呼吧！</p>
          </div>
        )}
        {messages.map((msg) => {
          const isMe = msg.senderId === currentUser.id;
          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
              <div className={`max-w-[85%] flex items-end gap-2 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                <img 
                  src={isMe ? currentUser.avatar : partner.avatar} 
                  className="w-10 h-10 rounded-lg object-cover shadow-sm mb-1" 
                  alt="" 
                />
                <div className={`p-4 rounded-2xl shadow-sm text-lg leading-relaxed ${
                  isMe 
                  ? 'bg-orange-500 text-white rounded-br-none font-medium' 
                  : 'bg-white text-gray-800 rounded-bl-none border border-gray-100'
                }`}>
                  {msg.text}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 输入区域 */}
      <div className="p-4 bg-white border-t border-gray-100 pb-8">
        <div className="flex gap-2">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder={isRecording ? '正在聆听...' : (permissionError ? '麦克风权限被拒绝，请在浏览器设置中启用' : '在这里输入您想说的话...')}
            className="flex-1 p-4 bg-gray-50 border-none rounded-2xl text-xl focus:ring-2 focus:ring-orange-500 outline-none resize-none min-h-[60px]"
            rows={1}
            disabled={isRecording || permissionError}
          />
          {recognitionRef.current && ( // Only show mic button if API is supported
            <button
              onClick={isRecording ? stopRecording : startRecording}
              disabled={permissionError}
              className={`p-4 rounded-2xl transition-all flex items-center justify-center aspect-square shadow-lg ${isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-orange-50 text-orange-600 hover:bg-orange-100'} ${permissionError ? 'opacity-50 cursor-not-allowed' : ''}`}
              title={isRecording ? '停止录音' : (permissionError ? '麦克风权限被拒绝' : '语音输入')}
            >
              <Mic size={28} />
            </button>
          )}
          <button
            onClick={handleSend}
            disabled={!inputText.trim() || isRecording}
            className="bg-orange-500 text-white p-4 rounded-2xl hover:bg-orange-600 disabled:opacity-50 transition-all flex items-center justify-center aspect-square shadow-lg shadow-orange-100"
          >
            <Send size={28} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
