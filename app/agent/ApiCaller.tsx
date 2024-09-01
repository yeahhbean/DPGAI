"use client";
import React, { useEffect, useState } from 'react';

interface ApiCallerProps {
  command: string;
}

const ApiCaller: React.FC<ApiCallerProps> = ({ command }) => {
  const [report, setReport] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await fetch(`/api/report?command=${encodeURIComponent(command)}`);
        if (!response.ok) {
          throw new Error('Failed to fetch report');
        }
        const data = await response.text(); // JSON 대신 텍스트로 읽기
        setReport(data);
      } catch (err) {
        setError(`보고서를 불러오는 데 실패했습니다: ${err}`);
      }
    };

    if (command) {
      fetchReport();
    }
  }, [command]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!report) {
    return <div>보고서를 불러오는 중...</div>;
  }

  return (
    <div>
      <h3>보고서: {command}</h3>
      <pre>{report}</pre>
    </div>
  );
};

export default ApiCaller;
