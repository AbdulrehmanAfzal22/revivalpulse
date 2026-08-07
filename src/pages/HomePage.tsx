import ContinueReading from 'features/quranReader/components/ContinueReading';
import AyahOfTheDay from 'features/quranReader/components/AyahOfTheDay';
import HadithOfTheDay from 'features/hadith/components/HadithOfTheDay';
import DuaOfTheDay from 'features/duas/components/DuaOfTheDay';
import NameReflection from 'features/namesOfAllah/components/NameReflection';
import PrayerCountdownWidget from 'features/prayerTimes/components/PrayerCountdownWidget';
import IslamicDateWidget from 'features/islamicCalendar/components/IslamicDateWidget';
import KidsModeEntry from 'features/kidsMode/components/KidsModeEntry';
import Typography from 'components/ui/Typography';
import styles from './HomePage.module.css';

export default function HomePage() {
  return (
    <div className="container">
      <div className={styles.page}>
        <Typography variant="h2" className={styles.heading}>
          Welcome to IslamicWeb
        </Typography>

        <div className="banner">
          <KidsModeEntry />
        </div>

        <div className="banner">
          <ContinueReading />
        </div>

        <div className="grid-dashboard">
          <PrayerCountdownWidget />
          <IslamicDateWidget />
          <AyahOfTheDay />
          <HadithOfTheDay />
          <DuaOfTheDay />
          <NameReflection />
        </div>
      </div>
    </div>
  );
}
