import QRCode from 'qrcode';

/**
 * Generate QR code string untuk asset
 * Format: SCH/KD/{CATEGORY_CODE}/{SEQUENTIAL_NUMBER}
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
 * Generate kode aset otomatis
 * Format: SCH/KD/{CATEGORY_CODE}/{SEQUENTIAL_NUMBER}
 */
export const generateAssetCode = (categoryCode: string, sequentialNumber: number): string => {
    const paddedNumber = sequentialNumber.toString().padStart(4, '0');
    return `SCH/KD/${categoryCode}/${paddedNumber}`;
};

/**
 * Validate kode aset format
 */
export const validateAssetCode = (kodeAset: string): boolean => {
    const pattern = /^SCH\/KD\/[A-Z]{2,3}\/\d{4}$/;
    return pattern.test(kodeAset);
};
