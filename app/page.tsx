"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronRight,
  ChevronLeft,
  Check,
  Plus,
  Minus,
  RotateCcw,
  Send,
  Sparkles,
  Clock,
  Users,
  Layers,
} from "lucide-react";

// ===== Types =====
type SelectionType = "single" | "multi-toggle" | "multi-quantity";

type Option = {
  id: string;
  label: string;
  price: number;
  desc?: string;
  image?: string;
  badge?: string;
};

type Step = {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  type: SelectionType;
  options: Option[];
  defaultId?: string;
};

// ===== Step Configuration =====
const steps: Step[] = [
  {
    id: "base",
    title: "基本メニュー",
    subtitle: "ご希望のコースをお選びください",
    icon: <Sparkles className="w-5 h-5" />,
    type: "single",
    defaultId: "basic-2",
    options: [
      {
        id: "basic-1",
        label: "ベーシック",
        price: 5000,
        desc: "基本ケア 60分",
        image: "/images/basic.png",
      },
      {
        id: "basic-2",
        label: "スタンダード",
        price: 8000,
        desc: "全身ケア 90分",
        image: "/images/standard.png",
        badge: "人気No.1",
      },
      {
        id: "basic-3",
        label: "プレミアム",
        price: 12000,
        desc: "極上コース 120分",
        image: "/images/premium.png",
      },
    ],
  },
  {
    id: "time",
    title: "ご利用時間",
    subtitle: "コースの時間をお選びください",
    icon: <Clock className="w-5 h-5" />,
    type: "single",
    defaultId: "time-2",
    options: [
      { id: "time-1", label: "60分", price: 0, desc: "基本時間" },
      { id: "time-2", label: "90分", price: 2000, desc: "+30分延長" },
      { id: "time-3", label: "120分", price: 4000, desc: "+60分延長" },
    ],
  },
  {
    id: "options",
    title: "オプション",
    subtitle: "お好みのオプションを追加できます",
    icon: <Layers className="w-5 h-5" />,
    type: "multi-quantity",
    options: [
      {
        id: "opt-1",
        label: "アロマセラピー",
        price: 1500,
        desc: "天然アロマオイルで深いリラックス",
        badge: "おすすめ",
      },
      {
        id: "opt-2",
        label: "ホットストーン",
        price: 2000,
        desc: "温めた天然石でじんわり温熱ケア",
      },
      {
        id: "opt-3",
        label: "ヘッドスパ",
        price: 1800,
        desc: "頭皮マッサージで極上のリフレッシュ",
        badge: "人気",
      },
      {
        id: "opt-4",
        label: "フットケア",
        price: 1200,
        desc: "足裏からふくらはぎまでしっかりケア",
      },
      {
        id: "opt-5",
        label: "美容パック",
        price: 2500,
        desc: "厳選美容液でお肌にうるおいを",
      },
      {
        id: "opt-6",
        label: "ハーブティー",
        price: 500,
        desc: "施術後にほっと一息",
      },
    ],
  },
  {
    id: "people",
    title: "ご利用人数",
    subtitle: "人数に応じた割引がございます",
    icon: <Users className="w-5 h-5" />,
    type: "single",
    defaultId: "ppl-1",
    options: [
      { id: "ppl-1", label: "1名", price: 0 },
      { id: "ppl-2", label: "2名", price: -500, desc: "ペア割 ¥500お得" },
      {
        id: "ppl-3",
        label: "3名以上",
        price: -1000,
        desc: "グループ割 ¥1,000お得",
      },
    ],
  },
];

// ===== Animated Price Component =====
function AnimatedPrice({ value }: { value: number }) {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    const diff = value - displayValue;
    if (diff === 0) return;

    const steps = 12;
    const increment = diff / steps;
    let current = displayValue;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      if (step >= steps) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        current += increment;
        setDisplayValue(Math.round(current));
      }
    }, 25);

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <span className="tabular-nums">
      ¥{displayValue.toLocaleString()}
    </span>
  );
}

// ===== Step Progress Bar =====
function StepProgressBar({
  currentStep,
  totalSteps,
  onStepClick,
}: {
  currentStep: number;
  totalSteps: number;
  onStepClick: (step: number) => void;
}) {
  return (
    <div className="flex items-center justify-center gap-0 px-4 py-3">
      {steps.map((step, i) => (
        <div key={step.id} className="flex items-center">
          <button
            onClick={() => onStepClick(i)}
            className="flex flex-col items-center gap-1 group"
          >
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                i < currentStep
                  ? "bg-emerald-500 text-white"
                  : i === currentStep
                  ? "bg-emerald-600 text-white ring-4 ring-emerald-100 scale-110"
                  : "bg-gray-200 text-gray-400"
              }`}
            >
              {i < currentStep ? (
                <Check className="w-4 h-4" />
              ) : (
                <span>{i + 1}</span>
              )}
            </div>
            <span
              className={`text-[10px] font-medium transition-colors hidden sm:block ${
                i <= currentStep ? "text-emerald-700" : "text-gray-400"
              }`}
            >
              {step.title}
            </span>
          </button>
          {i < totalSteps - 1 && (
            <div
              className={`w-8 sm:w-12 h-0.5 mx-1 transition-colors duration-300 ${
                i < currentStep ? "bg-emerald-400" : "bg-gray-200"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// ===== Selection Card =====
function SelectionCard({
  option,
  isSelected,
  onClick,
  quantity,
  onQuantityChange,
  showQuantity,
}: {
  option: Option;
  isSelected: boolean;
  onClick: () => void;
  quantity?: number;
  onQuantityChange?: (q: number) => void;
  showQuantity?: boolean;
}) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.97 }}
      className={`relative w-full text-left rounded-2xl border-2 p-4 transition-all duration-200 ${
        isSelected
          ? "border-emerald-500 bg-emerald-50/80 shadow-lg shadow-emerald-100"
          : "border-gray-200 bg-white hover:border-emerald-200 hover:shadow-md"
      }`}
    >
      {/* Badge */}
      {option.badge && (
        <span className="absolute -top-2.5 left-3 bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
          {option.badge}
        </span>
      )}

      {/* Check mark */}
      <AnimatePresence>
        {isSelected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 25 }}
            className="absolute top-3 right-3 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center"
          >
            <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-4">
        {/* Image placeholder */}
        {option.image && (
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-50 flex items-center justify-center flex-shrink-0">
            <Sparkles
              className={`w-6 h-6 ${
                isSelected ? "text-emerald-600" : "text-emerald-300"
              }`}
            />
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span
              className={`font-bold text-sm ${
                isSelected ? "text-emerald-800" : "text-gray-800"
              }`}
            >
              {option.label}
            </span>
          </div>
          {option.desc && (
            <p className="text-xs text-gray-500 mt-0.5">{option.desc}</p>
          )}
        </div>

        <div className="flex flex-col items-end flex-shrink-0">
          <span
            className={`font-bold text-sm ${
              option.price > 0
                ? "text-emerald-600"
                : option.price < 0
                ? "text-rose-500"
                : "text-gray-400"
            }`}
          >
            {option.price > 0
              ? `+¥${option.price.toLocaleString()}`
              : option.price < 0
              ? `¥${Math.abs(option.price).toLocaleString()}お得`
              : "基本料金内"}
          </span>
        </div>
      </div>

      {/* Quantity controls */}
      {showQuantity && isSelected && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="mt-3 pt-3 border-t border-emerald-200 flex items-center justify-end gap-3"
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuantityChange?.(Math.max(0, (quantity || 1) - 1));
            }}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <Minus className="w-4 h-4 text-gray-600" />
          </button>
          <span className="text-lg font-bold text-emerald-700 w-6 text-center tabular-nums">
            {quantity || 1}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuantityChange?.((quantity || 1) + 1);
            }}
            className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center hover:bg-emerald-200 transition-colors"
          >
            <Plus className="w-4 h-4 text-emerald-600" />
          </button>
        </motion.div>
      )}
    </motion.button>
  );
}

// ===== Main Component =====
export default function Home() {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);

  // Single selections: { stepId: optionId }
  const [singleSelections, setSingleSelections] = useState<
    Record<string, string>
  >(() => {
    const defaults: Record<string, string> = {};
    steps.forEach((step) => {
      if (step.type === "single" && step.defaultId) {
        defaults[step.id] = step.defaultId;
      }
    });
    return defaults;
  });

  // Multi selections with quantity: { optionId: quantity }
  const [multiSelections, setMultiSelections] = useState<
    Record<string, number>
  >({});

  const goNext = useCallback(() => {
    if (currentStep < steps.length - 1) {
      setDirection(1);
      setCurrentStep((s) => s + 1);
    } else {
      setShowConfirm(true);
    }
  }, [currentStep]);

  const goPrev = useCallback(() => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep((s) => s - 1);
    }
  }, [currentStep]);

  const goToStep = useCallback(
    (step: number) => {
      setDirection(step > currentStep ? 1 : -1);
      setCurrentStep(step);
    },
    [currentStep]
  );

  const handleSingleSelect = (stepId: string, optionId: string) => {
    setSingleSelections((prev) => ({ ...prev, [stepId]: optionId }));
  };

  const handleMultiToggle = (optionId: string) => {
    setMultiSelections((prev) => {
      const next = { ...prev };
      if (next[optionId]) {
        delete next[optionId];
      } else {
        next[optionId] = 1;
      }
      return next;
    });
  };

  const handleQuantityChange = (optionId: string, quantity: number) => {
    if (quantity <= 0) {
      setMultiSelections((prev) => {
        const next = { ...prev };
        delete next[optionId];
        return next;
      });
    } else {
      setMultiSelections((prev) => ({ ...prev, [optionId]: quantity }));
    }
  };

  const handleReset = () => {
    const defaults: Record<string, string> = {};
    steps.forEach((step) => {
      if (step.type === "single" && step.defaultId) {
        defaults[step.id] = step.defaultId;
      }
    });
    setSingleSelections(defaults);
    setMultiSelections({});
    setCurrentStep(0);
    setShowConfirm(false);
  };

  // Calculate total
  const calcTotal = useCallback(() => {
    let total = 0;
    for (const step of steps) {
      if (step.type === "single") {
        const selectedId = singleSelections[step.id];
        const opt = step.options.find((o) => o.id === selectedId);
        if (opt) total += opt.price;
      } else {
        for (const opt of step.options) {
          const qty = multiSelections[opt.id];
          if (qty) total += opt.price * qty;
        }
      }
    }
    return total;
  }, [singleSelections, multiSelections]);

  const total = calcTotal();

  const getSelectedSummary = () => {
    const items: { label: string; detail: string; price: number }[] = [];
    for (const step of steps) {
      if (step.type === "single") {
        const selectedId = singleSelections[step.id];
        const opt = step.options.find((o) => o.id === selectedId);
        if (opt) {
          items.push({
            label: step.title,
            detail: opt.label,
            price: opt.price,
          });
        }
      } else {
        for (const opt of step.options) {
          const qty = multiSelections[opt.id];
          if (qty) {
            items.push({
              label: opt.label,
              detail: qty > 1 ? `×${qty}` : "",
              price: opt.price * qty,
            });
          }
        }
      }
    }
    return items;
  };

  const step = steps[currentStep];

  // Slide animation variants
  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -300 : 300,
      opacity: 0,
    }),
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-600 text-white py-5 px-4 shadow-lg">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-xl sm:text-2xl font-bold tracking-wide">
            料金シミュレーター
          </h1>
          <p className="text-emerald-100 text-xs sm:text-sm mt-1">
            4ステップでかんたんお見積り
          </p>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-20">
        <div className="max-w-2xl mx-auto">
          <StepProgressBar
            currentStep={currentStep}
            totalSteps={steps.length}
            onStepClick={goToStep}
          />
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 pt-6 pb-40 min-h-[60vh]">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step.id}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Step Header */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-emerald-600">{step.icon}</span>
                <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  STEP {currentStep + 1} / {steps.length}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-2">
                {step.title}
              </h2>
              <p className="text-sm text-gray-500 mt-1">{step.subtitle}</p>
            </div>

            {/* Options */}
            <div className="space-y-3">
              {step.options.map((option, i) => {
                const isSelected =
                  step.type === "single"
                    ? singleSelections[step.id] === option.id
                    : !!multiSelections[option.id];

                return (
                  <motion.div
                    key={option.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <SelectionCard
                      option={option}
                      isSelected={isSelected}
                      onClick={() =>
                        step.type === "single"
                          ? handleSingleSelect(step.id, option.id)
                          : handleMultiToggle(option.id)
                      }
                      quantity={multiSelections[option.id]}
                      onQuantityChange={(q) =>
                        handleQuantityChange(option.id, q)
                      }
                      showQuantity={
                        step.type === "multi-quantity" && isSelected
                      }
                    />
                  </motion.div>
                );
              })}
            </div>

            {/* Skip note for optional step */}
            {step.type !== "single" && (
              <p className="text-xs text-gray-400 text-center mt-4">
                オプションは選択しなくても次に進めます
              </p>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] z-30">
        <div className="max-w-2xl mx-auto px-4 py-3">
          {/* Price display */}
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">
                お見積り合計
              </p>
              <p className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                <AnimatedPrice value={total} />
                <span className="text-xs font-normal text-gray-400 ml-1">
                  (税込)
                </span>
              </p>
            </div>
            <button
              onClick={handleReset}
              className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              リセット
            </button>
          </div>

          {/* Navigation buttons */}
          <div className="flex gap-3">
            {currentStep > 0 && (
              <button
                onClick={goPrev}
                className="flex items-center justify-center gap-1 px-4 py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="text-sm">戻る</span>
              </button>
            )}
            <button
              onClick={goNext}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all duration-200 ${
                currentStep === steps.length - 1
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-200"
                  : "bg-emerald-600 hover:bg-emerald-700 text-white"
              }`}
            >
              {currentStep === steps.length - 1 ? (
                <>
                  <Send className="w-4 h-4" />
                  この内容で問い合わせる
                </>
              ) : (
                <>
                  次のステップへ
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setShowConfirm(false)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 max-h-[85vh] overflow-y-auto"
            >
              <div className="max-w-2xl mx-auto bg-white rounded-t-3xl shadow-2xl">
                {/* Handle */}
                <div className="flex justify-center pt-3 pb-1">
                  <div className="w-10 h-1 rounded-full bg-gray-300" />
                </div>

                <div className="px-5 pb-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 mt-2">
                    お見積り内容の確認
                  </h3>

                  {/* Summary items */}
                  <div className="space-y-2 mb-4">
                    {getSelectedSummary().map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex items-center justify-between bg-gray-50 px-4 py-2.5 rounded-xl"
                      >
                        <div>
                          <span className="text-sm font-medium text-gray-800">
                            {item.label}
                          </span>
                          {item.detail && (
                            <span className="text-sm text-gray-500 ml-2">
                              {item.detail}
                            </span>
                          )}
                        </div>
                        <span
                          className={`text-sm font-bold ${
                            item.price >= 0
                              ? "text-emerald-600"
                              : "text-rose-500"
                          }`}
                        >
                          {item.price >= 0 ? "+" : "-"}¥
                          {Math.abs(item.price).toLocaleString()}
                        </span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Total */}
                  <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-5 text-center text-white mb-5">
                    <p className="text-xs opacity-80">合計金額</p>
                    <p className="text-3xl font-extrabold mt-1">
                      ¥{total.toLocaleString()}
                      <span className="text-sm font-normal opacity-70 ml-1">
                        (税込)
                      </span>
                    </p>
                  </div>

                  <p className="text-xs text-gray-400 mb-4 text-center">
                    ※ デモ画面のため、実際の送信は行われません
                  </p>

                  {/* Action buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowConfirm(false)}
                      className="flex-1 py-3 border-2 border-gray-200 rounded-xl text-gray-600 font-medium hover:bg-gray-50 transition-colors text-sm"
                    >
                      内容を変更する
                    </button>
                    <button
                      onClick={() => setShowConfirm(false)}
                      className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors text-sm flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      送信する
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
