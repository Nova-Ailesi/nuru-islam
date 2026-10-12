/**
 * Ad Service & Placement Controller — REKLAMSIZ MODEL (v1.0.0)
 * Play Store "Reklamsız" beyanı ile uyumlu: tüm slotlar varsayılan olarak gizli.
 * Sponsorlu içerik istenirse setIsAdFree(false) ile açılabilir, ancak o durumda
 * data-safety.json + privacy-policy güncellenmelidir.
 */

const AD_FREE_STORAGE_KEY = 'nur_islam_ad_free_status_v1';

export interface SponsoredItem {
  id: string;
  title: string;
  sponsorName: string;
  description: string;
  callToAction: string;
  badge: string; // e.g. "Reklam" or "Sponsorlu"
  linkUrl: string;
}

export const SAMPLE_SPONSORED_ITEMS: SponsoredItem[] = [
  {
    id: 'sponsor-1',
    title: 'İyilik ve İnfak: Yetimlere Sıcak Bir Yuva',
    sponsorName: 'Türkiye Diyanet Vakfı',
    description: 'Dünyanın dört bir yanındaki ihtiyaç sahiplerine ve yetimlere zekat ve bağışlarınızla destek olun.',
    callToAction: 'Destek Olun',
    badge: 'Sponsorlu',
    linkUrl: 'https://tdv.org'
  },
  {
    id: 'sponsor-2',
    title: 'Diyanet İslam Ansiklopedisi Dijital Kütüphane',
    sponsorName: 'İslam Araştırmaları Merkezi',
    description: '44 ciltlik devasa İslami kaynak ve güvenilir ilmi araştırmalar tamamen ücretsiz cebinizde.',
    callToAction: 'Keşfedin',
    badge: 'Reklam',
    linkUrl: 'https://islamansiklopedisi.org.tr'
  },
  {
    id: 'sponsor-3',
    title: 'Hac ve Umre Rehber Kitapları & Dijital Yayınlar',
    sponsorName: 'Diyanet Yayınları',
    description: 'Kutsal topraklara yapacağınız manevi yolculuk için resimli dualar ve menasik ilmihali.',
    callToAction: 'İnceleyin',
    badge: 'Sponsorlu',
    linkUrl: 'https://yayin.diyanet.gov.tr'
  }
];

class AdService {
  private isAdFree: boolean = true;
  private lastInterstitialTime: number = 0;

  constructor() {
    try {
      const saved = localStorage.getItem(AD_FREE_STORAGE_KEY);
      // Varsayılan reklamsız; kayıtlı değer yoksa true kalır
      this.isAdFree = saved === null ? true : saved === 'true';
    } catch {
      this.isAdFree = true;
    }
  }

  public getIsAdFree(): boolean {
    return this.isAdFree;
  }

  public setIsAdFree(status: boolean): void {
    this.isAdFree = status;
    try {
      localStorage.setItem(AD_FREE_STORAGE_KEY, String(status));
    } catch {
      // Ignore
    }
  }

  /**
   * Checks if an interstitial ad is eligible to show (at least 3 minutes between non-intrusive actions).
   * Note: NEVER triggers during active prayer or live recitation.
   */
  public canShowInterstitial(isDuringActivePrayer: boolean = false): boolean {
    if (this.isAdFree || isDuringActivePrayer) return false;
    const now = Date.now();
    const minCooldownMs = 3 * 60 * 1000; // 3 minutes cooldown
    if (now - this.lastInterstitialTime > minCooldownMs) {
      this.lastInterstitialTime = now;
      return true;
    }
    return false;
  }
}

export const adService = new AdService();
