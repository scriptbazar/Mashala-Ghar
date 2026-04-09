import { useAuth } from "../lib/AuthContext";
import { motion, AnimatePresence } from "motion/react";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Users, 
  Settings, 
  Plus, 
  TrendingUp, 
  DollarSign, 
  Package, 
  Home,
  BarChart3,
  MessageSquare,
  ChevronRight,
  Search,
  Filter,
  MoreVertical,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Trash2,
  Edit3,
  X
} from "lucide-react";
import React, { useEffect, useState, useMemo } from "react";
import { collection, onSnapshot, query, orderBy, limit, getDocs, doc, updateDoc, deleteDoc, addDoc, Timestamp, setDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { Link } from "react-router-dom";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area 
} from 'recharts';
import { format, subDays } from 'date-fns';

type AdminSection = 'overview' | 'users' | 'orders' | 'analytics' | 'products' | 'sales' | 'tickets' | 'inventory';

export default function AdminDashboard() {
  const { isAdmin } = useAuth();
  const [activeSection, setActiveSection] = useState<AdminSection>('overview');
  const [stats, setStats] = useState({ orders: 0, customers: 0, revenue: 0 });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [allOrders, setAllOrders] = useState<any[]>([]);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [allTickets, setAllTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Product Form State
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [productForm, setProductForm] = useState({
    name: "",
    hindiName: "",
    price: 0,
    weight: "200g",
    category: "Blends",
    stock: 50,
    image: "",
    ingredients: "",
    benefits: "",
    tag: ""
  });

  // Search and Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (!isAdmin) return;

    const unsubOrders = onSnapshot(collection(db, "orders"), (snap) => {
      const orders = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const totalRevenue = orders.reduce((acc, curr: any) => acc + (curr.total || 0), 0);
      setStats(prev => ({ ...prev, orders: snap.size, revenue: totalRevenue }));
      setAllOrders(orders);
    });

    const unsubUsers = onSnapshot(collection(db, "users"), (snap) => {
      setStats(prev => ({ ...prev, customers: snap.size }));
      setAllUsers(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const unsubProducts = onSnapshot(collection(db, "products"), (snap) => {
      setAllProducts(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const unsubTickets = onSnapshot(collection(db, "tickets"), (snap) => {
      setAllTickets(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"), limit(5));
    const unsubRecent = onSnapshot(q, (snap) => {
      setRecentOrders(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });

    return () => {
      unsubOrders();
      unsubUsers();
      unsubProducts();
      unsubTickets();
      unsubRecent();
    };
  }, [isAdmin]);

  // Analytics Data Preparation
  const chartData = useMemo(() => {
    const last7Days = [...Array(7)].map((_, i) => {
      const d = subDays(new Date(), i);
      return format(d, 'MMM dd');
    }).reverse();

    return last7Days.map(day => {
      const dayOrders = allOrders.filter(o => {
        const date = o.createdAt instanceof Timestamp ? o.createdAt.toDate() : new Date(o.createdAt);
        return format(date, 'MMM dd') === day;
      });
      return {
        name: day,
        revenue: dayOrders.reduce((acc, curr) => acc + (curr.total || 0), 0),
        orders: dayOrders.length
      };
    });
  }, [allOrders]);

  const categoryData = useMemo(() => {
    const counts: Record<string, number> = {};
    allProducts.forEach(p => {
      counts[p.category || 'Uncategorized'] = (counts[p.category || 'Uncategorized'] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [allProducts]);

  const COLORS = ['#F27D26', '#800020', '#FFC107', '#1A0F0A', '#4CAF50'];

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const productData = {
        ...productForm,
        price: Number(productForm.price),
        stock: Number(productForm.stock),
        ingredients: productForm.ingredients.split(",").map(i => i.trim()),
        benefits: productForm.benefits.split(",").map(i => i.trim()),
        updatedAt: Timestamp.now()
      };

      if (editingProduct) {
        await updateDoc(doc(db, "products", editingProduct.id), productData);
      } else {
        await addDoc(collection(db, "products"), {
          ...productData,
          createdAt: Timestamp.now(),
          rating: 5.0,
          reviews: []
        });
      }
      setShowProductModal(false);
      setEditingProduct(null);
      setProductForm({
        name: "",
        hindiName: "",
        price: 0,
        weight: "200g",
        category: "Blends",
        stock: 50,
        image: "",
        ingredients: "",
        benefits: "",
        tag: ""
      });
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteDoc(doc(db, "products", id));
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, "orders", orderId), { status: newStatus });
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const handleUpdateUserRole = async (userId: string, newRole: string) => {
    try {
      await updateDoc(doc(db, "users", userId), { role: newRole });
    } catch (error) {
      console.error("Error updating user role:", error);
    }
  };

  if (!isAdmin) return (
    <div className="h-screen flex items-center justify-center bg-cream">
      <div className="text-center">
        <h1 className="text-4xl font-serif font-bold text-espresso mb-4">Access Denied</h1>
        <p className="text-espresso/40">You do not have administrative privileges.</p>
      </div>
    </div>
  );

  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'orders', label: 'All Orders', icon: ShoppingBag },
    { id: 'users', label: 'All Users', icon: Users },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'inventory', label: 'Inventory', icon: Settings },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'sales', label: 'Sales Report', icon: BarChart3 },
    { id: 'tickets', label: 'Support Tickets', icon: MessageSquare },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: "Total Revenue", value: `₹${stats.revenue}`, icon: DollarSign, color: "text-green-600", bg: "bg-green-500/10", trend: "+12.5%" },
                { label: "Total Orders", value: stats.orders, icon: ShoppingBag, color: "text-saffron", bg: "bg-saffron/10", trend: "+8.2%" },
                { label: "Total Customers", value: stats.customers, icon: Users, color: "text-burgundy", bg: "bg-burgundy/10", trend: "+5.1%" },
              ].map((stat, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white p-6 rounded-3xl shadow-sm border border-espresso/5"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
                      <stat.icon size={24} />
                    </div>
                    <div className="flex items-center gap-1 text-green-500 text-xs font-bold">
                      <ArrowUpRight size={14} />
                      {stat.trend}
                    </div>
                  </div>
                  <p className="text-espresso/40 text-xs font-bold uppercase tracking-widest mb-1">{stat.label}</p>
                  <h3 className="text-3xl font-serif font-bold text-espresso">{stat.value}</h3>
                </motion.div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-sm border border-espresso/5">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-serif font-bold text-espresso">Revenue Trend (Last 7 Days)</h3>
                  <button onClick={() => setActiveSection('analytics')} className="text-saffron text-xs font-bold uppercase tracking-widest hover:underline">Full Report</button>
                </div>
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#F27D26" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#F27D26" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#999'}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#999'}} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                        itemStyle={{ fontWeight: 'bold', color: '#F27D26' }}
                      />
                      <Area type="monotone" dataKey="revenue" stroke="#F27D26" fillOpacity={1} fill="url(#colorRev)" strokeWidth={3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-espresso rounded-3xl p-8 shadow-sm text-white flex flex-col">
                <h3 className="text-xl font-serif font-bold mb-6 text-turmeric">Quick Insights</h3>
                <div className="space-y-6 flex-1">
                  <div>
                    <div className="flex justify-between text-xs font-bold uppercase tracking-widest mb-2 text-white/60">
                      <span>Inventory Health</span>
                      <span>85%</span>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-turmeric w-[85%]" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-bold uppercase tracking-widest mb-2 text-white/60">
                      <span>Customer Satisfaction</span>
                      <span>98%</span>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-green-400 w-[98%]" />
                    </div>
                  </div>
                  <div className="pt-4 border-t border-white/10">
                    <p className="text-xs text-white/40 italic">"Top selling spice this week is Guntur Chilli Powder with 45 orders."</p>
                  </div>
                </div>
                <button className="mt-8 w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors">
                  Generate Weekly Report
                </button>
              </div>
            </div>
          </div>
        );

      case 'analytics':
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-3xl border border-espresso/5 shadow-sm">
                <h3 className="text-xl font-serif font-bold text-espresso mb-8">Order Volume</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#999'}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#999'}} />
                      <Tooltip 
                        cursor={{fill: '#f8f8f8'}}
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                      />
                      <Bar dataKey="orders" fill="#800020" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-8 rounded-3xl border border-espresso/5 shadow-sm">
                <h3 className="text-xl font-serif font-bold text-espresso mb-8">Product Categories</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-wrap justify-center gap-4 mt-4">
                  {categoryData.map((entry, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                      <span className="text-[10px] font-bold text-espresso/60 uppercase tracking-widest">{entry.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'sales':
        return (
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-espresso/5">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-serif font-bold text-espresso">Sales Performance</h3>
              <button className="flex items-center gap-2 px-4 py-2 bg-espresso text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-saffron transition-colors">
                <Download size={16} /> Export CSV
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-espresso/5">
                    <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-espresso/40">Date</th>
                    <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-espresso/40">Orders</th>
                    <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-espresso/40">Gross Sales</th>
                    <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-espresso/40">Avg. Order Value</th>
                    <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-espresso/40">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-espresso/5">
                  {chartData.map((day, i) => (
                    <tr key={i} className="hover:bg-cream/30 transition-colors">
                      <td className="py-4 text-sm font-bold text-espresso">{day.name}</td>
                      <td className="py-4 text-sm text-espresso/60">{day.orders}</td>
                      <td className="py-4 text-sm font-bold text-espresso">₹{day.revenue}</td>
                      <td className="py-4 text-sm text-espresso/60">₹{day.orders > 0 ? Math.round(day.revenue / day.orders) : 0}</td>
                      <td className="py-4">
                        <div className="flex items-center gap-1 text-green-500 text-[10px] font-bold uppercase">
                          <CheckCircle2 size={12} /> Target Met
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'tickets':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-serif font-bold text-espresso">Support Tickets</h3>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-saffron/10 text-saffron rounded-full text-[10px] font-black uppercase tracking-widest">
                  {allTickets.filter(t => t.status === 'open').length} Open
                </span>
                <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                  {allTickets.filter(t => t.status === 'resolved').length} Resolved
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {allTickets.length === 0 ? (
                <div className="py-20 text-center bg-white rounded-3xl border border-dashed border-espresso/10">
                  <MessageSquare className="mx-auto text-espresso/10 mb-4" size={48} />
                  <p className="text-espresso/40 italic">No support tickets at the moment.</p>
                </div>
              ) : (
                allTickets.map((ticket) => (
                  <motion.div 
                    key={ticket.id}
                    layout
                    className="bg-white p-6 rounded-3xl border border-espresso/5 shadow-sm hover:border-saffron/20 transition-all flex items-start justify-between"
                  >
                    <div className="flex gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                        ticket.status === 'open' ? 'bg-saffron/10 text-saffron' : 'bg-green-100 text-green-600'
                      }`}>
                        {ticket.status === 'open' ? <Clock size={24} /> : <CheckCircle2 size={24} />}
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h4 className="font-bold text-espresso">{ticket.subject || 'No Subject'}</h4>
                          <span className="text-[10px] text-espresso/40 uppercase tracking-widest">#{ticket.id.slice(-6)}</span>
                        </div>
                        <p className="text-sm text-espresso/60 mb-3">{ticket.message}</p>
                        <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-espresso/30">
                          <span>From: {ticket.customerName || ticket.email}</span>
                          <span>•</span>
                          <span>{ticket.createdAt?.seconds ? format(ticket.createdAt.seconds * 1000, 'MMM dd, HH:mm') : 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button className="px-4 py-2 bg-espresso text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-saffron transition-colors">
                        Reply
                      </button>
                      <button className="px-4 py-2 bg-cream text-espresso/40 rounded-xl text-[10px] font-black uppercase tracking-widest hover:text-espresso transition-colors">
                        Close
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        );

      case 'inventory':
        const lowStockProducts = allProducts.filter(p => (p.stock || 0) < 10);
        return (
          <div className="space-y-8">
            {lowStockProducts.length > 0 && (
              <div className="bg-burgundy/5 border border-burgundy/10 p-6 rounded-3xl flex items-center gap-4">
                <div className="w-12 h-12 bg-burgundy text-white rounded-2xl flex items-center justify-center">
                  <AlertTriangle size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-burgundy">Low Stock Alert</h4>
                  <p className="text-sm text-burgundy/60">{lowStockProducts.length} products are running low on stock. Please restock soon.</p>
                </div>
              </div>
            )}
            
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-espresso/5">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-serif font-bold text-espresso">Inventory Status</h3>
                <div className="flex gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-espresso/20" size={16} />
                    <input type="text" placeholder="Search inventory..." className="pl-10 pr-4 py-2 bg-cream/50 rounded-xl text-sm border-none" />
                  </div>
                  <button 
                    onClick={() => {
                      setEditingProduct(null);
                      setProductForm({
                        name: "",
                        hindiName: "",
                        price: 0,
                        weight: "200g",
                        category: "Blends",
                        stock: 50,
                        image: "",
                        ingredients: "",
                        benefits: "",
                        tag: ""
                      });
                      setShowProductModal(true);
                    }}
                    className="bg-saffron text-white px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2"
                  >
                    <Plus size={18} /> Add Stock
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b border-espresso/5">
                      <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-espresso/40">Product</th>
                      <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-espresso/40">Current Stock</th>
                      <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-espresso/40">Threshold</th>
                      <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-espresso/40">Status</th>
                      <th className="pb-4"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-espresso/5">
                    {allProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-cream/30 transition-colors">
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg overflow-hidden bg-espresso/5">
                              <img src={p.image || "https://picsum.photos/seed/spice/100/100"} alt="" className="w-full h-full object-cover" />
                            </div>
                            <span className="font-bold text-espresso text-sm">{p.name}</span>
                          </div>
                        </td>
                        <td className="py-4 text-sm font-bold text-espresso">{p.stock || 0} units</td>
                        <td className="py-4 text-sm text-espresso/40">10 units</td>
                        <td className="py-4">
                          <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                            (p.stock || 0) < 10 ? 'bg-burgundy/10 text-burgundy' : 'bg-green-100 text-green-600'
                          }`}>
                            {(p.stock || 0) < 10 ? 'Low Stock' : 'Healthy'}
                          </span>
                        </td>
                        <td className="py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button 
                              onClick={() => {
                                setEditingProduct(p);
                                setProductForm({
                                  name: p.name || "",
                                  hindiName: p.hindiName || "",
                                  price: p.price || 0,
                                  weight: p.weight || "200g",
                                  category: p.category || "Blends",
                                  stock: p.stock || 0,
                                  image: p.image || "",
                                  ingredients: Array.isArray(p.ingredients) ? p.ingredients.join(", ") : "",
                                  benefits: Array.isArray(p.benefits) ? p.benefits.join(", ") : "",
                                  tag: p.tag || ""
                                });
                                setShowProductModal(true);
                              }}
                              className="p-2 text-espresso/20 hover:text-saffron transition-colors"
                            >
                              <Edit3 size={16} />
                            </button>
                            <button 
                              onClick={() => handleDeleteProduct(p.id)}
                              className="p-2 text-espresso/20 hover:text-burgundy transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'users':
        const filteredUsers = allUsers
          .filter(u => {
            const matchesSearch = (u.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                   u.email?.toLowerCase().includes(searchTerm.toLowerCase()));
            const matchesRole = roleFilter === 'all' || u.role === roleFilter;
            return matchesSearch && matchesRole;
          })
          .sort((a, b) => {
            if (sortBy === 'newest') return (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0);
            if (sortBy === 'oldest') return (a.createdAt?.seconds || 0) - (b.createdAt?.seconds || 0);
            if (sortBy === 'name') return (a.displayName || "").localeCompare(b.displayName || "");
            return 0;
          });

        return (
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-espresso/5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <h3 className="text-2xl font-serif font-bold text-espresso">All Users</h3>
              <div className="flex flex-wrap gap-4">
                <div className="relative flex-1 md:flex-none">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-espresso/20" size={16} />
                  <input 
                    type="text" 
                    placeholder="Search name or email..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full md:w-64 pl-10 pr-4 py-2 bg-cream/50 rounded-xl text-sm border-none focus:ring-2 focus:ring-saffron/20" 
                  />
                </div>
                <button 
                  onClick={() => setShowFilters(!showFilters)}
                  className={`p-2 rounded-xl transition-colors flex items-center gap-2 text-sm font-bold ${
                    showFilters ? "bg-saffron text-white" : "bg-cream/50 text-espresso/40 hover:text-espresso"
                  }`}
                >
                  <Filter size={18} />
                  <span className="hidden sm:inline">Filters</span>
                </button>
              </div>
            </div>

            <AnimatePresence>
              {showFilters && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden mb-8"
                >
                  <div className="p-6 bg-cream/30 rounded-2xl grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-espresso/40 mb-2 block">Filter by Role</label>
                      <div className="flex gap-2">
                        {['all', 'user', 'admin'].map((role) => (
                          <button
                            key={role}
                            onClick={() => setRoleFilter(role)}
                            className={`px-4 py-2 rounded-lg text-xs font-bold capitalize transition-all ${
                              roleFilter === role ? "bg-espresso text-white" : "bg-white text-espresso/40 hover:bg-espresso/5"
                            }`}
                          >
                            {role}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-espresso/40 mb-2 block">Sort by Join Date</label>
                      <select 
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="w-full bg-white border-none rounded-lg text-xs font-bold text-espresso/60 focus:ring-2 focus:ring-saffron/20"
                      >
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                        <option value="name">Name (A-Z)</option>
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-espresso/5">
                    <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-espresso/40">User</th>
                    <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-espresso/40">Email</th>
                    <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-espresso/40">Role</th>
                    <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-espresso/40">Joined</th>
                    <th className="pb-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-espresso/5">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-espresso/20 italic">No users found matching your criteria.</td>
                    </tr>
                  ) : (
                    filteredUsers.map((u) => (
                      <tr key={u.id} className="group hover:bg-cream/30 transition-colors">
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full overflow-hidden bg-espresso/5">
                              <img src={u.photoURL || `https://ui-avatars.com/api/?name=${u.displayName}`} alt="" />
                            </div>
                            <span className="font-bold text-espresso text-sm">{u.displayName}</span>
                          </div>
                        </td>
                        <td className="py-4 text-sm text-espresso/60">{u.email}</td>
                        <td className="py-4">
                          <select 
                            value={u.role}
                            onChange={(e) => handleUpdateUserRole(u.id, e.target.value)}
                            className={`text-[10px] font-black uppercase px-2 py-0.5 rounded border-none focus:ring-0 cursor-pointer ${
                              u.role === 'admin' ? 'bg-burgundy/10 text-burgundy' : 'bg-espresso/5 text-espresso/60'
                            }`}
                          >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                        <td className="py-4 text-sm text-espresso/40">
                          {u.createdAt?.seconds ? new Date(u.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="py-4 text-right">
                          <button className="p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreVertical size={16} className="text-espresso/20" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'orders':
        return (
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-espresso/5">
            <h3 className="text-2xl font-serif font-bold text-espresso mb-8">Order Management</h3>
            <div className="space-y-4">
              {allOrders.map((order) => (
                <div key={order.id} className="flex flex-wrap items-center justify-between p-6 rounded-2xl border border-espresso/5 hover:border-saffron/20 transition-all">
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 bg-cream rounded-2xl flex items-center justify-center text-saffron">
                      <Package size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-espresso">Order #{order.id.slice(-6).toUpperCase()}</h4>
                      <p className="text-xs text-espresso/40">{order.customerEmail || 'No email'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-12">
                    <div className="text-center">
                      <p className="text-[10px] font-black uppercase tracking-widest text-espresso/40 mb-1">Status</p>
                      <select 
                        value={order.status}
                        onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                        className="text-xs font-bold text-saffron uppercase bg-transparent border-none focus:ring-0 cursor-pointer"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] font-black uppercase tracking-widest text-espresso/40 mb-1">Total</p>
                      <p className="font-bold text-espresso">₹{order.total}</p>
                    </div>
                    <button className="bg-espresso text-white p-2 rounded-xl hover:bg-saffron transition-colors">
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'products':
        return (
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-espresso/5">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-serif font-bold text-espresso">Inventory & Products</h3>
              <button 
                onClick={() => {
                  setEditingProduct(null);
                  setProductForm({
                    name: "",
                    hindiName: "",
                    price: 0,
                    weight: "200g",
                    category: "Blends",
                    stock: 50,
                    image: "",
                    ingredients: "",
                    benefits: "",
                    tag: ""
                  });
                  setShowProductModal(true);
                }}
                className="bg-saffron text-white px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2"
              >
                <Plus size={18} /> Add Product
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allProducts.map((p) => (
                <div key={p.id} className="group p-6 rounded-2xl border border-espresso/5 hover:shadow-md transition-all relative">
                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <button 
                      onClick={() => {
                        setEditingProduct(p);
                        setProductForm({
                          name: p.name || "",
                          hindiName: p.hindiName || "",
                          price: p.price || 0,
                          weight: p.weight || "200g",
                          category: p.category || "Blends",
                          stock: p.stock || 0,
                          image: p.image || "",
                          ingredients: Array.isArray(p.ingredients) ? p.ingredients.join(", ") : "",
                          benefits: Array.isArray(p.benefits) ? p.benefits.join(", ") : "",
                          tag: p.tag || ""
                        });
                        setShowProductModal(true);
                      }}
                      className="p-2 bg-white rounded-lg shadow-sm text-espresso/40 hover:text-saffron transition-colors"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button 
                      onClick={() => handleDeleteProduct(p.id)}
                      className="p-2 bg-white rounded-lg shadow-sm text-espresso/40 hover:text-burgundy transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="w-full aspect-square bg-cream rounded-xl mb-4 overflow-hidden">
                    <img src={p.image || "https://picsum.photos/seed/spice/400/400"} alt="" className="w-full h-full object-cover" />
                  </div>
                  <h4 className="font-bold text-espresso mb-1">{p.name}</h4>
                  <div className="flex justify-between items-center">
                    <p className="text-saffron font-bold">₹{p.price}</p>
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                      (p.stock || 0) < 10 ? 'bg-burgundy/10 text-burgundy' : 'bg-green-100 text-green-600'
                    }`}>Stock: {p.stock || 0}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return (
          <div className="h-96 flex items-center justify-center bg-white rounded-3xl border border-dashed border-espresso/10">
            <div className="text-center">
              <p className="text-espresso/20 font-serif italic text-xl">Section "{activeSection}" is coming soon...</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-cream">
      {/* Fixed Sidebar */}
      <aside className="w-72 bg-white border-r border-espresso/5 flex flex-col fixed h-screen z-20">
        <div className="p-8">
          <Link to="/" className="flex items-center gap-3 mb-12">
            <span className="text-3xl">🌶️</span>
            <div className="flex flex-col">
              <span className="text-xl font-serif font-bold text-espresso leading-none">Admin Panel</span>
              <span className="text-[8px] uppercase tracking-[0.3em] font-black text-espresso/40">Masala Ghar</span>
            </div>
          </Link>

          <nav className="space-y-1">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id as AdminSection)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                  activeSection === item.id 
                    ? "bg-espresso text-white shadow-lg shadow-espresso/20" 
                    : "text-espresso/40 hover:bg-espresso/5 hover:text-espresso"
                }`}
              >
                <item.icon size={18} />
                {item.label}
                {activeSection === item.id && (
                  <motion.div layoutId="active" className="ml-auto">
                    <ChevronRight size={14} />
                  </motion.div>
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-8 border-t border-espresso/5">
          <Link to="/" className="flex items-center gap-3 text-espresso/40 hover:text-saffron transition-colors text-sm font-bold">
            <Home size={18} />
            Back to Website
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-72 p-12">
        <header className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-espresso/20 mb-1">
              {sidebarItems.find(i => i.id === activeSection)?.label}
            </h2>
            <h1 className="text-3xl font-serif font-bold text-espresso">
              {activeSection === 'overview' ? 'Welcome back, Admin' : sidebarItems.find(i => i.id === activeSection)?.label}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <button className="w-10 h-10 rounded-xl bg-white border border-espresso/5 flex items-center justify-center text-espresso/40 hover:text-espresso transition-colors">
              <Settings size={20} />
            </button>
            <div className="w-10 h-10 rounded-xl overflow-hidden border border-espresso/5">
              <img src={`https://ui-avatars.com/api/?name=Admin&background=F27D26&color=fff`} alt="" />
            </div>
          </div>
        </header>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Product Modal */}
      <AnimatePresence>
        {showProductModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowProductModal(false)}
              className="absolute inset-0 bg-espresso/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-espresso/5 flex items-center justify-between">
                <h3 className="text-2xl font-serif font-bold text-espresso">
                  {editingProduct ? "Edit Product" : "Add New Product"}
                </h3>
                <button onClick={() => setShowProductModal(false)} className="text-espresso/20 hover:text-espresso">
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleSaveProduct} className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-espresso/40 mb-2 block">Product Name</label>
                      <input 
                        type="text" 
                        required
                        value={productForm.name}
                        onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                        className="w-full px-4 py-3 bg-cream/50 rounded-xl text-sm border-none focus:ring-2 focus:ring-saffron/20" 
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-espresso/40 mb-2 block">Hindi Name / Subtitle</label>
                      <input 
                        type="text" 
                        value={productForm.hindiName}
                        onChange={(e) => setProductForm({...productForm, hindiName: e.target.value})}
                        className="w-full px-4 py-3 bg-cream/50 rounded-xl text-sm border-none focus:ring-2 focus:ring-saffron/20" 
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-espresso/40 mb-2 block">Price (₹)</label>
                        <input 
                          type="number" 
                          required
                          value={productForm.price}
                          onChange={(e) => setProductForm({...productForm, price: Number(e.target.value)})}
                          className="w-full px-4 py-3 bg-cream/50 rounded-xl text-sm border-none focus:ring-2 focus:ring-saffron/20" 
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-espresso/40 mb-2 block">Stock</label>
                        <input 
                          type="number" 
                          required
                          value={productForm.stock}
                          onChange={(e) => setProductForm({...productForm, stock: Number(e.target.value)})}
                          className="w-full px-4 py-3 bg-cream/50 rounded-xl text-sm border-none focus:ring-2 focus:ring-saffron/20" 
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-espresso/40 mb-2 block">Image URL</label>
                      <input 
                        type="text" 
                        required
                        value={productForm.image}
                        onChange={(e) => setProductForm({...productForm, image: e.target.value})}
                        className="w-full px-4 py-3 bg-cream/50 rounded-xl text-sm border-none focus:ring-2 focus:ring-saffron/20" 
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-espresso/40 mb-2 block">Category</label>
                      <select 
                        value={productForm.category}
                        onChange={(e) => setProductForm({...productForm, category: e.target.value})}
                        className="w-full px-4 py-3 bg-cream/50 rounded-xl text-sm border-none focus:ring-2 focus:ring-saffron/20"
                      >
                        <option value="Blends">Blends</option>
                        <option value="Pure">Pure</option>
                        <option value="Limited">Limited</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-espresso/40 mb-2 block">Weight (e.g. 200g)</label>
                      <input 
                        type="text" 
                        value={productForm.weight}
                        onChange={(e) => setProductForm({...productForm, weight: e.target.value})}
                        className="w-full px-4 py-3 bg-cream/50 rounded-xl text-sm border-none focus:ring-2 focus:ring-saffron/20" 
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-espresso/40 mb-2 block">Ingredients (Comma separated)</label>
                      <textarea 
                        value={productForm.ingredients}
                        onChange={(e) => setProductForm({...productForm, ingredients: e.target.value})}
                        className="w-full px-4 py-3 bg-cream/50 rounded-xl text-sm border-none focus:ring-2 focus:ring-saffron/20 h-20 resize-none" 
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-espresso/40 mb-2 block">Benefits (Comma separated)</label>
                      <textarea 
                        value={productForm.benefits}
                        onChange={(e) => setProductForm({...productForm, benefits: e.target.value})}
                        className="w-full px-4 py-3 bg-cream/50 rounded-xl text-sm border-none focus:ring-2 focus:ring-saffron/20 h-20 resize-none" 
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-8 flex gap-4">
                  <button 
                    type="submit"
                    className="flex-1 py-4 bg-espresso text-white rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-saffron transition-all"
                  >
                    {editingProduct ? "Update Product" : "Create Product"}
                  </button>
                  <button 
                    type="button"
                    onClick={() => setShowProductModal(false)}
                    className="flex-1 py-4 bg-cream text-espresso rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-espresso/5 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
