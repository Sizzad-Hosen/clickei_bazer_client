// "use client";
// import { useState } from "react";
// import { ChevronRight, ChevronDown } from "lucide-react";
// import { useGetSubCategoriesByCategoryQuery } from "@/redux/features/SubCategories/subCategoryApi";
// import SubCategoryItem from "./SubCategoryItem";

// export default function CategoryItem({ category, onProductSelect }: any) {
//   const [expanded, setExpanded] = useState(false);
//   const { data: subCategories, isLoading } = useGetSubCategoriesByCategoryQuery(
//     category._id,
//     { skip: !expanded }
//   );

//   return (
//     <div className="rounded cursor-pointer">
//       <div
//         onClick={() => setExpanded(!expanded)}
//         className="flex items-center justify-between hover:bg-gray-100 p-2"
//       >
//         <span>{category.name}</span>
//         {expanded ? (
//           <ChevronDown className="w-4 h-4 text-gray-400" />
//         ) : (
//           <ChevronRight className="w-4 h-4 text-gray-400" />
//         )}
//       </div>

//       {expanded && (
//         <div className="ml-4 border-l pl-2 space-y-2">
//           {isLoading ? (
//             <div className="p-2 text-sm text-gray-500">Loading...</div>
//           ) : (
//             subCategories?.data?.map((subCategory: any) => (
//               <SubCategoryItem
//                 key={subCategory._id}
//                 subCategory={subCategory}
//                 onProductSelect={onProductSelect}
//               />
//             ))
//           )}
//         </div>
//       )}
//     </div>
//   );
// }