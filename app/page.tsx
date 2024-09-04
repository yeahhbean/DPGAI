"use client";
import React, { useState } from "react";
import { useRouter } from 'next/navigation';
import './globals.css';

const App: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleGoToChat = () => {
    router.push('/chat');
  };

  return (
    <div className="container" style={{ 
      backgroundImage: "url('./background_main_up.jpg')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      height: "100vh"
    }}>
      <header className="navbar">
        <div className="logo">라이프 커넥션</div>
        <div className="profile-menu">
          <button onClick={toggleDropdown} className="profile-icon">
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

      <main className="main-content">
        <h1 className="main-title">
          최적의 보험 솔루션 <br />
          <span className="highlight">라이프커넥션과 빠르고 간편하게</span>
        </h1>
        <button className="main-button" onClick={handleGoToChat}>보험 추천 받으러 가기</button>
      </main>
    </div>
  );
};

export default App;
