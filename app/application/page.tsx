"use client";

import { useState } from "react";
import Image from "next/image";
import {
  ArrowRight,
  Check,
  ChevronRight,
  Cpu,
  Gamepad2,
  Headphones,
  Heart,
  Laptop,
  LayoutGrid,
  Menu,
  Monitor,
  Package,
  Search,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Sparkles,
  Star,
  Truck,
  X,
  Zap,
} from "lucide-react";

const categories = [
  { name: "All products", icon: LayoutGrid },
  { name: "Laptops", icon: Laptop },
  { name: "Smartphones", icon: Smartphone },
  { name: "Audio", icon: Headphones },
  { name: "Gaming", icon: Gamepad2 },
  { name: "Accessories", icon: Monitor },
];

const products = [
  {
    id: 1,
    name: "Studio Wireless",
    category: "Audio",
    description: "Less noise. More music.",
    price: 249,
    rating: "4.9",
    badge: "BESTSELLER",
    image: "photo-1546435770-a3e426bf472b",
    background: "bg-[#edf0f5]",
  },
  {
    id: 2,
    name: "AirBook Pro 14",
    category: "Laptops",
    description: "Big ideas. Light footprint.",
    price: 1299,
    rating: "4.8",
    badge: "NEW",
    image: "photo-1517336714731-489689fd1ca8",
    background: "bg-[#f3f0ec]",
  },
  {
    id: 3,
    name: "Pocket Pro",
    category: "Smartphones",
    description: "Your everyday, upgraded.",
    price: 799,
    rating: "4.9",
    badge: "",
    image: "photo-1511707171634-5f897ff02aa9",
    background: "bg-[#eef2ef]",
  },
  {
    id: 4,
    name: "Play Wireless",
    category: "Gaming",
    description: "Built for your next win.",
    price: 69,
    rating: "4.7",
    badge: "TOP PICK",
    image: "photo-1606144042614-b2417e99c4e3",
    background: "bg-[#f0edf5]",
  },
  {
    id: 5,
    name: "Desktop Essentials",
    category: "Accessories",
    description: "Make room for better work.",
    price: 119,
    rating: "4.8",
    badge: "",
    image: "photo-1527864550417-7fd91fc51a46",
    background: "bg-[#eef1f4]",
  },
  {
    id: 6,
    name: "Everyday Headphones",
    category: "Audio",
    description: "A soundtrack for everything.",
    price: 149,
    rating: "4.6",
    badge: "",
    image: "photo-1505740420928-5e560c06d30e",
    background: "bg-[#f7f0df]",
  },
];

const money = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);

export default function Home() {
  const [category, setCategory] = useState("All products");
  const [search, setSearch] = useState("");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState<number[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);

const filteredProducts = products.filter(
    (product) =>
      (category === "All products" || product.category === category) &&
      `${product.name} ${product.category}`
        .toLowerCase()
        .includes(search.toLowerCase()),
)
const cartProducts = products.filter((product) =>
    cart.includes(product.id),
  );

const subtotal = cart.reduce(
    (total, id) =>
      total + (products.find((product) => product.id === id)?.price ?? 0),
    0,
  );

function toggleFavorite(id: number) {
    setFavorites((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  }

return (
    <div className="min-h-screen bg-[#f7f8fa] text-slate-900">
      {/* White header */}
      <header className="sticky top-0 z-40 flex h-20 items-center gap-6 border-b border-slate-100 bg-white px-5 lg:px-8">
        <button
          type="button"
          aria-label={mobileMenu ? "Close navigation" : "Open navigation"}
          aria-expanded={mobileMenu}
          aria-controls="shop-sidebar"
          onClick={() => setMobileMenu(!mobileMenu)}
          className="rounded-lg p-2 hover:bg-slate-100 lg:hidden"
        >
          {mobileMenu ? <X size={22} /> : <Menu size={22} />}
        </button>

<a href="/" className="flex items-center gap-2.5 lg:w-52">
          <span className="rounded-xl bg-indigo-600 p-2 text-white">
            <Cpu size={24} />
          </span>
          <span className="text-2xl font-extrabold tracking-tight">
            volt<span className="text-indigo-600">.</span>
          </span>
        </a>

<label className="hidden max-w-xl flex-1 items-center gap-3 rounded-xl bg-slate-50 px-4 py-3 md:flex">
          <Search size={18} className="text-slate-400" />
          <input
            aria-label="Search products"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search your next upgrade..."
            className="w-full bg-transparent text-sm outline-none"
          />
        </label>

<div className="ml-auto flex items-center gap-5">
          <span className="hidden text-sm text-slate-500 xl:block">
            Good tech. Great possibilities.
          </span>
          <button
            type="button"
            onClick={() => setCartOpen(!cartOpen)}
            aria-label={`Shopping bag, ${cart.length} items`}
            aria-expanded={cartOpen}
            aria-controls="shopping-bag"
            className="relative rounded-xl border border-slate-200 p-3 hover:bg-slate-50"
          >
            <ShoppingBag size={20} />
            {cart.length > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-indigo-600 px-1 text-[10px] font-bold text-white">
                {cart.length}
              </span>
            )}
          </button>
        </div>
      </header>

{/* Mobile navigation backdrop */}
      {mobileMenu && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={() => setMobileMenu(false)}
          className="fixed inset-0 top-20 z-20 bg-slate-900/30 lg:hidden"
        />
      )}

{/* White sidebar */}
      <aside
        id="shop-sidebar"
        aria-label="Product categories"
        className={`fixed bottom-0 left-0 top-20 z-30 flex w-64 flex-col overflow-y-auto border-r border-slate-100 bg-white p-6 transition-transform ${
          mobileMenu ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <p className="mb-5 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
          Explore the store
        </p>

<nav className="space-y-2">
          {categories.map(({ name, icon: Icon }) => (
            <button
              type="button"
              key={name}
              aria-pressed={category === name}
              onClick={() => {
                setCategory(name);
                setMobileMenu(false);
              }}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-3.5 text-sm transition ${
                category === name
                  ? "bg-indigo-50 font-semibold text-indigo-600"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <Icon size={19} />
              {name}
              {category === name && (
                <ChevronRight size={16} className="ml-auto" />
              )}
            </button>
          ))}
        </nav>

<div className="mt-8 border-t border-slate-100 pt-6">
          <div className="flex items-center gap-3 px-3 text-sm text-slate-500">
            <Heart size={18} />
            Saved favorites
            <span className="ml-auto rounded-md bg-slate-100 px-2 py-1 text-xs">
              {favorites.length}
            </span>
          </div>
        </div>

<div className="mt-auto pt-12">
          <div className="rounded-2xl bg-[#f5f4ff] p-5">
            <Sparkles size={24} className="mb-3 text-indigo-600" />
            <h3 className="font-bold">Find your next favorite.</h3>
            <p className="mt-2 text-xs leading-5 text-slate-500">
              Thoughtful picks for your desk, your downtime, and everything
              in between.
            </p>
            <a
              href="#products"
              onClick={() => {
                setCategory("All products");
                setSearch("");
                setMobileMenu(false);
              }}
              className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-indigo-600"
            >
              Explore the collection <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </aside>

<main className="p-5 lg:ml-64 lg:p-9">
        <div className="mx-auto max-w-7xl">
          <label className="mb-5 flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 md:hidden">
            <Search size={18} className="text-slate-400" />
            <input
              aria-label="Search products on mobile"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search products..."
              className="min-w-0 flex-1 bg-transparent text-sm outline-none"
            />
          </label>

{/* Hero */}
          <section className="relative isolate overflow-hidden rounded-[28px] bg-[#eae9f4] p-7 sm:p-10 xl:p-14">
            <div className="grid items-center gap-8 md:grid-cols-2">
              <div className="relative z-10">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-indigo-600">
                  <Zap size={13} />
                  The everyday upgrade
                </span>

<h1 className="mt-6 text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl xl:text-6xl">
                  Better tech.
                  <br />
                  <span className="text-indigo-600">Better everyday.</span>
                </h1>

<p className="mt-5 max-w-sm text-sm leading-7 text-slate-600">
                  Discover beautifully designed essentials that make work,
                  play, and everything in between feel a little better.
                </p>

<a
                  href="#products"
                  onClick={() => {
                    setCategory("All products");
                    setSearch("");
                  }}
                  className="mt-7 inline-flex items-center gap-5 rounded-xl bg-slate-900 px-6 py-4 text-sm font-semibold text-white transition hover:bg-indigo-600"
                >
                  Shop the collection <ArrowRight size={17} />
                </a>

<div className="mt-7 flex items-center gap-2 text-xs text-slate-500">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white">
                    <Check size={12} className="text-indigo-600" />
                  </span>
                  Made for the way you live
                </div>
              </div>

<div className="relative mx-auto w-full max-w-md">
                <div className="absolute inset-4 rounded-full bg-white/40 blur-2xl" />
                <div className="relative aspect-square overflow-hidden rounded-full border-[12px] border-white/40 bg-[#f4d76a] shadow-2xl shadow-indigo-900/10">
                  <Image
                    src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=85"
                    alt="Over-ear headphones on a yellow background"
                    fill
                    priority
                    unoptimized
                    sizes="(max-width: 768px) 90vw, 440px"
                    className="object-cover"
                  />
                </div>

<div className="absolute bottom-5 left-0 rounded-2xl border border-white bg-white/95 p-4 shadow-lg">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-600">
                    Meet your new soundtrack
                  </p>
                  <p className="mt-1 text-sm font-bold">Everyday Headphones</p>
                  <p className="mt-1 text-xs text-slate-500">Explore the audio collection</p>
                </div>
              </div>
            </div>
          </section>

{/* Value propositions */}
          <section
            aria-label="Shopping benefits"
            className="my-7 grid gap-4 rounded-2xl border border-slate-100 bg-white p-5 sm:grid-cols-3"
          >
            {[
              {
                icon: Truck,
                title: "Delivered to your door",
                text: "Your next upgrade, on its way",
              },
              {
                icon: ShieldCheck,
                title: "Shop with confidence",
                text: "Thoughtfully selected essentials",
              },
              {
                icon: Package,
                title: "A better unboxing",
                text: "Good things come in small packages",
              },
            ].map(({ icon: Icon, title, text }) => (
              <div key={title} className="flex items-center gap-3">
                <div className="rounded-xl bg-slate-50 p-3 text-indigo-600">
                  <Icon size={22} />
                </div>
                <div>
                  <p className="text-xs font-bold">{title}</p>
                  <p className="mt-1 text-[11px] text-slate-500">{text}</p>
                </div>
              </div>
            ))}
          </section>

{/* Product catalog */}
          <section id="products" className="scroll-mt-28">
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-600">
                  Discover your next favorite
                </p>
                <h2 className="text-2xl font-bold tracking-tight">
                  {category === "All products" ? "The essentials, elevated." : category}
                </h2>
              </div>
              <span className="whitespace-nowrap text-xs text-slate-500">
                {filteredProducts.length} products
              </span>
            </div>

<div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filteredProducts.map((product) => {
                const saved = favorites.includes(product.id);

return (
                  <article
                    key={product.id}
                    className="group rounded-2xl border border-slate-100 bg-white p-3 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/50"
                  >
                    <div
                      className={`relative aspect-[4/3] overflow-hidden rounded-xl ${product.background}`}
                    >
                      <Image
                        src={`https://images.unsplash.com/${product.image}?auto=format&fit=crop&w=700&q=80`}
                        alt={product.name}
                        fill
                        unoptimized
                        sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />

{product.badge && (
                        <span className="absolute left-3 top-3 rounded-md bg-white/95 px-2 py-1.5 text-[9px] font-bold tracking-wider">
                          {product.badge}
                        </span>
                      )}

<button
                        type="button"
                        aria-label={`${saved ? "Unsave" : "Save"} ${product.name}`}
                        aria-pressed={saved}
                        onClick={() => toggleFavorite(product.id)}
                        className="absolute right-3 top-3 rounded-full bg-white p-2 shadow-sm"
                      >
                        <Heart
                          size={16}
                          className={
                            saved ? "fill-rose-500 text-rose-500" : "text-slate-500"
                          }
                        />
                      </button>
                    </div>

<div className="px-2 pb-2 pt-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase tracking-wider text-slate-400">
                          {product.category}
                        </span>
                        <span className="flex items-center gap-1 text-xs font-medium">
                          <Star size={12} className="fill-amber-400 text-amber-400" />
                          {product.rating}
                        </span>
                      </div>

<h3 className="mt-2 font-bold">{product.name}</h3>
                      <p className="mt-1 text-xs text-slate-500">
                        {product.description}
                      </p>

<div className="mt-5 flex items-center justify-between">
                        <span className="text-lg font-bold">
                          {money(product.price)}
                        </span>
                        <button
                          type="button"
                          onClick={() => setCart((current) => [...current, product.id])}
                          className="flex items-center gap-2 rounded-lg bg-indigo-50 px-3 py-2.5 text-xs font-semibold text-indigo-600 transition hover:bg-indigo-600 hover:text-white"
                        >
                          <ShoppingBag size={14} />
                          Add to bag
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

{filteredProducts.length === 0 && (
              <div className="rounded-2xl border border-dashed border-slate-300 py-16 text-center">
                <Search className="mx-auto mb-3 text-slate-400" />
                <p className="font-semibold">No matching products</p>
                <p className="mt-2 text-sm text-slate-500">
                  Try a different search or category.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setCategory("All products");
                  }}
                  className="mt-4 text-sm font-semibold text-indigo-600"
                >
                  Clear filters
                </button>
              </div>
            )}
          </section>

<footer className="mt-12 flex flex-wrap justify-between gap-3 border-t border-slate-200 py-6 text-xs text-slate-400">
            <span>volt. — A little ahead of everyday.</span>
            <span>Demo storefront · Sample products and ratings</span>
          </footer>
        </div>
      </main>

{/* Demo shopping bag */}
      {cartOpen && (
        <section
          id="shopping-bag"
          aria-label="Shopping bag"
          className="fixed right-4 top-24 z-50 max-h-[75vh] w-[calc(100%-2rem)] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl sm:w-96"
        >
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-bold">Your bag ({cart.length})</h2>
            <button
              type="button"
              aria-label="Close shopping bag"
              onClick={() => setCartOpen(false)}
              className="rounded-lg p-2 hover:bg-slate-100"
            >
              <X size={20} />
            </button>
          </div>

{cartProducts.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-500">
              Your next upgrade belongs here.
            </p>
          ) : (
            <>
              <div className="space-y-4">
                {cartProducts.map((product) => {
                  const quantity = cart.filter((id) => id === product.id).length;

return (
                    <div key={product.id} className="flex justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold">{product.name}</p>
                        <p className="mt-1 text-xs text-slate-500">
                          {quantity} × {money(product.price)}
                        </p>
                      </div>
                      <button
                        type="button"
                        aria-label={`Remove ${product.name} from bag`}
                        onClick={() =>
                          setCart((current) =>
                            current.filter((id) => id !== product.id),
                          )
                        }
                        className="text-xs text-rose-600 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  );
                })}
              </div>

<div className="mt-6 flex justify-between border-t border-slate-100 pt-4 font-bold">
                <span>Subtotal</span>
                <span>{money(subtotal)}</span>
              </div>

<p className="mt-4 rounded-lg bg-slate-50 p-3 text-xs leading-5 text-slate-500">
                Demo cart only. Checkout, shipping, and payments are not connected.
              </p>
            </>
          )}
        </section>
      )}

<div aria-live="polite" className="sr-only">
        {cart.length} items in your shopping bag.
      </div>
    </div>
  );
}
