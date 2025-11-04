import quizData from "../../Data/ochronaWlasnosci.json";
import { QuizTemplate } from "../QuizTemplate/QuizTemplate.tsx";

// Definiujemy interfejs (lub importujemy go, jeśli masz go w osobnym pliku)
interface Question {
  id: number;
  question: string;
  options: Record<string, string>;
  correctAnswer: string;
  points: number;
}

export const OchronaWlasnosci = () => {
  // 3. Renderujemy szablon, wstrzykując mu nowy tytuł i nowe dane
  return (
    <QuizTemplate
      title="Quiz z Ochrony Własności Intelektualnej"
      quizData={quizData as Question[]}
    />
  );
};
