import quizData from "../../Data/Ekonomia.json";
import { QuizTemplate } from "../QuizTemplate/QuizTemplate.tsx";

interface Question {
  id: number;
  question: string;
  options: Record<string, string>;
  correctAnswer: string;
  points: number;
}

export const Ekonomia1 = () => {
  return (
    <QuizTemplate title="Quiz Ekonomiczny" quizData={quizData as Question[]} />
  );
};
