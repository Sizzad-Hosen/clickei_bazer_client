import { ChevronRight, Egg, Heart, List } from "lucide-react";

const categories = [
  { name: "Food", icon: Egg },
  { name: "Pharmacy", icon: Heart },
  { name: "Cookups", icon: List },
  { name: "Personal Care" },
  { name: "Home & Kitchen" },
  { name: "Baby Care" },
  { name: "Pet Care" },
  { name: "Stationery & Office" },
];

export default function Sidebar() {
  return (
    <aside className="hidden md:block w-64 bg-white border-r p-4 overflow-y-auto">
      <div className="space-y-2">
        {categories.map((cat, index) => (
          <div key={index} className="flex items-center justify-between hover:bg-gray-100 p-2 rounded cursor-pointer">
            <div className="flex items-center gap-2">
              {cat.icon && <cat.icon className="w-4 h-4 text-gray-600" />}
              <span>{cat.name}</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>
        ))}
      </div>
    </aside>
  );
}
