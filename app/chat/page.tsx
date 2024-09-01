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

  return (
    <div className="chat-container">
      {/* 좌측 및 우측 세로 선 */}
      <div className="left-line"></div>
      <div className="right-line"></div>

      {/* 네비게이션 바 */}
      <header className="navbar">
        <div className="logo">LifeConnection</div>
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

      {/* 채팅 콘텐츠 영역 */}
      <main className="chat-content">
        {/* 채팅 메시지들 */}
        <div className="chat-message user-message">안녕하세요, 집에 가고 싶으세요?</div>
        <div className="chat-message bot-message">간절히 원합니다.</div>
        {/* 더 많은 메시지를 여기에 추가할 수 있습니다 */}
      </main>

      {/* 하단 입력 섹션 */}
      <div className="bottom-input-section">
        <input className="text-input" type="text" placeholder="메시지를 입력하세요..." />
        <button className="submit-button">보내기</button>
      </div>
    </div>
  );
};

export default App;
