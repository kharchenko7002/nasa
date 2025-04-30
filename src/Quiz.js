import React, { useEffect, useState } from "react";
import axios from "axios";

const NASA_API_KEY = "DEMO_KEY"; // Замени позже на свой ключ
const APOD_URL = `https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}`;

const Quiz = () => {
  const [questionData, setQuestionData] = useState(null);
  const [userAnswer, setUserAnswer] = useState(null);

  useEffect(() => {
    fetchAPOD();
  }, []);

  const fetchAPOD = async () => {
    try {
      const res = await axios.get(APOD_URL);
      setQuestionData(res.data);
    } catch (error) {
      console.error("Ошибка при получении данных NASA:", error);
    }
  };

  const handleAnswer = (answer) => {
    setUserAnswer(answer);
  };

  if (!questionData) return <div>Загрузка...</div>;

  const correctAnswer = "Космический объект из описания";
  const options = [
    correctAnswer,
    "Луна",
    "Юпитер",
    "Галактика Андромеды"
  ].sort(() => Math.random() - 0.5);

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2>Викторина NASA</h2>
      <img src={questionData.url} alt="NASA APOD" style={{ maxWidth: "100%", height: "auto" }} />
      <p><strong>Вопрос:</strong> Что изображено на этой фотографии?</p>
      {options.map((opt, idx) => (
        <button key={idx} onClick={() => handleAnswer(opt)} style={{ margin: "0.5rem" }}>
          {opt}
        </button>
      ))}
      {userAnswer && (
        <p style={{ marginTop: "1rem" }}>
          {userAnswer === correctAnswer ? "✅ Правильно!" : "❌ Неправильно!"}
        </p>
      )}
    </div>
  );
};

export default Quiz;
