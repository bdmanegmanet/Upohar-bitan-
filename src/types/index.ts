export type ProductCategory = string;
export type ProductSubCategory = string;

export interface CategoryItem {
  id: string;
  name: string;
  subcategories: string[];
  image?: string;
  description?: string;
}

export interface Product {
  id: string; // Product_ID (e.g. PRD-101)
  name: string;
  category: ProductCategory;
  subCategory: ProductSubCategory;
  shortDescription: string;
  description: string;
  price: number;
  discountPrice?: number;
  stock: number;
  sku: string;
  images: string[];
  material: string; // Bone China, Stoneware, Porcelain, 18/10 Stainless Steel, Acacia Wood, etc.
  size: string; // e.g. 10.5 inch, 350ml, 24-piece set
  color: string;
  rating: number; // 1 to 5
  reviewCount: number;
  status: 'Active' | 'Out of Stock' | 'Draft';
  featured?: boolean;
  bestSeller?: boolean;
  isNewArrival?: boolean;
  specifications: {
    dishwasherSafe: boolean;
    microwaveSafe: boolean;
    ovenSafe?: boolean;
    foodGrade: boolean;
    origin?: string;
    weight?: string;
  };
  createdDate: string;
}

export type OrderStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Processing'
  | 'Shipping'
  | 'Delivered'
  | 'Cancelled';

export type PaymentMethod =
  | 'Cash on Delivery'
  | 'bKash'
  | 'Nagad'
  | 'Bank Payment';

export interface OrderItem {
  productId: string;
  productName: string;
  sku: string;
  price: number;
  quantity: number;
  image: string;
  color?: string;
  size?: string;
}

export interface Order {
  id: string; // e.g. ORD-2026-8812
  customerName: string;
  phone: string;
  email: string;
  fullAddress: string;
  division: string;
  district: string;
  deliveryAddressNote?: string;
  items: OrderItem[];
  subtotal: number;
  discountAmount: number;
  deliveryCharge: number;
  totalPrice: number;
  paymentMethod: PaymentMethod;
  paymentTransactionId?: string;
  orderStatus: OrderStatus;
  orderDate: string; // ISO string
  notes?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  division: string;
  district: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
  registrationDate: string;
}

export interface FAQItem {
  id: string;
  questionBn: string;
  answerBn: string;
  questionEn?: string;
  answerEn?: string;
  active?: boolean;
  sortOrder?: number;
}

export interface StoreContent {
  aboutBn?: string;
  aboutEn?: string;
  deliveryBn?: string;
  deliveryEn?: string;
  returnsBn?: string;
  returnsEn?: string;
  faq?: FAQItem[];
  heroSlides?: HeroSlide[];
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  logoUrl?: string;
  phone: string;
  whatsappNumber: string;
  email: string;
  address: string;
  currency: string;
  deliveryChargeInside: number;
  deliveryChargeOutside: number;
  freeDeliveryThreshold: number;
  bkashMerchantNumber: string;
  nagadMerchantNumber: string;
  bankAccountDetails: string;
  facebookUrl: string;
  instagramUrl: string;
  googleAppsScriptUrl: string;
  googleSheetsUrl?: string;
  bannerNotice: string;
  heroSlides?: HeroSlide[];
  content?: StoreContent;
}

export interface HeroSlide {
  id: string;
  image: string;
  titleBn?: string;
  titleEn?: string;
  subtitleBn?: string;
  subtitleEn?: string;
  active?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export interface Coupon {
  code: string;
  discountPercent?: number;
  discountAmount?: number;
  minimumOrder: number;
  description: string;
  active?: boolean;
}

export interface CustomerReview {
  id: string;
  productId?: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  productName: string;
  verifiedPurchase: boolean;
}

export type Language = 'bn' | 'en';
