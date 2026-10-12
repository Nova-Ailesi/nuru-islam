/**
 * Pronunciation Analysis & Speech Feedback Engine
 * 
 * Analyzes spoken Quranic verses and daily namaz duas using Web Audio API
 * and Web Speech API, scoring pronunciation accuracy, identifying tajweed nuances,
 * and generating actionable feedback for better recitation.
 */

export interface WordAnalysisResult {
  word: string;
  transliteration: string;
  status: 'perfect' | 'good' | 'needs_practice';
  matchScore: number; // 0 - 100
  tajweedNote?: string;
}

export interface PronunciationScoreResult {
  overallScore: number; // 0 - 100
  grade: 'Mükemmel' | 'Çok İyi' | 'Geliştirilmeli' | 'Tekrar Deneyin';
  gradeColor: string;
  wordResults: WordAnalysisResult[];
  clarityScore: number; // 0 - 100
  tempoScore: number; // 0 - 100
  tempoFeedback: string;
  tajweedTips: string[];
  recognizedTranscript: string;
  recordingDurationSec: number;
}

// Tajweed and phonetic rules database for targeted words
const TAJWEED_WORD_RULES: Record<string, string> = {
  // Fatiha
  'bismillah': 'Besmelede "b" harfi ince, "lam" harfi lafzullah kuralları gereği ince okunur.',
  'er-rahman': '"Râ" harfi şeddeli olup kalın telaffuz edilmelidir.',
  'er-rahim': 'Sonundaki "mim" harfinde durulurken medd-i ârız 4 elif miktarı uzatılabilir.',
  'elhamdu': '"Ha" (ح) harfi göğüsten değil boğazın tam ortasından hırıltısız çıkarılmalıdır.',
  'lillahi': 'Lafzullah\'ın lamı esreli olduğu için ince okunmalıdır.',
  'rabbil-alemin': '"Ayn" (ع) harfi boğaz ortasından belirgin bir sıkma ile seslendirilir.',
  'maliki': '"Mim" harfinde bir elif miktarı meddi tabii yapılır.',
  'yevmiddin': 'Dâl harfi şeddeli olup ince ve keskin sesle okunmalıdır.',
  'iyyake': '"Yâ" harfindeki şeddeye dikkat edilmeli, baskılı ve net telaffuz edilmelidir.',
  'na\'budu': '"Ayn" harfinin mahreci boğaz ortasından net verilmeli, nun harfiyle bitişik çıkarılmalıdır.',
  've-iyyake': '"Yâ" harfindeki şedde atlanmamalıdır.',
  'neste\'in': '"Ayn" harfi hafifçe tutulur, durakta medd-i ârız uygulanır.',
  'ihdina': '"Hâ" harfi göğüsten çıkan yumuşak h sesidir.',
  'es-sirata': '"Sâd" (ص) ve "Tâ" (ط) harfleri kalın okunmalı, ince sin ve te ile karıştırılmamalıdır.',
  'el-mustekim': '"Kaf" harfi boğaz dibinden dolgun ve kalın çıkarılır.',
  'siratallezine': '"Zâl" (ذ) harfi peltek okunmalıdır.',
  'en\'amte': '"Nun" harfinde İzhâr yapılır, ses genizde tutulmadan netçe belirtilir.',
  'aleyhim': '"Mim" harfinde izhar-ı şefevi uygulanır.',
  'gayril': '"Gayn" (غ) boğazın üst kısmından yumuşak ve hırıltılı bir tonla çıkarılır.',
  'magdubi': '"Gayn" ve "Dâd" (ض) harfleri kalındır, dâd harfinde dilin yanı üst azı dişlerine yaslanır.',
  've-leddallin': 'Medd-i Lâzım bulunur; 4 elif miktarı (yaklaşık 3-4 saniye) çekilmesi vaciptir.',

  // Ihlas
  'kul': '"Kaf" harfi boğaz dibinden tok ve kalın sesle çıkarılmalıdır.',
  'huvallahu': '"He" harfi hafif, Lafzullah kalın okunur.',
  'ehad': 'Durakta "Dâl" harfinde kuvvetli "Kalkale" (sesi titretme) yapılır.',
  'allahus-samed': '"Sâd" dolgun okunur, dâl harfinde kalkale yapılır.',
  'lem-yelid': '"Dâl" harfinde hafif kalkale yapılır.',
  've-lem-yuled': '"Dâl" harfinde kalkale yapılır, meddi tabii korunur.',
  'kufuven': '"Fâ" harfi ötreli değil fethalı okunmalıdır.',

  // Subhaneke
  'subhaneke': '"Bâ" harfinde hafif kalkale yapılır.',
  'allahumme': '"Mim" harfinde şeddeli gunne (geniz sesi) 1.5 elif miktarı tutulur.',
  'tebarekesmuke': '"Kâf" harfi ince okunmalıdır.',
  'te\'ala': '"Ayn" harfi boğaz ortasından çıkarılır.',
  'cedduke': '"Dâl" harfi şeddelidir, peltek değildir.',
  'gayruk': '"Gayn" harfi kalın okunur.',

  // Ettehiyyatu
  'et-tahiyyatu': '"Hâ" (ح) harfi boğaz ortasından berrak nefesle çıkar.',
  'es-selamu': '"Sîn" harfi ince ve keskindir.',
  'eyyuhen-nebiyyu': '"Yâ" ve "Nûn" harfleri şeddelidir.',
  've-berakatuh': '"Tâ" harfi durakta yumuşak "he" sesine dönüşür.',
  'ibadillahis-salihin': '"Sâd" harfi dolgun ve kalın sesle telaffuz edilir.',
  'eshedu': '"Şîn" harfinde tefeşşi (sesin ağızda yayılması) kuralı uygulanır.'
};

/**
 * Normalizes text for robust phonetic comparison
 */
export function normalizePhoneticText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[َُِّْٰٓـ]/g, '') // remove arabic diacritics
    .replace(/[âä]/g, 'a')
    .replace(/[îï]/g, 'i')
    .replace(/[ûü]/g, 'u')
    .replace(/['’`‘]/g, '')
    .replace(/[-]/g, ' ')
    .replace(/[.,:;!?()]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Levenshtein distance similarity (0 to 1)
 */
function calculateSimilarity(str1: string, str2: string): number {
  const s1 = normalizePhoneticText(str1);
  const s2 = normalizePhoneticText(str2);

  if (s1 === s2) return 1.0;
  if (!s1.length) return 0;
  if (!s2.length) return 0;

  // Direct substring or inclusion boost
  if (s1.includes(s2) || s2.includes(s1)) {
    const minLen = Math.min(s1.length, s2.length);
    const maxLen = Math.max(s1.length, s2.length);
    return 0.85 + (0.15 * (minLen / maxLen));
  }

  const matrix: number[][] = [];
  for (let i = 0; i <= s2.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= s1.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= s2.length; i++) {
    for (let j = 1; j <= s1.length; j++) {
      if (s2.charAt(i - 1) === s1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  const distance = matrix[s2.length][s1.length];
  const maxLen = Math.max(s1.length, s2.length);
  return Math.max(0, 1 - distance / maxLen);
}

class PronunciationAnalysisService {
  /**
   * Analyzes recognized user speech against expected target text
   */
  public analyzeRecitation(
    targetArabic: string,
    targetTransliteration: string,
    recognizedText: string,
    audioDurationSec: number,
    averageDecibels: number = 65
  ): PronunciationScoreResult {
    const cleanTargetTrans = targetTransliteration.replace(/[.,:;!?()]/g, '').trim();
    const targetWords = cleanTargetTrans.split(/\s+/).filter(Boolean);
    const spokenWords = recognizedText.replace(/[.,:;!?()]/g, '').trim().split(/\s+/).filter(Boolean);

    let totalWordScore = 0;
    const wordResults: WordAnalysisResult[] = [];

    targetWords.forEach((word) => {
      const cleanWord = normalizePhoneticText(word);
      let bestSimilarity = 0;

      // Find best match in spoken words
      spokenWords.forEach((spoken) => {
        const sim = calculateSimilarity(cleanWord, spoken);
        if (sim > bestSimilarity) {
          bestSimilarity = sim;
        }
      });

      // If user spoke something vaguely matching or exact
      const wordScore = Math.round(bestSimilarity * 100);
      totalWordScore += wordScore;

      let status: 'perfect' | 'good' | 'needs_practice' = 'needs_practice';
      if (wordScore >= 85) {
        status = 'perfect';
      } else if (wordScore >= 55) {
        status = 'good';
      }

      // Check specific tajweed note
      const tajweedNote = TAJWEED_WORD_RULES[cleanWord] || undefined;

      wordResults.push({
        word,
        transliteration: word,
        status,
        matchScore: wordScore,
        tajweedNote
      });
    });

    const averageScore = targetWords.length > 0
      ? Math.round(totalWordScore / targetWords.length)
      : 80;

    // Tempo / Cadence analysis (Solemn recitation: approx 1 - 2 words per second)
    const expectedDuration = targetWords.length * 0.9;
    let tempoScore = 95;
    let tempoFeedback = 'Huşulu ve ideal kıraat ritmi.';

    if (audioDurationSec < expectedDuration * 0.5 && targetWords.length > 2) {
      tempoScore = 70;
      tempoFeedback = 'Kıraat ritminiz biraz hızlı. Kelimelerin ve medlerin hakkını vererek daha yavaş okumanız önerilir.';
    } else if (audioDurationSec > expectedDuration * 2.8) {
      tempoScore = 80;
      tempoFeedback = 'Kıraat ritminiz oldukça yavaş. Kelimeler arası durakları daha akıcı hale getirebilirsiniz.';
    }

    // Audio clarity based on decibels
    let clarityScore = 90;
    if (averageDecibels < 35) {
      clarityScore = 65;
    } else if (averageDecibels > 85) {
      clarityScore = 80;
    }

    // Overall weighted score
    const finalScore = Math.min(
      100,
      Math.max(
        15,
        Math.round(averageScore * 0.7 + tempoScore * 0.15 + clarityScore * 0.15)
      )
    );

    let grade: 'Mükemmel' | 'Çok İyi' | 'Geliştirilmeli' | 'Tekrar Deneyin' = 'Tekrar Deneyin';
    let gradeColor = 'text-rose-500';

    if (finalScore >= 88) {
      grade = 'Mükemmel';
      gradeColor = 'text-emerald-500';
    } else if (finalScore >= 75) {
      grade = 'Çok İyi';
      gradeColor = 'text-teal-500';
    } else if (finalScore >= 55) {
      grade = 'Geliştirilmeli';
      gradeColor = 'text-amber-500';
    }

    // Extract Tajweed tips for words that need practice
    const tajweedTips: string[] = [];
    wordResults.forEach((wr) => {
      if (wr.tajweedNote && (wr.status === 'needs_practice' || wr.status === 'good')) {
        if (!tajweedTips.includes(wr.tajweedNote)) {
          tajweedTips.push(wr.tajweedNote);
        }
      }
    });

    if (tajweedTips.length === 0) {
      tajweedTips.push('Harflerin mahreçleri (çıkış yerleri) ve uzatma süreleri (medler) son derece başarılı.');
    }

    return {
      overallScore: finalScore,
      grade,
      gradeColor,
      wordResults,
      clarityScore,
      tempoScore,
      tempoFeedback,
      tajweedTips,
      recognizedTranscript: recognizedText || cleanTargetTrans,
      recordingDurationSec: Math.round(audioDurationSec * 10) / 10
    };
  }

  /**
   * Generates simulated demo analysis if microphone speech recognition is restricted
   */
  public generateDemoAnalysis(
    targetArabic: string,
    targetTransliteration: string
  ): PronunciationScoreResult {
    const words = targetTransliteration.replace(/[.,:;!?()]/g, '').trim().split(/\s+/);
    const mockDuration = words.length * 1.1;

    // Simulate high-quality reading with 1-2 minor improvement tips
    const recognizedMock = words.join(' ');
    return this.analyzeRecitation(
      targetArabic,
      targetTransliteration,
      recognizedMock,
      mockDuration,
      68
    );
  }
}

export const pronunciationAnalysisService = new PronunciationAnalysisService();
