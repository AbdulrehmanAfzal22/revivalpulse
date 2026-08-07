import type { KidsStoryV2 } from "types/kidsStories.types";

/**
 * Prophet Yusuf (AS) — KidsStoryV2 chapter story (Phase 3).
 *
 * Shape mirrors STORY_ADAM: a chapter list where every chapter has 4–8 real
 * narrative paragraphs and a non-empty `sources` array. Quran-narrated events
 * cite the verified verses 12:4 and 12:90 only; every other well-known event
 * of Surah Yusuf is kept in the story and anchored to the classical works of
 * Tafsir at book level, marked `needsVerification: true` — never a guessed
 * verse. `ur` is empty except the summary: readers see the English fallback
 * until careful Urdu translations are added later.
 */
export const STORY_YUSUF: KidsStoryV2 = {
  id: "yusuf",
  type: "prophet",
  nameArabic: "يوسف",
  nameEnglish: "Yusuf (Joseph)",
  illustrationSymbol: "Star",
  accentColor: "#c9962f",
  summary: {
    en: "As a boy, Yusuf dreamed of eleven stars, the sun, and the moon bowing to him. Even after his jealous brothers left him in a well and he was later falsely accused, Allah raised him to a position of great trust in Egypt.",
    ur: "بچپن میں یوسف علیہ السلام نے خواب دیکھا کہ گیارہ ستارے، سورج اور چاند انہیں جھک کر سجدہ کر رہے ہیں۔ جلن کی وجہ سے ان کے بھائیوں نے انہیں کنویں میں چھوڑ دیا اور بعد میں ان پر جھوٹا الزام لگایا گیا، مگر اللہ نے انہیں مصر میں بڑے اعتماد اور عزت کے مقام تک پہنچایا۔",
  },
  chapters: [
    {
      id: "the-dream",
      title: { en: "A Wonderful Dream" },
      paragraphs: [
        {
          en: "Yusuf lived in a big, loving family with his father Prophet Yaqub and eleven brothers. He was one of the youngest, but he was gentle and truthful, and his father loved him very much. Yaqub could see something special and bright inside his little son.",
        },
        {
          en: "One night Yusuf had a dream more wonderful than any dream he had ever had. He hurried to his father and said: “Father, I have seen eleven stars, the sun and the moon bowing down to me” (Qur’an 12:4). The eleven stars were his brothers, and the sun and the moon were his own beloved father and mother.",
        },
        {
          en: "Yaqub’s heart filled with joy, because he understood that Allah had a special plan for Yusuf. He gently told the boy to keep the dream in his heart and not to tell it to his brothers yet. The classic commentaries of the Qur’an explain how wise and careful this advice was.",
        },
        {
          en: "Good dreams are a gift from Allah, and this dream became a tiny lamp of hope inside Yusuf’s heart. It whispered to him that the One who made the sun and the moon would take perfect care of him, no matter what happened next.",
        },
      ],
      sources: [
        { type: "quran", reference: "Qur’an 12:4", label: { en: "Yusuf tells his father his dream of eleven stars, the sun and the moon bowing to him" } },
        { type: "hadith", reference: "Tafsir (Ibn Kathir) — Surah Yusuf", needsVerification: true, label: { en: "The classical commentaries relate how Yaqub rejoiced in the dream and guarded advice to keep it secret" } },
      ],
    },
    {
      id: "into-the-well",
      title: { en: "Into the Well" },
      paragraphs: [
        {
          en: "Yusuf’s older brothers began to feel jealousy growing in their hearts. They could see how much their father loved Yusuf, and a small evil whisper kept telling them that they were not treated fairly. Their hearts, even though they belonged to a loving family, turned to plan something upsetting.",
        },
        {
          en: "One day they asked their father to let them take Yusuf out to play. They promised to look after him carefully, but once they were far away in the open place, they changed. They set Yusuf far from home and lowered him into a dark, deep well, believing they would never see him again.",
        },
        {
          en: "In the darkness of that well, Yusuf stayed calm. He trusted that Allah sees everything and every plan of theirs. Into the bottom of the hidden place, he kept his heart clean, even though the pit was dark, and he was very young.",
        },
        {
          en: "Later a caravan of travelers found water very near the well, and there inside it they discovered a gentle boy. “What a fine thing we have found!” they said joyfully, and they carried him far away to the land of Egypt to sell him as a treasured servant.",
        },
        {
          en: "Yusuf’s brothers meant harm, but Allah had a better plan. The boy they thought they had left behind was not ending in ruin; Allah was guiding him slowly, one hidden step at a time, toward a place of great honor in the world.",
        },
      ],
      sources: [
        { type: "hadith", reference: "Tafsir (Ibn Kathir) — Surah Yusuf", needsVerification: true, label: { en: "The classical commentaries narrate the brothers’ jealousy, their plot, the well, and the caravan that found him" } },
        { type: "hadith", reference: "Sahih al-Bukhari (Book of the Prophets)", needsVerification: true, label: { en: "The honoured hadith works tell of Yusuf and his father among the noble family of the prophets" } },
      ],
    },
    {
      id: "tested-in-egypt",
      title: { en: "Tested in Egypt" },
      paragraphs: [
        {
          en: "In Egypt, an important man bought the young Yusuf and gave him a kind home. As Yusuf grew up, he stayed true, gentle, and honest in all that he did, growing in the love of Allah in a country that did not yet know Him.",
        },
        {
          en: "Then Yusuf faced a very hard test. A wrong path was placed openly before him, a way that looked easy and tempting. But Yusuf remembered Allah, and he refused to take the forbidden step even though that refusal would cost him greatly.",
        },
        {
          en: "Because he chose purity, a false accusation was spread about him, and he was sent into prison even though he had done nothing wrong. He was innocent, yet he did not scream or break; he gave the matter to Allah and stayed patient and calm.",
        },
        {
          en: "Inside the prison, Yusuf did not let the bars and the dark make him angry or bitter. He stayed truthful, comforted his fellow prisoners, and gently called them to worship Allah alone. Even where he had been hurt, he chose to bring kindness.",
        },
        {
          en: "Allah gave him a wonderful gift in that place — the ability to explain dreams. The prophet Yusuf did not lose his pure heart; through trouble and loss he stayed kind and gentle, and his trust in Allah never broke.",
        },
      ],
      sources: [
        { type: "hadith", reference: "Tafsir (Ibn Kathir) — Surah Yusuf", needsVerification: true, label: { en: "The commentaries recount Yusuf’s brave refusal, the false accusation, and his patient life in the prison" } },
      ],
    },
    {
      id: "prison-to-palace",
      title: { en: "From Prison to the Palace" },
      paragraphs: [
        {
          en: "While Yusuf was in prison, he helped two young men who were brought near him and told him their dreams. By the knowledge Allah had given him, Yusuf explained what they meant, and one of the brothers returned and was set free.",
        },
        {
          en: "Years later, the king of Egypt had a strange and troubling dream. In it, seven plump cows were eaten by seven thin cows, and seven green ears of grain grew where seven dry ones stood. None of the wise men of the court could tell him what it meant.",
        },
        {
          en: "At last the freed man remembered the young man who could explain dreams. The king sent for Yusuf, and Yusuf explained that Allah was showing the king years of plenty in grain, followed by years of hunger that would harm the people unless the food was gathered and kept safe.",
        },
        {
          en: "The king agreed to the wise plan and gave Yusuf a place of great trust over all the storehouses of Egypt. The boy who had been lowered into a dark well now fed a whole country, because he had refused to stray and had stayed patient through everything.",
        },
        {
          en: "Yusuf’s rise from a moment when he owned almost nothing teaches us a beautiful rule: when we are innocent and patient, Allah alone raises whom He chooses, and He never fails a clean heart.",
        },
      ],
      sources: [
        { type: "hadith", reference: "Tafsir (Ibn Kathir) — Surah Yusuf", needsVerification: true, label: { en: "The commentaries narrate the prisoners’ dream, the king’s dream, and Yusuf’s rise to a place of great trust in Egypt" } },
      ],
    },
    {
      id: "years-of-hunger",
      title: { en: "The Years of Hunger" },
      paragraphs: [
        {
          en: "The years of plenty and the years of hunger came, just as Yusuf had said. Egypt’s stores were full because of his wise plan, but in the far lands the famine was harsh. People traveled from everywhere, even from the surrounding countries, searching for the food that Egypt had saved.",
        },
        {
          en: "One day, the very brothers who had taken cruelty from Yusuf came to Egypt to buy grain. They stood before him — they did not know him, but he knew them. His heart felt the old wound, and at the same time a tender mercy rose to cover it.",
        },
        {
          en: "Yusuf gave them food and kindness, but as they were leaving, he told them, gently, that they would be welcome to come again only if they brought with them the youngest brother they had left at home. He longed to see him, and he wanted to test whether their hearts had truly changed.",
        },
        {
          en: "On their next visit they brought the young brother, and Yusuf arranged it so that the boy would stay near him in Egypt for a while. The older brothers had to return without him, carrying heavy news back to their father. The hungry years pressed into their hearts a question they could no longer hide: what had they done to their own family long ago?",
        },
        {
          en: "Through those years the brothers returned again and again, and each journey softened their hearts a little more. The memory of the brother they had wronged came back to them, and the gentle dealing of the man of Egypt slowly healed them, even though they did not yet know who he really was.",
        },
      ],
      sources: [
        { type: "hadith", reference: "Tafsir (Ibn Kathir) — Surah Yusuf", needsVerification: true, label: { en: "The commentaries narrate the drought, the brothers’s coming for food, and the keeping of the young brother in Egypt" } },
      ],
    },
    {
      id: "i-am-yusuf",
      title: { en: "“I Am Yusuf”" },
      paragraphs: [
        {
          en: "At last the brothers stood before him, and they asked with trembling hearts: “Are you really Yusuf? Are you the brother we lost so many years ago?” And he answered them gently: “I am Yusuf, and this is my brother. Allah has certainly been gracious to us. Indeed, whoever fears Allah and is patient, Allah does not waste the reward of those who do right” (Qur’an 12:90).",
        },
        {
          en: "The brothers were ashamed of what they had done at the well long ago, but Yusuf did not blame them with harsh words. They confessed their fault to him in humility, and he, being a gentle believer, accepted their sorrow and forgave them with his whole heart.",
        },
        {
          en: "Then came the very best of all the events Yusuf had ever waited for: he called his whole family to come and live near him in Egypt. His father, the mother, and all the brothers — every member of the scattered family — came to live together again, in safety and in the abundance that Allah had stored for them.",
        },
        {
          en: "And in that moment, the little lamp of the boyhood dream was at last fulfilled: the eleven stars, and the sun, and the moon — the father, the mother and the brothers — all gathered together in the Egyptian land to honor and love him. Allah ended the long wait with the happiness He had been preparing for Yusuf since the days of the dark well.",
        },
        {
          en: "Yusuf’s story is the best story of patience, honesty and forgiveness. When something unfair happens to us, we can be patient like Yusuf: speak the truth, keep the heart, and never stop trusting that Allah has a plan more beautiful than any pain we see now.",
        },
      ],
      sources: [
        { type: "quran", reference: "Qur’an 12:90", label: { en: "Yusuf reveals himself to his brothers, forgives them, and thanks Allah who favored him" } },
        { type: "hadith", reference: "Tafsir (Ibn Kathir) — Surah Yusuf", needsVerification: true, label: { en: "The commentaries narrate the full reunion of Yusuf with the father and the family moving to Egypt" } },
      ],
    },
  ],
};