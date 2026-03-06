"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  UtensilsCrossed,
  FolderOpen,
  Mail,
  TrendingUp,
  Clock,
  Eye,
} from "lucide-react";
import Link from "next/link";

const stats = [
  {
    title: "メニュー項目",
    value: "24",
    change: "+3 今月",
    icon: UtensilsCrossed,
    href: "/admin/menus",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    title: "カテゴリ",
    value: "4",
    change: "アクティブ",
    icon: FolderOpen,
    href: "/admin/categories",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    title: "お問い合わせ",
    value: "12",
    change: "3件 未読",
    icon: Mail,
    href: "/admin/inquiries",
    color: "text-orange-600",
    bg: "bg-orange-50",
  },
  {
    title: "今月のアクセス",
    value: "1,847",
    change: "+12.5%",
    icon: Eye,
    href: "/admin",
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
];

const recentInquiries = [
  {
    id: 1,
    name: "田中 太郎",
    subject: "料金プランについて",
    date: "2026/03/06 10:30",
    status: "new",
  },
  {
    id: 2,
    name: "佐藤 花子",
    subject: "カスタムプランのご相談",
    date: "2026/03/05 15:20",
    status: "new",
  },
  {
    id: 3,
    name: "鈴木 一郎",
    subject: "お見積り依頼",
    date: "2026/03/05 09:15",
    status: "read",
  },
  {
    id: 4,
    name: "高橋 美咲",
    subject: "サービス内容の確認",
    date: "2026/03/04 14:00",
    status: "replied",
  },
];

const recentMenuUpdates = [
  { name: "プレミアムプラン", price: "¥15,000", updated: "2時間前" },
  { name: "スタンダードプラン", price: "¥8,000", updated: "1日前" },
  { name: "延長オプション（30分）", price: "¥2,500", updated: "3日前" },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Link key={stat.title} href={stat.href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer border-gray-200">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {stat.value}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">{stat.change}</p>
                  </div>
                  <div className={`${stat.bg} p-3 rounded-xl`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Inquiries */}
        <Card className="border-gray-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">
                最近のお問い合わせ
              </CardTitle>
              <Link
                href="/admin/inquiries"
                className="text-sm text-emerald-600 hover:text-emerald-700"
              >
                すべて見る →
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentInquiries.map((inquiry) => (
              <div
                key={inquiry.id}
                className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {inquiry.name}
                    </p>
                    {inquiry.status === "new" && (
                      <Badge className="bg-red-100 text-red-700 hover:bg-red-100 text-[10px] px-1.5">
                        新着
                      </Badge>
                    )}
                    {inquiry.status === "replied" && (
                      <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 text-[10px] px-1.5">
                        返信済
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 truncate">
                    {inquiry.subject}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-400 ml-4 flex-shrink-0">
                  <Clock className="w-3 h-3" />
                  {inquiry.date}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Menu Updates */}
        <Card className="border-gray-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">
                最近の更新
              </CardTitle>
              <Link
                href="/admin/menus"
                className="text-sm text-emerald-600 hover:text-emerald-700"
              >
                メニュー管理 →
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentMenuUpdates.map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {item.name}
                  </p>
                  <p className="text-xs text-gray-500">{item.updated}に更新</p>
                </div>
                <span className="text-sm font-semibold text-gray-700">
                  {item.price}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
