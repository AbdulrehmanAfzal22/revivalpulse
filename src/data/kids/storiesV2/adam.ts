import type { KidsStoryV2 } from "types/kidsStories.types";

/**
 * Prophet Adam (AS) — the reference KidsStoryV2 implementation (Phase 3).
 *
 * Every other Prophet and Sahabi story copies this shape: a chapter list
 * where every chapter has 4–8 real narrative paragraphs and a non-empty
 * `sources` array. Quran-narrated events carry `type: "quran"` with the
 * actual verse; hadith is used only where a specific authentic hadith covers
 * the event. Anything whose citation was not confidently verified while
 * writing is marked `needsVerification: true` — never a guessed reference.
 *
 * `ur` is intentionally empty: readers see the English fallback until
 * careful Urdu translations are added later.
 *
 * Review sign-off: single-reviewer (site owner). Sources get `reviewed: true`
 * + `reviewedBy`/`reviewedDate` in batches; this is confirm-read sign-off,
 * not scholarly/ijazah certification.
 */
export const STORY_ADAM: KidsStoryV2 = {
  id: "adam",
  type: "prophet",
  nameArabic: "آدم",
  nameEnglish: "Prophet Adam",
  illustrationSymbol: "Leaf",
  accentColor: "#4caf6d",
  summary: {
    en: "The first man, created by Allah from clay and honored above the other creation. Adam slipped into a mistake, repented, and Allah forgave him. He became the first prophet and the father of all human beings.",
  },
  chapters: [
    {
      id: "creation",
      title: { en: "The Creation of Adam" },
      paragraphs: [
        {
          en: "Before Adam, there were the skies, the earth, the angels, and everything around them. But there was no human being yet. Then Allah decided to create a human being, and He told the angels: “Indeed, I am going to create a human being from clay” (Qur’an 38:71).",
        },
        {
          en: "So Allah shaped Adam from clay, and when He finished giving him a good shape, He breathed into him from His spirit. Allah said: “And when I have proportioned him and breathed into him of My spirit, then fall down to him in prostration” (Qur’an 38:72). At that moment the very first human being came to life.",
        },
        {
          en: "The Qur’an tells us that Allah “began the creation of humankind from clay” (Qur’an 32:8) and that He “perfected everything that He created” (Qur’an 32:7). Adam was never an accident — he was shaped slowly, carefully, and beautifully by his Lord.",
        },
        {
          en: "After creating Adam, Allah told the angels: “Indeed, I will place upon the earth a successor” (Qur’an 2:30). The angels asked why Allah would place people there who would cause trouble and shed blood, but Allah answered: “Indeed, I know that which you do not know” (Qur’an 2:30).",
        },
        {
          en: "Adam’s creation is a sign and a gift at the same time. The same Allah who shaped the first man from dust can create anything, and He gave Adam — and every child after him — a wonderful beginning.",
        },
      ],
      sources: [
        { type: "quran", reference: "Qur’an 38:71", label: { en: "Allah announces to the angels He will create a human being from clay" } },
        { type: "quran", reference: "Qur’an 38:72", label: { en: "Allah orders the angels to fall prostrate to Adam once He has perfected him and breathed from His spirit" } },
        { type: "quran", reference: "Qur’an 32:8", label: { en: "Allah began the creation of humankind from clay and shaped Adam with His own care" } },
        { type: "quran", reference: "Qur’an 2:30", label: { en: "Allah tells the angels He is placing a successor on the earth who will cause trouble and shed blood" } },
      ],
    },
    {
      id: "names",
      title: { en: "The Knowledge of the Names" },
      paragraphs: [
        {
          en: "Adam had something very special: Allah taught him the names of everything. The Qur’an says: “And He taught Adam the names, all of them” (Qur’an 2:31). Nothing in the world was hidden from him, because Allah had shared some of His own knowledge with him.",
        },
        {
          en: "To show how great this gift was, Allah showed those things to the angels and asked them: “Tell Me the names of these, if you are truthful?” (Qur’an 2:31). But the angels, even though they are noble and pure, replied: “Glory be to You! We have no knowledge except what You have taught us” (Qur’an 2:32).",
        },
        {
          en: "Then Allah said: “O Adam, inform them of their names” (Qur’an 2:33). And Adam told them every name — the names of everything Allah had placed before them.",
        },
        {
          en: "This was a great honor for Adam. It also teaches us something lovely: learning is a gift from Allah. Every time we learn a new word, we are using a little bit of the wonderful gift Allah gave to the very first human being.",
        },
      ],
      sources: [
        { type: "quran", reference: "Qur’an 2:31", label: { en: "Allah teaches Adam the names of all things, then presents them to the angels" } },
        { type: "quran", reference: "Qur’an 2:32", label: { en: "The angels reply that they know only what Allah has taught them" } },
        { type: "quran", reference: "Qur’an 2:33", label: { en: "Adam informs the angels of the names at Allah's command" } },
      ],
    },
    {
      id: "angels-bow",
      title: { en: "Angels Bow, Iblis Refuses" },
      paragraphs: [
        {
          en: "After the angels saw Adam name everything, Allah asked them to bow down their heads before Adam — not to worship him, but to honor what Allah had created. Allah said: “And when We said to the angels: prostrate yourselves to Adam, and they prostrated, except Iblis” (Qur’an 2:34).",
        },
        {
          en: "Every single angel obeyed that command. But Iblis refused. He said: “You created me from fire, and You created him from clay — I am better than him” (Qur’an 38:76). Because of his pride, he would not follow Allah’s order.",
        },
        {
          en: "Pride was Iblis’s biggest mistake. He thought he was better than Adam just because he came from fire and Adam came from clay. So Allah said: “Depart from here, for you are rejected” (Qur’an 38:78).",
        },
        {
          en: "Iblis asked Allah to keep him alive until the Day of Judgment, and Allah allowed it. Then Iblis made a promise: “I will surely lead Your servants astray” — but he had to admit: “except for Your chosen servants among them” (Qur’an 38:82–83).",
        },
        {
          en: "This is why Adam is so special: Allah chose him and honored him. And it teaches us how dangerous pride is. The moment we start thinking we are better than others, we should remember how pride sent Iblis away from Allah’s mercy.",
        },
      ],
      sources: [
        { type: "quran", reference: "Qur’an 2:34", label: { en: "Allah commands the angels to bow before Adam; all do except Iblis" } },
        { type: "quran", reference: "Qur’an 38:76", label: { en: "Iblis refuses, claiming he was created from fire and Adam from clay" } },
        { type: "quran", reference: "Qur’an 38:78", label: { en: "Allah banishes Iblis as rejected and accursed" } },
        { type: "quran", reference: "Qur’an 38:82–83", label: { en: "Iblis vows to mislead Allah's servants except the sincere chosen ones" } },
      ],
    },
    {
      id: "paradise",
      title: { en: "Life in Paradise" },
      paragraphs: [
        {
          en: "Allah said to Adam: “O Adam, dwell you and your wife in the Garden, and eat from wherever you wish” (Qur’an 2:35). So Adam and Hawwa (Eve) lived in the beautiful Garden Allah had created — a place with no hunger, no cold, and no fear.",
        },
        {
          en: "In Paradise, Adam never felt thirsty, never got uncomfortably hot, and never knew worry. Allah promised: “Truly it is for you that you will not be hungry therein or be unclothed, and that you will not be thirsty therein or be harmed by the heat of the sun” (Qur’an 20:118–119).",
        },
        {
          en: "Allah gave Adam and his wife only one simple rule: “Do not approach this tree, or you will be among the wrongdoers” (Qur’an 2:35). They could eat anything else — but this one tree was a test, a gentle reminder to obey their Creator.",
        },
        {
          en: "So the first days of humankind were peaceful. Adam and Hawaa had everything, and all that was asked of them was to obey the one command from the One who gave them the Garden.",
        },
      ],
      sources: [
        { type: "quran", reference: "Qur’an 2:35", label: { en: "Allah settles Adam and his wife in the Garden and points out the one forbidden tree" } },
        { type: "quran", reference: "Qur’an 20:118–119", label: { en: "Allah promises Adam he will not go hungry, unclothed, thirsty or scorched in the Garden" } },
      ],
    },
    {
      id: "test",
      title: { en: "The Test of the Tree" },
      paragraphs: [
        {
          en: "Iblis was waiting for his chance. He came to Adam and his wife and said: “O Adam, shall I lead you to the tree of eternity and a kingdom that never decays?” (Qur’an 20:120). He whispered softly to make them forget the one simple rule.",
        },
        {
          en: "In a moment of weakness, Adam and his wife both forgot the command. The Qur’an says: “Adam disobeyed his Lord, and he became confused with misguidance” (Qur’an 20:121).",
        },
        {
          en: "At once they felt ashamed. Their bodies exposed, and they began to cover themselves with leaves from the Garden (Qur’an 20:121). They understood that they had done something wrong against their kind Lord.",
        },
        {
          en: "Adam and Hawaa learned an important lesson: Iblis is a clear enemy of human beings. This is why Allah warns us again and again in the Qur’an (Qur’an 2:208). And in the same way Shaytan came to Adam and his wife, taking them away from their Lord.",
        },
        {
          en: "This chapter teaches us that even the best human being can slip. What matters after a mistake is what we do next — and Adam will show us in the final chapters how to come back to Allah.",
        },
      ],
      sources: [
        { type: "quran", reference: "Qur’an 20:120", label: { en: "Iblis whispers to Adam, tempting him toward the tree of eternity and an endless kingdom" } },
        { type: "quran", reference: "Qur’an 20:121", label: { en: "Adam and his wife eat from the tree, disobeying the one command" } },
        { type: "quran", reference: "Qur’an 2:208", label: { en: "Allah warns humankind that Shaytan is a clear enemy and to follow Him fully" } },
      ],
    },
    {
      id: "descent",
      title: { en: "Coming Down to Earth" },
      paragraphs: [
        {
          en: "After the slip, Allah said to Adam and his wife: “Get down from here, some of you are enemies of others” (Qur’an 2:38). So Adam and Hawaa left the Garden and came to the earth — the home we all live in today.",
        },
        {
          en: "It must have felt strange and sad to leave such a beautiful Garden. But Allah did not leave them without comfort. Allah taught them the way back: “Whoever follows My guidance, no fear shall be upon them, nor will they grieve” (Qur’an 2:38).",
        },
        {
          en: "That is the great promise: the earth would not be random. Allah was sending guidance — prophets, books, and the knowledge of what Allah loves — so that every human being could stay safe, and so that Adam’s children could never be truly lost.",
        },
        {
          en: "Adam and Hawaa began their new life on the earth. They became the parents of all people, a human family that remembers a beginning, and learns the important lesson that our true home is forever with Allah.",
        },
      ],
      sources: [
        { type: "quran", reference: "Qur’an 2:38", label: { en: "Allah sends Adam and his wife down from the Garden and promises guidance for whoever follows it" } },
        { type: "quran", reference: "Qur’an 7:24", label: { en: "Allah drives Adam and his wife out to the earth for a limited stay" } },
      ],
    },
    {
      id: "repentance",
      title: { en: "Adam Repents, and Allah Forgives" },
      paragraphs: [
        {
          en: "Adam felt very sorry for what he had done. So he and his wife called from their hearts with a beautiful prayer: “Our Lord! We have wronged ourselves, and if You do not forgive us and have mercy upon us, we will surely be among the losers” (Qur’an 7:23).",
        },
        {
          en: "Allah answered their prayer. The Qur’an says: “Then Adam received from his Lord words of forgiveness, and He turned to him with mercy. Indeed, He is the Ever-Returning, the Most Merciful” (Qur’an 2:37).",
        },
        {
          en: "Allah did not just forgive Adam — He chose him and guided him. The Word of Allah continues: “Then his Lord chose him, and He turned to him with forgiveness, and He guided him” (Qur’an 20:122). So Adam, whose slip looked so big, became one of the noble chosen prophets of Allah.",
        },
        {
          en: "Adam taught his children the most important lesson for when we make mistakes: admit it, say that we have done wrong, and return to Allah from the heart. Allah, the Most Merciful, is always ready to forgive those who truly turn back to Him.",
        },
      ],
      sources: [
        { type: "quran", reference: "Qur’an 7:23", label: { en: "Adam and his wife pray, admitting they have wronged themselves and beg for mercy" } },
        { type: "quran", reference: "Qur’an 2:37", label: { en: "Adam receives words from his Lord and Allah turns to him in mercy and accepts his repentance" } },
        { type: "quran", reference: "Qur’an 20:122", label: { en: "Allah chooses Adam and guides him after forgiving him" } },
      ],
    },
    {
      id: "first-prophet",
      title: { en: "Adam, the First Prophet" },
      paragraphs: [
        {
          en: "Adam is called the father of all human beings. He is also honored as the very first prophet — the first person Allah chose to lead his family and the people after him toward the worship of Allah alone.",
        },
        {
          en: "Adam carried the message with a gentle heart. Allah taught him everything he needed to live on the earth, to grow food, to speak kindly, and to care for the children Allah gave him.",
        },
        {
          en: "Adam and Hawaa raised their family on earth. Their children learned from them that everyone is equal, and that we all come from one mother and one father. That is why the Qur’an reminds us: “O mankind, indeed We created you from a male and a female and made you into nations and tribes, so that you may know one another” (Qur’an 49:13).",
        },
        {
          en: "Prophet Muhammad, peace and blessings be upon him, reminded us how great Adam is. Adam is the very first human being, the first prophet, and the father of all later prophets. His story — from the honored clay, to the Garden, to the slip, and to the mercy of Allah — is the doorway through which all the other prophets followed.",
        },
        {
          en: "So when we look at the world Allah made, we can remember Adam’s story. His life whispers: do not fall into the pride of Iblis, and whenever you slip, the mercy of Allah is bigger than any mistake.",
        },
      ],
      sources: [
        { type: "quran", reference: "Qur’an 49:13", label: { en: "Allah created every human from a single man and woman, making nations and tribes so they may know one another" } },
        { type: "hadith", reference: "Sahih al-Bukhari; Sahih Muslim", needsVerification: true, label: { en: "The Prophet (PBUH) describes Adam as the first human being and the father of all people" } },
      ],
    },
  ],
};