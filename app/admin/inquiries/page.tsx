"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Mail, Clock, ChevronDown, ChevronUp, User, Phone, FileText } from "lucide-react";

type Inquiry = {
  id: number;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  simulationResult: string;
  date: string;
  status: "new" | "read" | "replied";
};

const initialInquiries: Inquiry[] = [
  {
    id: 1, name: "田中 太郎", email: "tanaka@example.com", phone: "090-1234-5678",
    subject: "料金プランについて", message: "プレミアムプランの詳細を教えてください。10名での利用を検討しています。VIPルームの空き状況も確認したいです。",
    simulationResult: "基本メニュー C (¥12,000) + 延長60分 (¥4,500) + VIPルーム (¥5,000) = ¥21,500",
    date: "2026/03/06 10:30", status: "new",
  },
  {
    id: 2, name: "佐藤 花子", email: "sato@example.com", phone: "080-2345-6789",
    subject: "カスタムプランのご相談", message: "定期的な利用を考えています。月4回以上の利用で割引はありますか？",
    simulationResult: "基本メニュー B (¥8,000) + ドリンクサービス (¥1,500) = ¥9,500",
    date: "2026/03/05 15:20", status: "new",
  },
  {
    id: 3, name: "鈴木 一郎", email: "suzuki@example.com", phone: "070-3456-7890",
    subject: "お見積り依頼", message: "法人契約での見積りをお願いしたいです。従業員20名分です。",
    simulationResult: "基本メニュー A (¥5,000) × 20名 = ¥100,000",
    date: "2026/03/05 09:15", status: "read",
  },
  {
    id: 4, name: "高橋 美咲", email: "takahashi@example.com", phone: "090-4567-8901",
    subject: "サービス内容の確認", message: "撮影オプションについて、データの納品形式と枚数を教えてください。",
    simulationResult: "基本メニュー B (¥8,000) + 撮影オプション (¥3,000) = ¥11,000",
    date: "2026/03/04 14:00", status: "replied",
  },
  {
    id: 5, name: "山本 健二", email: "yamamoto@example.com", phone: "080-5678-9012",
    subject: "初回利用について", message: "初めて利用します。駐車場はありますか？",
    simulationResult: "基本メニュー A (¥5,000) + 延長30分 (¥2,500) = ¥7,500",
    date: "2026/03/03 11:45", status: "replied",
  },
  {
    id: 6, name: "伊藤 さくら", email: "ito@example.com", phone: "070-6789-0123",
    subject: "ギフト利用について", message: "友人へのプレゼントとして利用したいのですが、ギフト券のようなものはありますか？",
    simulationResult: "基本メニュー C (¥12,000) + ギフトラッピング (¥800) = ¥12,800",
    date: "2026/03/02 16:30", status: "read",
  },
];

const statusConfig = {
  new: { label: "新着", className: "bg-red-100 text-red-700" },
  read: { label: "確認済", className: "bg-gray-100 text-gray-600" },
  replied: { label: "返信済", className: "bg-emerald-100 text-emerald-700" },
};

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>(initialInquiries);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const filteredInquiries = inquiries.filter(
    (inq) => filterStatus === "all" || inq.status === filterStatus
  );

  const newCount = inquiries.filter((i) => i.status === "new").length;

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
    // Mark as read when expanded
    setInquiries(
      inquiries.map((inq) =>
        inq.id === id && inq.status === "new" ? { ...inq, status: "read" as const } : inq
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          シミュレーターからのお問い合わせ一覧です
          {newCount > 0 && (
            <Badge className="ml-2 bg-red-100 text-red-700 hover:bg-red-100">
              {newCount}件の新着
            </Badge>
          )}
        </p>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="ステータス" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">すべて</SelectItem>
            <SelectItem value="new">新着</SelectItem>
            <SelectItem value="read">確認済</SelectItem>
            <SelectItem value="replied">返信済</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Inquiry List */}
      <div className="space-y-2">
        {filteredInquiries.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Mail className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">お問い合わせはありません。</p>
          </div>
        ) : (
          filteredInquiries.map((inq) => (
            <Card
              key={inq.id}
              className={`border-gray-200 transition-shadow ${
                inq.status === "new" ? "border-l-4 border-l-red-400" : ""
              }`}
            >
              <CardContent className="p-0">
                {/* Summary row */}
                <button
                  onClick={() => toggleExpand(inq.id)}
                  className="w-full p-4 flex items-center gap-4 text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-900 text-sm">
                        {inq.name}
                      </span>
                      <Badge
                        className={`${
                          statusConfig[inq.status].className
                        } hover:${statusConfig[inq.status].className} text-[10px] px-1.5`}
                      >
                        {statusConfig[inq.status].label}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-700 truncate">
                      {inq.subject}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <Clock className="w-3 h-3" />
                      {inq.date}
                    </div>
                    {expandedId === inq.id ? (
                      <ChevronUp className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                </button>

                {/* Expanded detail */}
                {expandedId === inq.id && (
                  <div className="px-4 pb-4 border-t border-gray-100">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                      <div className="flex items-center gap-2 text-sm">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{inq.name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <a
                          href={`mailto:${inq.email}`}
                          className="text-emerald-600 hover:underline"
                        >
                          {inq.email}
                        </a>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{inq.phone}</span>
                      </div>
                    </div>

                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs font-medium text-gray-500 mb-1">
                        お問い合わせ内容
                      </p>
                      <p className="text-sm text-gray-700">{inq.message}</p>
                    </div>

                    <div className="mt-3 p-3 bg-emerald-50 rounded-lg">
                      <div className="flex items-center gap-1 mb-1">
                        <FileText className="w-3 h-3 text-emerald-600" />
                        <p className="text-xs font-medium text-emerald-700">
                          シミュレーション結果
                        </p>
                      </div>
                      <p className="text-sm text-emerald-800 font-mono">
                        {inq.simulationResult}
                      </p>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <Button
                        size="sm"
                        className="bg-emerald-600 hover:bg-emerald-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(`mailto:${inq.email}?subject=Re: ${inq.subject}`);
                        }}
                      >
                        <Mail className="w-3 h-3 mr-1" />
                        メールで返信
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(`tel:${inq.phone}`);
                        }}
                      >
                        <Phone className="w-3 h-3 mr-1" />
                        電話する
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <p className="text-xs text-gray-400 text-center">
        全 {filteredInquiries.length} 件
      </p>
    </div>
  );
}
