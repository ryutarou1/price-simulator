"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Save, RotateCcw, Globe, Palette, Bell, Shield } from "lucide-react";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    siteName: "料金シミュレーター",
    siteDescription: "サービスの料金をかんたんにシミュレーションできます",
    contactEmail: "info@example.com",
    primaryColor: "emerald",
    taxIncluded: true,
    taxRate: "10",
    currency: "JPY",
    simulatorTitle: "料金シミュレーション",
    simulatorDescription: "ご希望のメニュー・オプションを選択してください",
    ctaButtonText: "この内容でお問い合わせ",
    notifyNewInquiry: true,
    notifyEmail: "admin@example.com",
    autoReply: true,
    autoReplyMessage:
      "お問い合わせありがとうございます。内容を確認の上、2営業日以内にご連絡いたします。",
    requirePhone: false,
    requireName: true,
    enableRecaptcha: false,
  });

  const updateSetting = <K extends keyof typeof settings>(
    key: K,
    value: (typeof settings)[K]
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    toast.success("設定を保存しました");
  };

  const handleReset = () => {
    toast.info("デフォルト設定に戻しました");
  };

  const colorOptions = [
    { value: "emerald", label: "グリーン", preview: "bg-emerald-500" },
    { value: "blue", label: "ブルー", preview: "bg-blue-500" },
    { value: "purple", label: "パープル", preview: "bg-purple-500" },
    { value: "orange", label: "オレンジ", preview: "bg-orange-500" },
    { value: "rose", label: "ローズ", preview: "bg-rose-500" },
  ];

  return (
    <div className="space-y-6 max-w-3xl">
      {/* General Settings */}
      <Card className="border-gray-200">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-gray-500" />
            <CardTitle className="text-base">基本設定</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="siteName">サイト名</Label>
            <Input
              id="siteName"
              value={settings.siteName}
              onChange={(e) => updateSetting("siteName", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="siteDescription">サイト説明</Label>
            <Textarea
              id="siteDescription"
              value={settings.siteDescription}
              onChange={(e) => updateSetting("siteDescription", e.target.value)}
              rows={2}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contactEmail">連絡先メールアドレス</Label>
            <Input
              id="contactEmail"
              type="email"
              value={settings.contactEmail}
              onChange={(e) => updateSetting("contactEmail", e.target.value)}
            />
          </div>
          <Separator />
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>通貨</Label>
              <Select
                value={settings.currency}
                onValueChange={(v) => updateSetting("currency", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="JPY">日本円 (¥)</SelectItem>
                  <SelectItem value="USD">米ドル ($)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="taxRate">消費税率 (%)</Label>
              <Input
                id="taxRate"
                type="number"
                value={settings.taxRate}
                onChange={(e) => updateSetting("taxRate", e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>税込み表示</Label>
              <p className="text-xs text-gray-500">
                料金を税込みで表示します
              </p>
            </div>
            <Switch
              checked={settings.taxIncluded}
              onCheckedChange={(v) => updateSetting("taxIncluded", v)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card className="border-gray-200">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-gray-500" />
            <CardTitle className="text-base">表示設定</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>テーマカラー</Label>
            <div className="flex gap-3">
              {colorOptions.map((color) => (
                <button
                  key={color.value}
                  onClick={() => updateSetting("primaryColor", color.value)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition-colors ${
                    settings.primaryColor === color.value
                      ? "border-gray-900"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full ${color.preview}`} />
                  <span className="text-sm">{color.label}</span>
                </button>
              ))}
            </div>
          </div>
          <Separator />
          <div className="space-y-2">
            <Label htmlFor="simulatorTitle">シミュレーター タイトル</Label>
            <Input
              id="simulatorTitle"
              value={settings.simulatorTitle}
              onChange={(e) =>
                updateSetting("simulatorTitle", e.target.value)
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="simulatorDescription">
              シミュレーター 説明文
            </Label>
            <Textarea
              id="simulatorDescription"
              value={settings.simulatorDescription}
              onChange={(e) =>
                updateSetting("simulatorDescription", e.target.value)
              }
              rows={2}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ctaButtonText">
              お問い合わせボタン テキスト
            </Label>
            <Input
              id="ctaButtonText"
              value={settings.ctaButtonText}
              onChange={(e) => updateSetting("ctaButtonText", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card className="border-gray-200">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-gray-500" />
            <CardTitle className="text-base">通知設定</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>新規お問い合わせ通知</Label>
              <p className="text-xs text-gray-500">
                お問い合わせがあった時にメールで通知します
              </p>
            </div>
            <Switch
              checked={settings.notifyNewInquiry}
              onCheckedChange={(v) => updateSetting("notifyNewInquiry", v)}
            />
          </div>
          {settings.notifyNewInquiry && (
            <div className="space-y-2 pl-0">
              <Label htmlFor="notifyEmail">通知先メールアドレス</Label>
              <Input
                id="notifyEmail"
                type="email"
                value={settings.notifyEmail}
                onChange={(e) => updateSetting("notifyEmail", e.target.value)}
              />
            </div>
          )}
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <Label>自動返信</Label>
              <p className="text-xs text-gray-500">
                お問い合わせ送信者に自動返信メールを送ります
              </p>
            </div>
            <Switch
              checked={settings.autoReply}
              onCheckedChange={(v) => updateSetting("autoReply", v)}
            />
          </div>
          {settings.autoReply && (
            <div className="space-y-2">
              <Label htmlFor="autoReplyMessage">自動返信メッセージ</Label>
              <Textarea
                id="autoReplyMessage"
                value={settings.autoReplyMessage}
                onChange={(e) =>
                  updateSetting("autoReplyMessage", e.target.value)
                }
                rows={3}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Form Settings */}
      <Card className="border-gray-200">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-gray-500" />
            <CardTitle className="text-base">フォーム設定</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>氏名を必須にする</Label>
              <p className="text-xs text-gray-500">
                お問い合わせフォームで氏名の入力を必須にします
              </p>
            </div>
            <Switch
              checked={settings.requireName}
              onCheckedChange={(v) => updateSetting("requireName", v)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>電話番号を必須にする</Label>
              <p className="text-xs text-gray-500">
                お問い合わせフォームで電話番号の入力を必須にします
              </p>
            </div>
            <Switch
              checked={settings.requirePhone}
              onCheckedChange={(v) => updateSetting("requirePhone", v)}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <Label>reCAPTCHA</Label>
              <p className="text-xs text-gray-500">
                スパム対策としてreCAPTCHAを有効にします
              </p>
            </div>
            <Switch
              checked={settings.enableRecaptcha}
              onCheckedChange={(v) => updateSetting("enableRecaptcha", v)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-2 pb-8">
        <Button variant="outline" onClick={handleReset}>
          <RotateCcw className="w-4 h-4 mr-2" />
          デフォルトに戻す
        </Button>
        <Button
          className="bg-emerald-600 hover:bg-emerald-700"
          onClick={handleSave}
        >
          <Save className="w-4 h-4 mr-2" />
          設定を保存
        </Button>
      </div>
    </div>
  );
}
