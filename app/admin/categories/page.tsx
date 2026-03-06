"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Plus,
  Pencil,
  Trash2,
  GripVertical,
  ArrowUp,
  ArrowDown,
  FolderOpen,
  Check,
  X,
} from "lucide-react";
import { toast } from "sonner";

type Category = {
  id: number;
  name: string;
  itemCount: number;
  order: number;
  color: string;
};

const initialCategories: Category[] = [
  { id: 1, name: "基本メニュー", itemCount: 3, order: 1, color: "bg-emerald-500" },
  { id: 2, name: "ご利用時間", itemCount: 2, order: 2, color: "bg-blue-500" },
  { id: 3, name: "オプション", itemCount: 5, order: 3, color: "bg-orange-500" },
  { id: 4, name: "ご利用人数", itemCount: 4, order: 4, color: "bg-purple-500" },
];

const colorOptions = [
  { value: "bg-emerald-500", label: "グリーン" },
  { value: "bg-blue-500", label: "ブルー" },
  { value: "bg-orange-500", label: "オレンジ" },
  { value: "bg-purple-500", label: "パープル" },
  { value: "bg-red-500", label: "レッド" },
  { value: "bg-pink-500", label: "ピンク" },
  { value: "bg-yellow-500", label: "イエロー" },
  { value: "bg-cyan-500", label: "シアン" },
];

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);

  const sortedCategories = [...categories].sort((a, b) => a.order - b.order);

  const startEdit = (cat: Category) => {
    setEditingId(cat.id);
    setEditingName(cat.name);
  };

  const saveEdit = (id: number) => {
    if (!editingName.trim()) {
      toast.error("カテゴリ名を入力してください");
      return;
    }
    setCategories(
      categories.map((c) => (c.id === id ? { ...c, name: editingName } : c))
    );
    toast.success(`カテゴリ名を「${editingName}」に更新しました`);
    setEditingId(null);
  };

  const addCategory = () => {
    if (!newCategoryName.trim()) {
      toast.error("カテゴリ名を入力してください");
      return;
    }
    const maxOrder = Math.max(...categories.map((c) => c.order), 0);
    const colorIndex = categories.length % colorOptions.length;
    const newCat: Category = {
      id: Math.max(...categories.map((c) => c.id), 0) + 1,
      name: newCategoryName,
      itemCount: 0,
      order: maxOrder + 1,
      color: colorOptions[colorIndex].value,
    };
    setCategories([...categories, newCat]);
    toast.success(`「${newCategoryName}」を追加しました`);
    setNewCategoryName("");
  };

  const moveUp = (id: number) => {
    const sorted = sortedCategories;
    const idx = sorted.findIndex((c) => c.id === id);
    if (idx <= 0) return;
    const newCategories = categories.map((c) => {
      if (c.id === sorted[idx].id) return { ...c, order: sorted[idx - 1].order };
      if (c.id === sorted[idx - 1].id) return { ...c, order: sorted[idx].order };
      return c;
    });
    setCategories(newCategories);
    toast.success("並び順を変更しました");
  };

  const moveDown = (id: number) => {
    const sorted = sortedCategories;
    const idx = sorted.findIndex((c) => c.id === id);
    if (idx >= sorted.length - 1) return;
    const newCategories = categories.map((c) => {
      if (c.id === sorted[idx].id) return { ...c, order: sorted[idx + 1].order };
      if (c.id === sorted[idx + 1].id) return { ...c, order: sorted[idx].order };
      return c;
    });
    setCategories(newCategories);
    toast.success("並び順を変更しました");
  };

  const handleDelete = () => {
    if (deletingCategory) {
      setCategories(categories.filter((c) => c.id !== deletingCategory.id));
      toast.success(`「${deletingCategory.name}」を削除しました`);
      setDeleteDialogOpen(false);
      setDeletingCategory(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-gray-500">
          シミュレーターのカテゴリ（グループ）を管理します。並び順はシミュレーターの表示順に反映されます。
        </p>
      </div>

      {/* Category List */}
      <div className="space-y-2">
        {sortedCategories.map((cat, index) => (
          <Card key={cat.id} className="border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <GripVertical className="w-5 h-5 text-gray-300 cursor-grab flex-shrink-0" />
                <div className={`w-3 h-3 rounded-full ${cat.color} flex-shrink-0`} />

                {editingId === cat.id ? (
                  <div className="flex items-center gap-2 flex-1">
                    <Input
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") saveEdit(cat.id);
                        if (e.key === "Escape") setEditingId(null);
                      }}
                      className="h-8 max-w-xs"
                      autoFocus
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-emerald-600"
                      onClick={() => saveEdit(cat.id)}
                    >
                      <Check className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-gray-400"
                      onClick={() => setEditingId(null)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="flex-1">
                      <span className="font-medium text-gray-900">
                        {cat.name}
                      </span>
                      <Badge
                        variant="outline"
                        className="ml-2 text-xs font-normal"
                      >
                        {cat.itemCount}件
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-gray-400 hover:text-gray-600"
                        onClick={() => moveUp(cat.id)}
                        disabled={index === 0}
                      >
                        <ArrowUp className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-gray-400 hover:text-gray-600"
                        onClick={() => moveDown(cat.id)}
                        disabled={index === sortedCategories.length - 1}
                      >
                        <ArrowDown className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-gray-500 hover:text-emerald-600"
                        onClick={() => startEdit(cat)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-gray-500 hover:text-red-600"
                        onClick={() => {
                          setDeletingCategory(cat);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Category */}
      <Card className="border-dashed border-gray-300 border-2">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Plus className="w-5 h-5 text-gray-400" />
            <Input
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") addCategory();
              }}
              placeholder="新しいカテゴリ名を入力..."
              className="flex-1"
            />
            <Button
              onClick={addCategory}
              className="bg-emerald-600 hover:bg-emerald-700"
              disabled={!newCategoryName.trim()}
            >
              追加
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Empty State */}
      {categories.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <FolderOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm">
            カテゴリがありません。
            <br />
            上のフォームから追加してください。
          </p>
        </div>
      )}

      {/* Delete Confirmation */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>カテゴリの削除</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600 py-4">
            「{deletingCategory?.name}」を削除します。
            {deletingCategory && deletingCategory.itemCount > 0 && (
              <span className="text-red-600 font-medium">
                このカテゴリには{deletingCategory.itemCount}
                件のメニューが含まれています。
              </span>
            )}
            よろしいですか？
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              キャンセル
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              削除する
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
