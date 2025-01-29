"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import send from "./send.png";
import styles from "./page.module.css";

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    // Scroll to the bottom of the chat history whenever it updates
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleSend = async () => {
    setIsLoading(true);
    
    // Add user message to chat history
    const userMessage = { role: "user", content: inputText };
    setChatHistory((prevHistory) => [...prevHistory, userMessage]);

    try {
      // Send the POST request to your Gemini API
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: inputText }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Something went wrong");
      }

      const data = await response.json();

      // Add the AI response to the chat history
      const aiMessage = { role: "ai", content: data.response };
      setChatHistory((prevHistory) => [...prevHistory, aiMessage]);

    } catch (error) {
      console.error("Error while fetching AI response:", error);
      alert("An error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
      setInputText("");
    }
  };

  return (
    <>
      <div className={styles.logoContainer}>
        <h3>Gemini-1.5-flash</h3>
        <div className={styles.logoMicrosoft}>Google Generative AI</div>
      </div>
      <div className={styles.container}>
        {chatHistory.length === 0 && <h1 className={styles.header}>Hello, Ask Me Anything</h1>}
        <div className={styles.chatContainer} ref={chatContainerRef}>
          {chatHistory.map((message, index) => (
            <div key={index} className={`${styles.message} ${styles[message.role]}`}>
              <div className={message.role === "user" ? styles["message-user-input"] : styles["message-user-output"]}>
                {message.content}
              </div>
            </div>
          ))}
          {isLoading && <div className={styles.dots}></div>}
        </div>
        <div className={styles.inputContainer}>
          <textarea
            name="input-text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Ask me a question..."
            className={styles.input}
            rows={2}
          />
          <Image
            src={send}
            alt="Send"
            width={20}
            height={20}
            className={styles.button}
            onClick={handleSend}
          />
        </div>
      </div>
    </>
  );
}
