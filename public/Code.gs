/**
 * Aura Tableware & Crockery Store - Google Apps Script Backend (Code.gs)
 * 
 * Provides automated Google Sheets Database creation, REST API web endpoints (doGet/doPost),
 * live order syncing, automated stock management, and settings configuration.
 */

var SHEETS = {
  PRODUCTS: 'Products',
  ORDERS: 'Orders',
  CUSTOMERS: 'Customers',
  SETTINGS: 'Settings',
  ADMIN: 'Admin'
};

/**
 * Automatically sets up the required sheets with headers and default values.
 * Run this function once from the Apps Script editor to initialize your database!
 */
function setupDatabase() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

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

  // 5. Admin Sheet
  var adminSheet = getOrCreateSheet(ss, SHEETS.ADMIN);
  var adminHeaders = ['Username', 'Password', 'Role'];
  setSheetHeaders(adminSheet, adminHeaders);

  // Seed default admin if empty
  if (adminSheet.getLastRow() <= 1) {
    adminSheet.appendRow(['admin', 'aura@admin2026', 'SuperAdmin']);
  }

  return 'Database setup completed successfully!';
}

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
      default:
        response = { success: false, message: 'Unknown POST action: ' + action };
    }

    return createJsonResponse(response);
  } catch (err) {
    return createJsonResponse({ success: false, message: err.toString() });
  }
}

function getProducts() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEETS.PRODUCTS);
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

function getProductById(id) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEETS.PRODUCTS);
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

  return { success: false, message: 'Product not found' };
}

function addProduct(product) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEETS.PRODUCTS);
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

function updateProduct(product) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEETS.PRODUCTS);
  if (!sheet) return { success: false, message: 'Products sheet not found' };

  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var idCol = headers.indexOf('Product_ID');
  var targetId = String(product.Product_ID || product.id);

  for (var i = 1; i < data.length; i++) {
    if (String(data[i][idCol]) === targetId) {
      var rowIndex = i + 1;
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

function deleteProduct(id) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEETS.PRODUCTS);
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

function createOrder(order) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var orderSheet = ss.getSheetByName(SHEETS.ORDERS);
  var productSheet = ss.getSheetByName(SHEETS.PRODUCTS);
  var customerSheet = ss.getSheetByName(SHEETS.CUSTOMERS);

  if (!orderSheet) return { success: false, message: 'Orders sheet missing' };

  var orderId = order.Order_ID || ('ORD-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000));
  var orderDate = new Date().toISOString();

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
    data: { orderId: orderId, orderDate: orderDate, totalPrice: order.Total_Price }
  };
}

function getOrders() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEETS.ORDERS);
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

function updateOrderStatus(orderId, status) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEETS.ORDERS);
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

function getSettings() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEETS.SETTINGS);
  if (!sheet) return { success: false, message: 'Settings sheet missing' };

  var data = sheet.getDataRange().getValues();
  var settings = {};
  for (var i = 1; i < data.length; i++) {
    settings[data[i][0]] = data[i][1];
  }

  return { success: true, message: 'Settings retrieved', data: settings };
}

function updateSettings(settingsData) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEETS.SETTINGS);
  if (!sheet) return { success: false, message: 'Settings sheet missing' };

  var data = sheet.getDataRange().getValues();
  var existingKeys = {};
  for (var i = 1; i < data.length; i++) {
    existingKeys[data[i][0]] = i + 1;
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

function getOrCreateSheet(spreadsheet, sheetName) {
  var sheet = spreadsheet.getSheetByName(sheetName);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(sheetName);
  }
  return sheet;
}

function setSheetHeaders(sheet, headers) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
    var headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#F4EAD4');
  }
}

function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
