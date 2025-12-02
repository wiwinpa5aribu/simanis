import QRCode from 'qrcode';

/**
 * Generate QR code data URL untuk asset
 * QR code berisi kode aset yang dapat di-scan
 */
export const generateAssetQRCode = async (kodeAset: string): Promise<string> => {
  try {
    // Generate QR code as data URL
    const qrCodeDataUrl = await QRCode.toDataURL(kodeAset, {
      errorCorrectionLevel: 'M',
      type: 'image/png',
      width: 300,
      margin: 1,
    });
    return qrCodeDataUrl;
  } catch (error) {
    throw new Error(`Failed to generate QR code: ${error}`);
  }
};

/**
 * Generate QR code as PNG buffer (for file storage)
 */
export const generateAssetQRCodeBuffer = async (kodeAset: string): Promise<Buffer> => {
  try {
    const buffer = await QRCode.toBuffer(kodeAset, {
      errorCorrectionLevel: 'M',
      type: 'png',
      width: 300,
      margin: 1,
    });
    return buffer;
  } catch (error) {
    throw new Error(`Failed to generate QR code buffer: ${error}`);
  }
};

/**
 * Validate kode aset format
 * Format: SCH/XX/YYY/NNN
 * - SCH: School prefix
 * - XX: 2-digit year
 * - YYY: 3-letter category code
 * - NNN: 3-digit sequential number
 */
export const validateAssetCode = (kodeAset: string): boolean => {
  const pattern = /^SCH\/\d{2}\/[A-Z]{3}\/\d{3}$/;
  return pattern.test(kodeAset);
};

/**
 * Parse kode aset into components
 */
export const parseAssetCode = (
  kodeAset: string,
): {
  prefix: string;
  year: string;
  categoryCode: string;
  sequence: number;
} | null => {
  if (!validateAssetCode(kodeAset)) {
    return null;
  }

  const parts = kodeAset.split('/');
  return {
    prefix: parts[0],
    year: parts[1],
    categoryCode: parts[2],
    sequence: parseInt(parts[3], 10),
  };
};
