"use client";

import { useState } from "react";

type Option = {
  id: string;
  label: string;
  price: number;
  emoji: string;
  desc?: string;
};

type Category = {
  title: string;
  type: "single" | "multi";
  options: Option[];
};

const categories: Category[] = [
  {
    title: "基本メニュー",
    type: "single",
    options: [
      { id: "basic-1", label: "ベーシック", price: 5000, emoji: "🌿", desc: "基本ケア60分" },
      { id: "basic-2", label: "スタンダード", price: 8000, emoji: "🍃", desc: "全身ケア90分" },
      { id: "basic-3", label: "プレミアム", price: 12000, emoji: "✨", desc: "極上コース120分" },
    ],
  },
  {
    title: "ご利用時間",
    type: "single",
    options: [
      { id: "time-1", label: "60分", price: 0, emoji: "⏱️" },
      { id: "time-2", label: "90分", price: 2000, emoji: "⏱️" },
      { id: "time-3", label: "120分", price: 4000, emoji: "⏱️" },
    ],
  },
  {
    title: "オプション",
    type: "multi",
    options: [
      { id: "opt-1", label: "アロマセラピー", price: 1500, emoji: "🕯️" },
      { id: "opt-2", label: "ホットストーン", price: 2000, emoji: "🪨" },
      { id: "opt-3", label: "ヘッドスパ", price: 1800, emoji: "💆" },
      { id: "opt-4", label: "フットケア", price: 1200, emoji: "🦶" },
      { id: "opt-5", label: "美容パック", price: 2500, emoji: "🧴" },
      { id: "opt-6", label: "ハーブティー", price: 500, emoji: "🍵" },
    ],
  },
  {
    title: "ご利用人数",
    type: "single",
    options: [
      { id: "ppl-1", label: "1名", price: 0, emoji: "👤" },
      { id: "ppl-2", label: "2名", price: -500, emoji: "👥", desc: "ペア割 -¥500" },
      { id: "ppl-3", label: "3名以上", price: -1000, emoji: "👨‍👩‍👧", desc: "グループ割 -¥1,000" },
    ],
  },
];

export default function Home() {
  const [singleSelections, setSingleSelections] = useState<Record<string, string>>({
    "基本メニュー": "basic-1",
    "ご利用時間": "time-1",
    "ご利用人数": "ppl-1",
  });
  const [multiSelections, setMultiSelections] = useState<Set<string>>(new Set());
  const [showResult, setShowResult] = useState(false);

  const handleSingleSelect = (categoryTitle: string, optionId: string) => {
    setSingleSelections((prev) => ({ ...prev, [categoryTitle]: optionId }));
  };

  const handleMultiToggle = (optionId: string) => {
    setMultiSelections((prev) => {
      const next = new Set(prev);
      if (next.has(optionId)) {
        next.delete(optionId);
      } else {
        next.add(optionId);
      }
      return next;
    });
  };

  const calcTotal = () => {
    let total = 0;
    for (const cat of categories) {
      if (cat.type === "single") {
        const selectedId = singleSelections[cat.title];
        const opt = cat.options.find((o) => o.id === selectedId);
        if (opt) total += opt.price;
      } else {
        for (const opt of cat.options) {
          if (multiSelections.has(opt.id)) total += opt.price;
        }
      }
    }
    return total;
  };

  const total = calcTotal();

  const getSelectedSummary = () => {
    const items: string[] = [];
    for (const cat of categories) {
      if (cat.type === "single") {
        const selectedId = singleSelections[cat.title];
        const opt = cat.options.find((o) => o.id === selectedId);
        if (opt) items.push(`${cat.title}: ${opt.label}`);
      } else {
        const selected = cat.options.filter((o) => multiSelections.has(o.id));
        if (selected.length > 0) {
          items.push(`${cat.title}: ${selected.map((o) => o.label).join("、")}`);
        }
      }
    }
    return items;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-700 to-green-600 text-white py-6 px-4 shadow-lg">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl font-bold tracking-wide">料金シミュレーター</h1>
          <p className="text-green-100 text-sm mt-1">
            メニューを選んで、お見積りをご確認ください
          </p>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-8 pb-52">
        {categories.map((cat) => (
          <section key={cat.title}>
            <div className="flex items-center gap-2 mb-3">
              <h2 className="font-bold text-lg text-green-800">{cat.title}</h2>
              {cat.type === "multi" && (
                <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">
                  複数選択OK
                </span>
              )}
            </div>
            <div className={`grid gap-3 ${
              cat.options.length <= 3
                ? "grid-cols-3"
                : "grid-cols-3 sm:grid-cols-3"
            }`}>
              {cat.options.map((opt) => {
                const isSelected =
                  cat.type === "single"
                    ? singleSelections[cat.title] === opt.id
                    : multiSelections.has(opt.id);

                return (
                  <button
                    key={opt.id}
                    onClick={() =>
                      cat.type === "single"
                        ? handleSingleSelect(cat.title, opt.id)
                        : handleMultiToggle(opt.id)
                    }
                    className={`relative flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-200 aspect-square ${
                      isSelected
                        ? "border-green-500 bg-green-50 shadow-lg scale-[1.03]"
                        : "border-gray-200 bg-white hover:border-green-300 hover:shadow-md"
                    }`}
                  >
                    {/* Check mark */}
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}

                    {/* Emoji */}
                    <span className="text-3xl mb-1">{opt.emoji}</span>

                    {/* Label */}
                    <span className={`text-xs font-bold text-center leading-tight ${
                      isSelected ? "text-green-800" : "text-gray-700"
                    }`}>
                      {opt.label}
                    </span>

                    {/* Description */}
                    {opt.desc && (
                      <span className="text-[10px] text-gray-400 mt-0.5 text-center leading-tight">
                        {opt.desc}
                      </span>
                    )}

                    {/* Price */}
                    <span className={`text-xs font-bold mt-1 ${
                      opt.price > 0
                        ? "text-green-600"
                        : opt.price < 0
                        ? "text-red-500"
                        : "text-gray-400"
                    }`}>
                      {opt.price > 0
                        ? `¥${opt.price.toLocaleString()}`
                        : opt.price < 0
                        ? `-¥${Math.abs(opt.price).toLocaleString()}`
                        : "基本料金内"}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        ))}
      </main>

      {/* Sticky Bottom Price Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t-2 border-green-500 shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs text-green-600 font-medium">お見積り金額</p>
            <p className="text-3xl font-extrabold text-green-800">
              ¥{total.toLocaleString()}
              <span className="text-xs font-normal text-gray-400 ml-1">(税込)</span>
            </p>
          </div>
          <button
            onClick={() => setShowResult(true)}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg whitespace-nowrap"
          >
            この内容で<br className="sm:hidden" />問い合わせる
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showResult && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-green-800 mb-4">
              お見積り内容の確認
            </h3>
            <div className="space-y-2 mb-4">
              {getSelectedSummary().map((item, i) => (
                <p key={i} className="text-sm text-gray-700 bg-green-50 px-3 py-2 rounded-lg">
                  {item}
                </p>
              ))}
            </div>
            <div className="bg-green-100 rounded-xl p-4 text-center mb-4">
              <p className="text-sm text-green-600">合計金額</p>
              <p className="text-2xl font-extrabold text-green-800">
                ¥{total.toLocaleString()}
              </p>
            </div>
            <p className="text-xs text-gray-500 mb-4 text-center">
              ※ デモ画面のため、実際の送信は行われません
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowResult(false)}
                className="flex-1 py-2.5 border-2 border-gray-300 rounded-xl text-gray-600 font-medium hover:bg-gray-50 transition-colors"
              >
                戻る
              </button>
              <button
                onClick={() => setShowResult(false)}
                className="flex-1 py-2.5 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-colors"
              >
                送信する
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
