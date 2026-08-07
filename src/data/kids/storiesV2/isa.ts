import type { KidsStoryV2 } from "types/kidsStories.types";

/**
 * Prophet Isa (AS) — KidsStoryV2 (chapter-based) implementation.
 *
 * The Messiah, son of Maryam, born by the word of Allah under a palm tree,
 * sent with the Injil, given miracles by Allah's permission, and raised by
 * Allah apart from a false claim. Anchored to the true Isa verses: Aal-Imran
 * (3:42–59), Surah Maryam (19:22–36), An-Nisa (4:157–159) and Al-Ma'idah
 * (5:110–115).
 * Fully bilingual (English + Urdu) per the Phase 12 bilingual standard.
 */
export const STORY_ISA: KidsStoryV2 = {
  id: "isa",
  type: "prophet",
  nameArabic: "عیسیٰ",
  nameEnglish: "Isa (Jesus)",
  illustrationSymbol: "Baby",
  accentColor: "#4a90d9",
  summary: {
    en: "Allah gave glad news to Maryam about a son without a father. She bore the blessed baby in a lonely place under a palm tree, and the baby spoke the truth in the cradle. Isa grew up as the Messiah, teaching worship of Allah alone and performing miracles by His permission. The Qur'an says he was not killed by his enemies — Allah raised him to Himself. And the example of Isa with Allah is like the example of Adam: a beloved servant and messenger of Allah.",
    ur: "اللہ نے مریم کو خوشخبری دی کہ اُن کے بغیر باپ کے ایک بیٹا ہوگا۔ مریم نے اُس بچے کو ایک دور کی جگہ کھجور کے درخت کے نیچے جنم دیا، اور گہوارے میں بچے نے سچ بولا۔ عیسیٰ مسیح بڑے ہو کر ایک اللہ کی عبادت سکھاتے رہے اور اللہ کی اجازت سے شفا دیتے رہے۔ قرآن کہتا ہے کہ دشمن اُنہیں قتل نہ کر سکے — اللہ نے اُنہیں اپنے پاس اٹھا لیا۔ اور عیسیٰ کی مثال اللہ کے نزدیک آدم جیسی ہے: اللہ کا پیارا بندہ اور رسول۔",
  },
  chapters: [
    {
      id: "the-angel-news",
      title: { en: "The Angel's News to Maryam", ur: "مریم کو فرشتے کی خوشخبری" },
      paragraphs: [
        {
          en: "The Qur'an speaks of Maryam with the sweetest words: \"And when the angels said: O Maryam, indeed Allah has chosen you, purified you, and chosen you above the women of the worlds\" (Qur'an 3:42). Maryam had a pure heart, always busy in worshiping her Lord.",
          ur: "قرآن مریم کو سب سے پیارے الفاظ سے یاد کرتا ہے: \"اور جب فرشتوں نے کہا: اے مریم! بیشک اللہ نے تجھے چن لیا، پاک کر دیا، اور دنیا کی عورتوں سے تجھے چن لیا\" (قرآن 3:42)۔ مریم کا دل پاک تھا اور وہ ہمیشہ اپنے رب کی عبادت میں لگی رہتی تھیں۔",
        },
        {
          en: "Then came the astonishing news. The angels said: \"O Maryam, indeed Allah gives you glad tidings of a word from Him, whose name is the Messiah — Isa son of Maryam — honored in this world and the Hereafter, and among those near to Allah\" (Qur'an 3:45). A baby was coming — with no father.",
          ur: "پھر وہ حیرت انگیز خبر آئی۔ فرشتوں نے کہا: \"اے مریم! بیشک اللہ تجھے اپنے ایک کلمے کی خوشخبری دیتا ہے، جس کا نام مسیح عیسیٰ بن مریم ہے، جو دنیا اور آخرت میں عزت والا اور اللہ کے مقرب لوگوں میں سے ہوگا\" (قرآن 3:45)۔ ایک بچہ آنے والا تھا — جس کا کوئی باپ نہیں تھا۔",
        },
        {
          en: "Maryam was amazed. How could she have a son, when no man had touched her? The answer came: \"He said: Thus will it be — your Lord says: It is easy for Me\" (Qur'an 3:47). The same Allah who created Adam without a father could create a child for Maryam.",
          ur: "مریم بہت حیران ہوئیں۔ بغیر باپ کے بیٹا کیسے ہو سکتا ہے؟ جواب آیا: \"فرمایا: ایسا ہی ہوگا — تیرا رب فرماتا ہے: یہ میرے لیے آسان ہے\" (قرآن 3:47)۔ جس اللہ نے آدم کو بغیر باپ کے بنایا، وہی مریم کے لیے بچہ بنا سکتا تھا۔",
        },
        {
          en: "And the angels told what the baby would do: \"He will speak to the people in the cradle and in maturity, and he will be among the righteous\" (Qur'an 3:46). A baby that speaks in the cradle — a sign of Allah to the whole world.",
          ur: "اور فرشتوں نے بتایا کہ بچہ کیا کرے گا: \"وہ لوگوں سے گہوارے میں بھی بات کرے گا اور بڑی عمر میں بھی، اور نیکوں میں سے ہوگا\" (قرآن 3:46)۔ ایک بچہ جو گہوارے میں بات کرے گا — پوری دنیا کے لیے اللہ کی ایک نشانی۔",
        },
        {
          en: "And Allah promised to teach him greatly: \"And He will teach him the Book, the wisdom, the Torah and the Injil\" (Qur'an 3:48). So Isa would be a special boy with a special book, carrying the light of Allah.",
          ur: "اور اللہ نے وعدہ کیا کہ اُسے بڑا علم سکھائے گا: \"اور اُسے کتاب، حکمت، تورات اور انجیل سکھائے گا\" (قرآن 3:48)۔ چنانچہ عیسیٰ ایک خاص بچہ ہوں گے جن کے پاس ایک خاص کتاب ہوگی، اور اُن کے ساتھ اللہ کا نور ہوگا۔",
        },
      ],
      ayahNote: {
        en: "Allah chose Maryam and gave her the news of a son without a father. The big lesson of this chapter: nothing is beyond Allah's power, and He loves a pure heart that worships Him.",
        ur: "اللہ نے مریم کو چن لیا اور اُنہیں بغیر باپ کے بیٹے کی خوشخبری دی۔ یہ باب سکھاتا ہے کہ اللہ کے لیے کچھ بھی مشکل نہیں، اور وہ صاف دل سے بہت محبت کرتا ہے۔",
      },
      sources: [
        {
          type: "quran",
          reference: "Qur'an 3:42",
          label: {
            en: "Allah chooses and purifies Maryam above the women of the worlds",
            ur: "اللہ مریم کو دنیا کی عورتوں پر چن لیتا ہے اور پاک کرتا ہے",
          },
          explanation: {
            en: "Even before the story begins, the Qur'an praises Maryam: Allah picked her and made her heart clean. When Allah gives such honor, no one can ever take it away.",
            ur: "کہانی شروع ہونے سے پہلے ہی قرآن مریم کی تعریف کرتا ہے: اللہ نے اُنہیں چنا اور اُن کا دل پاک کر دیا۔ جب اللہ کسی کو عزت دے تو یہ عزت کوئی چھین نہیں سکتا۔",
          },
        },
        {
          type: "quran",
          reference: "Qur'an 3:45–46",
          label: {
            en: "The angels give glad tidings of Isa, who will speak in the cradle",
            ur: "فرشتے عیسیٰ کی خوشخبری دیتے ہیں جو گہوارے میں بات کریں گے",
          },
          explanation: {
            en: "Before the son was even born, his whole mission was told: his name would be the Messiah, honored in this world and the Hereafter, and he would speak in the cradle. Nothing about Isa was a surprise to Allah.",
            ur: "بیٹے کے پیدا ہونے سے پہلے ہی اُس کی عظمت بتا دی گئی: اُس کا نام مسیح ہوگا، دنیا اور آخرت میں عزت والا، اور وہ گہوارے میں بھی باتیں کرے گا۔ اللہ کے لیے عیسیٰ کے بارے میں کچھ انجان نہیں تھا۔",
          },
        },
        {
          type: "quran",
          reference: "Qur'an 3:47–48",
          label: {
            en: "Allah says it is easy for Him and will teach Isa the Book and the Injil",
            ur: "اللہ فرماتا ہے یہ میرے لیے آسان ہے اور عیسیٰ کو کتاب اور انجیل سکھائے گا",
          },
          explanation: {
            en: "Maryam asked: how can I have a son? And Allah said: it is easy for Me. The One who made Adam without parents could give Maryam a child, and that same Lord would teach him the Torah and the Injil.",
            ur: "مریم نے پوچھا کہ میرے بیٹا کیسے ہو سکتا ہے؟ اللہ نے فرمایا: یہ میرے لیے آسان ہے۔ جس اللہ نے آدم کو بغیر باپ کے بنایا، وہی مریم کو بیٹا دے سکتا ہے، اور وہی اُسے تورات اور انجیل سکھائے گا۔",
          },
        },
      ],
    },
    {
      id: "the-birth-under-the-palm",
      title: { en: "The Birth Under the Palm", ur: "کھجور کے نیچے پیدائش" },
      paragraphs: [
        {
          en: "Months passed, and the time of the baby came. Maryam walked alone to a quiet, far-away place. The Qur'an says: \"So she conceived him and withdrew with him to a place far away\" (Qur'an 19:22).",
          ur: "مہینے گزر گئے، اور بچے کا وقت آ گیا۔ مریم اکیلی ایک دور اور خاموش جگہ چلی گئیں۔ قرآن کہتا ہے: \"پس وہ اُس سے حاملہ ہوئیں اور اُس کے ساتھ دور کی جگہ چلی گئیں\" (قرآن 19:22)۔",
        },
        {
          en: "The pain was hard, and Maryam was alone. She cried from her heart: \"Ah, would that I had died before this and been a thing forgotten\" (Qur'an 19:23).",
          ur: "درد بہت سخت تھا، اور مریم اکیلی تھیں۔ اُنہوں نے دل سے کہا: \"کاش میں اس سے پہلے مر گئی ہوتی اور بھولی بسر ہو گئی ہوتی\" (قرآن 19:23)۔",
        },
        {
          en: "But the Merciful Lord was with her. A voice came from under the palm: \"Do not grieve; your Lord has made a stream beneath you\" (Qur'an 19:24). Allah had placed water at the feet of the tired mother.",
          ur: "لیکن رحم کرنے والا رب اُس کے ساتھ تھا۔ کھجور کے درخت کی طرف سے ایک آواز آئی: \"غم نہ کرو؛ تیرے رب نے تیرے نیچے ایک چشمہ جاری کیا ہے\" (قرآن 19:24)۔ اللہ نے تھکی ہوئی ماں کے قدموں میں پانی رکھ دیا۔",
        },
        {
          en: "Then came the wonderful help: \"And shake the trunk of the palm tree toward you — it will drop upon you fresh, ripe dates. So eat, drink, and be glad\" (Qur'an 19:25–26). The first food of the new mother was sweet dates from the blessed tree.",
          ur: "پھر وہ پیاری مدد آئی: \"اور کھجور کے تنے کو اپنی طرف ہلا — وہ تجھ پر تازہ پکی ہوئی کھجوریں گرا دے گا۔ پس کھا، پی اور خوش ہو\" (قرآن 19:25–26)۔ نئی ماں کا پہلا کھانا اُس بابرکت درخت کی میٹھی کھجوریں تھیں۔",
        },
        {
          en: "And when she carried the baby back to her people, they were shocked: \"O Maryam, you have brought something unprecedented\" (Qur'an 19:27). Then the miracle happened — the baby in the cradle spoke: \"Indeed, I am the servant of Allah; He has given me the Book and made me a prophet\" (Qur'an 19:30). The little one spoke the truth.",
          ur: "اور جب وہ بچے کو اٹھا کر اپنی قوم کے پاس واپس آئیں تو لوگ حیران ہو گئے: \"اے مریم! تو ایک بہت بڑی چیز لے کر آئی\" (قرآن 19:27)۔ پھر معجزہ ہوا — گہوارے میں بچے نے بات کی: \"بیشک میں اللہ کا بندہ ہوں؛ اُس نے مجھے کتاب دی اور مجھے نبی بنایا\" (قرآن 19:30)۔ چھوٹے بچے نے سچ بولا۔",
        },
      ],
      ayahNote: {
        en: "At the loneliest moment, Allah was already near: water at Maryam's feet, fresh dates from the palm, and a baby who could even speak the truth. This chapter teaches a child that when a faithful heart is in trouble, Allah never leaves it alone.",
        ur: "سب سے تنہا لمحے میں اللہ پہلے سے موجود تھا: مریم کے قدموں میں چشمہ، کھجور سے تازہ میوہ اور گہوارے میں سچ بولنے والا بچہ۔ یہ باب بچوں کو سکھاتا ہے کہ ایمان والا دل مشکل میں ہو تو اللہ اُسے کبھی اکیلا نہیں چھوڑتا۔",
      },
      sources: [
        {
          type: "quran",
          reference: "Qur'an 19:22–23",
          label: {
            en: "Maryam conceives and withdraws to a far place, feeling the pangs by the palm",
            ur: "مریم حاملہ ہو کر دور جگہ جاتی ہیں اور کھجور کے پاس درد محسوس کرتی ہیں",
          },
          explanation: {
            en: "These verses do not hide the difficulty: a mother alone in a far place, feeling the pains of birth. They teach that even the hardest hour can become a place where Allah's mercy shows itself.",
            ur: "یہ آیات مصیبت نہیں چھپاتیں: ایک ماں دور جگہ اکیلے پیدائش کے درد میں۔ یہ سکھاتی ہیں کہ سب سے سخت وقت بھی وہ لمحہ بن سکتا ہے جہاں اللہ کی رحمت جلوہ کرتی ہے۔",
          },
        },
        {
          type: "quran",
          reference: "Qur'an 19:24–26",
          label: {
            en: "Allah comforts her with a stream and fresh ripe dates",
            ur: "اللہ اُسے چشمے اور تازہ پکی کھجوروں سے تسلی دیتا ہے",
          },
          explanation: {
            en: "The tired mother was told not to grieve: a stream appeared near her and sweet dates fell from the tree. It shows children how Allah sends comfort exactly when it is needed.",
            ur: "تھکی ہوئی ماں کو فرمایا گیا کہ غم نہ کرو: اُس کے پاس آبی پانی بہا اور درخت سے میٹھی کھجوریں جھکیں۔ یہ سکھاتا ہے کہ اللہ جب ضرورت ہو اسی وقت تسلی بھیجتا ہے۔",
          },
        },
        {
          type: "quran",
          reference: "Qur'an 19:27–30",
          label: {
            en: "The baby speaks in the cradle, declaring he is the servant of Allah",
            ur: "گہوارے میں بچہ بات کرتا ہے کہ میں اللہ کا بندہ ہوں",
          },
          explanation: {
            en: "A newborn baby cannot speak, yet the little Isa spoke to defend his mother and to announce the truth: I am the servant of Allah. This is the first wonder of the story and a clear sign from Allah.",
            ur: "نوزائیدہ بچہ بات نہیں کر سکتا، مگر چھوٹے عیسیٰ نے اپنی ماں کے لیے سچ ثابت کرنے کے لیے کہا: میں اللہ کا بندہ ہوں۔ یہ کہانی کا پہلا معجزہ اور اللہ کی ایک واضح نشانی ہیں۔",
          },
        },
      ],
    },
    {
      id: "the-messenger-and-miracles",
      title: { en: "The Messenger and His Miracles", ur: "رسول اور اُن کے معجزے" },
      paragraphs: [
        {
          en: "Isa grew up and became the prophet who was promised to Maryam. Allah gave him a beautiful book, the Injil: \"And He will teach him the Book and the wisdom and the Torah and the Injil\" (Qur'an 3:48). With the Injil, Isa guided his people back to the truth.",
          ur: "عیسیٰ بڑے ہوئے اور وہ نبی بنے جس کا وعدہ مریم سے کیا گیا تھا۔ اللہ نے اُنہیں ایک خوبصورت کتاب دی، انجیل: \"اور اُسے کتاب، حکمت، تورات اور انجیل سکھائے گا\" (قرآن 3:48)۔ انجیل کے ساتھ عیسیٰ نے اپنی قوم کو سچائی کی طرف واپس بلایا۔",
        },
        {
          en: "Isa's message was one and clear — worship Allah alone: \"Indeed, Allah is my Lord and your Lord, so worship Him — this is the straight path\" (Qur'an 3:51). He never asked anyone to worship him; he only pointed to his Lord.",
          ur: "عیسیٰ کا پیغام صرف ایک تھا — صرف اللہ کی عبادت کرو: \"بیشک اللہ میرا رب اور تمہارا رب ہے، پس اُسی کی عبادت کرو — یہی سیدھا راستہ ہے\" (قرآن 3:51)۔ اُنہوں نے کبھی کسی کو اپنی عبادت کے لیے نہیں کہا؛ وہ صرف اپنے رب کی طرف اشارہ کرتے تھے۔",
        },
        {
          en: "Allah gave His messenger beautiful miracles. The Qur'an recalls: \"And you heal the blind and the leper by My permission, and you bring the dead to life by My permission\" (Qur'an 5:110). The blind saw again, the sick became clean, and the dead returned — all by the power of Allah.",
          ur: "اللہ نے اپنے رسول کو خوبصورت معجزے دیے۔ قرآن یاد دلاتا ہے: \"اور تُو میری اجازت سے اندھے کو شفا دیتا تھا اور کوڑھی کو شفا دیتا تھا، اور تُو میری اجازت سے مردوں کو زندہ کرتا تھا\" (قرآن 5:110)۔ اندھے پھر سے دیکھتے، بیمار صحت پاتے، اور مردے زندہ ہو جاتے — سب اللہ کی طاقت سے۔",
        },
        {
          en: "Every miracle had one lesson: the One who does everything is Allah. Isa told his people: Allah created me without a father, so believe in His power, not in me. The miracles were a finger pointing to the sky.",
          ur: "ہر معجزے کا سبق ایک تھا: جو سب کچھ کرتا ہے وہ اللہ ہے۔ عیسیٰ نے اپنی قوم سے کہا: اللہ نے مجھے بغیر باپ کے بنایا، پس اُس کی قدرت پر ایمان لاؤ، میری طرف نہیں۔ معجزے آسمان کی طرف اٹھی ہوئی ایک انگلی تھے۔",
        },
        {
          en: "Isa called his people to complete surrender — to Islam. The Qur'an tells us: \"Indeed, the religion with Allah is Islam\" (Qur'an 3:19). One Lord, one way, and one gift: peace with Allah.",
          ur: "عیسیٰ نے اپنی قوم کو مکمل سپردگی کی دعوت دی — یعنی اسلام۔ قرآن ہمیں بتاتا ہے: \"بیشک اللہ کے نزدیک دین صرف اسلام ہے\" (قرآن 3:19)۔ ایک رب، ایک راستہ، اور ایک تحفہ: اللہ کے ساتھ سکون۔",
        },
      ],
      ayahNote: {
        en: "Every miracle of Isa carried the words: by Allah's permission. Healing the blind, cleaning the leper and even reviving the dead were signs pointing to one truth — the real Maker and Healer is Allah alone, and Isa called people only to worship Him.",
        ur: "عیسیٰ کا ہر معجزہ ان الفاظ کے ساتھ تھا: اللہ کی اجازت سے۔ اندھے کو شفا، کوڑھی کا صاف ہونا اور مردے کا زندہ ہونا سب ایک ہی سچ کی طرف اشارہ کرتے تھے: اصل بنانے والا اور شفا دینے والا صرف اللہ ہے، اور عیسیٰ لوگوں کو صرف اُسی کی عبادت کی دعوت دیتے تھے۔",
      },
      sources: [
        {
          type: "quran",
          reference: "Qur'an 3:48",
          label: {
            en: "Allah teaches Isa the Book, wisdom, the Torah and the Injil",
            ur: "اللہ عیسیٰ کو کتاب، حکمت، تورات اور انجیل سکھاتا ہے",
          },
          explanation: {
            en: "This verse shows the plan before Isa grew up: Allah would give him knowledge and the Injil so that he could teach his people the truth with wisdom and gentleness.",
            ur: "یہ آیت عیسیٰ کے بڑے ہونے سے پہلے کا انتظام بتاتی ہے: اللہ اُنہیں علم اور انجیل دے گا تاکہ وہ اپنی قوم کو حکمت اور نرمی سے سچ سکھا سکیں۔",
          },
        },
        {
          type: "quran",
          reference: "Qur'an 3:51",
          label: {
            en: "Isa calls the people to worship Allah alone, the straight path",
            ur: "عیسیٰ لوگوں کو صرف اللہ کی عبادت کی دعوت دیتے ہیں، سیدھا راستہ",
          },
          explanation: {
            en: "These are the words of Isa himself: Allah is my Lord and your Lord, so worship Him alone. This is the straight path — no one who follows it can get lost.",
            ur: "یہ عیسیٰ کے اپنے الفاظ ہیں: اللہ میرا رب اور تمہارا رب ہے، پس صرف اُسی کی عبادت کرو۔ یہی سیدھا راستہ ہے — جو اس پر چلے وہ کبھی بھٹک نہیں سکتا۔",
          },
        },
        {
          type: "quran",
          reference: "Qur'an 5:110",
          label: {
            en: "Isa heals the blind and the leper and revives the dead by Allah's permission",
            ur: "عیسیٰ اللہ کی اجازت سے اندھے اور کوڑھی کو شفا دیتے ہیں اور مردوں کو زندہ کرتے ہیں",
          },
          explanation: {
            en: "Every healing had the same condition: by My permission. It teaches children that the power belongs to Allah alone, and Isa was the chosen hand that Allah used to show His mercy.",
            ur: "ہر شفا میں ایک ہی شرط تھی: اللہ کی اجازت سے۔ یہ سکھاتی ہے کہ قدرت صرف اللہ کی ہے، اور عیسیٰ وہ منتخب بندہ تھے جن کے ذریعے اللہ اپنی رحمت دکھاتا تھا۔",
          },
        },
        {
          type: "quran",
          reference: "Qur'an 3:19",
          label: {
            en: "The religion with Allah is Islam",
            ur: "اللہ کے نزدیک دین صرف اسلام ہے",
          },
          explanation: {
            en: "Islam means giving yourself fully to the One Lord. It is not a new religion — it is the same call of every prophet, from Adam to Isa: worship Allah alone.",
            ur: "اسلام کا مطلب ہے اپنے آپ کو ایک اللہ کے سپرد کر دینا۔ یہ کوئی نیا دین نہیں — یہ وہی دعوت ہے جو آدم سے لے کر عیسیٰ تک ہر نبی نے دی: صرف اللہ کی عبادت کرو۔",
          },
        },
      ],
    },
    {
      id: "the-table-from-heaven",
      title: { en: "The Table from Heaven", ur: "آسمان سے خوان" },
      paragraphs: [
        {
          en: "Around Isa gathered faithful friends called the disciples — the Hawariyyun. They loved the Prophet and supported him. When Isa asked for helpers, they answered: \"We are the helpers of Allah\" (Qur'an 3:52).",
          ur: "عیسیٰ کے ارد گرد وفادار دوست جمع ہو گئے جنہیں حواری کہا جاتا ہے۔ وہ نبی سے محبت کرتے تھے اور اُن کا ساتھ دیتے تھے۔ جب عیسیٰ نے مددگار مانگے تو اُنہوں نے جواب دیا: \"ہم اللہ کے مددگار ہیں\" (قرآن 3:52)۔",
        },
        {
          en: "One day the disciples made a wonderful request: \"O Isa, son of Maryam, can your Lord send down to us a table from the sky?\" (Qur'an 5:112). They wanted a sign that their eyes could see and their hands could touch.",
          ur: "ایک دن حواریوں نے ایک خوبصورت سوال کیا: \"اے عیسیٰ بن مریم! کیا تیرا رب ہمارے لیے آسمان سے ایک خوان اتار سکتا ہے؟\" (قرآن 5:112)۔ وہ ایسی نشانی چاہتے تھے جو آنکھیں دیکھ سکیں اور ہاتھ چھو سکیں۔",
        },
        {
          en: "Isa turned to his Lord and prayed: \"O Allah, our Lord, send down to us a table from the sky that will be a feast for us, a sign from You, and grant us provision, for You are the best of providers\" (Qur'an 5:114).",
          ur: "عیسیٰ نے اپنے رب کی طرف رخ کیا اور دعا کی: \"اے اللہ! ہمارے رب! ہم پر آسمان سے ایک خوان اتار، جو ہمارے لیے عید ہو، تیری طرف سے ایک نشانی ہو، اور ہمیں رزق دے، کیونکہ تو سب سے بہتر رزق دینے والا ہے\" (قرآن 5:114)۔",
        },
        {
          en: "And the Lord answered. The Qur'an says the table came down from the sky with food from the blessing of Allah, and it became a sign for the believers of every time (Qur'an 5:115). A meal that no kitchen cooked, sent by the Lord of the heavens.",
          ur: "اور رب نے قبول فرمایا۔ قرآن کہتا ہے کہ وہ خوان آسمان سے اترا، اس میں اللہ کی برکت کا کھانا تھا، اور یہ ہر زمانے کے مومنوں کے لیے ایک نشانی بن گیا (قرآن 5:115)۔ ایک کھانا جسے کسی باورچی خانے نے نہیں پکایا تھا، آسمانوں کے رب نے بھیجا تھا۔",
        },
        {
          en: "That table taught the disciples a beautiful lesson: the same Allah who sends rain to the earth also spreads a table for His believers. Whoever trusts Him is never hungry in the heart.",
          ur: "اُس خوان نے حواریوں کو ایک خوبصورت سبق سکھایا: وہی اللہ جو زمین پر بارش بھیجتا ہے، وہی اپنے مومنوں کے لیے خوان بھی بچھاتا ہے۔ جو اُس پر بھروسہ کرتا ہے، اُس کا دل کبھی بھوکا نہیں رہتا۔",
        },
      ],
      ayahNote: {
        en: "The disciples wanted a sign their eyes could see, so they asked for a table from the sky, and Allah sent it. This chapter teaches a child that we may ask Allah for anything with a trusting heart — and He answers us with what is truly best.",
        ur: "حواریوں نے آنکھوں سے دیکھنے والی نشانی چاہی، اس لیے اُنہوں نے آسمان سے خوان طلبی کیا، اور اللہ نے اُسے اتارا۔ یہ باب بچوں کو سکھاتا ہے کہ بھروسے والے دل سے اللہ سے کچھ بھی مانگو — وہ ہمیشہ بہتر جواب دیتا ہے۔",
      },
      sources: [
        {
          type: "quran",
          reference: "Qur'an 3:52",
          label: {
            en: "The disciples declare they are the helpers of Allah",
            ur: "حواری اعلان کرتے ہیں کہ ہم اللہ کے مددگار ہیں",
          },
          explanation: {
            en: "When Isa asked who would stand with the truth, the disciples answered: we are the helpers of Allah. This verse honors the ones who come forward to support the truth with their heart and hands.",
            ur: "جب عیسیٰ نے پوچھا کہ سچ کے ساتھ کون کھڑا ہوتا ہے تو حواریوں نے کہا: ہم اللہ کے مددگار ہیں۔ یہ آیت اُن لوگوں کی عزت کرتی ہے جو دل اور ہاتھوں سے سچ کا ساتھ دیتے ہیں۔",
          },
        },
        {
          type: "quran",
          reference: "Qur'an 5:112–115",
          label: {
            en: "The disciples ask for a table from heaven and Allah sends it as a sign",
            ur: "حواری آسمان سے خوان مانگتے ہیں اور اللہ اُسے نشانی کے طور پر اتارتا ہے",
          },
          explanation: {
            en: "The disciples had strong faith: they believed Allah could send a whole table from the sky. The table came with food — a sign from Allah that He provides for His believers from where they never imagine.",
            ur: "حواریوں کا ایمان یقین تھا: وہ مانتے تھے کہ اللہ آسمان سے پورا خوان اتار سکتا ہے۔ خوان اترا — یہ اللہ کی نشانی تھی کہ وہ اپنے مومنوں کو وہاں سے رزق دیتا ہے جہاں سے وہ سوچ بھی نہیں سکتے۔",
          },
        },
      ],
    },
    {
      id: "the-enemies-plan",
      title: { en: "The Enemies' Plan", ur: "دشمنوں کی چال" },
      paragraphs: [
        {
          en: "But not everyone believed. The leaders of the city did not like the Prophet who healed the sick and woke the dead. They were afraid, and their hearts filled with hatred. The Qur'an says: \"And they planned, and Allah planned, and Allah is the best of planners\" (Qur'an 3:54).",
          ur: "لیکن سب نہیں مانے۔ شہر کے سرداروں کو وہ نبی پسند نہیں تھے جو بیماروں کو شفا دیتے اور مردوں کو جگاتے تھے۔ وہ ڈر گئے، اور اُن کے دل نفرت سے بھر گئے۔ قرآن کہتا ہے: \"اور اُنہوں نے چال چلی، اور اللہ نے بھی تدبیر کی، اور اللہ سب سے بہتر تدبیر کرنے والا ہے\" (قرآن 3:54)۔",
        },
        {
          en: "The leaders whispered among themselves and spread false words about the Prophet. They called him a magician and told the people not to listen. But the sick who were healed and the poor who were fed knew the truth — Isa was a man of Allah.",
          ur: "سرداروں نے آپس میں سرگوشیاں کیں اور نبی کے بارے میں جھوٹی باتیں پھیلائیں۔ اُنہوں نے اُسے جادوگر کہا اور لوگوں سے کہا کہ اُس کی نہ سنو۔ لیکن شفا پانے والے بیمار اور کھلانے والے غریب سچ جانتے تھے — عیسیٰ اللہ کے بندے تھے۔",
        },
        {
          en: "Their hatred grew until they decided to do a terrible thing — they wanted to kill the Prophet of Allah. The night came when the cruel people gathered, sure that their plan could not fail. But the Qur'an tells us: the plans of people are nothing beside the plan of Allah.",
          ur: "اُن کی نفرت بڑھتی گئی یہاں تک کہ اُنہوں نے ایک بہت برا فیصلہ کیا — وہ اللہ کے نبی کو قتل کرنا چاہتے تھے۔ وہ رات آئی جب ظالم لوگ جمع ہوئے، اور اُنہیں یقین تھا کہ اُن کی چال ناکام نہیں ہوگی۔ لیکن قرآن ہمیں بتاتا ہے: اللہ کی تدبیر کے سامنے لوگوں کی چالیں کچھ بھی نہیں۔",
        },
        {
          en: "Later, some of them even claimed: \"We have killed the Messiah, Isa son of Maryam, the messenger of Allah\" (Qur'an 4:157). They said it proudly — but their words were only words. The truth was different, and the Qur'an says it in the clearest way.",
          ur: "بعد میں اُن میں سے بعض نے یہ بھی کہا: \"ہم نے مسیح عیسیٰ بن مریم، اللہ کے رسول کو قتل کر دیا\" (قرآن 4:157)۔ اُنہوں نے فخر سے کہا — لیکن اُن کی باتیں صرف باتیں تھیں۔ سچ کچھ اور تھا، اور قرآن نے اُسے سب سے صاف الفاظ میں بیان کیا۔",
        },
        {
          en: "So the last chapter of the enemies' story was written by Allah, not by them. Let us open the next chapter to see what the Qur'an tells us really happened that night.",
          ur: "چنانچہ دشمنوں کی کہانی کا آخری باب اللہ نے لکھا، اُنہوں نے نہیں۔ آئیے اگلے باب میں دیکھتے ہیں کہ قرآن ہمیں بتاتا ہے کہ اُس رات اصل میں کیا ہوا۔",
        },
      ],
      ayahNote: {
        en: "The enemies whispered and made a cruel plan, but Allah had a plan of His own that was far stronger. This chapter teaches a child not to fear those who work against the truth — the best of planners is Allah.",
        ur: "دشمنوں نے سرگوشیاں کیں اور ایک ظالمانہ چال بنائی، مگر اللہ کی اپنی تدبیر تھی جو کہیں بہتر تھی۔ یہ باب بچوں کو سکھاتا ہے کہ سچ کے خلاف چال بنانے والوں سے مت ڈرو — سب سے بہتر تدبیر کرنے والا اللہ ہے۔",
      },
      sources: [
        {
          type: "quran",
          reference: "Qur'an 3:54",
          label: {
            en: "The enemies plan against Isa, and Allah is the best of planners",
            ur: "دشمن عیسیٰ کے خلاف چال چلتے ہیں، اور اللہ بہترین تدبیر کرنے والا ہے",
          },
          explanation: {
            en: "The cruel leaders made their plan, and then the verse gives the child the most comforting truth: Allah also made a plan, and His plan is the best. No tyrant can defeat the plan of Allah.",
            ur: "ظالم سرداروں نے اپنی چال بنائی، اور آیت بچوں کو سب سے بڑی تسلی دیتی ہے: اللہ نے بھی تدبیر کی، اور اُس کی تدبیر سب سے بہتر ہے۔ اللہ کی تدبیر کو کوئی ظالم کامیاب نہیں کر سکتا۔",
          },
        },
        {
          type: "quran",
          reference: "Qur'an 4:157",
          label: {
            en: "Some people claim they killed the Messiah — the Qur'an records their saying",
            ur: "بعض لوگ دعویٰ کرتے ہیں کہ ہم نے مسیح کو قتل کیا — قرآن اُن کا قول درج کرتا ہے",
          },
          explanation: {
            en: "The enemies boasted: we killed the Messiah. The verse quietly records their empty claim, preparing the child for the truth that follows — their words were only words.",
            ur: "دشمنوں نے فخر سے کہا: ہم نے مسیح کو قتل کر دیا۔ یہ آیت اُن کے خالی دعوے کو یوں ہی درج کر دیتی ہے، اور اگلی سچائی کا راستہ کھولتی ہے — اُن کی باتیں صرف باتیں تھیں۔",
          },
        },
      ],
    },
    {
      id: "allah-raised-him",
      title: { en: "Allah Raised Him", ur: "اللہ نے اُسے اٹھا لیا" },
      paragraphs: [
        {
          en: "Now listen to the truth that the Qur'an tells us. Allah says about that night: \"And they did not kill him, and they did not crucify him, but it was made to appear to them\" (Qur'an 4:157). The brave words of the enemies were empty — the Prophet of Allah was safe.",
          ur: "اب وہ سچ سنیں جو قرآن ہمیں بتاتا ہے۔ اللہ اُس رات کے بارے میں فرماتا ہے: \"اور اُنہوں نے نہ اُسے قتل کیا اور نہ سولی دی، بلکہ اُنہیں اُس کی جیسی شکل دکھائی گئی\" (قرآن 4:157)۔ دشمنوں کے بڑے دعوے خالی تھے — اللہ کا نبی محفوظ تھا۔",
        },
        {
          en: "Allah does not need soldiers to save His messenger. He simply said the word, and the plan of the enemies fell apart like a house of sand. The people could not touch the Prophet whom Allah was guarding.",
          ur: "اللہ کو اپنے رسول کو بچانے کے لیے فوجوں کی ضرورت نہیں۔ اُس نے بس ایک حکم فرمایا، اور دشمنوں کی چال ریت کے گھر کی طرح گر گئی۔ لوگ اُس نبی کو چھو بھی نہ سکے جس کی اللہ حفاظت کر رہا تھا۔",
        },
        {
          en: "Then Allah lifted His messenger to Himself: \"Rather, Allah raised him to Himself, and Allah is ever Mighty and Wise\" (Qur'an 4:158). The Prophet left this world in the most beautiful way — by rising to his Lord, not by the hands of his enemies.",
          ur: "پھر اللہ نے اپنے رسول کو اپنی طرف اٹھا لیا: \"بلکہ اللہ نے اُسے اپنی طرف اٹھا لیا، اور اللہ غالب اور حکمت والا ہے\" (قرآن 4:158)۔ نبی اس دنیا سے سب سے خوبصورت انداز میں رخصت ہوئے — اپنے دشمنوں کے ہاتھوں نہیں، اپنے رب کی طرف اٹھ کر۔",
        },
        {
          en: "And the Qur'an adds: \"And there is none of the People of the Book but will surely believe in him before his death\" (Qur'an 4:159). Even those who argued about him will one day see the truth — that Isa was a messenger of Allah, honored and safe.",
          ur: "اور قرآن مزید کہتا ہے: \"اور اہل کتاب میں کوئی نہیں جو اُس پر ایمان نہ لائے، اپنی موت سے پہلے\" (قرآن 4:159)۔ جو لوگ اُس کے بارے میں جھگڑتے تھے، وہ بھی ایک دن سچ دیکھیں گے — کہ عیسیٰ اللہ کے رسول تھے، معزز اور محفوظ۔",
        },
        {
          en: "So the story of that night ends with peace, not sorrow. The enemies were wrong, the believers were right, and the Prophet went home to the mercy of his Lord. Nothing about that night should make a Muslim sad — it was a night of Allah's protection.",
          ur: "چنانچہ اُس رات کی کہانی غم سے نہیں، سکون سے ختم ہوتی ہے۔ دشمن غلط تھے، مومن سچے تھے، اور نبی اپنے رب کی رحمت کی طرف واپس چلے گئے۔ اُس رات کی کوئی بات مسلمان کو غمگین نہیں کرنی چاہیے — وہ اللہ کی حفاظت کی رات تھی۔",
        },
      ],
      ayahNote: {
        en: "This chapter in three clear verses: they did not kill him and did not crucify him — Allah raised Isa up to Himself. For a child the lesson is the most calming of all: whoever is under Allah's protection can never be harmed by people.",
        ur: "یہ باب تین صاف آیتوں میں بتاتا ہے: اُنہوں نے نہ عیسیٰ کو قتل کیا اور نہ سولی دی — اللہ نے اُنہیں اپنی طرف اٹھا لیا۔ بچوں کے لیے سب سے سکون دینے والا سبق یہ ہے کہ جو اللہ کی حفاظت میں ہو، اُسے کوئی نقصان نہیں پہنچا سکتا۔",
      },
      sources: [
        {
          type: "quran",
          reference: "Qur'an 4:157",
          label: {
            en: "Isa was not killed and not crucified; it was made to appear so",
            ur: "عیسیٰ قتل نہیں ہوئے اور نہ سولی دی گئی؛ اُنہیں جیسی شکل دکھائی گئی",
          },
          explanation: {
            en: "The enemies searched for him, but Allah kept him safe. The verse clears the truth in one noble line: they never reached Isa at all — it was only made to appear to them.",
            ur: "دشمن اُن کی تلاش میں تھے، مگر اللہ نے اُن پر حفاظت کر رکھی تھی۔ یہ آیت سچائی صاف بیان کرتی ہے: دشمن اصل میں عیسیٰ تک پہنچ ہی نہیں سکے — اُنہیں بس اُس کی جیسی شکل دکھائی گئی۔",
          },
        },
        {
          type: "quran",
          reference: "Qur'an 4:158",
          label: {
            en: "Allah raised Isa to Himself, Mighty and Wise",
            ur: "اللہ نے عیسیٰ کو اپنی طرف اٹھایا، غالب اور حکمت والا",
          },
          explanation: {
            en: "Isa did not fly because he was strong — Allah raised him, because Allah is Mighty and Wise. It shows that honor comes from Allah alone, and no plan of anyone can stop His command.",
            ur: "عیسیٰ اپنی طاقت سے نہیں اڑے — اللہ نے اُنہیں اٹھایا، کیونکہ اللہ غالب اور حکمت والا ہے۔ یہ سکھاتی ہے کہ عزت صرف اللہ دیتا ہے، اور اُس کے حکم کو کوئی چال نہیں روک سکتی۔",
          },
        },
        {
          type: "quran",
          reference: "Qur'an 4:159",
          label: {
            en: "The People of the Book will believe in him",
            ur: "اہل کتاب اُس پر ایمان لائیں گے",
          },
          explanation: {
            en: "This verse gives a wonderful promise: one day all the People of the Book will know that Isa was a true messenger of Allah. Even the ones who argued about him will finally see the truth.",
            ur: "یہ آیت ایک پیاری خبر دیتی ہے: ایک دن اہلِ کتاب سب جان لیں گے کہ عیسیٰ اللہ کے سچے رسول تھے۔ جو لوگ اُس کے بارے میں جھگڑتے رہتے ہیں، وہ بھی ایک دن سچائی دیکھ لیں گے۔",
          },
        },
      ],
    },
    {
      id: "the-lesson",
      title: { en: "The Lesson: Isa, Servant of Allah", ur: "سبق: عیسیٰ، اللہ کا بندہ" },
      paragraphs: [
        {
          en: "Do you want to know who Isa really is? The Qur'an answers with a beautiful comparison: \"Indeed, the example of Isa with Allah is like the example of Adam. He created him from dust, then He said to him: Be, and he was\" (Qur'an 3:59). Like Adam, Isa was created by the word of Allah.",
          ur: "کیا آپ جاننا چاہتے ہیں کہ عیسیٰ اصل میں کون ہیں؟ قرآن ایک خوبصورت مثال سے جواب دیتا ہے: \"بیشک عیسیٰ کی مثال اللہ کے نزدیک آدم کی مثال جیسی ہے۔ اُس نے اُسے مٹی سے بنایا، پھر فرمایا: ہو جا، تو وہ ہو گیا\" (قرآن 3:59)۔ آدم کی طرح عیسیٰ بھی اللہ کے حکم سے بنائے گئے۔",
        },
        {
          en: "So Isa is not a god, and he never said he was. The Qur'an says: \"The Messiah, Isa son of Maryam, was only a messenger of Allah and His word which He gave to Maryam\" (Qur'an 4:171). A beloved prophet — but still a servant of Allah.",
          ur: "چنانچہ عیسیٰ خدا نہیں ہیں، اور اُنہوں نے کبھی یہ نہیں کہا کہ میں خدا ہوں۔ قرآن کہتا ہے: \"مسیح عیسیٰ بن مریم تو صرف اللہ کا رسول تھا، اور اُس کا کلمہ تھا جو اُس نے مریم کو دیا\" (قرآن 4:171)۔ ایک پیارا نبی — لیکن اللہ کا بندہ ہی۔",
        },
        {
          en: "The baby in the cradle had already said the same thing: \"Indeed, I am the servant of Allah; He has given me the Book and made me a prophet\" (Qur'an 19:30). From the cradle to the sky, Isa's words never changed — he was a servant of his Lord.",
          ur: "گہوارے میں بچے نے پہلے ہی یہی کہا تھا: \"بیشک میں اللہ کا بندہ ہوں؛ اُس نے مجھے کتاب دی اور مجھے نبی بنایا\" (قرآن 19:30)۔ گہوارے سے آسمان تک عیسیٰ کی بات کبھی نہیں بدلی — وہ اپنے رب کے بندے تھے۔",
        },
        {
          en: "And Allah gave him the sweetest greeting: \"Peace be upon me the day I was born, the day I die, and the day I am raised alive\" (Qur'an 19:33). A life with peace at its beginning, its end, and its return.",
          ur: "اور اللہ نے اُسے سب سے پیاری سلامتی دی: \"سلام ہے مجھ پر جس دن میں پیدا ہوا، جس دن میں مروں گا، اور جس دن زندہ اٹھایا جاؤں گا\" (قرآن 19:33)۔ ایک زندگی جس کے آغاز، انجام اور واپسی سب میں سکون تھا۔",
        },
        {
          en: "So when you hear about Isa, remember this lesson: he is a prophet of Allah, a servant of his Lord, and a brother of all the messengers. We love him, we honor him, and we follow the truth he brought: worship Allah alone. That is the way of Isa, the way of Islam, and the way of peace.",
          ur: "چنانچہ جب آپ عیسیٰ کا ذکر سنیں تو یہ سبق یاد رکھیں: وہ اللہ کے نبی ہیں، اپنے رب کے بندے ہیں، اور تمام رسولوں کے بھائی ہیں۔ ہم اُن سے محبت کرتے ہیں، اُن کی عزت کرتے ہیں، اور اُس سچ کی پیروی کرتے ہیں جو وہ لائے: صرف اللہ کی عبادت۔ یہی عیسیٰ کا راستہ ہے، یہی اسلام کا راستہ ہے، اور یہی سکون کا راستہ ہے۔",
        },
      ],
      ayahNote: {
        en: "This is the answer to the most important question of the whole story: who is Isa? The Qur'an says: like Adam, he was made by the word 'Be', a beloved servant and messenger of Allah. We love him and honor him, but we never worship him — we worship only Allah.",
        ur: "یہ پوری کہانی کے سب سے بڑے سوال کا جواب ہے: عیسیٰ کون ہیں؟ قرآن کہتا ہے: آدم کی طرح، وہ بھی حکمِ ہو جا سے بنائے گئے، اللہ کے پیارے بندے اور رسول۔ ہم اُن سے محبت کرتے ہیں اور اُن کی عزت کرتے ہیں، مگر اُن کی عبادت نہیں کرتے — عبادت صرف اللہ کی ہے۔",
      },
      sources: [
        {
          type: "quran",
          reference: "Qur'an 3:59",
          label: {
            en: "The example of Isa is like the example of Adam, created by the word 'Be'",
            ur: "عیسیٰ کی مثال آدم جیسی ہے، جو اللہ کے حکم سے بنائے گئے",
          },
          explanation: {
            en: "The verse uses the example of Adam to explain the highest lesson: Isa had no father, just like Adam whom Allah made directly from dust with the word 'Be'. Both were created by Allah — and both were servants, not gods.",
            ur: "یہ آیت عیسیٰ کو آدم کی مثال سے سمجھاتی ہے: جس طرح آدم بغیر باپ کے اللہ کے حکم سے بنے، اسی طرح عیسیٰ بنے — دونوں اللہ کے بندے تھے، خدا نہیں۔",
          },
        },
        {
          type: "quran",
          reference: "Qur'an 4:171",
          label: {
            en: "Isa was only a messenger of Allah and His word to Maryam",
            ur: "عیسیٰ صرف اللہ کے رسول تھے اور اُس کا کلمہ جو مریم کو دیا گیا",
          },
          explanation: {
            en: "This verse describes Isa with two beautiful names: a messenger of Allah, and a word of Allah that came to Maryam. He is the highest of servants — but still a servant, created and honored by Allah.",
            ur: "یہ آیت عیسیٰ کو دو خوبصورت ناموں سے یاد کرتی ہے: اللہ کا رسول، اور اللہ کا کلمہ جو مریم تک پہنچا۔ وہ بندوں میں سب سے بلند مقام رکھتے ہیں — مگر پھر بھی بندے ہی ہیں، اللہ کے بنائے ہوئے اور اُس کی عزت والے۔",
          },
        },
        {
          type: "quran",
          reference: "Qur'an 19:30, 19:33",
          label: {
            en: "Isa declares he is the servant of Allah and greets himself with peace",
            ur: "عیسیٰ کہتے ہیں کہ میں اللہ کا بندہ ہوں اور اپنے لیے سلام چاہتے ہیں",
          },
          explanation: {
            en: "The first words of Isa from the cradle and the words he kept his whole life reach as one: I am the servant of Allah and, peace be upon me — from my birth to my return to my Lord. His life began and ended with peace and servanthood.",
            ur: "گہوارے میں عیسیٰ کے پہلے الفاظ اور وہی الفاظ اُن کی زندگی کا خلاصہ ہیں: میں اللہ کا بندہ ہوں، اور میری پیدائش سے لے کر اپنے رب کی طرف لوٹنے تک مجھ پر سلام ہے۔ اُن کی زندگی اسی بندگی اور سلامتی کے ساتھ گزری۔",
          },
        },
      ],
    },
  ],
};
