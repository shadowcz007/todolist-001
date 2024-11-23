"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

interface MealItem {
  id: string;
  name: string;
  type: "breakfast" | "lunch" | "dinner" | "snack";
  date: string;
}

export default function Home() {
  const [meals, setMeals] = useState<MealItem[]>([]);
  const [newMeal, setNewMeal] = useState("");
  const [mealType, setMealType] = useState<MealItem["type"]>("breakfast");
  const { toast } = useToast();

  const addMeal = () => {
    if (!newMeal.trim()) {
      toast({
        title: "请输入食物名称",
        variant: "destructive",
      });
      return;
    }

    const meal: MealItem = {
      id: Math.random().toString(36).substring(7),
      name: newMeal,
      type: mealType,
      date: new Date().toISOString(),
    };

    setMeals([...meals, meal]);
    setNewMeal("");
    toast({
      title: "添加成功！",
      description: `${meal.name} 已添加到 ${getMealTypeText(meal.type)}`,
    });
  };

  const deleteMeal = (id: string) => {
    setMeals(meals.filter((meal) => meal.id !== id));
    toast({
      title: "删除成功",
    });
  };

  const getMealTypeText = (type: MealItem["type"]) => {
    const types = {
      breakfast: "早餐",
      lunch: "午餐",
      dinner: "晚餐",
      snack: "零食",
    };
    return types[type];
  };

  const groupedMeals = meals.reduce((acc, meal) => {
    const date = format(new Date(meal.date), "yyyy-MM-dd");
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(meal);
    return acc;
  }, {} as Record<string, MealItem[]>);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">我的饮食计划</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Label htmlFor="meal-name">食物名称</Label>
                <Input
                  id="meal-name"
                  placeholder="输入食物名称..."
                  value={newMeal}
                  onChange={(e) => setNewMeal(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div className="w-full md:w-48">
                <Label htmlFor="meal-type">用餐类型</Label>
                <Select value={mealType} onValueChange={(value: MealItem["type"]) => setMealType(value)}>
                  <SelectTrigger id="meal-type" className="mt-1">
                    <SelectValue placeholder="选择用餐类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="breakfast">早餐</SelectItem>
                    <SelectItem value="lunch">午餐</SelectItem>
                    <SelectItem value="dinner">晚餐</SelectItem>
                    <SelectItem value="snack">零食</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button onClick={addMeal} className="w-full md:w-auto">
                  <Plus className="mr-2 h-4 w-4" /> 添加
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {Object.entries(groupedMeals)
          .sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime())
          .map(([date, dayMeals]) => (
            <Card key={date} className="border-none shadow-md">
              <CardHeader>
                <CardTitle className="text-lg font-medium">
                  {format(new Date(date), "yyyy年MM月dd日")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {["breakfast", "lunch", "dinner", "snack"].map((type) => {
                    const mealsOfType = dayMeals.filter((meal) => meal.type === type);
                    if (mealsOfType.length === 0) return null;

                    return (
                      <div key={type} className="space-y-2">
                        <h3 className="font-medium text-gray-700 dark:text-gray-300">
                          {getMealTypeText(type as MealItem["type"])}
                        </h3>
                        <div className="space-y-2">
                          {mealsOfType.map((meal) => (
                            <div
                              key={meal.id}
                              className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm"
                            >
                              <span>{meal.name}</span>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => deleteMeal(meal.id)}
                                className="text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}

        {meals.length === 0 && (
          <Card className="border-none shadow-md bg-gray-50 dark:bg-gray-800">
            <CardContent className="flex flex-col items-center justify-center p-8">
              <p className="text-gray-500 dark:text-gray-400 text-center">
                还没有添加任何食物计划，开始添加吧！
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}