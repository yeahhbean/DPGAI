"use client";
import React, { useState } from "react";
import './chat.css'; // CSS 파일을 import 합니다.

const App: React.FC = () => {
  // 드롭다운 메뉴 상태 관리
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // 드롭다운 토글 함수
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const sendMessage = async () => {
    if (!inputValue.trim()) return; // 공백 메시지 전송 방지

    const userMessage = { text: inputValue, sender: "user" };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    // 환경 변수에서 API 키를 가져옵니다.
    const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY; // 환경 변수에서 API 키를 가져옵니다.

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: inputValue }],
      }),
    });

    if (!response.ok) {
      console.error("API 호출 오류:", response.status, response.statusText);
      return;
    }

    const data = await response.json();

    if (data.choices && data.choices.length > 0) {
      const botMessage = {
        text: data.choices[0].message.content,
        sender: "bot",
      };

      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } else {
      console.error("API 응답 형식 오류:", data);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage(); // 엔터키로 전송
      setInputValue("");
      setAvailableQuestions([]); // 카드 제거
    }
  };

  const handlePresetClick = (preset: string) => {
    setInputValue(preset); // 프리셋 클릭 시 입력 필드에 텍스트 추가
    if (inputRef.current) {
      inputRef.current.focus(); // 입력 필드에 포커스 맞추기
    }
  };

  const handleButtonClick = () => {
    sendMessage(); // 버튼 클릭 시 메시지 전송
    setInputValue(""); // 전송 후 입력 필드 초기화
    setAvailableQuestions([]); // 카드 제거
  };

  return (
    <div className="chat-container">
      {/* 좌측 및 우측 세로 선 */}
      <div className="left-line"></div>
      <div className="right-line"></div>

      <header className="navbar">
        <div className="logo">{isMounted ? "라이프 커넥션" : ""}</div>
        <div className="profile-menu">
          <button onClick={toggleDropdown} className="profile-icon">
            {/* 이모티콘 (프로필 이미지) */}
            <span role="img" aria-label="profile">🧑‍💻</span>
          </button>
          {isDropdownOpen && (
            <div className="dropdown-menu">
              <div className="dropdown-content">
                <div className="profile-info">
                  <span role="img" aria-label="profile" className="profile-img">🧑‍💻</span>
                  <p className="email">wangguk@gmail.com</p>
                  <p className="account-type">임시 계정입니다.</p>
                </div>
                <button className="logout-button">로그아웃</button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* 질문 카드 섹션 추가 */}
      <div className="card-container">
        {availableQuestions.map((preset, index) => (
          <div
            key={index}
            className="question-card"
            onClick={() => handlePresetClick(preset)}
          >
            {preset}
          </div>
        ))}
      </div>

      <main className="chat-content" ref={chatContentRef}>
        {messages.map((message, index) => (
          <div key={index} className={`chat-message ${message.sender}-message`}>
            {message.text}
          </div>
        ))}
      </main>

      <div className="bottom-input-section">
        <input className="text-input" type="text" placeholder="메시지를 입력하세요..." />
        <button className="submit-button">보내기</button>
      </div>
    </div>
  );
};

export default App;
