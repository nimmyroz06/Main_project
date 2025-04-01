import React, { useState, useEffect } from "react";
import axios from "axios";
import UserNavbar from "./UserNavbar";

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get("http://localhost:5000/quiz");
      setQuestions(response.data);
      setCurrentQuestion(0);
      setScore(0);
      setQuizFinished(false);
    } catch (error) {
      console.error("Error fetching quiz questions:", error);
    }
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  const handleNextQuestion = () => {
    if (selectedOption === questions[currentQuestion].answer) {
      setScore(score + 1);
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption("");
    } else {
      setQuizFinished(true);
    }
  };

  return (
    <div>
      <UserNavbar/>
    
    <div style={styles.page}>
      <div style={styles.container}>
        {!quizFinished ? (
          questions.length > 0 ? (
            <>
              <h2 style={styles.title}>Trivia Quiz</h2>
              <p style={styles.question}>{questions[currentQuestion].question}</p>
              <div style={styles.options}>
                {questions[currentQuestion].options.map((option, index) => (
                  <button
                    key={index}
                    style={selectedOption === option ? styles.selectedOption : styles.option}
                    onClick={() => handleOptionSelect(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
              <button onClick={handleNextQuestion} style={styles.nextButton} disabled={!selectedOption}>
                {currentQuestion < questions.length - 1 ? "Next Question" : "Finish Quiz"}
              </button>
            </>
          ) : (
            <p>Loading questions...</p>
          )
        ) : (
          <>
            <h2 style={styles.title}>Quiz Completed!</h2>
            <p style={styles.score}>Your Score: {score} / {questions.length}</p>
            <button onClick={fetchQuestions} style={styles.restartButton}>Retry</button>
          </>
        )}
      </div>
    </div>
    </div>
  );
};

// CSS Styles
const styles = {
  page: {
    backgroundColor: "#dcedc8",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    textAlign: "center",
    padding: "40px",
    maxWidth: "450px",
    backgroundColor: "#E8F5E9",
    borderRadius: "10px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
  },
  title: {
    color: "#2e7d32",
    fontSize: "28px",
    fontWeight: "bold",
  },
  question: {
    fontSize: "18px",
    color: "#388e3c",
    margin: "20px 0",
  },
  options: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  option: {
    padding: "10px",
    fontSize: "16px",
    backgroundColor: "#81c784",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    color: "white",
    transition: "0.3s",
  },
  selectedOption: {
    padding: "10px",
    fontSize: "16px",
    backgroundColor: "#2e7d32",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    color: "white",
    fontWeight: "bold",
  },
  nextButton: {
    marginTop: "20px",
    padding: "10px 15px",
    backgroundColor: "#2e7d32",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
  },
  score: {
    fontSize: "20px",
    color: "#2e7d32",
    fontWeight: "bold",
  },
  restartButton: {
    marginTop: "15px",
    padding: "10px 15px",
    backgroundColor: "#d32f2f",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
  },
};

export default Quiz;
