import React, { useState, useEffect } from 'react';
import {
  Compass,
  MapPin,
  CheckCircle2,
  RotateCw,
  Info,
  ShieldCheck
} from 'lucide-react';
import { CityLocation, calculateQiblaAngle, calculateDistanceToKaaba } from '../services/prayerTimeCalculator';
import { audioService } from '../services/audioService';

interface QiblaCompassViewProps {
  city: CityLocation;
}

export const QiblaCompassView: React.FC<QiblaCompassViewProps> = ({ city }) => {
  const [deviceHeading, setDeviceHeading] = useState<number>(0);
  const [isSensorActive, setIsSensorActive] = useState<boolean>(false);
  const [sensorPermissionNeeded, setSensorPermissionNeeded] = useState<boolean>(false);
  const [hasVibratedOnMatch, setHasVibratedOnMatch] = useState<boolean>(false);

  // Exact Qibla bearing from current location
  const qiblaAngle = Math.round(calculateQiblaAngle(city.latitude, city.longitude));
  const distanceKm = calculateDistanceToKaaba(city.latitude, city.longitude);

  // Calculate relative difference between device heading and Kaaba
  // When relativeDiff is near 0 (or 360), the top of the phone is pointing directly to Kaaba!
  const relativeDiff = (qiblaAngle - deviceHeading + 360) % 360;
  const isAligned = Math.abs(relativeDiff <= 180 ? relativeDiff : 360 - relativeDiff) <= 5;

  // Handle Device Orientation
  const handleOrientation = React.useCallback((e: DeviceOrientationEvent) => {
    let heading = 0;
    // iOS webkitCompassHeading
    if ('webkitCompassHeading' in e && typeof (e as unknown as { webkitCompassHeading: number }).webkitCompassHeading === 'number') {
      heading = (e as unknown as { webkitCompassHeading: number }).webkitCompassHeading;
      setIsSensorActive(true);
    } else if (e.alpha !== null) {
      // Android / Standard
      heading = 360 - e.alpha;
      setIsSensorActive(true);
    }
    setDeviceHeading(Math.round(heading));
  }, []);

  // Listen to Device Orientation
  useEffect(() => {
    if (typeof window !== 'undefined' && window.DeviceOrientationEvent) {
      // Check iOS 13+ permission
      if (
        typeof (DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> })
          .requestPermission === 'function'
      ) {
        setSensorPermissionNeeded(true);
      } else {
        window.addEventListener('deviceorientation', handleOrientation, true);
        window.addEventListener('deviceorientationabsolute', handleOrientation, true);
      }
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('deviceorientation', handleOrientation, true);
        window.removeEventListener('deviceorientationabsolute', handleOrientation, true);
      }
    };
  }, [handleOrientation]);

  // Vibrate phone when perfectly aligned
  useEffect(() => {
    if (isAligned) {
      if (!hasVibratedOnMatch) {
        if ('vibrate' in navigator) {
          try {
            navigator.vibrate([60, 40, 80]);
          } catch {
            // ignore
          }
        }
        audioService.playTasbihClick();
        setHasVibratedOnMatch(true);
      }
    } else {
      setHasVibratedOnMatch(false);
    }
  }, [isAligned, hasVibratedOnMatch]);

  const requestIOSSensor = async () => {
    if (
      typeof (DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> })
        .requestPermission === 'function'
    ) {
      try {
        const response = await (DeviceOrientationEvent as unknown as { requestPermission: () => Promise<string> }).requestPermission();
        if (response === 'granted') {
          setSensorPermissionNeeded(false);
          setIsSensorActive(true);
          window.addEventListener('deviceorientation', handleOrientation, true);
          window.addEventListener('deviceorientationabsolute', handleOrientation, true);
        }
      } catch {
        // permission denied
      }
    }
  };

  return (
    <div className="space-y-4 pb-20 max-w-lg mx-auto text-center">
      {/* City & Qibla Metadata */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-3xl p-5 shadow-xs">
        <div className="flex items-center justify-center gap-1.5 text-xs text-stone-500 mb-1">
          <MapPin className="w-3.5 h-3.5 text-emerald-600" />
          <span>{city.name}, {city.country}</span>
        </div>
        <h2 className="text-xl font-bold text-stone-900 dark:text-white">
          Kıble Açısı: <span className="text-emerald-600 dark:text-emerald-400 font-mono">{qiblaAngle}°</span>
        </h2>
        <p className="text-xs text-stone-500 mt-1">
          Mekke-i Mükerreme Kâbe'ye kuş uçuşu mesafe: <span className="font-semibold text-stone-700 dark:text-stone-300 font-mono">{distanceKm.toLocaleString()} km</span>
        </p>

        {sensorPermissionNeeded && (
          <button
            onClick={requestIOSSensor}
            className="mt-3 py-2 px-4 bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer hover:bg-emerald-500 transition-colors"
          >
            Pusula Sensörünü Etkinleştir
          </button>
        )}
      </div>

      {/* Alignment Status Banner */}
      <div
        className={`p-3.5 rounded-2xl border transition-all duration-300 flex items-center justify-center gap-2 text-xs font-bold ${
          isAligned
            ? 'bg-emerald-500 text-white border-emerald-400 shadow-md scale-102 ring-4 ring-emerald-500/20'
            : 'bg-stone-100 dark:bg-stone-900 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-800'
        }`}
      >
        {isAligned ? (
          <>
            <CheckCircle2 className="w-4 h-4 animate-bounce" />
            <span>Kıbleye Doğru Yöneldiniz! Namaza Durabilirsiniz.</span>
          </>
        ) : (
          <>
            <RotateCw className="w-4 h-4 text-emerald-600 animate-spin-slow" />
            <span>
              Cihazınızı döndürün (Kâbe yönüne {Math.round(relativeDiff > 180 ? 360 - relativeDiff : relativeDiff)}° kaldı)
            </span>
          </>
        )}
      </div>

      {/* Compass Disc Container */}
      <div className="relative w-72 h-72 mx-auto flex items-center justify-center p-4">
        {/* Outer glowing halo when aligned */}
        <div
          className={`absolute inset-0 rounded-full transition-all duration-500 ${
            isAligned ? 'bg-emerald-500/20 blur-xl scale-110' : 'bg-transparent'
          }`}
        />

        {/* Static phone top pointer (Fixed direction representing where phone points) */}
        <div className="absolute top-0 z-30 flex flex-col items-center">
          <div className="w-4 h-4 bg-emerald-600 transform rotate-45 rounded-xs shadow-md" />
          <span className="text-[9px] font-bold text-emerald-600 mt-1">CİHAZ YÖNÜ</span>
        </div>

        {/* Rotating Compass Dial */}
        <div
          className="relative w-full h-full rounded-full border-4 border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 shadow-xl flex items-center justify-center transition-transform duration-200 ease-out"
          style={{ transform: `rotate(${-deviceHeading}deg)` }}
        >
          {/* Compass Cardinals */}
          <span className="absolute top-2 text-xs font-bold text-rose-500 font-mono">K (N)</span>
          <span className="absolute bottom-2 text-xs font-bold text-stone-400 font-mono">G (S)</span>
          <span className="absolute right-2 text-xs font-bold text-stone-400 font-mono">D (E)</span>
          <span className="absolute left-2 text-xs font-bold text-stone-400 font-mono">B (W)</span>

          {/* Compass Degrees Ring */}
          <div className="absolute inset-5 rounded-full border border-dashed border-stone-300 dark:border-stone-700 pointer-events-none" />

          {/* Kaaba Direction Marker (rotates relative to North by qiblaAngle) */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-start pointer-events-none"
            style={{ transform: `rotate(${qiblaAngle}deg)` }}
          >
            {/* Kaaba Icon indicator on the rim */}
            <div className="mt-6 flex flex-col items-center">
              <div className="w-8 h-8 rounded-lg bg-stone-950 border-2 border-amber-400 flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform">
                {/* Kaaba Golden Door symbol */}
                <div className="w-2.5 h-4 bg-amber-400 rounded-t-xs" />
              </div>
              <span className="text-[10px] font-extrabold text-amber-600 dark:text-amber-400 mt-1 bg-white/80 dark:bg-stone-900/80 px-1 rounded-sm">
                KÂBE ({qiblaAngle}°)
              </span>
            </div>
            {/* Line towards Kaaba */}
            <div className="w-0.5 h-16 bg-gradient-to-b from-amber-400 to-transparent" />
          </div>

          {/* Center Pivot Point */}
          <div className="w-6 h-6 rounded-full bg-emerald-600 border-2 border-white dark:border-stone-900 shadow-md z-20 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-white" />
          </div>
        </div>
      </div>

      {/* Manual Compass Slider for desktop / fallback testing */}
      <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-900/70 border border-stone-200/80 dark:border-stone-800 space-y-2 text-left">
        <div className="flex items-center justify-between text-xs">
          <span className="text-stone-600 dark:text-stone-400 font-medium">
            {isSensorActive ? 'Sensör Aktif (Manyetik Pusula)' : 'Manuel Açı Ayarı (Masaüstü Simülatörü)'}
          </span>
          <span className="font-mono font-bold text-stone-900 dark:text-white">
            {deviceHeading}°
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="359"
          value={deviceHeading}
          onChange={(e) => setDeviceHeading(Number(e.target.value))}
          className="w-full accent-emerald-600 cursor-pointer"
        />
        <div className="flex items-center justify-between text-[10px] text-stone-400">
          <span>0° Kuzey</span>
          <span>90° Doğu</span>
          <span>180° Güney</span>
          <span>270° Batı</span>
        </div>
      </div>

      {/* Helpful guidance note */}
      <div className="p-3.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-900/30 text-xs text-stone-600 dark:text-stone-400 flex items-start gap-2 text-left">
        <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          Pusulayı en doğru sonuç için metal ve elektronik cihazlardan (bilgisayar, hoparlör vb.) uzakta, telefonu düz bir zeminde veya avucunuzda yatay tutarak kullanınız.
        </p>
      </div>
    </div>
  );
};
