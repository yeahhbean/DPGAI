// App.tsx
"use client";
import React, { useState } from "react";
import "./chat.css";
import CommandExtractor from "./agent/CommandExtractor";

const App: React.FC = () => {
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const [commands, setCommands] = useState<string[]>([]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(event.target.value);
  };

  const handleSubmit = async () => {
    if (inputText.trim()) {
      setMessages((prevMessages) => [...prevMessages, `User: ${inputText}`]);
      const aiResponse = await fetchAIResponse(inputText);
      setMessages((prevMessages) => [...prevMessages, `AI: ${aiResponse}`]);
      setInputText("");
    }
  };

  const fetchAIResponse = async (input: string) => {
    // 여기에 실제 AI 응답을 가져오는 로직을 구현해야 합니다.
    // 지금은 예시로 하드코딩된 응답을 반환합니다.
    return new Promise<string>((resolve) => {
      setTimeout(() => {
        resolve(`AI 응답: [end] [남] [암] [가격우선] [농협손보] [/end]`);
      }, 1000);
    });
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSubmit();
    }
  };

  const handleCommandExtraction = async (extractedCommands: string[]) => {
    setCommands(extractedCommands);
    if (extractedCommands.length >= 4) {
      const [gender, insuranceType, priority, company] = extractedCommands;
      const genderParam = gender === '남' ? '남' : '여';
      const response = await fetch(`/api/report?insuranceType=${insuranceType}&gender=${genderParam}&priority=${priority}&company=${company || ''}`);
      if (response.ok) {
        const data = await response.text();
        setMessages((prevMessages) => [...prevMessages, `추천 보험:\n${data}`]);
      } else {
        setMessages((prevMessages) => [...prevMessages, "보험 데이터를 가져오는 데 실패했습니다."]);
      }
    }
  };

  return (
    <div className="container">
      <div className="content-area">
        {messages.map((message, index) => (
          <div key={index} className="message">
            {message}
          </div>
        ))}
        {messages.length > 0 && (
          <CommandExtractor 
            text={messages[messages.length - 1].replace("AI: ", "")} 
            setCommands={handleCommandExtraction} 
          />
        )}
      </div>

      <div className="bottom-input-section">
        <input
          type="text"
          className="text-input"
          placeholder="답변을 작성해주세요..."
          value={inputText}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
        <button className="submit-button" onClick={handleSubmit}>
          확인
        </button>
      </div>
    </div>
  );
};

export default App;
