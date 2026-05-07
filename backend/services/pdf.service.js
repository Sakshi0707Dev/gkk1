import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { ENV } from '../config/env.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class PdfService {
  constructor() {
    this.browser = null;
    this.invoiceDir = path.join(__dirname, '../../uploads/invoices');
  }

  async ensureInvoiceDirectory() {
    try {
      await fs.access(this.invoiceDir);
    } catch {
      await fs.mkdir(this.invoiceDir, { recursive: true });
    }
  }

  async getBrowser() {
    if (this.browser && this.browser.connected) {
      return this.browser;
    }

    const puppeteerConfig = {
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--font-render-hinting: none',
      ],
    };

    if (ENV.PUPPETEER_EXECUTABLE_PATH) {
      puppeteerConfig.executablePath = ENV.PUPPETEER_EXECUTABLE_PATH;
    }

    this.browser = await puppeteer.launch(puppeteerConfig);
    return this.browser;
  }

  async generateInvoicePDF(htmlContent, invoiceNumber) {
    const timestamp = Date.now();
    const fileName = `invoice_${invoiceNumber}_${timestamp}.pdf`;
    const filePath = path.join(this.invoiceDir, fileName);

    await this.ensureInvoiceDirectory();

    let browser = null;
    try {
      browser = await this.getBrowser();

      const page = await browser.newPage();

      await page.setContent(htmlContent, {
        waitUntil: 'networkidle0',
        timeout: 30000,
      });

      await page.pdf({
        path: filePath,
        format: 'A4',
        printBackground: true,
        margin: {
          top: '0px',
          right: '0px',
          bottom: '0px',
          left: '0px',
        },
      });

      await page.close();

      console.log(`[PDF_SERVICE] Invoice PDF generated: ${filePath}`);

      return {
        success: true,
        filePath,
        fileName,
        publicUrl: `/uploads/invoices/${fileName}`,
      };
    } catch (error) {
      console.error(`[PDF_SERVICE] Error generating PDF:`, error);
      throw new Error(`Failed to generate PDF: ${error.message}`);
    }
  }

  async generateInvoicePDFBuffer(htmlContent) {
    let browser = null;
    try {
      browser = await this.getBrowser();

      const page = await browser.newPage();

      await page.setContent(htmlContent, {
        waitUntil: 'networkidle0',
        timeout: 30000,
      });

      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '0px',
          right: '0px',
          bottom: '0px',
          left: '0px',
        },
      });

      await page.close();

      return {
        success: true,
        buffer: pdfBuffer,
      };
    } catch (error) {
      console.error(`[PDF_SERVICE] Error generating PDF buffer:`, error);
      throw new Error(`Failed to generate PDF buffer: ${error.message}`);
    }
  }

  async closeBrowser() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }

  async deleteInvoicePDF(filePath) {
    try {
      await fs.unlink(filePath);
      console.log(`[PDF_SERVICE] Invoice PDF deleted: ${filePath}`);
      return { success: true };
    } catch (error) {
      console.error(`[PDF_SERVICE] Error deleting PDF:`, error);
      return { success: false, error: error.message };
    }
  }

  async listInvoices() {
    try {
      await this.ensureInvoiceDirectory();
      const files = await fs.readdir(this.invoiceDir);
      const pdfFiles = files.filter(f => f.endsWith('.pdf'));
      return { success: true, files: pdfFiles };
    } catch (error) {
      console.error(`[PDF_SERVICE] Error listing invoices:`, error);
      return { success: false, error: error.message };
    }
  }
}

export const pdfService = new PdfService();
export default pdfService;