import React, { useState, useMemo, useEffect } from "react"; // Dodano useEffect
import {
  Container,
  Card,
  Button,
  Alert,
  ProgressBar,
  ListGroup,
  Form,
  Stack,
} from "react-bootstrap";

// --- Interfejsy ---
interface Question {
  id: number;
  question: string;
  options: Record<string, string>;
  correctAnswer: string;
  points: number;
}
type UserAnswers = Record<number, string>;

// --- Propsy ---
interface QuizTemplateProps {
  title: string;
  quizData: Question[];
}

const shuffleArray = (array: Question[]): Question[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const shuffleOptions = (
  options: Record<string, string>,
  correctKey: string,
): { newOptions: Record<string, string>; newCorrectKey: string } => {
  const originalKeys = Object.keys(options).sort();
  const originalValues = originalKeys.map((key) => options[key]);
  const correctValue = options[correctKey];

  for (let i = originalValues.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [originalValues[i], originalValues[j]] = [
      originalValues[j],
      originalValues[i],
    ];
  }

  const newOptions: Record<string, string> = {};
  let newCorrectKey = "";

  originalKeys.forEach((key, index) => {
    const newValue = originalValues[index];
    newOptions[key] = newValue;
    if (newValue === correctValue) {
      newCorrectKey = key;
    }
  });

  return { newOptions, newCorrectKey };
};

const formatTime = (totalSeconds: number): string => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const paddedMinutes = String(minutes).padStart(2, "0");
  const paddedSeconds = String(seconds).padStart(2, "0");
  return `${paddedMinutes}:${paddedSeconds}`;
};

export const QuizTemplate = ({ title, quizData }: QuizTemplateProps) => {
  const [gameState, setGameState] = useState<"setup" | "playing" | "finished">(
    "setup",
  );
  const [numQuestions, setNumQuestions] = useState(20);
  const [quizSessionQuestions, setQuizSessionQuestions] = useState<Question[]>(
    [],
  );
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswers>({});
  const [isPeeking, setIsPeeking] = useState(false);

  const [elapsedTime, setElapsedTime] = useState(0); // Czas w sekundach
  const [finalTime, setFinalTime] = useState(0); // Końcowy czas do wyświetlenia

  const allShuffledQuestions = useMemo(
    () => shuffleArray(quizData),
    [quizData],
  );
  const totalAvailableQuestions = allShuffledQuestions.length;

  useEffect(() => {
    if (gameState !== "playing") {
      return;
    }

    const intervalId = setInterval(() => {
      setElapsedTime((prevTime) => prevTime + 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [gameState]); 

  const calculateResults = () => {
    let score = 0;
    let totalPoints = 0;
    quizSessionQuestions.forEach((question) => {
      totalPoints += question.points;
      if (userAnswers[question.id] === question.correctAnswer) {
        score += question.points;
      }
    });
    const percentage = totalPoints > 0 ? (score / totalPoints) * 100 : 0;
    const isPassed = percentage > 50;
    return { score, totalPoints, percentage, isPassed };
  };

  const startQuiz = (count: number) => {
    const sessionQuestionsData = allShuffledQuestions.slice(0, count);

    const processedSessionQuestions = sessionQuestionsData.map((question) => {
      const { newOptions, newCorrectKey } = shuffleOptions(
        question.options,
        question.correctAnswer,
      );
      return {
        ...question,
        options: newOptions,
        correctAnswer: newCorrectKey,
      };
    });

    setQuizSessionQuestions(processedSessionQuestions);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    
    setElapsedTime(0);
    setFinalTime(0);

    setGameState("playing");
  };

  const handleNumChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = parseInt(e.target.value, 10);
    if (isNaN(value)) value = 1;
    if (value > totalAvailableQuestions) value = totalAvailableQuestions;
    if (value < 1) value = 1;
    setNumQuestions(value);
  };

  const handleAnswerSelect = (questionId: number, selectedOption: string) => {
    setIsPeeking(false);
    setUserAnswers({
      ...userAnswers,
      [questionId]: selectedOption,
    });
  };

  const handleNextQuestion = () => {
    setIsPeeking(false);
    const nextQuestionIndex = currentQuestionIndex + 1;
    if (nextQuestionIndex < quizSessionQuestions.length) {
      setCurrentQuestionIndex(nextQuestionIndex);
    } else {
      setFinalTime(elapsedTime);
      setGameState("finished");
    }
  };

  const handlePreviousQuestion = () => {
    setIsPeeking(false);
    const prevQuestionIndex = currentQuestionIndex - 1;
    if (prevQuestionIndex >= 0) {
      setCurrentQuestionIndex(prevQuestionIndex);
    }
  };

  const handlePeekAndSelect = () => {
    const question = quizSessionQuestions[currentQuestionIndex];
    if (!question) return;
    setIsPeeking(true);
    const correctKey = question.correctAnswer;
    setUserAnswers({
      ...userAnswers,
      [question.id]: correctKey,
    });
  };

  const restartQuiz = () => {
    setElapsedTime(0);
    setFinalTime(0);
    setGameState("setup");
  };
  if (gameState === "setup") {
    return (
      <Container className="my-4" style={{ maxWidth: "600px" }}>
        <Card>
          <Card.Header as="h2">Witaj w {title}!</Card.Header>
          <Card.Body>
            <Card.Title>Ustawienia Gry</Card.Title>
            <Form.Group className="my-3">
              <Form.Label>
                Wybierz liczbę pytań (Dostępnych: {totalAvailableQuestions})
              </Form.Label>
              <Form.Control
                type="number"
                value={numQuestions}
                onChange={handleNumChange}
                min={1}
                max={totalAvailableQuestions}
              />
            </Form.Group>
            <Stack gap={2}>
              <Button
                variant="primary"
                size="lg"
                onClick={() => startQuiz(numQuestions)}
              >
                Start ({numQuestions} pytań)
              </Button>
              <Button
                variant="outline-danger"
                size="lg"
                onClick={() => startQuiz(totalAvailableQuestions)}
              >
                Jestem Hardcorem! (Wszystkie {totalAvailableQuestions} pytań)
              </Button>
            </Stack>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  // --- Ekran "finished" ---
  if (gameState === "finished") {
    const { score, totalPoints, percentage, isPassed } = calculateResults();
    return (
      <Container className="my-4">
        <Alert variant={isPassed ? "success" : "danger"}>
          <Alert.Heading>Koniec Quizu!</Alert.Heading>
          <p>
            Zdobyłeś {score} na {totalPoints} punktów ({percentage.toFixed(2)}
            %).
          </p>
          <p className="mb-0">
            <strong>Twój czas: {formatTime(finalTime)} ⏱️</strong>
          </p>
          <hr />
          <p className="mb-0">
            {isPassed
              ? "Gratulacje, zdałeś! 🎉"
              : "Niestety, nie udało Ci się zdać. Spróbuj ponownie."}
          </p>
        </Alert>
        <Button variant="primary" onClick={restartQuiz} className="mb-4">
          Wróć do menu
        </Button>
        <h2 className="mt-4">Podsumowanie odpowiedzi</h2>
        {quizSessionQuestions.map((question, index) => {
          const userAnswer = userAnswers[question.id];
          const isCorrectAnswer = userAnswer === question.correctAnswer;
          return (
            <Card key={question.id} className="mb-3">
              <Card.Header>
                Pytanie {index + 1}: {isCorrectAnswer ? "✅ Dobrze" : "❌ Źle"}
              </Card.Header>
              <Card.Body>
                <Card.Text as="h5" className="mb-3">
                  {question.question}
                </Card.Text>
                <ListGroup>
                  {Object.entries(question.options).map(([key, value]) => {
                    const isThisCorrect = key === question.correctAnswer;
                    const isThisUserChoice = key === userAnswer;
                    let variant: "success" | "danger" | "" = "";
                    if (isThisCorrect) {
                      variant = "success";
                    } else if (isThisUserChoice && !isThisCorrect) {
                      variant = "danger";
                    }
                    return (
                      <ListGroup.Item key={key} variant={variant}>
                        {key}: {value}
                      </ListGroup.Item>
                    );
                  })}
                </ListGroup>
              </Card.Body>
            </Card>
          );
        })}
      </Container>
    );
  }

  const currentQuestion = quizSessionQuestions[currentQuestionIndex];
  const selectedAnswer = userAnswers[currentQuestion.id];
  const progress =
    ((currentQuestionIndex + 1) / quizSessionQuestions.length) * 100;

  return (
    <Container className="my-4" style={{ maxWidth: "800px" }}>
      <Alert
        variant="secondary"
        className="text-center py-2"
        style={{ fontSize: "1.5rem", fontWeight: "bold" }}
      >
        Czas: {formatTime(elapsedTime)}
      </Alert>

      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <span>
            Pytanie {currentQuestionIndex + 1} z {quizSessionQuestions.length}
          </span>
          <Button
            variant="outline-info"
            size="sm"
            onClick={handlePeekAndSelect}
            disabled={isPeeking}
          >
            {isPeeking ? "💡 Odpowiedź zaznaczona" : "💡 Pokaż odpowiedź"}
          </Button>
        </Card.Header>

        <Card.Body>
          <Card.Title className="mb-4" style={{ fontSize: "1.25rem" }}>
            {currentQuestion.question}
          </Card.Title>
          <div className="d-grid gap-2">
            {Object.entries(currentQuestion.options).map(([key, value]) => {
              const isThisCorrect = key === currentQuestion.correctAnswer;
              const isUserChoice = selectedAnswer === key;

              let variant = "outline-primary";

              if (isPeeking && isThisCorrect) {
                variant = "success";
              } else if (isUserChoice) {
                variant = "primary";
              }

              return (
                <Button
                  key={key}
                  variant={variant}
                  onClick={() => handleAnswerSelect(currentQuestion.id, key)}
                >
                  {key}: {value}
                </Button>
              );
            })}
          </div>
        </Card.Body>

        <Card.Footer className="d-flex justify-content-between">
          <Button
            variant="outline-secondary"
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
          >
            Poprzednie pytanie
          </Button>
          <Button onClick={handleNextQuestion} disabled={!selectedAnswer}>
            {currentQuestionIndex === quizSessionQuestions.length - 1
              ? "Zakończ Quiz"
              : "Następne pytanie"}
          </Button>
        </Card.Footer>
      </Card>

      <ProgressBar
        now={progress}
        label={`${Math.round(progress)}%`}
        className="mt-3"
        animated
      />
    </Container>
  );
};