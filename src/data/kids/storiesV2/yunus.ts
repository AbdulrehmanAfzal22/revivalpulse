import type { KidsStoryV2 } from "types/kidsStories.types";

/**
 * Prophet Yunus (AS) — KidsStoryV2 (chapter-based) implementation.
 *
 * The messenger who left his people before he was commanded to, was swallowed
 * by a huge fish, and from its darkness cried out the beloved dua all believers
 * still learn today. Anchored to the true Yunus verses: Surah As-Saffat
 * (37:139–148), Surah Al-Anbiya (21:87–88) and Surah Yunus (10:98).
 * Urdu shown on the summary only; paragraphs use the English fallback.
 */
export const STORY_YUNUS: KidsStoryV2 = {
  id: "yunus",
  type: "prophet",
  nameArabic: "يونس",
  nameEnglish: "Yunus (Jonah)",
  illustrationSymbol: "Fish",
  accentColor: "#2b7a9e",
  summary: {
    en: "Yunus left his people before he was told to. He was swallowed by a huge fish, and in its darkness he called out to Allah — a dua many people still learn today.",
    ur: "یونس علیہ السلام نے اپنی قوم کو چھوڑ دیا تھا جب اُنہیں جانے کی اجازت نہیں ملی تھی۔ اُنہیں ایک بڑی مچھلی نے نگل لیا، اور اُس کی تاریکی میں اُنہوں نے اللہ کو پکارا — یہ وہ دعا ہے جو آج بھی بہت سے لوگ سیکھتے ہیں۔",
  },
  chapters: [
    {
      id: "sent-to-a-town",
      title: { en: "A Messenger Sent to a Stubborn Town" },
      paragraphs: [
        {
          en: "Allah sent His messenger Yunus to a town whose people had forgotten Him. The Qur'an begins his story with honour: “And indeed, Yunus was among the messengers” (Qur'an 37:139).",
        },
        {
          en: "Yunus called his people, morning and evening, telling them to worship Allah alone. He warmed their hearts with soft words and asked them to turn away from their wrongdoings before it was too late.",
        },
        {
          en: "Day after day he tried, but the people would not listen. They mocked him and went on with their own lives, as if he had never spoken to them.",
        },
        {
          en: "A prophet's heart grows heavy when people refuse his message. Yunus waited and he grew sorrowful, wondering when the hearts around him would ever soften.",
        },
      ],
      sources: [
        { type: "quran", reference: "Qur'an 37:139", label: { en: "Allah names Yunus among the messengers" } },
        { type: "quran", reference: "Qur'an 37:143", label: { en: "Yunus is remembered as one of those who glorify Allah" } },
      ],
    },
    {
      id: "leaves-in-haste",
      title: { en: "Leaving Before He Was Commanded" },
      paragraphs: [
        {
          en: "One day, upset and tired of waiting, Yunus made a big decision: he left his town and walked all the way down to the harbour. He was leaving before Allah had ever given him the leave to go.",
        },
        {
          en: "The Qur'an tells it softly but truly: “When he ran away to the laden ship” (Qur'an 37:140) — a messenger setting out on his own road, hoping to leave his troubles behind.",
        },
        {
          en: "He climbed aboard a heavy ship loaded with goods, and the sailors pushed it out toward the open waves. Soon the sea around him became dark and wild.",
        },
        {
          en: "He thought the town's trouble would stay behind him. He did not know that no sea is deep enough, and no distance far enough, to carry a servant away from the One Who watches.",
        },
      ],
      sources: [
        { type: "quran", reference: "Qur'an 37:140", label: { en: "Yunus runs away to the loaded ship before he was commanded to leave" } },
        { type: "quran", reference: "Qur'an 21:87", label: { en: "Yunus departs in anger, thinking he could escape his task" } },
      ],
    },
    {
      id: "the-storm",
      title: { en: "Storm at Sea" },
      paragraphs: [
        {
          en: "Far out on the water, the weather turned fierce. Mighty waves began to toss the loaded ship to and fro, and the frightened sailors feared the boat would sink with all of them.",
        },
        {
          en: "They gathered to decide who must be lowered into the sea to lighten the load and calm the wind. They cast lots — and the name that came out was Yunus (Qur'an 37:141).",
        },
        {
          en: "Then they cast again, and again the same name came out. Whatever they tried, the lots kept pointing to the prophet of Allah.",
        },
        {
          en: "Yunus understood then that his flight had been a mistake, and that the storm was a loving call from Allah to turn back. So with a quiet heart, he gave himself to the sea.",
        },
        {
          en: "He was thrown overboard, the waves swallowed him, and then — the Quran says: “Then the great fish swallowed him, while he was blameworthy” (Qur'an 37:142).",
        },
      ],
      sources: [
        { type: "quran", reference: "Qur'an 37:141", label: { en: "Yunus draws lots with the sailors and is the one chosen to be cast into the sea" } },
        { type: "quran", reference: "Qur'an 37:142", label: { en: "A great fish swallows Yunus while he is to be blamed" } },
      ],
    },
    {
      id: "in-the-fish",
      title: { en: "In the Darkness of the Fish" },
      paragraphs: [
        {
          en: "Inside the belly of the fish, it was dark, and wet, and cold. There were no friends, no lamps, and no hope anyone could hear him — only Yunus and his memory of the town he had wanted to escape.",
        },
        {
          en: "The Qur'an describes what happened next: “But he cried out through the darkness: 'There is no god except You — Glory be to You — indeed, I have been of the wrongdoers'” (Qur'an 21:87).",
        },
        {
          en: "In that moment, Yunus did not blame the fish or the sailors. He looked at himself honestly and admitted: I made the mistake. I was among the wrongdoers.",
        },
        {
          en: "And the blessed words of As-Saffat add: “Had he not been among those who glorify Allah, he would indeed have remained inside its belly until the Day of Resurrection” (Qur'an 37:143–144).",
        },
        {
          en: "Inside the darkest prison beneath the sea, Yunus found the light of remembrance. He remembered Allah — and that remembrance was his finest treasure.",
        },
      ],
      sources: [
        { type: "quran", reference: "Qur'an 21:87", label: { en: "Yunus calls out from the darkness with the dua: 'There is no god but You, Glory be to You' — admitting he was among the wrongdoers" } },
        { type: "quran", reference: "Qur'an 37:143–144", label: { en: "Had Yunus not been among those who glorify Allah, he would have stayed in the fish until the Day of Resurrection" } },
      ],
    },
    {
      id: "the-dua",
      title: { en: "The Dua That Everyone Still Learns" },
      paragraphs: [
        {
          en: "The prayer of Yunus — “La ilaha illa anta, subhaanaka, inni kuntu min al-dholimin” — means: “There is no god but You, Glory be to You, truly I have been among the wrongdoers” (Qur'an 21:87).",
        },
        {
          en: "This dua is perfect and strong because it contains two things: full praise falling to Allah alone, and a gentle, honest admittance of our own mistake.",
        },
        {
          en: "Allah answered that tiny voice lost at the bottom of the sea. The Qur'an says: “So We responded to his call and saved him from the distress, and thus do We save the believers” (Qur'an 21:88).",
        },
        {
          en: "That is why this dua is still loved and learned by Muslims today. Whenever someone is in trouble and whispers these same words from the heart, Allah is just as near to them as He was to Yunus in the belly of the fish.",
        },
      ],
      sources: [
        { type: "quran", reference: "Qur'an 21:87", label: { en: "Yunus prays from the darkness: there is no god but You, Glory be to You, I was among the wrongdoers" } },
        { type: "quran", reference: "Qur'an 21:88", label: { en: "Allah answers his call and saves him from the distress, and saves the believers the same way" } },
      ],
    },
    {
      id: "saved-on-shore",
      title: { en: "Saved on the Shore, With a Shade Plant" },
      paragraphs: [
        {
          en: "The great fish obeyed its Lord and carried Yunus across the sea. In the Qur'an, Allah describes the rescue: “We cast him out onto the empty shore, while he was sick” (Qur'an 37:145).",
        },
        {
          en: "Yunus was weak after his long, dark journey. But Allah was kind to His servant — the Qur'an continues, “And We caused to grow over him a tree from the gourd family” (Genie: 37:146).",
        },
        {
          en: "A fresh green vine bushh grew above him to give him shade, so the long-awaited sun would not sting his tired body. Mercy after the storm, shade after the darkness — that is the pattern of Allah with His patient servants.",
        },
        {
          en: "On that quiet shore, Yunus rested and grew strong again, one simple tree serving as his shelter, and in his heart the Greatest Light of all.",
        },
      ],
      sources: [
        { type: "quran", reference: "Qur'an 37:145", label: { en: "Allah casts Yunus out onto the empty, shore while he was sick" } },
        { type: "quran", reference: "Qur'an 37:146", label: { en: "Allah causes a gourd plant to grow over Yunus to give him shade" } },
      ],
    },
    {
      id: "town-believed",
      title: { en: "The Town That Believed" },
      paragraphs: [
        {
          en: "When strength returned to Yunus, Allah sent him back to his town. And there the greatest surprise of his life was waiting: the people had believed in Allah!",
        },
        {
          en: "The Qur'an says: “And We sent him to a hundred thousand people, or even more — and they believed, so We granted them enjoyment for a while” (Qur'an 37:147–148).",
        },
        {
          en: "And there is a very special verse about them: “Was there any town that believed, and its faith benefited it, except the town of Yunus? When they believed, We removed from them the punishment of disgrace in the life of this world” (quran:10:98).",
        },
        {
          en: "They are the only town in the Qur'an whose belief in that final moment saved them from the punishment. All because they finally listened.",
        },
        {
          en: "It is a grateful finish for the whole journey: a prophet who ran, a fish that swallowed him, a darkness, a beautiful dua, and then — a whole town saved. Mercy is always bigger than every mistake.",
        },
      ],
      sources: [
        { type: "quran", reference: "Qur'an 37:147–148", label: { en: "Allah sent Yunus back to over a hundred thousand people and they believed" } },
        { type: "quran", reference: "Qur'an 10:98", label: { en: "The town of Yunus is the only town whose late belief profited it at all; punishment was removed" } },
      ],
    },
  ],
};