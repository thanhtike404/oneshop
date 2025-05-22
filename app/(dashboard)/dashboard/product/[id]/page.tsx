'use client';

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';

interface ProductDetail {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  category: {
    id: string;
    name: string;
  };
  variants: Array<{
    id: string;
    name: string;
    priceOffset: number;
    stocks: Array<{
      id: string;
      quantity: number;
      location: string;
      sku: string;
      barcode: string;
    }>;
  }>;
  images: Array<{
    id: string;
    url: string;
    isPrimary: boolean;
  }>;
}

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id as string;

  const { data: product, isLoading } = useQuery<ProductDetail>({
    queryKey: ['product', productId],
    queryFn: async () => {
      const response = await axios.get(`/api/v1/products/${productId}`);
      return response.data;
    },
  });

  if (isLoading) {
    return <ProductDetailSkeleton />;
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{product.name}</h1>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="variants">Variants & Stock</TabsTrigger>
          <TabsTrigger value="images">Images</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Product Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium">Description</h3>
                <p className="text-muted-foreground">{product.description}</p>
              </div>
              <div>
                <h3 className="font-medium">Base Price</h3>
                <p className="text-muted-foreground">${product.basePrice}</p>
              </div>
              <div>
                <h3 className="font-medium">Category</h3>
                <p className="text-muted-foreground">{product.category.name}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="variants">
          <div className="grid gap-4">
            {product.variants.map((variant) => (
              <Card key={variant.id}>
                <CardHeader>
                  <CardTitle>{variant.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium">Price Adjustment</h3>
                      <p className="text-muted-foreground">${variant.priceOffset}</p>
                    </div>
                    <div>
                      <h3 className="font-medium">Stock Entries</h3>
                      <div className="mt-2">
                        <table className="w-full">
                          <thead>
                            <tr className="text-left border-b">
                              <th className="pb-2">Location</th>
                              <th className="pb-2">Quantity</th>
                              <th className="pb-2">SKU</th>
                              <th className="pb-2">Barcode</th>
                            </tr>
                          </thead>
                          <tbody>
                            {variant.stocks.map((stock) => (
                              <tr key={stock.id} className="border-b">
                                <td className="py-2">{stock.location}</td>
                                <td className="py-2">{stock.quantity}</td>
                                <td className="py-2">{stock.sku}</td>
                                <td className="py-2">{stock.barcode}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="images">
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {product.images.map((image) => (
                  <div key={image.id} className="relative aspect-square">
                    <img
                      src={image.url}
                      alt={product.name}
                      className="object-cover rounded-lg"
                    />
                    {image.isPrimary && (
                      <span className="absolute top-2 right-2 bg-primary text-primary-foreground px-2 py-1 rounded text-xs">
                        Primary
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ProductDetailSkeleton() {
  return (
    <div className="p-6 space-y-6">
      <Skeleton className="h-10 w-1/3" />
      <div className="space-y-4">
        <Skeleton className="h-[200px] w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-[100px]" />
          <Skeleton className="h-[100px]" />
        </div>
      </div>
    </div>
  );
}