import { motion } from "framer-motion";

function Hero() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center text-center"
    >
      <div className="mb-4 rounded-full border-2 border-black bg-cyan-200 px-5 py-2 font-bold shadow-[4px_4px_0px_#000]">
        ✨ YOUR AI TUTOR
      </div>

      <h1 className="text-5xl font-black leading-tight">

        Learn{" "}
        <span className="border-2 border-black bg-yellow-300 px-3">
          anything.
        </span>

        <br />

        Ask{" "}
        <span className="border-2 border-black bg-pink-300 px-3">
          everything.
        </span>

      </h1>

      <p className="mt-5 max-w-2xl text-lg text-gray-600">
        Get explanations, quizzes, flashcards and personalized study plans.
      </p>

    </motion.div>
  );
}

export default Hero;