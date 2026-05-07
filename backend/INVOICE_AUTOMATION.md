# Invoice Automation System - API Documentation

## Overview
This system automatically generates professional invoices after successful order placement and sends them via WhatsApp using Botbiz API.

## Flow
```
Order Success
     ↓
Generate Invoice HTML
     ↓
Generate PDF using Puppeteer
     ↓
Save PDF to uploads/invoices/
     ↓
Send WhatsApp message with invoice
     ↓
Save invoice details in database
```

## Features
- Auto-generate invoice after payment success
- Professional PDF invoice (Vyapar-style)
- WhatsApp delivery via Botbiz API
- GST support (CGST, SGST, IGST)
- Invoice history and tracking

## API Endpoints

### 1. Generate Invoice (Auto-triggered)
Called automatically after successful payment.

```
POST /api/invoices/generate
Body: { "orderId": "order_mongo_id" }
Response: { success: true, data: { invoice, pdfUrl, whatsappSent } }
```

### 2. Generate Invoice PDF Only
```
POST /api/invoices/generate-pdf
Body: { "orderId": "order_mongo_id" }
```

### 3. Send Invoice via WhatsApp
```
POST /api/invoices/send-whatsapp/:invoiceId
```

### 4. Get User Invoices
```
GET /api/invoices/my-invoices
```

### 5. Get Invoice by Order
```
GET /api/invoices/order/:orderId
```

### 6. Get All Invoices (Admin)
```
GET /api/invoices?page=1&limit=20&status=sent
```

### 7. Get Invoice by ID
```
GET /api/invoices/:invoiceId
```

### 8. Regenerate PDF
```
POST /api/invoices/regenerate-pdf/:invoiceId
```

## Environment Variables Required

```env
# Shop Details
SHOP_NAME=Gawande Krushi Kendra
SHOP_ADDRESS=Your Address
SHOP_PHONE=9876543210
SHOP_EMAIL=contact@gkk.com
SHOP_GSTIN=27AABCU9603R1ZX

# Invoice Settings
AUTO_GENERATE_INVOICE=true
INVOICE_CGST_RATE=9
INVOICE_SGST_RATE=9
INVOICE_IGST_RATE=18

# Botbiz WhatsApp
BOTBIZ_API_URL=https://api.botbiz.in
BOTBIZ_API_KEY=your_api_key
BOTBIZ_DEVICE_ID=your_device_id
```

## Invoice PDF Structure

The generated invoice includes:
- Shop name & logo
- Invoice number (auto-generated: INV-YYYYMM-XXXX)
- Date
- Customer details (name, phone, address)
- Product list with quantities and prices
- Subtotal
- GST breakdown (CGST, SGST, IGST)
- Total amount
- Footer with thank you message

## WhatsApp Message Format
```
Hi {customer_name},
Details of your Sale Invoice from Gawande Krushi Kendra.
Invoice Amount: ₹{amount}
Thank you for doing business with us.
```

## Manual Usage Example

```javascript
// Generate invoice manually
const response = await fetch('/api/invoices/generate', {
  method: 'POST',
  headers: { 'Authorization': 'Bearer <token>' },
  body: JSON.stringify({ orderId: '60d5ec49f1b2c8b4e8c4e1a1' })
});
const data = await response.json();
console.log('Invoice URL:', data.data.pdfUrl);
```

## Troubleshooting

### WhatsApp not sending?
- Check BOTBIZ_API_KEY and BOTBIZ_DEVICE_ID are set correctly
- Verify the phone number format (should be 10 digits)
- Check Botbiz dashboard for device connection status

### PDF not generating?
- Ensure puppeteer is installed: npm install puppeteer
- Check PUPPETEER_EXECUTABLE_PATH if using custom Chrome
- Verify uploads/invoices folder exists

### Invoice not auto-generating?
- Check AUTO_GENERATE_INVOICE=true in env
- Verify payment verification is calling invoice service
- Check console logs for errors