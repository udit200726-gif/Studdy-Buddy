import {
  BookOpen,
  Brain,
  ClipboardList,
  Lightbulb,
} from "lucide-react";

const cards = [
  {
    icon: <Lightbulb size={22} />,
    title: "Explain a Concept",
    desc: "Break difficult topics into simple language.",
    prompt: "Explain this topic in simple language:\n",
  },
  {
    icon: <Brain size={22} />,
    title: "Quiz Me",
    desc: "Generate questions to test yourself.",
    prompt: "Create a quiz on:\n",
  },
  {
    icon: <BookOpen size={22} />,
    title: "Flashcards",
    desc: "Create quick revision flashcards.",
    prompt: "Create flashcards for:\n",
  },
  {
    icon: <ClipboardList size={22} />,
    title: "Study Plan",
    desc: "Build a personalized study schedule.",
    prompt: "Create a study plan for:\n",
  },
];

function PromptCards({ onPrompt }) {
  return (
    <div className="mt-5 grid w-full max-w-3xl grid-cols-2 gap-4">
      {cards.map((card, index) => (
        <div
          key={index}
          onClick={() => onPrompt(card.prompt)}
          className="cursor-pointer rounded-xl border-2 border-black bg-white p-4 shadow-[4px_4px_0px_#000] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
        >
          <div className="mb-2">{card.icon}</div>

          <h3 className="text-xl font-black">
            {card.title}
          </h3>

          <p className="mt-1 text-sm text-gray-600 leading-5">
            {card.desc}
          </p>
        </div>
      ))}
    </div>
  );
}

export default PromptCards;