import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { api } from '../services/api';
import { Product, Order, Customer, OrderStatus, ProductCategory, ProductSubCategory } from '../types';
import { CODE_GS_SOURCE } from '../data/codeGsContent';
import { CategoryManager } from './CategoryManager';
import { HomepageSliderManager } from './HomepageSliderManager';
import { normalizeImageList, normalizeImageUrl } from '../utils/imageUrl';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Settings,
  Code,
  LogOut,
  Plus,
  Edit,
  Trash2,
  Search,
  ExternalLink,
  Copy,
  Download,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Eye,
  Check,
  X,
  Phone,
  MessageSquare,
  HelpCircle,
  Layers,
  ArrowRight,
  Shield,
} from 'lucide-react';


const FAQManager: React.FC = () => {
  const { settings, updateSettings, language } = useStore();
  const faq = settings.content?.faq || [];
  const setFaq = (next: any[]) => updateSettings({...settings, content: {...settings.content!, faq: next}});
  return (
    <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-xs space-y-5">
      <div>
        <h3 className="font-display text-xl font-semibold">সাধারণ প্রশ্নোত্তর (FAQ)</h3>
        <p className="text-xs text-stone-500 mt-1">এখান থেকে FAQ যোগ, সম্পাদনা, সক্রিয়/নিষ্ক্রিয় ও মুছে ফেলতে পারবেন। পরিবর্তন Google Sheets-এ sync হবে।</p>
      </div>
      <div className="space-y-4">
        {faq.map((item, index) => (
          <div key={item.id} className="p-4 rounded-xl bg-[#FAF8F5] border border-stone-200 space-y-2">
            <div className="grid sm:grid-cols-2 gap-2">
              <input value={item.questionBn || ''} onChange={e=>setFaq(faq.map(x=>x.id===item.id?{...x,questionBn:e.target.value}:x))} placeholder="বাংলা প্রশ্ন" className="px-3 py-2 text-xs bg-white border rounded-lg" />
              <input value={item.questionEn || ''} onChange={e=>setFaq(faq.map(x=>x.id===item.id?{...x,questionEn:e.target.value}:x))} placeholder="English question" className="px-3 py-2 text-xs bg-white border rounded-lg" />
              <textarea value={item.answerBn || ''} onChange={e=>setFaq(faq.map(x=>x.id===item.id?{...x,answerBn:e.target.value}:x))} placeholder="বাংলা উত্তর" className="px-3 py-2 text-xs bg-white border rounded-lg min-h-20" />
              <textarea value={item.answerEn || ''} onChange={e=>setFaq(faq.map(x=>x.id===item.id?{...x,answerEn:e.target.value}:x))} placeholder="English answer" className="px-3 py-2 text-xs bg-white border rounded-lg min-h-20" />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-xs flex items-center gap-2"><input type="checkbox" checked={item.active !== false} onChange={e=>setFaq(faq.map(x=>x.id===item.id?{...x,active:e.target.checked}:x))}/> সক্রিয়</label>
              <button type="button" onClick={()=>setFaq(faq.filter(x=>x.id!==item.id))} className="text-xs text-rose-700 px-3 py-1.5 bg-rose-50 rounded-lg">মুছে ফেলুন</button>
            </div>
          </div>
        ))}
      </div>
      <button type="button" onClick={()=>setFaq([...faq,{id:'FAQ-'+Date.now(),questionBn:'',answerBn:'',questionEn:'',answerEn:'',active:true,sortOrder:faq.length+1}])} className="px-4 py-2.5 text-xs font-semibold bg-stone-900 text-white rounded-lg">+ নতুন FAQ</button>
    </div>
  );
};

export const AdminPanel: React.FC = () => {
  const {
    products,
    refreshProducts,
    categories,
    addCategory,
    settings,
    updateSettings,
    isAdminLoggedIn,
    loginAdmin,
    logoutAdmin,
    showToast,
    setCurrentPage,
  } = useStore();

  // Login form state
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState('');

  // Active tab
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'categories' | 'orders' | 'customers' | 'settings' | 'codegs'>('dashboard');

  // Orders & Customers data
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Search & Filters in Admin
  const [productSearch, setProductSearch] = useState('');
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('All');

  // Product Add/Edit Modal
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    category: 'Plates' as ProductCategory,
    subCategory: 'Dinner Plate' as ProductSubCategory,
    shortDescription: '',
    description: '',
    price: 1500,
    discountPrice: 0,
    stock: 25,
    sku: '',
    imagesText: '',
    material: 'Fine Bone China',
    size: '10.5 inches',
    color: 'Pure White & Gold',
    status: 'Active' as 'Active' | 'Out of Stock' | 'Draft',
  });

  // Order Details Modal
  const [selectedOrderForView, setSelectedOrderForView] = useState<Order | null>(null);

  // Google Apps Script test
  const [gasUrlInput, setGasUrlInput] = useState(settings.googleAppsScriptUrl || '');
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isTestingGas, setIsTestingGas] = useState(false);

  // Load orders & customers
  const loadAdminData = async () => {
    setIsRefreshing(true);
    try {
      const [ordList, custList] = await Promise.all([api.getOrders(), api.getCustomers()]);
      setOrders(ordList);
      setCustomers(custList);
    } catch (e) {
      console.error(e);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (isAdminLoggedIn) {
      loadAdminData();
    }
  }, [isAdminLoggedIn]);

  // Handle Login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    const ok = loginAdmin(loginUser, loginPass);
    if (!ok) {
      setLoginError('Invalid username or password. Default is admin / aura@admin2026');
    }
  };

  // Open modal to add product
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      category: 'Plates',
      subCategory: 'Dinner Plate',
      shortDescription: '',
      description: '',
      price: 1800,
      discountPrice: 1500,
      stock: 30,
      sku: `AUR-${Math.floor(1000 + Math.random() * 9000)}`,
      imagesText: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?auto=format&fit=crop&w=800&q=80',
      material: 'Bone China',
      size: '10.5 inches',
      color: 'White & Gold',
      status: 'Active',
    });
    setIsProductModalOpen(true);
  };

  // Open modal to edit product
  const handleOpenEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setProductForm({
      name: prod.name,
      category: prod.category,
      subCategory: prod.subCategory,
      shortDescription: prod.shortDescription,
      description: prod.description,
      price: prod.price,
      discountPrice: prod.discountPrice || 0,
      stock: prod.stock,
      sku: prod.sku,
      imagesText: prod.images.join(', '),
      material: prod.material,
      size: prod.size,
      color: prod.color,
      status: prod.status,
    });
    setIsProductModalOpen(true);
  };

  // Save product (Add or Edit)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const imagesArray = normalizeImageList(productForm.imagesText);

    if (imagesArray.length === 0) {
      imagesArray.push(products[0]?.images[0] || '');
    }

    if (editingProduct) {
      const updated: Product = {
        ...editingProduct,
        name: productForm.name,
        category: productForm.category,
        subCategory: productForm.subCategory,
        shortDescription: productForm.shortDescription,
        description: productForm.description,
        price: Number(productForm.price),
        discountPrice: productForm.discountPrice ? Number(productForm.discountPrice) : undefined,
        stock: Number(productForm.stock),
        sku: productForm.sku,
        images: imagesArray,
        material: productForm.material,
        size: productForm.size,
        color: productForm.color,
        status: productForm.status,
      };
      await api.updateProduct(updated);
      showToast('Product updated successfully');
    } else {
      await api.addProduct({
        name: productForm.name,
        category: productForm.category,
        subCategory: productForm.subCategory,
        shortDescription: productForm.shortDescription,
        description: productForm.description,
        price: Number(productForm.price),
        discountPrice: productForm.discountPrice ? Number(productForm.discountPrice) : undefined,
        stock: Number(productForm.stock),
        sku: productForm.sku,
        images: imagesArray,
        material: productForm.material,
        size: productForm.size,
        color: productForm.color,
        rating: 5.0,
        reviewCount: 0,
        status: productForm.status,
        specifications: {
          dishwasherSafe: true,
          microwaveSafe: false,
          foodGrade: true,
        },
      });
      showToast('New product added to catalog');
    }

    await refreshProducts();
    setIsProductModalOpen(false);
  };

  // Delete product
  const handleDeleteProduct = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      await api.deleteProduct(id);
      await refreshProducts();
      showToast('Product deleted from database');
    }
  };

  // Change order status
  const handleChangeOrderStatus = async (orderId: string, status: OrderStatus) => {
    await api.updateOrderStatus(orderId, status);
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, orderStatus: status } : o))
    );
    showToast(`Order #${orderId} marked as ${status}`);
  };

  // Test GAS connection
  const handleTestGas = async () => {
    setIsTestingGas(true);
    setTestResult(null);
    const res = await api.testGasConnection(gasUrlInput.trim());
    setTestResult(res);
    setIsTestingGas(false);
    if (res.success) {
      updateSettings({ ...settings, googleAppsScriptUrl: gasUrlInput.trim() });
    }
  };

  // Copy Code.gs
  const handleCopyCodeGs = () => {
    navigator.clipboard.writeText(CODE_GS_SOURCE);
    showToast('Code.gs copied to clipboard!');
  };

  // Download Code.gs file
  const handleDownloadCodeGs = () => {
    const element = document.createElement('a');
    const file = new Blob([CODE_GS_SOURCE], { type: 'text/javascript' });
    element.href = URL.createObjectURL(file);
    element.download = 'Code.gs';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    showToast('Code.gs file downloaded!');
  };

  // Metrics for dashboard
  const totalProducts = products.length;
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.orderStatus === 'Pending').length;
  const completedOrders = orders.filter((o) => o.orderStatus === 'Delivered').length;
  const totalSales = orders
    .filter((o) => o.orderStatus !== 'Cancelled')
    .reduce((sum, o) => sum + o.totalPrice, 0);
  const lowStockProducts = products.filter((p) => p.stock < 10);

  // If not logged in, render Admin Login screen
  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-stone-200 p-8 space-y-6">
          <div className="text-center space-y-1">
            <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#A37835]">
              Administrative Portal
            </span>
            <h1 className="font-display text-2xl font-semibold text-stone-900">
              উপহার বিতান — এডমিন কন্ট্রোল সেন্টার
            </h1>
            <p className="text-xs text-stone-500">
              সাইট পরিচালনা, পণ্য, অর্ডার ও Google Sheets নিয়ন্ত্রণ করতে প্রবেশ করুন
            </p>
          </div>

          {loginError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Admin Username
              </label>
              <input
                type="text"
                required
                placeholder="admin"
                value={loginUser}
                onChange={(e) => setLoginUser(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-lg focus:bg-white focus:outline-none focus:border-[#BE9346]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                placeholder="aura@admin2026"
                value={loginPass}
                onChange={(e) => setLoginPass(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-lg focus:bg-white focus:outline-none focus:border-[#BE9346]"
              />
            </div>

            <div className="p-3 bg-[#FAF8F5] rounded-lg border border-stone-200 text-[11px] text-stone-600">
              নিরাপত্তার জন্য ডিফল্ট পাসওয়ার্ড এখানে প্রদর্শন করা হয় না।
            </div>

            <button
              type="submit"
              className="w-full py-3 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              Access Admin Console
            </button>
          </form>

          <div className="text-center pt-2">
            <button
              onClick={() => setCurrentPage('home')}
              className="text-xs text-stone-500 hover:text-stone-800 cursor-pointer"
            >
              ← Return to Storefront
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Secret Access Banner Notice for #admin */}
      <div className="bg-[#1C1917] text-[#EDE0C2] p-4 rounded-xl border border-[#BE9346]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs mb-6 shadow-sm">
        <div className="flex items-center gap-2.5">
          <Shield className="w-4 h-4 text-[#DFB15B] shrink-0" />
          <div>
            <span className="font-serif font-bold text-amber-300">এডমিন ড্যাশবোর্ড সিক্রেট লিংক: </span>
            <span className="font-serif text-stone-300">
              এডমিন প্যানেলে যেকোনো সময় ব্রাউজারে <code className="bg-stone-800 text-[#DFB15B] px-1.5 py-0.5 rounded font-mono">#admin</code> ট্যাগ দিয়ে প্রবেশ করা যাবে।
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => {
              const url = window.location.origin + window.location.pathname + '#admin';
              navigator.clipboard.writeText(url);
              showToast('এডমিন লিংক কপি হয়েছে (#admin): ' + url);
            }}
            className="px-3 py-1.5 bg-[#BE9346] hover:bg-[#a67d36] text-stone-950 font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer text-xs"
          >
            <Copy className="w-3.5 h-3.5" />
            <span className="font-serif">এডমিন লিংক কপি করুন</span>
          </button>
          <button
            onClick={() => setCurrentPage('home')}
            className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer text-xs"
          >
            <Eye className="w-3.5 h-3.5 text-[#EDE0C2]" />
            <span className="font-serif">স্টোরফ্রন্ট</span>
          </button>
        </div>
      </div>

      {/* Top Admin Header Bar */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-display text-xl sm:text-2xl font-semibold text-stone-900">
              Aura Tableware & Crockery Admin
            </span>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-semibold">
              Live Synchronized
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Google Apps Script & Google Sheets Integrated Operations
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadAdminData}
            disabled={isRefreshing}
            className="px-3.5 py-2 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Google Sheets থেকে Sync</span>
          </button>

          <button
            onClick={() => refreshAllData()}
            disabled={isRefreshing}
            className="px-3.5 py-2 text-xs font-medium text-white bg-[#A37835] hover:bg-[#8A612D] rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>সব তথ্য Sync</span>
          </button>

          <button
            onClick={() => setCurrentPage('home')}
            className="px-3.5 py-2 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Storefront</span>
          </button>

          <button
            onClick={logoutAdmin}
            className="px-3.5 py-2 text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-stone-200 overflow-x-auto gap-2 mb-6">
        {[
          { id: 'dashboard', label: 'Dashboard Overview', icon: LayoutDashboard },
          { id: 'products', label: `Products (${products.length})`, icon: Package },
          { id: 'categories', label: `Categories & Subcategories (${categories.length})`, icon: Layers },
          { id: 'orders', label: `Orders (${orders.length})`, icon: ShoppingBag },
          { id: 'customers', label: `Customers (${customers.length})`, icon: Users },
          { id: 'settings', label: 'Store Settings', icon: Settings },
          { id: 'codegs', label: 'Google Apps Script (Code.gs)', icon: Code },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'border-[#BE9346] text-stone-900 bg-white/60'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#BE9346]' : 'text-stone-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: DASHBOARD OVERVIEW */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* KPI Stat Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
              <span className="text-[11px] font-medium text-stone-500 uppercase tracking-wider block">
                Total Products
              </span>
              <span className="font-display text-2xl font-bold text-stone-900 tabular-nums">
                {totalProducts}
              </span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
              <span className="text-[11px] font-medium text-stone-500 uppercase tracking-wider block">
                Total Orders
              </span>
              <span className="font-display text-2xl font-bold text-stone-900 tabular-nums">
                {totalOrders}
              </span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
              <span className="text-[11px] font-medium text-amber-700 uppercase tracking-wider block">
                Pending Orders
              </span>
              <span className="font-display text-2xl font-bold text-amber-800 tabular-nums">
                {pendingOrders}
              </span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
              <span className="text-[11px] font-medium text-emerald-700 uppercase tracking-wider block">
                Delivered
              </span>
              <span className="font-display text-2xl font-bold text-emerald-800 tabular-nums">
                {completedOrders}
              </span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
              <span className="text-[11px] font-medium text-stone-500 uppercase tracking-wider block">
                Total Sales
              </span>
              <span className="font-display text-xl font-bold text-stone-900 tabular-nums">
                ৳{totalSales.toLocaleString()}
              </span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
              <span className="text-[11px] font-medium text-rose-700 uppercase tracking-wider block">
                Low Stock Alert
              </span>
              <span className="font-display text-2xl font-bold text-rose-800 tabular-nums">
                {lowStockProducts.length}
              </span>
            </div>
          </div>

          {/* Quick Actions & Low Stock Warnings */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Low stock alerts */}
            <div className="lg:col-span-6 bg-white p-5 rounded-xl border border-stone-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-900 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Low Stock Warnings (&lt;10 Units)</span>
                </h3>
                <span className="text-xs text-stone-400 tabular-nums">{lowStockProducts.length} items</span>
              </div>

              <div className="divide-y divide-stone-100 max-h-60 overflow-y-auto">
                {lowStockProducts.length === 0 ? (
                  <p className="text-xs text-stone-500 py-3">All products are healthy in stock.</p>
                ) : (
                  lowStockProducts.map((p) => (
                    <div key={p.id} className="py-2.5 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-medium text-stone-900">{p.name}</div>
                        <div className="text-[11px] text-stone-500">
                          {p.category} · SKU: {p.sku}
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded font-mono font-bold bg-rose-50 text-rose-700">
                        {p.stock} left
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Quick Actions Banner */}
            <div className="lg:col-span-6 bg-[#FAF8F5] p-5 rounded-xl border border-stone-200 space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-900">
                Quick Actions & Integrations
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleOpenAddProduct}
                  className="p-3 bg-white hover:bg-stone-50 border border-stone-200 rounded-lg text-left text-xs space-y-1 cursor-pointer transition-colors"
                >
                  <Plus className="w-4 h-4 text-[#A37835]" />
                  <div className="font-semibold text-stone-900">Add New Product</div>
                  <div className="text-[11px] text-stone-500">Upload to Google Sheets</div>
                </button>

                <button
                  onClick={() => setActiveTab('orders')}
                  className="p-3 bg-white hover:bg-stone-50 border border-stone-200 rounded-lg text-left text-xs space-y-1 cursor-pointer transition-colors"
                >
                  <ShoppingBag className="w-4 h-4 text-[#A37835]" />
                  <div className="font-semibold text-stone-900">Manage Orders</div>
                  <div className="text-[11px] text-stone-500">Update shipping status</div>
                </button>

                <button
                  onClick={() => setActiveTab('codegs')}
                  className="p-3 bg-white hover:bg-stone-50 border border-stone-200 rounded-lg text-left text-xs space-y-1 cursor-pointer transition-colors"
                >
                  <Code className="w-4 h-4 text-[#A37835]" />
                  <div className="font-semibold text-stone-900">Export Code.gs</div>
                  <div className="text-[11px] text-stone-500">Google Apps Script deployment</div>
                </button>

                <button
                  onClick={() => setActiveTab('settings')}
                  className="p-3 bg-white hover:bg-stone-50 border border-stone-200 rounded-lg text-left text-xs space-y-1 cursor-pointer transition-colors"
                >
                  <Settings className="w-4 h-4 text-[#A37835]" />
                  <div className="font-semibold text-stone-900">Store Settings</div>
                  <div className="text-[11px] text-stone-500">Payment & fees config</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PRODUCT MANAGEMENT */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-sm">
              <input
                type="text"
                placeholder="Search products by title, category, SKU..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="w-full text-xs pl-8 pr-3 py-2 bg-white border border-stone-300 rounded-lg focus:outline-none focus:border-[#BE9346]"
              />
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-3" />
            </div>

            <button
              onClick={handleOpenAddProduct}
              className="px-4 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-700">
                <thead className="bg-[#FAF8F5] text-stone-900 uppercase text-[10px] tracking-wider border-b border-stone-200">
                  <tr>
                    <th className="py-3 px-4">Item</th>
                    <th className="py-3 px-3">Category</th>
                    <th className="py-3 px-3">Price</th>
                    <th className="py-3 px-3">Stock</th>
                    <th className="py-3 px-3">SKU</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {products
                    .filter((p) => {
                      if (!productSearch.trim()) return true;
                      const q = productSearch.toLowerCase();
                      return (
                        p.name.toLowerCase().includes(q) ||
                        p.category.toLowerCase().includes(q) ||
                        p.sku.toLowerCase().includes(q)
                      );
                    })
                    .map((p) => (
                      <tr key={p.id} className="hover:bg-stone-50 transition-colors">
                        <td className="py-3 px-4 flex items-center gap-3">
                          <img
                            src={p.images[0]}
                            alt={p.name}
                            referrerPolicy="no-referrer"
                            className="w-10 h-10 rounded-lg object-cover bg-stone-100 shrink-0"
                          />
                          <div>
                            <div className="font-semibold text-stone-900 max-w-xs truncate">{p.name}</div>
                            <div className="text-[11px] text-stone-400">{p.material.split(' ')[0]} · {p.size}</div>
                          </div>
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap">
                          <span className="font-medium text-stone-800">{p.category}</span>
                          <span className="text-stone-400 block text-[11px]">{p.subCategory}</span>
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap font-mono tabular-nums">
                          <span className="font-semibold text-stone-900">
                            ৳{(p.discountPrice ?? p.price).toLocaleString()}
                          </span>
                          {p.discountPrice && (
                            <span className="text-stone-400 block text-[10px] line-through">
                              ৳{p.price.toLocaleString()}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap font-mono tabular-nums">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                            p.stock <= 5 ? 'bg-rose-50 text-rose-700' : 'bg-stone-100 text-stone-800'
                          }`}>
                            {p.stock}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-mono text-[11px] text-stone-500 whitespace-nowrap">
                          {p.sku}
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap">
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                            p.status === 'Active'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-stone-100 text-stone-600'
                          }`}>
                            {p.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <button
                            onClick={() => handleOpenEditProduct(p)}
                            className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded mr-1 cursor-pointer"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB: CATEGORY & SUBCATEGORY MANAGEMENT */}
      {activeTab === 'categories' && (
        <CategoryManager />
      )}

      {/* TAB 3: ORDER MANAGEMENT */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-sm">
              <input
                type="text"
                placeholder="Search orders by ID, name, phone..."
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                className="w-full text-xs pl-8 pr-3 py-2 bg-white border border-stone-300 rounded-lg focus:outline-none focus:border-[#BE9346]"
              />
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-3" />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-stone-500">Status Filter:</span>
              <select
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
                className="text-xs px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg focus:outline-none"
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Processing">Processing</option>
                <option value="Shipping">Shipping</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-700">
                <thead className="bg-[#FAF8F5] text-stone-900 uppercase text-[10px] tracking-wider border-b border-stone-200">
                  <tr>
                    <th className="py-3 px-4">Order ID</th>
                    <th className="py-3 px-3">Customer</th>
                    <th className="py-3 px-3">Phone</th>
                    <th className="py-3 px-3">Total</th>
                    <th className="py-3 px-3">Payment</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {orders
                    .filter((o) => {
                      if (orderStatusFilter !== 'All' && o.orderStatus !== orderStatusFilter) return false;
                      if (!orderSearch.trim()) return true;
                      const q = orderSearch.toLowerCase();
                      return (
                        o.id.toLowerCase().includes(q) ||
                        o.customerName.toLowerCase().includes(q) ||
                        o.phone.includes(q)
                      );
                    })
                    .map((o) => (
                      <tr key={o.id} className="hover:bg-stone-50 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-stone-900 whitespace-nowrap">
                          {o.id}
                          <span className="block font-normal text-[10px] text-stone-400">
                            {new Date(o.orderDate).toLocaleDateString()}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-semibold text-stone-900">{o.customerName}</div>
                          <div className="text-[11px] text-stone-400 truncate max-w-xs">{o.district}, {o.division}</div>
                        </td>
                        <td className="py-3 px-3 font-mono text-[11px] whitespace-nowrap">
                          {o.phone}
                        </td>
                        <td className="py-3 px-3 font-semibold text-stone-900 whitespace-nowrap tabular-nums">
                          ৳{o.totalPrice.toLocaleString()}
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap">
                          <span className="text-[11px] font-medium text-stone-700">{o.paymentMethod}</span>
                          {o.paymentTransactionId && (
                            <span className="block text-[10px] text-stone-400 font-mono">
                              Trx: {o.paymentTransactionId}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap">
                          <select
                            value={o.orderStatus}
                            onChange={(e) => handleChangeOrderStatus(o.id, e.target.value as OrderStatus)}
                            className={`text-[11px] font-semibold px-2 py-1 rounded border focus:outline-none cursor-pointer ${
                              o.orderStatus === 'Delivered'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                : o.orderStatus === 'Pending'
                                ? 'bg-amber-50 text-amber-800 border-amber-300'
                                : o.orderStatus === 'Shipping'
                                ? 'bg-blue-50 text-blue-800 border-blue-300'
                                : 'bg-stone-100 text-stone-800 border-stone-300'
                            }`}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipping">Shipping</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <button
                            onClick={() => setSelectedOrderForView(o)}
                            className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded cursor-pointer"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: CUSTOMER MANAGEMENT */}
      {activeTab === 'customers' && (
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs">
          <div className="p-4 border-b border-stone-200 flex justify-between items-center bg-[#FAF8F5]">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-900">
              Registered Customers Directory ({customers.length})
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-700">
              <thead className="bg-[#FAF8F5] text-stone-900 uppercase text-[10px] tracking-wider border-b border-stone-200">
                <tr>
                  <th className="py-3 px-4">Customer Name</th>
                  <th className="py-3 px-3">Phone</th>
                  <th className="py-3 px-3">Email</th>
                  <th className="py-3 px-3">Location</th>
                  <th className="py-3 px-3">Total Orders</th>
                  <th className="py-3 px-3">Total Spent</th>
                  <th className="py-3 px-4 text-right">Quick Contact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {customers.map((c) => (
                  <tr key={c.id} className="hover:bg-stone-50 transition-colors">
                    <td className="py-3 px-4 font-semibold text-stone-900 whitespace-nowrap">
                      {c.name}
                    </td>
                    <td className="py-3 px-3 font-mono">{c.phone}</td>
                    <td className="py-3 px-3 text-stone-500">{c.email || '—'}</td>
                    <td className="py-3 px-3 text-stone-600 truncate max-w-xs">{c.address}</td>
                    <td className="py-3 px-3 font-mono font-medium tabular-nums">{c.totalOrders}</td>
                    <td className="py-3 px-3 font-mono font-semibold tabular-nums text-stone-900">
                      ৳{c.totalSpent.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <a
                        href={`https://wa.me/${c.phone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] text-emerald-700 hover:text-emerald-900 font-semibold px-2 py-1 bg-emerald-50 rounded"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>WhatsApp</span>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Website Settings + Homepage Slider */}
      {activeTab === 'settings' && (
        <div className="space-y-6 max-w-5xl">
          <HomepageSliderManager />
          <FAQManager />
          <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-xs space-y-6 max-w-4xl">
          <div className="border-b border-stone-200 pb-3">
            <h3 className="font-display text-xl font-semibold text-stone-900">
              Store Configuration & Payment Details
            </h3>
            <p className="text-xs text-stone-500">
              Control your brand contact info, delivery thresholds, and mobile banking accounts
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-medium text-stone-700 mb-1">Store Name</label>
              <input
                type="text"
                value={settings.storeName}
                onChange={(e) => updateSettings({ ...settings, storeName: e.target.value })}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-medium text-stone-700 mb-1">Tagline</label>
              <input
                type="text"
                value={settings.tagline}
                onChange={(e) => updateSettings({ ...settings, tagline: e.target.value })}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-medium text-stone-700 mb-1">Official Phone</label>
              <input
                type="text"
                value={settings.phone}
                onChange={(e) => updateSettings({ ...settings, phone: e.target.value })}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-medium text-stone-700 mb-1">WhatsApp Hotline</label>
              <input
                type="text"
                value={settings.whatsappNumber}
                onChange={(e) => updateSettings({ ...settings, whatsappNumber: e.target.value })}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-medium text-stone-700 mb-1">Delivery Charge Inside Dhaka (৳)</label>
              <input
                type="number"
                value={settings.deliveryChargeInside}
                onChange={(e) => updateSettings({ ...settings, deliveryChargeInside: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-medium text-stone-700 mb-1">Delivery Charge Outside Dhaka (৳)</label>
              <input
                type="number"
                value={settings.deliveryChargeOutside}
                onChange={(e) => updateSettings({ ...settings, deliveryChargeOutside: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-medium text-stone-700 mb-1">Free Delivery Threshold (৳)</label>
              <input
                type="number"
                value={settings.freeDeliveryThreshold}
                onChange={(e) => updateSettings({ ...settings, freeDeliveryThreshold: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-medium text-stone-700 mb-1">bKash Merchant / Personal No.</label>
              <input
                type="text"
                value={settings.bkashMerchantNumber}
                onChange={(e) => updateSettings({ ...settings, bkashMerchantNumber: e.target.value })}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-medium text-stone-700 mb-1">Nagad Merchant / Personal No.</label>
              <input
                type="text"
                value={settings.nagadMerchantNumber}
                onChange={(e) => updateSettings({ ...settings, nagadMerchantNumber: e.target.value })}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:bg-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-medium text-stone-700 mb-1">Homepage Top Banner Notice</label>
              <input
                type="text"
                value={settings.bannerNotice}
                onChange={(e) => updateSettings({ ...settings, bannerNotice: e.target.value })}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:bg-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-medium text-stone-700 mb-1">Bank Account Transfer Details</label>
              <textarea
                rows={3}
                value={settings.bankAccountDetails}
                onChange={(e) => updateSettings({ ...settings, bankAccountDetails: e.target.value })}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:bg-white font-mono text-xs"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-stone-200 flex justify-between items-center">
            <button
              onClick={() => {
                if (window.confirm('Reset catalog and settings to original initial seed?')) {
                  api.resetFactoryData();
                  refreshProducts();
                  loadAdminData();
                  showToast('Database reset to initial demo state');
                }
              }}
              className="text-xs text-stone-400 hover:text-stone-700"
            >
              Reset to Factory Seed Data
            </button>
            <button
              onClick={() => showToast('Settings saved successfully')}
              className="px-5 py-2.5 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors cursor-pointer"
            >
              Save Store Settings
            </button>
          </div>
          </div>
        </div>
      )}


      {/* TAB 6: GOOGLE APPS SCRIPT BACKEND (CODE.GS) */}
      {activeTab === 'codegs' && (
        <div className="space-y-6 max-w-4xl">
          {/* Connection URL Bar */}
          <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-xs space-y-4">
            <div>
              <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#A37835]">
                Google Sheets Live Sync Endpoint
              </span>
              <h3 className="font-display text-xl font-semibold text-stone-900 mt-1">
                Google Apps Script Web App URL
              </h3>
              <p className="text-xs text-stone-600 mt-1">
                Deploy the script below as a Web App (Access: Anyone), then paste the URL here to enable two-way live Google Sheets sync.
              </p>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="https://script.google.com/macros/s/AKfycbx.../exec"
                value={gasUrlInput}
                onChange={(e) => setGasUrlInput(e.target.value)}
                className="flex-1 text-xs px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-lg font-mono focus:bg-white focus:outline-none focus:border-[#BE9346]"
              />
              <button
                onClick={handleTestGas}
                disabled={isTestingGas}
                className="px-4 py-2.5 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                {isTestingGas ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5 text-[#EDE0C2]" />}
                <span>Test & Save</span>
              </button>
            </div>

            {testResult && (
              <div
                className={`p-3 rounded-lg text-xs border flex items-center gap-2 ${
                  testResult.success
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : 'bg-amber-50 text-amber-800 border-amber-200'
                }`}
              >
                {testResult.success ? <Check className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />}
                <span>{testResult.message}</span>
              </div>
            )}
          </div>

          {/* Deployment Step-by-Step Guide */}
          <div className="bg-[#FAF8F5] p-6 rounded-xl border border-stone-200 space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-900">
              How to Deploy in 4 Simple Steps:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 bg-white rounded-lg border border-stone-200 space-y-1">
                <span className="font-bold text-stone-900 block">Step 1: Create Google Sheet</span>
                <p className="text-stone-600">
                  Go to <a href="https://sheets.new" target="_blank" rel="noreferrer" className="text-[#A37835] underline">sheets.new</a> and name it <strong>Aura Tableware Database</strong>.
                </p>
              </div>

              <div className="p-3.5 bg-white rounded-lg border border-stone-200 space-y-1">
                <span className="font-bold text-stone-900 block">Step 2: Open Apps Script</span>
                <p className="text-stone-600">
                  Click on <strong>Extensions → Apps Script</strong> in the top menu bar.
                </p>
              </div>

              <div className="p-3.5 bg-white rounded-lg border border-stone-200 space-y-1">
                <span className="font-bold text-stone-900 block">Step 3: Paste Code & Run setupDatabase()</span>
                <p className="text-stone-600">
                  Replace everything in <code>Code.gs</code> with the code below, select <code>setupDatabase</code> in the function dropdown, and click <strong>Run</strong>. All 5 sheets and headers are created automatically!
                </p>
              </div>

              <div className="p-3.5 bg-white rounded-lg border border-stone-200 space-y-1">
                <span className="font-bold text-stone-900 block">Step 4: Deploy as Web App</span>
                <p className="text-stone-600">
                  Click <strong>Deploy → New deployment → Web app</strong>. Set <em>Execute as: Me</em> and <em>Who has access: Anyone</em>. Copy the Web App URL and paste it into the field above!
                </p>
              </div>
            </div>
          </div>

          {/* Code.gs Viewer & Downloader */}
          <div className="bg-[#1C1917] rounded-xl overflow-hidden shadow-xl border border-stone-800">
            <div className="p-4 bg-stone-900 border-b border-stone-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4 text-[#DFB15B]" />
                <span className="font-mono text-xs font-semibold text-stone-200">
                  Code.gs (Complete Google Apps Script Backend)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyCodeGs}
                  className="px-3 py-1.5 text-xs font-medium text-stone-300 bg-stone-800 hover:bg-stone-700 rounded transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Code</span>
                </button>
                <button
                  onClick={handleDownloadCodeGs}
                  className="px-3 py-1.5 text-xs font-medium text-stone-900 bg-[#DFB15B] hover:bg-[#cfad6d] rounded transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Code.gs</span>
                </button>
              </div>
            </div>

            <pre className="p-4 text-xs font-mono text-stone-300 max-h-[450px] overflow-y-auto overflow-x-auto leading-relaxed selection:bg-amber-900">
              {CODE_GS_SOURCE}
            </pre>
          </div>
        </div>
      )}

      {/* PRODUCT ADD/EDIT MODAL */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fade-in">
          <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-stone-200 my-auto">
            <div className="px-6 py-4 bg-[#FAF8F5] border-b border-stone-200 flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold text-stone-900">
                {editingProduct ? 'Edit Crockery Product' : 'Add New Crockery Product'}
              </h2>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block font-medium text-stone-700 mb-1">Product Title</label>
                  <input
                    type="text"
                    required
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:bg-white"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-medium text-stone-700">Category (ক্যাটাগরি)</label>
                    <button
                      type="button"
                      onClick={() => {
                        setIsProductModalOpen(false);
                        setActiveTab('categories');
                      }}
                      className="text-[10px] text-[#A37835] hover:underline flex items-center gap-0.5 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Manage Categories</span>
                    </button>
                  </div>
                  <select
                    value={productForm.category}
                    onChange={(e) => {
                      const newCat = e.target.value;
                      const catConfig = categories.find((c) => c.name.toLowerCase() === newCat.toLowerCase());
                      const defaultSub = catConfig && catConfig.subcategories.length > 0 ? catConfig.subcategories[0] : 'Standard Item';
                      setProductForm({
                        ...productForm,
                        category: newCat,
                        subCategory: defaultSub,
                      });
                    }}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id || c.name} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-stone-700 mb-1">Subcategory (সাব-ক্যাটাগরি)</label>
                  <select
                    value={productForm.subCategory}
                    onChange={(e) => setProductForm({ ...productForm, subCategory: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:bg-white"
                  >
                    {(() => {
                      const catConfig = categories.find((c) => c.name.toLowerCase() === productForm.category.toLowerCase());
                      const subs = catConfig && catConfig.subcategories.length > 0 ? catConfig.subcategories : [productForm.subCategory || 'Standard Item'];
                      const fullSubs = Array.from(new Set([productForm.subCategory, ...subs])).filter(Boolean);
                      return fullSubs.map((sub) => (
                        <option key={sub} value={sub}>{sub}</option>
                      ));
                    })()}
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-stone-700 mb-1">Regular Price (৳)</label>
                  <input
                    type="number"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-medium text-stone-700 mb-1">Discount Price (৳, optional)</label>
                  <input
                    type="number"
                    value={productForm.discountPrice || ''}
                    onChange={(e) => setProductForm({ ...productForm, discountPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-medium text-stone-700 mb-1">Stock Units</label>
                  <input
                    type="number"
                    required
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-medium text-stone-700 mb-1">SKU Code</label>
                  <input
                    type="text"
                    required
                    value={productForm.sku}
                    onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-medium text-stone-700 mb-1">Material</label>
                  <input
                    type="text"
                    value={productForm.material}
                    onChange={(e) => setProductForm({ ...productForm, material: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-medium text-stone-700 mb-1">Dimensions / Size</label>
                  <input
                    type="text"
                    value={productForm.size}
                    onChange={(e) => setProductForm({ ...productForm, size: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:bg-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-medium text-stone-700 mb-1">
                    Image URLs (Comma separated Google Drive or web URLs)
                  </label>
                  <textarea
                    rows={2}
                    value={productForm.imagesText}
                    onChange={(e) => setProductForm({ ...productForm, imagesText: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:bg-white font-mono text-[11px]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-medium text-stone-700 mb-1">Short Description</label>
                  <input
                    type="text"
                    value={productForm.shortDescription}
                    onChange={(e) => setProductForm({ ...productForm, shortDescription: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:bg-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-medium text-stone-700 mb-1">Full Craftsmanship Story & Description</label>
                  <textarea
                    rows={3}
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg focus:bg-white"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-stone-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 text-stone-600 hover:text-stone-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg cursor-pointer"
                >
                  {editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ORDER DETAILS MODAL */}
      {selectedOrderForView && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fade-in">
          <div className="relative bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden border border-stone-200 my-auto">
            <div className="px-6 py-4 bg-[#FAF8F5] border-b border-stone-200 flex items-center justify-between">
              <div>
                <h3 className="font-display text-lg font-semibold text-stone-900">
                  Order Details · {selectedOrderForView.id}
                </h3>
                <span className="text-[11px] text-stone-500">
                  Placed on {new Date(selectedOrderForView.orderDate).toLocaleString()}
                </span>
              </div>
              <button
                onClick={() => setSelectedOrderForView(null)}
                className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs max-h-[70vh] overflow-y-auto">
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
                <div className="font-semibold text-stone-900 text-sm">{selectedOrderForView.customerName}</div>
                <div className="text-stone-600">Phone: {selectedOrderForView.phone}</div>
                <div className="text-stone-600">Address: {selectedOrderForView.fullAddress}, {selectedOrderForView.district}, {selectedOrderForView.division}</div>
                {selectedOrderForView.deliveryAddressNote && (
                  <div className="text-amber-800 bg-amber-50 p-2 rounded mt-1">
                    Note: {selectedOrderForView.deliveryAddressNote}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="font-semibold uppercase tracking-wider text-[11px] text-stone-700">
                  Items List ({selectedOrderForView.items.length})
                </div>
                <div className="border border-stone-200 rounded-lg divide-y divide-stone-100">
                  {selectedOrderForView.items.map((it, idx) => (
                    <div key={idx} className="p-2.5 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img
                          src={it.image}
                          alt={it.productName}
                          referrerPolicy="no-referrer"
                          className="w-8 h-8 rounded object-cover bg-stone-100 shrink-0"
                        />
                        <div>
                          <div className="font-medium text-stone-900">{it.productName}</div>
                          <div className="text-stone-400 text-[10px]">
                            Qty: {it.quantity} × ৳{it.price.toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <span className="font-semibold tabular-nums text-stone-900">
                        ৳{(it.price * it.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-[#FAF8F5] rounded-xl border border-stone-200 space-y-1">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="tabular-nums">৳{selectedOrderForView.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-emerald-700">
                  <span>Discount:</span>
                  <span className="tabular-nums">-৳{selectedOrderForView.discountAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charge:</span>
                  <span className="tabular-nums">৳{selectedOrderForView.deliveryCharge}</span>
                </div>
                <div className="flex justify-between font-bold text-stone-900 pt-1 border-t border-stone-200 text-sm">
                  <span>Total Amount Due:</span>
                  <span className="tabular-nums">৳{selectedOrderForView.totalPrice.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-stone-600">Update Order Status:</span>
                <select
                  value={selectedOrderForView.orderStatus}
                  onChange={(e) => {
                    const st = e.target.value as OrderStatus;
                    handleChangeOrderStatus(selectedOrderForView.id, st);
                    setSelectedOrderForView({ ...selectedOrderForView, orderStatus: st });
                  }}
                  className="px-3 py-1.5 rounded-lg border border-stone-300 font-semibold focus:outline-none"
                >
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipping">Shipping</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
  );
};
