"use client"
import React from "react";
import './globals.css'; // CSS 파일을 import 합니다.

const App: React.FC = () => {
  return (
    <div className="container">
      {/* 네비게이션 바 */}
      <header className="navbar">
        <div className="logo">LifeConnection</div>
        <div className="nav-buttons">
          <button className="nav-button">로그인</button>
          <button className="nav-button">회원가입</button>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="main-content">
        <h1 className="main-title">
          최적의 보험 솔루션 <br />
          <span className="highlight">라이프커넥션과 빠르고 간편하게</span>
        </h1>
        <button className="main-button">보험 추천 받으러 가기</button>
      </main>
    </div>
  );
};

export default App;
