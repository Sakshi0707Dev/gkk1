export const generateInvoiceHTML = (invoiceData) => {
  const {
    invoiceNumber,
    invoiceDate,
    customerName,
    customerPhone,
    customerAddress,
    items = [],
    subtotal = 0,
    cgst = 0,
    sgst = 0,
    igst = 0,
    totalGst = 0,
    totalAmount = 0,
    shopName = 'Gawande Krushi Kendra',
    shopAddress = '',
    shopPhone = '',
    shopEmail = '',
    shopGstin = '',
  } = invoiceData;

  const formattedDate = new Date(invoiceDate).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const itemsHTML = items
    .map(
      (item, index) => `
    <tr>
      <td style="text-align: center;">${index + 1}</td>
      <td>${item.productName}</td>
      <td style="text-align: center;">${item.quantity} ${item.unit || 'pcs'}</td>
      <td style="text-align: right;">${formatCurrency(item.price)}</td>
      <td style="text-align: right;">${formatCurrency(item.total)}</td>
    </tr>
  `
    )
    .join('');

  const hasGST = totalGst > 0;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invoice - ${invoiceNumber}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-size: 12px;
      line-height: 1.5;
      color: #333;
      background: #fff;
      padding: 20px;
    }
    .invoice-container {
      max-width: 800px;
      margin: 0 auto;
      border: 2px solid #2c3e50;
    }
    .invoice-header {
      background: #2c3e50;
      color: #fff;
      padding: 20px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
    .shop-info h1 {
      font-size: 24px;
      font-weight: 700;
      margin-bottom: 5px;
      color: #fff;
    }
    .shop-details {
      font-size: 11px;
      opacity: 0.9;
    }
    .invoice-info {
      text-align: right;
    }
    .invoice-info h2 {
      font-size: 28px;
      font-weight: 700;
      margin-bottom: 8px;
      color: #fff;
    }
    .invoice-info p {
      font-size: 11px;
      margin: 2px 0;
    }
    .invoice-meta {
      background: #f8f9fa;
      padding: 15px 20px;
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #e9ecef;
    }
    .meta-group {
      flex: 1;
    }
    .meta-group h3 {
      font-size: 11px;
      text-transform: uppercase;
      color: #6c757d;
      margin-bottom: 8px;
      letter-spacing: 0.5px;
    }
    .meta-group p {
      font-size: 12px;
      margin: 3px 0;
    }
    .billing-section {
      padding: 20px;
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #e9ecef;
    }
    .billing-box {
      flex: 1;
    }
    .billing-box h3 {
      font-size: 11px;
      text-transform: uppercase;
      color: #6c757d;
      margin-bottom: 8px;
      letter-spacing: 0.5px;
    }
    .billing-box p {
      font-size: 12px;
      margin: 3px 0;
    }
    .billing-box .name {
      font-weight: 600;
      font-size: 14px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    .items-table {
      width: 100%;
    }
    .items-table thead {
      background: #34495e;
      color: #fff;
    }
    .items-table th {
      padding: 12px 8px;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-weight: 600;
    }
    .items-table td {
      padding: 10px 8px;
      border-bottom: 1px solid #e9ecef;
      font-size: 12px;
    }
    .items-table tbody tr:nth-child(even) {
      background: #f8f9fa;
    }
    .items-table tbody tr:hover {
      background: #f1f3f5;
    }
    .totals-section {
      padding: 20px;
      background: #f8f9fa;
    }
    .totals-table {
      width: 300px;
      margin-left: auto;
    }
    .totals-table td {
      padding: 6px 8px;
      font-size: 12px;
    }
    .totals-table .label {
      color: #6c757d;
    }
    .totals-table .value {
      text-align: right;
      font-weight: 500;
    }
    .totals-table .total-row {
      background: #2c3e50;
      color: #fff;
      font-size: 14px;
      font-weight: 700;
    }
    .totals-table .total-row td {
      padding: 10px 8px;
    }
    .gst-note {
      padding: 15px 20px;
      background: #e8f5e9;
      border-top: 1px solid #c8e6c9;
      font-size: 11px;
      color: #2e7d32;
    }
    .footer {
      padding: 20px;
      text-align: center;
      border-top: 1px solid #e9ecef;
      background: #f8f9fa;
    }
    .footer p {
      font-size: 11px;
      color: #6c757d;
      margin: 5px 0;
    }
    .footer .thanks {
      font-size: 14px;
      font-weight: 600;
      color: #2c3e50;
      margin-bottom: 10px;
    }
    .print-btn {
      display: none;
    }
    @media print {
      body {
        padding: 0;
      }
      .invoice-container {
        border: none;
      }
    }
  </style>
</head>
<body>
  <div class="invoice-container">
    <div class="invoice-header">
      <div class="shop-info">
        <h1>${shopName}</h1>
        <div class="shop-details">
          ${shopAddress ? `<p>${shopAddress}</p>` : ''}
          ${shopPhone ? `<p>Phone: ${shopPhone}</p>` : ''}
          ${shopEmail ? `<p>Email: ${shopEmail}</p>` : ''}
          ${shopGstin ? `<p>GSTIN: ${shopGstin}</p>` : ''}
        </div>
      </div>
      <div class="invoice-info">
        <h2>INVOICE</h2>
        <p><strong>Invoice No:</strong> ${invoiceNumber}</p>
        <p><strong>Date:</strong> ${formattedDate}</p>
      </div>
    </div>

    <div class="invoice-meta">
      <div class="meta-group">
        <h3>Order Details</h3>
        <p><strong>Order ID:</strong> ${invoiceData.orderId || 'N/A'}</p>
      </div>
    </div>

    <div class="billing-section">
      <div class="billing-box">
        <h3>Bill To (Customer)</h3>
        <p class="name">${customerName}</p>
        <p>Phone: ${customerPhone}</p>
        <p>${customerAddress}</p>
      </div>
    </div>

    <table class="items-table">
      <thead>
        <tr>
          <th style="width: 50px; text-align: center;">#</th>
          <th>Item Description</th>
          <th style="width: 100px; text-align: center;">Qty</th>
          <th style="width: 100px; text-align: right;">Rate</th>
          <th style="width: 120px; text-align: right;">Amount</th>
        </tr>
      </thead>
      <tbody>
        ${itemsHTML}
      </tbody>
    </table>

    <div class="totals-section">
      <table class="totals-table">
        <tr>
          <td class="label">Subtotal</td>
          <td class="value">${formatCurrency(subtotal)}</td>
        </tr>
        ${hasGST ? `
        <tr>
          <td class="label">CGST (${invoiceData.cgstRate || 0}%)</td>
          <td class="value">${formatCurrency(cgst)}</td>
        </tr>
        <tr>
          <td class="label">SGST (${invoiceData.sgstRate || 0}%)</td>
          <td class="value">${formatCurrency(sgst)}</td>
        </tr>
        <tr>
          <td class="label">IGST (${invoiceData.igstRate || 0}%)</td>
          <td class="value">${formatCurrency(igst)}</td>
        </tr>
        <tr>
          <td class="label">Total GST</td>
          <td class="value">${formatCurrency(totalGst)}</td>
        </tr>
        ` : ''}
        <tr class="total-row">
          <td>Total Amount</td>
          <td>${formatCurrency(totalAmount)}</td>
        </tr>
      </table>
    </div>

    ${hasGST ? `
    <div class="gst-note">
      <strong>GST Details:</strong> This invoice includes GST as applicable. Tax paid under Reverse Charge Mechanism (RCM) where applicable.
    </div>
    ` : ''}

    <div class="footer">
      <p class="thanks">Thank you for your business!</p>
      <p>If you have any questions about this invoice, please contact us.</p>
      <p>Generated by Gawande Krushi Kendra</p>
    </div>
  </div>
</body>
</html>
  `.trim();
};

export default generateInvoiceHTML;