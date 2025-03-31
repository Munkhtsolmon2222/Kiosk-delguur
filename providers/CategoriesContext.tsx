"use client";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { useInfiniteQuery } from "@tanstack/react-query";

interface Category {
  id: number;
  name: string;
  parent: number | null;
}

interface CategoryContextType {
  data: Category[] | undefined;
  error: Error | null;
  isLoading: boolean;
  isError: boolean;
  setMainCategory: React.Dispatch<React.SetStateAction<string>>;
  mainCategory: string;
  setSubCategory: React.Dispatch<React.SetStateAction<number>>;
  subCategory: number;
  setThirdCategory: React.Dispatch<React.SetStateAction<number>>;
  thirdCategory: number;
  fetchCategories: any;
}

const CategoryContext = createContext<CategoryContextType | undefined>(
  undefined
);

export const CategoryProvider = ({ children }: { children: ReactNode }) => {
  const [mainCategory, setMainCategory] = useState<string>("Эрэгтэй");
  const [subCategory, setSubCategory] = useState<number>(0);
  const [thirdCategory, setThirdCategory] = useState<number>(0);

  // Fetch categories with react-query
  const fetchCategories = async ({ pageParam = 1 }) => {
    const consumerKey = process.env.NEXT_PUBLIC_WC_CONSUMER_KEY;
    const consumerSecret = process.env.NEXT_PUBLIC_WC_CONSUMER_SECRET;

    if (!consumerKey || !consumerSecret) {
      throw new Error("WooCommerce API keys are missing");
    }

    const perPage = 100;
    const authHeader =
      typeof window === "undefined"
        ? Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64")
        : btoa(`${consumerKey}:${consumerSecret}`);

    const response = await fetch(
      `https://erchuudiindelguur.mn/wp-json/wc/v3/products/categories?per_page=${perPage}&page=${pageParam}`,
      {
        headers: {
          Authorization: `Basic ${authHeader}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    return response.json();
  };

  const { data, error, isLoading, isError } = useInfiniteQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === 100 ? allPages.length + 1 : undefined,
    refetchInterval:
      typeof window !== "undefined" && navigator.onLine ? false : 1000,
    initialPageParam: 1,
  });

  return (
    <CategoryContext.Provider
      value={{
        data: data?.pages.flat() || [],
        error,
        isLoading,
        isError,
        setMainCategory,
        mainCategory,
        setSubCategory,
        subCategory,
        setThirdCategory,
        thirdCategory,
        fetchCategories,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategories = () => {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error("useCategories must be used within a CategoryProvider");
  }
  return context;
};
