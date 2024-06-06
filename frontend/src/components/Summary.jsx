/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import CompltedImage from "../assets/image/completedQuiz.png";
import { updatePlayer } from "./api";

const Summary = ({ userAnswers, QUESTIONS }) => {
  const [updateScore, setUpdateScore] = useState({});
  const navigate = useNavigate();
  const skippedAnswers = userAnswers.filter((answer) => answer === null);
  const answeredCorrectly = userAnswers.filter(
    (answer, index) => answer === QUESTIONS[index].answers[0]
  );

  const skippedAnswerPercent = Math.round(
    (skippedAnswers.length / userAnswers.length) * 100
  );

  const answeredCorrectlyPercent = Math.round(
    (answeredCorrectly.length / userAnswers.length) * 100
  );

  const answeredWronglyPercent =
    100 - (answeredCorrectlyPercent + skippedAnswerPercent);

  // const skippedAnswerpercent = skippedAnswers/userAnswers.length

  // redirect the user once finish playing

  useEffect(() => {
    async function updateFun() {
      const updateValue = {
        score: answeredCorrectlyPercent,
      };
      const updateResult = await updatePlayer(updateValue);
      setUpdateScore(updateResult);
    }

    updateFun();
  }, [answeredCorrectlyPercent]);

  console.log(updateScore.success);

  setTimeout(() => {
    if (
      updateScore.success !== undefined &&
      updateScore.success === true &&
      userAnswers.length === 7
    ) {
      navigate("/");
      localStorage.removeItem("user");
    }
  }, 3000);

  return (
    <>
      <div id="summary">
        <img src={CompltedImage} alt="Completed quiz" />
        <h2>Quiz Completed</h2>
        <div id="summary-stats">
          <p>
            <span className="number">{skippedAnswerPercent}%</span>
            <span className="text">Skipped</span>
          </p>
          <p>
            <span className="number">{answeredCorrectlyPercent}%</span>
            <span className="text">Answered Correctly</span>
          </p>
          <p>
            <span className="number">{answeredWronglyPercent}%</span>
            <span className="text">Answered Incorrectly</span>
          </p>
        </div>
        <ol>
          {userAnswers.map((answer, index) => {
            let cssClass = "user-answer";
            if (answer === QUESTIONS[index].answers[0]) {
              cssClass += " correct";
            } else if (answer === null) {
              cssClass += " skipped";
            } else {
              cssClass += " wrong";
            }
            return (
              <li key={index}>
                <h3>{index + 1}</h3>
                <p className="question">{QUESTIONS[index].text}</p>
                <p className={cssClass}>{answer ?? "SKIPPED"}</p>
              </li>
            );
          })}
        </ol>
      </div>
    </>
  );
};

export default Summary;
