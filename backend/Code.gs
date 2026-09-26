/**
 * Upohar Bitan - Google Apps Script Backend (Code.gs)
 * 
 * Connected Google Sheets Database URL:
 * https://docs.google.com/spreadsheets/d/1N0jsosWpH5kReLLK_KWuIxN6jXlL0QthUMCbz-S5F7I/edit?usp=sharing
 * 
 * Web App URL:
 * https://script.google.com/macros/s/AKfycbyeHn7M6aga2tCnG1NiKfszntKkLuk4Bb-Ca8l1jVB3ZeUFYW_FGoQeMYsxyYk7mh-9/exec
 */

var SPREADSHEET_ID = '1N0jsosWpH5kReLLK_KWuIxN6jXlL0QthUMCbz-S5F7I';
var SPREADSHEET_URL = 'https://docs.google.com/spreadsheets/d/1N0jsosWpH5kReLLK_KWuIxN6jXlL0QthUMCbz-S5F7I/edit?usp=sharing';

function getSpreadsheet() {
  try {
    if (SPREADSHEET_ID && SPREADSHEET_ID.trim() !== '') {
      return SpreadsheetApp.openById(SPREADSHEET_ID.trim());
    }
  } catch (err) {
    Logger.log('Could not open spreadsheet by ID: ' + err);
  }
  return SpreadsheetApp.getActiveSpreadsheet();
}

// Global sheet names
var SHEETS = {
  PRODUCTS: 'Products',
  ORDERS: 'Orders',
  CUSTOMERS: 'Customers',
  SETTINGS: 'Settings',
  ADMIN: 'Admin',
  CONTENT: 'Content',
  FAQ: 'FAQ',
  CATEGORIES: 'Categories',
  COUPONS: 'Coupons'
};

/**
 * Automatically sets up the required sheets with headers and default values.
 * Run this function once from the Apps Script editor to initialize your database!
 */
function setupDatabase() {
  var ss = getSpreadsheet();

  // 1. Products Sheet
  var productSheet = getOrCreateSheet(ss, SHEETS.PRODUCTS);
  var productHeaders = [
    'Product_ID', 'Product_Name', 'Category', 'Short_Description', 'Description',
    'Price', 'Discount_Price', 'Stock', 'SKU', 'Images',
    'Material', 'Size', 'Color', 'Rating', 'Status', 'Created_Date'
  ];
  setSheetHeaders(productSheet, productHeaders);

  // 2. Orders Sheet
  var orderSheet = getOrCreateSheet(ss, SHEETS.ORDERS);
  var orderHeaders = [
    'Order_ID', 'Customer_Name', 'Phone', 'Email', 'Address',
    'Product_ID', 'Product_Name', 'Quantity', 'Total_Price',
    'Payment_Method', 'Order_Status', 'Order_Date'
  ];
  setSheetHeaders(orderSheet, orderHeaders);

  // 3. Customers Sheet
  var customerSheet = getOrCreateSheet(ss, SHEETS.CUSTOMERS);
  var customerHeaders = [
    'Customer_ID', 'Name', 'Phone', 'Email', 'Address', 'Registration_Date'
  ];
  setSheetHeaders(customerSheet, customerHeaders);

  // 4. Settings Sheet
  var settingsSheet = getOrCreateSheet(ss, SHEETS.SETTINGS);
  var settingsHeaders = ['Setting_Name', 'Setting_Value'];
  setSheetHeaders(settingsSheet, settingsHeaders);

  // Seed default settings if empty
  if (settingsSheet.getLastRow() <= 1) {
    var defaultSettings = [
      ['Store_Name', 'Aura Tableware & Crockery'],
      ['Store_Phone', '+880 1712 345678'],
      ['WhatsApp_Number', '+880 1712 345678'],
      ['Store_Email', 'concierge@auratableware.com'],
      ['Delivery_Charge_Inside', '80'],
      ['Delivery_Charge_Outside', '150'],
      ['Free_Delivery_Threshold', '5000'],
      ['Bkash_Number', '01712-345678'],
      ['Nagad_Number', '01812-987654'],
      ['Currency', 'BDT']
    ];
    settingsSheet.getRange(2, 1, defaultSettings.length, 2).setValues(defaultSettings);
  }

  // 5. Content Sheet
  var contentSheet = getOrCreateSheet(ss, SHEETS.CONTENT);
  setSheetHeaders(contentSheet, ['Content_Key', 'Bangla', 'English', 'Updated_At']);
  if (contentSheet.getLastRow() <= 1) {
    contentSheet.getRange(2, 1, 5, 4).setValues([
      ['about', 'উপহার বিতান নীলফামারীর একটি বিশ্বস্ত ক্রোকারিজ ও গিফট সামগ্রীর প্রতিষ্ঠান।', 'Upohar Bitan is a trusted crockery and gift store in Nilphamari.', new Date()],
      ['delivery', 'নীলফামারী ও দেশের অন্যান্য অঞ্চলে ডেলিভারি সুবিধা রয়েছে।', 'Delivery is available in Nilphamari and other regions.', new Date()],
      ['returns', 'ভাঙা, ভুল বা ত্রুটিপূর্ণ পণ্যের ক্ষেত্রে নির্ধারিত নীতিমালা অনুযায়ী রিটার্ন/রিপ্লেসমেন্ট করা হবে।', 'Damaged, incorrect or defective items may be returned/replaced under the policy.', new Date()],
      ['heroSlides', '[]', '[]', new Date()],
      ['storeName', 'উপহার বিতান', 'Upohar Bitan', new Date()]
    ]);
  }

  // 6. FAQ Sheet
  var faqSheet = getOrCreateSheet(ss, SHEETS.FAQ);
  setSheetHeaders(faqSheet, ['FAQ_ID', 'Question_BN', 'Answer_BN', 'Question_EN', 'Answer_EN', 'Active', 'Sort_Order', 'Updated_At']);
  if (faqSheet.getLastRow() <= 1) {
    faqSheet.getRange(2, 1, 5, 8).setValues([
      ['FAQ-1','অর্ডার করার পর কীভাবে নিশ্চিত হব?','অর্ডার সফল হলে একটি Order ID তৈরি হবে।','How do I know my order was placed?','A unique Order ID is generated after successful submission.','TRUE',1,new Date()],
      ['FAQ-2','কত দিনে পণ্য ডেলিভারি হয়?','এলাকা ও পণ্যের ধরন অনুযায়ী সময় ভিন্ন হতে পারে।','How long does delivery take?','Delivery time varies by location and product.','TRUE',2,new Date()],
      ['FAQ-3','ক্যাশ অন ডেলিভারি কি আছে?','হ্যাঁ, Cash on Delivery নির্বাচন করা যায়।','Is Cash on Delivery available?','Yes, Cash on Delivery is available.','TRUE',3,new Date()],
      ['FAQ-4','পণ্য ভাঙা অবস্থায় পৌঁছালে কী করব?','দ্রুত যোগাযোগ করুন এবং ছবি/ভিডিও সংরক্ষণ করুন।','What if an item arrives damaged?','Contact the store promptly and keep photos/videos.','TRUE',4,new Date()],
      ['FAQ-5','Google Drive-এর ছবি ব্যবহার করা যাবে?','হ্যাঁ, Drive link স্বয়ংক্রিয়ভাবে image URL-এ রূপান্তর হবে।','Can Google Drive images be used?','Yes, Drive links are normalized automatically.','TRUE',5,new Date()]
    ]);
  }

  // 8. Categories Sheet
  var categorySheet = getOrCreateSheet(ss, SHEETS.CATEGORIES);
  setSheetHeaders(categorySheet, ['Category_ID','Category_Name','Subcategories','Image_URL','Description','Active','Sort_Order','Updated_At']);
  if (categorySheet.getLastRow() <= 1) {
    categorySheet.getRange(2,1,4,8).setValues([
      ['CAT-1','প্লেট','ডিনার প্লেট,সাইড প্লেট','', 'দৈনন্দিন ও অনুষ্ঠানের প্লেট','TRUE',1,new Date()],
      ['CAT-2','কাপ ও মগ','টি কাপ,কফি মগ','', 'চা ও কফির সামগ্রী','TRUE',2,new Date()],
      ['CAT-3','ডিনার সেট','ডিনার সেট,সার্ভিং সেট','', 'পরিবারের জন্য সেট','TRUE',3,new Date()],
      ['CAT-4','গিফট','গিফট সেট,সাজসজ্জা','', 'উপহার সামগ্রী','TRUE',4,new Date()]
    ]);
  }

  // 9. Coupons Sheet
  var couponSheet = getOrCreateSheet(ss, SHEETS.COUPONS);
  setSheetHeaders(couponSheet, ['Coupon_Code','Discount_Percent','Discount_Amount','Minimum_Order','Description','Active','Updated_At']);
  if (couponSheet.getLastRow() <= 1) {
    couponSheet.getRange(2,1,3,7).setValues([
      ['GOLD10', 10, '', 2000, '10% OFF on orders over ৳2,000', 'TRUE', new Date()],
      ['AURA20', 20, '', 6000, '20% OFF on luxury orders over ৳6,000', 'TRUE', new Date()],
      ['WELCOME500', '', 500, 3500, '৳500 OFF on your first purchase above ৳3,500', 'TRUE', new Date()]
    ]);
  }

  // 10. Admin Sheet
  var adminSheet = getOrCreateSheet(ss, SHEETS.ADMIN);
  var adminHeaders = ['Username', 'Password', 'Role'];
  setSheetHeaders(adminSheet, adminHeaders);

  // Seed default admin if empty
  if (adminSheet.getLastRow() <= 1) {
    adminSheet.appendRow(['admin', 'aura@admin2026', 'SuperAdmin']);
  }

  return 'Database setup completed successfully!';
}

/**
 * Handle GET requests
 * Examples:
 *   ?action=getProducts
 *   ?action=getProductById&id=PRD-101
 *   ?action=getOrders
 *   ?action=getSettings
 *   ?action=getCoupons
 */
function doGet(e) {
  try {
    var action = (e && e.parameter && e.parameter.action) ? e.parameter.action : 'getProducts';
    var response;

    switch (action) {
      case 'getProducts':
        response = getProducts();
        break;
      case 'getProductById':
        var id = e.parameter.id;
        response = getProductById(id);
        break;
      case 'getOrders':
        response = getOrders();
        break;
      case 'getSettings':
        response = getSettings();
        break;
      case 'getCoupons':
        response = getCoupons();
        break;
      case 'bootstrap':
        response = bootstrap();
        break;
      case 'getContent':
        response = getContent();
        break;
      case 'getFAQ':
        response = getFAQ();
        break;
      case 'ping':
        response = { success: true, message: 'Google Apps Script Web App connected successfully!', timestamp: new Date().toISOString() };
        break;
      default:
        response = { success: false, message: 'Invalid action: ' + action };
    }

    return createJsonResponse(response);
  } catch (err) {
    return createJsonResponse({ success: false, message: err.toString() });
  }
}

/**
 * Handle POST requests
 * Expected JSON payload:
 * { action: "addProduct"|"updateProduct"|"deleteProduct"|"createOrder"|"updateOrderStatus"|"updateSettings", data: {...} }
 */
function doPost(e) {
  try {
    var requestBody = {};
    if (e && e.postData && e.postData.contents) {
      requestBody = JSON.parse(e.postData.contents);
    }

    var action = requestBody.action;
    var data = requestBody.data || {};
    var response;

    switch (action) {
      case 'addProduct':
        response = addProduct(data);
        break;
      case 'updateProduct':
        response = updateProduct(data);
        break;
      case 'deleteProduct':
        response = deleteProduct(data.id || data.Product_ID);
        break;
      case 'createOrder':
        response = createOrder(data);
        break;
      case 'updateOrderStatus':
        response = updateOrderStatus(data.orderId, data.status);
        break;
      case 'updateSettings':
        response = updateSettings(data);
        break;
      case 'updateContent':
        response = updateContent(data);
        break;
      case 'saveFAQ':
        response = saveFAQ(data);
        break;
      case 'saveCoupons':
        response = saveCoupons(data);
        break;
      case 'syncAll':
        response = syncAll(data);
        break;
      default:
        response = { success: false, message: 'Unknown POST action: ' + action };
    }

    return createJsonResponse(response);
  } catch (err) {
    return createJsonResponse({ success: false, message: err.toString() });
  }
}

/**
 * Fetch all products from Products sheet
 */
function getProducts() {
  var sheet = getSpreadsheet().getSheetByName(SHEETS.PRODUCTS);
  if (!sheet) return { success: false, message: 'Products sheet not found. Run setupDatabase() first.' };

  var data = sheet.getDataRange().getValues();
  if (data.length <= 1) return { success: true, data: [] };

  var headers = data[0];
  var products = [];

  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var item = {};
    for (var h = 0; h < headers.length; h++) {
      var headerKey = headers[h];
      item[headerKey] = row[h];
    }
    products.push(item);
  }

  return { success: true, message: 'Products fetched successfully', data: products };
}

/**
 * Fetch a single product by Product_ID
 */
function getProductById(id) {
  var sheet = getSpreadsheet().getSheetByName(SHEETS.PRODUCTS);
  if (!sheet) return { success: false, message: 'Products sheet not found' };

  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var idCol = headers.indexOf('Product_ID');

  for (var i = 1; i < data.length; i++) {
    if (String(data[i][idCol]) === String(id)) {
      var item = {};
      for (var h = 0; h < headers.length; h++) {
        item[headers[h]] = data[i][h];
      }
      return { success: true, message: 'Product found', data: item };
    }
  }

  return { success: false, message: 'Product with ID ' + id + ' not found' };
}

/**
 * Add a new product to the Products sheet
 */
function addProduct(product) {
  var sheet = getSpreadsheet().getSheetByName(SHEETS.PRODUCTS);
  if (!sheet) return { success: false, message: 'Products sheet not found' };

  var newId = product.Product_ID || ('PRD-' + (100 + sheet.getLastRow()));
  var createdDate = new Date().toISOString();

  var row = [
    newId,
    product.Product_Name || '',
    product.Category || 'Plates',
    product.Short_Description || '',
    product.Description || '',
    Number(product.Price || 0),
    product.Discount_Price ? Number(product.Discount_Price) : '',
    Number(product.Stock || 0),
    product.SKU || ('AUR-' + Math.floor(Math.random() * 9000 + 1000)),
    product.Images || '',
    product.Material || 'Porcelain',
    product.Size || '',
    product.Color || '',
    Number(product.Rating || 5),
    product.Status || 'Active',
    createdDate
  ];

  sheet.appendRow(row);
  return { success: true, message: 'Product Added Successfully', data: { id: newId } };
}

/**
 * Update an existing product
 */
function updateProduct(product) {
  var sheet = getSpreadsheet().getSheetByName(SHEETS.PRODUCTS);
  if (!sheet) return { success: false, message: 'Products sheet not found' };

  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var idCol = headers.indexOf('Product_ID');
  var targetId = String(product.Product_ID || product.id);

  for (var i = 1; i < data.length; i++) {
    if (String(data[i][idCol]) === targetId) {
      var rowIndex = i + 1;
      
      // Update cells
      if (product.Product_Name !== undefined) sheet.getRange(rowIndex, headers.indexOf('Product_Name') + 1).setValue(product.Product_Name);
      if (product.Category !== undefined) sheet.getRange(rowIndex, headers.indexOf('Category') + 1).setValue(product.Category);
      if (product.Short_Description !== undefined) sheet.getRange(rowIndex, headers.indexOf('Short_Description') + 1).setValue(product.Short_Description);
      if (product.Description !== undefined) sheet.getRange(rowIndex, headers.indexOf('Description') + 1).setValue(product.Description);
      if (product.Price !== undefined) sheet.getRange(rowIndex, headers.indexOf('Price') + 1).setValue(Number(product.Price));
      if (product.Discount_Price !== undefined) sheet.getRange(rowIndex, headers.indexOf('Discount_Price') + 1).setValue(product.Discount_Price ? Number(product.Discount_Price) : '');
      if (product.Stock !== undefined) sheet.getRange(rowIndex, headers.indexOf('Stock') + 1).setValue(Number(product.Stock));
      if (product.SKU !== undefined) sheet.getRange(rowIndex, headers.indexOf('SKU') + 1).setValue(product.SKU);
      if (product.Images !== undefined) sheet.getRange(rowIndex, headers.indexOf('Images') + 1).setValue(product.Images);
      if (product.Material !== undefined) sheet.getRange(rowIndex, headers.indexOf('Material') + 1).setValue(product.Material);
      if (product.Size !== undefined) sheet.getRange(rowIndex, headers.indexOf('Size') + 1).setValue(product.Size);
      if (product.Color !== undefined) sheet.getRange(rowIndex, headers.indexOf('Color') + 1).setValue(product.Color);
      if (product.Status !== undefined) sheet.getRange(rowIndex, headers.indexOf('Status') + 1).setValue(product.Status);

      return { success: true, message: 'Product updated successfully', data: { id: targetId } };
    }
  }

  return { success: false, message: 'Product not found to update' };
}

/**
 * Delete a product
 */
function deleteProduct(id) {
  var sheet = getSpreadsheet().getSheetByName(SHEETS.PRODUCTS);
  if (!sheet) return { success: false, message: 'Products sheet not found' };

  var data = sheet.getDataRange().getValues();
  var idCol = data[0].indexOf('Product_ID');

  for (var i = 1; i < data.length; i++) {
    if (String(data[i][idCol]) === String(id)) {
      sheet.deleteRow(i + 1);
      return { success: true, message: 'Product deleted successfully', data: { id: id } };
    }
  }

  return { success: false, message: 'Product not found' };
}

/**
 * Create a new order, append to Orders and Customers sheets, and auto-decrement product stock!
 */
function createOrder(order) {
  var ss = getSpreadsheet();
  var orderSheet = ss.getSheetByName(SHEETS.ORDERS);
  var productSheet = ss.getSheetByName(SHEETS.PRODUCTS);
  var customerSheet = ss.getSheetByName(SHEETS.CUSTOMERS);

  if (!orderSheet) return { success: false, message: 'Orders sheet missing' };

  var orderId = order.Order_ID || ('ORD-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000));
  var orderDate = new Date().toISOString();

  // Handle multi-item order or single product order
  var items = order.items || [
    {
      Product_ID: order.Product_ID || '',
      Product_Name: order.Product_Name || '',
      Quantity: order.Quantity || 1,
      Price: order.Total_Price || 0
    }
  ];

  for (var k = 0; k < items.length; k++) {
    var itm = items[k];
    orderSheet.appendRow([
      orderId,
      order.Customer_Name || '',
      order.Phone || '',
      order.Email || '',
      order.Address || '',
      itm.Product_ID || itm.productId || '',
      itm.Product_Name || itm.productName || '',
      itm.Quantity || itm.quantity || 1,
      order.Total_Price || 0,
      order.Payment_Method || 'Cash on Delivery',
      'Pending',
      orderDate
    ]);

    // Auto-decrement product stock
    if (productSheet && (itm.Product_ID || itm.productId)) {
      var prodId = String(itm.Product_ID || itm.productId);
      var pData = productSheet.getDataRange().getValues();
      var pHeaders = pData[0];
      var pIdCol = pHeaders.indexOf('Product_ID');
      var pStockCol = pHeaders.indexOf('Stock');

      if (pIdCol !== -1 && pStockCol !== -1) {
        for (var p = 1; p < pData.length; p++) {
          if (String(pData[p][pIdCol]) === prodId) {
            var currentStock = Number(pData[p][pStockCol]) || 0;
            var deductQty = Number(itm.Quantity || itm.quantity || 1);
            var newStock = Math.max(0, currentStock - deductQty);
            productSheet.getRange(p + 1, pStockCol + 1).setValue(newStock);
            break;
          }
        }
      }
    }
  }

  // Update or insert into Customers sheet
  if (customerSheet && order.Phone) {
    var cData = customerSheet.getDataRange().getValues();
    var phoneCol = cData[0].indexOf('Phone');
    var existingRow = -1;

    for (var c = 1; c < cData.length; c++) {
      if (String(cData[c][phoneCol]) === String(order.Phone)) {
        existingRow = c + 1;
        break;
      }
    }

    if (existingRow === -1) {
      var newCustId = 'CUST-' + (1000 + customerSheet.getLastRow());
      customerSheet.appendRow([
        newCustId,
        order.Customer_Name || '',
        order.Phone || '',
        order.Email || '',
        order.Address || '',
        orderDate
      ]);
    }
  }

  return {
    success: true,
    message: 'Order Placed Successfully',
    data: {
      orderId: orderId,
      orderDate: orderDate,
      totalPrice: order.Total_Price
    }
  };
}

/**
 * Fetch all orders
 */
function getOrders() {
  var sheet = getSpreadsheet().getSheetByName(SHEETS.ORDERS);
  if (!sheet) return { success: false, message: 'Orders sheet missing' };

  var data = sheet.getDataRange().getValues();
  if (data.length <= 1) return { success: true, data: [] };

  var headers = data[0];
  var orders = [];

  for (var i = 1; i < data.length; i++) {
    var item = {};
    for (var h = 0; h < headers.length; h++) {
      item[headers[h]] = data[i][h];
    }
    orders.push(item);
  }

  return { success: true, message: 'Orders retrieved successfully', data: orders };
}

/**
 * Update order status (Pending, Confirmed, Processing, Shipping, Delivered, Cancelled)
 */
function updateOrderStatus(orderId, status) {
  var sheet = getSpreadsheet().getSheetByName(SHEETS.ORDERS);
  if (!sheet) return { success: false, message: 'Orders sheet missing' };

  var data = sheet.getDataRange().getValues();
  var idCol = data[0].indexOf('Order_ID');
  var statusCol = data[0].indexOf('Order_Status');

  var updatedCount = 0;
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][idCol]) === String(orderId)) {
      sheet.getRange(i + 1, statusCol + 1).setValue(status);
      updatedCount++;
    }
  }

  if (updatedCount > 0) {
    return { success: true, message: 'Order status updated to ' + status, data: { orderId: orderId, status: status } };
  }
  return { success: false, message: 'Order ID not found' };
}

/**
 * Get Settings
 */
function getSettings() {
  var sheet = getSpreadsheet().getSheetByName(SHEETS.SETTINGS);
  if (!sheet) return { success: false, message: 'Settings sheet missing' };

  var data = sheet.getDataRange().getValues();
  var settings = {};
  for (var i = 1; i < data.length; i++) {
    settings[data[i][0]] = data[i][1];
  }

  return { success: true, message: 'Settings retrieved', data: settings };
}

/**
 * Update Settings
 */
function updateSettings(settingsData) {
  var sheet = getSpreadsheet().getSheetByName(SHEETS.SETTINGS);
  if (!sheet) return { success: false, message: 'Settings sheet missing' };

  var data = sheet.getDataRange().getValues();
  var existingKeys = {};
  for (var i = 1; i < data.length; i++) {
    existingKeys[data[i][0]] = i + 1; // 1-based row index
  }

  for (var key in settingsData) {
    if (existingKeys[key]) {
      sheet.getRange(existingKeys[key], 2).setValue(settingsData[key]);
    } else {
      sheet.appendRow([key, settingsData[key]]);
    }
  }

  return { success: true, message: 'Settings updated successfully', data: settingsData };
}

// Helper: Ensure sheet exists
function getOrCreateSheet(spreadsheet, sheetName) {
  var sheet = spreadsheet.getSheetByName(sheetName);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(sheetName);
  }
  return sheet;
}

// Helper: Set formatted headers
function setSheetHeaders(sheet, headers) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
    var headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#F4EAD4'); // Soft gold header accent
  }
}

// Helper: Standardized JSON response with CORS
function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function bootstrap() {
  setupDatabase();
  return { success: true, message: 'Bootstrap data ready', data: {
    products: getProducts().data || [],
    settings: getSettings().data || {},
    categories: getCategories().data || [],
    content: getContent().data || {},
    faq: getFAQ().data || [],
    heroSlides: getHeroSlides().data || [],
    coupons: getCoupons().data || []
  }};
}

function getCategories() {
  var sheet = getSpreadsheet().getSheetByName(SHEETS.CATEGORIES);
  if (!sheet) return { success:true, data:[] };
  var rows = sheet.getDataRange().getValues(), out=[];
  for (var i=1;i<rows.length;i++) {
    if (String(rows[i][5]).toLowerCase()==='false') continue;
    out.push({
      id:String(rows[i][0]),
      name:String(rows[i][1]||''),
      subcategories:String(rows[i][2]||'').split(',').map(function(s){return s.trim();}).filter(Boolean),
      image:String(rows[i][3]||''),
      description:String(rows[i][4]||'')
    });
  }
  return {success:true,data:out};
}

function getHeroSlides() {
  var sheet = getSpreadsheet().getSheetByName(SHEETS.CONTENT);
  if (!sheet) return { success:true, data:[] };
  var rows = sheet.getDataRange().getValues();
  for (var i=1;i<rows.length;i++) {
    if (String(rows[i][0]) === 'heroSlides') {
      try { return { success:true, data:JSON.parse(String(rows[i][1] || '[]')) }; }
      catch(e) { return { success:true, data:[] }; }
    }
  }
  return { success:true, data:[] };
}

function getContent() {
  var sheet = getSpreadsheet().getSheetByName(SHEETS.CONTENT);
  if (!sheet) return { success:false, message:'Content sheet missing' };
  var rows = sheet.getDataRange().getValues(); var out = {};
  for (var i=1;i<rows.length;i++) out[String(rows[i][0])] = { bn:String(rows[i][1]||''), en:String(rows[i][2]||'') };
  return { success:true, data:out };
}

function getFAQ() {
  var sheet = getSpreadsheet().getSheetByName(SHEETS.FAQ);
  if (!sheet) return { success:false, message:'FAQ sheet missing' };
  var rows=sheet.getDataRange().getValues(); var out=[];
  for(var i=1;i<rows.length;i++) if(String(rows[i][5]).toLowerCase()!=='false') out.push({id:String(rows[i][0]),questionBn:String(rows[i][1]),answerBn:String(rows[i][2]),questionEn:String(rows[i][3]),answerEn:String(rows[i][4]),active:true,sortOrder:Number(rows[i][6])||i});
  out.sort(function(a,b){return a.sortOrder-b.sortOrder;}); return {success:true,data:out};
}

function getCoupons() {
  var sheet = getSpreadsheet().getSheetByName(SHEETS.COUPONS);
  if (!sheet) return { success: true, data: [] };
  var rows = sheet.getDataRange().getValues(), out = [];
  for (var i = 1; i < rows.length; i++) {
    if (!rows[i][0]) continue;
    out.push({
      code: String(rows[i][0]).toUpperCase(),
      discountPercent: rows[i][1] ? Number(rows[i][1]) : undefined,
      discountAmount: rows[i][2] ? Number(rows[i][2]) : undefined,
      minimumOrder: Number(rows[i][3]) || 0,
      description: String(rows[i][4] || ''),
      active: String(rows[i][5]).toLowerCase() !== 'false'
    });
  }
  return { success: true, data: out };
}

function saveCoupons(couponsList) {
  var sheet = getOrCreateSheet(getSpreadsheet(), SHEETS.COUPONS);
  if (sheet.getLastRow() > 1) {
    sheet.getRange(2, 1, sheet.getLastRow() - 1, 7).clearContent();
  }
  var list = Array.isArray(couponsList) ? couponsList : [];
  if (list.length > 0) {
    var rows = list.map(function(c) {
      return [
        String(c.code || '').toUpperCase(),
        c.discountPercent || '',
        c.discountAmount || '',
        c.minimumOrder || 0,
        c.description || '',
        c.active !== false ? 'TRUE' : 'FALSE',
        new Date()
      ];
    });
    sheet.getRange(2, 1, rows.length, 7).setValues(rows);
  }
  return { success: true, message: 'Coupons synced to sheet', data: list };
}

function updateContent(data) {
  var sheet=getSpreadsheet().getSheetByName(SHEETS.CONTENT); if(!sheet) return {success:false,message:'Content sheet missing'};
  var rows=sheet.getDataRange().getValues(), index={}; for(var i=1;i<rows.length;i++) index[String(rows[i][0])]=i+1;
  for(var key in data){ var value=data[key]||{}; if(index[key]) sheet.getRange(index[key],2,1,3).setValues([[value.bn||'',value.en||'',new Date()]]); else sheet.appendRow([key,value.bn||'',value.en||'',new Date()]); }
  return {success:true,message:'Content synced'};
}

function saveFAQ(data) {
  var sheet=getSpreadsheet().getSheetByName(SHEETS.FAQ); if(!sheet) return {success:false,message:'FAQ sheet missing'};
  var rows=Array.isArray(data)?data:(data.items||[]); if(!rows.length) return {success:false,message:'No FAQ data'};
  if(sheet.getLastRow()>1) sheet.getRange(2,1,sheet.getLastRow()-1,8).clearContent();
  var values=rows.map(function(f,i){return [f.id||('FAQ-'+(i+1)),f.questionBn||'',f.answerBn||'',f.questionEn||'',f.answerEn||'',f.active!==false?'TRUE':'FALSE',Number(f.sortOrder)||i+1,new Date()];});
  sheet.getRange(2,1,values.length,8).setValues(values); return {success:true,message:'FAQ synced',data:values};
}

function syncAll(data) {
  setupDatabase();
  var result = { settings:false, content:false, faq:false, coupons:false };
  if(data && data.settings) { updateSettings(data.settings); result.settings=true; }
  if(data && data.content) { updateContent(data.content); result.content=true; }
  if(data && data.faq) { saveFAQ(data.faq); result.faq=true; }
  if(data && data.coupons) { saveCoupons(data.coupons); result.coupons=true; }
  return {
    success:true,
    message:'All data synchronized',
    timestamp:new Date().toISOString(),
    synced:result
  };
}

