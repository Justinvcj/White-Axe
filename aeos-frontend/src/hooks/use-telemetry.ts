import { useState, useCallback } from "react";

export function useTelemetry() {
  const [startTime, setStartTime] = useState<number>(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [answerChanges, setAnswerChanges] = useState(0);

  const startTracking = useCallback(() => {
    setStartTime(Date.now());
    setHintsUsed(0);
    setAnswerChanges(0);
  }, []);

  const logHintClick = useCallback(() => {
    setHintsUsed((prev) => prev + 1);
  }, []);

  const logAnswerChange = useCallback(() => {
    setAnswerChanges((prev) => prev + 1);
  }, []);

  const getPayload = useCallback(() => {
    const endTime = Date.now();
    const timeTakenMs = endTime - startTime;
    return {
      time_taken_ms: timeTakenMs,
      time_taken_seconds: timeTakenMs / 1000,
      hints_used: hintsUsed,
      click_stream_changes: answerChanges,
    };
  }, [startTime, hintsUsed, answerChanges]);

  return {
    startTracking,
    logHintClick,
    logAnswerChange,
    getPayload,
  };
}
