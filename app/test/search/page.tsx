
'use client';

import React, { useState } from 'react';
import { Search, ExternalLink, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface SearchResult {
  title: string;
  link: string;
  image: string;
  lprice: string;
  hprice: string;
  mallName: string;
  productId: string;
  productType: string;
  brand: string;
  maker: string;
  category1: string;
  category2: string;
  category3: string;
  category4: string;
}

export default function ShoppingSearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setError('');
    setHasSearched(true);
    setResults([]);

    try {
      const res = await fetch(`/api/search?query=${encodeURIComponent(query)}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch results');
      }

      if (data.items) {
        setResults(data.items);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to strip HTML tags from Naver API response
  const formatTitle = (title: string) => {
    return title.replace(/<[^>]+>/g, '');
  };

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(Number(price));
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-slate-50 dark:bg-slate-950 font-sans">
      
      {/* 1. Fixed Header & Search Area */}
      <div className="flex-none p-4 pb-2 z-10 bg-slate-50/95 dark:bg-slate-950/95 backdrop-blur-md">
        <div className="max-w-2xl mx-auto space-y-4">
          <motion.form 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onSubmit={handleSearch} 
            className="relative flex items-center shadow-lg rounded-full overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus-within:ring-2 focus-within:ring-indigo-500/50 transition-all"
          >
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for products..."
              className="w-full py-3.5 pl-6 pr-12 text-base bg-transparent border-none outline-none placeholder:text-slate-400 dark:text-white"
            />
            <button 
              type="submit" 
              disabled={isLoading}
              className="absolute right-2 p-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full transition-colors disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
            </button>
          </motion.form>
        </div>
      </div>

      {/* 2. Scrollable Results Area */}
      <div className="flex-1 overflow-y-auto p-3 scrollbar-hide">
        <div className="max-w-2xl mx-auto space-y-4 pb-20">
          <AnimatePresence mode="wait">
            {error ? (
              <motion.div 
                key="error"
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-4 text-center text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg"
              >
                {error}
              </motion.div>
            ) : !isLoading && hasSearched && results.length === 0 ? (
               <motion.div 
                 key="empty"
                 initial={{ opacity: 0 }} 
                 animate={{ opacity: 1 }}
                 exit={{ opacity: 0 }}
                 className="p-8 text-center text-slate-500"
               >
                 No results found.
               </motion.div>
            ) : null}
          </AnimatePresence>

          <div className="space-y-4">
            {results.map((item, index) => (
              <motion.div
                key={item.productType + item.productId + index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group relative flex flex-col sm:flex-row items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md hover:border-indigo-100 dark:hover:border-indigo-900 transition-all cursor-default"
              >
                {/* Image */}
                <div className="relative w-full sm:w-28 h-28 shrink-0 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden">
                  <Image
                    src={item.image}
                    alt={formatTitle(item.title)}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 w-full text-center sm:text-left space-y-1.5">
                  <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                    {item.mallName}
                  </div>
                  <h3 className="font-semibold text-base leading-tight text-slate-900 dark:text-slate-100 line-clamp-2"
                      dangerouslySetInnerHTML={{ __html: item.title }} 
                  >
                  </h3>
                  <div className="text-indigo-600 dark:text-indigo-400 font-bold text-lg">
                    {formatPrice(item.lprice)}
                  </div>
                </div>

                {/* Action */}
                <a 
                  href={item.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto mt-2 sm:mt-0 px-5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white text-sm font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  View <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
