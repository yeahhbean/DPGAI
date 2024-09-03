"use client";
import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from 'react-markdown';
import './chat.css';

const SYSTEM_PROMPT = `당신은 최고의 운전자 보험 설계사입니다. 질문자는 정보취약계층입니다. 자세하고 쉽게 설명해야 합니다. 사용자의 궁금증을 해결하면서 필수 질문을 자연스럽게 유도하세요. 질문은 한번에 하나만 하세요.** 

선택 질문은 필요하지 않다면 물어보지 마세요. 사용자의 질문에 성실히 답하며, 보험과 전혀 연관이 없는 질문 (예: 수학, 코딩 등등)은 답하지 마세요. 필요한 도구가 있다면 답변의 끝 부분에 [end]태그를 감싸고 사용할 도구를 작성하세요 예: [end] [api호출명] [/end] 두 개 이상의 api가 필요시 공백으로 구분하세요. 
상품목록검색 후엔 상품 결정단계 입니다. 상품결정 단계에서 유저가 다른 상품을 원하면 대화기록에 존재하는 상품목록 정보를 통해 다른 상품을 추천해주세요. 유저가 상품을 선택할때는 정확한 상품명을 고지하지 않을것입니다 유저가 말한 정보를 바탕으로 유저가 어떤 상품을 선택했는지 추측해서 고지하세요.

목표: 사용자의 보험 니즈를 파악하고 필요한 정보를 수집한 후, 적절한 API를 호출해 사용자에게 도움이 되는 답변을 제출해야합니다.
조건: 사용자의 니즈를 파악하기 위한 필수 질문을 모두 해야합니다.

사용가능 API: 상품목록검색, 상품요약서검색** 

상품목록검색 api호출명: [상품목록검색]
사용방법: [성별] [우선순위] 태그를 매개변수로 받습니다. 사용자가 가격이 중요하다고 하면 가격을 우선순위로 두세요. 예:[가격우선], 반대로 보장 범위가 중요하다고 하면 [보장우선]으로 설정하세요.
예시: [상품목록검색] [남] [가격우선]
상품목록검색은 한번씩만 사용하세요. 상품목록검색을 사용하면 상품요약서검색을 사용할 수 있습니다.
상품요약서검색 api호출명: [상품요약서검색] [상품명]
사용방법: [상품명]을 매개변수로 받습니다. 상품명은 상품목록검색에서 제공된 상품명을 사용하세요. 주의사항: 상품명 뒤에 있는 모든 글자와 기호를 출력하세요. 공백도 유지해야 합니다. 예시 [(무) 메리츠 다이렉트 운전자보험2404] 또는 [무배당 하나 가득담은 운전자보험(다이렉트)(2404)] 대괄호안에 상품명을 입력하세요.

검색할 수 있는 상품목록은 다음과 같습니다: 4세대, 간병치매, 기타, 노후실손의료, 반려견묘, 암, 어린이, 운전자, 유병력자실손, 종합, 질병, 화재.

도구를 사용할 떄도 시작은 [end]로 끝은 [/end]로 감싸세요. 예: [end] [상품목록검색] [/end]
성별은 [남], [여]로 입력하세요. 나이는 숫자로 입력하세요. 우선순위는 [가격우선], [보장우선]으로 입력하세요. 보험종류는 위에 나열된 상품 중 하나로 입력하세요. 항상 end 태그 내에서는
대괄호를 사용해야합니다.

### 필수 질문 목록:

2. 성별 : 남성 또는 여성 (보험료 차이가 있을 수 있음)
3. 나이 : 정확한 연령 (보험료 산출에 중요한 요소)
5. 건강 상태 : 현재 건강 상태는 어떤가요? (예: 건강함, 경미한 질병, 중증 질환 등)
6. 흡연 여부 : 비흡연 또는 흡연 (흡연자는 보험료가 높아질 수 있음)
7. 우선순위 : 보험료가 저렴한걸 원하시나요? 아니면 보장 범위가 넓은걸 원하시나요?
8. 특약 가입 여부 : 추가 보장 옵션의 필요 여부
9. 보험 가입 기간 : 가입하고자 하는 기간 (예: 1년, 5년, 평생 등)

### 선택적 질문 목록:

4. 직업 : 현재 직업 (위험도가 다를 수 있음)
1. 가족력 : 가족 내 유전적 질병의 위험성 (예: 고혈압, 당뇨병 등)
2. 기타 건강 관련 정보 : 최근 건강 검진 결과 등 (예: 정상, 이상 소견 등)
3. 재정 상황 : 보험료 납입 능력 및 예산 (예: 월 10만 원 이하, 20만 원 이상 등)
4. 보험 가입 경험 : 이전에 가입한 보험의 종류 및 경험 (예: 생명보험, 건강보험 등)
5. 특정 보장 항목에 대한 선호도 : 특정 질병에 대한 보장 선호 (예: 암, 심혈관 질환 등)`;

const extractApiCalls = (text: string): string[] => {
  const regex = /\[end\]\s*(.*?)\s*\[\/end\]/g;
  const apiCalls: string[] = [];
  let match;

  while ((match = regex.exec(text)) !== null) {
    const apiCallContent = match[1].trim();
    const cleanedApiCall = apiCallContent.replace(/\[|\]/g, '');
    apiCalls.push(cleanedApiCall);
  }

  return apiCalls;
};

const handleProductSummarySearch = async (productName: string) => {
  try {
    const encodedProductName = encodeURIComponent(productName);
    const response = await fetch(`/api/ProductSummary?productName=${encodedProductName}`);
    if (response.ok) {
      const summary = await response.text();
      return summary;
    } else {
      console.error(`상품 요약서 가져오기 실패. 상태 코드: ${response.status}`);
      return null;
    }
  } catch (error) {
    console.error("상품 요약서 검색 중 오류 발생:", error);
    return null;
  }
};


const App: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [messages, setMessages] = useState<{ text: string; sender: string }[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);

  const [userChatHistory, setUserChatHistory] = useState<{ role: string; content: string }[]>([]);
  const [productListInfo, setProductListInfo] = useState<string | null>(null);
  const [productSummaryInfo, setProductSummaryInfo] = useState<string | null>(null);

  const chatContentRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (chatContentRef.current) {
      chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
    }
  }, [messages]);

  const getCombinedChatHistory = () => {
    let combinedHistory = [...userChatHistory];
    if (productListInfo) {
      combinedHistory.push({ role: "system", content: `상품 목록 정보: ${productListInfo}` });
    }
    if (productSummaryInfo) {
      combinedHistory.push({ role: "system", content: `상품 요약서 정보: ${productSummaryInfo}` });
    }
    return combinedHistory;
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const sendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = { role: "user", content: inputValue };
    setUserChatHistory((prevHistory) => [...prevHistory, userMessage]);

    setMessages((prevMessages) => [...prevMessages, { text: inputValue, sender: "user" }]);

    const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

    const fetchOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...getCombinedChatHistory(),
          userMessage,
        ],
        stream: true,
      }),
    };

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", fetchOptions);
      const reader = response.body?.getReader();
      const decoder = new TextDecoder("utf-8");
      
      setIsStreaming(true);
      let botMessageText = "";

      while (true) {
        const { done, value } = await reader!.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");
        const parsedLines = lines
          .map((line) => line.replace(/^data: /, "").trim())
          .filter((line) => line !== "" && line !== "[DONE]")
          .map((line) => JSON.parse(line));

        for (const parsedLine of parsedLines) {
          const { choices } = parsedLine;
          const { delta } = choices[0];
          const { content } = delta;
          if (content) {
            botMessageText += content;
            setMessages((prevMessages) => {
              const lastMessage = prevMessages[prevMessages.length - 1];
              if (lastMessage && lastMessage.sender === "bot") {
                const updatedMessages = [...prevMessages];
                updatedMessages[updatedMessages.length - 1] = {
                  ...lastMessage,
                  text: botMessageText
                };
                return updatedMessages;
              } else {
                return [...prevMessages, { text: botMessageText, sender: "bot" }];
              }
            });
          }
        }
      }

      setIsStreaming(false);

      const apiCalls = extractApiCalls(botMessageText);
      console.log("추출된 API 호출:", apiCalls);  

      for (const apiCall of apiCalls) {
        if (apiCall.startsWith("상품목록검색")) {
          const args = apiCall.split(' ');
          if (args.length >= 3) {
            const gender = args[1];
            const priority = args[2];

            try {
              const productListResponse = await fetch(`/api/ProductList?gender=${gender}&priority=${priority}`);
              if (productListResponse.ok) {
                const productList = await productListResponse.text();
                setProductListInfo(productList);
                
                const aiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}`,
                  },
                  body: JSON.stringify({
                    model: "gpt-4o-mini",
                    messages: [
                      { role: "system", content: SYSTEM_PROMPT },
                      ...getCombinedChatHistory(),
                      { role: "user", content: "다음은 요청한 상품 목록입니다. 이를 바탕으로 사용자에게 적절한 답변을 제공해주세요. 사용자의 정보와 요구에 따라 예상 보험료를 계산하고, 추천한 이유를 설명하세요. 보험 상품은 총 3개 추천해야 하며, 가능하면 각각 다른회사로 추천하세요." }
                    ],
                  }),
                });

                if (aiResponse.ok) {
                  const aiData = await aiResponse.json();
                  if (aiData.choices && aiData.choices.length > 0) {
                    const aiBotMessage = {
                      text: aiData.choices[0].message.content,
                      sender: "bot",
                    };
                    setMessages((prevMessages) => [...prevMessages, aiBotMessage]);
                    setUserChatHistory((prevHistory) => [...prevHistory, { role: "assistant", content: aiBotMessage.text }]);
                  }
                }
              } else {
                setMessages((prevMessages) => [...prevMessages, { text: "상품 목록을 가져오는 데 실패했습니다.", sender: "bot" }]);
              }
            } catch (error) {
              console.error("API 호출 중 오류 발생:", error);
              setMessages((prevMessages) => [...prevMessages, { text: "상품 목록을 처리하는 중 오류가 발생했습니다.", sender: "bot" }]);
            }
          }
        }
        if (apiCall.startsWith("상품요약서검색")) {
          const productName = apiCall.split(' ').slice(1).join(' ').trim();
          if (productName) {
            const summary = await handleProductSummarySearch(productName);
            if (summary) {
              setProductListInfo(null);
              setProductSummaryInfo(summary);

              const aiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${apiKey}`,
                },
                body: JSON.stringify({
                  model: "gpt-4o-mini",
                  messages: [
                    { role: "system", content: SYSTEM_PROMPT },
                    ...getCombinedChatHistory(),
                    { role: "user", content: `다음은 요청한 상품 '${productName}'의 요약서입니다. 이를 바탕으로 중요한 보장사항과 주의해야할 점 등 사용자에게 적절한 설명을 제공해주세요:` }
                  ],
                }),
              });
          
              if (aiResponse.ok) {
                const aiData = await aiResponse.json();
                if (aiData.choices && aiData.choices.length > 0) {
                  const aiBotMessage = {
                    text: aiData.choices[0].message.content,
                    sender: "bot",
                  };
                  setMessages((prevMessages) => [...prevMessages, aiBotMessage]);
                  setUserChatHistory((prevHistory) => [...prevHistory, { role: "assistant", content: aiBotMessage.text }]);
                }
              }
            } else {
              setMessages((prevMessages) => [...prevMessages, { text: "상품 요약서를 가져오는 데 실패했습니다.", sender: "bot" }]);
            }
          }
        }
      }
    } catch (error) {
      console.error("API 호출 중 오류 발생:", error);
      setMessages((prevMessages) => [...prevMessages, { text: "오류가 발생했습니다.", sender: "bot" }]);
    }

    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleButtonClick = () => {
    sendMessage();
  };

  return (
    <div className="chat-container">
      <div className="left-line"></div>
      <div className="right-line"></div>

      <header className="navbar">
        <div className="logo">{isMounted ? "라이프 커넥션" : ""}</div>
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

      <main className="chat-content" ref={chatContentRef}>
        {messages.map((message, index) => (
          <div key={index} className={`chat-message ${message.sender}-message`}>
            <ReactMarkdown>{message.text}</ReactMarkdown>
          </div>
        ))}
      </main>

      <div className="bottom-input-section">
        <input
          ref={inputRef}
          className="text-input"
          type="text"
          placeholder="메시지를 입력하세요..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button className="submit-button" onClick={handleButtonClick}>
          보내기
        </button>
      </div>
    </div>
  );
};

export default App;