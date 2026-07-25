import type { CalculationMethod } from 'types/prayerTimes.types';

/** Verified live against api.aladhan.com/v1/methods. */
export const CALCULATION_METHODS: CalculationMethod[] = [
  { id: 3, code: 'MWL', name: 'Muslim World League' },
  { id: 2, code: 'ISNA', name: 'Islamic Society of North America (ISNA)' },
  { id: 5, code: 'EGYPT', name: 'Egyptian General Authority of Survey' },
  { id: 4, code: 'MAKKAH', name: 'Umm Al-Qura University, Makkah' },
  { id: 1, code: 'KARACHI', name: 'University of Islamic Sciences, Karachi' },
  { id: 7, code: 'TEHRAN', name: 'Institute of Geophysics, University of Tehran' },
  { id: 0, code: 'JAFARI', name: 'Shia Ithna-Ashari, Leva Institute, Qum' },
  { id: 8, code: 'GULF', name: 'Gulf Region' },
  { id: 9, code: 'KUWAIT', name: 'Kuwait' },
  { id: 10, code: 'QATAR', name: 'Qatar' },
  { id: 11, code: 'SINGAPORE', name: 'Majlis Ugama Islam Singapura, Singapore' },
  { id: 12, code: 'FRANCE', name: 'Union Organization Islamic de France' },
  { id: 13, code: 'TURKEY', name: 'Diyanet İşleri Başkanlığı, Turkey' },
  { id: 14, code: 'RUSSIA', name: 'Spiritual Administration of Muslims of Russia' },
  { id: 15, code: 'MOONSIGHTING', name: 'Moonsighting Committee Worldwide' },
  { id: 16, code: 'DUBAI', name: 'Dubai' },
  { id: 17, code: 'JAKIM', name: 'Jabatan Kemajuan Islam Malaysia (JAKIM)' },
  { id: 18, code: 'TUNISIA', name: 'Tunisia' },
  { id: 19, code: 'ALGERIA', name: 'Algeria' },
  { id: 20, code: 'KEMENAG', name: 'Kementerian Agama Republik Indonesia' },
  { id: 21, code: 'MOROCCO', name: 'Morocco' },
  { id: 22, code: 'PORTUGAL', name: 'Comunidade Islamica de Lisboa' },
  { id: 23, code: 'JORDAN', name: 'Ministry of Awqaf, Islamic Affairs and Holy Places, Jordan' },
];

export const DEFAULT_CALCULATION_METHOD_ID = 3;
