import { normalizeImageUrl, normalizeImageList } from '../utils/imageUrl';
import { Product, Order, Customer, StoreSettings, OrderStatus, CategoryItem, Coupon } from '../types';
import { INITIAL_PRODUCTS, INITIAL_SETTINGS, INITIAL_CATEGORIES, INITIAL_COUPONS } from '../data/initialProducts';

const STORAGE_KEYS = {
  PRODUCTS: 'aura_crockery_products_v1',
  ORDERS: 'aura_crockery_orders_v1',
  CUSTOMERS: 'aura_crockery_customers_v1',
  SETTINGS: 'aura_crockery_settings_v1',
  CATEGORIES: 'aura_crockery_categories_v1',
  COUPONS: 'aura_crockery_coupons_v1',
  WISHLIST: 'aura_crockery_wishlist_v1',
  CART: 'aura_crockery_cart_v1',
  ADMIN_SESSION: 'aura_crockery_admin_session',
};

// Seed initial products if not already initialized
function initStorage() {
  if (typeof window === 'undefined') return;

  if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
  }

  if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
  }

  if (!localStorage.getItem(STORAGE_KEYS.COUPONS)) {
    localStorage.setItem(STORAGE_KEYS.COUPONS, JSON.stringify(INITIAL_COUPONS));
  }

  const storedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
  if (!storedSettings) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(INITIAL_SETTINGS));
  } else {
    try {
      const parsed = JSON.parse(storedSettings);
      // Preserve user/admin settings. Only fill fields that are missing from older versions.
      const merged = { ...INITIAL_SETTINGS, ...parsed };
      const needsRepair = Object.keys(INITIAL_SETTINGS).some(
        (key) => !(key in parsed)
      );
      if (needsRepair) {
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(merged));
      }
    } catch {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(INITIAL_SETTINGS));
    }
  }

  if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
    // Seed initial realistic orders
    const seedOrders: Order[] = [
      {
        id: 'ORD-2026-9182',
        customerName: 'Ayesha Chowdhury',
        phone: '+880 1819 223344',
        email: 'ayesha.chowdhury@gmail.com',
        fullAddress: 'House 42, Road 11, Banani',
        division: 'Dhaka',
        district: 'Dhaka',
        items: [
          {
            productId: 'PRD-101',
            productName: 'Aurum 24K Gold Rim Dinner Plate',
            sku: 'AUR-PLT-001',
            price: 1550,
            quantity: 4,
            image: INITIAL_PRODUCTS[0].images[0],
            color: 'Pure White & Gold',
          },
          {
            productId: 'PRD-501',
            productName: 'Sovereign 24-Piece Brushed Gold Cutlery Set',
            sku: 'AUR-CUT-001',
            price: 6200,
            quantity: 1,
            image: INITIAL_PRODUCTS[8]?.images[0] || '',
            color: 'Brushed Champagne Gold',
          },
        ],
        subtotal: 12400,
        discountAmount: 1240,
        deliveryCharge: 80,
        totalPrice: 11240,
        paymentMethod: 'bKash',
        paymentTransactionId: 'BK9283749182',
        orderStatus: 'Delivered',
        orderDate: '2026-02-14T10:30:00.000Z',
      },
      {
        id: 'ORD-2026-9245',
        customerName: 'Tanvir Hossain',
        phone: '+880 1711 889900',
        email: 'tanvir.hossain@outlook.com',
        fullAddress: 'Apartment 5B, Sunrise Tower, Nasirabad',
        division: 'Chittagong',
        district: 'Chittagong',
        items: [
          {
            productId: 'PRD-401',
            productName: 'Majestic 32-Piece Imperial Bone China Dinner Set',
            sku: 'AUR-SET-001',
            price: 24900,
            quantity: 1,
            image: INITIAL_PRODUCTS[6]?.images[0] || '',
            color: 'Imperial White & 24K Gold',
          },
        ],
        subtotal: 24900,
        discountAmount: 0,
        deliveryCharge: 0,
        totalPrice: 24900,
        paymentMethod: 'Bank Payment',
        paymentTransactionId: 'TXN-CIT-20260218',
        orderStatus: 'Shipping',
        orderDate: '2026-02-28T14:15:00.000Z',
      },
      {
        id: 'ORD-2026-9380',
        customerName: 'Nadia Sultana',
        phone: '+880 1912 334455',
        email: 'nadia.sultana@yahoo.com',
        fullAddress: 'Holding 14, Upashahar Block C',
        division: 'Sylhet',
        district: 'Sylhet',
        items: [
          {
            productId: 'PRD-301',
            productName: 'Aristocrat Bone China Tea Cup & Saucer Set',
            sku: 'AUR-DRK-001',
            price: 4150,
            quantity: 1,
            image: INITIAL_PRODUCTS[4]?.images[0] || '',
            color: 'Ivory & Gold',
          },
          {
            productId: 'PRD-601',
            productName: 'Carrara Marble & Gold Handle Serving Tray',
            sku: 'AUR-ACC-001',
            price: 3100,
            quantity: 1,
            image: INITIAL_PRODUCTS[10]?.images[0] || '',
            color: 'White & Brass Gold',
          },
        ],
        subtotal: 7250,
        discountAmount: 725,
        deliveryCharge: 0,
        totalPrice: 6525,
        paymentMethod: 'Cash on Delivery',
        orderStatus: 'Processing',
        orderDate: '2026-03-05T09:20:00.000Z',
      },
      {
        id: 'ORD-2026-9411',
        customerName: 'Kazi Mahbub',
        phone: '+880 1622 778899',
        email: 'mahbub.kazi@gmail.com',
        fullAddress: 'Plot 7, Sector 7, Uttara',
        division: 'Dhaka',
        district: 'Dhaka',
        items: [
          {
            productId: 'PRD-603',
            productName: 'Aroma Airtight Ceramic Spice Jar Set',
            sku: 'AUR-ACC-003',
            price: 1850,
            quantity: 2,
            image: INITIAL_PRODUCTS[11]?.images[0] || '',
          },
        ],
        subtotal: 3700,
        discountAmount: 0,
        deliveryCharge: 80,
        totalPrice: 3780,
        paymentMethod: 'Nagad',
        paymentTransactionId: 'NG88273641',
        orderStatus: 'Pending',
        orderDate: '2026-03-12T16:45:00.000Z',
      },
    ];
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(seedOrders));
  }

  if (!localStorage.getItem(STORAGE_KEYS.CUSTOMERS)) {
    const seedCustomers: Customer[] = [
      {
        id: 'CUST-1001',
        name: 'Ayesha Chowdhury',
        phone: '+880 1819 223344',
        email: 'ayesha.chowdhury@gmail.com',
        address: 'House 42, Road 11, Banani',
        division: 'Dhaka',
        district: 'Dhaka',
        totalOrders: 1,
        totalSpent: 11240,
        lastOrderDate: '2026-02-14',
        registrationDate: '2026-02-14',
      },
      {
        id: 'CUST-1002',
        name: 'Tanvir Hossain',
        phone: '+880 1711 889900',
        email: 'tanvir.hossain@outlook.com',
        address: 'Apartment 5B, Sunrise Tower, Nasirabad',
        division: 'Chittagong',
        district: 'Chittagong',
        totalOrders: 1,
        totalSpent: 24900,
        lastOrderDate: '2026-02-28',
        registrationDate: '2026-02-28',
      },
      {
        id: 'CUST-1003',
        name: 'Nadia Sultana',
        phone: '+880 1912 334455',
        email: 'nadia.sultana@yahoo.com',
        address: 'Holding 14, Upashahar Block C',
        division: 'Sylhet',
        district: 'Sylhet',
        totalOrders: 1,
        totalSpent: 6525,
        lastOrderDate: '2026-03-05',
        registrationDate: '2026-03-05',
      },
      {
        id: 'CUST-1004',
        name: 'Kazi Mahbub',
        phone: '+880 1622 778899',
        email: 'mahbub.kazi@gmail.com',
        address: 'Plot 7, Sector 7, Uttara',
        division: 'Dhaka',
        district: 'Dhaka',
        totalOrders: 1,
        totalSpent: 3780,
        lastOrderDate: '2026-03-12',
        registrationDate: '2026-03-12',
      },
    ];
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(seedCustomers));
  }
}

// Call on module load
initStorage();

export const api = {
  async bootstrap(): Promise<{ products: Product[]; settings: StoreSettings; categories: CategoryItem[] }> {
    initStorage();
    const localSettings = this.getSettings();
    const url = String(localSettings.googleAppsScriptUrl || '').trim();
    if (!url) {
      return {
        products: await this.getProducts(),
        settings: localSettings,
        categories: this.getCategories(),
      };
    }

    try {
      const res = await fetch(url + '?action=bootstrap', { method: 'GET' });
      if (!res.ok) throw new Error('Bootstrap request failed: ' + res.status);
      const json = await res.json();
      if (!json.success) throw new Error(json.message || 'Bootstrap failed');

      const products: Product[] = Array.isArray(json.data?.products)
        ? json.data.products.map((item: any) => ({
            id: item.Product_ID || item.id,
            name: item.Product_Name || item.name,
            category: item.Category || 'Plates',
            subCategory: item.SubCategory || 'Plate',
            shortDescription: item.Short_Description || '',
            description: item.Description || '',
            price: Number(item.Price) || 0,
            discountPrice: item.Discount_Price ? Number(item.Discount_Price) : undefined,
            stock: Number(item.Stock) || 0,
            sku: item.SKU || '',
            images: normalizeImageList(String(item.Images || '')),
            material: item.Material || 'Porcelain',
            size: item.Size || '',
            color: item.Color || '',
            rating: Number(item.Rating) || 5,
            reviewCount: Number(item.Review_Count) || 0,
            status: item.Status || 'Active',
            specifications: { dishwasherSafe: true, microwaveSafe: true, foodGrade: true },
            createdDate: item.Created_Date || new Date().toISOString(),
          }))
        : [];

      const raw = json.data?.settings || {};
      const remoteSettings = {
        ...localSettings,
        ...(raw.Store_Name ? { storeName: raw.Store_Name } : {}),
        ...(raw.Store_Phone ? { phone: raw.Store_Phone } : {}),
        ...(raw.WhatsApp_Number ? { whatsappNumber: raw.WhatsApp_Number } : {}),
        ...(raw.Store_Email ? { email: raw.Store_Email } : {}),
        ...(raw.Delivery_Charge_Inside ? { deliveryChargeInside: Number(raw.Delivery_Charge_Inside) } : {}),
        ...(raw.Delivery_Charge_Outside ? { deliveryChargeOutside: Number(raw.Delivery_Charge_Outside) } : {}),
        ...(raw.Free_Delivery_Threshold ? { freeDeliveryThreshold: Number(raw.Free_Delivery_Threshold) } : {}),
        ...(raw.Bkash_Number ? { bkashMerchantNumber: raw.Bkash_Number } : {}),
        ...(raw.Nagad_Number ? { nagadMerchantNumber: raw.Nagad_Number } : {}),
        ...(raw.Currency ? { currency: raw.Currency } : {}),
      } as StoreSettings;
      const mergedSettings = {
        ...remoteSettings,
        content: {
          ...(localSettings.content || {}),
          ...(json.data?.content ? {
            aboutBn: json.data.content.about?.bn || localSettings.content?.aboutBn,
            aboutEn: json.data.content.about?.en || localSettings.content?.aboutEn,
            deliveryBn: json.data.content.delivery?.bn || localSettings.content?.deliveryBn,
            deliveryEn: json.data.content.delivery?.en || localSettings.content?.deliveryEn,
            returnsBn: json.data.content.returns?.bn || localSettings.content?.returnsBn,
            returnsEn: json.data.content.returns?.en || localSettings.content?.returnsEn,
            faq: Array.isArray(json.data?.faq) ? json.data.faq : (localSettings.content?.faq || []),
          } : {}),
        },
      };
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(mergedSettings));
      if (Array.isArray(json.data?.categories)) {
        localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(json.data.categories));
      }

      return {
        products,
        settings: mergedSettings,
        categories: Array.isArray(json.data?.categories) ? json.data.categories : this.getCategories(),
      };
    } catch (error) {
      console.warn('Bootstrap API failed; using local cache:', error);
      return {
        products: await this.getProducts(),
        settings: localSettings,
        categories: this.getCategories(),
      };
    }
  },

  // PRODUCTS
  async getProducts(): Promise<Product[]> {
    initStorage();
    const settings = this.getSettings();

    // If Google Apps Script Web App URL is supplied, attempt live fetch
    if (settings.googleAppsScriptUrl && settings.googleAppsScriptUrl.trim() !== '') {
      try {
        const url = `${settings.googleAppsScriptUrl}?action=getProducts`;
        const res = await fetch(url, { method: 'GET' });
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data) && json.data.length > 0) {
            // Map Google Sheet format to Product interface
            const mapped: Product[] = json.data.map((item: any) => ({
              id: item.Product_ID || item.id,
              name: item.Product_Name || item.name,
              category: item.Category || 'Plates',
              subCategory: item.SubCategory || 'Plate',
              shortDescription: item.Short_Description || '',
              description: item.Description || '',
              price: Number(item.Price) || 0,
              discountPrice: item.Discount_Price ? Number(item.Discount_Price) : undefined,
              stock: Number(item.Stock) || 0,
              sku: item.SKU || '',
              images: normalizeImageList(String(item.Images || '')),
              material: item.Material || 'Porcelain',
              size: item.Size || '',
              color: item.Color || '',
              rating: Number(item.Rating) || 5,
              reviewCount: 12,
              status: (item.Status as any) || 'Active',
              specifications: {
                dishwasherSafe: true,
                microwaveSafe: true,
                foodGrade: true,
              },
              createdDate: item.Created_Date || new Date().toISOString(),
            }));
            // Update local cache
            localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(mapped));
            return mapped;
          }
        }
      } catch (err) {
        console.warn('Google Apps Script fetch error, falling back to local storage:', err);
      }
    }

    const localData = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    return localData ? JSON.parse(localData) : INITIAL_PRODUCTS;
  },

  async getProductById(id: string): Promise<Product | null> {
    const products = await this.getProducts();
    return products.find((p) => p.id === id) || null;
  },

  async addProduct(product: Omit<Product, 'id' | 'createdDate'>): Promise<Product> {
    const products = await this.getProducts();
    const newId = `PRD-${Math.floor(100 + products.length + 1)}`;
    const newProduct: Product = {
      ...product,
      id: newId,
      createdDate: new Date().toISOString().split('T')[0],
    };

    const updated = [newProduct, ...products];
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(updated));

    // Sync to Google Apps Script if URL is present
    const settings = this.getSettings();
    if (settings.googleAppsScriptUrl) {
      try {
        await fetch(settings.googleAppsScriptUrl, {
          method: 'POST',
          mode: 'no-cors', // standard for GAS webapp
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'addProduct',
            data: {
              Product_ID: newProduct.id,
              Product_Name: newProduct.name,
              Category: newProduct.category,
              Short_Description: newProduct.shortDescription,
              Description: newProduct.description,
              Price: newProduct.price,
              Discount_Price: newProduct.discountPrice || '',
              Stock: newProduct.stock,
              SKU: newProduct.sku,
              Images: newProduct.images.join(', '),
              Material: newProduct.material,
              Size: newProduct.size,
              Color: newProduct.color,
              Rating: newProduct.rating,
              Status: newProduct.status,
            },
          }),
        });
      } catch (err) {
        console.warn('Sync to Google Apps Script failed:', err);
      }
    }

    return newProduct;
  },

  async updateProduct(product: Product): Promise<Product> {
    const products = await this.getProducts();
    const updated = products.map((p) => (p.id === product.id ? product : p));
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(updated));

    const settings = this.getSettings();
    if (settings.googleAppsScriptUrl) {
      try {
        await fetch(settings.googleAppsScriptUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'updateProduct',
            data: {
              Product_ID: product.id,
              Product_Name: product.name,
              Category: product.category,
              Short_Description: product.shortDescription,
              Description: product.description,
              Price: product.price,
              Discount_Price: product.discountPrice || '',
              Stock: product.stock,
              SKU: product.sku,
              Images: product.images.join(', '),
              Material: product.material,
              Size: product.size,
              Color: product.color,
              Status: product.status,
            },
          }),
        });
      } catch (err) {
        console.warn('Update to GAS failed:', err);
      }
    }

    return product;
  },

  async deleteProduct(id: string): Promise<boolean> {
    const products = await this.getProducts();
    const updated = products.filter((p) => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(updated));

    const settings = this.getSettings();
    if (settings.googleAppsScriptUrl) {
      try {
        await fetch(settings.googleAppsScriptUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'deleteProduct',
            data: { id },
          }),
        });
      } catch (err) {
        console.warn('Delete in GAS failed:', err);
      }
    }

    return true;
  },

  // ORDERS
  async getOrders(): Promise<Order[]> {
    initStorage();
    const data = localStorage.getItem(STORAGE_KEYS.ORDERS);
    return data ? JSON.parse(data) : [];
  },

  async createOrder(orderInput: Omit<Order, 'id' | 'orderDate' | 'orderStatus'>): Promise<Order> {
    const orders = await this.getOrders();
    const year = new Date().getFullYear();
    let orderId = '';
    do {
      orderId = `ORD-${year}-${Math.floor(1000 + Math.random() * 9000)}`;
    } while (orders.some((order) => order.id === orderId));
    const newOrder: Order = {
      ...orderInput,
      id: orderId,
      orderDate: new Date().toISOString(),
      orderStatus: 'Pending',
    };

    // Save order
    const updatedOrders = [newOrder, ...orders];
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(updatedOrders));

    // Auto-decrement inventory stock in products
    const products = await this.getProducts();
    const updatedProducts = products.map((p) => {
      const match = newOrder.items.find((i) => i.productId === p.id);
      if (match) {
        const newStock = Math.max(0, p.stock - match.quantity);
        return {
          ...p,
          stock: newStock,
          status: newStock === 0 ? ('Out of Stock' as const) : p.status,
        };
      }
      return p;
    });
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(updatedProducts));

    // Update customer registry
    const customers = await this.getCustomers();
    const existingCust = customers.find((c) => c.phone === newOrder.phone);
    if (existingCust) {
      const updatedCusts = customers.map((c) =>
        c.phone === newOrder.phone
          ? {
              ...c,
              totalOrders: c.totalOrders + 1,
              totalSpent: c.totalSpent + newOrder.totalPrice,
              lastOrderDate: new Date().toISOString().split('T')[0],
              address: newOrder.fullAddress,
            }
          : c
      );
      localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(updatedCusts));
    } else {
      const newCust: Customer = {
        id: `CUST-${1000 + customers.length + 1}`,
        name: newOrder.customerName,
        phone: newOrder.phone,
        email: newOrder.email,
        address: newOrder.fullAddress,
        division: newOrder.division,
        district: newOrder.district,
        totalOrders: 1,
        totalSpent: newOrder.totalPrice,
        lastOrderDate: new Date().toISOString().split('T')[0],
        registrationDate: new Date().toISOString().split('T')[0],
      };
      localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify([newCust, ...customers]));
    }

    // Google Apps Script Live Dispatch
    const settings = this.getSettings();
    if (settings.googleAppsScriptUrl) {
      try {
        await fetch(settings.googleAppsScriptUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'createOrder',
            data: {
              Order_ID: newOrder.id,
              Customer_Name: newOrder.customerName,
              Phone: newOrder.phone,
              Email: newOrder.email,
              Address: `${newOrder.fullAddress}, ${newOrder.district}, ${newOrder.division}`,
              Total_Price: newOrder.totalPrice,
              Payment_Method: newOrder.paymentMethod,
              items: newOrder.items.map((i) => ({
                Product_ID: i.productId,
                Product_Name: i.productName,
                Quantity: i.quantity,
                Price: i.price,
              })),
            },
          }),
        });
      } catch (err) {
        console.warn('Failed syncing order to Google Apps Script:', err);
      }
    }

    return newOrder;
  },

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<boolean> {
    const orders = await this.getOrders();
    const updated = orders.map((o) => (o.id === orderId ? { ...o, orderStatus: status } : o));
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(updated));

    const settings = this.getSettings();
    if (settings.googleAppsScriptUrl) {
      try {
        await fetch(settings.googleAppsScriptUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'updateOrderStatus',
            data: { orderId, status },
          }),
        });
      } catch (err) {
        console.warn('Failed updating order status on GAS:', err);
      }
    }

    return true;
  },

  // CUSTOMERS
  async getCustomers(): Promise<Customer[]> {
    initStorage();
    const data = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
    return data ? JSON.parse(data) : [];
  },

  // SETTINGS
  getSettings(): StoreSettings {
    initStorage();
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return data ? JSON.parse(data) : INITIAL_SETTINGS;
  },

  saveSettings(settings: StoreSettings): void {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));

    if (settings.googleAppsScriptUrl) {
      try {
        fetch(settings.googleAppsScriptUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'updateSettings',
            data: {
              Store_Name: settings.storeName,
              Store_Phone: settings.phone,
              WhatsApp_Number: settings.whatsappNumber,
              Store_Email: settings.email,
              Delivery_Charge_Inside: String(settings.deliveryChargeInside),
              Delivery_Charge_Outside: String(settings.deliveryChargeOutside),
              Free_Delivery_Threshold: String(settings.freeDeliveryThreshold),
              Bkash_Number: settings.bkashMerchantNumber,
              Nagad_Number: settings.nagadMerchantNumber,
              Currency: settings.currency,
            },
          }),
        }).catch((e) => console.warn('Could not post settings to GAS', e));
      } catch (err) {
        console.warn('Error saving settings to GAS:', err);
      }
    }
  },

  // Test live connection to Google Apps Script Web App
  async testGasConnection(gasUrl: string): Promise<{ success: boolean; message: string }> {
    if (!gasUrl || !gasUrl.startsWith('http')) {
      return { success: false, message: 'Please enter a valid Google Apps Script Web App URL starting with https://script.google.com/macros/s/...' };
    }

    try {
      const url = `${gasUrl}?action=ping`;
      const res = await fetch(url, { method: 'GET' });
      if (res.ok) {
        const data = await res.json();
        return { success: true, message: data.message || 'Connected successfully to Google Apps Script Web App!' };
      }
      return { success: false, message: `Server responded with status: ${res.status}` };
    } catch (err: any) {
      return {
        success: false,
        message: 'Could not reach Web App directly. Note: ensure Web App is deployed with "Who has access: Anyone".',
      };
    }
  },

  // CATEGORIES & SUBCATEGORIES
  getCategories(): CategoryItem[] {
    initStorage();
    const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    return data ? JSON.parse(data) : INITIAL_CATEGORIES;
  },

  saveCategories(categories: CategoryItem[]): void {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  },

  addCategory(category: CategoryItem): CategoryItem[] {
    const categories = this.getCategories();
    const existingIndex = categories.findIndex((c) => c.name.toLowerCase() === category.name.trim().toLowerCase());
    if (existingIndex >= 0) {
      // merge subcategories if already exists
      const mergedSub = Array.from(new Set([...categories[existingIndex].subcategories, ...category.subcategories]));
      categories[existingIndex].subcategories = mergedSub;
      if (category.image) categories[existingIndex].image = category.image;
      if (category.description) categories[existingIndex].description = category.description;
    } else {
      categories.push(category);
    }
    this.saveCategories(categories);
    return categories;
  },

  updateCategory(updatedCategory: CategoryItem): CategoryItem[] {
    let categories = this.getCategories();
    const index = categories.findIndex((c) => c.id === updatedCategory.id);
    if (index >= 0) {
      const oldName = categories[index].name;
      categories[index] = updatedCategory;
      this.saveCategories(categories);

      // If category name changed, update existing products with that category
      if (oldName !== updatedCategory.name) {
        const localProds = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
        if (localProds) {
          const prods: Product[] = JSON.parse(localProds);
          let changed = false;
          prods.forEach((p) => {
            if (p.category === oldName) {
              p.category = updatedCategory.name;
              changed = true;
            }
          });
          if (changed) {
            localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(prods));
          }
        }
      }
    }
    return categories;
  },

  deleteCategory(id: string): CategoryItem[] {
    let categories = this.getCategories();
    categories = categories.filter((c) => c.id !== id);
    this.saveCategories(categories);
    return categories;
  },

  // COUPONS & DISCOUNTS
  getCoupons(): Coupon[] {
    initStorage();
    const data = localStorage.getItem(STORAGE_KEYS.COUPONS);
    return data ? JSON.parse(data) : INITIAL_COUPONS;
  },

  saveCoupons(coupons: Coupon[]): void {
    localStorage.setItem(STORAGE_KEYS.COUPONS, JSON.stringify(coupons));
  },

  validateCoupon(code: string, subtotal: number): { valid: boolean; message: string; discountAmount: number; coupon?: Coupon } {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) {
      return { valid: false, message: 'Please enter a coupon or promo code.', discountAmount: 0 };
    }

    const coupons = this.getCoupons();
    const match = coupons.find((c) => c.code.toUpperCase() === trimmed);

    if (!match) {
      return { valid: false, message: `Coupon code "${code}" is invalid or expired.`, discountAmount: 0 };
    }

    if (match.minimumOrder && subtotal < match.minimumOrder) {
      return {
        valid: false,
        message: `Coupon "${match.code}" requires minimum purchase of ৳${match.minimumOrder.toLocaleString()}. (Current: ৳${subtotal.toLocaleString()})`,
        discountAmount: 0,
        coupon: match,
      };
    }

    let discount = 0;
    if (match.discountPercent) {
      discount = Math.round((subtotal * match.discountPercent) / 100);
    } else if (match.discountAmount) {
      discount = Math.min(subtotal, match.discountAmount);
    }

    return {
      valid: true,
      message: `Coupon "${match.code}" applied successfully! Saved ৳${discount.toLocaleString()}`,
      discountAmount: discount,
      coupon: match,
    };
  },

  // Reset to factory demo data
  resetFactoryData() {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
    localStorage.setItem(STORAGE_KEYS.COUPONS, JSON.stringify(INITIAL_COUPONS));
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(INITIAL_SETTINGS));
    localStorage.removeItem(STORAGE_KEYS.ORDERS);
    localStorage.removeItem(STORAGE_KEYS.CUSTOMERS);
    initStorage();
  },
};
