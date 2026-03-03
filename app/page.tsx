"use client";

import { useState } from "react";

type Option = {
  id: string;
  label: string;
  price: number;
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
      { id: "basic-1", label: "ベーシックプラン", price: 5000 },
      { id: "basic-2", label: "スタンダードプラン", price: 8000 },
      { id: "basic-3", label: "プレミアムプラン", price: 12000 },
    ],
  },
  {
    title: "ご利用時間",
    type: "single",
    options: [
      { id: "time-1", label: "60分", price: 0 },
      { id: "time-2", label: "90分（+2,000円）", price: 2000 },
      { id: "time-3", label: "120分（+4,000円）", price: 4000 },
    ],
  },
  {
    title: "オプション",
    type: "multi",
    options: [
      { id: "opt-1", label: "アロマセラピー", price: 1500 },
      { id: "opt-2", label: "ホットストーン", price: 2000 },
      { id: "opt-3", label: "ヘッドスパ", price: 1800 },
      { id: "opt-4", label: "フットケア", price: 1200 },
      { id: "opt-5", label: "美容パック", price: 2500 },
    ],
  },
  {
    title: "ご利用人数",
    type: "single",
    options: [
      { id: "ppl-1", label: "1名", price: 0 },
      { id: "ppl-2", label: "2名（ペア割 -500円）", price: -500 },
      { id: "ppl-3", label: "3名以上（グループ割 -1,000円）", price: -1000 },
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
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <header className="bg-green-700 text-white py-5 px-4 shadow-lg">
        <div className="max-w-lg mx-auto text-center">
          <h1 className="text-2xl font-bold tracking-wide">料金シミュレーター</h1>
          <p className="text-green-100 text-sm mt-1">
            メニューを選んで、お見積りをご確認ください
          </p>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {categories.map((cat) => (
          <section
            key={cat.title}
            className="bg-white rounded-2xl shadow-md border border-green-100 overflow-hidden"
          >
            <div className="bg-green-600 text-white px-5 py-3">
              <h2 className="font-bold text-lg">{cat.title}</h2>
              {cat.type === "multi" && (
                <p className="text-green-100 text-xs mt-0.5">複数選択できます</p>
              )}
            </div>
            <div className="p-4 space-y-2">
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
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                      isSelected
                        ? "border-green-500 bg-green-50 shadow-sm"
                        : "border-gray-200 bg-white hover:border-green-300 hover:bg-green-50/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                          isSelected
                            ? "border-green-500 bg-green-500"
                            : "border-gray-300"
                        }`}
                      >
                        {isSelected && (
                          <svg
                            className="w-3 h-3 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={3}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                      </div>
                      <span
                        className={`text-sm font-medium ${
                          isSelected ? "text-green-800" : "text-gray-700"
                        }`}
                      >
                        {opt.label}
                      </span>
                    </div>
                    {opt.price !== 0 && (
                      <span
                        className={`text-sm font-bold ${
                          opt.price > 0 ? "text-green-700" : "text-red-500"
                        }`}
                      >
                        {opt.price > 0
                          ? `¥${opt.price.toLocaleString()}`
                          : `-¥${Math.abs(opt.price).toLocaleString()}`}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </section>
        ))}

        {/* Price Display - Sticky */}
        <div className="bg-white rounded-2xl shadow-lg border-2 border-green-500 p-6 text-center sticky bottom-4">
          <p className="text-sm text-green-600 font-medium mb-1">お見積り金額</p>
          <p className="text-4xl font-extrabold text-green-800">
            ¥{total.toLocaleString()}
            <span className="text-base font-normal text-gray-500 ml-1">(税込)</span>
          </p>
          <button
            onClick={() => setShowResult(true)}
            className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-xl transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            この内容で問い合わせる
          </button>
        </div>

        <div className="h-4" />
      </main>

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
