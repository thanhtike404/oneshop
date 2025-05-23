import Image from "next/image";
import { getProducts } from "@/lib/getProducts";
import { getCategories } from "@/lib/getCategories";
import { CategoryType } from "@/types/categoryType";

export default async function Home() {
  const products = await getProducts();
  const categories = await getCategories();
  const featuredProducts = products.slice(0, 6);
  const newArrivals = products.slice(6, 10);

  return (
    <div className="font-[family-name:var(--font-geist-sans)] min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative h-screen min-h-96 w-full">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1551232864-3f0890e580d9?w=1600&auto=format&fit=crop"
            alt="Hero Image"
            fill
            className="object-cover brightness-50"
            priority
          />
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 max-w-4xl">
            Discover Your <span className="text-amber-400">Perfect Style</span>
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl text-gray-200">
            Curated collections of premium fashion and lifestyle products
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="px-8 py-3 bg-white text-black font-semibold rounded-full hover:bg-amber-400 transition duration-300">
              Shop Now
            </button>
            <button className="px-8 py-3 bg-transparent border border-white font-semibold rounded-full hover:bg-white/10 transition duration-300">
              View Collections
            </button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 px-6 md:px-12 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-12 text-center">
            Shop by <span className="text-amber-400">Category</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
            {categories.map((category: CategoryType | any) => (
              <div key={category.id} className="group cursor-pointer">
                <div className="relative h-48 md:h-64 rounded-lg overflow-hidden mb-3">
                  <Image
                    src={category.imageUrl}
                    alt={category.name}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-lg font-semibold">{category.name}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 px-6 md:px-12 lg:px-20 bg-neutral-950">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold">
              Featured <span className="text-amber-400">Products</span>
            </h2>
            <button className="hidden md:block text-sm font-medium border-b border-amber-400 pb-1 hover:text-amber-400 transition duration-300">
              View All Products
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                className="group bg-neutral-900 rounded-xl overflow-hidden border border-neutral-800 hover:border-amber-400/50 transition duration-300"
              >
                <div className="relative h-64 w-full overflow-hidden">
                  <Image
                    src={product.images[0]?.url || "/placeholder.png"}
                    alt={product.images[0]?.altText || product.name}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute top-3 right-3 z-10">
                    <button className="h-10 w-10 rounded-full bg-black/60 flex items-center justify-center backdrop-blur-sm hover:bg-amber-400 transition duration-300">
                      <svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 17.25L8.55 15.9C4.4 12.1 1.75 9.7 1.75 6.75C1.75 4.35 3.65 2.45 6.05 2.45C7.35 2.45 8.6 3.05 9.5 4C10.4 3.05 11.65 2.45 12.95 2.45C15.35 2.45 17.25 4.35 17.25 6.75C17.25 9.7 14.6 12.1 10.45 15.9L10 17.25Z" fill="white"/>
                      </svg>
                    </button>
                    // In your product card component, add a button:
<a

  href={`/product/${product.id}`}
  className="text-sm font-medium border-b border-amber-400 pb-1 hover:text-amber-400 transition duration-300"
>
  View Details
</a>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg line-clamp-1">{product.name}</h3>
                    <p className="font-bold text-amber-400">${product.basePrice.toFixed(2)}</p>
                  </div>
                  <p className="text-sm text-gray-400 line-clamp-2 mb-4">{product.description}</p>
                  <button className="w-full py-3 bg-neutral-800 hover:bg-amber-400 hover:text-black transition duration-300 rounded-lg font-medium">
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8 md:hidden">
            <button className="px-6 py-3 border border-white rounded-lg hover:bg-white hover:text-black transition duration-300">
              View All Products
            </button>
          </div>
        </div>
      </section>

      {/* New Arrivals Banner */}
      <section className="py-16 px-6 md:px-12 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="relative h-96 rounded-2xl overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1490367532201-b9bc1dc483f6?w=1200&auto=format&fit=crop"
              alt="New Arrivals"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent" />
            <div className="absolute top-0 left-0 h-full flex flex-col justify-center p-8 md:p-16 max-w-md">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">New Season Arrivals</h2>
              <p className="text-gray-200 mb-6">Discover the latest trends and must-have pieces for the season.</p>
              <button className="px-8 py-3 bg-amber-400 text-black font-semibold rounded-full hover:bg-white transition duration-300 self-start">
                Shop Collection
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* New Arrival Products */}
      <section className="py-16 px-6 md:px-12 lg:px-20 bg-neutral-950">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-12">
            New <span className="text-amber-400">Arrivals</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {newArrivals.map((product) => (
              <div
                key={product.id}
                className="group bg-neutral-900 rounded-xl overflow-hidden border border-neutral-800 hover:border-amber-400/50 transition duration-300"
              >
                <div className="relative h-64 w-full overflow-hidden">
                  <Image
                    src={product.images[0]?.url || "/placeholder.png"}
                    alt={product.images[0]?.altText || product.name}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-base mb-1">{product.name}</h3>
                  <p className="font-bold text-amber-400">${product.basePrice.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 px-6 md:px-12 lg:px-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Join Our Newsletter</h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter and be the first to know about new collections, special offers, and exclusive events.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-grow px-5 py-3 rounded-full bg-neutral-800 border border-neutral-700 focus:outline-none focus:border-amber-400"
            />
            <button className="whitespace-nowrap px-6 py-3 bg-amber-400 text-black font-medium rounded-full hover:bg-white transition duration-300">
              Subscribe Now
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 md:px-12 lg:px-20 border-t border-neutral-800">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <h3 className="text-xl font-bold mb-6">FashionStore</h3>
            <p className="text-gray-400 mb-6">
              Curated collections of premium fashion and lifestyle products for the modern individual.
            </p>
            <div className="flex gap-4">
              <a href="#" className="h-10 w-10 rounded-full border border-neutral-700 flex items-center justify-center hover:border-amber-400 hover:bg-amber-400 hover:text-black transition duration-300">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 2H15C13.6739 2 12.4021 2.52678 11.4645 3.46447C10.5268 4.40215 10 5.67392 10 7V10H7V14H10V22H14V14H17L18 10H14V7C14 6.73478 14.1054 6.48043 14.2929 6.29289C14.4804 6.10536 14.7348 6 15 6H18V2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
              <a href="#" className="h-10 w-10 rounded-full border border-neutral-700 flex items-center justify-center hover:border-amber-400 hover:bg-amber-400 hover:text-black transition duration-300">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17 2H7C4.23858 2 2 4.23858 2 7V17C2 19.7614 4.23858 22 7 22H17C19.7614 22 22 19.7614 22 17V7C22 4.23858 19.7614 2 17 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 11.37C16.1234 12.2022 15.9813 13.0522 15.5938 13.799C15.2063 14.5458 14.5931 15.1514 13.8416 15.5297C13.0901 15.9079 12.2384 16.0396 11.4078 15.9059C10.5771 15.7723 9.80976 15.3801 9.21484 14.7852C8.61991 14.1902 8.22773 13.4229 8.09406 12.5922C7.9604 11.7615 8.09206 10.9099 8.47032 10.1584C8.84858 9.40685 9.45418 8.79374 10.201 8.40624C10.9478 8.01874 11.7978 7.87658 12.63 8C13.4789 8.12588 14.2648 8.52146 14.8717 9.12831C15.4785 9.73515 15.8741 10.5211 16 11.37Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M17.5 6.5H17.51" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
              <a href="#" className="h-10 w-10 rounded-full border border-neutral-700 flex items-center justify-center hover:border-amber-400 hover:bg-amber-400 hover:text-black transition duration-300">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M23 3.00005C22.0424 3.67552 20.9821 4.19216 19.86 4.53005C19.2577 3.83756 18.4573 3.34674 17.567 3.12397C16.6767 2.90121 15.7395 2.95724 14.8821 3.2845C14.0247 3.61176 13.2884 4.19445 12.773 4.95376C12.2575 5.71308 11.9877 6.61238 12 7.53005V8.53005C10.2426 8.57561 8.50127 8.18586 6.93101 7.39549C5.36074 6.60513 4.01032 5.43868 3 4.00005C3 4.00005 -1 13 8 17C5.94053 18.398 3.48716 19.099 1 19C10 24 21 19 21 7.50005C20.9991 7.2215 20.9723 6.94364 20.92 6.67005C21.9406 5.66354 22.6608 4.39276 23 3.00005Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>  
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-base font-bold uppercase mb-6">Shop</h4>
            <ul className="flex flex-col gap-3">
              <li><a href="#" className="text-gray-400 hover:text-amber-400 transition duration-200">Women</a></li>
              <li><a href="#" className="text-gray-400 hover:text-amber-400 transition duration-200">Men</a></li>
              <li><a href="#" className="text-gray-400 hover:text-amber-400 transition duration-200">Kids</a></li>
              <li><a href="#" className="text-gray-400 hover:text-amber-400 transition duration-200">Accessories</a></li>
              <li><a href="#" className="text-gray-400 hover:text-amber-400 transition duration-200">Home</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-base font-bold uppercase mb-6">Help</h4>
            <ul className="flex flex-col gap-3">
              <li><a href="#" className="text-gray-400 hover:text-amber-400 transition duration-200">Customer Service</a></li>
              <li><a href="#" className="text-gray-400 hover:text-amber-400 transition duration-200">My Account</a></li>
              <li><a href="#" className="text-gray-400 hover:text-amber-400 transition duration-200">Find a Store</a></li>
              <li><a href="#" className="text-gray-400 hover:text-amber-400 transition duration-200">Legal & Privacy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-amber-400 transition duration-200">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-base font-bold uppercase mb-6">About</h4>
            <ul className="flex flex-col gap-3">
              <li><a href="#" className="text-gray-400 hover:text-amber-400 transition duration-200">Company Information</a></li>
              <li><a href="#" className="text-gray-400 hover:text-amber-400 transition duration-200">Careers</a></li>
              <li><a href="#" className="text-gray-400 hover:text-amber-400 transition duration-200">Store Locations</a></li>
              <li><a href="#" className="text-gray-400 hover:text-amber-400 transition duration-200">Sustainability</a></li>
              <li><a href="#" className="text-gray-400 hover:text-amber-400 transition duration-200">Affiliate Program</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-neutral-800 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">© 2025 FashionStore. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="text-gray-500 text-sm hover:text-amber-400">Terms</a>
            <a href="#" className="text-gray-500 text-sm hover:text-amber-400">Privacy</a>
            <a href="#" className="text-gray-500 text-sm hover:text-amber-400">Cookies</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
