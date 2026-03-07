"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  GripVertical,
  Check,
  X,
} from "lucide-react";
import { toast } from "sonner";

type MenuItem = {
  id: number;
  name: string;
  category: string;
  price: number;
  description: string;
  active: boolean;
};

const initialMenuItems: MenuItem[] = [
  { id: 1, name: "基本メニュー A", category: "基本メニュー", price: 5000, description: "スタンダードな基本プラン", active: true },
  { id: 2, name: "基本メニュー B", category: "基本メニュー", price: 8000, description: "充実の基本プラン", active: true },
  { id: 3, name: "基本メニュー C", category: "基本メニュー", price: 12000, description: "プレミアム基本プラン", active: true },
  { id: 4, name: "延長 30分", category: "ご利用時間", price: 2500, description: "30分延長オプション", active: true },
  { id: 5, name: "延長 60分", category: "ご利用時間", price: 4500, description: "60分延長オプション", active: true },
  { id: 6, name: "ドリンクサービス", category: "オプション", price: 1500, description: "ドリンク飲み放題", active: true },
  { id: 7, name: "撮影オプション", category: "オプション", price: 3000, description: "プロカメラマンによる撮影", active: true },
  { id: 8, name: "VIPルーム", category: "オプション", price: 5000, description: "個室VIPルーム利用", active: false },
  { id: 9, name: "送迎サービス", category: "オプション", price: 3500, description: "ご指定場所への送迎", active: true },
  { id: 10, name: "ギフトラッピング", category: "オプション", price: 800, description: "プレゼント用ラッピング", active: true },
];

const categories = ["基本メニュー", "ご利用時間", "オプション", "ご利用人数"];

export default function MenusPage() {
  const [items, setItems] = useState<MenuItem[]>(initialMenuItems);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [deletingItem, setDeletingItem] = useState<MenuItem | null>(null);
  const [editingPriceId, setEditingPriceId] = useState<number | null>(null);
  const [editingPriceValue, setEditingPriceValue] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    description: "",
    active: true,
  });

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const openCreateDialog = () => {
    setEditingItem(null);
    setFormData({
      name: "",
      category: categories[0],
      price: "",
      description: "",
      active: true,
    });
    setDialogOpen(true);
  };

  const openEditDialog = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      price: item.price.toString(),
      description: item.description,
      active: item.active,
    });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.price) {
      toast.error("項目名と料金は必須です");
      return;
    }

    if (editingItem) {
      setItems(
        items.map((item) =>
          item.id === editingItem.id
            ? {
                ...item,
                name: formData.name,
                category: formData.category,
                price: parseInt(formData.price),
                description: formData.description,
                active: formData.active,
              }
            : item
        )
      );
      toast.success(`「${formData.name}」を更新しました`);
    } else {
      const newItem: MenuItem = {
        id: Math.max(...items.map((i) => i.id)) + 1,
        name: formData.name,
        category: formData.category,
        price: parseInt(formData.price),
        description: formData.description,
        active: formData.active,
      };
      setItems([...items, newItem]);
      toast.success(`「${formData.name}」を追加しました`);
    }
    setDialogOpen(false);
  };

  const handleDelete = () => {
    if (deletingItem) {
      setItems(items.filter((item) => item.id !== deletingItem.id));
      toast.success(`「${deletingItem.name}」を削除しました`);
      setDeleteDialogOpen(false);
      setDeletingItem(null);
    }
  };

  const handleToggleActive = (id: number) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, active: !item.active } : item
      )
    );
    const item = items.find((i) => i.id === id);
    if (item) {
      toast.success(
        `「${item.name}」を${item.active ? "非公開" : "公開"}にしました`
      );
    }
  };

  const startInlineEdit = (id: number, price: number) => {
    setEditingPriceId(id);
    setEditingPriceValue(price.toString());
  };

  const saveInlineEdit = (id: number) => {
    const newPrice = parseInt(editingPriceValue);
    if (isNaN(newPrice) || newPrice < 0) {
      toast.error("正しい料金を入力してください");
      setEditingPriceId(null);
      return;
    }
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, price: newPrice } : item
      )
    );
    const item = items.find((i) => i.id === id);
    toast.success(`「${item?.name}」の料金を¥${newPrice.toLocaleString()}に更新しました`);
    setEditingPriceId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <p className="text-sm text-gray-500">
            シミュレーターに表示されるメニュー項目を管理します
          </p>
        </div>
        <Button
          onClick={openCreateDialog}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          メニューを追加
        </Button>
      </div>

      {/* Filters */}
      <Card className="border-gray-200">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="メニュー名で検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="カテゴリで絞り込み" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">すべてのカテゴリ</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border-gray-200">
        <CardContent className="p-0 overflow-x-auto">
          <Table className="min-w-[600px]">
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="w-10"></TableHead>
                <TableHead>メニュー名</TableHead>
                <TableHead>カテゴリ</TableHead>
                <TableHead className="text-right">
                  料金
                  <span className="text-xs text-gray-400 ml-1">
                    (クリックで編集)
                  </span>
                </TableHead>
                <TableHead className="text-center">公開</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12">
                    <div className="text-gray-400">
                      <UtensilsCrossedIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
                      <p className="text-sm">
                        メニュー項目がありません。
                        <br />
                        「メニューを追加」ボタンから追加してください。
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredItems.map((item) => (
                  <TableRow
                    key={item.id}
                    className={!item.active ? "opacity-50" : ""}
                  >
                    <TableCell>
                      <GripVertical className="w-4 h-4 text-gray-300 cursor-grab" />
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-xs text-gray-400">
                          {item.description}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="text-xs font-normal"
                      >
                        {item.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {editingPriceId === item.id ? (
                        <div className="flex items-center justify-end gap-1">
                          <span className="text-gray-400">¥</span>
                          <Input
                            type="number"
                            value={editingPriceValue}
                            onChange={(e) =>
                              setEditingPriceValue(e.target.value)
                            }
                            onKeyDown={(e) => {
                              if (e.key === "Enter") saveInlineEdit(item.id);
                              if (e.key === "Escape") setEditingPriceId(null);
                            }}
                            className="w-24 h-8 text-right text-sm"
                            autoFocus
                          />
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-emerald-600"
                            onClick={() => saveInlineEdit(item.id)}
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-gray-400"
                            onClick={() => setEditingPriceId(null)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <button
                          onClick={() => startInlineEdit(item.id, item.price)}
                          className="font-semibold text-gray-900 hover:text-emerald-600 hover:bg-emerald-50 px-2 py-1 rounded transition-colors cursor-pointer"
                        >
                          ¥{item.price.toLocaleString()}
                        </button>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <Switch
                        checked={item.active}
                        onCheckedChange={() => handleToggleActive(item.id)}
                        className="data-[state=checked]:bg-emerald-600"
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-gray-500 hover:text-emerald-600"
                          onClick={() => openEditDialog(item)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-gray-500 hover:text-red-600"
                          onClick={() => {
                            setDeletingItem(item);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <p className="text-xs text-gray-400 text-center">
        全 {filteredItems.length} 件
      </p>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? "メニューを編集" : "メニューを追加"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                メニュー名 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="例：プレミアムプラン"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">カテゴリ</Label>
              <Select
                value={formData.category}
                onValueChange={(v) => setFormData({ ...formData, category: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">
                料金（円）<span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  ¥
                </span>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  placeholder="5000"
                  className="pl-8"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">説明</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="メニューの説明を入力..."
                rows={3}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="active">公開する</Label>
              <Switch
                id="active"
                checked={formData.active}
                onCheckedChange={(v) => setFormData({ ...formData, active: v })}
                className="data-[state=checked]:bg-emerald-600"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              キャンセル
            </Button>
            <Button
              onClick={handleSave}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {editingItem ? "更新する" : "追加する"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>メニューの削除</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600 py-4">
            「{deletingItem?.name}
            」を削除します。この操作は取り消せません。よろしいですか？
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              キャンセル
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
            >
              削除する
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function UtensilsCrossedIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m16 2-2.3 2.3a3 3 0 0 0 0 4.2l1.8 1.8a3 3 0 0 0 4.2 0L22 8" />
      <path d="M15 15 3.3 3.3a4.2 4.2 0 0 0 0 6l7.3 7.3c.7.7 2 .7 2.8 0L15 15Zm0 0 7 7" />
      <path d="m2.1 21.8 6.4-6.3" />
      <path d="m19 5-7 7" />
    </svg>
  );
}
