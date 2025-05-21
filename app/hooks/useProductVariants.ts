import { useState } from 'react';
import { ProductVariant, StockEntry } from '@/types/types';
import { toast } from 'sonner';

export function useProductVariants() {
  const [variants, setVariants] = useState<ProductVariant[]>([{ 
    name: "Default", 
    priceOffset: 0, 
    stocks: [{ quantity: 0, location: "", sku: "", barcode: "" }] 
  }]);

  const addVariant = () => {
    setVariants([...variants, { 
      name: "", 
      priceOffset: 0, 
      stocks: [{ quantity: 0, location: "", sku: "", barcode: "" }] 
    }]);
  };

  const removeVariant = (index: number) => {
    if (variants.length === 1) {
      toast({
        title: "Error",
        description: "At least one variant is required.",
        variant: "destructive",
      });
      return;
    }
    
    const newVariants = [...variants];
    newVariants.splice(index, 1);
    setVariants(newVariants);
  };

  const updateVariant = (index: number, field: keyof Omit<ProductVariant, 'stocks'>, value: string | number) => {
    const newVariants = [...variants];
    newVariants[index][field] = value;
    setVariants(newVariants);
  };

  const updateStock = (variantIndex: number, stockIndex: number, field: keyof StockEntry, value: string | number) => {
    const newVariants = [...variants];
    newVariants[variantIndex].stocks[stockIndex][field] = value;
    setVariants(newVariants);
  };

  const addStock = (variantIndex: number) => {
    const newVariants = [...variants];
    newVariants[variantIndex].stocks.push({ 
      quantity: 0, 
      location: "", 
      sku: "", 
      barcode: "" 
    });
    setVariants(newVariants);
  };

  const removeStock = (variantIndex: number, stockIndex: number) => {
    if (variants[variantIndex].stocks.length === 1) {
      toast({
        title: "Error",
        description: "At least one stock entry is required.",
        variant: "destructive",
      });
      return;
    }
    
    const newVariants = [...variants];
    newVariants[variantIndex].stocks.splice(stockIndex, 1);
    setVariants(newVariants);
  };

  return {
    variants,
    addVariant,
    removeVariant,
    updateVariant,
    updateStock,
    addStock,
    removeStock,
    setVariants,
  };
}