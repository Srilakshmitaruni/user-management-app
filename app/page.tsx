"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { generateDailyPuzzle } from "@/lib/puzzleEngine";
import {
  saveProgress,
  getProgress,
  getAllProgress
} from "@/lib/progressStorage";
import { calculateScore } from "@/lib/scoringEngine";
import { brand } from "../lib/brand";

export default function Home() {
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];

  const [puzzle, setPuzzle] = useState<any>(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [streak, setStreak] = useState(0);
  const [alreadySolved, setAlreadySolved] = useState(false);
  const [heatmapData, setHeatmapData] = useState<string[]>([]);
  const [startTime, setStartTime] = useState(Date.now());
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [scoreDetails, setScoreDetails] = useState<any>(null);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstall, setShowInstall] = useState(false);

  const maxHints = 2;

  function getYesterdayString() {
    const y = new Date();
    y.setDate(today.getDate() - 1);
    return y.toISOString().split("T")[0];
  }

  useEffect(() => {
    async function loadPuzzle() {
      const dailyPuzzle = await generateDailyPuzzle();
      setPuzzle(dailyPuzzle);

      setStartTime(Date.now());
      setWrongAttempts(0);
      setScoreDetails(null);

      const todayProgress = await getProgress(todayStr);
      const yesterdayProgress = await getProgress(getYesterdayString());
      const allProgress = await getAllProgress();

      if (todayProgress?.hintsUsed) {
        setHintsUsed(todayProgress.hintsUsed);
      }

      const solvedDates = allProgress
        .filter(p => p.solved)
        .map(p => p.date);

      setHeatmapData(solvedDates);

      if (todayProgress?.solved) {
        setAlreadySolved(true);
        setStreak(todayProgress.streak);
        setResult("You already solved today's puzzle!");
      } else if (yesterdayProgress?.solved) {
        setStreak(yesterdayProgress.streak);
      } else {
        setStreak(0);
      }
    }

    loadPuzzle();
  }, []);
  // 🔥 Install Prompt Listener
useEffect(() => {
  const handler = (e: any) => {
    e.preventDefault();
    setDeferredPrompt(e);
    setShowInstall(true);
  };

  window.addEventListener("beforeinstallprompt", handler);

  return () => {
    window.removeEventListener("beforeinstallprompt", handler);
  };
}, []);
// 🔥 Service Worker Registration
useEffect(() => {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("/sw.js")
      .then(() => console.log("SW registered"))
      .catch((err) =>
        console.log("SW registration failed", err)
      );
  }
}, []);

  const getHintText = () => {
    if (!puzzle) return "";

    if (puzzle.type === "sequence")
      return "Hint: Check the difference between consecutive numbers.";

    if (puzzle.type === "pattern")
      return "Hint: Look for repeating or alternating patterns.";

    if (puzzle.type === "deduction")
      return "Hint: One clue directly confirms ownership.";

    return "";
  };

  const handleHint = async () => {
    if (hintsUsed >= maxHints || alreadySolved) return;

    const newHintCount = hintsUsed + 1;
    setHintsUsed(newHintCount);

    await saveProgress({
      date: todayStr,
      solved: false,
      streak: streak,
      hintsUsed: newHintCount
    });
  };

  const handleSubmit = async () => {
    if (!puzzle || alreadySolved) return;

    let isCorrect = false;

    if (typeof puzzle.data.correctAnswer === "number") {
      isCorrect =
        Number(userAnswer) === puzzle.data.correctAnswer;
    } else {
      isCorrect =
        userAnswer.trim() === puzzle.data.correctAnswer;
    }

    if (isCorrect) {
      const endTime = Date.now();

      const score = calculateScore(
        startTime,
        endTime,
        streak,
        wrongAttempts + hintsUsed
      );

      const newStreak = streak + 1;

      setScoreDetails(score);
      setStreak(newStreak);
      setAlreadySolved(true);
      setResult("Correct! Well done.");

      await saveProgress({
        date: todayStr,
        solved: true,
        streak: newStreak,
        hintsUsed
      });

    } else {
      setWrongAttempts(prev => prev + 1);
      setResult("Incorrect. Try again.");
    }
  };
  const handleInstall = async () => {
  if (!deferredPrompt) return;

  deferredPrompt.prompt();
  const choiceResult = await deferredPrompt.userChoice;

  if (choiceResult.outcome === "accepted") {
    setShowInstall(false);
  }

  setDeferredPrompt(null);
};


  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "20px",
        background: brand.light,
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          width: "100%",
          maxWidth: "700px",
          padding: "30px",
          borderRadius: "16px",
          background: brand.white,
          color: brand.textDark,
          boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
        }}
      >
        <h1 style={{ textAlign: "center", color: brand.primary }}>
          Logic Looper
        </h1>
        {showInstall && (
  <div style={{ textAlign: "center", marginTop: "10px" }}>
    <button
      onClick={handleInstall}
      style={{
        padding: "8px 20px",
        borderRadius: "8px",
        border: "none",
        background: brand.primaryAlt,
        color: brand.white,
        cursor: "pointer"
      }}
    >
      Install App
    </button>
  </div>
)}
        <motion.p
          key={streak}
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
          style={{ textAlign: "center", marginTop: "10px" }}
        >
          🔥 Streak: {streak}
        </motion.p>

        {/* Heatmap */}
        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <h3>Activity (Last 30 Days)</h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(10, 20px)",
              gap: "5px",
              justifyContent: "center",
              marginTop: "10px"
            }}
          >
            {Array.from({ length: 30 }).map((_, index) => {
              const date = new Date();
              date.setDate(date.getDate() - index);
              const dateStr = date.toISOString().split("T")[0];
              const solved = heatmapData.includes(dateStr);

              return (
                <div
                  key={index}
                  style={{
                    width: "20px",
                    height: "20px",
                    background: solved
                      ? brand.primaryAlt
                      : brand.softBlue,
                    borderRadius: "4px"
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* Puzzle */}
        <div style={{ marginTop: "30px", textAlign: "center" }}>
          {puzzle?.type === "sequence" && (
            <h2>{puzzle.data.sequence.join(" , ") + " , ?"}</h2>
          )}

          {puzzle?.type === "pattern" && (
            <h2>{puzzle.data.grid.join("  ")}</h2>
          )}

          {puzzle?.type === "deduction" && (
            <div>
              {puzzle.data.clues.map(
                (clue: string, index: number) => (
                  <p key={index}>{clue}</p>
                )
              )}
              <h3>{puzzle.data.question}</h3>
            </div>
          )}
        </div>

        {/* Input */}
        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <input
            type="text"
            placeholder="Your Answer"
            value={userAnswer}
            onChange={e => setUserAnswer(e.target.value)}
            disabled={alreadySolved}
            style={{
              padding: "10px",
              borderRadius: "8px",
              border: `1px solid ${brand.primary}`,
              width: "100%",
              maxWidth: "300px"
            }}
          />

          <br />

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmit}
            disabled={alreadySolved}
            style={{
              marginTop: "15px",
              padding: "10px 25px",
              borderRadius: "8px",
              border: "none",
              background: brand.primary,
              color: brand.white,
              cursor: "pointer"
            }}
          >
            Submit
          </motion.button>

          <br />

          <button
            onClick={handleHint}
            disabled={hintsUsed >= maxHints || alreadySolved}
            style={{
              marginTop: "10px",
              padding: "8px 20px",
              borderRadius: "8px",
              border: "none",
              background:
                hintsUsed >= maxHints
                  ? brand.softBlue
                  : brand.accent,
              color: brand.white,
              cursor:
                hintsUsed >= maxHints
                  ? "not-allowed"
                  : "pointer"
            }}
          >
            💡 Hint ({maxHints - hintsUsed} left)
          </button>
        </div>

        {result && (
          <p
            style={{
              marginTop: "20px",
              textAlign: "center",
              color:
                result.includes("Correct")
                  ? brand.primary
                  : brand.alert
            }}
          >
            {result}
          </p>
        )}

        {hintsUsed > 0 && !alreadySolved && (
          <div
            style={{
              marginTop: "15px",
              padding: "10px",
              background: brand.backgroundLight,
              borderRadius: "8px"
            }}
          >
            {getHintText()}
          </div>
        )}

        {scoreDetails && (
          <div style={{ marginTop: "20px" }}>
            <h3>Score Breakdown</h3>
            <p>⏱ {scoreDetails.timeTaken}s</p>
            <p>⚡ Time Bonus: {scoreDetails.timeBonus}</p>
            <p>🔥 Streak Bonus: {scoreDetails.streakBonus}</p>
            <p>❌ Penalty: -{scoreDetails.penalty}</p>
            <h2 style={{ color: brand.primary }}>
              Final Score: {scoreDetails.finalScore}
            </h2>
          </div>
        )}
      </motion.div>
    </div>
  );
}
