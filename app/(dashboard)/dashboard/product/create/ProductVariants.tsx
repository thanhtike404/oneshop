'use client';

import { PlusCircle, X } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormLabel } from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';

import { ProductVariant, StockEntry } from '@/types/types';

interface ProductVariantsProps {
  variants: ProductVariant[];
  onAddVariant: () => void;
  onRemoveVariant: (index: number) => void;
  onUpdateVariant: (
    index: number,
    field: keyof Omit<ProductVariant, 'stocks'>,
    value: string | number
  ) => void;
  onAddStock: (variantIndex: number) => void;
  onRemoveStock: (variantIndex: number, stockIndex: number) => void;
  onUpdateStock: (
    variantIndex: number,
    stockIndex: number,
    field: keyof StockEntry,
    value: string | number
  ) => void;
}

export default function ProductVariants({
  variants,
  onAddVariant,
  onRemoveVariant,
  onUpdateVariant,
  onAddStock,
  onRemoveStock,
  onUpdateStock,
}: ProductVariantsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Variants</CardTitle>
        <CardDescription>
          Add variants like sizes, colors, and manage their stock information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {variants.map((variant, variantIndex) => (
          <div
            key={variantIndex}
            className="border rounded-md p-4 bg-muted dark:bg-muted/40"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Variant {variantIndex + 1}</h3>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onRemoveVariant(variantIndex)}
                disabled={variants.length === 1}
              >
                <X className="h-4 w-4 mr-1" /> Remove
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <FormLabel htmlFor={`variant-name-${variantIndex}`}>
                  Variant Name
                </FormLabel>
                <Input
                  id={`variant-name-${variantIndex}`}
                  placeholder="e.g. Small, Red, etc."
                  value={variant.name}
                  onChange={(e) =>
                    onUpdateVariant(variantIndex, 'name', e.target.value)
                  }
                />
              </div>
              <div>
                <FormLabel htmlFor={`variant-price-${variantIndex}`}>
                  Price Adjustment
                </FormLabel>
                <Input
                  id={`variant-price-${variantIndex}`}
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={variant.priceOffset}
                  onChange={(e) =>
                    onUpdateVariant(
                      variantIndex,
                      'priceOffset',
                      parseFloat(e.target.value) || 0
                    )
                  }
                />
              </div>
            </div>

            <Separator className="my-4" />

            <h4 className="text-md font-medium mb-3">Stock Information</h4>

            {variant.stocks.map((stock, stockIndex) => (
              <div
                key={stockIndex}
                className="mb-4 p-4 rounded-md bg-gray-100 dark:bg-muted/40"
              >
                <div className="flex justify-between items-center mb-3">
                  <h5 className="text-sm font-medium">
                    Stock Entry {stockIndex + 1}
                  </h5>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveStock(variantIndex, stockIndex)}
                    disabled={variant.stocks.length === 1}
                  >
                    <X className="h-4 w-4 mr-1" /> Remove
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <FormLabel htmlFor={`stock-qty-${variantIndex}-${stockIndex}`}>
                      Quantity
                    </FormLabel>
                    <Input
                      id={`stock-qty-${variantIndex}-${stockIndex}`}
                      type="number"
                      min="0"
                      step="1"
                      value={stock.quantity}
                      onChange={(e) =>
                        onUpdateStock(
                          variantIndex,
                          stockIndex,
                          'quantity',
                          parseInt(e.target.value) || 0
                        )
                      }
                    />
                  </div>
                  <div>
                    <FormLabel htmlFor={`stock-location-${variantIndex}-${stockIndex}`}>
                      Location
                    </FormLabel>
                    <Input
                      id={`stock-location-${variantIndex}-${stockIndex}`}
                      placeholder="e.g. WH-A1"
                      value={stock.location || ''}
                      onChange={(e) =>
                        onUpdateStock(
                          variantIndex,
                          stockIndex,
                          'location',
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div>
                    <FormLabel htmlFor={`stock-sku-${variantIndex}-${stockIndex}`}>
                      SKU
                    </FormLabel>
                    <Input
                      id={`stock-sku-${variantIndex}-${stockIndex}`}
                      placeholder="Stock Keeping Unit"
                      value={stock.sku || ''}
                      onChange={(e) =>
                        onUpdateStock(variantIndex, stockIndex, 'sku', e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <FormLabel htmlFor={`stock-barcode-${variantIndex}-${stockIndex}`}>
                      Barcode
                    </FormLabel>
                    <Input
                      id={`stock-barcode-${variantIndex}-${stockIndex}`}
                      placeholder="Barcode"
                      value={stock.barcode || ''}
                      onChange={(e) =>
                        onUpdateStock(
                          variantIndex,
                          stockIndex,
                          'barcode',
                          e.target.value
                        )
                      }
                    />
                  </div>
                </div>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onAddStock(variantIndex)}
              className="w-full"
            >
              <PlusCircle className="h-4 w-4 mr-2" /> Add Another Stock Entry
            </Button>
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={onAddVariant}
          className="w-full"
        >
          <PlusCircle className="h-4 w-4 mr-2" /> Add Another Variant
        </Button>
      </CardContent>
    </Card>
  );
}
