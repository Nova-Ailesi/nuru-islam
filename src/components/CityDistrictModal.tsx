import React, { useState, useMemo } from 'react';
import {
  MapPin,
  Search,
  Check,
  ChevronRight,
  ChevronLeft,
  Compass,
  Globe,
  Sparkles
} from 'lucide-react';
import { TURKISH_PROVINCES, ProvinceItem, WORLD_ISLAMIC_CITIES, WorldCityItem } from '../data/turkishProvincesAndDistricts';
import { CityLocation } from '../services/prayerTimeCalculator';

interface CityDistrictModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCity: CityLocation;
  onSelectLocation: (loc: CityLocation) => void;
  onUseGps: () => void;
}

export const CityDistrictModal: React.FC<CityDistrictModalProps> = ({
  isOpen,
  onClose,
  currentCity,
  onSelectLocation,
  onUseGps
}) => {
  const [activeTab, setActiveTab] = useState<'turkey' | 'world'>('turkey');
  const [selectedProvince, setSelectedProvince] = useState<ProvinceItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const query = searchQuery.toLowerCase().trim();

  // Universal search for Turkish provinces & districts
  const searchResults = useMemo(() => {
    if (!query) return null;

    // Search by plate number
    const plateNum = parseInt(query, 10);
    if (!isNaN(plateNum) && plateNum >= 1 && plateNum <= 81) {
      const match = TURKISH_PROVINCES.find((p) => p.plate === plateNum);
      if (match) {
        return [{ province: match, district: "Merkez", matchType: 'plate' as const }];
      }
    }

    const matches: { province: ProvinceItem; district: string; matchType: 'province' | 'district' }[] = [];

    for (const prov of TURKISH_PROVINCES) {
      const provNameMatches = prov.name.toLowerCase().includes(query);
      if (provNameMatches) {
        matches.push({ province: prov, district: "Merkez", matchType: 'province' });
      }

      // Check districts
      for (const dist of prov.districts) {
        if (dist.toLowerCase().includes(query)) {
          matches.push({ province: prov, district: dist, matchType: 'district' });
        }
      }

      if (matches.length > 30) break; // Keep fast
    }

    return matches;
  }, [query]);

  // World cities filtered
  const filteredWorldCities = useMemo(() => {
    if (!query) return WORLD_ISLAMIC_CITIES;
    return WORLD_ISLAMIC_CITIES.filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        c.country.toLowerCase().includes(query)
    );
  }, [query]);

  const handleSelectDistrict = (province: ProvinceItem, districtName: string) => {
    const isMerkez = districtName === "Merkez" || districtName.startsWith("Merkez (");
    const formattedName = isMerkez ? province.name : `${province.name} / ${districtName}`;

    const newLoc: CityLocation = {
      name: formattedName,
      country: "Türkiye",
      latitude: province.latitude,
      longitude: province.longitude,
      timezone: 3
    };

    onSelectLocation(newLoc);
    onClose();
  };

  const handleSelectWorldCity = (city: WorldCityItem) => {
    const newLoc: CityLocation = {
      name: city.name,
      country: city.country,
      latitude: city.latitude,
      longitude: city.longitude,
      timezone: city.timezone
    };

    onSelectLocation(newLoc);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[88vh]">
        {/* Header */}
        <div className="p-4 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {selectedProvince && !searchQuery ? (
              <button
                onClick={() => setSelectedProvince(null)}
                className="p-1 rounded-lg text-stone-500 hover:text-stone-900 dark:hover:text-white cursor-pointer mr-1"
                title="İllere Geri Dön"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            ) : (
              <MapPin className="w-5 h-5 text-emerald-600" />
            )}
            <div>
              <h3 className="text-sm font-bold text-stone-900 dark:text-white">
                {selectedProvince && !searchQuery
                  ? `${selectedProvince.name} - İlçe Seçimi`
                  : "Şehir & İlçe Seçimi"}
              </h3>
              <p className="text-[11px] text-stone-500">
                Seçili: <span className="font-semibold text-emerald-600 dark:text-emerald-400">{currentCity.name}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 p-1 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Tab switcher: 81 İl / Dünya Şehirleri */}
        <div className="px-4 pt-3 pb-1 flex items-center gap-2">
          <div className="p-1 bg-stone-100 dark:bg-stone-800 rounded-xl flex items-center gap-1 flex-1">
            <button
              onClick={() => {
                setActiveTab('turkey');
                setSelectedProvince(null);
              }}
              className={`flex-1 py-1.5 px-3 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === 'turkey'
                  ? 'bg-white dark:bg-stone-700 text-emerald-600 font-bold shadow-xs'
                  : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              Türkiye (81 İl & İlçeleri)
            </button>
            <button
              onClick={() => setActiveTab('world')}
              className={`flex-1 py-1.5 px-3 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1 ${
                activeTab === 'world'
                  ? 'bg-white dark:bg-stone-700 text-emerald-600 font-bold shadow-xs'
                  : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Dünya Şehirleri</span>
            </button>
          </div>

          {/* GPS Quick Button */}
          <button
            onClick={() => {
              onUseGps();
              onClose();
            }}
            className="p-2 bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-xl hover:bg-emerald-100 transition-colors shrink-0 cursor-pointer"
            title="GPS ile Konumumu Bul"
          >
            <Compass className="w-4 h-4 text-emerald-600" />
          </button>
        </div>

        {/* Search Input Box */}
        <div className="px-4 py-2">
          <div className="relative">
            <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="İl, ilçe veya plaka kodu yazın (örn: Kadıköy, 34, Alanya, Çankaya)..."
              className="w-full pl-10 pr-4 py-2 bg-stone-100 dark:bg-stone-800 rounded-xl text-xs text-stone-900 dark:text-white placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-2 text-stone-400 hover:text-stone-600 text-xs cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Body Content */}
        <div className="overflow-y-auto flex-1 px-4 py-1 divide-y divide-stone-100 dark:divide-stone-800">
          {/* SEARCH RESULTS VIEW */}
          {searchQuery && searchResults && (
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400 py-1">
                Bulunan Sonuçlar ({searchResults.length})
              </p>
              {searchResults.length === 0 ? (
                <div className="p-6 text-center text-xs text-stone-500">
                  Aramanızla eşleşen il veya ilçe bulunamadı.
                </div>
              ) : (
                searchResults.map((item, idx) => {
                  const isCurrent =
                    currentCity.name.includes(item.province.name) &&
                    (item.district === "Merkez"
                      ? !currentCity.name.includes('/')
                      : currentCity.name.includes(item.district));

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectDistrict(item.province, item.district)}
                      className={`w-full py-2 px-3 text-left flex items-center justify-between text-xs rounded-xl cursor-pointer transition-colors ${
                        isCurrent
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold'
                          : 'hover:bg-stone-50 dark:hover:bg-stone-800/60 text-stone-800 dark:text-stone-200'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-md bg-stone-100 dark:bg-stone-800 text-[10px] font-mono font-bold flex items-center justify-center text-stone-500">
                          {item.province.plate.toString().padStart(2, '0')}
                        </span>
                        <div>
                          <p className="font-semibold">
                            {item.province.name}
                            {item.district !== "Merkez" && (
                              <span className="text-emerald-600 dark:text-emerald-400 font-bold ml-1">
                                / {item.district}
                              </span>
                            )}
                          </p>
                          <p className="text-[10px] text-stone-400">
                            {item.matchType === 'district' ? 'İlçe Eşleşmesi' : 'İl Merkezi'}
                          </p>
                        </div>
                      </div>
                      {isCurrent && <Check className="w-4 h-4 text-emerald-600" />}
                    </button>
                  );
                })
              )}
            </div>
          )}

          {/* STEP 2: SELECTED PROVINCE DISTRICTS LIST */}
          {!searchQuery && selectedProvince && activeTab === 'turkey' && (
            <div className="space-y-1.5 py-1">
              <div className="flex items-center justify-between py-1 text-xs text-stone-500">
                <span>{selectedProvince.name} İline Bağlı İlçeler ({selectedProvince.districts.length})</span>
                <span className="font-mono text-[10px] bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded-md">
                  Plaka: {selectedProvince.plate}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-1.5">
                {selectedProvince.districts.map((districtName) => {
                  const isSelected =
                    currentCity.name.includes(selectedProvince.name) &&
                    (districtName === "Merkez" || districtName.startsWith("Merkez")
                      ? !currentCity.name.includes('/')
                      : currentCity.name.includes(districtName));

                  return (
                    <button
                      key={districtName}
                      onClick={() => handleSelectDistrict(selectedProvince, districtName)}
                      className={`p-2.5 text-left rounded-xl text-xs transition-all cursor-pointer flex items-center justify-between border ${
                        isSelected
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-bold'
                          : 'bg-stone-50/60 dark:bg-stone-800/40 border-stone-200/70 dark:border-stone-800 hover:border-emerald-300 text-stone-800 dark:text-stone-200'
                      }`}
                    >
                      <span className="truncate">{districtName}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 1: 81 PROVINCES LIST */}
          {!searchQuery && !selectedProvince && activeTab === 'turkey' && (
            <div className="space-y-1 py-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400 py-1">
                İl Seçiniz (İlçeler için tıklayın)
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                {TURKISH_PROVINCES.map((prov) => {
                  const isSelected = currentCity.name.startsWith(prov.name);
                  return (
                    <button
                      key={prov.plate}
                      onClick={() => setSelectedProvince(prov)}
                      className={`py-2 px-3 text-left rounded-xl text-xs flex items-center justify-between cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 font-bold'
                          : 'hover:bg-stone-50 dark:hover:bg-stone-800/60 text-stone-800 dark:text-stone-200'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-md bg-stone-100 dark:bg-stone-800 text-[10px] font-mono font-bold flex items-center justify-center text-stone-500">
                          {prov.plate.toString().padStart(2, '0')}
                        </span>
                        <span>{prov.name}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-stone-400">
                        <span className="text-[10px]">{prov.districts.length} ilçe</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* WORLD CITIES VIEW */}
          {activeTab === 'world' && !searchQuery && (
            <div className="space-y-1 py-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400 py-1">
                Mübarek Beldeler & Dünya Başkentleri
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {filteredWorldCities.map((city) => {
                  const isSelected = currentCity.name === city.name;
                  return (
                    <button
                      key={city.name}
                      onClick={() => handleSelectWorldCity(city)}
                      className={`p-2.5 rounded-xl text-left text-xs flex items-center justify-between cursor-pointer transition-colors border ${
                        isSelected
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-bold'
                          : 'bg-stone-50/60 dark:bg-stone-800/40 border-stone-200/70 dark:border-stone-800 hover:border-emerald-300 text-stone-800 dark:text-stone-200'
                      }`}
                    >
                      <div>
                        <p className="font-semibold text-stone-900 dark:text-white">
                          {city.name}
                        </p>
                        <p className="text-[10px] text-stone-400">{city.country}</p>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-emerald-600" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Note */}
        <div className="p-3 bg-stone-50 dark:bg-stone-800/50 border-t border-stone-100 dark:border-stone-800 text-[11px] text-stone-500 flex items-center justify-between">
          <span>81 İl ve tüm ilçeleri çevrimdışı desteklenir.</span>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-stone-200 dark:bg-stone-700 hover:bg-stone-300 text-stone-800 dark:text-stone-200 rounded-lg font-medium cursor-pointer"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
