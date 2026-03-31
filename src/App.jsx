import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, ShoppingBag, Users, Settings, Search, 
  Plus, Filter, X, CheckCircle2, AlertCircle 
} from 'lucide-react';

const App = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          fetch('https://api.escuelajs.co/api/v1/products?offset=0&limit=20'),
          fetch('https://api.escuelajs.co/api/v1/categories?limit=5')
        ]);
        const prodData = await prodRes.json();
        const catData = await catRes.json();
        
        setProducts(prodData);
        setCategories(catData);
      } catch (err) {
        console.error("Xatolik:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filterlash logikasi
  const filteredProducts = products.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = selectedCategory === "All" || p.category.name === selectedCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* --- Sidebar --- */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col sticky top-0 h-screen">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-2 text-indigo-600 font-black text-xl">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white text-sm">P</div>
            PLATZI ADMIN
          </div>
        </div>
        <nav className="p-4 space-y-1 flex-1">
          <SidebarItem icon={<LayoutDashboard size={18}/>} label="Dashboard" active />
          <SidebarItem icon={<ShoppingBag size={18}/>} label="Mahsulotlar" />
          <SidebarItem icon={<Users size={18}/>} label="Mijozlar" />
          <SidebarItem icon={<Settings size={18}/>} label="Sozlamalar" />
        </nav>
      </aside>

      {/* --- Main --- */}
      <main className="flex-1 p-4 md:p-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 leading-tight">Mahsulotlar Boshqaruvi</h1>
            <p className="text-gray-500 text-sm">Ombordagi barcha tovarlarni boshqarish va tahlil qilish</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl shadow-lg shadow-indigo-200 transition-all active:scale-95"
          >
            <Plus size={20} />
            <span className="font-semibold">Yangi qo'shish</span>
          </button>
        </div>

        {/* Filters & Search */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Mahsulot nomi bo'yicha qidirish..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
            <Filter size={18} className="text-gray-400 shrink-0" />
            <button 
              onClick={() => setSelectedCategory("All")}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${selectedCategory === "All" ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              Hammasi
            </button>
            {categories.map(cat => (
              <button 
                key={cat.id}
                onClick={() => setSelectedCategory(cat.name)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${selectedCategory === cat.name ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            Array(8).fill(0).map((_, i) => <SkeletonCard key={i} />)
          ) : filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className="col-span-full py-20 text-center text-gray-400">
              <AlertCircle size={48} className="mx-auto mb-4 opacity-20" />
              <p>Hech narsa topilmadi...</p>
            </div>
          )}
        </div>

        {/* --- Modal Window --- */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl animate-in zoom-in duration-200">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Yangi Mahsulot</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                  <X size={24} />
                </button>
              </div>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-1 text-gray-700">Nomi</label>
                  <input type="text" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Masalan: iPhone 15 Pro" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1 text-gray-700">Narxi ($)</label>
                    <input type="number" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="999" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1 text-gray-700">Kategoriya</label>
                    <select className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none">
                      {categories.map(c => <option key={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                </div>
                <button type="button" className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors mt-4">
                  Saqlash
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

// --- Yordamchi Komponentlar ---

const SidebarItem = ({ icon, label, active = false }) => (
  <div className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all ${active ? 'bg-indigo-50 text-indigo-700' : 'text-gray-500 hover:bg-gray-50'}`}>
    {icon}
    <span className="font-semibold text-sm">{label}</span>
  </div>
);

const ProductCard = ({ product }) => (
  <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden group hover:shadow-xl hover:shadow-indigo-100/50 transition-all duration-300">
    <div className="relative aspect-square overflow-hidden">
      <img 
        src={product.images[0]} 
        alt={product.title} 
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
      />
      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-[10px] font-black text-indigo-600 shadow-sm uppercase">
        {product.category.name}
      </div>
    </div>
    <div className="p-4">
      <h3 className="font-bold text-gray-800 line-clamp-1 mb-1">{product.title}</h3>
      <div className="flex justify-between items-center">
        <span className="text-lg font-black text-indigo-600">${product.price}</span>
        <button className="p-2 text-gray-400 hover:text-green-500 transition-colors">
          <CheckCircle2 size={20} />
        </button>
      </div>
    </div>
  </div>
);

const SkeletonCard = () => (
  <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-4 animate-pulse">
    <div className="aspect-square bg-gray-100 rounded-xl"></div>
    <div className="h-4 bg-gray-100 rounded w-3/4"></div>
    <div className="h-6 bg-gray-100 rounded w-1/4"></div>
  </div>
);

export default App;