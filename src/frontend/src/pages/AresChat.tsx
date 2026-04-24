import { Link } from "@tanstack/react-router";
import { ArrowLeft, Bot, Send, Trash2 } from "lucide-react";
import { useRef, useState } from "react";
import type {
  ExerciseHowTo,
  LocalMessage,
  PersonalityMode,
} from "../hooks/useAres";
import { useAres } from "../hooks/useAres";

// ─── Sub-components ────────────────────────────────────────────────────────────

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 max-w-[85%]">
      <div className="w-8 h-8 rounded-full bg-[#39FF14]/20 border border-[#39FF14]/40 flex items-center justify-center flex-shrink-0 text-sm font-bold text-[#39FF14]">
        A
      </div>
      <div className="bg-white/5 border border-[#00AAFF]/20 rounded-2xl rounded-bl-sm px-4 py-3">
        <div className="flex gap-1.5 items-center h-4">
          <span className="w-2 h-2 rounded-full bg-[#39FF14]/70 animate-bounce [animation-delay:0ms]" />
          <span className="w-2 h-2 rounded-full bg-[#39FF14]/70 animate-bounce [animation-delay:150ms]" />
          <span className="w-2 h-2 rounded-full bg-[#39FF14]/70 animate-bounce [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  );
}

function ExerciseCard({ data }: { data: ExerciseHowTo }) {
  const [showVideo, setShowVideo] = useState(false);
  return (
    <div className="mt-2 rounded-xl border border-[#00AAFF]/25 bg-white/[0.03] overflow-hidden">
      <div className="px-4 py-3 border-b border-white/10">
        <p className="text-white font-semibold text-sm">{data.name}</p>
      </div>
      <div className="px-4 py-3 space-y-2">
        <ol className="space-y-1.5">
          {data.steps.map((step, i) => (
            <li
              key={step}
              className="flex gap-2 text-xs text-white/80 leading-relaxed"
            >
              <span className="flex-shrink-0 w-4 h-4 rounded-full bg-[#00AAFF]/20 text-[#00AAFF] text-[10px] font-bold flex items-center justify-center mt-0.5">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
        <div className="pt-1 space-y-1">
          <p className="text-xs text-[#39FF14]/90">
            <span className="font-semibold">Tip:</span> {data.tip}
          </p>
          <p className="text-xs text-amber-400/90">
            <span className="font-semibold">Common mistake:</span>{" "}
            {data.mistake}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowVideo((v) => !v)}
          className="mt-1 text-xs text-[#00AAFF] hover:text-[#00AAFF]/80 underline transition-colors"
        >
          {showVideo ? "Hide video" : "▶ Watch demo video"}
        </button>
        {showVideo && (
          <div className="mt-2 rounded-lg overflow-hidden border border-white/10 aspect-video">
            <iframe
              src={data.videoUrl}
              title={`${data.name} demo`}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}
      </div>
    </div>
  );
}

function WorkoutActions({
  onStart,
  onSkip,
  onModify,
}: {
  onStart: () => void;
  onSkip: () => void;
  onModify: () => void;
}) {
  return (
    <div className="flex flex-wrap gap-2 mt-3">
      <button
        type="button"
        onClick={onStart}
        data-ocid="ares.start_workout_button"
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#39FF14]/15 border border-[#39FF14]/35 text-[#39FF14] text-xs font-semibold hover:bg-[#39FF14]/25 transition-all"
      >
        ▶ Start Workout
      </button>
      <button
        type="button"
        onClick={onSkip}
        data-ocid="ares.skip_workout_button"
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 border border-white/15 text-white/70 text-xs font-semibold hover:bg-white/10 transition-all"
      >
        ⏭ Skip Today
      </button>
      <button
        type="button"
        onClick={onModify}
        data-ocid="ares.modify_workout_button"
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#00AAFF]/15 border border-[#00AAFF]/35 text-[#00AAFF] text-xs font-semibold hover:bg-[#00AAFF]/25 transition-all"
      >
        ✏️ Modify
      </button>
    </div>
  );
}

interface MessageBubbleProps {
  msg: LocalMessage;
  onStart: () => void;
  onSkip: () => void;
  onModify: () => void;
  onQuickReply: (text: string) => void;
}

function MessageBubble({
  msg,
  onStart,
  onSkip,
  onModify,
  onQuickReply,
}: MessageBubbleProps) {
  const isAres = msg.sender === "ares";
  const time = new Date(msg.timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (isAres) {
    return (
      <div
        className={`flex items-end gap-2 max-w-[85%] ${msg.isNudge ? "opacity-80" : ""}`}
      >
        <div className="w-8 h-8 rounded-full bg-[#39FF14]/20 border border-[#39FF14]/40 flex items-center justify-center flex-shrink-0 text-sm font-bold text-[#39FF14]">
          A
        </div>
        <div className="space-y-1.5">
          <div
            className={`bg-white/5 border border-[#00AAFF]/20 rounded-2xl rounded-bl-sm px-4 py-3 ${msg.isNudge ? "border-amber-500/30 bg-amber-500/5" : ""}`}
          >
            <p className="text-sm text-white/90 whitespace-pre-wrap leading-relaxed break-words">
              {msg.text}
            </p>
            {msg.exerciseData && <ExerciseCard data={msg.exerciseData} />}
            {msg.workoutActions && (
              <WorkoutActions
                onStart={onStart}
                onSkip={onSkip}
                onModify={onModify}
              />
            )}
            {msg.quickReplies && msg.quickReplies.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {msg.quickReplies.map((qr) => (
                  <button
                    key={qr}
                    type="button"
                    onClick={() => onQuickReply(qr)}
                    className="px-3 py-1.5 rounded-lg bg-[#00AAFF]/15 border border-[#00AAFF]/30 text-[#00AAFF] text-xs font-semibold hover:bg-[#00AAFF]/25 transition-all"
                  >
                    {qr}
                  </button>
                ))}
              </div>
            )}
          </div>
          <p className="text-[10px] text-white/30 pl-1">{time}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-end justify-end gap-2 max-w-[85%] ml-auto">
      <div className="space-y-1.5">
        <div className="bg-blue-600/20 border border-blue-500/30 rounded-2xl rounded-br-sm px-4 py-3">
          <p className="text-sm text-white whitespace-pre-wrap leading-relaxed break-words">
            {msg.text}
          </p>
        </div>
        <p className="text-[10px] text-white/30 text-right pr-1">{time}</p>
      </div>
    </div>
  );
}

// ─── Mode Selector Pills ──────────────────────────────────────────────────────

const MODES: { value: PersonalityMode; label: string; emoji: string }[] = [
  { value: "strict", label: "Strict", emoji: "😈" },
  { value: "friendly", label: "Friendly", emoji: "🙂" },
  { value: "motivational", label: "Motivational", emoji: "🔥" },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AresChat() {
  const {
    messages,
    profile,
    isTyping,
    mode,
    isLoaded,
    messagesEndRef,
    sendMessage,
    switchMode,
    clearHistory,
    handleStartWorkout,
    handleSkipWorkout,
    handleModifyWorkout,
  } = useAres();

  const [inputText, setInputText] = useState("");
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSend = async () => {
    const text = inputText.trim();
    if (!text) return;
    setInputText("");
    await sendMessage(text);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickReply = async (text: string) => {
    setInputText("");
    await sendMessage(text);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] md:h-[calc(100vh-4rem)] bg-[#0A0A0A]">
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div className="sticky top-0 z-10 bg-white/[0.03] border-b border-white/10 backdrop-blur-md">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          {/* Back */}
          <Link
            to="/"
            data-ocid="ares.back_link"
            className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-all"
            aria-label="Back to home"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          {/* Avatar + name */}
          <div className="w-9 h-9 rounded-full bg-[#39FF14]/20 border-2 border-[#39FF14]/50 flex items-center justify-center flex-shrink-0">
            <Bot className="w-4 h-4 text-[#39FF14]" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-white text-sm tracking-wide">
                ARES
              </span>
              <span className="w-2 h-2 rounded-full bg-[#39FF14] animate-pulse" />
              <span className="text-[10px] text-[#39FF14]/70 font-medium">
                Combat Coach
              </span>
            </div>
            {profile && (
              <p className="text-[10px] text-white/40 truncate">
                {profile.goal?.replace("_", " ")} ·{" "}
                {profile.experienceLevel ?? "beginner"}
              </p>
            )}
          </div>

          {/* Mode selector pills — desktop */}
          <div className="hidden sm:flex items-center gap-1">
            {MODES.map(({ value, label, emoji }) => (
              <button
                key={value}
                type="button"
                onClick={() => switchMode(value)}
                data-ocid={`ares.mode_${value}_button`}
                className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold transition-all ${
                  mode === value
                    ? "bg-[#00AAFF]/20 border border-[#00AAFF]/50 text-[#00AAFF]"
                    : "bg-white/5 border border-white/10 text-white/50 hover:text-white/80"
                }`}
                aria-pressed={mode === value}
              >
                {emoji} {label}
              </button>
            ))}
          </div>

          {/* Mobile mode — emoji toggles */}
          <div className="flex sm:hidden items-center gap-0.5">
            {MODES.map(({ value, emoji }) => (
              <button
                key={value}
                type="button"
                onClick={() => switchMode(value)}
                data-ocid={`ares.mode_${value}_toggle`}
                aria-label={`Switch to ${value} mode`}
                aria-pressed={mode === value}
                className={`w-7 h-7 rounded-lg text-sm transition-all ${
                  mode === value
                    ? "bg-[#00AAFF]/25 border border-[#00AAFF]/50"
                    : "bg-white/5 border border-white/10 hover:bg-white/10"
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>

          {/* Clear history */}
          {!showClearConfirm ? (
            <button
              type="button"
              onClick={() => setShowClearConfirm(true)}
              data-ocid="ares.clear_history_button"
              className="p-1.5 rounded-lg text-white/30 hover:text-white/60 hover:bg-white/10 transition-all"
              aria-label="Clear chat history"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          ) : (
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={async () => {
                  await clearHistory();
                  setShowClearConfirm(false);
                }}
                data-ocid="ares.confirm_clear_button"
                className="px-2 py-1 rounded-lg bg-red-500/20 border border-red-500/40 text-red-400 text-[10px] font-semibold hover:bg-red-500/30 transition-all"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => setShowClearConfirm(false)}
                data-ocid="ares.cancel_clear_button"
                className="px-2 py-1 rounded-lg bg-white/5 border border-white/15 text-white/50 text-[10px] font-semibold hover:bg-white/10 transition-all"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Messages area ─────────────────────────────────────────────────── */}
      <div
        className="flex-1 overflow-y-auto px-4 py-4"
        role="log"
        aria-label="Chat messages"
        aria-live="polite"
      >
        <div className="max-w-3xl mx-auto space-y-4">
          {!isLoaded && (
            <div className="flex justify-center pt-8">
              <div className="flex flex-col items-center gap-3 text-white/40">
                <div className="w-10 h-10 rounded-full border-2 border-[#39FF14]/30 border-t-[#39FF14] animate-spin" />
                <span className="text-xs">Connecting to Ares...</span>
              </div>
            </div>
          )}

          {isLoaded && messages.length === 0 && (
            <div
              className="flex flex-col items-center justify-center gap-4 pt-16 text-center"
              data-ocid="ares.empty_state"
            >
              <div className="w-16 h-16 rounded-full bg-[#39FF14]/10 border-2 border-[#39FF14]/30 flex items-center justify-center">
                <Bot className="w-8 h-8 text-[#39FF14]" />
              </div>
              <div>
                <p className="text-white/70 text-sm font-medium">
                  ARES is ready
                </p>
                <p className="text-white/30 text-xs mt-1">
                  Your combat coach awaits. Start the conversation.
                </p>
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              msg={msg}
              onStart={handleStartWorkout}
              onSkip={handleSkipWorkout}
              onModify={handleModifyWorkout}
              onQuickReply={handleQuickReply}
            />
          ))}

          {isTyping && <TypingIndicator />}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* ── Input footer ──────────────────────────────────────────────────── */}
      <div className="sticky bottom-0 pb-[env(safe-area-inset-bottom)] md:pb-0 bg-white/[0.03] border-t border-white/10 backdrop-blur-md">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex-1 min-w-0">
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Message Ares..."
                data-ocid="ares.input"
                className="w-full bg-white/[0.06] border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#00AAFF]/50 focus:bg-white/[0.08] transition-all"
                aria-label="Message input"
                autoComplete="off"
              />
            </div>
            <button
              type="button"
              onClick={handleSend}
              disabled={!inputText.trim()}
              data-ocid="ares.send_button"
              aria-label="Send message"
              className="w-11 h-11 rounded-xl bg-[#00AAFF] hover:bg-[#00AAFF]/80 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center flex-shrink-0 transition-all shadow-[0_0_20px_rgba(0,170,255,0.3)] disabled:shadow-none"
            >
              <Send className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Quick suggestion chips */}
          {profile?.onboardingComplete && (
            <div className="flex gap-2 mt-2 overflow-x-auto scrollbar-hide pb-0.5">
              {[
                "Today's workout",
                "How do push-ups?",
                "Diet tips",
                "Update weight",
              ].map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => handleQuickReply(chip)}
                  className="flex-shrink-0 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/50 text-xs hover:text-white/80 hover:bg-white/10 transition-all"
                >
                  {chip}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
