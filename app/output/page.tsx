"use client"
import React from 'react';
import './output.css';

const InsuranceRecommendation = () => {
  return (
    <div className="container">
      <div className="header">
        <h2 className="title">추천드리는 보험 목록입니다.</h2>
        <p className="subtitle">
          주의: 현재 API는 테스트 중이기 때문에 dummy 데이터를 사용하여 추천 드리고 있습니다.
        </p>
      </div>

      {[1, 2, 3].map((_, index) => (
        <div key={index} className="insurance-box">
          <p className="insurance-title">1. 라이프 보험</p>
          <div className="content-box large-box"></div>
          <div className="content-box"></div>
          <p className="additional-info">추가 정보</p>
          <div className="content-box"></div>
          <div className="button-group">
            <button className="link-button">마음에 드셨나요? [신청하러 가기]</button>
            <button className="link-button">마음에 들지 않으셨나요? [다시 추천 받기]</button>
          </div>
        </div>
      ))}

      <div className="footer">
        <button className="back-button">처음으로 돌아가기</button>
      </div>
    </div>
  );
};

export default InsuranceRecommendation;
