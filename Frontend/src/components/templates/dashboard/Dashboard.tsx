import { motion } from 'framer-motion';
import { FiShoppingBag, FiUsers, FiPackage, FiDollarSign, FiTag, FiChevronLeft, FiChevronRight, FiStar, FiClock } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useRef, useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import type { ApexOptions } from "apexcharts";
import ImportedURL from "../../../common/urls";

interface StatCard {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
}
interface TopProduct {
  id: number;
  name: string;
  pcs: number;
  price: string;
  thumbnail: string;
  rating: number;
}
interface CategoryRevenue {
  name: string;
  revenue: number;
  orderCount: number;
  _id: string;
}

interface Coupon {
  _id: string;
  code: string;
  discountType: string;
  discountValue: number;
  endDate: string;
  status?: boolean;
}
const customerColors = [
  "from-amber-50 to-orange-50",   // warm yellow-orange
  "from-pink-50 to-rose-50",      // warm pink-red
  "from-emerald-50 to-green-50",  // natural green
  "from-sky-50 to-blue-50",       // cool blue
  "from-violet-50 to-purple-50",  // rich purple
];

const avatarColors = [
  { border: "border-amber-500",   text: "text-amber-500",   bg: "bg-amber-100" },
  { border: "border-pink-500",    text: "text-pink-500",    bg: "bg-pink-100" },
  { border: "border-emerald-500", text: "text-emerald-500", bg: "bg-emerald-100" },
  { border: "border-sky-500",     text: "text-sky-500",     bg: "bg-sky-100" },
  { border: "border-violet-500",  text: "text-violet-500",  bg: "bg-violet-100" },
];
 const accents = [
        { bar: "bg-indigo-500", icon: "bg-indigo-50 text-indigo-600", pill: "bg-indigo-50 text-indigo-700" },
        { bar: "bg-emerald-500", icon: "bg-emerald-50 text-emerald-600", pill: "bg-emerald-50 text-emerald-700" },
        { bar: "bg-amber-500",  icon: "bg-amber-50 text-amber-600",   pill: "bg-amber-50 text-amber-700"   },
        { bar: "bg-rose-500", icon: "bg-rose-50 text-rose-600", pill: "bg-rose-50 text-rose-700" },
      ];
const statusColors: any = {
                      delivered: "text-green-600 bg-green-50",
                      shipped: "text-blue-600 bg-blue-50",
                      processing: "text-amber-600 bg-amber-50",
                      pending: "text-red-600 bg-red-50",
                    };


const Dashboard = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [deptView, setDeptView] = useState<'monthly' | 'quarterly' | 'yearly'>('monthly');
  const [dashboardStats, setDashboardStats] = useState({
    revenue: 0, orders: 0, products: 0, customers: 0,
  });
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [frequentCustomers, setFrequentCustomers] = useState<any[]>([]);
  const [offers, setOffers] = useState<Coupon[]>([]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [salesSeries, setSalesSeries] = useState<any[]>([]);
const [salesCategories, setSalesCategories] = useState<string[]>([]);

  const [orderStatus, setOrderStatus] = useState({
  pending: 0,
  processing: 0,
  shipped: 0,
  delivered: 0,
});
const [salesSummary, setSalesSummary] = useState({
  bestMonth: "",
  bestRevenue: 0,
  avgOrderValue: 0,
  growthPercent: 0,
});
const [categoryRevenue, setCategoryRevenue] = useState<CategoryRevenue[]>([]);
const [isLoadingChart, setIsLoadingChart] = useState(true);
  useEffect(() => {
    fetchDashboardStats();
    fetchCategoryRevenue(); 
  }, []);

  // Stats data
  const stats: StatCard[] = [
    {
      title: 'Total Revenue',
      value: `$${dashboardStats.revenue.toLocaleString()}`,
      subtitle: 'Last 30 days',
      icon: <FiDollarSign className="text-emerald-500" size={24} />
    },
    {
      title: 'Total Order',
      value: dashboardStats.orders.toString(),
      subtitle: 'Last 30 days',
      icon: <FiShoppingBag className="text-blue-500" size={24} />
    },
    {
      title: 'Total Product',
      value: dashboardStats.products.toString(),
      subtitle: 'Last 30 days',
      icon: <FiPackage className="text-amber-500" size={24} />
    },
    {
      title: 'Total Customer',
      value: dashboardStats.customers.toString(),
      subtitle: 'Last 30 days',
      icon: <FiUsers className="text-purple-500" size={24} />
    },
  ];


const salesOptions: ApexOptions = {
  chart: {
    height: 300,
    type: "rangeArea",
    toolbar: {
      show: false,
    },
    zoom: {
      enabled: false,
    },
  },

  colors: ["#4f46e5", "#a855f7", "#4f46e5", "#a855f7"],

  dataLabels: {
    enabled: false,
  },

  fill: {
    opacity: [0.15, 0.15, 1, 1],
  },

  stroke: {
    curve: "smooth",
    width: [0, 0, 3, 3],
  },

  grid: {
    borderColor: "#f3f4f6",
    strokeDashArray: 4,
  },

  legend: {
    show: true,
    position: "top",
    horizontalAlign: "left",
  },

  xaxis: {
    categories: salesCategories,

    labels: {
      style: {
        colors: "#9ca3af",
        fontSize: "11px",
      },
    },
  },

  yaxis: {
    labels: {
      formatter: (value: number) => {
        return value.toFixed(0);
      },
      style: {
        colors: "#9ca3af",
        fontSize: "11px",
      },
    },
  },

  tooltip: {
    shared: true,
    intersect: false,

    y: {
      formatter: (value: number) => `$${value}`,
    },
  },
};

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 320;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };
const fetchCategoryRevenue = async () => {
  try {
    setIsLoadingChart(true);
    
    // FIRST: Fetch all main categories
    const categoriesRes = await fetch(`${ImportedURL.API.listMainCategory}?limit=100&page=1`);
    const categoriesData = await categoriesRes.json();
    
    // Create category ID to name mapping
    const categoryNameMap: { [key: string]: string } = {};
    categoriesData?.data?.forEach((category: any) => {
     
      categoryNameMap[category._id.toString()] = category.name;
    });
    
    // SECOND: Fetch all products to get their mainCategoryId
    const productsRes = await fetch(`${ImportedURL.API.listProduct}?limit=1000&page=1`);
    const productsData = await productsRes.json();
    
    // Create product ID to category name mapping
    const productCategoryMap: { [key: string]: string } = {};
    
   productsData?.data?.forEach((product: any) => {
  console.log("FULL PRODUCT", product);

  const categoryId = product.mainCategoryId?._id?.toString();

  console.log("MAIN CATEGORY ID", categoryId);

  if (categoryId && categoryNameMap[categoryId]) {
    productCategoryMap[product._id] = categoryNameMap[categoryId];
  } else {
    productCategoryMap[product._id] = "Uncategorized";
  }
});
    
    // THIRD: Fetch all orders
    const ordersRes = await fetch(`${ImportedURL.API.listOrder}?limit=1000&page=1`);
    const ordersData = await ordersRes.json();
    
    // Initialize revenue map with all categories
    const revenueMap: { [key: string]: number } = {};
    const orderCountMap: { [key: string]: number } = {};
    
    // Initialize all categories with 0
    categoriesData?.data?.forEach((category: any) => {
      revenueMap[category.name] = 0;
      orderCountMap[category.name] = 0;
    });
   
    
    // Process orders - use product mapping to get category
    ordersData?.data?.forEach((order: any) => {
      order.products?.forEach((product: any) => {
        const productId =
  product.productId?._id?.toString() ||
  product.productId?.toString() ||
  product._id?.toString();
     console.log("PRODUCT CATEGORY MAP", productCategoryMap);
    console.log("ORDER PRODUCT ID", productId);
    console.log("CATEGORY FOUND", productCategoryMap[productId]);
        const quantity = product.quantity || 1;
        // Use the price from order product (it's the price at time of purchase)
        const price = product.price || 0;
        const amount = price * quantity;
        
        // Get category name from our product mapping
        let categoryName = productCategoryMap[productId];
        
        if (!categoryName) {
  return; // skip uncategorized products
}
        
        // Add to revenue
        if (revenueMap[categoryName] !== undefined) {
          revenueMap[categoryName] += amount;
          orderCountMap[categoryName] += quantity;
        } else {
          revenueMap[categoryName] = (revenueMap[categoryName] || 0) + amount;
          orderCountMap[categoryName] = (orderCountMap[categoryName] || 0) + quantity;
        }
      });
    });
    
    // Convert to array format for chart
    const revenueArray = Object.entries(revenueMap)
  .filter(([_, revenue]) => revenue > 0)
  .map(([name, revenue]) => ({
    name,
    revenue,
    orderCount: orderCountMap[name] || 0,
    _id: name
  }));
    
    // Sort by revenue (highest first)
    revenueArray.sort((a, b) => b.revenue - a.revenue);
    
    console.log("Category Revenue Breakdown:", revenueArray);
    
    setCategoryRevenue(revenueArray);
    setIsLoadingChart(false);
  } catch (error) {
    console.error("Error fetching category revenue:", error);
    setIsLoadingChart(false);
  }
};
  const fetchDashboardStats = async () => {
    try {
      const [productsRes, ordersRes, couponRes] = await Promise.all([
        
        fetch(`${ImportedURL.API.listProduct}?limit=5000&page=1`), 
        fetch(`${ImportedURL.API.listOrder}?limit=5000&page=1`), 
        fetch(`${ImportedURL.API.listCoupon}?limit=5000&page=1`), 
        
      ]);

      const productsData = await productsRes.json();
      const ordersData = await ordersRes.json();
      const couponData = await couponRes.json();


      // Example calculations
      const productImageMap: any = {};

productsData?.data?.forEach((product: any) => {
  productImageMap[product._id] =
    product.thumbnail || product.image || '';
});
      const statusCount = {
  pending: 0,
  processing: 0,
  shipped: 0,
  delivered: 0,
};

ordersData?.data?.forEach((order: any) => {
  const status = (order.orderStatus || "").toLowerCase();
if (status in statusCount) {
  statusCount[status as keyof typeof statusCount]++;
}
});
      const productMap: any = {};

ordersData?.data?.forEach((order: any) => {
  order.products?.forEach((item: any) => {
    const productId = item.productId || item._id;

    if (!productMap[productId]) {
      productMap[productId] = {
        id: productId,
        name: item.productName,
        pcs: 0,
        price: item.price || 0,
       thumbnail: productImageMap[productId] || '',
        rating: item.rating || 4.5,
      };
    }

    productMap[productId].pcs += item.quantity || 1;
  });
});
// ===== SALES ANALYTICS =====
const totalProducts = productsData?.data?.length || 0;

const totalOrders = ordersData?.data?.length || 0;

const totalRevenue =
  ordersData?.data?.reduce(
    (sum: number, order: any) => sum + (order.totalAmount || 0),
    0
  ) || 0;

  // ===== SALES ANALYTICS =====


const currentYear = new Date().getFullYear();
const previousYear = currentYear - 1;

const months = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

// CY data
const currentYearMonthly: Record<string, number[]> = {};

// PY data
const previousYearMonthly: Record<string, number[]> = {};

months.forEach((month) => {
  currentYearMonthly[month] = [];
  previousYearMonthly[month] = [];
});

// Split orders into CY and PY
ordersData?.data?.forEach((order: any) => {
  const date = new Date(order.createdAt);

  const year = date.getFullYear();

  const month = date.toLocaleString("default", {
    month: "short",
  });

  const amount = order.totalAmount || 0;

  if (year === currentYear) {
    currentYearMonthly[month]?.push(amount);
  }

  if (year === previousYear) {
    previousYearMonthly[month]?.push(amount);
  }
});

// ===== BEST MONTH =====

let bestMonth = "";
let bestRevenue = 0;

months.forEach((month) => {
  const highestOrder = currentYearMonthly[month].length
  ? Math.max(...currentYearMonthly[month])
  : 0;

if (highestOrder > bestRevenue) {
  bestRevenue = highestOrder;
  bestMonth = month;
}
});

// ===== AVG ORDER =====

const avgOrderValue =
  totalOrders > 0
    ? Math.round(totalRevenue / totalOrders)
    : 0;

// ===== YEAR REVENUE =====

const currentYearRevenue = ordersData?.data
  ?.filter((order: any) => {
    return (
      new Date(order.createdAt).getFullYear() === currentYear
    );
  })
  .reduce(
    (sum: number, order: any) =>
      sum + (order.totalAmount || 0),
    0
  );

const previousYearRevenue = ordersData?.data
  ?.filter((order: any) => {
    return (
      new Date(order.createdAt).getFullYear() === previousYear
    );
  })
  .reduce(
    (sum: number, order: any) =>
      sum + (order.totalAmount || 0),
    0
  );

// ===== GROWTH =====

const growthPercent =
  previousYearRevenue > 0
    ? Math.round(
        ((currentYearRevenue - previousYearRevenue) /
          previousYearRevenue) *
          100
      )
    : 0;

// ===== CY RANGE =====

const cyRange = months.map((month) => {
  const values = currentYearMonthly[month];

  if (!values.length) {
    return {
      x: month,
      y: [0, 0],
    };
  }

  return {
    x: month,
    y: [Math.min(...values), Math.max(...values)],
  };
});

// ===== CY MEDIAN =====

const cyMedian = months.map((month) => {
  const values = currentYearMonthly[month];

  if (!values.length) {
    return {
      x: month,
      y: 0,
    };
  }

  return {
    x: month,
    y: Math.round(
      values.reduce((sum, val) => sum + val, 0) /
        values.length
    ),
  };
});

// ===== PY RANGE =====

const pyRange = months.map((month) => {
  const values = previousYearMonthly[month];

  if (!values.length) {
    return {
      x: month,
      y: [0, 0],
    };
  }

  return {
    x: month,
    y: [Math.min(...values), Math.max(...values)],
  };
});

// ===== PY MEDIAN =====

const pyMedian = months.map((month) => {
  const values = previousYearMonthly[month];

  if (!values.length) {
    return {
      x: month,
      y: 0,
    };
  }

  return {
    x: month,
    y: Math.round(
      values.reduce((sum, val) => sum + val, 0) /
        values.length
    ),
  };
});

setSalesCategories(months);

setSalesSeries([
  {
    type: "rangeArea",
    name: "CY Range",
    data: cyRange,
  },
  {
    type: "rangeArea",
    name: "PY Range",
    data: pyRange,
  },
  {
    type: "line",
    name: "CY Median",
    data: cyMedian,
  },
  {
    type: "line",
    name: "PY Median",
    data: pyMedian,
  },
]);

const sortedTopProducts = Object.values(productMap)
  .sort((a: any, b: any) => b.pcs - a.pcs)
  .slice(0, 5);
     

        const sortedCoupon = couponData?.data
  ?.sort((a: any, b: any) =>
    new Date(a.endDate).getTime() - new Date(b.endDate).getTime()
  )
  .slice(0, 4);

      const uniqueCustomers = new Set(
        ordersData?.data?.map((order: any) => order.customerId)
      ).size;
      // Frequent Customers Calculation
      const customerMap: any = {};

      ordersData?.data?.forEach((order: any) => {
        const customerId = order.customerId;

        if (!customerMap[customerId]) {
          customerMap[customerId] = {
            name: order.customerName || "Unknown Customer",
            orders: 0,
            spent: 0,
          };
        }

        customerMap[customerId].orders += 1;
        customerMap[customerId].spent += order.totalAmount || 0;
      });
  

      // Convert object → array
      const sortedCustomers = Object.values(customerMap)
        .sort((a: any, b: any) => {
          if (b.orders === a.orders) {
            return b.spent - a.spent;
          }

          return b.orders - a.orders;
        })
        .slice(0, 5);

      setFrequentCustomers(sortedCustomers);
      setOffers(sortedCoupon || []);
      setTopProducts(sortedTopProducts);
      setSalesSummary({
  bestMonth,
  bestRevenue,
  avgOrderValue,
  growthPercent,
});
      setOrderStatus(statusCount);
      setRecentOrders(ordersData?.data?.slice(0, 5) || []);
      setDashboardStats({
        revenue: totalRevenue,
        orders: totalOrders,
        products: totalProducts,
        customers: uniqueCustomers,
      });
    } catch (error) {
      console.error("Dashboard stats fetch error:", error);
    }

  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      {/* Main Content */}
      <div className="flex-1 overflow-x-hidden">
        <main className="p-6 max-w-[1600px] mx-auto">
          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                    <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                    <p className="text-xs text-gray-400 mt-1">{stat.subtitle}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-gray-50">
                    {stat.icon}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Row 1: Sales Analytics (Left) + Sales Target (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Sales Analytics - LEFT */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-800">Sales Analytics</h2>
              </div>

              {/* Range Area Chart */}
              <div className="mb-4">
                <ReactApexChart
  options={salesOptions}
  series={salesSeries}
  type="rangeArea"
  height={280}
/>

{/* Monthly Summary Cards */}
<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5">

  {/* Best Month */}
  <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 border border-indigo-100 rounded-2xl p-4">
    <p className="text-xs font-medium text-gray-500 mb-1">
      Best Month
    </p>

    <h3 className="text-2xl font-bold text-indigo-600">
      {salesSummary.bestMonth || "N/A"}
    </h3>

    <p className="text-sm text-gray-400 mt-1">
      ${salesSummary.bestRevenue.toLocaleString()} Revenue
    </p>
  </div>

  {/* Average Order */}
  <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-100 rounded-2xl p-4">
    <p className="text-xs font-medium text-gray-500 mb-1">
      Avg Order Value
    </p>

    <h3 className="text-2xl font-bold text-emerald-600">
      ${salesSummary.avgOrderValue}
    </h3>

    <p className="text-sm text-gray-400 mt-1">
      Per Order
    </p>
  </div>

  {/* Growth */}
  <div className="bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-100 rounded-2xl p-4">
    <p className="text-xs font-medium text-gray-500 mb-1">
      Sales Growth
    </p>

    <h3 className="text-2xl font-bold text-amber-600">
  {salesSummary.growthPercent > 100
    ? `${(salesSummary.growthPercent / 100 + 1).toFixed(1)}x Growth`
    : salesSummary.growthPercent >= 0
    ? `↑ ${salesSummary.growthPercent}%`
    : `↓ ${Math.abs(salesSummary.growthPercent)}%`}
</h3>

    <p className="text-sm text-gray-400 mt-1">
      Compared to PY
    </p>
  </div>

</div>
              </div>



            </motion.div>

            {/* Sales Target - RIGHT */}

            <motion.div
  initial={{ opacity: 0, x: 20 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.5, delay: 0.2 }}
  className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
>
  <div className="flex justify-between items-center mb-4">
    <h2 className="text-lg font-bold text-gray-800">
      Order Status Analytics
    </h2>
  </div>

  <ReactApexChart
    options={{
      labels: ["Pending", "Processing", "Shipped", "Delivered"],
      colors: ["#ef4444", "#f59e0b", "#3b82f6", "#10b981"],
      legend: {
        position: "bottom",
      },
      dataLabels: {
        enabled: true,
      },
      tooltip: {
        y: {
          formatter: (val: number) => `${val} orders`,
        },
      },
    }}
    series={[
      orderStatus.pending,
      orderStatus.processing,
      orderStatus.shipped,
      orderStatus.delivered,
    ]}
    type="donut"
    height={300}
  />

  {/* Small summary cards */}
  <div className="grid grid-cols-2 gap-3 mt-4">
    <div className="bg-red-50 p-2 rounded-lg text-center">
      <p className="text-xs text-gray-500">Pending</p>
      <p className="font-bold text-red-600">{orderStatus.pending}</p>
    </div>

    <div className="bg-amber-50 p-2 rounded-lg text-center">
      <p className="text-xs text-gray-500">Processing</p>
      <p className="font-bold text-amber-600">{orderStatus.processing}</p>
    </div>

    <div className="bg-blue-50 p-2 rounded-lg text-center">
      <p className="text-xs text-gray-500">Shipped</p>
      <p className="font-bold text-blue-600">{orderStatus.shipped}</p>
    </div>

    <div className="bg-emerald-50 p-2 rounded-lg text-center">
      <p className="text-xs text-gray-500">Delivered</p>
      <p className="font-bold text-emerald-600">{orderStatus.delivered}</p>
    </div>
  </div>
</motion.div>

          </div>

          {/* /* Row 2: departments */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">

            {/* Frequent Customers - LEFT */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 lg:col-span-1"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-gray-800">
                  Top #5 Customers
                </h2>
              </div>

              <div className="space-y-4">
                {frequentCustomers.map((customer, idx) => (
                  
                  <div
                    key={idx}
                    className={`flex items-center justify-between p-4 rounded-xl bg-gradient-to-r ${customerColors[idx]} hover:shadow-md transition`}
                  >
                    <div className="flex items-center gap-3">

                      {/* Circle Avatar */}
                     <div
  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold border-2 bg-white 
  ${avatarColors[idx % avatarColors.length].border}
  ${avatarColors[idx % avatarColors.length].text}`}
>
  {customer.name.charAt(0).toUpperCase()}
</div>

                      <div>
                        <h3 className="font-semibold text-gray-800">
                          {customer.name}
                        </h3>

                        <p className={`text-sm font-medium px-2 py-0.5 rounded-full 
  ${avatarColors[idx % avatarColors.length].bg} 
  ${avatarColors[idx % avatarColors.length].text}`}>
  {customer.orders} Orders
</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className={`font-bold ${avatarColors[idx % avatarColors.length].text}`}>
                        ${customer.spent.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Department Sales - RIGHT */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 lg:col-span-2"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
                <h2 className="text-lg font-bold text-gray-800">
                  Category Insights
                </h2>

                
              </div>
{isLoadingChart ? (
  <div className="flex justify-center items-center h-[280px]">
    <div className="animate-pulse text-gray-400">Loading chart data...</div>
  </div>
) : (
  <>
   <ReactApexChart
  key={deptView}
  options={{
    chart: {
      type: 'bar',
      height: 280,
      toolbar: { show: false },
    },

    colors: [
      '#A05AFF',
      '#1BCFB4',
      '#FE9496',
      '#f59e0b',
      '#3b82f6',
      '#ef4444',
      '#10b981',
      '#8b5cf6'
    ],

    xaxis: {
      categories: categoryRevenue.map(cat => cat.name),
      labels: {
        rotate: -45,
        style: {
          fontSize: '11px'
        }
      }
    },

    yaxis: {
      title: {
        text: 'Revenue ($)'
      },
      labels: {
        formatter: (value: number) => `$${value.toLocaleString()}`
      }
    },

    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: false,
        distributed: true, // different color per bar
      }
    },

    tooltip: {
      y: {
        formatter: (value: number) => `$${value.toLocaleString()}`
      }
    }
  }}

  series={[{
    name: 'Revenue',
    data: categoryRevenue.map(cat => cat.revenue)
  }]}

  type="bar"
  height={280}
/>

    {/* Category Summary Cards */}
    {categoryRevenue.length > 0 && (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-5">
        {categoryRevenue.map((category, idx) => (
          <div
            key={category.name}
            className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-3 border border-gray-200"
          >
            <div className="flex items-center gap-2 mb-2">
              <div 
                className="w-2 h-2 rounded-full" 
                style={{ 
                  backgroundColor: ['#A05AFF', '#1BCFB4', '#FE9496', '#f59e0b', '#3b82f6', '#ef4444', '#10b981', '#8b5cf6'][idx % 8]
                }}
              />
              <p className="text-xs font-medium text-gray-500 truncate">{category.name}</p>
            </div>
            <p className="text-lg font-bold text-gray-800">${category.revenue.toLocaleString()}</p>
            <p className="text-xs text-gray-400 mt-1">{category.orderCount} items sold</p>
          </div>
        ))}
      </div>
    )}
  </>
)}
            </motion.div>

          </div>

          {/* Row 3: Top Selling Products  */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Top Selling Products (LEFT) */}

            <div className="lg:col-span-2">
              {/* Top Selling Products content */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-white rounded-xl p-8 shadow-sm border border-gray-100"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-800">Top Selling Products</h2>
                  <Link to="/products" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">View All →</Link>
                </div>

                {/* Horizontal Scroll Product Cards */}
                <div className="relative">
                  {/* Scroll Buttons */}
                  <button
                    onClick={() => scroll('left')}
                    className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition border border-gray-200"
                  >
                    <FiChevronLeft size={20} className="text-gray-600" />
                  </button>
                  <button
                    onClick={() => scroll('right')}
                    className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition border border-gray-200"
                  >
                    <FiChevronRight size={20} className="text-gray-600" />
                  </button>

                  {/* Scrollable Container */}
                  <div
                    ref={scrollContainerRef}
                    className="flex gap-5 overflow-x-auto scrollbar-hide pb-4 px-2"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                  >
                    {topProducts.map((product, idx) => (
                      <motion.div
                        key={product.id}
                        whileHover={{ y: -5 }}
                        className="min-w-[260px] bg-gray-50 rounded-xl overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
                      >
                        {/* Product Image */}
                        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
<img
  src={`${ImportedURL.FILEURL.replace(/\/$/, "")}${product.thumbnail}`}
  alt={product.name}
  className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
/>
                          <div className="absolute top-3 left-3 bg-amber-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                            #{idx + 1} Top
                          </div>
                          <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-semibold">
                            {product.pcs.toLocaleString()} Pcs
                          </div>
                        </div>

                        {/* Product Info */}
                        <div className="p-4">
                          <div className="flex items-center gap-1 mb-2">
                            <FiStar className="text-amber-400 fill-amber-400" size={14} />
                            <span className="text-sm font-medium">{product.rating}</span>
                            <span className="text-xs text-gray-400">(2.3k reviews)</span>
                          </div>
                         <div className="flex justify-between items-center mb-1">
  <h3 className="font-bold text-gray-800 text-lg">
    {product.name}
  </h3>

  <span className="font-bold text-indigo-600 text-lg">
    ${product.price}
  </span>
</div>
                          
                            
                          </div>
                        
                      </motion.div>
                    ))}
                  </div>
                </div>


              </motion.div>
            </div>

            {/* Current Offers (RIGHT) */}
{/* Current Offers (RIGHT) */}
<motion.div
  initial={{ opacity: 0, x: 20 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.5, delay: 0.3 }}
  className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
>
  <div className="flex justify-between items-center mb-5">
    <h2 className="text-base font-semibold text-gray-800">Current Coupons</h2>
    <Link to="/coupon" className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">
      View All →
    </Link>
  </div>

  <div className="flex flex-col gap-3">
    {offers.map((coupon, idx) => (
  <div
    key={coupon._id}
    className="relative flex items-center gap-3 p-3.5 rounded-xl border border-gray-100 hover:border-gray-200 transition overflow-hidden"
  >
    {/* Left accent bar */}
    <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-xl ${accents[idx % accents.length].bar}`} />

    {/* Icon */}
    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${accents[idx % accents.length].icon}`}>
      <FiTag size={17} />
    </div>

    {/* Content */}
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-sm font-medium tracking-wide border border-dashed border-gray-300 bg-gray-50 px-2 py-0.5 rounded-md">
          {coupon.code}
        </span>

        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${accents[idx % accents.length].pill}`}>
          {coupon.discountType === "percentage"
            ? `${coupon.discountValue}% OFF`
            : `$${coupon.discountValue} OFF`}
        </span>
      </div>

      <div className="flex items-center gap-1 mt-1.5">
        <FiClock size={11} className="text-gray-400" />
        <span className="text-xs text-gray-400">
          Expires {new Date(coupon.endDate).toLocaleDateString()}
        </span>
      </div>
    </div>
  </div>
))}
    
    
  </div>
</motion.div>

          </div>
          {/* Recent Orders Table */}
          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Recent Orders</h3>
              <Link to="/orders" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">View All Orders →</Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 rounded-xl">
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Order ID</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody>
  {recentOrders.map((order, idx) => (
    <motion.tr
      key={order._id}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: idx * 0.05 }}
      className="border-b border-gray-100 bg-white transition cursor-pointer"
    >
      <td className="py-3 px-4 text-sm font-medium text-gray-800">
        #{order._id?.slice(-6).toUpperCase()}
      </td>

      <td className="py-3 px-4 text-sm text-gray-600">
        {order.customerName || "Unknown"}
      </td>

      <td className="py-3 px-4 text-sm text-gray-600">
        {order.products?.[0]?.productName || "Product"}
      </td>

      <td className="py-3 px-4 text-sm text-gray-500">
        {new Date(order.createdAt).toLocaleDateString()}
      </td>

      <td className="py-3 px-4 text-sm font-semibold text-gray-800">
        ${order.totalAmount || 0}
      </td>

      <td className="py-3 px-4">
        <span
          className={`text-xs px-2 py-1 rounded-full ${
            statusColors[order.orderStatus?.toLowerCase()] ||
            "text-gray-600 bg-gray-100"
          }`}
        >
          {order.orderStatus || "Pending"}
        </span>
      </td>
    </motion.tr>
  ))}
</tbody>
              </table>
            </div>
          </div>

        </main>
      </div>

      {/* Hide scrollbar styles */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
