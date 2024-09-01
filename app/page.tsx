"use client"
import React, { useState } from "react";
import Link from "next/link"; // Link 컴포넌트를 import 합니다.
import './globals.css'; // CSS 파일을 import 합니다.

const App: React.FC = () => {
  // 드롭다운 메뉴 상태 관리
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="container">
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

      {/* 메인 콘텐츠 */}
      <main className="main-content">
        <h1 className="main-title">
          최적의 보험 솔루션 <br />
          <span className="highlight">라이프커넥션과 빠르고 간편하게</span>
        </h1>
        <Link href="/chat"> {/* Link 컴포넌트 사용 */}
          <button className="main-button">보험 추천 받으러 가기</button>
        </Link>
      </main>
    </div>
  );
};

export default App;
