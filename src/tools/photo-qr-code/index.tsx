import React, { useState, useRef, useEffect, useMemo } from 'react';
import QRCode from 'qrcode';
import {
  ArrowLeft,
  Check,
  Download,
  FileImage,
  Globe,
  MessageCircle,
  Phone,
  QrCode,
  Sparkles,
  Upload,
  Wifi,
  Mail,
  FileText,
  Share2,
  Sliders,
  Layers,
  Info,
  CheckCircle2,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { type ToolDefinition, getRelatedTools } from '@/registry/tool-registry';
import { useI18n } from '@/i18n';
import { trackEvent } from '@/lib/analytics';
import { AdSlot } from '@/components/ads/AdSlot';
import { adConfig } from '@/components/ads/adConfig';

// Payload Platform Types
export type PayloadType =
  | 'website'
  | 'social'
  | 'whatsapp'
  | 'wifi'
  | 'phone'
  | 'email'
  | 'text';

export type CornerPosition =
  | 'bottom-right'
  | 'bottom-left'
  | 'top-right'
  | 'top-left';

export type SocialNetwork =
  | 'facebook'
  | 'instagram'
  | 'youtube'
  | 'twitter'
  | 'tiktok'
  | 'linkedin'
  | 'telegram';

interface PayloadOption {
  type: PayloadType;
  labelEn: string;
  labelBn: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  color: string;
}

const PAYLOAD_OPTIONS: PayloadOption[] = [
  { type: 'website', labelEn: 'Website URL', labelBn: 'ওয়েবসাইট লিংক', icon: Globe, color: '#0ea5e9' },
  { type: 'social', labelEn: 'Social Media', labelBn: 'সোশ্যাল মিডিয়া', icon: Share2, color: '#ec4899' },
  { type: 'whatsapp', labelEn: 'WhatsApp Chat', labelBn: 'হোয়াটসঅ্যাপ চ্যাট', icon: MessageCircle, color: '#22c55e' },
  { type: 'wifi', labelEn: 'Wi-Fi Network', labelBn: 'ওয়াই-ফাই নেটওয়ার্ক', icon: Wifi, color: '#f59e0b' },
  { type: 'phone', labelEn: 'Phone Call', labelBn: 'ফোন নম্বর', icon: Phone, color: '#8b5cf6' },
  { type: 'email', labelEn: 'Send Email', labelBn: 'ইমেইল অ্যাড্রেস', icon: Mail, color: '#f97316' },
  { type: 'text', labelEn: 'Plain Text', labelBn: 'সাধারণ টেক্সট', icon: FileText, color: '#64748b' },
];

const SOCIAL_NETWORKS: Array<{
  id: SocialNetwork;
  name: string;
  prefix: string;
  placeholder: string;
  iconSvg: string;
}> = [
  {
    id: 'facebook',
    name: 'Facebook',
    prefix: 'https://facebook.com/',
    placeholder: 'username or page (e.g. ahadex.official)',
    iconSvg: `<svg viewBox="0 0 24 24" width="16" height="16" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>`,
  },
  {
    id: 'instagram',
    name: 'Instagram',
    prefix: 'https://instagram.com/',
    placeholder: 'username (e.g. ahadex_official)',
    iconSvg: `<svg viewBox="0 0 24 24" width="16" height="16" fill="#E4405F"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>`,
  },
  {
    id: 'youtube',
    name: 'YouTube',
    prefix: 'https://youtube.com/@',
    placeholder: 'channel handle (e.g. GoogleDevelopers)',
    iconSvg: `<svg viewBox="0 0 24 24" width="16" height="16" fill="#FF0000"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`,
  },
  {
    id: 'twitter',
    name: 'X (Twitter)',
    prefix: 'https://x.com/',
    placeholder: 'handle without @ (e.g. elonmusk)',
    iconSvg: `<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`,
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    prefix: 'https://tiktok.com/@',
    placeholder: 'username (e.g. tiktok)',
    iconSvg: `<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>`,
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    prefix: 'https://linkedin.com/in/',
    placeholder: 'profile id or username',
    iconSvg: `<svg viewBox="0 0 24 24" width="16" height="16" fill="#0A66C2"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>`,
  },
  {
    id: 'telegram',
    name: 'Telegram',
    prefix: 'https://t.me/',
    placeholder: 'username without @',
    iconSvg: `<svg viewBox="0 0 24 24" width="16" height="16" fill="#229ED9"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.121l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.458c.538-.196 1.006.128.832.941z"/></svg>`,
  },
];

export function PhotoQrCodeTool({ tool }: { tool: ToolDefinition }) {
  const { copy, language } = useI18n();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // File & Canvas states
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageSize, setImageSize] = useState<{ width: number; height: number } | null>(null);

  // Payload states - Starts empty so user fills their desired link
  const [payloadType, setPayloadType] = useState<PayloadType>('website');
  const [urlInput, setUrlInput] = useState<string>('');
  const [socialNetwork, setSocialNetwork] = useState<SocialNetwork>('facebook');
  const [socialUsername, setSocialUsername] = useState<string>('');
  const [waNumber, setWaNumber] = useState<string>('');
  const [waMessage, setWaMessage] = useState<string>('');
  const [wifiSsid, setWifiSsid] = useState<string>('');
  const [wifiPass, setWifiPass] = useState<string>('');
  const [wifiType, setWifiType] = useState<'WPA' | 'WEP' | 'nopass'>('WPA');
  const [phoneInput, setPhoneInput] = useState<string>('');
  const [emailInput, setEmailInput] = useState<string>('');
  const [emailSubject, setEmailSubject] = useState<string>('');
  const [textInput, setTextInput] = useState<string>('');

  // Check if current payload has valid link / data provided by user
  const hasValidPayload = useMemo(() => {
    switch (payloadType) {
      case 'website':
        return urlInput.trim().length > 3;
      case 'social':
        return socialUsername.trim().length > 0;
      case 'whatsapp':
        return waNumber.trim().replace(/[^\d+]/g, '').length >= 6;
      case 'wifi':
        return wifiSsid.trim().length > 0;
      case 'phone':
        return phoneInput.trim().replace(/[^\d+]/g, '').length >= 4;
      case 'email':
        return emailInput.trim().includes('@') && emailInput.trim().length >= 5;
      case 'text':
        return textInput.trim().length > 0;
      default:
        return false;
    }
  }, [
    payloadType,
    urlInput,
    socialUsername,
    waNumber,
    wifiSsid,
    phoneInput,
    emailInput,
    textInput,
  ]);

  // Badge Customization
  const [corner, setCorner] = useState<CornerPosition>('bottom-right');
  const [badgeScale, setBadgeScale] = useState<number>(22); // percent of smallest image dimension (16 - 38%)
  const [badgePadding, setBadgePadding] = useState<number>(20); // offset from border (px relative)
  const [badgeRadius, setBadgeRadius] = useState<number>(14); // border radius
  const [badgeBgColor, setBadgeBgColor] = useState<string>('#ffffff');
  const [badgeQrColor, setBadgeQrColor] = useState<string>('#000000');
  const [showCalloutLabel, setShowCalloutLabel] = useState<boolean>(true);
  const [customCalloutText, setCustomCalloutText] = useState<string>('SCAN ME');
  const [badgeOpacity, setBadgeOpacity] = useState<number>(95);

  // Output states
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'ready' | 'processing' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string>('');

  // Construct current formatted payload string for QR
  const qrString = useMemo(() => {
    switch (payloadType) {
      case 'website': {
        const clean = urlInput.trim();
        if (!clean) return '';
        return clean.startsWith('http://') || clean.startsWith('https://') ? clean : `https://${clean}`;
      }
      case 'social': {
        const selected = SOCIAL_NETWORKS.find((s) => s.id === socialNetwork) || SOCIAL_NETWORKS[0];
        const user = socialUsername.trim().replace(/^@/, '');
        return user ? `${selected.prefix}${user}` : '';
      }
      case 'whatsapp': {
        const cleanNum = waNumber.replace(/[^\d+]/g, '');
        if (!cleanNum) return '';
        const encodedMsg = encodeURIComponent(waMessage.trim());
        return `https://wa.me/${cleanNum.replace('+', '')}${encodedMsg ? `?text=${encodedMsg}` : ''}`;
      }
      case 'wifi': {
        const ssid = wifiSsid.trim();
        if (!ssid) return '';
        const pass = wifiPass.trim();
        return `WIFI:S:${ssid};T:${wifiType};P:${pass};;`;
      }
      case 'phone': {
        const cleanNum = phoneInput.replace(/[^\d+]/g, '');
        if (!cleanNum) return '';
        return `tel:${cleanNum}`;
      }
      case 'email': {
        const mail = emailInput.trim();
        if (!mail) return '';
        const sub = encodeURIComponent(emailSubject.trim());
        return `mailto:${mail}${sub ? `?subject=${sub}` : ''}`;
      }
      case 'text':
      default:
        return textInput.trim();
    }
  }, [
    payloadType,
    urlInput,
    socialNetwork,
    socialUsername,
    waNumber,
    waMessage,
    wifiSsid,
    wifiPass,
    wifiType,
    phoneInput,
    emailInput,
    emailSubject,
    textInput,
  ]);

  // Handle uploaded file
  const handleFileChange = (newFile?: File) => {
    if (!newFile) return;
    if (!newFile.type.startsWith('image/')) {
      setStatus('error');
      setMessage(
        language === 'bn'
          ? 'অনুগ্রহ করে একটি সঠিক ছবি (JPG, PNG বা WebP) নির্বাচন করুন।'
          : 'Please select a valid image file (JPG, PNG, WebP).'
      );
      return;
    }

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (outputUrl) URL.revokeObjectURL(outputUrl);

    const prev = URL.createObjectURL(newFile);
    const img = new Image();
    img.src = prev;
    img.onload = () => {
      setImageSize({ width: img.naturalWidth, height: img.naturalHeight });
    };

    setFile(newFile);
    setPreviewUrl(prev);
    setOutputUrl(null);
    setStatus('ready');
    setMessage(
      language === 'bn'
        ? 'ছবি আপলোড হয়েছে! এবার নিচের বক্সটিতে লিংক বা তথ্য দিন, স্বয়ংক্রিয়ভাবে কিউআর কোড তৈরি হয়ে যাবে।'
        : 'Photo loaded! Enter your link or payload details below to generate the composite QR badge.'
    );
    trackEvent('file_upload', { tool_id: tool.id, file_size: newFile.size });
  };

  // Generate Photo with QR Code badge on Canvas
  const generatePhotoWithQr = async () => {
    if (!file || !previewUrl || !qrString) return;

    setStatus('processing');
    setMessage(
      language === 'bn'
        ? 'উচ্চ ক্ষমতাসম্পন্ন স্ক্যানযোগ্য কিউআর কোড ছবির কর্নারে বসানো হচ্ছে…'
        : 'Generating high-contrast scannable QR badge and rendering composite image…'
    );
    trackEvent('tool_start', { tool_id: tool.id, payload_type: payloadType });

    try {
      // 1. Load source image
      const baseImg = new Image();
      baseImg.src = previewUrl;
      await new Promise((resolve, reject) => {
        baseImg.onload = () => resolve(true);
        baseImg.onerror = () => reject(new Error('Failed to load user image.'));
      });

      const imgWidth = baseImg.naturalWidth;
      const imgHeight = baseImg.naturalHeight;
      const minDimension = Math.min(imgWidth, imgHeight);

      // 2. Generate high-resolution scannable QR canvas with QRCode library
      // Level 'H' (High 30% recovery) ensures reliable scan even if partially shaded
      const qrCanvas = document.createElement('canvas');
      await QRCode.toCanvas(qrCanvas, qrString, {
        errorCorrectionLevel: 'H',
        margin: 1,
        color: {
          dark: badgeQrColor || '#000000',
          light: '#ffffff00', // transparent inside QR, handled by badge background
        },
        width: 600, // render crisp master
      });

      // 3. Setup Master Composite Canvas
      const masterCanvas = document.createElement('canvas');
      masterCanvas.width = imgWidth;
      masterCanvas.height = imgHeight;
      const ctx = masterCanvas.getContext('2d');
      if (!ctx) throw new Error('Failed to get canvas 2D context.');

      // Draw original user photo (100% quality unchanged)
      ctx.drawImage(baseImg, 0, 0, imgWidth, imgHeight);

      // 4. Calculate QR Badge dimensions
      // Size badge proportionally based on user scale setting (16% to 38% of smaller dimension)
      const badgeSide = Math.max(160, Math.round(minDimension * (badgeScale / 100)));
      const qrSize = Math.round(badgeSide * 0.78);
      const labelHeight = showCalloutLabel ? Math.round(badgeSide * 0.18) : 0;
      const badgeHeight = qrSize + labelHeight + Math.round(badgeSide * 0.12);
      const badgeWidth = badgeSide;

      // Margin from photo border proportional to image size
      const marginPx = Math.max(16, Math.round(minDimension * (badgePadding / 1000)));

      // Coordinate placement based on selected corner
      let badgeX = marginPx;
      let badgeY = marginPx;

      switch (corner) {
        case 'bottom-right':
          badgeX = imgWidth - badgeWidth - marginPx;
          badgeY = imgHeight - badgeHeight - marginPx;
          break;
        case 'bottom-left':
          badgeX = marginPx;
          badgeY = imgHeight - badgeHeight - marginPx;
          break;
        case 'top-right':
          badgeX = imgWidth - badgeWidth - marginPx;
          badgeY = marginPx;
          break;
        case 'top-left':
          badgeX = marginPx;
          badgeY = marginPx;
          break;
      }

      // 5. Draw Badge Background with shadow and rounded corners
      ctx.save();
      ctx.globalAlpha = badgeOpacity / 100;

      // Drop shadow for high readability on any photo background
      ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
      ctx.shadowBlur = Math.max(10, Math.round(badgeSide * 0.08));
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = Math.round(badgeSide * 0.03);

      const r = Math.max(8, Math.round((badgeRadius / 100) * (badgeSide * 0.2)));
      ctx.fillStyle = badgeBgColor || '#ffffff';

      // Rounded rectangle badge container
      ctx.beginPath();
      ctx.moveTo(badgeX + r, badgeY);
      ctx.lineTo(badgeX + badgeWidth - r, badgeY);
      ctx.quadraticCurveTo(badgeX + badgeWidth, badgeY, badgeX + badgeWidth, badgeY + r);
      ctx.lineTo(badgeX + badgeWidth, badgeY + badgeHeight - r);
      ctx.quadraticCurveTo(badgeX + badgeWidth, badgeY + badgeHeight, badgeX + badgeWidth - r, badgeY + badgeHeight);
      ctx.lineTo(badgeX + r, badgeY + badgeHeight);
      ctx.quadraticCurveTo(badgeX, badgeY + badgeHeight, badgeX, badgeY + badgeHeight - r);
      ctx.lineTo(badgeX, badgeY + r);
      ctx.quadraticCurveTo(badgeX, badgeY, badgeX + r, badgeY);
      ctx.closePath();
      ctx.fill();

      // Reset shadow for inner elements
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;

      // Draw subtle boundary border to separate white badge on white photos
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.12)';
      ctx.lineWidth = Math.max(1.5, Math.round(badgeSide * 0.012));
      ctx.stroke();

      // 6. Draw QR Code into badge
      const qrOffsetInnerX = badgeX + (badgeWidth - qrSize) / 2;
      const qrOffsetInnerY = badgeY + Math.round(badgeSide * 0.06);

      // Clean background behind QR for guaranteed contrast & instant scan
      ctx.fillStyle = badgeBgColor;
      ctx.fillRect(qrOffsetInnerX, qrOffsetInnerY, qrSize, qrSize);
      ctx.drawImage(qrCanvas, qrOffsetInnerX, qrOffsetInnerY, qrSize, qrSize);

      // 7. Draw Callout Label (e.g. "SCAN ME" or "CONNECT WIFI") if enabled
      if (showCalloutLabel) {
        const textY = qrOffsetInnerY + qrSize + Math.round(labelHeight * 0.68);
        const fontSize = Math.max(11, Math.round(labelHeight * 0.52));

        ctx.font = `bold ${fontSize}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = badgeQrColor === '#ffffff' ? '#ffffff' : '#111827';

        const labelText =
          customCalloutText.trim() ||
          (payloadType === 'wifi'
            ? 'CONNECT WI-FI'
            : payloadType === 'whatsapp'
              ? 'CHAT ON WHATSAPP'
              : 'SCAN TO OPEN');

        ctx.fillText(labelText.toUpperCase(), badgeX + badgeWidth / 2, textY);
      }

      ctx.restore();

      // 8. Export to Blob / URL
      const exportType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
      const outputBlob = await new Promise<Blob>((resolve, reject) => {
        masterCanvas.toBlob(
          (b) => {
            if (b) resolve(b);
            else reject(new Error('Canvas blob encoding failed.'));
          },
          exportType,
          0.95
        );
      });

      const generatedUrl = URL.createObjectURL(outputBlob);
      setOutputUrl(generatedUrl);
      setStatus('success');
      setMessage(
        language === 'bn'
          ? 'সফলভাবে কিউআর কোড ব্যাজ যুক্ত হয়েছে! যেকোনো মোবাইল ক্যামেরা দিয়ে স্ক্যান করে যাচাই করুন ও ডাউনলোড করুন।'
          : 'Photo QR Code created successfully! Easily scannable with any smartphone camera. Download below.'
      );
      trackEvent('tool_success', { tool_id: tool.id, output_size: outputBlob.size });
    } catch (err: any) {
      console.error(err);
      setStatus('error');
      setMessage(err?.message || 'Failed to generate photo with QR badge.');
      trackEvent('tool_error', { tool_id: tool.id, error: err?.message });
    }
  };

  // Automatic QR Generation whenever user inputs link/data or changes options
  useEffect(() => {
    if (!file || !hasValidPayload || !qrString) {
      if (outputUrl) {
        URL.revokeObjectURL(outputUrl);
        setOutputUrl(null);
      }
      return;
    }

    const timer = setTimeout(() => {
      generatePhotoWithQr();
    }, 280);

    return () => clearTimeout(timer);
  }, [
    file,
    hasValidPayload,
    qrString,
    corner,
    badgeScale,
    badgePadding,
    badgeRadius,
    badgeBgColor,
    badgeQrColor,
    showCalloutLabel,
    customCalloutText,
    badgeOpacity,
  ]);

  return (
    <main className="tool-view" style={{ minHeight: '80vh', padding: '36px 0 80px' }}>
      <div className="container">
        {/* Breadcrumb Navigation */}
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link to="/tools">{copy.tools}</Link>
          <span>/</span>
          <span>{tool.category}</span>
          <span>/</span>
          <strong>{tool.name}</strong>
        </nav>

        {/* Back Link */}
        <Link to="/tools" className="back-link">
          <ArrowLeft size={16} /> {copy.backToTools}
        </Link>

        {/* Tool Header */}
        <header className="tool-header" style={{ marginBottom: 24 }}>
          <div className="tool-header-icon" style={{ background: 'hsl(var(--primary) / .1)', color: 'hsl(var(--primary))' }}>
            <QrCode size={30} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <span className="eyebrow">{tool.category}</span>
              <span className="badge" style={{ background: 'hsl(var(--primary) / .12)', color: 'hsl(var(--primary))', fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 6 }}>
                {language === 'bn' ? '১০০% স্ক্যানযোগ্য গ্যারান্টি' : '100% Scannable Local Tool'}
              </span>
            </div>
            <h1 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', marginTop: 4, marginBottom: 8 }}>
              {tool.name}
            </h1>
            <p className="tool-intro" style={{ maxWidth: 760, color: 'hsl(var(--muted-foreground))', lineHeight: 1.6 }}>
              {language === 'bn'
                ? 'আপনার ছবিতে একটি পরিষ্কার, উচ্চ ক্ষমতাসম্পন্ন কিউআর কোড (সোশ্যাল, ওয়াই-ফাই, ওয়েবসাইট বা হোয়াটসঅ্যাপ) বসিয়ে দিন। যে কোনো মোবাইল ক্যামেরায় মুহূর্তে স্ক্যান হবে।'
                : tool.description}
            </p>
          </div>
        </header>

        {/* Two-Column Layout: Left Side Controls / Points, Right Side Workspace & Preview */}
        <div className="tool-two-column-layout">
          {/* ================= LEFT SIDE: Fixed Tool Points & Controls ================= */}
          <aside className="tool-points-sidebar">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18, borderBottom: '1px solid hsl(var(--border))', paddingBottom: 12 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: 'hsl(var(--primary) / .12)',
                  color: 'hsl(var(--primary))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Sliders size={18} />
              </div>
              <div>
                <h3 style={{ fontSize: 16, margin: 0, fontWeight: 700 }}>
                  {language === 'bn' ? 'টুল সেটিংস ও পয়েন্ট' : 'Tool Points & Controls'}
                </h3>
                <small style={{ color: 'hsl(var(--muted-foreground))', fontSize: 11 }}>
                  {language === 'bn' ? 'বাম পাশের ফিক্সড সেটিংস' : 'Fixed tool controls'}
                </small>
              </div>
            </div>

            {/* Point 1: QR Settings & Controls */}
            <div style={{ marginBottom: 20 }}>
              <div className="tool-point-item" style={{ marginBottom: 12 }}>
                <span className="tool-point-num">1</span>
                <div>
                  <strong style={{ display: 'block', fontSize: 13 }}>
                    {language === 'bn' ? 'QR Settings & Controls' : 'QR Settings & Controls'}
                  </strong>
                  <span style={{ fontSize: 11, color: 'hsl(var(--muted-foreground))' }}>
                    {language === 'bn' ? 'কর্নর ও ব্যাজ সাইজ' : 'Corner & badge scale'}
                  </span>
                </div>
              </div>

              {/* Corner Placement Grid */}
              <div style={{ marginBottom: 16, paddingLeft: 4 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'hsl(var(--muted-foreground))', marginBottom: 8 }}>
                  {language === 'bn' ? 'ছবির কোন কর্নারে ব্যাজ বসবে:' : 'Corner Placement:'}
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {[
                    { id: 'top-left', label: 'Top-Left' },
                    { id: 'top-right', label: 'Top-Right' },
                    { id: 'bottom-left', label: 'Bottom-Left' },
                    { id: 'bottom-right', label: 'Bottom-Right' },
                  ].map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setCorner(c.id as CornerPosition)}
                      style={{
                        padding: '8px 10px',
                        borderRadius: 8,
                        border: corner === c.id ? '2px solid hsl(var(--primary))' : '1px solid hsl(var(--border))',
                        background: corner === c.id ? 'hsl(var(--primary) / .1)' : 'hsl(var(--secondary) / .4)',
                        color: corner === c.id ? 'hsl(var(--primary))' : 'hsl(var(--foreground))',
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: 'pointer',
                        textAlign: 'center',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Badge Scale Slider */}
              <div style={{ paddingLeft: 4 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 5 }}>
                  <span style={{ fontWeight: 600 }}>{language === 'bn' ? 'ব্যাজ সাইজ:' : 'Badge Size:'}</span>
                  <span style={{ color: 'hsl(var(--primary))', fontWeight: 700 }}>{badgeScale}%</span>
                </div>
                <input
                  type="range"
                  min={16}
                  max={38}
                  value={badgeScale}
                  onChange={(e) => setBadgeScale(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'hsl(var(--primary))' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'hsl(var(--muted-foreground))', marginTop: 2 }}>
                  <span>{language === 'bn' ? 'ছোট (Compact)' : 'Compact'}</span>
                  <span>{language === 'bn' ? 'বড় (সহজ স্ক্যান)' : 'Large (Fast Scan)'}</span>
                </div>
              </div>
            </div>

            {/* Point 2: Colors & Callout Text */}
            <div style={{ marginBottom: 18, borderTop: '1px solid hsl(var(--border))', paddingTop: 16 }}>
              <div className="tool-point-item" style={{ marginBottom: 12 }}>
                <span className="tool-point-num">2</span>
                <div>
                  <strong style={{ display: 'block', fontSize: 13 }}>
                    {language === 'bn' ? 'Colors & Callout Text' : 'Colors & Callout Text'}
                  </strong>
                  <span style={{ fontSize: 11, color: 'hsl(var(--muted-foreground))' }}>
                    {language === 'bn' ? 'রং, টেক্সট ও অপাসিটি' : 'Colors, text & opacity'}
                  </span>
                </div>
              </div>

              <div style={{ paddingLeft: 4 }}>
                {/* Colors */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 600, marginBottom: 4 }}>
                      {language === 'bn' ? 'ব্যাজ ব্যাকগ্রাউন্ড:' : 'Badge BG:'}
                    </label>
                    <input
                      type="color"
                      value={badgeBgColor}
                      onChange={(e) => setBadgeBgColor(e.target.value)}
                      style={{ width: '100%', height: 34, padding: 2, borderRadius: 6, border: '1px solid hsl(var(--border))', background: 'none', cursor: 'pointer' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 600, marginBottom: 4 }}>
                      {language === 'bn' ? 'কিউআর কোড কালার:' : 'QR Color:'}
                    </label>
                    <input
                      type="color"
                      value={badgeQrColor}
                      onChange={(e) => setBadgeQrColor(e.target.value)}
                      style={{ width: '100%', height: 34, padding: 2, borderRadius: 6, border: '1px solid hsl(var(--border))', background: 'none', cursor: 'pointer' }}
                    />
                  </div>
                </div>

                {/* Callout Label Toggle */}
                <div style={{ marginBottom: 8 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>
                    <input
                      type="checkbox"
                      checked={showCalloutLabel}
                      onChange={(e) => setShowCalloutLabel(e.target.checked)}
                      style={{ accentColor: 'hsl(var(--primary))' }}
                    />
                    <span>{language === 'bn' ? '"SCAN ME" টেক্সট দেখান' : 'Show "SCAN ME" label'}</span>
                  </label>
                </div>

                {showCalloutLabel && (
                  <div style={{ marginBottom: 14 }}>
                    <input
                      type="text"
                      value={customCalloutText}
                      onChange={(e) => setCustomCalloutText(e.target.value)}
                      placeholder="SCAN ME"
                      maxLength={20}
                      className="input"
                      style={{ width: '100%', padding: '6px 10px', fontSize: 12, borderRadius: 6, border: '1px solid hsl(var(--border))', background: 'hsl(var(--secondary) / .4)' }}
                    />
                  </div>
                )}

                {/* Opacity */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 4 }}>
                    <span>{language === 'bn' ? 'ব্যাজ অপাসিটি:' : 'Badge Opacity:'}</span>
                    <span style={{ fontWeight: 700 }}>{badgeOpacity}%</span>
                  </div>
                  <input
                    type="range"
                    min={70}
                    max={100}
                    value={badgeOpacity}
                    onChange={(e) => setBadgeOpacity(Number(e.target.value))}
                    style={{ width: '100%', accentColor: 'hsl(var(--primary))' }}
                  />
                </div>
              </div>
            </div>

            {/* Scannability Guarantee Notice Card */}
            <div
              style={{
                marginTop: 16,
                padding: 12,
                borderRadius: 12,
                background: 'hsl(var(--secondary) / .5)',
                border: '1px solid hsl(var(--border))',
                display: 'flex',
                gap: 10,
              }}
            >
              <Info size={18} style={{ color: 'hsl(var(--primary))', flexShrink: 0, marginTop: 2 }} />
              <div>
                <strong style={{ fontSize: 12, display: 'block', marginBottom: 2 }}>
                  {language === 'bn' ? 'স্ক্যান নিশ্চয়তা' : 'Guaranteed Fast Scan'}
                </strong>
                <small style={{ color: 'hsl(var(--muted-foreground))', fontSize: 11, lineHeight: 1.4, display: 'block' }}>
                  {language === 'bn'
                    ? 'কিউআর কোডটি হাই এরর কারেকশন (H Level) দিয়ে তৈরি, ফলে মোবাইল ক্যামেরায় অনায়াসে স্ক্যান হবে।'
                    : 'ISO standard Level-H error correction and high contrast borders ensure instant smartphone scanning.'}
                </small>
              </div>
            </div>
          </aside>

          {/* ================= RIGHT SIDE: 1. Payload Type, 2. Photo Upload, 3. Preview & Download ================= */}
          <section className="workspace-main" style={{ padding: 24, borderRadius: 18, border: '1px solid hsl(var(--border))', background: 'hsl(var(--card))' }}>
            {/* 1. Payload Platform Selection */}
            <div
              style={{
                padding: 20,
                borderRadius: 16,
                background: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                marginBottom: 24,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                <span
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: '50%',
                    background: 'hsl(var(--primary))',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                >
                  1
                </span>
                <h3 style={{ fontSize: 16, margin: 0, fontWeight: 700 }}>
                  {language === 'bn' ? '১. কিউআর কোড প্ল্যাটফর্ম (Payload) ও লিংক দিন' : '1. Select Payload Type & Enter Details'}
                </h3>
              </div>

              {/* Responsive Platform Pills: 2 per line on mobile, 4 per line on laptop/desktop */}
              <div className="payload-pills-grid">
                {PAYLOAD_OPTIONS.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = payloadType === opt.type;
                  return (
                    <button
                      key={opt.type}
                      type="button"
                      onClick={() => {
                        setPayloadType(opt.type);
                        trackEvent('tool_process', { tool_id: tool.id, payload: opt.type });
                      }}
                      className="platform-pill"
                      style={{
                        padding: '12px 10px',
                        borderRadius: 12,
                        border: isSelected
                          ? `2px solid hsl(var(--primary))`
                          : '1px solid hsl(var(--border))',
                        background: isSelected
                          ? 'hsl(var(--primary) / .08)'
                          : 'hsl(var(--card))',
                        color: isSelected ? 'hsl(var(--primary))' : 'hsl(var(--foreground))',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8,
                        cursor: 'pointer',
                        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                        transform: isSelected ? 'scale(1.03) translateY(-2px)' : 'none',
                        boxShadow: isSelected
                          ? '0 6px 16px -4px hsl(var(--primary) / .25)'
                          : 'none',
                      }}
                    >
                      <div
                        style={{
                          width: 34,
                          height: 34,
                          borderRadius: 8,
                          background: isSelected ? 'hsl(var(--primary))' : `${opt.color}15`,
                          color: isSelected ? '#ffffff' : opt.color,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'transform 0.3s ease',
                        }}
                      >
                        <Icon size={18} />
                      </div>
                      <span style={{ fontSize: 12, fontWeight: isSelected ? 700 : 500, textAlign: 'center', whiteSpace: 'nowrap' }}>
                        {language === 'bn' ? opt.labelBn : opt.labelEn}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Dynamic Payload Form Input Area */}
              <div
                style={{
                  padding: 16,
                  borderRadius: 12,
                  background: 'hsl(var(--secondary) / .35)',
                  border: '1px solid hsl(var(--border))',
                }}
              >
                {/* 1. Website URL */}
                {payloadType === 'website' && (
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
                      {language === 'bn' ? 'ওয়েবসাইট লিংক (URL) দিন:' : 'Enter Destination Website URL:'}
                    </label>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <input
                        type="url"
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        placeholder="https://example.com"
                        className="input"
                        style={{ flex: 1, padding: '10px 14px', borderRadius: 8, border: '1px solid hsl(var(--border))', background: 'hsl(var(--card))' }}
                      />
                    </div>
                    <small style={{ display: 'block', marginTop: 6, color: 'hsl(var(--muted-foreground))', fontSize: 11 }}>
                      {language === 'bn' ? 'লিংক লিখলেই স্বয়ংক্রিয়ভাবে কিউআর কোড তৈরি হবে এবং নিচের প্রিভিউতে দেখা যাবে।' : 'QR code updates automatically as you type and renders into preview.'}
                    </small>
                  </div>
                )}

                {/* 2. Social Media Platform */}
                {payloadType === 'social' && (
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
                      {language === 'bn' ? 'সোশ্যাল নেটওয়ার্ক সিলেক্ট করুন:' : 'Select Social Network:'}
                    </label>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
                      {SOCIAL_NETWORKS.map((soc) => {
                        const isSocActive = socialNetwork === soc.id;
                        return (
                          <button
                            key={soc.id}
                            type="button"
                            onClick={() => setSocialNetwork(soc.id)}
                            style={{
                              padding: '6px 12px',
                              borderRadius: 8,
                              border: isSocActive ? '1px solid hsl(var(--primary))' : '1px solid hsl(var(--border))',
                              background: isSocActive ? 'hsl(var(--primary) / .1)' : 'hsl(var(--card))',
                              color: isSocActive ? 'hsl(var(--primary))' : 'hsl(var(--foreground))',
                              fontSize: 12,
                              fontWeight: 600,
                              display: 'flex',
                              alignItems: 'center',
                              gap: 6,
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                              transform: isSocActive ? 'translateY(-1px)' : 'none',
                            }}
                          >
                            <span dangerouslySetInnerHTML={{ __html: soc.iconSvg }} />
                            <span>{soc.name}</span>
                          </button>
                        );
                      })}
                    </div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>
                      {language === 'bn' ? 'ইউজারনেম বা আইডি দিন:' : 'Enter Profile Username / Handle:'}
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 12, color: 'hsl(var(--muted-foreground))', fontFamily: 'monospace' }}>
                        {SOCIAL_NETWORKS.find((s) => s.id === socialNetwork)?.prefix}
                      </span>
                      <input
                        type="text"
                        value={socialUsername}
                        onChange={(e) => setSocialUsername(e.target.value)}
                        placeholder={SOCIAL_NETWORKS.find((s) => s.id === socialNetwork)?.placeholder}
                        className="input"
                        style={{ flex: 1, padding: '8px 12px', borderRadius: 8, border: '1px solid hsl(var(--border))', background: 'hsl(var(--card))' }}
                      />
                    </div>
                  </div>
                )}

                {/* 3. WhatsApp Direct Chat */}
                {payloadType === 'whatsapp' && (
                  <div style={{ display: 'grid', gap: 10 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
                        {language === 'bn' ? 'হোয়াটসঅ্যাপ ফোন নম্বর (কান্ট্রি কোড সহ):' : 'WhatsApp Phone Number (with Country Code):'}
                      </label>
                      <input
                        type="tel"
                        value={waNumber}
                        onChange={(e) => setWaNumber(e.target.value)}
                        placeholder="+8801700000000"
                        className="input"
                        style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid hsl(var(--border))', background: 'hsl(var(--card))' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
                        {language === 'bn' ? 'ডিফল্ট মেসেজ (ঐচ্ছিক):' : 'Pre-filled Welcome Message (Optional):'}
                      </label>
                      <input
                        type="text"
                        value={waMessage}
                        onChange={(e) => setWaMessage(e.target.value)}
                        placeholder="Hello! I scanned your Photo QR Code."
                        className="input"
                        style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid hsl(var(--border))', background: 'hsl(var(--card))' }}
                      />
                    </div>
                  </div>
                )}

                {/* 4. Wi-Fi Auto-Connect */}
                {payloadType === 'wifi' && (
                  <div style={{ display: 'grid', gap: 10 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 10 }}>
                      <div>
                        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
                          {language === 'bn' ? 'ওয়াই-ফাই নেটওয়ার্ক নাম (SSID):' : 'Wi-Fi Network Name (SSID):'}
                        </label>
                        <input
                          type="text"
                          value={wifiSsid}
                          onChange={(e) => setWifiSsid(e.target.value)}
                          placeholder="Home_WiFi_5G"
                          className="input"
                          style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid hsl(var(--border))', background: 'hsl(var(--card))' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
                          {language === 'bn' ? 'সিকিউরিটি:' : 'Security:'}
                        </label>
                        <select
                          value={wifiType}
                          onChange={(e) => setWifiType(e.target.value as any)}
                          style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid hsl(var(--border))', background: 'hsl(var(--card))', color: 'hsl(var(--foreground))' }}
                        >
                          <option value="WPA">WPA / WPA2</option>
                          <option value="WEP">WEP</option>
                          <option value="nopass">None (Open)</option>
                        </select>
                      </div>
                    </div>
                    {wifiType !== 'nopass' && (
                      <div>
                        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
                          {language === 'bn' ? 'ওয়াই-ফাই পাসওয়ার্ড:' : 'Wi-Fi Password:'}
                        </label>
                        <input
                          type="text"
                          value={wifiPass}
                          onChange={(e) => setWifiPass(e.target.value)}
                          placeholder="Password"
                          className="input"
                          style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid hsl(var(--border))', background: 'hsl(var(--card))' }}
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* 5. Phone Call */}
                {payloadType === 'phone' && (
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
                      {language === 'bn' ? 'ফোন নম্বর:' : 'Telephone Number:'}
                    </label>
                    <input
                      type="tel"
                      value={phoneInput}
                      onChange={(e) => setPhoneInput(e.target.value)}
                      placeholder="+8801700000000"
                      className="input"
                      style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid hsl(var(--border))', background: 'hsl(var(--card))' }}
                    />
                  </div>
                )}

                {/* 6. Email */}
                {payloadType === 'email' && (
                  <div style={{ display: 'grid', gap: 10 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
                        {language === 'bn' ? 'ইমেইল ঠিকানা:' : 'Email Address:'}
                      </label>
                      <input
                        type="email"
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        placeholder="hello@example.com"
                        className="input"
                        style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid hsl(var(--border))', background: 'hsl(var(--card))' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
                        {language === 'bn' ? 'সাবজেক্ট (ঐচ্ছিক):' : 'Default Subject (Optional):'}
                      </label>
                      <input
                        type="text"
                        value={emailSubject}
                        onChange={(e) => setEmailSubject(e.target.value)}
                        placeholder="Inquiry from Photo QR"
                        className="input"
                        style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid hsl(var(--border))', background: 'hsl(var(--card))' }}
                      />
                    </div>
                  </div>
                )}

                {/* 7. Plain Text */}
                {payloadType === 'text' && (
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
                      {language === 'bn' ? 'টেক্সট বার্তা:' : 'Plain Text or Note:'}
                    </label>
                    <textarea
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                      rows={3}
                      placeholder="Enter custom text message or serial number..."
                      className="input"
                      style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid hsl(var(--border))', background: 'hsl(var(--card))', resize: 'vertical' }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* 2. Photo Upload Box */}
            <div
              className={`drop-target ${file ? 'has-file' : ''}`}
              style={{
                border: '2px dashed hsl(var(--border))',
                borderRadius: 16,
                padding: file ? '20px' : '36px 20px',
                textAlign: 'center',
                background: file ? 'hsl(var(--card))' : 'hsl(var(--card) / .6)',
                transition: 'all 0.2s ease',
                marginBottom: 24,
              }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                handleFileChange(e.dataTransfer.files[0]);
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                style={{ display: 'none' }}
                onChange={(e) => handleFileChange(e.target.files?.[0])}
              />

              {!file ? (
                <div>
                  <div
                    style={{
                      width: 54,
                      height: 54,
                      margin: '0 auto 14px',
                      borderRadius: '50%',
                      background: 'hsl(var(--primary) / .1)',
                      color: 'hsl(var(--primary))',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Upload size={24} />
                  </div>
                  <h3 style={{ fontSize: 17, marginBottom: 6, fontWeight: 700 }}>
                    {language === 'bn' ? '২. আপনার ছবিটি আপলোড করুন' : '2. Upload your photo'}
                  </h3>
                  <p style={{ color: 'hsl(var(--muted-foreground))', fontSize: 13, marginBottom: 14 }}>
                    {language === 'bn' ? 'JPG, PNG অথবা WebP ছবি ড্র্যাগ করুন অথবা ক্লিক করে পছন্দ করুন।' : 'Drop a photo here or click to browse. Works with JPG, PNG & WebP.'}
                  </p>
                  <button
                    type="button"
                    className="button button-primary"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload size={15} /> {language === 'bn' ? 'ছবি নির্বাচন করুন' : 'Choose Photo'}
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div
                      style={{
                        width: 46,
                        height: 46,
                        borderRadius: 10,
                        background: 'hsl(var(--primary) / .12)',
                        color: 'hsl(var(--primary))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <FileImage size={22} />
                    </div>
                    <div style={{ textAlign: 'left' }}>
                      <strong style={{ display: 'block', fontSize: 14 }}>{file.name}</strong>
                      <span style={{ fontSize: 12, color: 'hsl(var(--muted-foreground))' }}>
                        {(file.size / (1024 * 1024)).toFixed(2)} MB
                        {imageSize && ` · ${imageSize.width} × ${imageSize.height}px`}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="button button-ghost"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload size={14} /> {language === 'bn' ? 'অন্য ছবি পছন্দ করুন' : 'Change Photo'}
                  </button>
                </div>
              )}
            </div>

            {/* 3. Live Preview & Automatic Output Area & Download Button Directly Underneath */}
            <div style={{ marginTop: 24, marginBottom: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: '50%',
                      background: 'hsl(var(--primary))',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 12,
                      fontWeight: 700,
                    }}
                  >
                    3
                  </span>
                  <h4 style={{ fontSize: 15, fontWeight: 700, margin: 0 }}>
                    {language === 'bn' ? '৩. প্রিভিউ ও ডাউনলোড' : '3. Live Preview & Download'}
                  </h4>
                </div>
                {outputUrl && (
                  <span style={{ fontSize: 12, color: 'hsl(var(--primary))', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <CheckCircle2 size={14} /> {language === 'bn' ? 'সরাসরি স্ক্যান টেস্ট করুন' : 'Ready to scan'}
                  </span>
                )}
              </div>

              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  borderRadius: 14,
                  overflow: 'hidden',
                  background: 'hsl(var(--secondary) / .3)',
                  border: '1px solid hsl(var(--border))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: 260,
                }}
              >
                {/* Case 1: Composite QR output is ready */}
                {outputUrl ? (
                  <img
                    src={outputUrl}
                    alt="Photo with embedded scannable QR Code"
                    style={{
                      maxWidth: '100%',
                      maxHeight: 500,
                      objectFit: 'contain',
                      display: 'block',
                      margin: '0 auto',
                    }}
                  />
                ) : previewUrl ? (
                  /* Case 2: Photo uploaded, awaiting link/payload */
                  <div style={{ position: 'relative', maxWidth: '100%', display: 'inline-block' }}>
                    <img
                      src={previewUrl}
                      alt="Uploaded user original"
                      style={{
                        maxWidth: '100%',
                        maxHeight: 460,
                        objectFit: 'contain',
                        display: 'block',
                      }}
                    />
                    {!hasValidPayload && (
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          background: 'rgba(0,0,0,0.4)',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#fff',
                          padding: 16,
                          textAlign: 'center',
                          backdropFilter: 'blur(2px)',
                        }}
                      >
                        <QrCode size={36} style={{ marginBottom: 8, opacity: 0.9 }} />
                        <p style={{ fontWeight: 600, fontSize: 14, margin: 0 }}>
                          {language === 'bn' ? 'কিউআর কোড তৈরি করতে ওপরের বক্সে লিংক দিন' : 'Enter a link above to generate the QR Code badge'}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Case 3: No photo uploaded yet */
                  <div style={{ textAlign: 'center', padding: 40, color: 'hsl(var(--muted-foreground))' }}>
                    <QrCode size={48} style={{ margin: '0 auto 12px', opacity: 0.35 }} />
                    <p style={{ fontSize: 14, margin: 0 }}>
                      {language === 'bn' ? 'ছবি আপলোড করলে সরাসরি এখানে ছবি শো করবে' : 'Upload a photo above to see instant preview'}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* 4. Download Button - Only visible after user provides valid link / payload */}
            {hasValidPayload && outputUrl && (
              <div
                style={{
                  marginTop: 22,
                  padding: 18,
                  borderRadius: 14,
                  background: 'hsl(var(--primary) / .08)',
                  border: '1px solid hsl(var(--primary) / .25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: 14,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 10,
                      background: 'hsl(var(--primary))',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Check size={22} />
                  </div>
                  <div>
                    <strong style={{ display: 'block', fontSize: 15 }}>
                      {language === 'bn' ? 'ছবি কিউআর কোড প্রস্তুত!' : 'Photo QR Code Ready!'}
                    </strong>
                    <span style={{ fontSize: 12, color: 'hsl(var(--muted-foreground))' }}>
                      {imageSize?.width} × {imageSize?.height}px · {corner.replace('-', ' ').toUpperCase()} BADGE
                    </span>
                  </div>
                </div>
                <a
                  href={outputUrl}
                  download={`photo-qr-${payloadType}-${Date.now()}.jpg`}
                  className="button button-primary"
                  style={{ padding: '10px 24px', fontSize: 14 }}
                  onClick={() => trackEvent('tool_download', { tool_id: tool.id })}
                >
                  <Download size={16} /> {language === 'bn' ? 'ছবি ডাউনলোড করুন' : 'Download Photo'}
                </a>
              </div>
            )}

            {/* 4. How To Use This Tool - Detailed Instructions for New Users */}
            <div className="tool-content" style={{ marginTop: 40, borderTop: '1px solid hsl(var(--border))', paddingTop: 28 }}>
              <h2>{language === 'bn' ? '৪. কীভাবে এই টুলটি ব্যবহার করবেন (সম্পূর্ণ গাইড)' : '4. How to Use Photo QR Code (Complete Guide)'}</h2>
              <ol>
                <li>
                  <strong>{language === 'bn' ? '১ম ধাপ (পেলোড নির্বাচন):' : 'Step 1 (Select Payload):'}</strong>{' '}
                  {language === 'bn'
                    ? '১ নম্বর ধাপে ওয়েবসাইট লিংক, সোশ্যাল মিডিয়া, হোয়াটসঅ্যাপ, অথবা ওয়াই-ফাই নির্বাচন করুন এবং আপনার লিংক বা নম্বরটি বক্সে প্রবেশ করান।'
                    : 'Select your destination platform in Step 1 (Website, Social Media, WhatsApp, Wi-Fi, etc.) and type your URL, phone number, or credentials.'}
                </li>
                <li>
                  <strong>{language === 'bn' ? '২য় ধাপ (ছবি আপলোড):' : 'Step 2 (Upload Photo):'}</strong>{' '}
                  {language === 'bn'
                    ? '২ নম্বর ধাপে "ছবি নির্বাচন করুন" বাটনে ক্লিক করে বা ড্র্যাগ-অ্যান্ড-ড্রপ করে আপনার কাঙ্ক্ষিত ছবি (JPG, PNG, WebP) আপলোড করুন।'
                    : 'Click "Choose Photo" or drag and drop your photo (JPG, PNG, WebP) in Step 2. The photo will load instantly into the preview screen.'}
                </li>
                <li>
                  <strong>{language === 'bn' ? '৩য় ধাপ (বাম পাশের সেটিংস ও ডিজাইন):' : 'Step 3 (Configure Badge in Left Sidebar):'}</strong>{' '}
                  {language === 'bn'
                    ? 'বাম পাশের ফিক্সড "Tool Points" প্যানেল থেকে ছবির কোন কোণায় ব্যাজ বসবে (যেমন Top-Right, Bottom-Right) তা বেছে নিন এবং কালার ও সাইজ অ্যাডজাস্ট করুন।'
                    : 'Use the left sidebar panel to choose which corner the QR badge should sit in, adjust the badge size percentage, padding, and colors.'}
                </li>
                <li>
                  <strong>{language === 'bn' ? '৪র্থ ধাপ (প্রিভিউ ও ডাউনলোড):' : 'Step 4 (Preview & Instant Download):'}</strong>{' '}
                  {language === 'bn'
                    ? 'লিংক এবং ছবি উভয়ই দেওয়ার সাথে সাথেই ৩ নম্বর প্রিভিউ বক্সে ছবির কর্নারে স্ক্যানযোগ্য আসল কিউআর কোড দেখা যাবে এবং প্রিভিউ এর ঠিক নিচে "ছবি ডাউনলোড করুন" সবুজ বাটন দৃশ্যমান হবে।'
                    : 'As soon as both photo and link are entered, the composite image displays in Step 3 Live Preview, and the Download Photo button appears right underneath it.'}
                </li>
              </ol>

              <h2>{copy.privacyAndLimitations}</h2>
              <p>{tool.content.privacy}</p>
              <p>{tool.content.limitations}</p>
            </div>

            {/* 5. Related Tools Section */}
            <div style={{ marginTop: 44, borderTop: '1px solid hsl(var(--border))', paddingTop: 32 }}>
              <div className="section-heading">
                <div>
                  <span className="eyebrow">{copy.exploreHeader}</span>
                  <h2>{language === 'bn' ? '৫. সম্পর্কিত অন্যান্য টুলস' : '5. Related Tools'}</h2>
                </div>
              </div>
              <div className="tool-grid" style={{ marginTop: 20 }}>
                {getRelatedTools(tool).map((candidate) => {
                  const Icon = candidate.icon;
                  return (
                    <Link
                      key={candidate.id}
                      to={candidate.route}
                      className="tool-card"
                      style={{ '--tool-color': candidate.color } as any}
                    >
                      <div>
                        <span className="tool-icon">
                          <Icon size={21} />
                        </span>
                        <h3>{candidate.name}</h3>
                        <p>{candidate.description}</p>
                      </div>
                      <div className="tool-card-foot">
                        <span>{candidate.status === 'live' ? copy.liveNow : copy.planned}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* 6. FAQ Section */}
            <div className="tool-content" style={{ marginTop: 44, borderTop: '1px solid hsl(var(--border))', paddingTop: 32 }}>
              <h2>{language === 'bn' ? '৬. সচরাচর জিজ্ঞাসিত প্রশ্ন (FAQ)' : '6. Frequently Asked Questions (FAQ)'}</h2>
              <div className="faq-list">
                {tool.content.faq.map(({ question, answer }) => (
                  <details key={question} className="tool-faq">
                    <summary>{question}</summary>
                    <p>{answer}</p>
                  </details>
                ))}
              </div>
            </div>

            {/* Sponsored Ad Slot */}
            <div style={{ marginTop: 32 }}>
              <AdSlot enabled={true} slot={adConfig.toolSlot} label="Sponsored Ad" />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

export default PhotoQrCodeTool;
