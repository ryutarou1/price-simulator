"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useInView } from "motion/react";
import {
  Check,
  Plus,
  Minus,
  RotateCcw,
  Send,
  Sparkles,
  Clock,
  Users,
  Layers,
  ChevronUp,
} from "lucide-react";

// ===== Types =====
type Option = {
  id: string;
  label: string;
  price: number;
  desc?: string;
  badge?: string;
};

type Section = {
  id: string;
  step: number;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  type: "single" | "multi-quantity";
  options: Option[];
  defaultId?: string;
};

// ===== Section Configuration =====
const sections: Section[] = [
  {
    id: "base",
    step: 1,
    title: "基本メニューを選ぶ",
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
      },
      {
        id: "basic-2",
        label: "スタンダード",
        price: 8000,
        desc: "全身ケア 90分",
        badge: "人気No.1",
      },
      {
        id: "basic-3",
        label: "プレミアム",
        price: 12000,
        desc: "極上コース 120分",
      },
    ],
  },
  {
    id: "time",
    step: 2,
    title: "ご利用時間を選ぶ",
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
    step: 3,
    title: "オプションを選ぶ",
    subtitle: "お好みのオプションを追加できます（複数選択OK）",
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
    step: 4,
    title: "ご利用人数を選ぶ",
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

// ===== Scroll-triggered Section =====
function SectionBlock({
  section,
  singleSelections,
  multiSelections,
  onSingleSelect,
  onMultiToggle,
  onQuantityChange,
}: {
  section: Section;
  singleSelections: Record<string, string>;
  multiSelections: Record<string, number>;
  onSingleSelect: (sectionId: string, optionId: string) => void;
  onMultiToggle: (optionId: string) => void;
  onQuantityChange: (optionId: string, qty: number) => void;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section id={section.id} ref={ref} className="scroll-mt-20">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* Section Title */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
            {section.step}
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">
              {section.title}
            </h2>
            <p className="text-xs sm:text-sm text-gray-500">
              {section.subtitle}
            </p>
          </div>
        </div>

        {/* Cards Grid */}
        <div
          className={`grid gap-3 ${
            section.type === "single" && section.options.length <= 3
              ? "grid-cols-1 sm:grid-cols-3"
              : section.type === "single"
              ? "grid-cols-1 sm:grid-cols-3"
              : "grid-cols-1 sm:grid-cols-2"
          }`}
        >
          {section.options.map((option, i) => {
            const isSelected =
              section.type === "single"
                ? singleSelections[section.id] === option.id
                : !!multiSelections[option.id];
            const quantity = multiSelections[option.id] || 0;

            return (
              <motion.div
                key={option.id}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: i * 0.06 }}
              >
                <button
                  onClick={() =>
                    section.type === "single"
                      ? onSingleSelect(section.id, option.id)
                      : onMultiToggle(option.id)
                  }
                  className={`relative w-full text-left rounded-2xl border-2 transition-all duration-200 overflow-hidden ${
                    isSelected
                      ? "border-emerald-500 bg-emerald-50 shadow-lg shadow-emerald-100/50"
                      : "border-gray-200 bg-white hover:border-emerald-200 hover:shadow-md"
                  }`}
                >
                  {/* Badge */}
                  {option.badge && (
                    <div className="absolute top-0 right-0 bg-orange-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-bl-xl">
                      {option.badge}
                    </div>
                  )}

                  {/* Card Content */}
                  <div className="p-4">
                    {/* Image placeholder area */}
                    <div
                      className={`w-full h-20 sm:h-24 rounded-xl mb-3 flex items-center justify-center ${
                        isSelected
                          ? "bg-gradient-to-br from-emerald-100 to-teal-50"
                          : "bg-gradient-to-br from-gray-100 to-gray-50"
                      }`}
                    >
                      <Sparkles
                        className={`w-8 h-8 ${
                          isSelected ? "text-emerald-500" : "text-gray-300"
                        }`}
                      />
                    </div>

                    {/* Label & Description */}
                    <div className="mb-2">
                      <span
                        className={`font-bold text-sm ${
                          isSelected ? "text-emerald-800" : "text-gray-800"
                        }`}
                      >
                        {option.label}
                      </span>
                      {option.desc && (
                        <p className="text-xs text-gray-500 mt-0.5">
                          {option.desc}
                        </p>
                      )}
                    </div>

                    {/* Price */}
                    <div className="flex items-center justify-between">
                      <span
                        className={`font-bold text-base ${
                          option.price > 0
                            ? "text-emerald-600"
                            : option.price < 0
                            ? "text-rose-500"
                            : "text-gray-400"
                        }`}
                      >
                        {option.price > 0
                          ? `¥${option.price.toLocaleString()}`
                          : option.price < 0
                          ? `¥${Math.abs(option.price).toLocaleString()}お得`
                          : "基本料金内"}
                      </span>

                      {/* Check indicator */}
                      <AnimatePresence>
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            transition={{
                              type: "spring",
                              stiffness: 500,
                              damping: 25,
                            }}
                            className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center"
                          >
                            <Check
                              className="w-3.5 h-3.5 text-white"
                              strokeWidth={3}
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Quantity Controls (multi-quantity only) */}
                  {section.type === "multi-quantity" && isSelected && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      className="border-t border-emerald-200 bg-emerald-50/50 px-4 py-2.5 flex items-center justify-between"
                    >
                      <span className="text-xs text-emerald-700 font-medium">
                        数量
                      </span>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onQuantityChange(
                              option.id,
                              Math.max(0, quantity - 1)
                            );
                          }}
                          className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
                        >
                          <Minus className="w-4 h-4 text-gray-600" />
                        </button>
                        <span className="text-lg font-bold text-emerald-700 w-6 text-center tabular-nums">
                          {quantity}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onQuantityChange(option.id, quantity + 1);
                          }}
                          className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center hover:bg-emerald-600 transition-colors"
                        >
                          <Plus className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </button>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}

// ===== Animated Price =====
function AnimatedPrice({ value }: { value: number }) {
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const diff = value - display;
    if (diff === 0) return;
    const steps = 12;
    const inc = diff / steps;
    let current = display;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      if (step >= steps) {
        setDisplay(value);
        clearInterval(timer);
      } else {
        current += inc;
        setDisplay(Math.round(current));
      }
    }, 25);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <span className="tabular-nums">¥{display.toLocaleString()}</span>
  );
}

// ===== Side Navigation (PC) =====
function SideNav({
  activeSection,
}: {
  activeSection: string;
}) {
  return (
    <nav className="fixed right-4 top-1/2 -translate-y-1/2 z-30 hidden lg:flex flex-col gap-2">
      {sections.map((sec) => (
        <a
          key={sec.id}
          href={`#${sec.id}`}
          className={`group flex items-center gap-2 transition-all duration-300 ${
            activeSection === sec.id ? "scale-105" : ""
          }`}
        >
          <span
            className={`text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap ${
              activeSection === sec.id ? "text-emerald-700" : "text-gray-500"
            }`}
          >
            {sec.title}
          </span>
          <div
            className={`w-3 h-3 rounded-full border-2 transition-all ${
              activeSection === sec.id
                ? "bg-emerald-500 border-emerald-500 scale-125"
                : "bg-white border-gray-300 group-hover:border-emerald-400"
            }`}
          />
        </a>
      ))}
      <a
        href="#complete"
        className={`group flex items-center gap-2 transition-all duration-300 ${
          activeSection === "complete" ? "scale-105" : ""
        }`}
      >
        <span
          className={`text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap ${
            activeSection === "complete" ? "text-emerald-700" : "text-gray-500"
          }`}
        >
          お見積り確認
        </span>
        <div
          className={`w-3 h-3 rounded-full border-2 transition-all ${
            activeSection === "complete"
              ? "bg-emerald-500 border-emerald-500 scale-125"
              : "bg-white border-gray-300 group-hover:border-emerald-400"
          }`}
        />
      </a>
    </nav>
  );
}

// ===== Main Component =====
export default function Home() {
  const [activeSection, setActiveSection] = useState(sections[0].id);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showTopBtn, setShowTopBtn] = useState(false);

  const [singleSelections, setSingleSelections] = useState<
    Record<string, string>
  >(() => {
    const defaults: Record<string, string> = {};
    sections.forEach((sec) => {
      if (sec.type === "single" && sec.defaultId) {
        defaults[sec.id] = sec.defaultId;
      }
    });
    return defaults;
  });

  const [multiSelections, setMultiSelections] = useState<
    Record<string, number>
  >({});

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      setShowTopBtn(window.scrollY > 400);

      const sectionEls = [...sections.map((s) => s.id), "complete"]
        .map((id) => document.getElementById(id))
        .filter(Boolean) as HTMLElement[];

      for (let i = sectionEls.length - 1; i >= 0; i--) {
        const el = sectionEls[i];
        if (el.getBoundingClientRect().top <= 150) {
          setActiveSection(el.id);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSingleSelect = (sectionId: string, optionId: string) => {
    setSingleSelections((prev) => ({ ...prev, [sectionId]: optionId }));
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
    sections.forEach((sec) => {
      if (sec.type === "single" && sec.defaultId) {
        defaults[sec.id] = sec.defaultId;
      }
    });
    setSingleSelections(defaults);
    setMultiSelections({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const calcTotal = useCallback(() => {
    let total = 0;
    for (const sec of sections) {
      if (sec.type === "single") {
        const selectedId = singleSelections[sec.id];
        const opt = sec.options.find((o) => o.id === selectedId);
        if (opt) total += opt.price;
      } else {
        for (const opt of sec.options) {
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
    for (const sec of sections) {
      if (sec.type === "single") {
        const selectedId = singleSelections[sec.id];
        const opt = sec.options.find((o) => o.id === selectedId);
        if (opt) {
          items.push({ label: sec.title.replace("を選ぶ", ""), detail: opt.label, price: opt.price });
        }
      } else {
        for (const opt of sec.options) {
          const qty = multiSelections[opt.id];
          if (qty) {
            items.push({
              label: opt.label,
              detail: qty > 1 ? `x${qty}` : "",
              price: opt.price * qty,
            });
          }
        }
      }
    }
    return items;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero / Main Visual */}
      <header className="relative bg-gradient-to-br from-emerald-700 via-emerald-600 to-teal-600 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-60 h-60 bg-teal-300 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-3xl mx-auto px-4 py-12 sm:py-16 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl font-extrabold tracking-tight"
          >
            料金シミュレーター
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-emerald-100 text-sm sm:text-base mt-3 max-w-md mx-auto"
          >
            メニューを選ぶだけで、料金がリアルタイムに計算されます。
            <br className="hidden sm:block" />
            お気軽にお見積りをお試しください。
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-6"
          >
            <a
              href="#base"
              className="inline-flex items-center gap-2 bg-white text-emerald-700 font-bold px-6 py-3 rounded-full hover:bg-emerald-50 transition-colors shadow-lg"
            >
              シミュレーションを始める
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </a>
          </motion.div>
        </div>
      </header>

      {/* Mobile Step Nav (sticky) */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-gray-200 lg:hidden">
        <div className="max-w-3xl mx-auto px-4 py-2 flex items-center justify-between overflow-x-auto gap-1">
          {sections.map((sec) => (
            <a
              key={sec.id}
              href={`#${sec.id}`}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                activeSection === sec.id
                  ? "bg-emerald-100 text-emerald-700"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  activeSection === sec.id
                    ? "bg-emerald-600 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {sec.step}
              </span>
              <span className="hidden sm:inline">{sec.title.replace("を選ぶ", "")}</span>
            </a>
          ))}
        </div>
      </div>

      {/* Side Nav (PC) */}
      <SideNav activeSection={activeSection} />

      {/* Sections */}
      <main className="max-w-3xl mx-auto px-4 py-10 space-y-16 pb-52">
        {sections.map((sec) => (
          <SectionBlock
            key={sec.id}
            section={sec}
            singleSelections={singleSelections}
            multiSelections={multiSelections}
            onSingleSelect={handleSingleSelect}
            onMultiToggle={handleMultiToggle}
            onQuantityChange={handleQuantityChange}
          />
        ))}

        {/* Complete Section */}
        <section id="complete" className="scroll-mt-20">
          <CompleteSectionInner
            total={total}
            summary={getSelectedSummary()}
            onConfirm={() => setShowConfirm(true)}
            onReset={handleReset}
          />
        </section>
      </main>

      {/* Sticky Bottom Price Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] z-30">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
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
          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-500 hover:bg-gray-50 transition-colors flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              リセット
            </button>
            <a
              href="#complete"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-5 rounded-xl transition-colors text-sm flex items-center gap-2 shadow-lg shadow-emerald-200"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">この内容で</span>問い合わせる
            </a>
          </div>
        </div>
      </div>

      {/* Scroll to Top */}
      <AnimatePresence>
        {showTopBtn && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-24 right-4 w-10 h-10 bg-white border border-gray-200 rounded-full shadow-lg flex items-center justify-center z-30 hover:bg-gray-50 transition-colors"
          >
            <ChevronUp className="w-5 h-5 text-gray-600" />
          </motion.button>
        )}
      </AnimatePresence>

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
                <div className="flex justify-center pt-3 pb-1">
                  <div className="w-10 h-1 rounded-full bg-gray-300" />
                </div>
                <div className="px-5 pb-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 mt-2">
                    お見積り内容の確認
                  </h3>
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
                            item.price >= 0 ? "text-emerald-600" : "text-rose-500"
                          }`}
                        >
                          {item.price >= 0 ? "+" : "-"}¥
                          {Math.abs(item.price).toLocaleString()}
                        </span>
                      </motion.div>
                    ))}
                  </div>
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

// ===== Complete Section =====
function CompleteSectionInner({
  total,
  summary,
  onConfirm,
  onReset,
}: {
  total: number;
  summary: { label: string; detail: string; price: number }[];
  onConfirm: () => void;
  onReset: () => void;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
          お見積り内容
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          選択内容をご確認ください
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Summary items */}
        <div className="divide-y divide-gray-100">
          {summary.map((item, i) => (
            <div
              key={i}
              className="flex items-center justify-between px-5 py-3"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">
                  {item.label}
                </span>
                {item.detail && (
                  <span className="text-sm text-gray-400">{item.detail}</span>
                )}
              </div>
              <span
                className={`text-sm font-bold ${
                  item.price >= 0 ? "text-emerald-600" : "text-rose-500"
                }`}
              >
                {item.price >= 0 ? "" : "-"}¥
                {Math.abs(item.price).toLocaleString()}
              </span>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-5 text-center text-white">
          <p className="text-xs opacity-80">合計金額</p>
          <p className="text-3xl sm:text-4xl font-extrabold mt-1">
            ¥{total.toLocaleString()}
            <span className="text-sm font-normal opacity-70 ml-1">
              (税込)
            </span>
          </p>
        </div>

        {/* Actions */}
        <div className="p-5 flex gap-3">
          <button
            onClick={onReset}
            className="flex-1 py-3 border-2 border-gray-200 rounded-xl text-gray-600 font-medium hover:bg-gray-50 transition-colors text-sm flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            やり直す
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-200"
          >
            <Send className="w-4 h-4" />
            この内容で問い合わせる
          </button>
        </div>
      </div>
    </motion.div>
  );
}
