export type Lang = "en" | "bn" | "hi" | "ar" | "ru" | "tr" | "ur" | "pa" | "id" | "fr" | "es" | "pt";

export const LANGUAGES: Record<Lang, string> = {
  en: "🇬🇧 English",
  bn: "🇧🇩 বাংলা",
  hi: "🇮🇳 हिन्दी",
  ar: "🇸🇦 العربية",
  ru: "🇷🇺 Русский",
  tr: "🇹🇷 Türkçe",
  ur: "🇵🇰 اردو",
  pa: "🇮🇳 ਪੰਜਾਬੀ",
  id: "🇮🇩 Indonesia",
  fr: "🇫🇷 Français",
  es: "🇪🇸 Español",
  pt: "🇧🇷 Português",
};

export function escHtml(s: string): string {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function bar(n: number, max: number, w = 10): string {
  const f = Math.min(Math.round((Math.max(n, 0) / Math.max(max, 1)) * w), w);
  return "▰".repeat(f) + "░".repeat(w - f);
}

// ─── Decorative separators ────────────────────────────────────────────────────
const SEP  = "━━━━━━━━━━━━━━━━━━━━━━━━━";
const LINE = "─────────────────────────";
const DBL  = "══════════════════════════";

// ─── Telegram Premium Custom Emoji helper ─────────────────────────────────────
// <tg-emoji> shows animated premium emoji to Telegram Premium users.
// Non-premium users see the fallback text emoji (works perfectly either way).
const pe = (_id: string, fb: string): string => fb;

// ── Animated Premium Emoji variables ─────────────────────────────────────────
const $fire     = pe("5199982628387815413", "🔥");
const $gem      = pe("5471952986970267163", "💎");
const $star     = pe("5368324170671202286", "⭐");
const $crown    = pe("5415765372354901993", "👑");
const $trophy   = pe("5415765372354901993", "🏆");
const $rocket   = pe("5315965544429987682", "🚀");
const $zap      = pe("5416040106720475628", "⚡");
const $check    = pe("5368324170671202286", "✅");
const $cross    = pe("5199982628387815413", "❌");
const $ban      = pe("5415765372354901993", "🚫");
const $warn     = pe("5199982628387815413", "⚠️");
const $lock     = pe("5415765372354901993", "🔒");
const $party    = pe("5199982628387815413", "🎉");
const $gift     = pe("5199982628387815413", "🎁");
const $sparkle  = pe("5368324170671202286", "✨");
const $shine    = pe("5368324170671202286", "🌟");
const $moon     = pe("5368324170671202286", "🌙");
const $money    = pe("5463163590754375938", "💰");
const $cashfly  = pe("5463163590754375938", "💸");
const $dollar   = pe("5463163590754375938", "💵");
const $wallet   = pe("5463163590754375938", "💼");
const $people   = pe("5368324170671202286", "👥");
const $user     = pe("5368324170671202286", "👤");
const $globe    = pe("5471952986970267163", "🌐");
const $tv       = pe("5199982628387815413", "📺");
const $chart    = pe("5471952986970267163", "📊");
const $chart2   = pe("5471952986970267163", "📈");
const $bell     = pe("5368324170671202286", "🔔");
const $movie    = pe("5199982628387815413", "🎬");
const $clip     = pe("5471952986970267163", "📋");
const $share    = pe("5368324170671202286", "📨");
const $link     = pe("5416040106720475628", "🔗");
const $refresh  = pe("5199982628387815413", "🔄");
const $phone    = pe("5471952986970267163", "📱");
const $bank     = pe("5415765372354901993", "🏦");
const $mailbox  = pe("5368324170671202286", "📬");
const $clock    = pe("5199982628387815413", "⏰");
const $hourglass= pe("5199982628387815413", "⏳");
const $cal      = pe("5471952986970267163", "📅");
const $inbox    = pe("5368324170671202286", "📩");
const $idcard   = pe("5415765372354901993", "🆔");
const $note     = pe("5471952986970267163", "📝");
const $mega     = pe("5368324170671202286", "📢");
const $diamond  = pe("5471952986970267163", "💠");
const $target   = pe("5471952986970267163", "🎯");
const $coins    = pe("5463163590754375938", "🪙");
const $up       = pe("5471952986970267163", "📈");

const walletMessages: Record<Lang, Record<string, string>> = {
  en: {
    walletOverviewMsg: `💳 <b>WALLET &amp; WITHDRAW</b>
<code>${SEP}</code>
💰 <b>Wallet Overview</b>
<code>${LINE}</code>
💵 Available Balance: <b>$ {balance} USD</b>
✅ Total Withdrawn: <b>$ {totalWithdrawn} USD</b>
📌 Minimum Payout: <b>$ {minPayout} USD</b>
<code>${LINE}</code>
📢 Payments are processed automatically or within <b>24 hours</b>.`,
    requestWithdrawalBtn: "📤 Request Withdrawal", setPayoutWalletBtn: "⚙️ Set Payout Wallet",
    payoutHistoryBtn: "📜 Payout History", paymentProofsBtn: "📢 Payment Proofs", walletMainBtn: "🏠 Main",
    walletPromptUsdt: `💎 <b>Withdraw via USDT (TRC-20)</b>
Please reply with your USDT TRC-20 Wallet Address.
💡 Example Format: <code>TQ5xJv8mK2pN7rS4dF9hL3wC6yB1aZ8X0Y</code>
⚠️ Address must start with the letter "T" and contain 34 characters.`,
    walletPromptBinance: `🟡 <b>Withdraw via Binance Pay</b>
Please reply with your 8 to 10-digit Binance Pay ID.
💡 Example Format: <code>123456789</code>
⚠️ Do not send Email, Pay ID only.`,
    walletPromptMobile: `🟢 <b>Withdraw via bKash / Nagad</b>
Please reply with your 11-digit Personal Number.
💡 Example Format: <code>01712345678</code>
⚠️ Numbers starting with 01 only.`,
    walletPromptUpi: `🇮🇳 <b>Withdraw via UPI (GPay/Paytm/PhonePe)</b>
Please reply with your valid UPI ID.
💡 Example Format: <code>username@paytm</code> or <code>9876543210@ybl</code>`,
    walletInvalidUsdt: `❌ <b>Invalid USDT Address!</b>
The address you entered is incorrect. Please ensure it is a valid TRC-20 address starting with "T".
💡 Example: <code>TQ5xJv8mK2pN7rS4dF9hL3wC6yB1aZ8X0Y</code>
Please try again or cancel.`,
    walletInvalidBinance: `❌ <b>Invalid Binance Pay ID!</b>
Please enter a valid numerical Binance Pay ID (8 to 10 digits).
💡 Example: <code>123456789</code>`,
    walletInvalidMobile: `❌ <b>Invalid Mobile Number!</b>
Please send a valid 11-digit Bangladeshi mobile number.
💡 Example: <code>01712345678</code>`,
    walletInvalidUpi: `❌ <b>Invalid UPI ID Format!</b>
Your UPI ID must include @ (e.g., @paytm, @ybl, @upi).
💡 Example: <code>yourname@paytm</code>`,
    walletInvalidGeneric: `❌ <b>Invalid payout details!</b>
Please send the correct number, wallet address, or email format shown in the example.
Please try again or go back.`,
    walletSavedMsg: `✅ <b>Wallet Saved Successfully!</b>
💳 Saved Wallet: <code>{address}</code>
You can now request payouts directly to this address.`,
    payoutHistoryMsg: `📜 <b>PAYOUT HISTORY</b>
<code>${SEP}</code>
{entries}`, paymentProofsMsg: `📢 <b>PAYMENT PROOFS</b>
<code>${SEP}</code>
{entries}`, noPayoutHistory: "No payout history yet.", noPaymentProofs: "No payment proofs available yet.",
  },
  bn: {
    walletOverviewMsg: `💳 <b>ওয়ালেট ও উইথড্র</b>
<code>${SEP}</code>
💰 <b>ওয়ালেট ওভারভিউ</b>
<code>${LINE}</code>
💵 Available Balance: <b>$ {balance} USD</b>
✅ Total Withdrawn: <b>$ {totalWithdrawn} USD</b>
📌 Minimum Payout: <b>$ {minPayout} USD</b>
<code>${LINE}</code>
📢 পেমেন্ট স্বয়ংক্রিয়ভাবে অথবা <b>২৪ ঘণ্টার মধ্যে</b> প্রক্রিয়া হবে।`,
    requestWithdrawalBtn: "📤 উইথড্র রিকোয়েস্ট", setPayoutWalletBtn: "⚙️ পেআউট ওয়ালেট সেট",
    payoutHistoryBtn: "📜 পেআউট হিস্টোরি", paymentProofsBtn: "📢 পেমেন্ট প্রুফ", walletMainBtn: "🏠 মেইন",
    walletPromptUsdt: `💎 <b>USDT (TRC-20) দিয়ে উইথড্র</b>
আপনার USDT TRC-20 Wallet Address পাঠান।
💡 উদাহরণ: <code>TQ5xJv8mK2pN7rS4dF9hL3wC6yB1aZ8X0Y</code>
⚠️ Address অবশ্যই "T" দিয়ে শুরু হবে এবং ৩৪ অক্ষরের হতে হবে।`,
    walletPromptBinance: `🟡 <b>Binance Pay দিয়ে উইথড্র</b>
আপনার ৮ থেকে ১০ সংখ্যার Binance Pay ID পাঠান।
💡 উদাহরণ: <code>123456789</code>
⚠️ Email নয়, শুধু Pay ID পাঠান।`,
    walletPromptMobile: `🟢 <b>bKash / Nagad দিয়ে উইথড্র</b>
আপনার ১১ সংখ্যার Personal Number পাঠান।
💡 উদাহরণ: <code>01712345678</code>
⚠️ নম্বরটি 01 দিয়ে শুরু হতে হবে।`,
    walletPromptUpi: `🇮🇳 <b>UPI (GPay/Paytm/PhonePe) দিয়ে উইথড্র</b>
আপনার সঠিক UPI ID পাঠান।
💡 উদাহরণ: <code>username@paytm</code> অথবা <code>9876543210@ybl</code>`,
    walletInvalidUsdt: `❌ <b>ভুল USDT Address!</b>
সঠিক TRC-20 address দিন, যা "T" দিয়ে শুরু হবে।
💡 উদাহরণ: <code>TQ5xJv8mK2pN7rS4dF9hL3wC6yB1aZ8X0Y</code>
আবার চেষ্টা করুন অথবা Cancel চাপুন।`,
    walletInvalidBinance: `❌ <b>ভুল Binance Pay ID!</b>
৮ থেকে ১০ সংখ্যার সঠিক Binance Pay ID দিন।
💡 উদাহরণ: <code>123456789</code>`,
    walletInvalidMobile: `❌ <b>ভুল মোবাইল নম্বর!</b>
সঠিক ১১ সংখ্যার বাংলাদেশি মোবাইল নম্বর দিন।
💡 উদাহরণ: <code>01712345678</code>`,
    walletInvalidUpi: `❌ <b>ভুল UPI ID Format!</b>
আপনার UPI ID-তে @ থাকতে হবে, যেমন @paytm, @ybl বা @upi।
💡 উদাহরণ: <code>yourname@paytm</code>`,
    walletInvalidGeneric: `❌ <b>ভুল পেআউট তথ্য!</b>
উদাহরণ অনুযায়ী সঠিক নম্বর, ওয়ালেট ঠিকানা বা ইমেইল দিন।
আবার চেষ্টা করুন অথবা ফিরে যান।`,
    walletSavedMsg: `✅ <b>ওয়ালেট সফলভাবে সেভ হয়েছে!</b>
💳 Saved Wallet: <code>{address}</code>
এখন এই address-এ সরাসরি payout request করতে পারবেন।`,
    payoutHistoryMsg: `📜 <b>পেআউট হিস্টোরি</b>
<code>${SEP}</code>
{entries}`, paymentProofsMsg: `📢 <b>পেমেন্ট প্রুফ</b>
<code>${SEP}</code>
{entries}`, noPayoutHistory: "এখনো কোনো পেআউট হিস্টোরি নেই।", noPaymentProofs: "এখনো কোনো পেমেন্ট প্রুফ নেই।",
  },
  hi: {
    walletOverviewMsg: `💳 <b>वॉलेट और निकासी</b>\n<code>${SEP}</code>\n💰 <b>वॉलेट विवरण</b>\n<code>${LINE}</code>\n💵 उपलब्ध बैलेंस: <b>$ {balance} USD</b>\n✅ कुल निकासी: <b>$ {totalWithdrawn} USD</b>\n📌 न्यूनतम भुगतान: <b>$ {minPayout} USD</b>\n<code>${LINE}</code>\n📢 भुगतान अपने-आप या <b>24 घंटे के भीतर</b> प्रोसेस होगा।`,
    requestWithdrawalBtn: "📤 निकासी अनुरोध", setPayoutWalletBtn: "⚙️ भुगतान वॉलेट सेट करें", payoutHistoryBtn: "📜 भुगतान इतिहास", paymentProofsBtn: "📢 भुगतान प्रमाण", walletMainBtn: "🏠 मुख्य मेनू",
    walletPromptUsdt: `💎 <b>USDT (TRC-20) से निकासी</b>\nकृपया अपना USDT TRC-20 वॉलेट एड्रेस भेजें।\n💡 उदाहरण: <code>TQ5xJv8mK2pN7rS4dF9hL3wC6yB1aZ8X0Y</code>\n⚠️ एड्रेस "T" से शुरू होना चाहिए और 34 अक्षरों का होना चाहिए।`,
    walletPromptBinance: `🟡 <b>Binance Pay से निकासी</b>\nअपना 8 से 10 अंकों का Binance Pay ID भेजें।\n💡 उदाहरण: <code>123456789</code>\n⚠️ Email नहीं, केवल Pay ID भेजें।`,
    walletPromptMobile: `🟢 <b>bKash / Nagad से निकासी</b>\nअपना 11 अंकों का व्यक्तिगत नंबर भेजें।\n💡 उदाहरण: <code>01712345678</code>\n⚠️ नंबर 01 से शुरू होना चाहिए।`,
    walletPromptUpi: `🇮🇳 <b>UPI (GPay/Paytm/PhonePe) से निकासी</b>\nअपना सही UPI ID भेजें।\n💡 उदाहरण: <code>username@paytm</code> या <code>9876543210@ybl</code>`,
    walletInvalidUsdt: `❌ <b>गलत USDT एड्रेस!</b>\nसही TRC-20 एड्रेस भेजें जो "T" से शुरू हो।\n💡 उदाहरण: <code>TQ5xJv8mK2pN7rS4dF9hL3wC6yB1aZ8X0Y</code>\nफिर प्रयास करें या Cancel दबाएँ।`,
    walletInvalidBinance: `❌ <b>गलत Binance Pay ID!</b>\n8 से 10 अंकों का सही Pay ID भेजें।\n💡 उदाहरण: <code>123456789</code>`,
    walletInvalidMobile: `❌ <b>गलत मोबाइल नंबर!</b>\n11 अंकों का सही बांग्लादेशी मोबाइल नंबर भेजें।\n💡 उदाहरण: <code>01712345678</code>`,
    walletInvalidUpi: `❌ <b>गलत UPI ID फॉर्मेट!</b>\nUPI ID में @ होना चाहिए।\n💡 उदाहरण: <code>yourname@paytm</code>`,
    walletSavedMsg: `✅ <b>वॉलेट सफलतापूर्वक सेव हो गया!</b>\n💳 सेव वॉलेट: <code>{address}</code>\nअब आप इसी एड्रेस पर भुगतान अनुरोध कर सकते हैं।`,
    payoutHistoryMsg: `📜 <b>भुगतान इतिहास</b>\n<code>${SEP}</code>\n{entries}`, paymentProofsMsg: `📢 <b>भुगतान प्रमाण</b>\n<code>${SEP}</code>\n{entries}`, noPayoutHistory: "अभी कोई भुगतान इतिहास नहीं है।", noPaymentProofs: "अभी कोई भुगतान प्रमाण उपलब्ध नहीं है।",
  },
  ar: {
    walletOverviewMsg: `💳 <b>المحفظة والسحب</b>\n<code>${SEP}</code>\n💰 <b>ملخص المحفظة</b>\n<code>${LINE}</code>\n💵 الرصيد المتاح: <b>$ {balance} USD</b>\n✅ إجمالي المسحوب: <b>$ {totalWithdrawn} USD</b>\n📌 الحد الأدنى للدفع: <b>$ {minPayout} USD</b>\n<code>${LINE}</code>\n📢 تتم معالجة المدفوعات تلقائياً أو خلال <b>24 ساعة</b>.`,
    requestWithdrawalBtn: "📤 طلب سحب", setPayoutWalletBtn: "⚙️ تعيين محفظة الدفع", payoutHistoryBtn: "📜 سجل المدفوعات", paymentProofsBtn: "📢 إثباتات الدفع", walletMainBtn: "🏠 الرئيسية",
    walletPromptUsdt: `💎 <b>السحب عبر USDT (TRC-20)</b>\nأرسل عنوان محفظة USDT TRC-20.\n💡 مثال: <code>TQ5xJv8mK2pN7rS4dF9hL3wC6yB1aZ8X0Y</code>\n⚠️ يجب أن يبدأ العنوان بحرف "T" ويتكون من 34 حرفاً.`,
    walletPromptBinance: `🟡 <b>السحب عبر Binance Pay</b>\nأرسل معرّف Binance Pay من 8 إلى 10 أرقام.\n💡 مثال: <code>123456789</code>\n⚠️ أرسل المعرّف فقط وليس البريد الإلكتروني.`,
    walletPromptMobile: `🟢 <b>السحب عبر bKash / Nagad</b>\nأرسل رقمك الشخصي المكون من 11 رقماً.\n💡 مثال: <code>01712345678</code>\n⚠️ يجب أن يبدأ الرقم بـ 01.`,
    walletPromptUpi: `🇮🇳 <b>السحب عبر UPI</b>\nأرسل معرف UPI صالحاً.\n💡 مثال: <code>username@paytm</code> أو <code>9876543210@ybl</code>`,
    walletInvalidUsdt: `❌ <b>عنوان USDT غير صالح!</b>\nأرسل عنوان TRC-20 صحيحاً يبدأ بحرف "T".\n💡 مثال: <code>TQ5xJv8mK2pN7rS4dF9hL3wC6yB1aZ8X0Y</code>\nحاول مرة أخرى أو اضغط إلغاء.`,
    walletInvalidBinance: `❌ <b>معرّف Binance Pay غير صالح!</b>\nأرسل معرّفاً رقمياً من 8 إلى 10 أرقام.\n💡 مثال: <code>123456789</code>`,
    walletInvalidMobile: `❌ <b>رقم هاتف غير صالح!</b>\nأرسل رقم هاتف بنغلاديشي صحيحاً من 11 رقماً.\n💡 مثال: <code>01712345678</code>`,
    walletInvalidUpi: `❌ <b>تنسيق UPI غير صالح!</b>\nيجب أن يحتوي معرف UPI على @.\n💡 مثال: <code>yourname@paytm</code>`,
    walletSavedMsg: `✅ <b>تم حفظ المحفظة بنجاح!</b>\n💳 المحفظة المحفوظة: <code>{address}</code>\nيمكنك الآن طلب المدفوعات إلى هذا العنوان.`,
    payoutHistoryMsg: `📜 <b>سجل المدفوعات</b>\n<code>${SEP}</code>\n{entries}`, paymentProofsMsg: `📢 <b>إثباتات الدفع</b>\n<code>${SEP}</code>\n{entries}`, noPayoutHistory: "لا يوجد سجل مدفوعات بعد.", noPaymentProofs: "لا توجد إثباتات دفع متاحة بعد.",
  },
  ru: {
    walletOverviewMsg: `💳 <b>КОШЕЛЁК И ВЫВОД</b>\n<code>${SEP}</code>\n💰 <b>Обзор кошелька</b>\n<code>${LINE}</code>\n💵 Доступный баланс: <b>$ {balance} USD</b>\n✅ Всего выведено: <b>$ {totalWithdrawn} USD</b>\n📌 Минимальная выплата: <b>$ {minPayout} USD</b>\n<code>${LINE}</code>\n📢 Платёж обрабатывается автоматически или в течение <b>24 часов</b>.`,
    requestWithdrawalBtn: "📤 Запросить вывод", setPayoutWalletBtn: "⚙️ Указать кошелёк", payoutHistoryBtn: "📜 История выплат", paymentProofsBtn: "📢 Подтверждения оплаты", walletMainBtn: "🏠 Главное меню",
    walletPromptUsdt: `💎 <b>Вывод через USDT (TRC-20)</b>\nОтправьте адрес кошелька USDT TRC-20.\n💡 Пример: <code>TQ5xJv8mK2pN7rS4dF9hL3wC6yB1aZ8X0Y</code>\n⚠️ Адрес должен начинаться с "T" и содержать 34 символа.`,
    walletPromptBinance: `🟡 <b>Вывод через Binance Pay</b>\nОтправьте Binance Pay ID из 8–10 цифр.\n💡 Пример: <code>123456789</code>\n⚠️ Отправляйте только Pay ID, не email.`,
    walletPromptMobile: `🟢 <b>Вывод через bKash / Nagad</b>\nОтправьте личный номер из 11 цифр.\n💡 Пример: <code>01712345678</code>\n⚠️ Номер должен начинаться с 01.`,
    walletPromptUpi: `🇮🇳 <b>Вывод через UPI</b>\nОтправьте действительный UPI ID.\n💡 Пример: <code>username@paytm</code> или <code>9876543210@ybl</code>`,
    walletInvalidUsdt: `❌ <b>Неверный адрес USDT!</b>\nУкажите корректный адрес TRC-20, начинающийся с "T".\n💡 Пример: <code>TQ5xJv8mK2pN7rS4dF9hL3wC6yB1aZ8X0Y</code>\nПопробуйте ещё раз или нажмите Отмена.`,
    walletInvalidBinance: `❌ <b>Неверный Binance Pay ID!</b>\nВведите числовой ID длиной 8–10 цифр.\n💡 Пример: <code>123456789</code>`,
    walletInvalidMobile: `❌ <b>Неверный номер телефона!</b>\nВведите корректный бангладешский номер из 11 цифр.\n💡 Пример: <code>01712345678</code>`,
    walletInvalidUpi: `❌ <b>Неверный формат UPI ID!</b>\nUPI ID должен содержать символ @.\n💡 Пример: <code>yourname@paytm</code>`,
    walletSavedMsg: `✅ <b>Кошелёк успешно сохранён!</b>\n💳 Сохранённый кошелёк: <code>{address}</code>\nТеперь вы можете запрашивать выплаты на этот адрес.`,
    payoutHistoryMsg: `📜 <b>ИСТОРИЯ ВЫПЛАТ</b>\n<code>${SEP}</code>\n{entries}`, paymentProofsMsg: `📢 <b>ПОДТВЕРЖДЕНИЯ ОПЛАТЫ</b>\n<code>${SEP}</code>\n{entries}`, noPayoutHistory: "История выплат пока пуста.", noPaymentProofs: "Подтверждений оплаты пока нет.",
  },
  tr: {
    walletOverviewMsg: `💳 <b>CÜZDAN VE ÇEKİM</b>\n<code>${SEP}</code>\n💰 <b>Cüzdan Özeti</b>\n<code>${LINE}</code>\n💵 Kullanılabilir bakiye: <b>$ {balance} USD</b>\n✅ Toplam çekilen: <b>$ {totalWithdrawn} USD</b>\n📌 Minimum ödeme: <b>$ {minPayout} USD</b>\n<code>${LINE}</code>\n📢 Ödemeler otomatik veya <b>24 saat içinde</b> işlenir.`,
    requestWithdrawalBtn: "📤 Çekim Talebi", setPayoutWalletBtn: "⚙️ Ödeme Cüzdanı Ayarla", payoutHistoryBtn: "📜 Ödeme Geçmişi", paymentProofsBtn: "📢 Ödeme Kanıtları", walletMainBtn: "🏠 Ana Menü",
    walletPromptUsdt: `💎 <b>USDT (TRC-20) ile çekim</b>\nUSDT TRC-20 cüzdan adresinizi gönderin.\n💡 Örnek: <code>TQ5xJv8mK2pN7rS4dF9hL3wC6yB1aZ8X0Y</code>\n⚠️ Adres "T" ile başlamalı ve 34 karakter olmalıdır.`,
    walletPromptBinance: `🟡 <b>Binance Pay ile çekim</b>\n8–10 haneli Binance Pay ID gönderin.\n💡 Örnek: <code>123456789</code>\n⚠️ Email değil, yalnızca Pay ID gönderin.`,
    walletPromptMobile: `🟢 <b>bKash / Nagad ile çekim</b>\n11 haneli kişisel numaranızı gönderin.\n💡 Örnek: <code>01712345678</code>\n⚠️ Numara 01 ile başlamalıdır.`,
    walletPromptUpi: `🇮🇳 <b>UPI ile çekim</b>\nGeçerli UPI ID'nizi gönderin.\n💡 Örnek: <code>username@paytm</code> veya <code>9876543210@ybl</code>`,
    walletInvalidUsdt: `❌ <b>Geçersiz USDT adresi!</b>\n"T" ile başlayan geçerli bir TRC-20 adresi girin.\n💡 Örnek: <code>TQ5xJv8mK2pN7rS4dF9hL3wC6yB1aZ8X0Y</code>\nTekrar deneyin veya İptal'e basın.`,
    walletInvalidBinance: `❌ <b>Geçersiz Binance Pay ID!</b>\n8–10 haneli sayısal Pay ID girin.\n💡 Örnek: <code>123456789</code>`,
    walletInvalidMobile: `❌ <b>Geçersiz telefon numarası!</b>\n11 haneli geçerli Bangladeş telefon numarası girin.\n💡 Örnek: <code>01712345678</code>`,
    walletInvalidUpi: `❌ <b>Geçersiz UPI formatı!</b>\nUPI ID içinde @ bulunmalıdır.\n💡 Örnek: <code>yourname@paytm</code>`,
    walletSavedMsg: `✅ <b>Cüzdan başarıyla kaydedildi!</b>\n💳 Kayıtlı cüzdan: <code>{address}</code>\nArtık bu adrese ödeme talebi gönderebilirsiniz.`,
    payoutHistoryMsg: `📜 <b>ÖDEME GEÇMİŞİ</b>\n<code>${SEP}</code>\n{entries}`, paymentProofsMsg: `📢 <b>ÖDEME KANITLARI</b>\n<code>${SEP}</code>\n{entries}`, noPayoutHistory: "Henüz ödeme geçmişi yok.", noPaymentProofs: "Henüz ödeme kanıtı yok.",
  },
  ur: {
    walletOverviewMsg: `💳 <b>والٹ اور رقم نکالنا</b>\n<code>${SEP}</code>\n💰 <b>والٹ کا خلاصہ</b>\n<code>${LINE}</code>\n💵 دستیاب بیلنس: <b>$ {balance} USD</b>\n✅ کل نکالی گئی رقم: <b>$ {totalWithdrawn} USD</b>\n📌 کم از کم ادائیگی: <b>$ {minPayout} USD</b>\n<code>${LINE}</code>\n📢 ادائیگی خودکار یا <b>24 گھنٹوں کے اندر</b> مکمل ہوگی۔`,
    requestWithdrawalBtn: "📤 رقم نکالنے کی درخواست", setPayoutWalletBtn: "⚙️ ادائیگی والٹ سیٹ کریں", payoutHistoryBtn: "📜 ادائیگی کی تاریخ", paymentProofsBtn: "📢 ادائیگی کے ثبوت", walletMainBtn: "🏠 مین مینو",
    walletPromptUsdt: `💎 <b>USDT (TRC-20) سے رقم نکالیں</b>\nاپنا USDT TRC-20 والٹ ایڈریس بھیجیں۔\n💡 مثال: <code>TQ5xJv8mK2pN7rS4dF9hL3wC6yB1aZ8X0Y</code>\n⚠️ ایڈریس "T" سے شروع اور 34 حروف کا ہونا چاہیے۔`,
    walletPromptBinance: `🟡 <b>Binance Pay سے رقم نکالیں</b>\n8 سے 10 ہندسوں کا Binance Pay ID بھیجیں۔\n💡 مثال: <code>123456789</code>\n⚠️ Email نہیں، صرف Pay ID بھیجیں۔`,
    walletPromptMobile: `🟢 <b>bKash / Nagad سے رقم نکالیں</b>\n11 ہندسوں کا ذاتی نمبر بھیجیں۔\n💡 مثال: <code>01712345678</code>\n⚠️ نمبر 01 سے شروع ہونا چاہیے۔`,
    walletPromptUpi: `🇮🇳 <b>UPI سے رقم نکالیں</b>\nاپنا درست UPI ID بھیجیں۔\n💡 مثال: <code>username@paytm</code> یا <code>9876543210@ybl</code>`,
    walletInvalidUsdt: `❌ <b>غلط USDT ایڈریس!</b>\n"T" سے شروع ہونے والا درست TRC-20 ایڈریس بھیجیں۔\n💡 مثال: <code>TQ5xJv8mK2pN7rS4dF9hL3wC6yB1aZ8X0Y</code>\nدوبارہ کوشش کریں یا Cancel دبائیں۔`,
    walletInvalidBinance: `❌ <b>غلط Binance Pay ID!</b>\n8 سے 10 ہندسوں کا عددی ID بھیجیں۔\n💡 مثال: <code>123456789</code>`,
    walletInvalidMobile: `❌ <b>غلط موبائل نمبر!</b>\n11 ہندسوں کا درست بنگلہ دیشی موبائل نمبر بھیجیں۔\n💡 مثال: <code>01712345678</code>`,
    walletInvalidUpi: `❌ <b>UPI ID کا فارمیٹ غلط ہے!</b>\nUPI ID میں @ ہونا ضروری ہے۔\n💡 مثال: <code>yourname@paytm</code>`,
    walletSavedMsg: `✅ <b>والٹ کامیابی سے محفوظ ہو گیا!</b>\n💳 محفوظ والٹ: <code>{address}</code>\nاب آپ اسی ایڈریس پر ادائیگی کی درخواست کر سکتے ہیں۔`,
    payoutHistoryMsg: `📜 <b>ادائیگی کی تاریخ</b>\n<code>${SEP}</code>\n{entries}`, paymentProofsMsg: `📢 <b>ادائیگی کے ثبوت</b>\n<code>${SEP}</code>\n{entries}`, noPayoutHistory: "ابھی ادائیگی کی کوئی تاریخ نہیں۔", noPaymentProofs: "ابھی ادائیگی کے ثبوت دستیاب نہیں۔",
  },
  pa: {
    walletOverviewMsg: `💳 <b>ਵਾਲਿਟ ਅਤੇ ਕਢਵਾਈ</b>\n<code>${SEP}</code>\n💰 <b>ਵਾਲਿਟ ਵੇਰਵਾ</b>\n<code>${LINE}</code>\n💵 ਉਪਲਬਧ ਬੈਲੰਸ: <b>$ {balance} USD</b>\n✅ ਕੁੱਲ ਕਢਵਾਈ: <b>$ {totalWithdrawn} USD</b>\n📌 ਘੱਟੋ-ਘੱਟ ਭੁਗਤਾਨ: <b>$ {minPayout} USD</b>\n<code>${LINE}</code>\n📢 ਭੁਗਤਾਨ ਆਪਣੇ ਆਪ ਜਾਂ <b>24 ਘੰਟਿਆਂ ਵਿੱਚ</b> ਪ੍ਰੋਸੈਸ ਹੋਵੇਗਾ।`,
    requestWithdrawalBtn: "📤 ਕਢਵਾਈ ਦੀ ਬੇਨਤੀ", setPayoutWalletBtn: "⚙️ ਪੇਆਉਟ ਵਾਲਿਟ ਸੈਟ ਕਰੋ", payoutHistoryBtn: "📜 ਪੇਆਉਟ ਇਤਿਹਾਸ", paymentProofsBtn: "📢 ਭੁਗਤਾਨ ਸਬੂਤ", walletMainBtn: "🏠 ਮੁੱਖ ਮੀਨੂ",
    walletPromptUsdt: `💎 <b>USDT (TRC-20) ਰਾਹੀਂ ਕਢਵਾਈ</b>\nਆਪਣਾ USDT TRC-20 ਵਾਲਿਟ ਐਡਰੈੱਸ ਭੇਜੋ।\n💡 ਉਦਾਹਰਨ: <code>TQ5xJv8mK2pN7rS4dF9hL3wC6yB1aZ8X0Y</code>\n⚠️ ਐਡਰੈੱਸ "T" ਨਾਲ ਸ਼ੁਰੂ ਅਤੇ 34 ਅੱਖਰਾਂ ਦਾ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ।`,
    walletPromptBinance: `🟡 <b>Binance Pay ਰਾਹੀਂ ਕਢਵਾਈ</b>\n8 ਤੋਂ 10 ਅੰਕਾਂ ਵਾਲਾ Binance Pay ID ਭੇਜੋ।\n💡 ਉਦਾਹਰਨ: <code>123456789</code>\n⚠️ Email ਨਹੀਂ, ਸਿਰਫ਼ Pay ID ਭੇਜੋ।`,
    walletPromptMobile: `🟢 <b>bKash / Nagad ਰਾਹੀਂ ਕਢਵਾਈ</b>\n11 ਅੰਕਾਂ ਵਾਲਾ ਨਿੱਜੀ ਨੰਬਰ ਭੇਜੋ।\n💡 ਉਦਾਹਰਨ: <code>01712345678</code>\n⚠️ ਨੰਬਰ 01 ਨਾਲ ਸ਼ੁਰੂ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ।`,
    walletPromptUpi: `🇮🇳 <b>UPI ਰਾਹੀਂ ਕਢਵਾਈ</b>\nਆਪਣਾ ਸਹੀ UPI ID ਭੇਜੋ।\n💡 ਉਦਾਹਰਨ: <code>username@paytm</code> ਜਾਂ <code>9876543210@ybl</code>`,
    walletInvalidUsdt: `❌ <b>ਗਲਤ USDT ਐਡਰੈੱਸ!</b>\n"T" ਨਾਲ ਸ਼ੁਰੂ ਹੋਣ ਵਾਲਾ ਸਹੀ TRC-20 ਐਡਰੈੱਸ ਭੇਜੋ।\n💡 ਉਦਾਹਰਨ: <code>TQ5xJv8mK2pN7rS4dF9hL3wC6yB1aZ8X0Y</code>\nਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ ਜਾਂ Cancel ਦਬਾਓ।`,
    walletInvalidBinance: `❌ <b>ਗਲਤ Binance Pay ID!</b>\n8 ਤੋਂ 10 ਅੰਕਾਂ ਵਾਲਾ ਸਹੀ ID ਭੇਜੋ।\n💡 ਉਦਾਹਰਨ: <code>123456789</code>`,
    walletInvalidMobile: `❌ <b>ਗਲਤ ਮੋਬਾਈਲ ਨੰਬਰ!</b>\n11 ਅੰਕਾਂ ਵਾਲਾ ਸਹੀ ਬੰਗਲਾਦੇਸ਼ੀ ਨੰਬਰ ਭੇਜੋ।\n💡 ਉਦਾਹਰਨ: <code>01712345678</code>`,
    walletInvalidUpi: `❌ <b>UPI ID ਫਾਰਮੈਟ ਗਲਤ!</b>\nUPI ID ਵਿੱਚ @ ਹੋਣਾ ਲਾਜ਼ਮੀ ਹੈ।\n💡 ਉਦਾਹਰਨ: <code>yourname@paytm</code>`,
    walletSavedMsg: `✅ <b>ਵਾਲਿਟ ਸਫਲਤਾਪੂਰਵਕ ਸੇਵ ਹੋ ਗਿਆ!</b>\n💳 ਸੇਵ ਕੀਤਾ ਵਾਲਿਟ: <code>{address}</code>\nਹੁਣ ਤੁਸੀਂ ਇਸ ਐਡਰੈੱਸ ਉੱਤੇ ਪੇਆਉਟ ਮੰਗ ਸਕਦੇ ਹੋ।`,
    payoutHistoryMsg: `📜 <b>ਪੇਆਉਟ ਇਤਿਹਾਸ</b>\n<code>${SEP}</code>\n{entries}`, paymentProofsMsg: `📢 <b>ਭੁਗਤਾਨ ਸਬੂਤ</b>\n<code>${SEP}</code>\n{entries}`, noPayoutHistory: "ਹਾਲੇ ਕੋਈ ਪੇਆਉਟ ਇਤਿਹਾਸ ਨਹੀਂ।", noPaymentProofs: "ਹਾਲੇ ਕੋਈ ਭੁਗਤਾਨ ਸਬੂਤ ਨਹੀਂ।",
  },
  id: {
    walletOverviewMsg: `💳 <b>DOMPET &amp; PENARIKAN</b>\n<code>${SEP}</code>\n💰 <b>Ringkasan Dompet</b>\n<code>${LINE}</code>\n💵 Saldo tersedia: <b>$ {balance} USD</b>\n✅ Total ditarik: <b>$ {totalWithdrawn} USD</b>\n📌 Pembayaran minimum: <b>$ {minPayout} USD</b>\n<code>${LINE}</code>\n📢 Pembayaran diproses otomatis atau dalam <b>24 jam</b>.`,
    requestWithdrawalBtn: "📤 Ajukan Penarikan", setPayoutWalletBtn: "⚙️ Atur Dompet Pembayaran", payoutHistoryBtn: "📜 Riwayat Pembayaran", paymentProofsBtn: "📢 Bukti Pembayaran", walletMainBtn: "🏠 Menu Utama",
    walletPromptUsdt: `💎 <b>Tarik melalui USDT (TRC-20)</b>\nKirim alamat dompet USDT TRC-20 Anda.\n💡 Contoh: <code>TQ5xJv8mK2pN7rS4dF9hL3wC6yB1aZ8X0Y</code>\n⚠️ Alamat harus diawali "T" dan memiliki 34 karakter.`,
    walletPromptBinance: `🟡 <b>Tarik melalui Binance Pay</b>\nKirim Binance Pay ID 8–10 digit.\n💡 Contoh: <code>123456789</code>\n⚠️ Kirim Pay ID saja, bukan email.`,
    walletPromptMobile: `🟢 <b>Tarik melalui bKash / Nagad</b>\nKirim nomor pribadi 11 digit.\n💡 Contoh: <code>01712345678</code>\n⚠️ Nomor harus diawali 01.`,
    walletPromptUpi: `🇮🇳 <b>Tarik melalui UPI</b>\nKirim UPI ID yang valid.\n💡 Contoh: <code>username@paytm</code> atau <code>9876543210@ybl</code>`,
    walletInvalidUsdt: `❌ <b>Alamat USDT Tidak Valid!</b>\nKirim alamat TRC-20 yang benar dan diawali "T".\n💡 Contoh: <code>TQ5xJv8mK2pN7rS4dF9hL3wC6yB1aZ8X0Y</code>\nCoba lagi atau tekan Batal.`,
    walletInvalidBinance: `❌ <b>Binance Pay ID Tidak Valid!</b>\nMasukkan Pay ID angka 8–10 digit.\n💡 Contoh: <code>123456789</code>`,
    walletInvalidMobile: `❌ <b>Nomor Ponsel Tidak Valid!</b>\nKirim nomor Bangladesh yang benar, 11 digit.\n💡 Contoh: <code>01712345678</code>`,
    walletInvalidUpi: `❌ <b>Format UPI ID Tidak Valid!</b>\nUPI ID harus memiliki tanda @.\n💡 Contoh: <code>yourname@paytm</code>`,
    walletSavedMsg: `✅ <b>Dompet Berhasil Disimpan!</b>\n💳 Dompet tersimpan: <code>{address}</code>\nAnda sekarang dapat meminta pembayaran ke alamat ini.`,
    payoutHistoryMsg: `📜 <b>RIWAYAT PEMBAYARAN</b>\n<code>${SEP}</code>\n{entries}`, paymentProofsMsg: `📢 <b>BUKTI PEMBAYARAN</b>\n<code>${SEP}</code>\n{entries}`, noPayoutHistory: "Belum ada riwayat pembayaran.", noPaymentProofs: "Belum ada bukti pembayaran.",
  },
  fr: {
    walletOverviewMsg: `💳 <b>PORTEFEUILLE ET RETRAIT</b>\n<code>${SEP}</code>\n💰 <b>Résumé du portefeuille</b>\n<code>${LINE}</code>\n💵 Solde disponible : <b>$ {balance} USD</b>\n✅ Total retiré : <b>$ {totalWithdrawn} USD</b>\n📌 Paiement minimum : <b>$ {minPayout} USD</b>\n<code>${LINE}</code>\n📢 Les paiements sont traités automatiquement ou sous <b>24 heures</b>.`,
    requestWithdrawalBtn: "📤 Demander un retrait", setPayoutWalletBtn: "⚙️ Définir le portefeuille", payoutHistoryBtn: "📜 Historique des paiements", paymentProofsBtn: "📢 Preuves de paiement", walletMainBtn: "🏠 Menu principal",
    walletPromptUsdt: `💎 <b>Retrait via USDT (TRC-20)</b>\nEnvoyez votre adresse de portefeuille USDT TRC-20.\n💡 Exemple : <code>TQ5xJv8mK2pN7rS4dF9hL3wC6yB1aZ8X0Y</code>\n⚠️ L’adresse doit commencer par « T » et contenir 34 caractères.`,
    walletPromptBinance: `🟡 <b>Retrait via Binance Pay</b>\nEnvoyez votre Binance Pay ID de 8 à 10 chiffres.\n💡 Exemple : <code>123456789</code>\n⚠️ Envoyez uniquement le Pay ID, pas l’email.`,
    walletPromptMobile: `🟢 <b>Retrait via bKash / Nagad</b>\nEnvoyez votre numéro personnel à 11 chiffres.\n💡 Exemple : <code>01712345678</code>\n⚠️ Le numéro doit commencer par 01.`,
    walletPromptUpi: `🇮🇳 <b>Retrait via UPI</b>\nEnvoyez un UPI ID valide.\n💡 Exemple : <code>username@paytm</code> ou <code>9876543210@ybl</code>`,
    walletInvalidUsdt: `❌ <b>Adresse USDT invalide !</b>\nEnvoyez une adresse TRC-20 valide commençant par « T ».\n💡 Exemple : <code>TQ5xJv8mK2pN7rS4dF9hL3wC6yB1aZ8X0Y</code>\nRéessayez ou appuyez sur Annuler.`,
    walletInvalidBinance: `❌ <b>Binance Pay ID invalide !</b>\nSaisissez un ID numérique de 8 à 10 chiffres.\n💡 Exemple : <code>123456789</code>`,
    walletInvalidMobile: `❌ <b>Numéro mobile invalide !</b>\nEnvoyez un numéro bangladais valide de 11 chiffres.\n💡 Exemple : <code>01712345678</code>`,
    walletInvalidUpi: `❌ <b>Format UPI invalide !</b>\nL’UPI ID doit contenir @.\n💡 Exemple : <code>yourname@paytm</code>`,
    walletSavedMsg: `✅ <b>Portefeuille enregistré !</b>\n💳 Portefeuille enregistré : <code>{address}</code>\nVous pouvez maintenant demander des paiements vers cette adresse.`,
    payoutHistoryMsg: `📜 <b>HISTORIQUE DES PAIEMENTS</b>\n<code>${SEP}</code>\n{entries}`, paymentProofsMsg: `📢 <b>PREUVES DE PAIEMENT</b>\n<code>${SEP}</code>\n{entries}`, noPayoutHistory: "Aucun historique de paiement pour le moment.", noPaymentProofs: "Aucune preuve de paiement pour le moment.",
  },
  es: {
    walletOverviewMsg: `💳 <b>BILLETERA Y RETIRO</b>\n<code>${SEP}</code>\n💰 <b>Resumen de billetera</b>\n<code>${LINE}</code>\n💵 Saldo disponible: <b>$ {balance} USD</b>\n✅ Total retirado: <b>$ {totalWithdrawn} USD</b>\n📌 Pago mínimo: <b>$ {minPayout} USD</b>\n<code>${LINE}</code>\n📢 Los pagos se procesan automáticamente o en un plazo de <b>24 horas</b>.`,
    requestWithdrawalBtn: "📤 Solicitar retiro", setPayoutWalletBtn: "⚙️ Configurar billetera", payoutHistoryBtn: "📜 Historial de pagos", paymentProofsBtn: "📢 Comprobantes de pago", walletMainBtn: "🏠 Menú principal",
    walletPromptUsdt: `💎 <b>Retirar mediante USDT (TRC-20)</b>\nEnvía tu dirección de billetera USDT TRC-20.\n💡 Ejemplo: <code>TQ5xJv8mK2pN7rS4dF9hL3wC6yB1aZ8X0Y</code>\n⚠️ La dirección debe comenzar con «T» y tener 34 caracteres.`,
    walletPromptBinance: `🟡 <b>Retirar mediante Binance Pay</b>\nEnvía tu Binance Pay ID de 8 a 10 dígitos.\n💡 Ejemplo: <code>123456789</code>\n⚠️ Envía solo el Pay ID, no el email.`,
    walletPromptMobile: `🟢 <b>Retirar mediante bKash / Nagad</b>\nEnvía tu número personal de 11 dígitos.\n💡 Ejemplo: <code>01712345678</code>\n⚠️ El número debe comenzar con 01.`,
    walletPromptUpi: `🇮🇳 <b>Retirar mediante UPI</b>\nEnvía un UPI ID válido.\n💡 Ejemplo: <code>username@paytm</code> o <code>9876543210@ybl</code>`,
    walletInvalidUsdt: `❌ <b>¡Dirección USDT no válida!</b>\nEnvía una dirección TRC-20 válida que comience con «T».\n💡 Ejemplo: <code>TQ5xJv8mK2pN7rS4dF9hL3wC6yB1aZ8X0Y</code>\nInténtalo de nuevo o pulsa Cancelar.`,
    walletInvalidBinance: `❌ <b>¡Binance Pay ID no válido!</b>\nIntroduce un ID numérico de 8 a 10 dígitos.\n💡 Ejemplo: <code>123456789</code>`,
    walletInvalidMobile: `❌ <b>¡Número móvil no válido!</b>\nEnvía un número bangladesí válido de 11 dígitos.\n💡 Ejemplo: <code>01712345678</code>`,
    walletInvalidUpi: `❌ <b>¡Formato UPI no válido!</b>\nEl UPI ID debe contener @.\n💡 Ejemplo: <code>yourname@paytm</code>`,
    walletSavedMsg: `✅ <b>¡Billetera guardada correctamente!</b>\n💳 Billetera guardada: <code>{address}</code>\nAhora puedes solicitar pagos a esta dirección.`,
    payoutHistoryMsg: `📜 <b>HISTORIAL DE PAGOS</b>\n<code>${SEP}</code>\n{entries}`, paymentProofsMsg: `📢 <b>COMPROBANTES DE PAGO</b>\n<code>${SEP}</code>\n{entries}`, noPayoutHistory: "Aún no hay historial de pagos.", noPaymentProofs: "Aún no hay comprobantes de pago.",
  },
  pt: {
    walletOverviewMsg: `💳 <b>CARTEIRA E SAQUE</b>\n<code>${SEP}</code>\n💰 <b>Resumo da carteira</b>\n<code>${LINE}</code>\n💵 Saldo disponível: <b>$ {balance} USD</b>\n✅ Total sacado: <b>$ {totalWithdrawn} USD</b>\n📌 Pagamento mínimo: <b>$ {minPayout} USD</b>\n<code>${LINE}</code>\n📢 Os pagamentos são processados automaticamente ou em até <b>24 horas</b>.`,
    requestWithdrawalBtn: "📤 Solicitar saque", setPayoutWalletBtn: "⚙️ Definir carteira de pagamento", payoutHistoryBtn: "📜 Histórico de pagamentos", paymentProofsBtn: "📢 Comprovantes de pagamento", walletMainBtn: "🏠 Menu principal",
    walletPromptUsdt: `💎 <b>Saque via USDT (TRC-20)</b>\nEnvie o endereço da sua carteira USDT TRC-20.\n💡 Exemplo: <code>TQ5xJv8mK2pN7rS4dF9hL3wC6yB1aZ8X0Y</code>\n⚠️ O endereço deve começar com “T” e ter 34 caracteres.`,
    walletPromptBinance: `🟡 <b>Saque via Binance Pay</b>\nEnvie seu Binance Pay ID de 8 a 10 dígitos.\n💡 Exemplo: <code>123456789</code>\n⚠️ Envie apenas o Pay ID, não o email.`,
    walletPromptMobile: `🟢 <b>Saque via bKash / Nagad</b>\nEnvie seu número pessoal de 11 dígitos.\n💡 Exemplo: <code>01712345678</code>\n⚠️ O número deve começar com 01.`,
    walletPromptUpi: `🇮🇳 <b>Saque via UPI</b>\nEnvie um UPI ID válido.\n💡 Exemplo: <code>username@paytm</code> ou <code>9876543210@ybl</code>`,
    walletInvalidUsdt: `❌ <b>Endereço USDT inválido!</b>\nEnvie um endereço TRC-20 válido que comece com “T”.\n💡 Exemplo: <code>TQ5xJv8mK2pN7rS4dF9hL3wC6yB1aZ8X0Y</code>\nTente novamente ou toque em Cancelar.`,
    walletInvalidBinance: `❌ <b>Binance Pay ID inválido!</b>\nDigite um ID numérico de 8 a 10 dígitos.\n💡 Exemplo: <code>123456789</code>`,
    walletInvalidMobile: `❌ <b>Número de celular inválido!</b>\nEnvie um número de Bangladesh válido com 11 dígitos.\n💡 Exemplo: <code>01712345678</code>`,
    walletInvalidUpi: `❌ <b>Formato de UPI inválido!</b>\nO UPI ID deve conter @.\n💡 Exemplo: <code>yourname@paytm</code>`,
    walletSavedMsg: `✅ <b>Carteira salva com sucesso!</b>\n💳 Carteira salva: <code>{address}</code>\nAgora você pode solicitar pagamentos para este endereço.`,
    payoutHistoryMsg: `📜 <b>HISTÓRICO DE PAGAMENTOS</b>\n<code>${SEP}</code>\n{entries}`, paymentProofsMsg: `📢 <b>COMPROVANTES DE PAGAMENTO</b>\n<code>${SEP}</code>\n{entries}`, noPayoutHistory: "Ainda não há histórico de pagamentos.", noPaymentProofs: "Ainda não há comprovantes de pagamento.",
  },
};

const genericWalletInvalid: Record<Lang, string> = {
  en: `❌ <b>Invalid payout details!</b>
Please send the correct number, wallet address, or email format shown in the example.
Please try again or go back.`,
  bn: `❌ <b>ভুল পেআউট তথ্য!</b>
উদাহরণ অনুযায়ী সঠিক নম্বর, ওয়ালেট ঠিকানা বা ইমেইল দিন।
আবার চেষ্টা করুন অথবা ফিরে যান।`,
  hi: `❌ <b>भुगतान विवरण गलत है!</b>
उदाहरण के अनुसार सही नंबर, वॉलेट एड्रेस या ईमेल भेजें।
फिर प्रयास करें या वापस जाएँ।`,
  ar: `❌ <b>بيانات الدفع غير صالحة!</b>
أرسل الرقم أو عنوان المحفظة أو البريد الإلكتروني بالتنسيق الموضح في المثال.
حاول مرة أخرى أو ارجع للخلف.`,
  ru: `❌ <b>Неверные платёжные данные!</b>
Отправьте номер, адрес кошелька или email в формате из примера.
Попробуйте ещё раз или вернитесь назад.`,
  tr: `❌ <b>Geçersiz ödeme bilgileri!</b>
Örnekte gösterilen doğru numarayı, cüzdan adresini veya email biçimini gönderin.
Tekrar deneyin veya geri dönün.`,
  ur: `❌ <b>غلط ادائیگی کی معلومات!</b>
مثال کے مطابق درست نمبر، والٹ ایڈریس یا ای میل بھیجیں۔
دوبارہ کوشش کریں یا واپس جائیں۔`,
  pa: `❌ <b>ਭੁਗਤਾਨ ਜਾਣਕਾਰੀ ਗਲਤ ਹੈ!</b>
ਉਦਾਹਰਨ ਅਨੁਸਾਰ ਸਹੀ ਨੰਬਰ, ਵਾਲਿਟ ਐਡਰੈੱਸ ਜਾਂ ਈਮੇਲ ਭੇਜੋ।
ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ ਜਾਂ ਵਾਪਸ ਜਾਓ।`,
  id: `❌ <b>Detail pembayaran tidak valid!</b>
Kirim nomor, alamat dompet, atau email dengan format seperti contoh.
Coba lagi atau kembali.`,
  fr: `❌ <b>Informations de paiement invalides !</b>
Envoyez le numéro, l’adresse du portefeuille ou l’email au format indiqué.
Réessayez ou revenez en arrière.`,
  es: `❌ <b>¡Datos de pago no válidos!</b>
Envía el número, la dirección de billetera o el email con el formato del ejemplo.
Inténtalo de nuevo o vuelve atrás.`,
  pt: `❌ <b>Dados de pagamento inválidos!</b>
Envie o número, endereço da carteira ou email no formato mostrado no exemplo.
Tente novamente ou volte.`,
};

export const t: Record<Lang, Record<string, string>> = {
  // ─────────────────────────── ENGLISH ────────────────────────────
  en: {
    earn:      "💰 Earn",
    profile:   "👤 Profile",
    dailyTask: "📋 Daily Tasks",
    referral:  "👥 Referral",
    withdraw:  "💸 Withdraw",
    language:  "🌐 Language",
    adultBot:  "🔞 Adult",
    movieBot:  "🎬 Movies",
    rules:     "📜 Rules",

    welcome: `🌐 <b>SELECT YOUR LANGUAGE / ভাষা নির্বাচন করুন</b>\n<code>${SEP}</code>\n🌍 Please select your preferred language to continue:\n<code>${LINE}</code>\n<blockquote>Tap your language below 👇</blockquote>`,

    langSet:    "${$check} <b>Language set to English!</b>",
    menuMsg:    `🚀 <b>Welcome to CineVault Global Rewards!</b>\n<code>${SEP}</code>\n👤 User: <b>{name}</b>\n🆔 ID: <code>{id}</code>\n💰 Main Balance: <b>$ {balance}</b> USD\n👥 Total Referrals: <b>{refs}</b>\n<code>${LINE}</code>\n<blockquote>⚡ Your trusted platform to watch ads, complete tasks, and earn crypto &amp; cash!</blockquote>\n🎯 Choose an option from the menu below to get started 👇`,
    selectLang: `🌐 <b>SELECT YOUR LANGUAGE / ভাষা নির্বাচন করুন</b>\n<code>${SEP}</code>\n🌍 Please select your preferred language to continue:`,

    earnMsg: `👁️ <b>Sponsored Ads Zone</b>
<code>${SEP}</code>
Watch quick sponsored ads to earn cash rewards directly to your main balance.
<code>${LINE}</code>
📊 <b>Your Daily Status:</b>
• Base Limit: <b>25 Ads / Day</b>
• Bonus Limit (Referrals): <b>+{bonus_limit} Ads</b>
• Total Limit Today: <b>{total_limit} Ads</b>
• Ads Remaining: <b>{remaining} / {total_limit}</b>
<code>${LINE}</code>
<blockquote>💡 Want to watch more ads daily? Refer friends to unlock Limit Bundles!</blockquote>`,

    earnDone: `${$check} <b>All Ads Done for Today!</b>
<code>${SEP}</code>
${$party} Great work! You watched all <b>{max}</b> ads.
${$wallet} <i>Current Balance:</i> <b>$ {balance}</b>
<code>${LINE}</code>
${$moon} Come back <b>tomorrow</b> for more earnings!`,

    watchAd: "📺 Watch Ad  (+$0.01)",
    refresh:  "🔄 Refresh Balance",

    adStarted: `${$tv} <b>Ad Ready — Watch Now!</b>
<code>${SEP}</code>
${$clock} Watch for at least <b>10 seconds</b>
${$check} Then tap <b>I Watched It</b> below
<code>${LINE}</code>
<blockquote>${$warn} Skipping = <b>Warning issued</b>
${$lock} Unique token — <b>one use only</b></blockquote>`,

    watchNow:   "▶️ Open Ad",
    adVerify:   "✅ I Watched It",
    adComplete: `${$check} <b>+$0.01 Credited Successfully!</b>
<code>${SEP}</code>
${$wallet} Balance: <b>$ {balance}</b>
${$chart} Today: <b>{watched} / {max}</b> ads watched
<code>${LINE}</code>
${$fire} <i>Keep going — every ad counts!</i>`,

    adFailed: `${$warn} <b>Verification Failed — Too Fast!</b>
<code>${SEP}</code>
You must watch the <b>full ad</b> before verifying.
<code>${LINE}</code>
<blockquote>${$warn} Warning <b>{warnCount} / {warnLimit}</b> issued.
${$ban} At <b>{warnLimit}</b> warnings → <b>permanent ban</b></blockquote>`,

    adCheatBan: `${$ban} <b>Account Permanently Banned</b>
<code>${SEP}</code>
<blockquote>You exceeded the allowed violation limit.
This action is <b>irreversible</b>.</blockquote>
<code>${LINE}</code>
${$inbox} Contact support if you believe this is an error.`,

    adAlreadyPending: `${$hourglass} <b>Ad in progress</b> — complete it before starting a new one.`,
    adsLimit: `${$check} <b>All {max} ads watched today!</b>
<code>${SEP}</code>
${$wallet} Balance: <b>$ {balance}</b>
${$moon} See you <b>tomorrow</b> for more!`,

    channelRequired: `${$lock} <b>Join Required Channels First</b>
<code>${SEP}</code>
You must join <b>all</b> channels below to start earning:

{channels}
<code>${LINE}</code>
${$check} After joining, tap <b>I Joined All</b>.`,

    joinedVerify:      "✅ I Joined All",
    channelNotJoined:  "❌ Not joined yet — please join first.",
    channelJoinReward: `${$party} Joined channel! <b>+\${reward}</b> credited.`,

    profileMsg: `${$user} <b>MY PROFILE</b>
<code>${SEP}</code>
${$idcard} <i>User ID:</i>   <code>{id}</code>
${$user} <i>Name:</i>      <b>{name}</b>
${$globe} <i>Language:</i>  {lang}
<code>${LINE}</code>
${$wallet} <i>Balance:</i>      <b>$ {balance}</b>
${$up} <i>Total Earned:</i> <b>$ {totalEarned}</b>
<code>${LINE}</code>
${$chart} <i>Today's Ads:</i>  <b>{adsToday} / {maxAds}</b>
${$people} <i>Referrals:</i>   <b>{referrals}</b>
${$warn} <i>Warnings:</i>    <b>{warnings} / {warnLimit}</b>
${$cal} <i>Joined:</i>      <b>{joined}</b> <i>({days} days)</i>
<code>${LINE}</code>
<blockquote>📜 <b>RULES</b>
▸ Max <b>{maxAds}</b> ads per day
▸ No bots, scripts, or cheating
▸ Min withdrawal: <b>$ {minWd}</b>
▸ <b>{warnLimit}</b> violations = permanent ban
▸ One account per person</blockquote>`,

    referralMsg: `${$people} <b>REFERRAL PROGRAM</b>
<code>${SEP}</code>
${$shine} Invite friends — earn <b>$ {refReward}</b> per person!
<code>${LINE}</code>
${$people} <i>Total Referrals:</i>  <b>{count}</b>
${$money} <i>Referral Earnings:</i> <b>$ {earned}</b>
<code>${LINE}</code>
${$link} <b>Your Referral Link:</b>
<code>{link}</code>
<code>${LINE}</code>
${$share} <i>Share your link — earn instantly when friends join!</i>`,

    shareLink: "📨 Share Link",

    dailyTaskMsg: `${$clip} <b>DAILY TASKS</b>
<code>${SEP}</code>
${$sparkle} Complete all tasks — unlock your bonus!
${$refresh} Resets every midnight
<code>${LINE}</code>
{tasks}
<code>${LINE}</code>
${$check} Progress: <b>{done} / {total}</b>
${$gift} Daily Bonus: <b>$ {bonus}</b>`,

    taskWatchAds:   `${$tv} Watch <b>{threshold}</b> ads today  →  <b>+$ {reward}</b>`,
    taskShare:      `${$share} Share bot with 1 friend  →  <b>+$ {reward}</b>`,
    taskChannel:    `${$mega} Join: <b>{name}</b>  →  <b>+$ {reward}</b>`,
    taskReferral:   `${$people} Bring 1 new user  →  <b>+$ {reward}</b>`,
    taskDonePrefix:    "✅ ",
    taskPendingPrefix: "⬜ ",
    claimBonus:     "🎁 Claim Daily Bonus",
    bonusClaimed: `${$gift} <b>Daily Bonus Claimed!</b>
<code>${SEP}</code>
${$money} Bonus: <b>+$ {bonus}</b>
${$wallet} New Balance: <b>$ {balance}</b>`,

    alreadyClaimed:   `${$check} Today's bonus already claimed!`,
    tasksNotComplete: `${$warn} Complete all tasks first!`,
    taskShareBtn:     "📨 Share Bot",
    taskVerifyBtn:    "✅ Verify",

    withdrawMsg: `${$cashfly} <b>WITHDRAW</b>
<code>${SEP}</code>
${$wallet} Your Balance: <b>$ {balance}</b>
${$warn} Minimum: <b>$ {minWd}</b>
<code>${LINE}</code>
${$phone} <b>Select payment method:</b>`,

    withdrawLow: `${$cross} <b>Insufficient Balance</b>
<code>${SEP}</code>
You need at least <b>$ {minWd}</b> to withdraw.
${$wallet} <i>Your Balance:</i> <b>$ {balance}</b>`,

    withdrawAddress:  `${$note} Enter your <b>{method}</b> number or wallet address:`,
    enterWalletAddress: `${$note} Enter your <b>{method}</b> wallet address:\n<code>${LINE}</code>\n${$zap} <i>Example:</i> <code>{example}</code>`,
    withdrawConfirm: `${$check} <b>Withdrawal Request Submitted!</b>
<code>${SEP}</code>
${$dollar} Amount:  <b>$ {amount}</b>
${$bank} Method:  <b>{method}</b>
${$mailbox} Address: <code>{address}</code>
<code>${LINE}</code>
${$clock} Payment processed within <b>24 hours</b>.`,

    withdrawPending: `${$hourglass} You already have a <b>pending withdrawal</b>. Please wait.`,
    withdrawSelect:  "Select payment method:",
    walletPromptUsdt: `💎 <b>Withdraw via USDT (TRC-20)</b>
Please reply with your USDT TRC-20 Wallet Address.
💡 Example Format: <code>T9yD14Nj9j7xGf8A9sD1f2G3h4J5k6L</code>
⚠️ Address must start with the letter "T" and contain 34 characters.`,
    walletPromptBinance: `🟡 <b>Withdraw via Binance Pay</b>
Please reply with your 8 to 10-digit Binance Pay ID.
💡 Example Format: <code>123456789</code>
⚠️ Do not send Email, Pay ID only.`,
    walletPromptMobile: `🟢 <b>Withdraw via bKash / Nagad</b>
Please reply with your 11-digit Personal Number.
💡 Example Format: <code>01712345678</code>
⚠️ Numbers starting with 01 only.`,
    walletPromptUpi: `🇮🇳 <b>Withdraw via UPI (GPay/Paytm/PhonePe)</b>
Please reply with your valid UPI ID.
💡 Example Format: <code>username@paytm</code> or <code>9876543210@ybl</code>`,
    walletInvalidUsdt: `❌ <b>Invalid USDT Address!</b>
The address you entered is incorrect. Please ensure it is a valid TRC-20 address starting with "T".
💡 Example: <code>T9yD14Nj9j7xGf8A9sD1f2G3h4J5k6L</code>
Please try again or cancel.`,
    walletInvalidBinance: `❌ <b>Invalid Binance Pay ID!</b>
Please enter a valid numerical Binance Pay ID (8 to 10 digits).
💡 Example: <code>123456789</code>`,
    walletInvalidMobile: `❌ <b>Invalid Mobile Number!</b>
Please send a valid 11-digit Bangladeshi mobile number.
💡 Example: <code>01712345678</code>`,
    walletInvalidUpi: `❌ <b>Invalid UPI ID Format!</b>
Your UPI ID must include @ (e.g., @paytm, @ybl, @upi).
💡 Example: <code>yourname@paytm</code>`,
    walletSavedMsg: `✅ <b>Wallet Saved Successfully!</b>
💳 Saved Wallet: <code>{address}</code>
You can now request payouts directly to this address.`,
    walletOverviewMsg: `💳 <b>WALLET &amp; WITHDRAW</b>
<code>${SEP}</code>
💰 <b>Wallet Overview</b>
<code>${LINE}</code>
💵 Available Balance: <b>$ {balance} USD</b>
✅ Total Withdrawn: <b>$ {totalWithdrawn} USD</b>
📌 Minimum Payout: <b>$ {minPayout} USD</b>
<code>${LINE}</code>
📢 Payments are processed automatically or within <b>24 hours</b>.`,
    requestWithdrawalBtn: "📤 Request Withdrawal",
    setPayoutWalletBtn: "⚙️ Set Payout Wallet",
    payoutHistoryBtn: "📜 Payout History",
    paymentProofsBtn: "📢 Payment Proofs",
    walletMainBtn: "🏠 Main",
    payoutHistoryMsg: `📜 <b>PAYOUT HISTORY</b>
<code>${SEP}</code>
{entries}`,
    paymentProofsMsg: `📢 <b>PAYMENT PROOFS</b>
<code>${SEP}</code>
{entries}`,
    noPayoutHistory: "No payout history yet.",
    noPaymentProofs: "No payment proofs available yet.",

    banned: `${$ban} <b>Account Banned</b>
<code>${SEP}</code>
<blockquote>Your account has been banned for violating the rules.</blockquote>
<code>${LINE}</code>
${$inbox} Contact support if you believe this is an error.`,

    startFirst: `${$warn} Please send /start to begin.`,
    unknownCmd: `Use the menu buttons below to navigate. 👇`,
    ageCmd: `🎂 <b>AGE CALCULATOR</b>
<code>${SEP}</code>
📅 Send your birth date in this format:
<code>/age DD/MM/YYYY</code>
<code>${LINE}</code>
Example: <code>/age 15/03/1995</code>`,
    ageResult: `🎂 <b>AGE CALCULATOR</b>
<code>${SEP}</code>
📅 Birth Date: <b>{date}</b>
<code>${LINE}</code>
🔢 Age: <b>{years} years, {months} months, {days} days</b>
🌟 Total days lived: <b>{totalDays}</b>
<code>${LINE}</code>
🎉 <i>Keep growing!</i>`,
    ageInvalid: `❌ <b>Invalid date format!</b>
Use: <code>/age DD/MM/YYYY</code>
Example: <code>/age 15/03/1995</code>`,
    changeNameBtn: "✏️ Change Name",
    enterNameMsg: `✏️ <b>CHANGE NAME</b>
<code>━━━━━━━━━━━━━━━━━━━━━━━━━</code>
📝 Type your new display name below:
<code>─────────────────────────</code>
<i>Max 64 characters. This name will appear in your profile.</i>`,
    helpMsg: `🤖 <b>BOT COMMANDS &amp; GUIDE</b>
<code>━━━━━━━━━━━━━━━━━━━━━━━━━</code>
<b>📌 Commands:</b>
/start — Start or restart the bot
/age DD/MM/YYYY — Calculate your age
/leaderboard — Top 10 earners
/stats — Bot statistics
/help — Show this help panel
<code>─────────────────────────</code>
<b>💰 How to Earn:</b>
📺 Watch Ads — +$0.01 per ad
📋 Daily Tasks — complete all for bonus
👥 Refer friends — +reward per referral
📢 Join channels — instant reward
<code>─────────────────────────</code>
<b>💸 Withdraw:</b>
✅ Minimum payout: $0.50
✅ 12 payment methods supported
✅ Fast processing
<code>─────────────────────────</code>
⚡ <i>Tap a menu button to begin earning!</i>`,
    statsMsg: `📊 <b>BOT STATISTICS</b>
<code>━━━━━━━━━━━━━━━━━━━━━━━━━</code>
👥 Total Users:        <b>{users}</b>
💰 Total Paid Out:     <b>$ {totalPaid}</b>
📺 Total Ads Watched:  <b>{totalAds}</b>
🏆 Top Earner:         <b>$ {topEarner}</b>
<code>─────────────────────────</code>
⚡ <i>Join the community and start earning!</i>`,
    leaderboardTitle: `🏆 <b>TOP EARNERS LEADERBOARD</b>
<code>━━━━━━━━━━━━━━━━━━━━━━━━━</code>
{entries}
<code>─────────────────────────</code>
💪 <i>Keep earning to climb the ranks!</i>`,
    leaderboardEntry: `{medal} <b>{rank}.</b> {name}  —  <b>$ {earned}</b>`,
    leaderboardEmpty: `🏆 <b>LEADERBOARD</b>
<code>━━━━━━━━━━━━━━━━━━━━━━━━━</code>
<i>No data yet. Be the first to earn!</i>`,
    supportMsg: `🛟 <b>SUPPORT CENTER</b>
<code>━━━━━━━━━━━━━━━━━━━━━━━━━</code>
📌 For help, contact our support team:
<code>─────────────────────────</code>
📩 Send a detailed message describing your issue.
⏱ Response time: <b>within 24 hours</b>
<code>─────────────────────────</code>
<i>Please include your User ID shown in your profile.</i>`,
    profileBtn: "👤 My Profile",
    earnBtn: "💰 Earn",
    withdrawalBtn: "💸 Withdraw",
    referralBtn: "👥 Refer",
    adultBtn2: "🔞 Adult",
    movieSeriesBtn: "🎬 Movies",
    setWalletBtn: "💳 Set Wallet",
    changeLangBtn: "🌐 Change Language",
    watchAdsBtn: "📺 Watch Ads",
    dailyTasksBtn: "📋 Daily Tasks",
    confirmBtn: "✅ Confirm",
    changeMethodBtn: "🔄 Change Method",
    cancelBtn: "❌ Cancel",
    mainMenuBtn: "🏠 Main Menu",
    backBtn: "⬅️ Back",
    confirmWalletMsg: `${$check} <b>Confirm Save Wallet</b>\n<code>${SEP}</code>\n💳 Method: <b>{method}</b>\n${$mailbox} Address: <code>{address}</code>`,
    confirmWdMsg: `${$check} <b>Confirm Withdrawal</b>\n<code>${SEP}</code>\n💳 Method: <b>{method}</b>\n${$mailbox} Address: <code>{address}</code>\n${$dollar} Amount: <b>$ {balance}</b>`,
    walletUpdated: `${$check} <b>Wallet Updated!</b>\n<code>${SEP}</code>\n💳 Method: <b>{method}</b>\n${$mailbox} Address: <code>{address}</code>`,
    updateWalletMsg: `💳 <b>Update Wallet</b>\n<code>${SEP}</code>\n${$phone} Select your payment method:`,
    nameUpdated: `${$check} <b>Name Updated!</b>\n<code>${SEP}</code>\n${$user} New name: <b>{name}</b>`,
    earnCategoryMsg: `${$money} <b>EARN CENTER</b>\n<code>${SEP}</code>\n${$rocket} Choose how to earn today:\n<code>${LINE}</code>\n${$tv} <b>Watch Ads</b>  —  +$0.01 per ad\n${$clip} <b>Daily Tasks</b>  —  bonus on completion\n${$people} <b>Referral</b>  —  earn per friend\n<code>${LINE}</code>\n${$zap} <i>All earnings are instant</i>`,
    watchAdsEarnBtn: "👁️ Watch Ads & Earn",
    walletBtn:       "💳 Wallet & Withdraw",
    dashboardBtn:    "👤 Dashboard",
    referralsBtn:    "👥 Invite Friends",
    rewardsBtn:      "🎁 Daily Rewards",
    videoZoneBtn:    "🎬 Video Zone",
    channelBtn:      "📢 Payment Channel",
    settingsBtn:      "⚙️ Settings",
    supportBtn:       "💬 Support",
    watchAdNowBtn:    "🎬 Watch Ad Now",
    upgradeLimitBtn:  "🚀 Upgrade Daily Limit (Refer)",
    backToMainBtn:    "🔙 Back to Main Menu",
  },

  // ─────────────────────────── BENGALI ────────────────────────────
  bn: {
    earn:      "💰 আয়",
    profile:   "👤 প্রোফাইল",
    dailyTask: "📋 ডেইলি টাস্ক",
    referral:  "👥 রেফারেল",
    withdraw:  "💸 উইথড্র",
    language:  "🌐 ভাষা",
    adultBot:  "🔞 Adult",
    movieBot:  "🎬 মুভিজ",
    rules:     "📜 নিয়মাবলী",

    welcome: `🌐 <b>SELECT YOUR LANGUAGE / ভাষা নির্বাচন করুন</b>\n<code>${SEP}</code>\n🌍 Please select your preferred language to continue:\n<code>${LINE}</code>\n<blockquote>Tap your language below 👇</blockquote>`,

    langSet:    `${$check} <b>ভাষা বাংলায় সেট হয়েছে!</b>`,
    menuMsg:    `🚀 <b>CineVault Global Rewards-এ স্বাগতম!</b>\n<code>${SEP}</code>\n👤 ব্যবহারকারী: <b>{name}</b>\n🆔 আইডি: <code>{id}</code>\n💰 মেইন ব্যালেন্স: <b>$ {balance}</b> USD\n👥 মোট রেফারেল: <b>{refs}</b>\n<code>${LINE}</code>\n<blockquote>⚡ বিজ্ঞাপন দেখুন, টাস্ক করুন এবং ক্রিপ্টো ও ক্যাশ আয় করুন!</blockquote>\n🎯 নিচের মেনু থেকে অপশন বেছে নিন 👇`,
    selectLang: `🌐 <b>SELECT YOUR LANGUAGE / ভাষা নির্বাচন করুন</b>\n<code>${SEP}</code>\n🌍 Please select your preferred language to continue:`,

    earnMsg: `${$money} <b>আয় কেন্দ্র</b>
<code>${SEP}</code>
${$chart} <b>অগ্রগতি:</b>  <code>{bar}</code>  <b>{watched} / {max}</b>
<code>${LINE}</code>
${$dollar} <i>আজ আয়:</i>        <b>$ {todayEarned}</b>
${$wallet} <i>আপনার ব্যালেন্স:</i> <b>$ {balance}</b>
${$zap} প্রতি বিজ্ঞাপন: <b>$0.01</b>  ·  <b>{remaining}</b>টি বাকি
<code>${LINE}</code>`,

    earnDone: `${$check} <b>আজকের সব বিজ্ঞাপন দেখা শেষ!</b>
<code>${SEP}</code>
${$party} দারুণ! আপনি সব <b>{max}</b>টি বিজ্ঞাপন দেখেছেন।
${$wallet} <i>বর্তমান ব্যালেন্স:</i> <b>$ {balance}</b>
<code>${LINE}</code>
${$moon} আরো আয়ের জন্য <b>আগামীকাল</b> আসুন!`,

    watchAd: "📺 বিজ্ঞাপন দেখুন  (+$0.01)",
    refresh:  "🔄 ব্যালেন্স রিফ্রেশ",

    adStarted: `${$tv} <b>বিজ্ঞাপন প্রস্তুত — এখনই দেখুন!</b>
<code>${SEP}</code>
${$clock} কমপক্ষে <b>১০ সেকেন্ড</b> দেখুন
${$check} তারপর নিচে <b>আমি দেখেছি</b> চাপুন
<code>${LINE}</code>
<blockquote>${$warn} আগে চাপলে = <b>সতর্কতা জারি</b>
${$lock} প্রতিটির আলাদা টোকেন — <b>একবার ব্যবহারযোগ্য</b></blockquote>`,

    watchNow:   "▶️ বিজ্ঞাপন খুলুন",
    adVerify:   "✅ আমি দেখেছি",
    adComplete: `${$check} <b>+$0.01 সফলভাবে ক্রেডিট হয়েছে!</b>
<code>${SEP}</code>
${$wallet} ব্যালেন্স: <b>$ {balance}</b>
${$chart} আজ: <b>{watched} / {max}</b> বিজ্ঞাপন দেখা হয়েছে
<code>${LINE}</code>
${$fire} <i>চালিয়ে যান — প্রতিটি বিজ্ঞাপনই গুরুত্বপূর্ণ!</i>`,

    adFailed: `${$warn} <b>যাচাই ব্যর্থ — অনেক তাড়াতাড়ি!</b>
<code>${SEP}</code>
সম্পূর্ণ বিজ্ঞাপন না দেখে যাচাই করা যাবে না।
<code>${LINE}</code>
<blockquote>${$warn} সতর্কতা <b>{warnCount} / {warnLimit}</b> জারি হয়েছে।
${$ban} <b>{warnLimit}</b>টি সতর্কতায় → <b>স্থায়ীভাবে ব্যান</b></blockquote>`,

    adCheatBan: `${$ban} <b>অ্যাকাউন্ট স্থায়ীভাবে ব্যান</b>
<code>${SEP}</code>
<blockquote>অনুমোদিত লঙ্ঘনের সীমা অতিক্রম করেছেন।
এই সিদ্ধান্ত <b>অপরিবর্তনযোগ্য</b>।</blockquote>
<code>${LINE}</code>
${$inbox} ভুল মনে হলে সাপোর্টে যোগাযোগ করুন।`,

    adAlreadyPending: `${$hourglass} <b>বিজ্ঞাপন চলছে</b> — নতুনটি শুরুর আগে সেটি শেষ করুন।`,
    adsLimit: `${$check} <b>আজকের সব {max}টি বিজ্ঞাপন দেখা হয়েছে!</b>
<code>${SEP}</code>
${$wallet} ব্যালেন্স: <b>$ {balance}</b>
${$moon} আগামীকাল আবার আসুন!`,

    channelRequired: `${$lock} <b>প্রয়োজনীয় চ্যানেলে আগে যোগ দিন</b>
<code>${SEP}</code>
আয় শুরু করতে <b>সব</b> চ্যানেলে যোগ দিন:

{channels}
<code>${LINE}</code>
${$check} যোগ দেওয়ার পর <b>আমি যোগ দিয়েছি</b> চাপুন।`,

    joinedVerify:      "✅ আমি সবখানে যোগ দিয়েছি",
    channelNotJoined:  "❌ এখনো যোগ দেননি — আগে যোগ দিন।",
    channelJoinReward: `${$party} চ্যানেলে যোগ দেওয়া হয়েছে! <b>+\${reward}</b> ক্রেডিট।`,

    profileMsg: `${$user} <b>আমার প্রোফাইল</b>
<code>${SEP}</code>
${$idcard} <i>ইউজার আইডি:</i>  <code>{id}</code>
${$user} <i>নাম:</i>           <b>{name}</b>
${$globe} <i>ভাষা:</i>          {lang}
<code>${LINE}</code>
${$wallet} <i>ব্যালেন্স:</i>       <b>$ {balance}</b>
${$up} <i>মোট আয়:</i>         <b>$ {totalEarned}</b>
<code>${LINE}</code>
${$chart} <i>আজকের বিজ্ঞাপন:</i>  <b>{adsToday} / {maxAds}</b>
${$people} <i>রেফারেল:</i>         <b>{referrals}</b>
${$warn} <i>সতর্কতা:</i>          <b>{warnings} / {warnLimit}</b>
${$cal} <i>যোগদান:</i>           <b>{joined}</b> <i>({days} দিন)</i>
<code>${LINE}</code>
<blockquote>📜 <b>নিয়মাবলী</b>
▸ দিনে সর্বোচ্চ <b>{maxAds}</b>টি বিজ্ঞাপন
▸ বট, স্ক্রিপ্ট বা চিটিং নিষিদ্ধ
▸ উইথড্রের জন্য সর্বনিম্ন <b>$ {minWd}</b>
▸ <b>{warnLimit}</b>টি লঙ্ঘনে স্থায়ী ব্যান
▸ একজন ব্যক্তি — একটি অ্যাকাউন্ট</blockquote>`,

    referralMsg: `${$people} <b>রেফারেল প্রোগ্রাম</b>
<code>${SEP}</code>
${$shine} বন্ধু আনুন — প্রতিজনে <b>$ {refReward}</b> আয়!
<code>${LINE}</code>
${$people} <i>মোট রেফারেল:</i>   <b>{count}</b>
${$money} <i>রেফারেল আয়:</i>    <b>$ {earned}</b>
<code>${LINE}</code>
${$link} <b>আপনার রেফারেল লিংক:</b>
<code>{link}</code>
<code>${LINE}</code>
${$share} <i>লিংক শেয়ার করুন — বন্ধু যোগ দিলেই তাৎক্ষণিক আয়!</i>`,

    shareLink: "📨 লিংক শেয়ার করুন",

    dailyTaskMsg: `${$clip} <b>ডেইলি টাস্ক</b>
<code>${SEP}</code>
${$sparkle} সব টাস্ক করুন — বোনাস আনলক করুন!
${$refresh} প্রতিদিন মধ্যরাতে রিসেট
<code>${LINE}</code>
{tasks}
<code>${LINE}</code>
${$check} অগ্রগতি: <b>{done} / {total}</b>
${$gift} ডেইলি বোনাস: <b>$ {bonus}</b>`,

    taskWatchAds:   `${$tv} আজ <b>{threshold}</b>টি বিজ্ঞাপন দেখুন  →  <b>+$ {reward}</b>`,
    taskShare:      `${$share} বট ১ বন্ধুকে শেয়ার করুন  →  <b>+$ {reward}</b>`,
    taskChannel:    `${$mega} যোগ দিন: <b>{name}</b>  →  <b>+$ {reward}</b>`,
    taskReferral:   `${$people} ১ নতুন ইউজার আনুন  →  <b>+$ {reward}</b>`,
    taskDonePrefix:    "✅ ",
    taskPendingPrefix: "⬜ ",
    claimBonus:     "🎁 ডেইলি বোনাস নিন",
    bonusClaimed: `${$gift} <b>ডেইলি বোনাস পেয়েছেন!</b>
<code>${SEP}</code>
${$money} বোনাস: <b>+$ {bonus}</b>
${$wallet} নতুন ব্যালেন্স: <b>$ {balance}</b>`,

    alreadyClaimed:   `${$check} আজকের বোনাস ইতিমধ্যে নেওয়া হয়েছে!`,
    tasksNotComplete: `${$warn} আগে সব টাস্ক সম্পন্ন করুন!`,
    taskShareBtn:     "📨 বট শেয়ার করুন",
    taskVerifyBtn:    "✅ যাচাই করুন",

    withdrawMsg: `${$cashfly} <b>উইথড্র</b>
<code>${SEP}</code>
${$wallet} আপনার ব্যালেন্স: <b>$ {balance}</b>
${$warn} সর্বনিম্ন: <b>$ {minWd}</b>
<code>${LINE}</code>
${$phone} <b>পেমেন্ট পদ্ধতি বেছে নিন:</b>`,

    withdrawLow: `${$cross} <b>ব্যালেন্স যথেষ্ট নেই</b>
<code>${SEP}</code>
উইথড্রের জন্য কমপক্ষে <b>$ {minWd}</b> প্রয়োজন।
${$wallet} <i>আপনার ব্যালেন্স:</i> <b>$ {balance}</b>`,

    withdrawAddress:  `${$note} আপনার <b>{method}</b> নম্বর বা ওয়ালেট ঠিকানা দিন:`,
    enterWalletAddress: `${$note} আপনার <b>{method}</b> ওয়ালেট ঠিকানা দিন:\n<code>${LINE}</code>\n${$zap} <i>উদাহরণ:</i> <code>{example}</code>`,
    withdrawConfirm: `${$check} <b>উইথড্র রিকোয়েস্ট জমা হয়েছে!</b>
<code>${SEP}</code>
${$dollar} পরিমাণ:   <b>$ {amount}</b>
${$bank} পদ্ধতি:    <b>{method}</b>
${$mailbox} ঠিকানা:  <code>{address}</code>
<code>${LINE}</code>
${$clock} <b>২৪ ঘন্টার</b> মধ্যে পেমেন্ট প্রক্রিয়া হবে।`,

    withdrawPending: `${$hourglass} ইতিমধ্যে একটি <b>পেন্ডিং উইথড্র</b> আছে। অপেক্ষা করুন।`,
    withdrawSelect:  "পেমেন্ট পদ্ধতি বেছে নিন:",
    walletPromptUsdt: `💎 <b>USDT (TRC-20) দিয়ে উইথড্র</b>
আপনার USDT TRC-20 Wallet Address পাঠান।
💡 উদাহরণ: <code>T9yD14Nj9j7xGf8A9sD1f2G3h4J5k6L</code>
⚠️ Address অবশ্যই "T" দিয়ে শুরু হবে এবং ৩৪ অক্ষরের হতে হবে।`,
    walletPromptBinance: `🟡 <b>Binance Pay দিয়ে উইথড্র</b>
আপনার ৮ থেকে ১০ সংখ্যার Binance Pay ID পাঠান।
💡 উদাহরণ: <code>123456789</code>
⚠️ Email নয়, শুধু Pay ID পাঠান।`,
    walletPromptMobile: `🟢 <b>bKash / Nagad দিয়ে উইথড্র</b>
আপনার ১১ সংখ্যার Personal Number পাঠান।
💡 উদাহরণ: <code>01712345678</code>
⚠️ নম্বরটি 01 দিয়ে শুরু হতে হবে।`,
    walletPromptUpi: `🇮🇳 <b>UPI (GPay/Paytm/PhonePe) দিয়ে উইথড্র</b>
আপনার সঠিক UPI ID পাঠান।
💡 উদাহরণ: <code>username@paytm</code> অথবা <code>9876543210@ybl</code>`,
    walletInvalidUsdt: `❌ <b>ভুল USDT Address!</b>
সঠিক TRC-20 address দিন, যা "T" দিয়ে শুরু হবে।
💡 উদাহরণ: <code>T9yD14Nj9j7xGf8A9sD1f2G3h4J5k6L</code>
আবার চেষ্টা করুন অথবা Cancel চাপুন।`,
    walletInvalidBinance: `❌ <b>ভুল Binance Pay ID!</b>
৮ থেকে ১০ সংখ্যার সঠিক Binance Pay ID দিন।
💡 উদাহরণ: <code>123456789</code>`,
    walletInvalidMobile: `❌ <b>ভুল মোবাইল নম্বর!</b>
সঠিক ১১ সংখ্যার বাংলাদেশি মোবাইল নম্বর দিন।
💡 উদাহরণ: <code>01712345678</code>`,
    walletInvalidUpi: `❌ <b>ভুল UPI ID Format!</b>
আপনার UPI ID-তে @ থাকতে হবে, যেমন @paytm, @ybl বা @upi।
💡 উদাহরণ: <code>yourname@paytm</code>`,
    walletSavedMsg: `✅ <b>ওয়ালেট সফলভাবে সেভ হয়েছে!</b>
💳 Saved Wallet: <code>{address}</code>
এখন এই address-এ সরাসরি payout request করতে পারবেন।`,
    walletOverviewMsg: `💳 <b>ওয়ালেট ও উইথড্র</b>
<code>${SEP}</code>
💰 <b>ওয়ালেট ওভারভিউ</b>
<code>${LINE}</code>
💵 Available Balance: <b>$ {balance} USD</b>
✅ Total Withdrawn: <b>$ {totalWithdrawn} USD</b>
📌 Minimum Payout: <b>$ {minPayout} USD</b>
<code>${LINE}</code>
📢 Payments are processed automatically or within <b>24 hours</b>.`,
    requestWithdrawalBtn: "📤 Request Withdrawal",
    setPayoutWalletBtn: "⚙️ Set Payout Wallet",
    payoutHistoryBtn: "📜 Payout History",
    paymentProofsBtn: "📢 Payment Proofs",
    walletMainBtn: "🏠 Main",
    payoutHistoryMsg: `📜 <b>পেআউট হিস্টোরি</b>
<code>${SEP}</code>
{entries}`,
    paymentProofsMsg: `📢 <b>পেমেন্ট প্রুফ</b>
<code>${SEP}</code>
{entries}`,
    noPayoutHistory: "এখনো কোনো পেআউট হিস্টোরি নেই।",
    noPaymentProofs: "এখনো কোনো পেমেন্ট প্রুফ নেই।",

    banned: `${$ban} <b>অ্যাকাউন্ট ব্যান</b>
<code>${SEP}</code>
<blockquote>নিয়ম লঙ্ঘনের কারণে অ্যাকাউন্ট ব্যান করা হয়েছে।</blockquote>
<code>${LINE}</code>
${$inbox} ভুল মনে হলে সাপোর্টে যোগাযোগ করুন।`,

    startFirst: `${$warn} শুরু করতে /start পাঠান।`,
    unknownCmd: `নেভিগেট করতে মেনু বাটন ব্যবহার করুন। 👇`,
    ageCmd: `🎂 <b>বয়স ক্যালকুলেটর</b>
<code>${SEP}</code>
📅 এই ফরম্যাটে জন্ম তারিখ পাঠান:
<code>/age DD/MM/YYYY</code>
<code>${LINE}</code>
উদাহরণ: <code>/age 15/03/1995</code>`,
    ageResult: `🎂 <b>বয়স ক্যালকুলেটর</b>
<code>${SEP}</code>
📅 জন্ম তারিখ: <b>{date}</b>
<code>${LINE}</code>
🔢 বয়স: <b>{years} বছর, {months} মাস, {days} দিন</b>
🌟 মোট বেঁচে থাকা দিন: <b>{totalDays}</b>
<code>${LINE}</code>
🎉 <i>বড় হতে থাকুন!</i>`,
    ageInvalid: `❌ <b>ভুল তারিখ ফরম্যাট!</b>
ব্যবহার করুন: <code>/age DD/MM/YYYY</code>
উদাহরণ: <code>/age 15/03/1995</code>`,
    changeNameBtn: "✏️ নাম পরিবর্তন",
    enterNameMsg: `✏️ <b>নাম পরিবর্তন করুন</b>
<code>━━━━━━━━━━━━━━━━━━━━━━━━━</code>
📝 নিচে আপনার নতুন নাম টাইপ করুন:
<code>─────────────────────────</code>
<i>সর্বোচ্চ ৬৪ অক্ষর। এই নামটি প্রোফাইলে দেখাবে।</i>`,
    helpMsg: `🤖 <b>বট কমান্ড ও গাইড</b>
<code>━━━━━━━━━━━━━━━━━━━━━━━━━</code>
<b>📌 কমান্ড:</b>
/start — বট শুরু বা রিস্টার্ট করুন
/age DD/MM/YYYY — বয়স হিসাব করুন
/leaderboard — শীর্ষ ১০ আয়কারী
/stats — বটের পরিসংখ্যান
/help — এই সাহায্য প্যানেল
<code>─────────────────────────</code>
<b>💰 আয় করার উপায়:</b>
📺 বিজ্ঞাপন দেখুন — প্রতিটিতে +$০.০১
📋 দৈনিক কাজ — সব সম্পন্ন করে বোনাস
👥 বন্ধু রেফার করুন — পুরস্কার পান
📢 চ্যানেলে যোগ দিন — তাৎক্ষণিক পুরস্কার
<code>─────────────────────────</code>
<b>💸 উত্তোলন:</b>
✅ সর্বনিম্ন পেআউট: $০.৫০
✅ ১২টি পেমেন্ট পদ্ধতি
<code>─────────────────────────</code>
⚡ <i>মেনু বাটন চেপে আয় শুরু করুন!</i>`,
    statsMsg: `📊 <b>বটের পরিসংখ্যান</b>
<code>━━━━━━━━━━━━━━━━━━━━━━━━━</code>
👥 মোট ব্যবহারকারী:   <b>{users}</b>
💰 মোট পরিশোধ:       <b>$ {totalPaid}</b>
📺 মোট বিজ্ঞাপন:     <b>{totalAds}</b>
🏆 শীর্ষ আয়:         <b>$ {topEarner}</b>
<code>─────────────────────────</code>
⚡ <i>যোগ দিন এবং আয় শুরু করুন!</i>`,
    leaderboardTitle: `🏆 <b>শীর্ষ আয়কারীদের তালিকা</b>
<code>━━━━━━━━━━━━━━━━━━━━━━━━━</code>
{entries}
<code>─────────────────────────</code>
💪 <i>আরো আয় করে র‍্যাংক বাড়ান!</i>`,
    leaderboardEntry: `{medal} <b>{rank}.</b> {name}  —  <b>$ {earned}</b>`,
    leaderboardEmpty: `🏆 <b>লিডারবোর্ড</b>
<code>━━━━━━━━━━━━━━━━━━━━━━━━━</code>
<i>এখনো কোনো তথ্য নেই। প্রথম আয়কারী হন!</i>`,
    supportMsg: `🛟 <b>সাপোর্ট সেন্টার</b>
<code>━━━━━━━━━━━━━━━━━━━━━━━━━</code>
📌 সাহায্যের জন্য আমাদের সাথে যোগাযোগ করুন:
<code>─────────────────────────</code>
📩 আপনার সমস্যা বিস্তারিত লিখুন।
⏱ সাড়া সময়: <b>২৪ ঘণ্টার মধ্যে</b>
<code>─────────────────────────</code>
<i>প্রোফাইলে দেখানো User ID উল্লেখ করুন।</i>`,
    profileBtn: "👤 আমার প্রোফাইল",
    earnBtn: "💰 আয়",
    withdrawalBtn: "💸 উইথড্র",
    referralBtn: "👥 রেফার",
    adultBtn2: "🔞 এডাল্ট",
    movieSeriesBtn: "🎬 মুভি-সিরিজ",
    setWalletBtn: "💳 ওয়ালেট সেট",
    changeLangBtn: "🌐 ভাষা পরিবর্তন",
    watchAdsBtn: "📺 বিজ্ঞাপন দেখুন",
    dailyTasksBtn: "📋 ডেইলি টাস্ক",
    confirmBtn: "✅ নিশ্চিত করুন",
    changeMethodBtn: "🔄 পদ্ধতি পরিবর্তন",
    cancelBtn: "❌ বাতিল",
    mainMenuBtn: "🏠 মেইন মেনু",
    backBtn: "⬅️ পিছনে",
    confirmWalletMsg: `${$check} <b>ওয়ালেট সেভ নিশ্চিত করুন</b>\n<code>${SEP}</code>\n💳 পদ্ধতি: <b>{method}</b>\n${$mailbox} ঠিকানা: <code>{address}</code>`,
    confirmWdMsg: `${$check} <b>উইথড্র নিশ্চিত করুন</b>\n<code>${SEP}</code>\n💳 পদ্ধতি: <b>{method}</b>\n${$mailbox} ঠিকানা: <code>{address}</code>\n${$dollar} পরিমাণ: <b>$ {balance}</b>`,
    walletUpdated: `${$check} <b>ওয়ালেট আপডেট হয়েছে!</b>\n<code>${SEP}</code>\n💳 পদ্ধতি: <b>{method}</b>\n${$mailbox} ঠিকানা: <code>{address}</code>`,
    updateWalletMsg: `💳 <b>ওয়ালেট আপডেট করুন</b>\n<code>${SEP}</code>\n${$phone} পেমেন্ট পদ্ধতি বেছে নিন:`,
    nameUpdated: `${$check} <b>নাম আপডেট হয়েছে!</b>\n<code>${SEP}</code>\n${$user} নতুন নাম: <b>{name}</b>`,
    earnCategoryMsg: `${$money} <b>আয় কেন্দ্র</b>\n<code>${SEP}</code>\n${$rocket} কীভাবে আয় করতে চান বেছে নিন:\n<code>${LINE}</code>\n${$tv} <b>বিজ্ঞাপন দেখুন</b>  —  প্রতি বিজ্ঞাপনে +$0.01\n${$clip} <b>ডেইলি টাস্ক</b>  —  সম্পূর্ণ করলে বোনাস\n${$people} <b>রেফারেল</b>  —  প্রতি বন্ধুতে আয়\n<code>${LINE}</code>\n${$zap} <i>সব আয় তাৎক্ষণিক</i>`,
  },

  // ─────────────────────────── HINDI ──────────────────────────────
  hi: {
    earn:      "💰 कमाई",
    profile:   "👤 प्रोफ़ाइल",
    dailyTask: "📋 दैनिक कार्य",
    referral:  "👥 रेफ़रल",
    withdraw:  "💸 निकालें",
    language:  "🌐 भाषा",
    adultBot:  "🔞 Adult",
    movieBot:  "🎬 Movies",
    rules:     "📜 नियम",

    welcome: `🌐 <b>SELECT YOUR LANGUAGE / ভাষা নির্বাচন করুন</b>\n<code>${SEP}</code>\n🌍 Please select your preferred language to continue:\n<code>${LINE}</code>\n<blockquote>Tap your language below 👇</blockquote>`,

    langSet:    `${$check} <b>भाषा हिंदी में सेट हो गई!</b>`,
    menuMsg:    `🚀 <b>CineVault Global Rewards</b>\n<code>${SEP}</code>\n👤 उपयोगकर्ता: <b>{name}</b>\n🆔 खाता आईडी: <code>{id}</code>\n💵 मुख्य बैलेंस: <b>$ {balance}</b> USD\n👥 कुल रेफरल: <b>{refs}</b>\n<code>${LINE}</code>\n<blockquote>⚡ रोज़ विज्ञापन देखें, बोनस पाएं या वीडियो ज़ोन पर जाएं!</blockquote>\n🎯 नीचे बटन दबाएँ 👇`,
    selectLang: `🌐 <b>SELECT YOUR LANGUAGE / ভাষা নির্বাচন করুন</b>\n<code>${SEP}</code>\n🌍 Please select your preferred language to continue:`,

    earnMsg: `${$money} <b>कमाई केंद्र</b>
<code>${SEP}</code>
${$chart} <b>प्रगति:</b>  <code>{bar}</code>  <b>{watched} / {max}</b>
<code>${LINE}</code>
${$dollar} <i>आज की कमाई:</i>   <b>$ {todayEarned}</b>
${$wallet} <i>आपका बैलेंस:</i>  <b>$ {balance}</b>
${$zap} प्रति विज्ञापन: <b>$0.01</b>  ·  <b>{remaining}</b> बाकी
<code>${LINE}</code>`,

    earnDone: `${$check} <b>आज के सभी विज्ञापन देख लिए!</b>
<code>${SEP}</code>
${$party} बढ़िया! आपने सभी <b>{max}</b> विज्ञापन देखे।
${$wallet} <i>वर्तमान बैलेंस:</i> <b>$ {balance}</b>
<code>${LINE}</code>
${$moon} अधिक कमाई के लिए <b>कल</b> आएँ!`,

    watchAd: "📺 विज्ञापन देखें  (+$0.01)",
    refresh:  "🔄 बैलेंस रिफ्रेश",

    adStarted: `${$tv} <b>विज्ञापन तैयार है — अभी देखें!</b>
<code>${SEP}</code>
${$clock} कम से कम <b>10 सेकंड</b> देखें
${$check} फिर नीचे <b>मैंने देखा</b> दबाएँ
<code>${LINE}</code>
<blockquote>${$warn} जल्दी दबाने पर = <b>चेतावनी जारी</b>
${$lock} हर विज्ञापन का अलग टोकन — <b>एक बार उपयोग</b></blockquote>`,

    watchNow:   "▶️ विज्ञापन खोलें",
    adVerify:   "✅ मैंने देखा",
    adComplete: `${$check} <b>+$0.01 सफलतापूर्वक जमा!</b>
<code>${SEP}</code>
${$wallet} बैलेंस: <b>$ {balance}</b>
${$chart} आज: <b>{watched} / {max}</b> विज्ञापन देखे
<code>${LINE}</code>
${$fire} <i>जारी रखें — हर विज्ञापन मायने रखता है!</i>`,

    adFailed: `${$warn} <b>सत्यापन विफल — बहुत जल्दी!</b>
<code>${SEP}</code>
सत्यापन से पहले पूरा विज्ञापन देखना जरूरी है।
<code>${LINE}</code>
<blockquote>${$warn} चेतावनी <b>{warnCount} / {warnLimit}</b> जारी।
${$ban} <b>{warnLimit}</b> चेतावनियों पर → <b>स्थायी बैन</b></blockquote>`,

    adCheatBan: `${$ban} <b>खाता स्थायी रूप से बैन</b>
<code>${SEP}</code>
<blockquote>आपने अनुमत उल्लंघन सीमा पार कर ली।
यह निर्णय <b>अपरिवर्तनीय</b> है।</blockquote>
<code>${LINE}</code>
${$inbox} गलती लगे तो सहायता से संपर्क करें।`,

    adAlreadyPending: `${$hourglass} <b>विज्ञापन चल रहा है</b> — नया शुरू करने से पहले इसे पूरा करें।`,
    adsLimit: `${$check} <b>आज के सभी {max} विज्ञापन देख लिए!</b>
<code>${SEP}</code>
${$wallet} बैलेंस: <b>$ {balance}</b>
${$moon} कल फिर आएँ!`,

    channelRequired: `${$lock} <b>पहले आवश्यक चैनल जॉइन करें</b>
<code>${SEP}</code>
कमाई शुरू करने के लिए <b>सभी</b> चैनल जॉइन करें:

{channels}
<code>${LINE}</code>
${$check} जॉइन करने के बाद <b>मैंने जॉइन किया</b> दबाएँ।`,

    joinedVerify:      "✅ मैंने सब जॉइन किया",
    channelNotJoined:  "❌ अभी जॉइन नहीं किया — पहले जॉइन करें।",
    channelJoinReward: `${$party} चैनल जॉइन किया! <b>+\${reward}</b> जमा।`,

    profileMsg: `${$user} <b>मेरी प्रोफ़ाइल</b>
<code>${SEP}</code>
${$idcard} <i>यूज़र ID:</i>     <code>{id}</code>
${$user} <i>नाम:</i>          <b>{name}</b>
${$globe} <i>भाषा:</i>         {lang}
<code>${LINE}</code>
${$wallet} <i>बैलेंस:</i>         <b>$ {balance}</b>
${$up} <i>कुल कमाई:</i>       <b>$ {totalEarned}</b>
<code>${LINE}</code>
${$chart} <i>आज के विज्ञापन:</i> <b>{adsToday} / {maxAds}</b>
${$people} <i>रेफ़रल:</i>         <b>{referrals}</b>
${$warn} <i>चेतावनियाँ:</i>      <b>{warnings} / {warnLimit}</b>
${$cal} <i>शामिल हुए:</i>      <b>{joined}</b> <i>({days} दिन)</i>
<code>${LINE}</code>
<blockquote>📜 <b>नियम</b>
▸ प्रतिदिन अधिकतम <b>{maxAds}</b> विज्ञापन
▸ बॉट, स्क्रिप्ट या धोखाधड़ी वर्जित
▸ न्यूनतम निकासी: <b>$ {minWd}</b>
▸ <b>{warnLimit}</b> उल्लंघन = स्थायी बैन
▸ एक व्यक्ति — एक खाता</blockquote>`,

    referralMsg: `${$people} <b>रेफ़रल प्रोग्राम</b>
<code>${SEP}</code>
${$shine} दोस्त लाएँ — प्रति व्यक्ति <b>$ {refReward}</b> कमाएँ!
<code>${LINE}</code>
${$people} <i>कुल रेफ़रल:</i>   <b>{count}</b>
${$money} <i>रेफ़रल कमाई:</i>  <b>$ {earned}</b>
<code>${LINE}</code>
${$link} <b>आपका रेफ़रल लिंक:</b>
<code>{link}</code>
<code>${LINE}</code>
${$share} <i>लिंक शेयर करें — दोस्त जुड़े तो तुरंत कमाई!</i>`,

    shareLink: "📨 लिंक शेयर करें",

    dailyTaskMsg: `${$clip} <b>दैनिक कार्य</b>
<code>${SEP}</code>
${$sparkle} सभी कार्य पूरे करें — बोनस अनलॉक करें!
${$refresh} रोज़ रात 12 बजे रीसेट
<code>${LINE}</code>
{tasks}
<code>${LINE}</code>
${$check} प्रगति: <b>{done} / {total}</b>
${$gift} दैनिक बोनस: <b>$ {bonus}</b>`,

    taskWatchAds:   `${$tv} आज <b>{threshold}</b> विज्ञापन देखें  →  <b>+$ {reward}</b>`,
    taskShare:      `${$share} बॉट 1 दोस्त से शेयर करें  →  <b>+$ {reward}</b>`,
    taskChannel:    `${$mega} जॉइन करें: <b>{name}</b>  →  <b>+$ {reward}</b>`,
    taskReferral:   `${$people} 1 नया यूज़र लाएँ  →  <b>+$ {reward}</b>`,
    taskDonePrefix:    "✅ ",
    taskPendingPrefix: "⬜ ",
    claimBonus:     "🎁 दैनिक बोनस लें",
    bonusClaimed: `${$gift} <b>दैनिक बोनस मिल गया!</b>
<code>${SEP}</code>
${$money} बोनस: <b>+$ {bonus}</b>
${$wallet} नया बैलेंस: <b>$ {balance}</b>`,

    alreadyClaimed:   `${$check} आज का बोनस पहले ही लिया जा चुका है!`,
    tasksNotComplete: `${$warn} पहले सभी कार्य पूरे करें!`,
    taskShareBtn:     "📨 बॉट शेयर करें",
    taskVerifyBtn:    "✅ सत्यापित करें",

    withdrawMsg: `${$cashfly} <b>निकासी</b>
<code>${SEP}</code>
${$wallet} आपका बैलेंस: <b>$ {balance}</b>
${$warn} न्यूनतम: <b>$ {minWd}</b>
<code>${LINE}</code>
${$phone} <b>भुगतान विधि चुनें:</b>`,

    withdrawLow: `${$cross} <b>अपर्याप्त बैलेंस</b>
<code>${SEP}</code>
निकासी के लिए कम से कम <b>$ {minWd}</b> चाहिए।
${$wallet} <i>आपका बैलेंस:</i> <b>$ {balance}</b>`,

    withdrawAddress:  `${$note} अपना <b>{method}</b> नंबर या वॉलेट पता दर्ज करें:`,
    enterWalletAddress: `${$note} अपना <b>{method}</b> वॉलेट पता दर्ज करें:\n<code>${LINE}</code>\n${$zap} <i>उदाहरण:</i> <code>{example}</code>`,
    withdrawConfirm: `${$check} <b>निकासी अनुरोध सबमिट!</b>
<code>${SEP}</code>
${$dollar} राशि:     <b>$ {amount}</b>
${$bank} विधि:     <b>{method}</b>
${$mailbox} पता:     <code>{address}</code>
<code>${LINE}</code>
${$clock} <b>24 घंटे</b> में भुगतान प्रक्रिया होगी।`,

    withdrawPending: `${$hourglass} पहले से एक <b>लंबित निकासी</b> है। प्रतीक्षा करें।`,
    withdrawSelect:  "भुगतान विधि चुनें:",

    banned: `${$ban} <b>खाता बैन</b>
<code>${SEP}</code>
<blockquote>नियमों के उल्लंघन के कारण आपका खाता बैन किया गया।</blockquote>
<code>${LINE}</code>
${$inbox} गलती लगे तो सहायता से संपर्क करें।`,

    startFirst: `${$warn} शुरू करने के लिए /start भेजें।`,
    unknownCmd: `नेविगेट करने के लिए मेनू बटन का उपयोग करें। 👇`,
    ageCmd: `🎂 <b>आयु कैलकुलेटर</b>
<code>${SEP}</code>
📅 इस फॉर्मेट में जन्म तारीख भेजें:
<code>/age DD/MM/YYYY</code>
<code>${LINE}</code>
उदाहरण: <code>/age 15/03/1995</code>`,
    ageResult: `🎂 <b>आयु कैलकुलेटर</b>
<code>${SEP}</code>
📅 जन्म तारीख: <b>{date}</b>
<code>${LINE}</code>
🔢 आयु: <b>{years} वर्ष, {months} महीने, {days} दिन</b>
🌟 कुल जीवित दिन: <b>{totalDays}</b>
<code>${LINE}</code>
🎉 <i>बढ़ते रहें!</i>`,
    ageInvalid: `❌ <b>गलत तारीख फॉर्मेट!</b>
उपयोग करें: <code>/age DD/MM/YYYY</code>
उदाहरण: <code>/age 15/03/1995</code>`,
    changeNameBtn: "✏️ नाम बदलें",
    enterNameMsg: `✏️ <b>नाम बदलें</b>
<code>━━━━━━━━━━━━━━━━━━━━━━━━━</code>
📝 नीचे अपना नया नाम टाइप करें:
<code>─────────────────────────</code>
<i>अधिकतम 64 अक्षर। यह नाम प्रोफ़ाइल में दिखेगा।</i>`,
    helpMsg: `🤖 <b>बॉट कमांड और गाइड</b>
<code>━━━━━━━━━━━━━━━━━━━━━━━━━</code>
<b>📌 कमांड:</b>
/start — बॉट शुरू या रीस्टार्ट करें
/age DD/MM/YYYY — उम्र हिसाब करें
/leaderboard — शीर्ष 10 कमाई वाले
/stats — बॉट सांख्यिकी
/help — यह सहायता पैनल
<code>─────────────────────────</code>
<b>💰 कमाई के तरीके:</b>
📺 विज्ञापन देखें — +$0.01 प्रति विज्ञापन
📋 दैनिक कार्य — पूरा करने पर बोनस
👥 मित्र रेफर करें — पुरस्कार पाएं
<code>─────────────────────────</code>
⚡ <i>मेनू बटन दबाकर कमाई शुरू करें!</i>`,
    statsMsg: `📊 <b>बॉट सांख्यिकी</b>
<code>━━━━━━━━━━━━━━━━━━━━━━━━━</code>
👥 कुल उपयोगकर्ता:  <b>{users}</b>
💰 कुल भुगतान:      <b>$ {totalPaid}</b>
📺 कुल विज्ञापन:    <b>{totalAds}</b>
🏆 शीर्ष कमाई:      <b>$ {topEarner}</b>
<code>─────────────────────────</code>
⚡ <i>जुड़ें और कमाई शुरू करें!</i>`,
    leaderboardTitle: `🏆 <b>शीर्ष कमाई वाले</b>
<code>━━━━━━━━━━━━━━━━━━━━━━━━━</code>
{entries}
<code>─────────────────────────</code>
💪 <i>और कमाएं, रैंक बढ़ाएं!</i>`,
    leaderboardEntry: `{medal} <b>{rank}.</b> {name}  —  <b>$ {earned}</b>`,
    leaderboardEmpty: `🏆 <b>लीडरबोर्ड</b>
<code>━━━━━━━━━━━━━━━━━━━━━━━━━</code>
<i>अभी कोई डेटा नहीं। पहले कमाई करने वाले बनें!</i>`,
    supportMsg: `🛟 <b>सहायता केंद्र</b>
<code>━━━━━━━━━━━━━━━━━━━━━━━━━</code>
📩 अपनी समस्या विस्तार से लिखें।
⏱ प्रतिक्रिया: <b>24 घंटे में</b>
<i>कृपया प्रोफ़ाइल में दिखने वाला User ID शामिल करें।</i>`,
    profileBtn: "👤 मेरी प्रोफ़ाइल",
    earnBtn: "💰 कमाएँ",
    withdrawalBtn: "💸 निकालें",
    referralBtn: "👥 रेफर करें",
    adultBtn2: "🔞 एडल्ट",
    movieSeriesBtn: "🎬 मूवी-सीरीज़",
    setWalletBtn: "💳 वॉलेट सेट करें",
    changeLangBtn: "🌐 भाषा बदलें",
    watchAdsBtn: "📺 विज्ञापन देखें",
    dailyTasksBtn: "📋 दैनिक कार्य",
    confirmBtn: "✅ पुष्टि करें",
    changeMethodBtn: "🔄 विधि बदलें",
    cancelBtn: "❌ रद्द करें",
    mainMenuBtn: "🏠 मुख्य मेनू",
    backBtn: "⬅️ वापस",
    confirmWalletMsg: `${$check} <b>वॉलेट सेव पुष्टि</b>\n<code>${SEP}</code>\n💳 विधि: <b>{method}</b>\n${$mailbox} पता: <code>{address}</code>`,
    confirmWdMsg: `${$check} <b>निकासी पुष्टि</b>\n<code>${SEP}</code>\n💳 विधि: <b>{method}</b>\n${$mailbox} पता: <code>{address}</code>\n${$dollar} राशि: <b>$ {balance}</b>`,
    walletUpdated: `${$check} <b>वॉलेट अपडेट हो गया!</b>\n<code>${SEP}</code>\n💳 विधि: <b>{method}</b>\n${$mailbox} पता: <code>{address}</code>`,
    updateWalletMsg: `💳 <b>वॉलेट अपडेट करें</b>\n<code>${SEP}</code>\n${$phone} भुगतान विधि चुनें:`,
    nameUpdated: `${$check} <b>नाम अपडेट हो गया!</b>\n<code>${SEP}</code>\n${$user} नया नाम: <b>{name}</b>`,
    earnCategoryMsg: `${$money} <b>कमाई केंद्र</b>\n<code>${SEP}</code>\n${$rocket} आज कमाने का तरीका चुनें:\n<code>${LINE}</code>\n${$tv} <b>विज्ञापन देखें</b>  —  प्रति विज्ञापन +$0.01\n${$clip} <b>दैनिक कार्य</b>  —  पूरा करने पर बोनस\n${$people} <b>रेफ़रल</b>  —  प्रति दोस्त कमाएँ\n<code>${LINE}</code>\n${$zap} <i>सभी कमाई तुरंत</i>`,
  },

  // ─────────────────────────── ARABIC ─────────────────────────────
  ar: {
    earn:      "💰 الكسب",
    profile:   "👤 الملف",
    dailyTask: "📋 المهام",
    referral:  "👥 الإحالة",
    withdraw:  "💸 السحب",
    language:  "🌐 اللغة",
    adultBot:  "🔞 Adult",
    movieBot:  "🎬 Movies",
    rules:     "📜 القواعد",

    welcome: `🌐 <b>SELECT YOUR LANGUAGE / ভাষা নির্বাচন করুন</b>\n<code>${SEP}</code>\n🌍 Please select your preferred language to continue:\n<code>${LINE}</code>\n<blockquote>Tap your language below 👇</blockquote>`,

    langSet:    `${$check} <b>تم تعيين اللغة إلى العربية!</b>`,
    menuMsg:    `🚀 <b>CineVault Global Rewards</b>\n<code>${SEP}</code>\n👤 المستخدم: <b>{name}</b>\n🆔 معرف الحساب: <code>{id}</code>\n💵 الرصيد الرئيسي: <b>$ {balance}</b> USD\n👥 إجمالي الإحالات: <b>{refs}</b>\n<code>${LINE}</code>\n<blockquote>⚡ شاهد الإعلانات اليومية واكسب أو زر منطقة الفيديو!</blockquote>\n🎯 اضغط على زر للبدء 👇`,
    selectLang: `🌐 <b>SELECT YOUR LANGUAGE / ভাষা নির্বাচন করুন</b>\n<code>${SEP}</code>\n🌍 Please select your preferred language to continue:`,

    earnMsg: `${$money} <b>مركز الكسب</b>
<code>${SEP}</code>
${$chart} <b>التقدم:</b>  <code>{bar}</code>  <b>{watched} / {max}</b>
<code>${LINE}</code>
${$dollar} <i>كسب اليوم:</i>  <b>$ {todayEarned}</b>
${$wallet} <i>رصيدك:</i>     <b>$ {balance}</b>
${$zap} لكل إعلان: <b>$0.01</b>  ·  <b>{remaining}</b> متبقٍ
<code>${LINE}</code>`,

    earnDone: `${$check} <b>شاهدت جميع إعلانات اليوم!</b>
<code>${SEP}</code>
${$party} رائع! شاهدت جميع <b>{max}</b> إعلانات.
${$wallet} <i>الرصيد:</i> <b>$ {balance}</b>
<code>${LINE}</code>
${$moon} عُد <b>غداً</b> للمزيد!`,

    watchAd: "📺 شاهد إعلاناً  (+$0.01)",
    refresh:  "🔄 تحديث الرصيد",

    adStarted: `${$tv} <b>الإعلان جاهز — شاهد الآن!</b>
<code>${SEP}</code>
${$clock} شاهد لمدة <b>10 ثوانٍ</b> على الأقل
${$check} ثم اضغط <b>شاهدت</b>
<code>${LINE}</code>
<blockquote>${$warn} الضغط المبكر = <b>تحذير يُصدر</b>
${$lock} رمز فريد — <b>استخدام واحد فقط</b></blockquote>`,

    watchNow:   "▶️ فتح الإعلان",
    adVerify:   "✅ شاهدت",
    adComplete: `${$check} <b>+$0.01 أضيف بنجاح!</b>
<code>${SEP}</code>
${$wallet} الرصيد: <b>$ {balance}</b>
${$chart} اليوم: <b>{watched} / {max}</b> إعلان
<code>${LINE}</code>
${$fire} <i>استمر — كل إعلان يهم!</i>`,

    adFailed: `${$warn} <b>سريع جداً — فشل التحقق!</b>
<code>${SEP}</code>
يجب مشاهدة الإعلان كاملاً قبل التحقق.
<code>${LINE}</code>
<blockquote>${$warn} تحذير <b>{warnCount} / {warnLimit}</b> صدر.
${$ban} عند <b>{warnLimit}</b> تحذيرات → <b>حظر دائم</b></blockquote>`,

    adCheatBan: `${$ban} <b>تم حظر الحساب نهائياً</b>
<code>${SEP}</code>
<blockquote>تجاوزت حد الانتهاكات المسموح.
هذا القرار <b>نهائي</b>.</blockquote>
<code>${LINE}</code>
${$inbox} تواصل مع الدعم إن كان خطأً.`,

    adAlreadyPending: `${$hourglass} <b>يوجد إعلان جارٍ</b> — أكمله أولاً.`,
    adsLimit: `${$check} <b>شاهدت جميع {max} إعلانات اليوم!</b>
<code>${SEP}</code>
${$wallet} الرصيد: <b>$ {balance}</b>
${$moon} عُد <b>غداً</b>!`,

    channelRequired: `${$lock} <b>انضم للقنوات المطلوبة أولاً</b>
<code>${SEP}</code>
يجب الانضمام لـ<b>جميع</b> القنوات للبدء:

{channels}
<code>${LINE}</code>
${$check} بعد الانضمام اضغط <b>انضممت للكل</b>.`,

    joinedVerify:      "✅ انضممت للكل",
    channelNotJoined:  "❌ لم تنضم بعد — انضم أولاً.",
    channelJoinReward: `${$party} انضممت للقناة! <b>+\${reward}</b> أضيف.`,

    profileMsg: `${$user} <b>ملفي الشخصي</b>
<code>${SEP}</code>
${$idcard} <i>معرف المستخدم:</i> <code>{id}</code>
${$user} <i>الاسم:</i>          <b>{name}</b>
${$globe} <i>اللغة:</i>          {lang}
<code>${LINE}</code>
${$wallet} <i>الرصيد:</i>           <b>$ {balance}</b>
${$up} <i>إجمالي الكسب:</i>    <b>$ {totalEarned}</b>
<code>${LINE}</code>
${$chart} <i>إعلانات اليوم:</i>  <b>{adsToday} / {maxAds}</b>
${$people} <i>الإحالات:</i>        <b>{referrals}</b>
${$warn} <i>التحذيرات:</i>       <b>{warnings} / {warnLimit}</b>
${$cal} <i>تاريخ الانضمام:</i> <b>{joined}</b> <i>({days} يوماً)</i>
<code>${LINE}</code>
<blockquote>📜 <b>القواعد</b>
▸ أقصى <b>{maxAds}</b> إعلانات يومياً
▸ لا بوتات أو غش
▸ الحد الأدنى للسحب <b>$ {minWd}</b>
▸ <b>{warnLimit}</b> انتهاكات = حظر دائم
▸ حساب واحد لكل شخص</blockquote>`,

    referralMsg: `${$people} <b>برنامج الإحالة</b>
<code>${SEP}</code>
${$shine} ادعُ أصدقاء — اكسب <b>$ {refReward}</b> لكل شخص!
<code>${LINE}</code>
${$people} <i>إجمالي الإحالات:</i>  <b>{count}</b>
${$money} <i>أرباح الإحالة:</i>    <b>$ {earned}</b>
<code>${LINE}</code>
${$link} <b>رابط إحالتك:</b>
<code>{link}</code>
<code>${LINE}</code>
${$share} <i>شارك الرابط — اكسب فوراً عند انضمامهم!</i>`,

    shareLink: "📨 مشاركة الرابط",

    dailyTaskMsg: `${$clip} <b>المهام اليومية</b>
<code>${SEP}</code>
${$sparkle} أكمل جميع المهام — احصل على المكافأة!
${$refresh} تُعاد يومياً منتصف الليل
<code>${LINE}</code>
{tasks}
<code>${LINE}</code>
${$check} التقدم: <b>{done} / {total}</b>
${$gift} المكافأة اليومية: <b>$ {bonus}</b>`,

    taskWatchAds:   `${$tv} شاهد <b>{threshold}</b> إعلانات اليوم  →  <b>+$ {reward}</b>`,
    taskShare:      `${$share} شارك البوت مع صديق  →  <b>+$ {reward}</b>`,
    taskChannel:    `${$mega} انضم: <b>{name}</b>  →  <b>+$ {reward}</b>`,
    taskReferral:   `${$people} أحضر مستخدماً جديداً  →  <b>+$ {reward}</b>`,
    taskDonePrefix:    "✅ ",
    taskPendingPrefix: "⬜ ",
    claimBonus:     "🎁 احصل على المكافأة اليومية",
    bonusClaimed: `${$gift} <b>تم الحصول على المكافأة اليومية!</b>
<code>${SEP}</code>
${$money} المكافأة: <b>+$ {bonus}</b>
${$wallet} الرصيد الجديد: <b>$ {balance}</b>`,

    alreadyClaimed:   `${$check} طالبت بمكافأة اليوم بالفعل!`,
    tasksNotComplete: `${$warn} أكمل جميع المهام أولاً!`,
    taskShareBtn:     "📨 شارك البوت",
    taskVerifyBtn:    "✅ تحقق",

    withdrawMsg: `${$cashfly} <b>سحب الأموال</b>
<code>${SEP}</code>
${$wallet} رصيدك:     <b>$ {balance}</b>
${$warn} الحد الأدنى: <b>$ {minWd}</b>
<code>${LINE}</code>
${$phone} <b>اختر طريقة الدفع:</b>`,

    withdrawLow: `${$cross} <b>رصيد غير كافٍ</b>
<code>${SEP}</code>
تحتاج <b>$ {minWd}</b> على الأقل للسحب.
${$wallet} <i>رصيدك:</i> <b>$ {balance}</b>`,

    withdrawAddress:  `${$note} أدخل رقم <b>{method}</b> أو عنوان المحفظة:`,
    enterWalletAddress: `${$note} أدخل عنوان محفظة <b>{method}</b>:\n<code>${LINE}</code>\n${$zap} <i>مثال:</i> <code>{example}</code>`,
    withdrawConfirm: `${$check} <b>طلب السحب مُرسَل!</b>
<code>${SEP}</code>
${$dollar} المبلغ:   <b>$ {amount}</b>
${$bank} الطريقة:  <b>{method}</b>
${$mailbox} العنوان:  <code>{address}</code>
<code>${LINE}</code>
${$clock} الدفع خلال <b>24 ساعة</b>.`,

    withdrawPending: `${$hourglass} لديك <b>طلب سحب معلق</b>. انتظر معالجته.`,
    withdrawSelect:  "اختر طريقة الدفع:",

    banned: `${$ban} <b>تم حظر الحساب</b>
<code>${SEP}</code>
<blockquote>تم حظر حسابك بسبب انتهاك القواعد.</blockquote>
<code>${LINE}</code>
${$inbox} تواصل مع الدعم إن كان خطأً.`,

    startFirst: `${$warn} أرسل /start للبدء.`,
    unknownCmd: `استخدم أزرار القائمة للتنقل. 👇`,
    ageCmd: `🎂 <b>حاسبة العمر</b>
<code>${SEP}</code>
📅 أرسل تاريخ ميلادك بهذا الشكل:
<code>/age DD/MM/YYYY</code>
<code>${LINE}</code>
مثال: <code>/age 15/03/1995</code>`,
    ageResult: `🎂 <b>حاسبة العمر</b>
<code>${SEP}</code>
📅 تاريخ الميلاد: <b>{date}</b>
<code>${LINE}</code>
🔢 العمر: <b>{years} سنة، {months} شهر، {days} يوم</b>
🌟 إجمالي الأيام: <b>{totalDays}</b>
<code>${LINE}</code>
🎉 <i>استمر في النمو!</i>`,
    ageInvalid: `❌ <b>صيغة التاريخ غير صحيحة!</b>
استخدم: <code>/age DD/MM/YYYY</code>
مثال: <code>/age 15/03/1995</code>`,
    changeNameBtn: "✏️ تغيير الاسم",
    enterNameMsg: `✏️ <b>تغيير الاسم</b>
<code>━━━━━━━━━━━━━━━━━━━━━━━━━</code>
📝 اكتب اسمك الجديد أدناه:
<code>─────────────────────────</code>
<i>حد أقصى 64 حرفًا. سيظهر هذا الاسم في ملفك الشخصي.</i>`,
    helpMsg: `🤖 <b>أوامر البوت والدليل</b>
<code>━━━━━━━━━━━━━━━━━━━━━━━━━</code>
/start — بدء أو إعادة تشغيل البوت
/age DD/MM/YYYY — حساب العمر
/leaderboard — أفضل 10 مكتسبين
/stats — إحصائيات البوت
/help — لوحة المساعدة
<code>─────────────────────────</code>
⚡ <i>اضغط على زر القائمة للبدء!</i>`,
    statsMsg: `📊 <b>إحصائيات البوت</b>
<code>━━━━━━━━━━━━━━━━━━━━━━━━━</code>
👥 إجمالي المستخدمين: <b>{users}</b>
💰 إجمالي المدفوعات:  <b>$ {totalPaid}</b>
📺 إجمالي الإعلانات:  <b>{totalAds}</b>
🏆 أعلى مكتسب:        <b>$ {topEarner}</b>`,
    leaderboardTitle: `🏆 <b>قائمة المتصدرين</b>
<code>━━━━━━━━━━━━━━━━━━━━━━━━━</code>
{entries}
<code>─────────────────────────</code>
💪 <i>استمر في الكسب للتقدم في الترتيب!</i>`,
    leaderboardEntry: `{medal} <b>{rank}.</b> {name}  —  <b>$ {earned}</b>`,
    leaderboardEmpty: `🏆 <b>لوحة المتصدرين</b>
<i>لا توجد بيانات بعد. كن أول المكتسبين!</i>`,
    supportMsg: `🛟 <b>مركز الدعم</b>
<code>━━━━━━━━━━━━━━━━━━━━━━━━━</code>
📩 أرسل رسالة تصف مشكلتك.
⏱ وقت الاستجابة: <b>24 ساعة</b>`,
    profileBtn: "👤 ملفي الشخصي",
    earnBtn: "💰 اكسب",
    withdrawalBtn: "💸 اسحب",
    referralBtn: "👥 إحالة",
    adultBtn2: "🔞 للبالغين",
    movieSeriesBtn: "🎬 أفلام-مسلسلات",
    setWalletBtn: "💳 إعداد المحفظة",
    changeLangBtn: "🌐 تغيير اللغة",
    watchAdsBtn: "📺 شاهد إعلانات",
    dailyTasksBtn: "📋 المهام اليومية",
    confirmBtn: "✅ تأكيد",
    changeMethodBtn: "🔄 تغيير الطريقة",
    cancelBtn: "❌ إلغاء",
    mainMenuBtn: "🏠 القائمة الرئيسية",
    backBtn: "⬅️ رجوع",
    confirmWalletMsg: `${$check} <b>تأكيد حفظ المحفظة</b>\n<code>${SEP}</code>\n💳 الطريقة: <b>{method}</b>\n${$mailbox} العنوان: <code>{address}</code>`,
    confirmWdMsg: `${$check} <b>تأكيد السحب</b>\n<code>${SEP}</code>\n💳 الطريقة: <b>{method}</b>\n${$mailbox} العنوان: <code>{address}</code>\n${$dollar} المبلغ: <b>$ {balance}</b>`,
    walletUpdated: `${$check} <b>تم تحديث المحفظة!</b>\n<code>${SEP}</code>\n💳 الطريقة: <b>{method}</b>\n${$mailbox} العنوان: <code>{address}</code>`,
    updateWalletMsg: `💳 <b>تحديث المحفظة</b>\n<code>${SEP}</code>\n${$phone} اختر طريقة الدفع:`,
    nameUpdated: `${$check} <b>تم تحديث الاسم!</b>\n<code>${SEP}</code>\n${$user} الاسم الجديد: <b>{name}</b>`,
    earnCategoryMsg: `${$money} <b>مركز الكسب</b>\n<code>${SEP}</code>\n${$rocket} اختر كيفية الكسب:\n<code>${LINE}</code>\n${$tv} <b>شاهد إعلانات</b>  —  +$0.01 لكل إعلان\n${$clip} <b>مهام يومية</b>  —  مكافأة عند الإنجاز\n${$people} <b>إحالة</b>  —  اكسب لكل صديق\n<code>${LINE}</code>\n${$zap} <i>جميع المكاسب فورية</i>`,
  },

  // ─────────────────────────── RUSSIAN ────────────────────────────
  ru: {
    earn:      "💰 Заработок",
    profile:   "👤 Профиль",
    dailyTask: "📋 Задания",
    referral:  "👥 Рефералы",
    withdraw:  "💸 Вывод",
    language:  "🌐 Язык",
    adultBot:  "🔞 Adult",
    movieBot:  "🎬 Фильмы",
    rules:     "📜 Правила",

    welcome: `🌐 <b>SELECT YOUR LANGUAGE / ভাষা নির্বাচন করুন</b>\n<code>${SEP}</code>\n🌍 Please select your preferred language to continue:\n<code>${LINE}</code>\n<blockquote>Tap your language below 👇</blockquote>`,

    langSet:    `${$check} <b>Язык установлен на русский!</b>`,
    menuMsg:    `🚀 <b>CineVault Global Rewards</b>\n<code>${SEP}</code>\n👤 Пользователь: <b>{name}</b>\n🆔 ID аккаунта: <code>{id}</code>\n💵 Основной баланс: <b>$ {balance}</b> USD\n👥 Всего рефералов: <b>{refs}</b>\n<code>${LINE}</code>\n<blockquote>⚡ Смотрите рекламу каждый день, получайте бонусы или посетите Видео зону!</blockquote>\n🎯 Нажмите кнопку ниже 👇`,
    selectLang: `🌐 <b>SELECT YOUR LANGUAGE / ভাষা নির্বাচন করুন</b>\n<code>${SEP}</code>\n🌍 Please select your preferred language to continue:`,

    earnMsg: `${$money} <b>ЦЕНТР ЗАРАБОТКА</b>
<code>${SEP}</code>
${$chart} <b>Прогресс:</b>  <code>{bar}</code>  <b>{watched} / {max}</b>
<code>${LINE}</code>
${$dollar} <i>Заработано сегодня:</i>  <b>$ {todayEarned}</b>
${$wallet} <i>Ваш баланс:</i>          <b>$ {balance}</b>
${$zap} За рекламу: <b>$0.01</b>  ·  Осталось: <b>{remaining}</b>
<code>${LINE}</code>`,

    earnDone: `${$check} <b>Все реклама на сегодня просмотрена!</b>
<code>${SEP}</code>
${$party} Отличная работа! Просмотрено <b>{max}</b> реклам.
${$wallet} <i>Текущий баланс:</i> <b>$ {balance}</b>
<code>${LINE}</code>
${$moon} Возвращайтесь <b>завтра</b> за новыми!`,

    watchAd: "📺 Смотреть рекламу  (+$0.01)",
    refresh:  "🔄 Обновить баланс",

    adStarted: `${$tv} <b>Реклама готова — смотрите!</b>
<code>${SEP}</code>
${$clock} Смотрите не менее <b>10 секунд</b>
${$check} Затем нажмите <b>Я посмотрел</b>
<code>${LINE}</code>
<blockquote>${$warn} Ранний клик = <b>предупреждение</b>
${$lock} Уникальный токен — <b>только один раз</b></blockquote>`,

    watchNow:   "▶️ Открыть рекламу",
    adVerify:   "✅ Я посмотрел",
    adComplete: `${$check} <b>+$0.01 успешно начислено!</b>
<code>${SEP}</code>
${$wallet} Баланс: <b>$ {balance}</b>
${$chart} Сегодня: <b>{watched} / {max}</b> реклам
<code>${LINE}</code>
${$fire} <i>Продолжайте — каждая реклама важна!</i>`,

    adFailed: `${$warn} <b>Слишком быстро — верификация не пройдена!</b>
<code>${SEP}</code>
Необходимо просмотреть <b>полную</b> рекламу перед верификацией.
<code>${LINE}</code>
<blockquote>${$warn} Предупреждение <b>{warnCount} / {warnLimit}</b>.
${$ban} При <b>{warnLimit}</b> предупреждениях → <b>постоянная блокировка</b></blockquote>`,

    adCheatBan: `${$ban} <b>Аккаунт заблокирован навсегда</b>
<code>${SEP}</code>
<blockquote>Превышен лимит нарушений.
Это решение <b>окончательное</b>.</blockquote>
<code>${LINE}</code>
${$inbox} Свяжитесь с поддержкой, если считаете это ошибкой.`,

    adAlreadyPending: `${$hourglass} <b>Реклама в процессе</b> — завершите её перед новой.`,
    adsLimit: `${$check} <b>Все {max} реклам просмотрены!</b>
<code>${SEP}</code>
${$wallet} Баланс: <b>$ {balance}</b>
${$moon} Возвращайтесь <b>завтра</b>!`,

    channelRequired: `${$lock} <b>Сначала вступите в каналы</b>
<code>${SEP}</code>
Для начала заработка вступите во <b>все</b> каналы:

{channels}
<code>${LINE}</code>
${$check} После вступления нажмите <b>Я вступил</b>.`,

    joinedVerify:      "✅ Я вступил во все",
    channelNotJoined:  "❌ Ещё не вступили — вступите сначала.",
    channelJoinReward: `${$party} Вступили в канал! <b>+\${reward}</b> начислено.`,

    profileMsg: `${$user} <b>МОЙ ПРОФИЛЬ</b>
<code>${SEP}</code>
${$idcard} <i>ID пользователя:</i>  <code>{id}</code>
${$user} <i>Имя:</i>               <b>{name}</b>
${$globe} <i>Язык:</i>              {lang}
<code>${LINE}</code>
${$wallet} <i>Баланс:</i>              <b>$ {balance}</b>
${$up} <i>Всего заработано:</i>   <b>$ {totalEarned}</b>
<code>${LINE}</code>
${$chart} <i>Реклама сегодня:</i>  <b>{adsToday} / {maxAds}</b>
${$people} <i>Рефералы:</i>          <b>{referrals}</b>
${$warn} <i>Предупреждения:</i>    <b>{warnings} / {warnLimit}</b>
${$cal} <i>Дата регистрации:</i> <b>{joined}</b> <i>({days} дн.)</i>
<code>${LINE}</code>
<blockquote>📜 <b>ПРАВИЛА</b>
▸ Макс. <b>{maxAds}</b> реклам в день
▸ Боты и читинг запрещены
▸ Минимальный вывод: <b>$ {minWd}</b>
▸ <b>{warnLimit}</b> нарушений = постоянный бан
▸ Один аккаунт на человека</blockquote>`,

    referralMsg: `${$people} <b>РЕФЕРАЛЬНАЯ ПРОГРАММА</b>
<code>${SEP}</code>
${$shine} Приглашайте друзей — зарабатывайте <b>$ {refReward}</b> за каждого!
<code>${LINE}</code>
${$people} <i>Всего рефералов:</i>   <b>{count}</b>
${$money} <i>Реферальный доход:</i> <b>$ {earned}</b>
<code>${LINE}</code>
${$link} <b>Ваша реферальная ссылка:</b>
<code>{link}</code>
<code>${LINE}</code>
${$share} <i>Делитесь ссылкой — зарабатывайте мгновенно!</i>`,

    shareLink: "📨 Поделиться ссылкой",

    dailyTaskMsg: `${$clip} <b>ЕЖЕДНЕВНЫЕ ЗАДАНИЯ</b>
<code>${SEP}</code>
${$sparkle} Выполните все задания — получите бонус!
${$refresh} Сбрасывается каждую полночь
<code>${LINE}</code>
{tasks}
<code>${LINE}</code>
${$check} Прогресс: <b>{done} / {total}</b>
${$gift} Ежедневный бонус: <b>$ {bonus}</b>`,

    taskWatchAds:   `${$tv} Посмотрите <b>{threshold}</b> реклам сегодня  →  <b>+$ {reward}</b>`,
    taskShare:      `${$share} Поделитесь ботом с другом  →  <b>+$ {reward}</b>`,
    taskChannel:    `${$mega} Вступите: <b>{name}</b>  →  <b>+$ {reward}</b>`,
    taskReferral:   `${$people} Приведите нового пользователя  →  <b>+$ {reward}</b>`,
    taskDonePrefix:    "✅ ",
    taskPendingPrefix: "⬜ ",
    claimBonus:     "🎁 Получить ежедневный бонус",
    bonusClaimed: `${$gift} <b>Ежедневный бонус получен!</b>
<code>${SEP}</code>
${$money} Бонус: <b>+$ {bonus}</b>
${$wallet} Новый баланс: <b>$ {balance}</b>`,

    alreadyClaimed:   `${$check} Бонус сегодня уже получен!`,
    tasksNotComplete: `${$warn} Сначала выполните все задания!`,
    taskShareBtn:     "📨 Поделиться ботом",
    taskVerifyBtn:    "✅ Проверить",

    withdrawMsg: `${$cashfly} <b>ВЫВОД СРЕДСТВ</b>
<code>${SEP}</code>
${$wallet} Ваш баланс: <b>$ {balance}</b>
${$warn} Минимум: <b>$ {minWd}</b>
<code>${LINE}</code>
${$phone} <b>Выберите способ оплаты:</b>`,

    withdrawLow: `${$cross} <b>Недостаточный баланс</b>
<code>${SEP}</code>
Необходимо минимум <b>$ {minWd}</b> для вывода.
${$wallet} <i>Ваш баланс:</i> <b>$ {balance}</b>`,

    withdrawAddress:  `${$note} Введите ваш номер <b>{method}</b> или адрес кошелька:`,
    enterWalletAddress: `${$note} Введите адрес кошелька <b>{method}</b>:\n<code>${LINE}</code>\n${$zap} <i>Пример:</i> <code>{example}</code>`,
    withdrawConfirm: `${$check} <b>Запрос на вывод подан!</b>
<code>${SEP}</code>
${$dollar} Сумма:   <b>$ {amount}</b>
${$bank} Способ:  <b>{method}</b>
${$mailbox} Адрес:   <code>{address}</code>
<code>${LINE}</code>
${$clock} Оплата в течение <b>24 часов</b>.`,

    withdrawPending: `${$hourglass} У вас уже есть <b>ожидающий вывод</b>. Подождите.`,
    withdrawSelect:  "Выберите способ:",

    banned: `${$ban} <b>Аккаунт заблокирован</b>
<code>${SEP}</code>
<blockquote>Ваш аккаунт заблокирован за нарушение правил.</blockquote>
<code>${LINE}</code>
${$inbox} Свяжитесь с поддержкой, если считаете это ошибкой.`,

    startFirst: `${$warn} Отправьте /start для начала.`,
    unknownCmd: `Используйте кнопки меню для навигации. 👇`,
    ageCmd: `🎂 <b>Калькулятор возраста</b>
<code>${SEP}</code>
📅 Отправьте дату рождения в формате:
<code>/age DD/MM/YYYY</code>
<code>${LINE}</code>
Пример: <code>/age 15/03/1995</code>`,
    ageResult: `🎂 <b>Калькулятор возраста</b>
<code>${SEP}</code>
📅 Дата рождения: <b>{date}</b>
<code>${LINE}</code>
🔢 Возраст: <b>{years} лет, {months} мес., {days} дней</b>
🌟 Всего прожито дней: <b>{totalDays}</b>
<code>${LINE}</code>
🎉 <i>Продолжай расти!</i>`,
    ageInvalid: `❌ <b>Неверный формат даты!</b>
Используйте: <code>/age DD/MM/YYYY</code>
Пример: <code>/age 15/03/1995</code>`,
    changeNameBtn: "✏️ Изменить имя",
    enterNameMsg: `✏️ <b>ИЗМЕНЕНИЕ ИМЕНИ</b>
<code>━━━━━━━━━━━━━━━━━━━━━━━━━</code>
📝 Введите новое отображаемое имя:
<code>─────────────────────────</code>
<i>Максимум 64 символа. Имя будет отображаться в профиле.</i>`,
    helpMsg: `🤖 <b>КОМАНДЫ И СПРАВКА</b>
<code>━━━━━━━━━━━━━━━━━━━━━━━━━</code>
/start — Запустить бота
/age DD/MM/YYYY — Рассчитать возраст
/leaderboard — Топ 10 пользователей
/stats — Статистика бота
/help — Эта справка
<code>─────────────────────────</code>
⚡ <i>Нажмите кнопку меню, чтобы начать!</i>`,
    statsMsg: `📊 <b>СТАТИСТИКА БОТА</b>
<code>━━━━━━━━━━━━━━━━━━━━━━━━━</code>
👥 Всего пользователей: <b>{users}</b>
💰 Всего выплачено:     <b>$ {totalPaid}</b>
📺 Всего просмотров:    <b>{totalAds}</b>
🏆 Лучший заработок:    <b>$ {topEarner}</b>`,
    leaderboardTitle: `🏆 <b>ТАБЛИЦА ЛИДЕРОВ</b>
<code>━━━━━━━━━━━━━━━━━━━━━━━━━</code>
{entries}
<code>─────────────────────────</code>
💪 <i>Зарабатывай больше — поднимайся в рейтинге!</i>`,
    leaderboardEntry: `{medal} <b>{rank}.</b> {name}  —  <b>$ {earned}</b>`,
    leaderboardEmpty: `🏆 <b>ТАБЛИЦА ЛИДЕРОВ</b>
<i>Данных пока нет. Стань первым!</i>`,
    supportMsg: `🛟 <b>ПОДДЕРЖКА</b>
<code>━━━━━━━━━━━━━━━━━━━━━━━━━</code>
📩 Опишите проблему подробно.
⏱ Время ответа: <b>24 часа</b>`,
    profileBtn: "👤 Мой профиль",
    earnBtn: "💰 Заработать",
    withdrawalBtn: "💸 Вывод",
    referralBtn: "👥 Реферал",
    adultBtn2: "🔞 Взрослые",
    movieSeriesBtn: "🎬 Фильмы-Сериалы",
    setWalletBtn: "💳 Настроить кошелёк",
    changeLangBtn: "🌐 Сменить язык",
    watchAdsBtn: "📺 Смотреть рекламу",
    dailyTasksBtn: "📋 Ежедневные задания",
    confirmBtn: "✅ Подтвердить",
    changeMethodBtn: "🔄 Сменить способ",
    cancelBtn: "❌ Отмена",
    mainMenuBtn: "🏠 Главное меню",
    backBtn: "⬅️ Назад",
    confirmWalletMsg: `${$check} <b>Подтвердить сохранение кошелька</b>\n<code>${SEP}</code>\n💳 Способ: <b>{method}</b>\n${$mailbox} Адрес: <code>{address}</code>`,
    confirmWdMsg: `${$check} <b>Подтвердить вывод</b>\n<code>${SEP}</code>\n💳 Способ: <b>{method}</b>\n${$mailbox} Адрес: <code>{address}</code>\n${$dollar} Сумма: <b>$ {balance}</b>`,
    walletUpdated: `${$check} <b>Кошелёк обновлён!</b>\n<code>${SEP}</code>\n💳 Способ: <b>{method}</b>\n${$mailbox} Адрес: <code>{address}</code>`,
    updateWalletMsg: `💳 <b>Обновить кошелёк</b>\n<code>${SEP}</code>\n${$phone} Выберите способ оплаты:`,
    nameUpdated: `${$check} <b>Имя обновлено!</b>\n<code>${SEP}</code>\n${$user} Новое имя: <b>{name}</b>`,
    earnCategoryMsg: `${$money} <b>ЦЕНТР ЗАРАБОТКА</b>\n<code>${SEP}</code>\n${$rocket} Выберите способ заработка:\n<code>${LINE}</code>\n${$tv} <b>Смотреть рекламу</b>  —  +$0.01 за рекламу\n${$clip} <b>Ежедневные задания</b>  —  бонус за выполнение\n${$people} <b>Рефералы</b>  —  зарабатывайте за друзей\n<code>${LINE}</code>\n${$zap} <i>Все начисления мгновенны</i>`,
  },

  // ─────────────────────────── TURKISH ────────────────────────────
  tr: {
    earn:      "💰 Kazan",
    profile:   "👤 Profil",
    dailyTask: "📋 Görevler",
    referral:  "👥 Referans",
    withdraw:  "💸 Çekim",
    language:  "🌐 Dil",
    adultBot:  "🔞 Adult",
    movieBot:  "🎬 Filmler",
    rules:     "📜 Kurallar",

    welcome: `🌐 <b>SELECT YOUR LANGUAGE / ভাষা নির্বাচন করুন</b>\n<code>${SEP}</code>\n🌍 Please select your preferred language to continue:\n<code>${LINE}</code>\n<blockquote>Tap your language below 👇</blockquote>`,

    langSet:    `${$check} <b>Dil Türkçe olarak ayarlandı!</b>`,
    menuMsg:    `🚀 <b>CineVault Global Rewards</b>\n<code>${SEP}</code>\n👤 Kullanıcı: <b>{name}</b>\n🆔 Hesap ID: <code>{id}</code>\n💵 Ana Bakiye: <b>$ {balance}</b> USD\n👥 Toplam Referans: <b>{refs}</b>\n<code>${LINE}</code>\n<blockquote>⚡ Her gün reklam izle, bonus kazan veya Video Bölgesi'ni ziyaret et!</blockquote>\n🎯 Başlamak için aşağıdaki butona bas 👇`,
    selectLang: `🌐 <b>SELECT YOUR LANGUAGE / ভাষা নির্বাচন করুন</b>\n<code>${SEP}</code>\n🌍 Please select your preferred language to continue:`,

    earnMsg: `${$money} <b>KAZANÇ MERKEZİ</b>
<code>${SEP}</code>
${$chart} <b>İlerleme:</b>  <code>{bar}</code>  <b>{watched} / {max}</b>
<code>${LINE}</code>
${$dollar} <i>Bugün Kazanılan:</i>  <b>$ {todayEarned}</b>
${$wallet} <i>Bakiyeniz:</i>        <b>$ {balance}</b>
${$zap} Reklam başına: <b>$0.01</b>  ·  <b>{remaining}</b> kaldı
<code>${LINE}</code>`,

    earnDone: `${$check} <b>Bugünkü Tüm Reklamlar İzlendi!</b>
<code>${SEP}</code>
${$party} Harika! Tüm <b>{max}</b> reklamı izlediniz.
${$wallet} <i>Bakiyeniz:</i> <b>$ {balance}</b>
<code>${LINE}</code>
${$moon} Daha fazlası için <b>yarın</b> gelin!`,

    watchAd: "📺 Reklam İzle  (+$0.01)",
    refresh:  "🔄 Bakiyeyi Yenile",

    adStarted: `${$tv} <b>Reklam Hazır — Şimdi İzleyin!</b>
<code>${SEP}</code>
${$clock} En az <b>10 saniye</b> izleyin
${$check} Ardından <b>İzledim</b> butonuna basın
<code>${LINE}</code>
<blockquote>${$warn} Erken basmak = <b>Uyarı verilir</b>
${$lock} Benzersiz token — <b>tek kullanımlık</b></blockquote>`,

    watchNow:   "▶️ Reklamı Aç",
    adVerify:   "✅ İzledim",
    adComplete: `${$check} <b>+$0.01 Başarıyla Yüklendi!</b>
<code>${SEP}</code>
${$wallet} Bakiye: <b>$ {balance}</b>
${$chart} Bugün: <b>{watched} / {max}</b> reklam
<code>${LINE}</code>
${$fire} <i>Devam edin — her reklam önemli!</i>`,

    adFailed: `${$warn} <b>Doğrulama Başarısız — Çok Hızlı!</b>
<code>${SEP}</code>
Doğrulamadan önce tam reklamı izlemelisiniz.
<code>${LINE}</code>
<blockquote>${$warn} Uyarı <b>{warnCount} / {warnLimit}</b> verildi.
${$ban} <b>{warnLimit}</b> uyarıda → <b>kalıcı ban</b></blockquote>`,

    adCheatBan: `${$ban} <b>Hesap Kalıcı Olarak Banlandı</b>
<code>${SEP}</code>
<blockquote>İzin verilen ihlal limitini aştınız.
Bu karar <b>kesindir</b>.</blockquote>
<code>${LINE}</code>
${$inbox} Hata olduğunu düşünüyorsanız destek ile iletişime geçin.`,

    adAlreadyPending: `${$hourglass} <b>Reklam devam ediyor</b> — yeni başlatmadan önce tamamlayın.`,
    adsLimit: `${$check} <b>Bugünkü {max} reklam izlendi!</b>
<code>${SEP}</code>
${$wallet} Bakiye: <b>$ {balance}</b>
${$moon} <b>Yarın</b> görüşürüz!`,

    channelRequired: `${$lock} <b>Önce Gerekli Kanallara Katılın</b>
<code>${SEP}</code>
Kazanmaya başlamak için <b>tüm</b> kanallara katılın:

{channels}
<code>${LINE}</code>
${$check} Katıldıktan sonra <b>Hepsine Katıldım</b> butonuna basın.`,

    joinedVerify:      "✅ Hepsine Katıldım",
    channelNotJoined:  "❌ Henüz katılmadınız — önce katılın.",
    channelJoinReward: `${$party} Kanala katıldınız! <b>+\${reward}</b> yüklendi.`,

    profileMsg: `${$user} <b>PROFİLİM</b>
<code>${SEP}</code>
${$idcard} <i>Kullanıcı ID:</i>   <code>{id}</code>
${$user} <i>İsim:</i>            <b>{name}</b>
${$globe} <i>Dil:</i>             {lang}
<code>${LINE}</code>
${$wallet} <i>Bakiye:</i>             <b>$ {balance}</b>
${$up} <i>Toplam Kazanılan:</i> <b>$ {totalEarned}</b>
<code>${LINE}</code>
${$chart} <i>Bugün Reklam:</i>  <b>{adsToday} / {maxAds}</b>
${$people} <i>Referanslar:</i>   <b>{referrals}</b>
${$warn} <i>Uyarılar:</i>       <b>{warnings} / {warnLimit}</b>
${$cal} <i>Katıldı:</i>        <b>{joined}</b> <i>({days} gün)</i>
<code>${LINE}</code>
<blockquote>📜 <b>KURALLAR</b>
▸ Günde maksimum <b>{maxAds}</b> reklam
▸ Bot veya hile yasaktır
▸ Minimum çekim: <b>$ {minWd}</b>
▸ <b>{warnLimit}</b> ihlal = kalıcı ban
▸ Kişi başına bir hesap</blockquote>`,

    referralMsg: `${$people} <b>REFERANS PROGRAMI</b>
<code>${SEP}</code>
${$shine} Arkadaş davet edin — kişi başı <b>$ {refReward}</b> kazanın!
<code>${LINE}</code>
${$people} <i>Toplam Referans:</i>  <b>{count}</b>
${$money} <i>Referans Kazancı:</i> <b>$ {earned}</b>
<code>${LINE}</code>
${$link} <b>Referans Linkiniz:</b>
<code>{link}</code>
<code>${LINE}</code>
${$share} <i>Linki paylaşın — arkadaş katılınca anında kazanın!</i>`,

    shareLink: "📨 Linki Paylaş",

    dailyTaskMsg: `${$clip} <b>GÜNLÜK GÖREVLER</b>
<code>${SEP}</code>
${$sparkle} Görevleri tamamlayın — bonusu açın!
${$refresh} Her gece yarısı sıfırlanır
<code>${LINE}</code>
{tasks}
<code>${LINE}</code>
${$check} İlerleme: <b>{done} / {total}</b>
${$gift} Günlük Bonus: <b>$ {bonus}</b>`,

    taskWatchAds:   `${$tv} Bugün <b>{threshold}</b> reklam izle  →  <b>+$ {reward}</b>`,
    taskShare:      `${$share} Botu 1 arkadaşla paylaş  →  <b>+$ {reward}</b>`,
    taskChannel:    `${$mega} Katıl: <b>{name}</b>  →  <b>+$ {reward}</b>`,
    taskReferral:   `${$people} 1 yeni kullanıcı getir  →  <b>+$ {reward}</b>`,
    taskDonePrefix:    "✅ ",
    taskPendingPrefix: "⬜ ",
    claimBonus:     "🎁 Günlük Bonusu Al",
    bonusClaimed: `${$gift} <b>Günlük Bonus Alındı!</b>
<code>${SEP}</code>
${$money} Bonus: <b>+$ {bonus}</b>
${$wallet} Yeni Bakiye: <b>$ {balance}</b>`,

    alreadyClaimed:   `${$check} Bugünkü bonus zaten alındı!`,
    tasksNotComplete: `${$warn} Önce tüm görevleri tamamlayın!`,
    taskShareBtn:     "📨 Botu Paylaş",
    taskVerifyBtn:    "✅ Doğrula",

    withdrawMsg: `${$cashfly} <b>ÇEKİM</b>
<code>${SEP}</code>
${$wallet} Bakiye:  <b>$ {balance}</b>
${$warn} Minimum: <b>$ {minWd}</b>
<code>${LINE}</code>
${$phone} <b>Ödeme yöntemini seçin:</b>`,

    withdrawLow: `${$cross} <b>Yetersiz Bakiye</b>
<code>${SEP}</code>
Çekim için en az <b>$ {minWd}</b> gerekli.
${$wallet} <i>Bakiyeniz:</i> <b>$ {balance}</b>`,

    withdrawAddress:  `${$note} <b>{method}</b> numaranızı veya cüzdan adresinizi girin:`,
    enterWalletAddress: `${$note} <b>{method}</b> cüzdan adresinizi girin:\n<code>${LINE}</code>\n${$zap} <i>Örnek:</i> <code>{example}</code>`,
    withdrawConfirm: `${$check} <b>Çekim Talebi Gönderildi!</b>
<code>${SEP}</code>
${$dollar} Miktar:  <b>$ {amount}</b>
${$bank} Yöntem:  <b>{method}</b>
${$mailbox} Adres:   <code>{address}</code>
<code>${LINE}</code>
${$clock} <b>24 saat</b> içinde ödeme yapılır.`,

    withdrawPending: `${$hourglass} <b>Bekleyen bir çekim talebi</b> var. İşlenmesini bekleyin.`,
    withdrawSelect:  "Yöntem seçin:",

    banned: `${$ban} <b>Hesap Banlandı</b>
<code>${SEP}</code>
<blockquote>Hesabınız kural ihlali nedeniyle banlandı.</blockquote>
<code>${LINE}</code>
${$inbox} Hata olduğunu düşünüyorsanız destek ile iletişime geçin.`,

    startFirst: `${$warn} Başlamak için /start gönderin.`,
    unknownCmd: `Gezinmek için menü butonlarını kullanın. 👇`,
    ageCmd: `🎂 <b>Yaş Hesaplayıcı</b>
<code>${SEP}</code>
📅 Doğum tarihinizi bu formatta gönderin:
<code>/age DD/MM/YYYY</code>
<code>${LINE}</code>
Örnek: <code>/age 15/03/1995</code>`,
    ageResult: `🎂 <b>Yaş Hesaplayıcı</b>
<code>${SEP}</code>
📅 Doğum Tarihi: <b>{date}</b>
<code>${LINE}</code>
🔢 Yaş: <b>{years} yıl, {months} ay, {days} gün</b>
🌟 Toplam yaşanan gün: <b>{totalDays}</b>
<code>${LINE}</code>
🎉 <i>Büyümeye devam et!</i>`,
    ageInvalid: `❌ <b>Geçersiz tarih formatı!</b>
Kullanın: <code>/age DD/MM/YYYY</code>
Örnek: <code>/age 15/03/1995</code>`,
    changeNameBtn: "✏️ İsim Değiştir",
    enterNameMsg: `✏️ <b>İSİM DEĞİŞTİR</b>
<code>━━━━━━━━━━━━━━━━━━━━━━━━━</code>
📝 Yeni görünen adınızı yazın:
<code>─────────────────────────</code>
<i>Maks. 64 karakter. Bu isim profilinizde görünecek.</i>`,
    helpMsg: `🤖 <b>BOT KOMUTLARI</b>
<code>━━━━━━━━━━━━━━━━━━━━━━━━━</code>
/start — Botu başlat
/age DD/MM/YYYY — Yaş hesapla
/leaderboard — İlk 10 kazananlar
/stats — Bot istatistikleri
/help — Bu yardım paneli
<code>─────────────────────────</code>
⚡ <i>Kazanmaya başlamak için menü butonuna bas!</i>`,
    statsMsg: `📊 <b>BOT İSTATİSTİKLERİ</b>
<code>━━━━━━━━━━━━━━━━━━━━━━━━━</code>
👥 Toplam Kullanıcı: <b>{users}</b>
💰 Toplam Ödenen:    <b>$ {totalPaid}</b>
📺 Toplam Reklam:    <b>{totalAds}</b>
🏆 En Yüksek Kazanç: <b>$ {topEarner}</b>`,
    leaderboardTitle: `🏆 <b>LİDERLER TABLOSU</b>
<code>━━━━━━━━━━━━━━━━━━━━━━━━━</code>
{entries}
<code>─────────────────────────</code>
💪 <i>Daha fazla kazan, sıralamada yüksel!</i>`,
    leaderboardEntry: `{medal} <b>{rank}.</b> {name}  —  <b>$ {earned}</b>`,
    leaderboardEmpty: `🏆 <b>LİDERLER TABLOSU</b>
<i>Henüz veri yok. İlk kazanan sen ol!</i>`,
    supportMsg: `🛟 <b>DESTEK MERKEZİ</b>
<code>━━━━━━━━━━━━━━━━━━━━━━━━━</code>
📩 Sorununuzu ayrıntılı açıklayın.
⏱ Yanıt süresi: <b>24 saat</b>`,
    profileBtn: "👤 Profilim",
    earnBtn: "💰 Kazan",
    withdrawalBtn: "💸 Para Çek",
    referralBtn: "👥 Refer",
    adultBtn2: "🔞 Yetişkin",
    movieSeriesBtn: "🎬 Film-Dizi",
    setWalletBtn: "💳 Cüzdan Ayarla",
    changeLangBtn: "🌐 Dil Değiştir",
    watchAdsBtn: "📺 Reklam İzle",
    dailyTasksBtn: "📋 Günlük Görevler",
    confirmBtn: "✅ Onayla",
    changeMethodBtn: "🔄 Yöntem Değiştir",
    cancelBtn: "❌ İptal",
    mainMenuBtn: "🏠 Ana Menü",
    backBtn: "⬅️ Geri",
    confirmWalletMsg: `${$check} <b>Cüzdanı Kaydet</b>\n<code>${SEP}</code>\n💳 Yöntem: <b>{method}</b>\n${$mailbox} Adres: <code>{address}</code>`,
    confirmWdMsg: `${$check} <b>Çekimi Onayla</b>\n<code>${SEP}</code>\n💳 Yöntem: <b>{method}</b>\n${$mailbox} Adres: <code>{address}</code>\n${$dollar} Miktar: <b>$ {balance}</b>`,
    walletUpdated: `${$check} <b>Cüzdan Güncellendi!</b>\n<code>${SEP}</code>\n💳 Yöntem: <b>{method}</b>\n${$mailbox} Adres: <code>{address}</code>`,
    updateWalletMsg: `💳 <b>Cüzdan Güncelle</b>\n<code>${SEP}</code>\n${$phone} Ödeme yöntemini seçin:`,
    nameUpdated: `${$check} <b>İsim Güncellendi!</b>\n<code>${SEP}</code>\n${$user} Yeni isim: <b>{name}</b>`,
    earnCategoryMsg: `${$money} <b>KAZANÇ MERKEZİ</b>\n<code>${SEP}</code>\n${$rocket} Nasıl kazanmak istediğinizi seçin:\n<code>${LINE}</code>\n${$tv} <b>Reklam İzle</b>  —  reklam başına +$0.01\n${$clip} <b>Günlük Görevler</b>  —  tamamlamak için bonus\n${$people} <b>Referans</b>  —  her arkadaş için kazan\n<code>${LINE}</code>\n${$zap} <i>Tüm kazançlar anında eklenir</i>`,
  },

  // ─────────────────────────── URDU ───────────────────────────────
  ur: {
    earn:      "💰 کمائیں",
    profile:   "👤 پروفائل",
    dailyTask: "📋 روزانہ کام",
    referral:  "👥 ریفرل",
    withdraw:  "💸 نکاسی",
    language:  "🌐 زبان",
    adultBot:  "🔞 Adult",
    movieBot:  "🎬 Movies",
    rules:     "📜 اصول",

    welcome: `🌐 <b>SELECT YOUR LANGUAGE / ভাষা নির্বাচন করুন</b>\n<code>${SEP}</code>\n🌍 Please select your preferred language to continue:\n<code>${LINE}</code>\n<blockquote>Tap your language below 👇</blockquote>`,

    langSet:    `${$check} <b>زبان اردو میں سیٹ ہو گئی!</b>`,
    menuMsg:    `🚀 <b>CineVault Global Rewards</b>\n<code>${SEP}</code>\n👤 صارف: <b>{name}</b>\n🆔 اکاؤنٹ آئی ڈی: <code>{id}</code>\n💵 مرکزی بیلنس: <b>$ {balance}</b> USD\n👥 کل ریفرل: <b>{refs}</b>\n<code>${LINE}</code>\n<blockquote>⚡ روزانہ اشتہار دیکھیں، بونس لیں یا ویڈیو زون جائیں!</blockquote>\n🎯 نیچے بٹن دبائیں 👇`,
    selectLang: `🌐 <b>SELECT YOUR LANGUAGE / ভাষা নির্বাচন করুন</b>\n<code>${SEP}</code>\n🌍 Please select your preferred language to continue:`,

    earnMsg: `${$money} <b>کمائی مرکز</b>
<code>${SEP}</code>
${$chart} <b>پیشرفت:</b>  <code>{bar}</code>  <b>{watched} / {max}</b>
<code>${LINE}</code>
${$dollar} <i>آج کمایا:</i>    <b>$ {todayEarned}</b>
${$wallet} <i>آپ کا بیلنس:</i> <b>$ {balance}</b>
${$zap} فی اشتہار: <b>$0.01</b>  ·  <b>{remaining}</b> باقی
<code>${LINE}</code>`,

    earnDone: `${$check} <b>آج کے تمام اشتہار دیکھ لیے!</b>
<code>${SEP}</code>
${$party} شاندار! آپ نے تمام <b>{max}</b> اشتہار دیکھے۔
${$wallet} <i>بیلنس:</i> <b>$ {balance}</b>
<code>${LINE}</code>
${$moon} کل مزید کمائی کے لیے آئیں!`,

    watchAd: "📺 اشتہار دیکھیں  (+$0.01)",
    refresh:  "🔄 بیلنس تازہ کریں",

    adStarted: `${$tv} <b>اشتہار تیار ہے — ابھی دیکھیں!</b>
<code>${SEP}</code>
${$clock} کم از کم <b>10 سیکنڈ</b> دیکھیں
${$check} پھر نیچے <b>میں نے دیکھا</b> دبائیں
<code>${LINE}</code>
<blockquote>${$warn} جلدی دبانے پر = <b>انتباہ جاری</b>
${$lock} ہر اشتہار کا الگ ٹوکن — <b>صرف ایک بار</b></blockquote>`,

    watchNow:   "▶️ اشتہار کھولیں",
    adVerify:   "✅ میں نے دیکھا",
    adComplete: `${$check} <b>+$0.01 کامیابی سے کریڈٹ ہوا!</b>
<code>${SEP}</code>
${$wallet} بیلنس: <b>$ {balance}</b>
${$chart} آج: <b>{watched} / {max}</b> اشتہار دیکھے
<code>${LINE}</code>
${$fire} <i>جاری رکھیں — ہر اشتہار اہم ہے!</i>`,

    adFailed: `${$warn} <b>تصدیق ناکام — بہت جلدی!</b>
<code>${SEP}</code>
تصدیق سے پہلے پورا اشتہار دیکھنا ضروری ہے۔
<code>${LINE}</code>
<blockquote>${$warn} انتباہ <b>{warnCount} / {warnLimit}</b> جاری۔
${$ban} <b>{warnLimit}</b> انتباہ پر → <b>مستقل بین</b></blockquote>`,

    adCheatBan: `${$ban} <b>اکاؤنٹ مستقل بین</b>
<code>${SEP}</code>
<blockquote>آپ نے انتباہ کی حد پار کر لی۔
یہ فیصلہ <b>ناقابل واپسی</b> ہے۔</blockquote>
<code>${LINE}</code>
${$inbox} غلطی لگے تو سپورٹ سے رابطہ کریں۔`,

    adAlreadyPending: `${$hourglass} <b>اشتہار جاری ہے</b> — نیا شروع کرنے سے پہلے مکمل کریں۔`,
    adsLimit: `${$check} <b>آج کے تمام {max} اشتہار دیکھے!</b>
<code>${SEP}</code>
${$wallet} بیلنس: <b>$ {balance}</b>
${$moon} کل واپس آئیں!`,

    channelRequired: `${$lock} <b>پہلے ضروری چینلز جوائن کریں</b>
<code>${SEP}</code>
کمائی شروع کرنے کے لیے <b>تمام</b> چینل جوائن کریں:

{channels}
<code>${LINE}</code>
${$check} جوائن کرنے کے بعد <b>میں نے جوائن کیا</b> دبائیں۔`,

    joinedVerify:      "✅ میں نے سب جوائن کیا",
    channelNotJoined:  "❌ ابھی جوائن نہیں کیا — پہلے جوائن کریں۔",
    channelJoinReward: `${$party} چینل جوائن کیا! <b>+\${reward}</b> کریڈٹ۔`,

    profileMsg: `${$user} <b>میری پروفائل</b>
<code>${SEP}</code>
${$idcard} <i>یوزر ID:</i>     <code>{id}</code>
${$user} <i>نام:</i>          <b>{name}</b>
${$globe} <i>زبان:</i>         {lang}
<code>${LINE}</code>
${$wallet} <i>بیلنس:</i>         <b>$ {balance}</b>
${$up} <i>کل کمائی:</i>      <b>$ {totalEarned}</b>
<code>${LINE}</code>
${$chart} <i>آج کے اشتہار:</i> <b>{adsToday} / {maxAds}</b>
${$people} <i>ریفرل:</i>         <b>{referrals}</b>
${$warn} <i>انتباہ:</i>         <b>{warnings} / {warnLimit}</b>
${$cal} <i>شامل ہوئے:</i>     <b>{joined}</b> <i>({days} دن)</i>
<code>${LINE}</code>
<blockquote>📜 <b>اصول</b>
▸ روزانہ زیادہ سے زیادہ <b>{maxAds}</b> اشتہار
▸ بوٹ یا دھوکہ ممنوع
▸ نکاسی کے لیے کم از کم <b>$ {minWd}</b>
▸ <b>{warnLimit}</b> خلاف ورزی = مستقل بین
▸ ایک شخص — ایک اکاؤنٹ</blockquote>`,

    referralMsg: `${$people} <b>ریفرل پروگرام</b>
<code>${SEP}</code>
${$shine} دوست بلائیں — فی شخص <b>$ {refReward}</b> کمائیں!
<code>${LINE}</code>
${$people} <i>کل ریفرل:</i>    <b>{count}</b>
${$money} <i>ریفرل کمائی:</i> <b>$ {earned}</b>
<code>${LINE}</code>
${$link} <b>آپ کا ریفرل لنک:</b>
<code>{link}</code>
<code>${LINE}</code>
${$share} <i>لنک شیئر کریں — دوست جڑے تو فوری کمائی!</i>`,

    shareLink: "📨 لنک شیئر کریں",

    dailyTaskMsg: `${$clip} <b>روزانہ کام</b>
<code>${SEP}</code>
${$sparkle} تمام کام مکمل کریں — بونس انلاک کریں!
${$refresh} ہر رات 12 بجے ری سیٹ
<code>${LINE}</code>
{tasks}
<code>${LINE}</code>
${$check} پیشرفت: <b>{done} / {total}</b>
${$gift} روزانہ بونس: <b>$ {bonus}</b>`,

    taskWatchAds:   `${$tv} آج <b>{threshold}</b> اشتہار دیکھیں  →  <b>+$ {reward}</b>`,
    taskShare:      `${$share} بوٹ 1 دوست کو شیئر کریں  →  <b>+$ {reward}</b>`,
    taskChannel:    `${$mega} جوائن: <b>{name}</b>  →  <b>+$ {reward}</b>`,
    taskReferral:   `${$people} 1 نیا یوزر لائیں  →  <b>+$ {reward}</b>`,
    taskDonePrefix:    "✅ ",
    taskPendingPrefix: "⬜ ",
    claimBonus:     "🎁 روزانہ بونس لیں",
    bonusClaimed: `${$gift} <b>روزانہ بونس مل گیا!</b>
<code>${SEP}</code>
${$money} بونس: <b>+$ {bonus}</b>
${$wallet} نیا بیلنس: <b>$ {balance}</b>`,

    alreadyClaimed:   `${$check} آج کا بونس پہلے ہی لیا جا چکا!`,
    tasksNotComplete: `${$warn} پہلے تمام کام مکمل کریں!`,
    taskShareBtn:     "📨 بوٹ شیئر کریں",
    taskVerifyBtn:    "✅ تصدیق کریں",

    withdrawMsg: `${$cashfly} <b>نکاسی</b>
<code>${SEP}</code>
${$wallet} آپ کا بیلنس: <b>$ {balance}</b>
${$warn} کم از کم: <b>$ {minWd}</b>
<code>${LINE}</code>
${$phone} <b>ادائیگی کا طریقہ چنیں:</b>`,

    withdrawLow: `${$cross} <b>ناکافی بیلنس</b>
<code>${SEP}</code>
نکاسی کے لیے کم از کم <b>$ {minWd}</b> چاہیے۔
${$wallet} <i>آپ کا بیلنس:</i> <b>$ {balance}</b>`,

    withdrawAddress:  `${$note} اپنا <b>{method}</b> نمبر یا ولٹ پتہ درج کریں:`,
    enterWalletAddress: `${$note} اپنا <b>{method}</b> والٹ ایڈریس درج کریں:\n<code>${LINE}</code>\n${$zap} <i>مثال:</i> <code>{example}</code>`,
    withdrawConfirm: `${$check} <b>نکاسی کی درخواست جمع!</b>
<code>${SEP}</code>
${$dollar} رقم:    <b>$ {amount}</b>
${$bank} طریقہ:  <b>{method}</b>
${$mailbox} پتہ:    <code>{address}</code>
<code>${LINE}</code>
${$clock} <b>24 گھنٹے</b> میں ادائیگی ہوگی۔`,

    withdrawPending: `${$hourglass} پہلے سے ایک <b>زیر التواء نکاسی</b> ہے۔ انتظار کریں۔`,
    withdrawSelect:  "طریقہ چنیں:",

    banned: `${$ban} <b>اکاؤنٹ بین</b>
<code>${SEP}</code>
<blockquote>اصول کی خلاف ورزی کی وجہ سے اکاؤنٹ بین ہوا۔</blockquote>
<code>${LINE}</code>
${$inbox} غلطی لگے تو سپورٹ سے رابطہ کریں۔`,

    startFirst: `${$warn} شروع کرنے کے لیے /start بھیجیں۔`,
    unknownCmd: `نیویگیٹ کرنے کے لیے مینو بٹن استعمال کریں۔ 👇`,
    ageCmd: `🎂 <b>عمر کیلکولیٹر</b>
<code>${SEP}</code>
📅 پیدائش کی تاریخ اس فارمیٹ میں بھیجیں:
<code>/age DD/MM/YYYY</code>
<code>${LINE}</code>
مثال: <code>/age 15/03/1995</code>`,
    ageResult: `🎂 <b>عمر کیلکولیٹر</b>
<code>${SEP}</code>
📅 پیدائش کی تاریخ: <b>{date}</b>
<code>${LINE}</code>
🔢 عمر: <b>{years} سال، {months} مہینے، {days} دن</b>
🌟 کل گزرے دن: <b>{totalDays}</b>
<code>${LINE}</code>
🎉 <i>بڑھتے رہیں!</i>`,
    ageInvalid: `❌ <b>غلط تاریخ فارمیٹ!</b>
استعمال کریں: <code>/age DD/MM/YYYY</code>
مثال: <code>/age 15/03/1995</code>`,
    changeNameBtn: "✏️ نام تبدیل کریں",
    enterNameMsg: `✏️ <b>نام تبدیل کریں</b>
<code>━━━━━━━━━━━━━━━━━━━━━━━━━</code>
📝 نیچے اپنا نیا نام ٹائپ کریں:
<code>─────────────────────────</code>
<i>زیادہ سے زیادہ 64 حروف۔</i>`,
    helpMsg: `🤖 <b>بوٹ کمانڈز</b>
<code>━━━━━━━━━━━━━━━━━━━━━━━━━</code>
/start — بوٹ شروع کریں
/age DD/MM/YYYY — عمر حساب کریں
/leaderboard — ٹاپ 10 کمانے والے
/stats — بوٹ اعداد و شمار
/help — یہ مدد پینل
<code>─────────────────────────</code>
⚡ <i>کمانا شروع کریں!</i>`,
    statsMsg: `📊 <b>بوٹ اعداد و شمار</b>
<code>━━━━━━━━━━━━━━━━━━━━━━━━━</code>
👥 کل صارفین:    <b>{users}</b>
💰 کل ادائیگی:   <b>$ {totalPaid}</b>
📺 کل اشتہارات:  <b>{totalAds}</b>
🏆 سب سے زیادہ:  <b>$ {topEarner}</b>`,
    leaderboardTitle: `🏆 <b>لیڈر بورڈ</b>
<code>━━━━━━━━━━━━━━━━━━━━━━━━━</code>
{entries}
<code>─────────────────────────</code>
💪 <i>مزید کمائیں، رینک بڑھائیں!</i>`,
    leaderboardEntry: `{medal} <b>{rank}.</b> {name}  —  <b>$ {earned}</b>`,
    leaderboardEmpty: `🏆 <b>لیڈر بورڈ</b>
<i>ابھی کوئی ڈیٹا نہیں۔ پہلے کمانے والے بنیں!</i>`,
    supportMsg: `🛟 <b>سپورٹ سینٹر</b>
📩 اپنا مسئلہ تفصیل سے بتائیں۔
⏱ جواب: <b>24 گھنٹے میں</b>`,
    profileBtn: "👤 میرا پروفائل",
    earnBtn: "💰 کمائیں",
    withdrawalBtn: "💸 نکاسی",
    referralBtn: "👥 ریفر",
    adultBtn2: "🔞 بالغ",
    movieSeriesBtn: "🎬 فلمیں-ڈرامے",
    setWalletBtn: "💳 ولٹ سیٹ",
    changeLangBtn: "🌐 زبان تبدیل",
    watchAdsBtn: "📺 اشتہار دیکھیں",
    dailyTasksBtn: "📋 روزانہ کام",
    confirmBtn: "✅ تصدیق",
    changeMethodBtn: "🔄 طریقہ بدلیں",
    cancelBtn: "❌ منسوخ",
    mainMenuBtn: "🏠 مین مینو",
    backBtn: "⬅️ واپس",
    confirmWalletMsg: `${$check} <b>ولٹ محفوظ کریں</b>\n<code>${SEP}</code>\n💳 طریقہ: <b>{method}</b>\n${$mailbox} پتہ: <code>{address}</code>`,
    confirmWdMsg: `${$check} <b>نکاسی کی تصدیق</b>\n<code>${SEP}</code>\n💳 طریقہ: <b>{method}</b>\n${$mailbox} پتہ: <code>{address}</code>\n${$dollar} رقم: <b>$ {balance}</b>`,
    walletUpdated: `${$check} <b>ولٹ اپڈیٹ ہوا!</b>\n<code>${SEP}</code>\n💳 طریقہ: <b>{method}</b>\n${$mailbox} پتہ: <code>{address}</code>`,
    updateWalletMsg: `💳 <b>ولٹ اپڈیٹ کریں</b>\n<code>${SEP}</code>\n${$phone} ادائیگی کا طریقہ چنیں:`,
    nameUpdated: `${$check} <b>نام اپڈیٹ ہوا!</b>\n<code>${SEP}</code>\n${$user} نیا نام: <b>{name}</b>`,
    earnCategoryMsg: `${$money} <b>کمائی مرکز</b>\n<code>${SEP}</code>\n${$rocket} آج کیسے کمانا ہے چنیں:\n<code>${LINE}</code>\n${$tv} <b>اشتہار دیکھیں</b>  —  +$0.01 فی اشتہار\n${$clip} <b>روزانہ کام</b>  —  مکمل پر بونس\n${$people} <b>ریفرل</b>  —  ہر دوست پر کمائی\n<code>${LINE}</code>\n${$zap} <i>تمام کمائی فوری</i>`,
  },

  // ─────────────────────────── PUNJABI ────────────────────────────
  pa: {
    earn:      "💰 ਕਮਾਈ",
    profile:   "👤 ਪ੍ਰੋਫਾਈਲ",
    dailyTask: "📋 ਰੋਜ਼ਾਨਾ ਕੰਮ",
    referral:  "👥 ਰੈਫਰਲ",
    withdraw:  "💸 ਕਢਵਾਓ",
    language:  "🌐 ਭਾਸ਼ਾ",
    adultBot:  "🔞 Adult",
    movieBot:  "🎬 Movies",
    rules:     "📜 ਨਿਯਮ",

    welcome: `🌐 <b>SELECT YOUR LANGUAGE / ভাষা নির্বাচন করুন</b>\n<code>${SEP}</code>\n🌍 Please select your preferred language to continue:\n<code>${LINE}</code>\n<blockquote>Tap your language below 👇</blockquote>`,

    langSet:    `${$check} <b>ਭਾਸ਼ਾ ਪੰਜਾਬੀ ਵਿੱਚ ਸੈੱਟ ਹੋਈ!</b>`,
    menuMsg:    `🚀 <b>CineVault Global Rewards</b>\n<code>${SEP}</code>\n👤 ਵਰਤੋਂਕਾਰ: <b>{name}</b>\n🆔 ਖਾਤਾ ਆਈਡੀ: <code>{id}</code>\n💵 ਮੁੱਖ ਬੈਲੇਂਸ: <b>$ {balance}</b> USD\n👥 ਕੁੱਲ ਰੈਫਰਲ: <b>{refs}</b>\n<code>${LINE}</code>\n<blockquote>⚡ ਰੋਜ਼ ਇਸ਼ਤਿਹਾਰ ਦੇਖੋ, ਬੋਨਸ ਲਓ ਜਾਂ ਵੀਡੀਓ ਜ਼ੋਨ ਵਿੱਚ ਜਾਓ!</blockquote>\n🎯 ਹੇਠਾਂ ਬਟਨ ਦਬਾਓ 👇`,
    selectLang: `🌐 <b>SELECT YOUR LANGUAGE / ভাষা নির্বাচন করুন</b>\n<code>${SEP}</code>\n🌍 Please select your preferred language to continue:`,

    earnMsg: `${$money} <b>ਕਮਾਈ ਕੇਂਦਰ</b>
<code>${SEP}</code>
${$chart} <b>ਪ੍ਰਗਤੀ:</b>  <code>{bar}</code>  <b>{watched} / {max}</b>
<code>${LINE}</code>
${$dollar} <i>ਅੱਜ ਕਮਾਈ:</i>    <b>$ {todayEarned}</b>
${$wallet} <i>ਤੁਹਾਡਾ ਬੈਲੇਂਸ:</i> <b>$ {balance}</b>
${$zap} ਪ੍ਰਤੀ ਇਸ਼ਤਿਹਾਰ: <b>$0.01</b>  ·  <b>{remaining}</b> ਬਾਕੀ
<code>${LINE}</code>`,

    earnDone: `${$check} <b>ਅੱਜ ਦੇ ਸਾਰੇ ਇਸ਼ਤਿਹਾਰ ਦੇਖੇ!</b>
<code>${SEP}</code>
${$party} ਸ਼ਾਬਾਸ਼! ਤੁਸੀਂ ਸਾਰੇ <b>{max}</b> ਦੇਖੇ।
${$wallet} <i>ਬੈਲੇਂਸ:</i> <b>$ {balance}</b>
<code>${LINE}</code>
${$moon} ਹੋਰ ਲਈ <b>ਕੱਲ੍ਹ</b> ਆਓ!`,

    watchAd: "📺 ਇਸ਼ਤਿਹਾਰ ਦੇਖੋ  (+$0.01)",
    refresh:  "🔄 ਬੈਲੇਂਸ ਰੀਫਰੈਸ਼",

    adStarted: `${$tv} <b>ਇਸ਼ਤਿਹਾਰ ਤਿਆਰ — ਹੁਣੇ ਦੇਖੋ!</b>
<code>${SEP}</code>
${$clock} ਘੱਟੋ ਘੱਟ <b>10 ਸਕਿੰਟ</b> ਦੇਖੋ
${$check} ਫਿਰ <b>ਮੈਂ ਦੇਖਿਆ</b> ਦਬਾਓ
<code>${LINE}</code>
<blockquote>${$warn} ਜਲਦੀ ਦਬਾਉਣ 'ਤੇ = <b>ਚੇਤਾਵਨੀ ਜਾਰੀ</b>
${$lock} ਹਰ ਇਸ਼ਤਿਹਾਰ ਲਈ ਵੱਖਰਾ ਟੋਕਨ — <b>ਇੱਕ ਵਾਰ</b></blockquote>`,

    watchNow:   "▶️ ਇਸ਼ਤਿਹਾਰ ਖੋਲ੍ਹੋ",
    adVerify:   "✅ ਮੈਂ ਦੇਖਿਆ",
    adComplete: `${$check} <b>+$0.01 ਸਫਲਤਾਪੂਰਵਕ ਕ੍ਰੈਡਿਟ!</b>
<code>${SEP}</code>
${$wallet} ਬੈਲੇਂਸ: <b>$ {balance}</b>
${$chart} ਅੱਜ: <b>{watched} / {max}</b>
<code>${LINE}</code>
${$fire} <i>ਜਾਰੀ ਰੱਖੋ!</i>`,

    adFailed: `${$warn} <b>ਤਸਦੀਕ ਅਸਫਲ — ਬਹੁਤ ਜਲਦੀ!</b>
<code>${SEP}</code>
ਪੂਰਾ ਇਸ਼ਤਿਹਾਰ ਦੇਖਣਾ ਜ਼ਰੂਰੀ ਹੈ।
<code>${LINE}</code>
<blockquote>${$warn} ਚੇਤਾਵਨੀ <b>{warnCount} / {warnLimit}</b> ਜਾਰੀ।
${$ban} <b>{warnLimit}</b> ਤੇ → <b>ਸਥਾਈ ਬੈਨ</b></blockquote>`,

    adCheatBan: `${$ban} <b>ਖਾਤਾ ਸਥਾਈ ਬੈਨ</b>
<code>${SEP}</code>
<blockquote>ਤੁਸੀਂ ਉਲੰਘਣਾ ਸੀਮਾ ਪਾਰ ਕਰ ਲਈ।</blockquote>
<code>${LINE}</code>
${$inbox} ਸਹਾਇਤਾ ਨਾਲ ਸੰਪਰਕ ਕਰੋ।`,

    adAlreadyPending: `${$hourglass} <b>ਇਸ਼ਤਿਹਾਰ ਚੱਲ ਰਿਹਾ ਹੈ</b> — ਪਹਿਲਾਂ ਪੂਰਾ ਕਰੋ।`,
    adsLimit: `${$check} <b>ਅੱਜ ਦੇ {max} ਸਾਰੇ ਇਸ਼ਤਿਹਾਰ!</b>
<code>${SEP}</code>
${$wallet} ਬੈਲੇਂਸ: <b>$ {balance}</b>
${$moon} ਕੱਲ੍ਹ ਆਓ!`,

    channelRequired: `${$lock} <b>ਪਹਿਲਾਂ ਚੈਨਲ ਜੋਇਨ ਕਰੋ</b>
<code>${SEP}</code>
ਕਮਾਈ ਲਈ <b>ਸਾਰੇ</b> ਚੈਨਲ ਜੋਇਨ ਕਰੋ:

{channels}
<code>${LINE}</code>
${$check} ਜੋਇਨ ਕਰਕੇ <b>ਮੈਂ ਜੋਇਨ ਕੀਤਾ</b> ਦਬਾਓ।`,

    joinedVerify:      "✅ ਮੈਂ ਸਭ ਜੋਇਨ ਕੀਤਾ",
    channelNotJoined:  "❌ ਅਜੇ ਜੋਇਨ ਨਹੀਂ — ਪਹਿਲਾਂ ਕਰੋ।",
    channelJoinReward: `${$party} ਚੈਨਲ ਜੋਇਨ! <b>+\${reward}</b> ਕ੍ਰੈਡਿਟ।`,

    profileMsg: `${$user} <b>ਮੇਰੀ ਪ੍ਰੋਫਾਈਲ</b>
<code>${SEP}</code>
${$idcard} <i>ਯੂਜ਼ਰ ID:</i>     <code>{id}</code>
${$user} <i>ਨਾਮ:</i>          <b>{name}</b>
${$globe} <i>ਭਾਸ਼ਾ:</i>         {lang}
<code>${LINE}</code>
${$wallet} <i>ਬੈਲੇਂਸ:</i>       <b>$ {balance}</b>
${$up} <i>ਕੁੱਲ ਕਮਾਈ:</i>   <b>$ {totalEarned}</b>
<code>${LINE}</code>
${$chart} <i>ਅੱਜ ਦੇ ਇਸ਼ਤਿਹਾਰ:</i> <b>{adsToday} / {maxAds}</b>
${$people} <i>ਰੈਫਰਲ:</i>          <b>{referrals}</b>
${$warn} <i>ਚੇਤਾਵਨੀਆਂ:</i>      <b>{warnings} / {warnLimit}</b>
${$cal} <i>ਸ਼ਾਮਲ ਹੋਏ:</i>     <b>{joined}</b> <i>({days} ਦਿਨ)</i>
<code>${LINE}</code>
<blockquote>📜 <b>ਨਿਯਮ</b>
▸ ਰੋਜ਼ਾਨਾ ਵੱਧ ਤੋਂ ਵੱਧ <b>{maxAds}</b> ਇਸ਼ਤਿਹਾਰ
▸ ਬੋਟ ਜਾਂ ਧੋਖਾ ਮਨਾਹੀ
▸ ਘੱਟੋ ਘੱਟ ਕਢਵਾਈ: <b>$ {minWd}</b>
▸ <b>{warnLimit}</b> ਉਲੰਘਣਾ = ਸਥਾਈ ਬੈਨ
▸ ਇੱਕ ਵਿਅਕਤੀ — ਇੱਕ ਖਾਤਾ</blockquote>`,

    referralMsg: `${$people} <b>ਰੈਫਰਲ ਪ੍ਰੋਗਰਾਮ</b>
<code>${SEP}</code>
${$shine} ਦੋਸਤ ਲਿਆਓ — ਪ੍ਰਤੀ ਵਿਅਕਤੀ <b>$ {refReward}</b> ਕਮਾਓ!
<code>${LINE}</code>
${$people} <i>ਕੁੱਲ ਰੈਫਰਲ:</i>   <b>{count}</b>
${$money} <i>ਰੈਫਰਲ ਕਮਾਈ:</i> <b>$ {earned}</b>
<code>${LINE}</code>
${$link} <b>ਤੁਹਾਡਾ ਰੈਫਰਲ ਲਿੰਕ:</b>
<code>{link}</code>
<code>${LINE}</code>
${$share} <i>ਲਿੰਕ ਸ਼ੇਅਰ ਕਰੋ — ਤੁਰੰਤ ਕਮਾਈ!</i>`,

    shareLink: "📨 ਲਿੰਕ ਸ਼ੇਅਰ ਕਰੋ",

    dailyTaskMsg: `${$clip} <b>ਰੋਜ਼ਾਨਾ ਕੰਮ</b>
<code>${SEP}</code>
${$sparkle} ਸਾਰੇ ਕੰਮ ਕਰੋ — ਬੋਨਸ ਪਾਓ!
${$refresh} ਹਰ ਰਾਤ ਰੀਸੈੱਟ
<code>${LINE}</code>
{tasks}
<code>${LINE}</code>
${$check} ਪ੍ਰਗਤੀ: <b>{done} / {total}</b>
${$gift} ਰੋਜ਼ਾਨਾ ਬੋਨਸ: <b>$ {bonus}</b>`,

    taskWatchAds:   `${$tv} ਅੱਜ <b>{threshold}</b> ਇਸ਼ਤਿਹਾਰ ਦੇਖੋ  →  <b>+$ {reward}</b>`,
    taskShare:      `${$share} ਬੋਟ 1 ਦੋਸਤ ਨਾਲ ਸ਼ੇਅਰ ਕਰੋ  →  <b>+$ {reward}</b>`,
    taskChannel:    `${$mega} ਜੋਇਨ: <b>{name}</b>  →  <b>+$ {reward}</b>`,
    taskReferral:   `${$people} 1 ਨਵਾਂ ਯੂਜ਼ਰ ਲਿਆਓ  →  <b>+$ {reward}</b>`,
    taskDonePrefix:    "✅ ",
    taskPendingPrefix: "⬜ ",
    claimBonus:     "🎁 ਰੋਜ਼ਾਨਾ ਬੋਨਸ ਲਓ",
    bonusClaimed: `${$gift} <b>ਰੋਜ਼ਾਨਾ ਬੋਨਸ ਮਿਲਿਆ!</b>
<code>${SEP}</code>
${$money} ਬੋਨਸ: <b>+$ {bonus}</b>
${$wallet} ਨਵਾਂ ਬੈਲੇਂਸ: <b>$ {balance}</b>`,

    alreadyClaimed:   `${$check} ਅੱਜ ਦਾ ਬੋਨਸ ਪਹਿਲਾਂ ਲਿਆ!`,
    tasksNotComplete: `${$warn} ਪਹਿਲਾਂ ਸਾਰੇ ਕੰਮ ਕਰੋ!`,
    taskShareBtn:     "📨 ਬੋਟ ਸ਼ੇਅਰ ਕਰੋ",
    taskVerifyBtn:    "✅ ਤਸਦੀਕ ਕਰੋ",

    withdrawMsg: `${$cashfly} <b>ਕਢਵਾਈ</b>
<code>${SEP}</code>
${$wallet} ਬੈਲੇਂਸ: <b>$ {balance}</b>
${$warn} ਘੱਟੋ ਘੱਟ: <b>$ {minWd}</b>
<code>${LINE}</code>
${$phone} <b>ਭੁਗਤਾਨ ਵਿਧੀ ਚੁਣੋ:</b>`,

    withdrawLow: `${$cross} <b>ਨਾਕਾਫ਼ੀ ਬੈਲੇਂਸ</b>
<code>${SEP}</code>
ਕਢਵਾਈ ਲਈ ਘੱਟੋ ਘੱਟ <b>$ {minWd}</b> ਚਾਹੀਦਾ।
${$wallet} <i>ਬੈਲੇਂਸ:</i> <b>$ {balance}</b>`,

    withdrawAddress:  `${$note} ਆਪਣਾ <b>{method}</b> ਨੰਬਰ ਜਾਂ ਵੈਲੇਟ ਪਤਾ ਦਿਓ:`,
    enterWalletAddress: `${$note} ਆਪਣਾ <b>{method}</b> ਵੈਲੇਟ ਪਤਾ ਦਿਓ:\n<code>${LINE}</code>\n${$zap} <i>ਉਦਾਹਰਣ:</i> <code>{example}</code>`,
    withdrawConfirm: `${$check} <b>ਕਢਵਾਈ ਬੇਨਤੀ ਜਮ੍ਹਾਂ!</b>
<code>${SEP}</code>
${$dollar} ਰਕਮ:    <b>$ {amount}</b>
${$bank} ਵਿਧੀ:   <b>{method}</b>
${$mailbox} ਪਤਾ:    <code>{address}</code>
<code>${LINE}</code>
${$clock} <b>24 ਘੰਟਿਆਂ</b> ਵਿੱਚ ਭੁਗਤਾਨ।`,

    withdrawPending: `${$hourglass} ਪਹਿਲਾਂ ਹੀ <b>ਲੰਬਿਤ ਕਢਵਾਈ</b> ਹੈ। ਉਡੀਕ ਕਰੋ।`,
    withdrawSelect:  "ਵਿਧੀ ਚੁਣੋ:",

    banned: `${$ban} <b>ਖਾਤਾ ਬੈਨ</b>
<code>${SEP}</code>
<blockquote>ਨਿਯਮਾਂ ਦੀ ਉਲੰਘਣਾ ਕਾਰਨ ਬੈਨ ਹੋਇਆ।</blockquote>
<code>${LINE}</code>
${$inbox} ਸਹਾਇਤਾ ਨਾਲ ਸੰਪਰਕ ਕਰੋ।`,

    startFirst: `${$warn} ਸ਼ੁਰੂ ਕਰਨ ਲਈ /start ਭੇਜੋ।`,
    unknownCmd: `ਮੀਨੂ ਬਟਨ ਵਰਤੋ। 👇`,
    ageCmd: `🎂 <b>ਉਮਰ ਕੈਲਕੁਲੇਟਰ</b>
<code>${SEP}</code>
📅 ਜਨਮ ਤਾਰੀਖ ਇਸ ਫਾਰਮੈਟ ਵਿੱਚ ਭੇਜੋ:
<code>/age DD/MM/YYYY</code>
<code>${LINE}</code>
ਉਦਾਹਰਨ: <code>/age 15/03/1995</code>`,
    ageResult: `🎂 <b>ਉਮਰ ਕੈਲਕੁਲੇਟਰ</b>
<code>${SEP}</code>
📅 ਜਨਮ ਤਾਰੀਖ: <b>{date}</b>
<code>${LINE}</code>
🔢 ਉਮਰ: <b>{years} ਸਾਲ, {months} ਮਹੀਨੇ, {days} ਦਿਨ</b>
🌟 ਕੁੱਲ ਦਿਨ: <b>{totalDays}</b>
<code>${LINE}</code>
🎉 <i>ਵਧਦੇ ਰਹੋ!</i>`,
    ageInvalid: `❌ <b>ਗਲਤ ਤਾਰੀਖ ਫਾਰਮੈਟ!</b>
ਵਰਤੋਂ: <code>/age DD/MM/YYYY</code>
ਉਦਾਹਰਨ: <code>/age 15/03/1995</code>`,
    changeNameBtn: "✏️ ਨਾਮ ਬਦਲੋ",
    enterNameMsg: `✏️ <b>ਨਾਮ ਬਦਲੋ</b>
<code>━━━━━━━━━━━━━━━━━━━━━━━━━</code>
📝 ਹੇਠਾਂ ਆਪਣਾ ਨਵਾਂ ਨਾਮ ਟਾਈਪ ਕਰੋ:
<code>─────────────────────────</code>
<i>ਵੱਧ ਤੋਂ ਵੱਧ 64 ਅੱਖਰ।</i>`,
    helpMsg: `🤖 <b>ਬੋਟ ਕਮਾਂਡਾਂ</b>
<code>━━━━━━━━━━━━━━━━━━━━━━━━━</code>
/start — ਬੋਟ ਸ਼ੁਰੂ ਕਰੋ
/age DD/MM/YYYY — ਉਮਰ ਹਿਸਾਬ ਕਰੋ
/leaderboard — ਚੋਟੀ ਦੇ 10 ਕਮਾਉਣ ਵਾਲੇ
/stats — ਬੋਟ ਅੰਕੜੇ
/help — ਮਦਦ ਪੈਨਲ
<code>─────────────────────────</code>
⚡ <i>ਮੀਨੂ ਬਟਨ ਦਬਾ ਕੇ ਕਮਾਈ ਸ਼ੁਰੂ ਕਰੋ!</i>`,
    statsMsg: `📊 <b>ਬੋਟ ਅੰਕੜੇ</b>
<code>━━━━━━━━━━━━━━━━━━━━━━━━━</code>
👥 ਕੁੱਲ ਉਪਭੋਗਤਾ: <b>{users}</b>
💰 ਕੁੱਲ ਭੁਗਤਾਨ:  <b>$ {totalPaid}</b>
📺 ਕੁੱਲ ਇਸ਼ਤਿਹਾਰ: <b>{totalAds}</b>
🏆 ਚੋਟੀ ਦੀ ਕਮਾਈ: <b>$ {topEarner}</b>`,
    leaderboardTitle: `🏆 <b>ਲੀਡਰਬੋਰਡ</b>
<code>━━━━━━━━━━━━━━━━━━━━━━━━━</code>
{entries}
<code>─────────────────────────</code>
💪 <i>ਹੋਰ ਕਮਾਓ, ਰੈਂਕ ਵਧਾਓ!</i>`,
    leaderboardEntry: `{medal} <b>{rank}.</b> {name}  —  <b>$ {earned}</b>`,
    leaderboardEmpty: `🏆 <b>ਲੀਡਰਬੋਰਡ</b>
<i>ਅਜੇ ਕੋਈ ਡੇਟਾ ਨਹੀਂ।</i>`,
    supportMsg: `🛟 <b>ਸਹਾਇਤਾ ਕੇਂਦਰ</b>
📩 ਆਪਣੀ ਸਮੱਸਿਆ ਵਿਸਥਾਰ ਨਾਲ ਲਿਖੋ।
⏱ ਜਵਾਬ: <b>24 ਘੰਟੇ ਵਿੱਚ</b>`,
    profileBtn: "👤 ਮੇਰਾ ਪ੍ਰੋਫਾਈਲ",
    earnBtn: "💰 ਕਮਾਓ",
    withdrawalBtn: "💸 ਕਢਵਾਓ",
    referralBtn: "👥 ਰੈਫਰ",
    adultBtn2: "🔞 ਬਾਲਗ",
    movieSeriesBtn: "🎬 ਫਿਲਮਾਂ-ਸੀਰੀਜ਼",
    setWalletBtn: "💳 ਵੈਲੇਟ ਸੈੱਟ",
    changeLangBtn: "🌐 ਭਾਸ਼ਾ ਬਦਲੋ",
    watchAdsBtn: "📺 ਇਸ਼ਤਿਹਾਰ ਦੇਖੋ",
    dailyTasksBtn: "📋 ਰੋਜ਼ਾਨਾ ਕੰਮ",
    confirmBtn: "✅ ਪੱਕਾ ਕਰੋ",
    changeMethodBtn: "🔄 ਵਿਧੀ ਬਦਲੋ",
    cancelBtn: "❌ ਰੱਦ ਕਰੋ",
    mainMenuBtn: "🏠 ਮੁੱਖ ਮੀਨੂ",
    backBtn: "⬅️ ਵਾਪਸ",
    confirmWalletMsg: `${$check} <b>ਵੈਲੇਟ ਸੇਵ ਕਰੋ</b>\n<code>${SEP}</code>\n💳 ਵਿਧੀ: <b>{method}</b>\n${$mailbox} ਪਤਾ: <code>{address}</code>`,
    confirmWdMsg: `${$check} <b>ਕਢਵਾਈ ਪੱਕੀ ਕਰੋ</b>\n<code>${SEP}</code>\n💳 ਵਿਧੀ: <b>{method}</b>\n${$mailbox} ਪਤਾ: <code>{address}</code>\n${$dollar} ਰਕਮ: <b>$ {balance}</b>`,
    walletUpdated: `${$check} <b>ਵੈਲੇਟ ਅੱਪਡੇਟ!</b>\n<code>${SEP}</code>\n💳 ਵਿਧੀ: <b>{method}</b>\n${$mailbox} ਪਤਾ: <code>{address}</code>`,
    updateWalletMsg: `💳 <b>ਵੈਲੇਟ ਅੱਪਡੇਟ ਕਰੋ</b>\n<code>${SEP}</code>\n${$phone} ਭੁਗਤਾਨ ਵਿਧੀ ਚੁਣੋ:`,
    nameUpdated: `${$check} <b>ਨਾਮ ਅੱਪਡੇਟ!</b>\n<code>${SEP}</code>\n${$user} ਨਵਾਂ ਨਾਮ: <b>{name}</b>`,
    earnCategoryMsg: `${$money} <b>ਕਮਾਈ ਕੇਂਦਰ</b>\n<code>${SEP}</code>\n${$rocket} ਕਿਵੇਂ ਕਮਾਉਣਾ ਹੈ ਚੁਣੋ:\n<code>${LINE}</code>\n${$tv} <b>ਇਸ਼ਤਿਹਾਰ ਦੇਖੋ</b>  —  +$0.01 ਪ੍ਰਤੀ\n${$clip} <b>ਰੋਜ਼ਾਨਾ ਕੰਮ</b>  —  ਬੋਨਸ\n${$people} <b>ਰੈਫਰਲ</b>  —  ਦੋਸਤ ਪ੍ਰਤੀ ਕਮਾਈ\n<code>${LINE}</code>\n${$zap} <i>ਸਾਰੀ ਕਮਾਈ ਤੁਰੰਤ</i>`,
  },

  // ─────────────────────────── INDONESIAN ─────────────────────────
  id: {
    earn:      "💰 Hasilkan",
    profile:   "👤 Profil",
    dailyTask: "📋 Tugas Harian",
    referral:  "👥 Referral",
    withdraw:  "💸 Tarik Dana",
    language:  "🌐 Bahasa",
    adultBot:  "🔞 Adult",
    movieBot:  "🎬 Film",
    rules:     "📜 Aturan",

    welcome: `🌐 <b>SELECT YOUR LANGUAGE / ভাষা নির্বাচন করুন</b>\n<code>${SEP}</code>\n🌍 Please select your preferred language to continue:\n<code>${LINE}</code>\n<blockquote>Tap your language below 👇</blockquote>`,

    langSet:    `${$check} <b>Bahasa diatur ke Indonesia!</b>`,
    menuMsg:    `🚀 <b>CineVault Global Rewards</b>\n<code>${SEP}</code>\n👤 Pengguna: <b>{name}</b>\n🆔 ID Akun: <code>{id}</code>\n💵 Saldo Utama: <b>$ {balance}</b> USD\n👥 Total Referral: <b>{refs}</b>\n<code>${LINE}</code>\n<blockquote>⚡ Tonton iklan harian, klaim bonus, atau kunjungi Video Zone!</blockquote>\n🎯 Tekan tombol di bawah untuk mulai 👇`,
    selectLang: `🌐 <b>SELECT YOUR LANGUAGE / ভাষা নির্বাচন করুন</b>\n<code>${SEP}</code>\n🌍 Please select your preferred language to continue:`,

    earnMsg: `${$money} <b>PUSAT PENGHASILAN</b>
<code>${SEP}</code>
${$chart} <b>Progress:</b>  <code>{bar}</code>  <b>{watched} / {max}</b>
<code>${LINE}</code>
${$dollar} <i>Diperoleh Hari Ini:</i>  <b>$ {todayEarned}</b>
${$wallet} <i>Saldo Anda:</i>          <b>$ {balance}</b>
${$zap} Per Iklan: <b>$0.01</b>  ·  <b>{remaining}</b> tersisa
<code>${LINE}</code>`,

    earnDone: `${$check} <b>Semua Iklan Hari Ini Selesai!</b>
<code>${SEP}</code>
${$party} Luar biasa! Sudah menonton semua <b>{max}</b> iklan.
${$wallet} <i>Saldo:</i> <b>$ {balance}</b>
<code>${LINE}</code>
${$moon} Kembali <b>besok</b> untuk lebih banyak!`,

    watchAd: "📺 Tonton Iklan  (+$0.01)",
    refresh:  "🔄 Perbarui Saldo",

    adStarted: `${$tv} <b>Iklan Siap — Tonton Sekarang!</b>
<code>${SEP}</code>
${$clock} Tonton selama minimal <b>10 detik</b>
${$check} Lalu tekan <b>Sudah Ditonton</b>
<code>${LINE}</code>
<blockquote>${$warn} Tekan cepat = <b>Peringatan diberikan</b>
${$lock} Token unik — <b>sekali pakai</b></blockquote>`,

    watchNow:   "▶️ Buka Iklan",
    adVerify:   "✅ Sudah Ditonton",
    adComplete: `${$check} <b>+$0.01 Berhasil Dikreditkan!</b>
<code>${SEP}</code>
${$wallet} Saldo: <b>$ {balance}</b>
${$chart} Hari ini: <b>{watched} / {max}</b> iklan
<code>${LINE}</code>
${$fire} <i>Terus lanjut — setiap iklan berarti!</i>`,

    adFailed: `${$warn} <b>Verifikasi Gagal — Terlalu Cepat!</b>
<code>${SEP}</code>
Anda harus menonton iklan <b>penuh</b> sebelum verifikasi.
<code>${LINE}</code>
<blockquote>${$warn} Peringatan <b>{warnCount} / {warnLimit}</b> diberikan.
${$ban} Pada <b>{warnLimit}</b> peringatan → <b>blokir permanen</b></blockquote>`,

    adCheatBan: `${$ban} <b>Akun Diblokir Permanen</b>
<code>${SEP}</code>
<blockquote>Batas pelanggaran yang diizinkan telah terlampaui.
Keputusan ini <b>tidak dapat diubah</b>.</blockquote>
<code>${LINE}</code>
${$inbox} Hubungi dukungan jika Anda yakin ini kesalahan.`,

    adAlreadyPending: `${$hourglass} <b>Iklan sedang berjalan</b> — selesaikan sebelum memulai yang baru.`,
    adsLimit: `${$check} <b>Semua {max} iklan hari ini sudah ditonton!</b>
<code>${SEP}</code>
${$wallet} Saldo: <b>$ {balance}</b>
${$moon} Sampai <b>besok</b>!`,

    channelRequired: `${$lock} <b>Bergabung ke Channel Wajib Dulu</b>
<code>${SEP}</code>
Anda harus bergabung ke <b>semua</b> channel untuk mulai:

{channels}
<code>${LINE}</code>
${$check} Setelah bergabung, tekan <b>Sudah Bergabung Semua</b>.`,

    joinedVerify:      "✅ Sudah Bergabung Semua",
    channelNotJoined:  "❌ Belum bergabung — silakan bergabung dulu.",
    channelJoinReward: `${$party} Berhasil bergabung! <b>+\${reward}</b> dikreditkan.`,

    profileMsg: `${$user} <b>PROFIL SAYA</b>
<code>${SEP}</code>
${$idcard} <i>ID Pengguna:</i>   <code>{id}</code>
${$user} <i>Nama:</i>          <b>{name}</b>
${$globe} <i>Bahasa:</i>        {lang}
<code>${LINE}</code>
${$wallet} <i>Saldo:</i>           <b>$ {balance}</b>
${$up} <i>Total Diperoleh:</i> <b>$ {totalEarned}</b>
<code>${LINE}</code>
${$chart} <i>Iklan Hari Ini:</i> <b>{adsToday} / {maxAds}</b>
${$people} <i>Referral:</i>       <b>{referrals}</b>
${$warn} <i>Peringatan:</i>     <b>{warnings} / {warnLimit}</b>
${$cal} <i>Bergabung:</i>      <b>{joined}</b> <i>({days} hari)</i>
<code>${LINE}</code>
<blockquote>📜 <b>ATURAN</b>
▸ Maks <b>{maxAds}</b> iklan per hari
▸ Dilarang menggunakan bot atau kecurangan
▸ Minimum penarikan <b>$ {minWd}</b>
▸ <b>{warnLimit}</b> pelanggaran = blokir permanen
▸ Satu akun per orang</blockquote>`,

    referralMsg: `${$people} <b>PROGRAM REFERRAL</b>
<code>${SEP}</code>
${$shine} Ajak teman — dapatkan <b>$ {refReward}</b> per orang!
<code>${LINE}</code>
${$people} <i>Total Referral:</i>   <b>{count}</b>
${$money} <i>Penghasilan Ref:</i>  <b>$ {earned}</b>
<code>${LINE}</code>
${$link} <b>Link Referral Anda:</b>
<code>{link}</code>
<code>${LINE}</code>
${$share} <i>Bagikan link — dapatkan penghasilan instan!</i>`,

    shareLink: "📨 Bagikan Link",

    dailyTaskMsg: `${$clip} <b>TUGAS HARIAN</b>
<code>${SEP}</code>
${$sparkle} Selesaikan semua tugas — buka bonus Anda!
${$refresh} Direset setiap tengah malam
<code>${LINE}</code>
{tasks}
<code>${LINE}</code>
${$check} Progress: <b>{done} / {total}</b>
${$gift} Bonus Harian: <b>$ {bonus}</b>`,

    taskWatchAds:   `${$tv} Tonton <b>{threshold}</b> iklan hari ini  →  <b>+$ {reward}</b>`,
    taskShare:      `${$share} Bagikan bot ke 1 teman  →  <b>+$ {reward}</b>`,
    taskChannel:    `${$mega} Bergabung: <b>{name}</b>  →  <b>+$ {reward}</b>`,
    taskReferral:   `${$people} Ajak 1 pengguna baru  →  <b>+$ {reward}</b>`,
    taskDonePrefix:    "✅ ",
    taskPendingPrefix: "⬜ ",
    claimBonus:     "🎁 Klaim Bonus Harian",
    bonusClaimed: `${$gift} <b>Bonus Harian Diklaim!</b>
<code>${SEP}</code>
${$money} Bonus: <b>+$ {bonus}</b>
${$wallet} Saldo Baru: <b>$ {balance}</b>`,

    alreadyClaimed:   `${$check} Bonus hari ini sudah diklaim!`,
    tasksNotComplete: `${$warn} Selesaikan semua tugas dulu!`,
    taskShareBtn:     "📨 Bagikan Bot",
    taskVerifyBtn:    "✅ Verifikasi",

    withdrawMsg: `${$cashfly} <b>PENARIKAN</b>
<code>${SEP}</code>
${$wallet} Saldo:   <b>$ {balance}</b>
${$warn} Minimum: <b>$ {minWd}</b>
<code>${LINE}</code>
${$phone} <b>Pilih metode pembayaran:</b>`,

    withdrawLow: `${$cross} <b>Saldo Tidak Cukup</b>
<code>${SEP}</code>
Butuh minimal <b>$ {minWd}</b> untuk menarik.
${$wallet} <i>Saldo Anda:</i> <b>$ {balance}</b>`,

    withdrawAddress:  `${$note} Masukkan nomor <b>{method}</b> atau alamat dompet Anda:`,
    enterWalletAddress: `${$note} Masukkan alamat dompet <b>{method}</b> Anda:\n<code>${LINE}</code>\n${$zap} <i>Contoh:</i> <code>{example}</code>`,
    withdrawConfirm: `${$check} <b>Permintaan Penarikan Diajukan!</b>
<code>${SEP}</code>
${$dollar} Jumlah:  <b>$ {amount}</b>
${$bank} Metode:  <b>{method}</b>
${$mailbox} Alamat:  <code>{address}</code>
<code>${LINE}</code>
${$clock} Pembayaran dalam <b>24 jam</b>.`,

    withdrawPending: `${$hourglass} Sudah ada <b>permintaan penarikan tertunda</b>.`,
    withdrawSelect:  "Pilih metode:",

    banned: `${$ban} <b>Akun Diblokir</b>
<code>${SEP}</code>
<blockquote>Akun Anda diblokir karena melanggar ketentuan.</blockquote>
<code>${LINE}</code>
${$inbox} Hubungi dukungan jika Anda yakin ini kesalahan.`,

    startFirst: `${$warn} Kirim /start untuk memulai.`,
    unknownCmd: `Gunakan tombol menu di bawah untuk navigasi. 👇`,
    ageCmd: `🎂 <b>Kalkulator Usia</b>
<code>${SEP}</code>
📅 Kirim tanggal lahir dalam format ini:
<code>/age DD/MM/YYYY</code>
<code>${LINE}</code>
Contoh: <code>/age 15/03/1995</code>`,
    ageResult: `🎂 <b>Kalkulator Usia</b>
<code>${SEP}</code>
📅 Tanggal Lahir: <b>{date}</b>
<code>${LINE}</code>
🔢 Usia: <b>{years} tahun, {months} bulan, {days} hari</b>
🌟 Total hari hidup: <b>{totalDays}</b>
<code>${LINE}</code>
🎉 <i>Terus bertumbuh!</i>`,
    ageInvalid: `❌ <b>Format tanggal tidak valid!</b>
Gunakan: <code>/age DD/MM/YYYY</code>
Contoh: <code>/age 15/03/1995</code>`,
    changeNameBtn: "✏️ Ganti Nama",
    enterNameMsg: `✏️ <b>GANTI NAMA</b>
<code>━━━━━━━━━━━━━━━━━━━━━━━━━</code>
📝 Ketik nama baru Anda di bawah:
<code>─────────────────────────</code>
<i>Maks. 64 karakter. Nama ini akan muncul di profil Anda.</i>`,
    helpMsg: `🤖 <b>PANDUAN BOT</b>
<code>━━━━━━━━━━━━━━━━━━━━━━━━━</code>
/start — Mulai atau restart bot
/age DD/MM/YYYY — Hitung usia
/leaderboard — 10 penghasil teratas
/stats — Statistik bot
/help — Panel bantuan ini
<code>─────────────────────────</code>
⚡ <i>Tekan tombol menu untuk mulai!</i>`,
    statsMsg: `📊 <b>STATISTIK BOT</b>
<code>━━━━━━━━━━━━━━━━━━━━━━━━━</code>
👥 Total Pengguna:   <b>{users}</b>
💰 Total Dibayar:    <b>$ {totalPaid}</b>
📺 Total Iklan:      <b>{totalAds}</b>
🏆 Penghasil Teratas: <b>$ {topEarner}</b>`,
    leaderboardTitle: `🏆 <b>PAPAN PERINGKAT</b>
<code>━━━━━━━━━━━━━━━━━━━━━━━━━</code>
{entries}
<code>─────────────────────────</code>
💪 <i>Terus hasilkan, naiki peringkat!</i>`,
    leaderboardEntry: `{medal} <b>{rank}.</b> {name}  —  <b>$ {earned}</b>`,
    leaderboardEmpty: `🏆 <b>PAPAN PERINGKAT</b>
<i>Belum ada data. Jadilah yang pertama!</i>`,
    supportMsg: `🛟 <b>PUSAT BANTUAN</b>
📩 Jelaskan masalah Anda secara detail.
⏱ Waktu respons: <b>24 jam</b>`,
    profileBtn: "👤 Profil Saya",
    earnBtn: "💰 Hasilkan",
    withdrawalBtn: "💸 Tarik Dana",
    referralBtn: "👥 Refer",
    adultBtn2: "🔞 Dewasa",
    movieSeriesBtn: "🎬 Film-Series",
    setWalletBtn: "💳 Atur Dompet",
    changeLangBtn: "🌐 Ganti Bahasa",
    watchAdsBtn: "📺 Tonton Iklan",
    dailyTasksBtn: "📋 Tugas Harian",
    confirmBtn: "✅ Konfirmasi",
    changeMethodBtn: "🔄 Ganti Metode",
    cancelBtn: "❌ Batal",
    mainMenuBtn: "🏠 Menu Utama",
    backBtn: "⬅️ Kembali",
    confirmWalletMsg: `${$check} <b>Konfirmasi Simpan Dompet</b>\n<code>${SEP}</code>\n💳 Metode: <b>{method}</b>\n${$mailbox} Alamat: <code>{address}</code>`,
    confirmWdMsg: `${$check} <b>Konfirmasi Penarikan</b>\n<code>${SEP}</code>\n💳 Metode: <b>{method}</b>\n${$mailbox} Alamat: <code>{address}</code>\n${$dollar} Jumlah: <b>$ {balance}</b>`,
    walletUpdated: `${$check} <b>Dompet Diperbarui!</b>\n<code>${SEP}</code>\n💳 Metode: <b>{method}</b>\n${$mailbox} Alamat: <code>{address}</code>`,
    updateWalletMsg: `💳 <b>Perbarui Dompet</b>\n<code>${SEP}</code>\n${$phone} Pilih metode pembayaran:`,
    nameUpdated: `${$check} <b>Nama Diperbarui!</b>\n<code>${SEP}</code>\n${$user} Nama baru: <b>{name}</b>`,
    earnCategoryMsg: `${$money} <b>Pusat Penghasilan</b>\n<code>${SEP}</code>\n${$rocket} Pilih cara menghasilkan:\n<code>${LINE}</code>\n${$tv} <b>Tonton Iklan</b>  —  +$0.01 per iklan\n${$clip} <b>Tugas Harian</b>  —  bonus saat selesai\n${$people} <b>Referral</b>  —  hasilkan per teman\n<code>${LINE}</code>\n${$zap} <i>Semua penghasilan instan</i>`,
  },

  // ─────────────────────────── FRENCH ─────────────────────────────
  fr: {
    earn:      "💰 Gagner",
    profile:   "👤 Profil",
    dailyTask: "📋 Tâches",
    referral:  "👥 Parrainage",
    withdraw:  "💸 Retrait",
    language:  "🌐 Langue",
    adultBot:  "🔞 Adult",
    movieBot:  "🎬 Films",
    rules:     "📜 Règles",

    welcome: `🌐 <b>SELECT YOUR LANGUAGE / ভাষা নির্বাচন করুন</b>\n<code>${SEP}</code>\n🌍 Please select your preferred language to continue:\n<code>${LINE}</code>\n<blockquote>Tap your language below 👇</blockquote>`,

    langSet:    `${$check} <b>Langue définie sur Français!</b>`,
    menuMsg:    `🚀 <b>CineVault Global Rewards</b>\n<code>${SEP}</code>\n👤 Utilisateur: <b>{name}</b>\n🆔 ID du compte: <code>{id}</code>\n💵 Solde principal: <b>$ {balance}</b> USD\n👥 Total parrainages: <b>{refs}</b>\n<code>${LINE}</code>\n<blockquote>⚡ Regardez des pubs quotidiennes, réclamez des bonus ou visitez la Zone Vidéo!</blockquote>\n🎯 Appuyez sur un bouton pour commencer 👇`,
    selectLang: `🌐 <b>SELECT YOUR LANGUAGE / ভাষা নির্বাচন করুন</b>\n<code>${SEP}</code>\n🌍 Please select your preferred language to continue:`,

    earnMsg: `${$money} <b>CENTRE DE GAINS</b>
<code>${SEP}</code>
${$chart} <b>Progression:</b>  <code>{bar}</code>  <b>{watched} / {max}</b>
<code>${LINE}</code>
${$dollar} <i>Gagné aujourd'hui:</i>  <b>$ {todayEarned}</b>
${$wallet} <i>Votre solde:</i>        <b>$ {balance}</b>
${$zap} Par pub: <b>$0.01</b>  ·  <b>{remaining}</b> restantes
<code>${LINE}</code>`,

    earnDone: `${$check} <b>Toutes les pubs du jour regardées!</b>
<code>${SEP}</code>
${$party} Bravo! Vous avez regardé les <b>{max}</b> pubs.
${$wallet} <i>Solde actuel:</i> <b>$ {balance}</b>
<code>${LINE}</code>
${$moon} Revenez <b>demain</b> pour plus!`,

    watchAd: "📺 Regarder la pub  (+$0.01)",
    refresh:  "🔄 Actualiser le solde",

    adStarted: `${$tv} <b>Pub prête — Regardez maintenant!</b>
<code>${SEP}</code>
${$clock} Regardez au moins <b>10 secondes</b>
${$check} Puis appuyez sur <b>J'ai regardé</b>
<code>${LINE}</code>
<blockquote>${$warn} Trop rapide = <b>Avertissement émis</b>
${$lock} Token unique — <b>utilisation unique</b></blockquote>`,

    watchNow:   "▶️ Ouvrir la pub",
    adVerify:   "✅ J'ai regardé",
    adComplete: `${$check} <b>+$0.01 crédité avec succès!</b>
<code>${SEP}</code>
${$wallet} Solde: <b>$ {balance}</b>
${$chart} Aujourd'hui: <b>{watched} / {max}</b> pubs
<code>${LINE}</code>
${$fire} <i>Continuez — chaque pub compte!</i>`,

    adFailed: `${$warn} <b>Trop rapide — Vérification échouée!</b>
<code>${SEP}</code>
Vous devez regarder la pub <b>entière</b> avant de vérifier.
<code>${LINE}</code>
<blockquote>${$warn} Avertissement <b>{warnCount} / {warnLimit}</b> émis.
${$ban} À <b>{warnLimit}</b> avertissements → <b>bannissement permanent</b></blockquote>`,

    adCheatBan: `${$ban} <b>Compte Banni Définitivement</b>
<code>${SEP}</code>
<blockquote>Vous avez dépassé la limite de violations autorisée.
Cette décision est <b>irrévocable</b>.</blockquote>
<code>${LINE}</code>
${$inbox} Contactez le support si vous pensez que c'est une erreur.`,

    adAlreadyPending: `${$hourglass} <b>Pub en cours</b> — terminez-la avant d'en démarrer une nouvelle.`,
    adsLimit: `${$check} <b>Toutes les {max} pubs regardées!</b>
<code>${SEP}</code>
${$wallet} Solde: <b>$ {balance}</b>
${$moon} À <b>demain</b>!`,

    channelRequired: `${$lock} <b>Rejoignez d'abord les chaînes requises</b>
<code>${SEP}</code>
Vous devez rejoindre <b>toutes</b> les chaînes pour commencer:

{channels}
<code>${LINE}</code>
${$check} Après avoir rejoint, appuyez sur <b>J'ai tout rejoint</b>.`,

    joinedVerify:      "✅ J'ai tout rejoint",
    channelNotJoined:  "❌ Pas encore rejoint — rejoignez d'abord.",
    channelJoinReward: `${$party} Chaîne rejointe! <b>+\${reward}</b> crédité.`,

    profileMsg: `${$user} <b>MON PROFIL</b>
<code>${SEP}</code>
${$idcard} <i>ID utilisateur:</i>  <code>{id}</code>
${$user} <i>Nom:</i>             <b>{name}</b>
${$globe} <i>Langue:</i>          {lang}
<code>${LINE}</code>
${$wallet} <i>Solde:</i>              <b>$ {balance}</b>
${$up} <i>Total gagné:</i>       <b>$ {totalEarned}</b>
<code>${LINE}</code>
${$chart} <i>Pubs aujourd'hui:</i> <b>{adsToday} / {maxAds}</b>
${$people} <i>Parrainages:</i>      <b>{referrals}</b>
${$warn} <i>Avertissements:</i>   <b>{warnings} / {warnLimit}</b>
${$cal} <i>Inscrit le:</i>       <b>{joined}</b> <i>({days} jours)</i>
<code>${LINE}</code>
<blockquote>📜 <b>RÈGLES</b>
▸ Max <b>{maxAds}</b> pubs par jour
▸ Bots et triche interdits
▸ Retrait minimum: <b>$ {minWd}</b>
▸ <b>{warnLimit}</b> violations = bannissement permanent
▸ Un compte par personne</blockquote>`,

    referralMsg: `${$people} <b>PROGRAMME DE PARRAINAGE</b>
<code>${SEP}</code>
${$shine} Invitez des amis — gagnez <b>$ {refReward}</b> par personne!
<code>${LINE}</code>
${$people} <i>Total parrainages:</i>  <b>{count}</b>
${$money} <i>Gains parrainage:</i>   <b>$ {earned}</b>
<code>${LINE}</code>
${$link} <b>Votre lien de parrainage:</b>
<code>{link}</code>
<code>${LINE}</code>
${$share} <i>Partagez le lien — gagnez instantanément!</i>`,

    shareLink: "📨 Partager le lien",

    dailyTaskMsg: `${$clip} <b>TÂCHES QUOTIDIENNES</b>
<code>${SEP}</code>
${$sparkle} Complétez toutes les tâches — débloquez votre bonus!
${$refresh} Réinitialisé chaque minuit
<code>${LINE}</code>
{tasks}
<code>${LINE}</code>
${$check} Progression: <b>{done} / {total}</b>
${$gift} Bonus quotidien: <b>$ {bonus}</b>`,

    taskWatchAds:   `${$tv} Regardez <b>{threshold}</b> pubs aujourd'hui  →  <b>+$ {reward}</b>`,
    taskShare:      `${$share} Partagez le bot avec 1 ami  →  <b>+$ {reward}</b>`,
    taskChannel:    `${$mega} Rejoignez: <b>{name}</b>  →  <b>+$ {reward}</b>`,
    taskReferral:   `${$people} Amenez 1 nouvel utilisateur  →  <b>+$ {reward}</b>`,
    taskDonePrefix:    "✅ ",
    taskPendingPrefix: "⬜ ",
    claimBonus:     "🎁 Récupérer le bonus quotidien",
    bonusClaimed: `${$gift} <b>Bonus quotidien récupéré!</b>
<code>${SEP}</code>
${$money} Bonus: <b>+$ {bonus}</b>
${$wallet} Nouveau solde: <b>$ {balance}</b>`,

    alreadyClaimed:   `${$check} Le bonus du jour a déjà été récupéré!`,
    tasksNotComplete: `${$warn} Complétez d'abord toutes les tâches!`,
    taskShareBtn:     "📨 Partager le bot",
    taskVerifyBtn:    "✅ Vérifier",

    withdrawMsg: `${$cashfly} <b>RETRAIT</b>
<code>${SEP}</code>
${$wallet} Solde:   <b>$ {balance}</b>
${$warn} Minimum: <b>$ {minWd}</b>
<code>${LINE}</code>
${$phone} <b>Choisissez votre mode de paiement:</b>`,

    withdrawLow: `${$cross} <b>Solde Insuffisant</b>
<code>${SEP}</code>
Il faut au moins <b>$ {minWd}</b> pour retirer.
${$wallet} <i>Votre solde:</i> <b>$ {balance}</b>`,

    withdrawAddress:  `${$note} Entrez votre numéro <b>{method}</b> ou adresse de portefeuille:`,
    enterWalletAddress: `${$note} Entrez votre adresse <b>{method}</b>:\n<code>${LINE}</code>\n${$zap} <i>Exemple:</i> <code>{example}</code>`,
    withdrawConfirm: `${$check} <b>Demande de retrait soumise!</b>
<code>${SEP}</code>
${$dollar} Montant:  <b>$ {amount}</b>
${$bank} Méthode:  <b>{method}</b>
${$mailbox} Adresse:  <code>{address}</code>
<code>${LINE}</code>
${$clock} Paiement traité dans <b>24 heures</b>.`,

    withdrawPending: `${$hourglass} Vous avez déjà un <b>retrait en attente</b>. Patientez.`,
    withdrawSelect:  "Choisissez la méthode:",

    banned: `${$ban} <b>Compte Banni</b>
<code>${SEP}</code>
<blockquote>Votre compte a été banni pour violation des règles.</blockquote>
<code>${LINE}</code>
${$inbox} Contactez le support si vous pensez que c'est une erreur.`,

    startFirst: `${$warn} Veuillez envoyer /start pour commencer.`,
    unknownCmd: `Utilisez les boutons du menu pour naviguer. 👇`,
    ageCmd: `🎂 <b>Calculateur d'âge</b>
<code>${SEP}</code>
📅 Envoyez votre date de naissance dans ce format:
<code>/age DD/MM/YYYY</code>
<code>${LINE}</code>
Exemple: <code>/age 15/03/1995</code>`,
    ageResult: `🎂 <b>Calculateur d'âge</b>
<code>${SEP}</code>
📅 Date de naissance: <b>{date}</b>
<code>${LINE}</code>
🔢 Âge: <b>{years} ans, {months} mois, {days} jours</b>
🌟 Total jours vécus: <b>{totalDays}</b>
<code>${LINE}</code>
🎉 <i>Continuez à grandir!</i>`,
    ageInvalid: `❌ <b>Format de date invalide!</b>
Utilisez: <code>/age DD/MM/YYYY</code>
Exemple: <code>/age 15/03/1995</code>`,
    changeNameBtn: "✏️ Changer le nom",
    enterNameMsg: `✏️ <b>CHANGER LE NOM</b>
<code>━━━━━━━━━━━━━━━━━━━━━━━━━</code>
📝 Tapez votre nouveau nom ci-dessous:
<code>─────────────────────────</code>
<i>Max. 64 caractères. Ce nom apparaîtra dans votre profil.</i>`,
    helpMsg: `🤖 <b>COMMANDES DU BOT</b>
<code>━━━━━━━━━━━━━━━━━━━━━━━━━</code>
/start — Démarrer le bot
/age DD/MM/YYYY — Calculer l'âge
/leaderboard — Top 10 gagnants
/stats — Statistiques du bot
/help — Ce panneau d'aide
<code>─────────────────────────</code>
⚡ <i>Appuyez sur un bouton pour commencer!</i>`,
    statsMsg: `📊 <b>STATISTIQUES DU BOT</b>
<code>━━━━━━━━━━━━━━━━━━━━━━━━━</code>
👥 Total Utilisateurs: <b>{users}</b>
💰 Total Payé:         <b>$ {totalPaid}</b>
📺 Total Publicités:   <b>{totalAds}</b>
🏆 Meilleur Gain:      <b>$ {topEarner}</b>`,
    leaderboardTitle: `🏆 <b>TABLEAU DES LEADERS</b>
<code>━━━━━━━━━━━━━━━━━━━━━━━━━</code>
{entries}
<code>─────────────────────────</code>
💪 <i>Continuez à gagner pour monter dans le classement!</i>`,
    leaderboardEntry: `{medal} <b>{rank}.</b> {name}  —  <b>$ {earned}</b>`,
    leaderboardEmpty: `🏆 <b>TABLEAU DES LEADERS</b>
<i>Pas encore de données. Soyez le premier!</i>`,
    supportMsg: `🛟 <b>CENTRE DE SUPPORT</b>
📩 Décrivez votre problème en détail.
⏱ Temps de réponse: <b>24 heures</b>`,
    profileBtn: "👤 Mon profil",
    earnBtn: "💰 Gagner",
    withdrawalBtn: "💸 Retrait",
    referralBtn: "👥 Parrainer",
    adultBtn2: "🔞 Adulte",
    movieSeriesBtn: "🎬 Films-Séries",
    setWalletBtn: "💳 Configurer le portefeuille",
    changeLangBtn: "🌐 Changer la langue",
    watchAdsBtn: "📺 Regarder des pubs",
    dailyTasksBtn: "📋 Tâches quotidiennes",
    confirmBtn: "✅ Confirmer",
    changeMethodBtn: "🔄 Changer de méthode",
    cancelBtn: "❌ Annuler",
    mainMenuBtn: "🏠 Menu principal",
    backBtn: "⬅️ Retour",
    confirmWalletMsg: `${$check} <b>Confirmer la sauvegarde du portefeuille</b>\n<code>${SEP}</code>\n💳 Méthode: <b>{method}</b>\n${$mailbox} Adresse: <code>{address}</code>`,
    confirmWdMsg: `${$check} <b>Confirmer le retrait</b>\n<code>${SEP}</code>\n💳 Méthode: <b>{method}</b>\n${$mailbox} Adresse: <code>{address}</code>\n${$dollar} Montant: <b>$ {balance}</b>`,
    walletUpdated: `${$check} <b>Portefeuille mis à jour!</b>\n<code>${SEP}</code>\n💳 Méthode: <b>{method}</b>\n${$mailbox} Adresse: <code>{address}</code>`,
    updateWalletMsg: `💳 <b>Mettre à jour le portefeuille</b>\n<code>${SEP}</code>\n${$phone} Choisissez votre mode de paiement:`,
    nameUpdated: `${$check} <b>Nom mis à jour!</b>\n<code>${SEP}</code>\n${$user} Nouveau nom: <b>{name}</b>`,
    earnCategoryMsg: `${$money} <b>CENTRE DE GAINS</b>\n<code>${SEP}</code>\n${$rocket} Choisissez comment gagner:\n<code>${LINE}</code>\n${$tv} <b>Regarder des pubs</b>  —  +$0.01 par pub\n${$clip} <b>Tâches quotidiennes</b>  —  bonus à la complétion\n${$people} <b>Parrainage</b>  —  gagnez par ami\n<code>${LINE}</code>\n${$zap} <i>Tous les gains sont instantanés</i>`,
  },

  // ─────────────────────────── SPANISH ─────────────────────────────
  es: {
    earn:      "💰 Ganar",
    profile:   "👤 Perfil",
    dailyTask: "📋 Tareas",
    referral:  "👥 Referidos",
    withdraw:  "💸 Retirar",
    language:  "🌐 Idioma",
    adultBot:  "🔞 Adult",
    movieBot:  "🎬 Películas",
    rules:     "📜 Reglas",

    welcome: `🌐 <b>SELECT YOUR LANGUAGE / ভাষা নির্বাচন করুন</b>\n<code>${SEP}</code>\n🌍 Please select your preferred language to continue:\n<code>${LINE}</code>\n<blockquote>Tap your language below 👇</blockquote>`,

    langSet:    `${$check} <b>¡Idioma establecido en Español!</b>`,
    menuMsg:    `🚀 <b>CineVault Global Rewards</b>\n<code>${SEP}</code>\n👤 Usuario: <b>{name}</b>\n🆔 ID de cuenta: <code>{id}</code>\n💵 Balance principal: <b>$ {balance}</b> USD\n👥 Total referidos: <b>{refs}</b>\n<code>${LINE}</code>\n<blockquote>⚡ ¡Mira anuncios diarios, reclama bonos o visita la Zona de Videos!</blockquote>\n🎯 Toca un botón para comenzar 👇`,
    selectLang: `🌐 <b>SELECT YOUR LANGUAGE / ভাষা নির্বাচন করুন</b>\n<code>${SEP}</code>\n🌍 Please select your preferred language to continue:`,

    earnMsg: `${$money} <b>CENTRO DE GANANCIAS</b>
<code>${SEP}</code>
${$chart} <b>Progreso:</b>  <code>{bar}</code>  <b>{watched} / {max}</b>
<code>${LINE}</code>
${$dollar} <i>Ganado hoy:</i>   <b>$ {todayEarned}</b>
${$wallet} <i>Tu saldo:</i>     <b>$ {balance}</b>
${$zap} Por anuncio: <b>$0.01</b>  ·  <b>{remaining}</b> restantes
<code>${LINE}</code>`,

    earnDone: `${$check} <b>¡Todos los anuncios de hoy vistos!</b>
<code>${SEP}</code>
${$party} ¡Excelente! Viste todos los <b>{max}</b> anuncios.
${$wallet} <i>Saldo actual:</i> <b>$ {balance}</b>
<code>${LINE}</code>
${$moon} ¡Vuelve <b>mañana</b> para más!`,

    watchAd: "📺 Ver Anuncio  (+$0.01)",
    refresh:  "🔄 Actualizar Saldo",

    adStarted: `${$tv} <b>¡Anuncio Listo — Mira Ahora!</b>
<code>${SEP}</code>
${$clock} Mira por al menos <b>10 segundos</b>
${$check} Luego presiona <b>Lo Ví</b>
<code>${LINE}</code>
<blockquote>${$warn} Presionar rápido = <b>Advertencia emitida</b>
${$lock} Token único — <b>solo un uso</b></blockquote>`,

    watchNow:   "▶️ Abrir Anuncio",
    adVerify:   "✅ Lo Ví",
    adComplete: `${$check} <b>¡+$0.01 acreditado con éxito!</b>
<code>${SEP}</code>
${$wallet} Saldo: <b>$ {balance}</b>
${$chart} Hoy: <b>{watched} / {max}</b> anuncios
<code>${LINE}</code>
${$fire} <i>¡Sigue adelante — cada anuncio cuenta!</i>`,

    adFailed: `${$warn} <b>¡Demasiado rápido — Verificación fallida!</b>
<code>${SEP}</code>
Debes ver el anuncio <b>completo</b> antes de verificar.
<code>${LINE}</code>
<blockquote>${$warn} Advertencia <b>{warnCount} / {warnLimit}</b> emitida.
${$ban} Con <b>{warnLimit}</b> advertencias → <b>ban permanente</b></blockquote>`,

    adCheatBan: `${$ban} <b>Cuenta Permanentemente Bloqueada</b>
<code>${SEP}</code>
<blockquote>Superaste el límite de violaciones permitidas.
Esta decisión es <b>irrevocable</b>.</blockquote>
<code>${LINE}</code>
${$inbox} Contacta al soporte si crees que es un error.`,

    adAlreadyPending: `${$hourglass} <b>Anuncio en progreso</b> — complétalo antes de iniciar uno nuevo.`,
    adsLimit: `${$check} <b>¡Todos los {max} anuncios vistos hoy!</b>
<code>${SEP}</code>
${$wallet} Saldo: <b>$ {balance}</b>
${$moon} ¡Hasta <b>mañana</b>!`,

    channelRequired: `${$lock} <b>Únete Primero a los Canales Requeridos</b>
<code>${SEP}</code>
Debes unirte a <b>todos</b> los canales para comenzar:

{channels}
<code>${LINE}</code>
${$check} Después de unirte, presiona <b>Me Uní a Todos</b>.`,

    joinedVerify:      "✅ Me Uní a Todos",
    channelNotJoined:  "❌ No te has unido aún — únete primero.",
    channelJoinReward: `${$party} ¡Canal unido! <b>+\${reward}</b> acreditado.`,

    profileMsg: `${$user} <b>MI PERFIL</b>
<code>${SEP}</code>
${$idcard} <i>ID de usuario:</i>  <code>{id}</code>
${$user} <i>Nombre:</i>         <b>{name}</b>
${$globe} <i>Idioma:</i>         {lang}
<code>${LINE}</code>
${$wallet} <i>Saldo:</i>             <b>$ {balance}</b>
${$up} <i>Total ganado:</i>     <b>$ {totalEarned}</b>
<code>${LINE}</code>
${$chart} <i>Anuncios hoy:</i>  <b>{adsToday} / {maxAds}</b>
${$people} <i>Referidos:</i>     <b>{referrals}</b>
${$warn} <i>Advertencias:</i>   <b>{warnings} / {warnLimit}</b>
${$cal} <i>Registrado:</i>     <b>{joined}</b> <i>({days} días)</i>
<code>${LINE}</code>
<blockquote>📜 <b>REGLAS</b>
▸ Máx <b>{maxAds}</b> anuncios por día
▸ Prohibido bots o trampa
▸ Retiro mínimo: <b>$ {minWd}</b>
▸ <b>{warnLimit}</b> violaciones = ban permanente
▸ Una cuenta por persona</blockquote>`,

    referralMsg: `${$people} <b>PROGRAMA DE REFERIDOS</b>
<code>${SEP}</code>
${$shine} Invita amigos — gana <b>$ {refReward}</b> por persona!
<code>${LINE}</code>
${$people} <i>Total referidos:</i>  <b>{count}</b>
${$money} <i>Ganancias ref:</i>    <b>$ {earned}</b>
<code>${LINE}</code>
${$link} <b>Tu enlace de referido:</b>
<code>{link}</code>
<code>${LINE}</code>
${$share} <i>¡Comparte el enlace — gana al instante!</i>`,

    shareLink: "📨 Compartir Enlace",

    dailyTaskMsg: `${$clip} <b>TAREAS DIARIAS</b>
<code>${SEP}</code>
${$sparkle} ¡Completa todas las tareas — desbloquea tu bono!
${$refresh} Se reinicia cada medianoche
<code>${LINE}</code>
{tasks}
<code>${LINE}</code>
${$check} Progreso: <b>{done} / {total}</b>
${$gift} Bono diario: <b>$ {bonus}</b>`,

    taskWatchAds:   `${$tv} Ve <b>{threshold}</b> anuncios hoy  →  <b>+$ {reward}</b>`,
    taskShare:      `${$share} Comparte el bot con 1 amigo  →  <b>+$ {reward}</b>`,
    taskChannel:    `${$mega} Únete: <b>{name}</b>  →  <b>+$ {reward}</b>`,
    taskReferral:   `${$people} Trae 1 nuevo usuario  →  <b>+$ {reward}</b>`,
    taskDonePrefix:    "✅ ",
    taskPendingPrefix: "⬜ ",
    claimBonus:     "🎁 Reclamar Bono Diario",
    bonusClaimed: `${$gift} <b>¡Bono Diario Reclamado!</b>
<code>${SEP}</code>
${$money} Bono: <b>+$ {bonus}</b>
${$wallet} Nuevo saldo: <b>$ {balance}</b>`,

    alreadyClaimed:   `${$check} ¡El bono de hoy ya fue reclamado!`,
    tasksNotComplete: `${$warn} ¡Completa todas las tareas primero!`,
    taskShareBtn:     "📨 Compartir Bot",
    taskVerifyBtn:    "✅ Verificar",

    withdrawMsg: `${$cashfly} <b>RETIRO</b>
<code>${SEP}</code>
${$wallet} Saldo:   <b>$ {balance}</b>
${$warn} Mínimo: <b>$ {minWd}</b>
<code>${LINE}</code>
${$phone} <b>Selecciona método de pago:</b>`,

    withdrawLow: `${$cross} <b>Saldo Insuficiente</b>
<code>${SEP}</code>
Necesitas al menos <b>$ {minWd}</b> para retirar.
${$wallet} <i>Tu saldo:</i> <b>$ {balance}</b>`,

    withdrawAddress:  `${$note} Ingresa tu número de <b>{method}</b> o dirección de billetera:`,
    enterWalletAddress: `${$note} Ingresa tu dirección de <b>{method}</b>:\n<code>${LINE}</code>\n${$zap} <i>Ejemplo:</i> <code>{example}</code>`,
    withdrawConfirm: `${$check} <b>¡Solicitud de retiro enviada!</b>
<code>${SEP}</code>
${$dollar} Monto:    <b>$ {amount}</b>
${$bank} Método:   <b>{method}</b>
${$mailbox} Dirección: <code>{address}</code>
<code>${LINE}</code>
${$clock} Pago procesado en <b>24 horas</b>.`,

    withdrawPending: `${$hourglass} Ya tienes un <b>retiro pendiente</b>. Por favor espera.`,
    withdrawSelect:  "Selecciona el método:",

    banned: `${$ban} <b>Cuenta Bloqueada</b>
<code>${SEP}</code>
<blockquote>Tu cuenta ha sido bloqueada por violar las reglas.</blockquote>
<code>${LINE}</code>
${$inbox} Contacta al soporte si crees que es un error.`,

    startFirst: `${$warn} Por favor envía /start para comenzar.`,
    unknownCmd: `Usa los botones del menú para navegar. 👇`,
    ageCmd: `🎂 <b>Calculadora de Edad</b>
<code>${SEP}</code>
📅 Envía tu fecha de nacimiento en este formato:
<code>/age DD/MM/YYYY</code>
<code>${LINE}</code>
Ejemplo: <code>/age 15/03/1995</code>`,
    ageResult: `🎂 <b>Calculadora de Edad</b>
<code>${SEP}</code>
📅 Fecha de nacimiento: <b>{date}</b>
<code>${LINE}</code>
🔢 Edad: <b>{years} años, {months} meses, {days} días</b>
🌟 Total días vividos: <b>{totalDays}</b>
<code>${LINE}</code>
🎉 <i>¡Sigue creciendo!</i>`,
    ageInvalid: `❌ <b>¡Formato de fecha inválido!</b>
Usa: <code>/age DD/MM/YYYY</code>
Ejemplo: <code>/age 15/03/1995</code>`,
    changeNameBtn: "✏️ Cambiar nombre",
    enterNameMsg: `✏️ <b>CAMBIAR NOMBRE</b>
<code>━━━━━━━━━━━━━━━━━━━━━━━━━</code>
📝 Escribe tu nuevo nombre abajo:
<code>─────────────────────────</code>
<i>Máx. 64 caracteres. Este nombre aparecerá en tu perfil.</i>`,
    helpMsg: `🤖 <b>COMANDOS DEL BOT</b>
<code>━━━━━━━━━━━━━━━━━━━━━━━━━</code>
/start — Iniciar el bot
/age DD/MM/YYYY — Calcular edad
/leaderboard — Top 10 ganadores
/stats — Estadísticas del bot
/help — Este panel de ayuda
<code>─────────────────────────</code>
⚡ <i>¡Pulsa un botón del menú para empezar!</i>`,
    statsMsg: `📊 <b>ESTADÍSTICAS DEL BOT</b>
<code>━━━━━━━━━━━━━━━━━━━━━━━━━</code>
👥 Total Usuarios:    <b>{users}</b>
💰 Total Pagado:      <b>$ {totalPaid}</b>
📺 Total Anuncios:    <b>{totalAds}</b>
🏆 Mayor Ganancia:    <b>$ {topEarner}</b>`,
    leaderboardTitle: `🏆 <b>TABLA DE LÍDERES</b>
<code>━━━━━━━━━━━━━━━━━━━━━━━━━</code>
{entries}
<code>─────────────────────────</code>
💪 <i>¡Sigue ganando para subir en el ranking!</i>`,
    leaderboardEntry: `{medal} <b>{rank}.</b> {name}  —  <b>$ {earned}</b>`,
    leaderboardEmpty: `🏆 <b>TABLA DE LÍDERES</b>
<i>Aún no hay datos. ¡Sé el primero!</i>`,
    supportMsg: `🛟 <b>CENTRO DE SOPORTE</b>
📩 Describe tu problema en detalle.
⏱ Tiempo de respuesta: <b>24 horas</b>`,
    profileBtn: "👤 Mi perfil",
    earnBtn: "💰 Ganar",
    withdrawalBtn: "💸 Retirar",
    referralBtn: "👥 Referir",
    adultBtn2: "🔞 Adulto",
    movieSeriesBtn: "🎬 Películas-Series",
    setWalletBtn: "💳 Configurar billetera",
    changeLangBtn: "🌐 Cambiar idioma",
    watchAdsBtn: "📺 Ver anuncios",
    dailyTasksBtn: "📋 Tareas diarias",
    confirmBtn: "✅ Confirmar",
    changeMethodBtn: "🔄 Cambiar método",
    cancelBtn: "❌ Cancelar",
    mainMenuBtn: "🏠 Menú principal",
    backBtn: "⬅️ Volver",
    confirmWalletMsg: `${$check} <b>Confirmar guardar billetera</b>\n<code>${SEP}</code>\n💳 Método: <b>{method}</b>\n${$mailbox} Dirección: <code>{address}</code>`,
    confirmWdMsg: `${$check} <b>Confirmar retiro</b>\n<code>${SEP}</code>\n💳 Método: <b>{method}</b>\n${$mailbox} Dirección: <code>{address}</code>\n${$dollar} Monto: <b>$ {balance}</b>`,
    walletUpdated: `${$check} <b>¡Billetera actualizada!</b>\n<code>${SEP}</code>\n💳 Método: <b>{method}</b>\n${$mailbox} Dirección: <code>{address}</code>`,
    updateWalletMsg: `💳 <b>Actualizar billetera</b>\n<code>${SEP}</code>\n${$phone} Selecciona método de pago:`,
    nameUpdated: `${$check} <b>¡Nombre actualizado!</b>\n<code>${SEP}</code>\n${$user} Nuevo nombre: <b>{name}</b>`,
    earnCategoryMsg: `${$money} <b>CENTRO DE GANANCIAS</b>\n<code>${SEP}</code>\n${$rocket} Elige cómo ganar hoy:\n<code>${LINE}</code>\n${$tv} <b>Ver anuncios</b>  —  +$0.01 por anuncio\n${$clip} <b>Tareas diarias</b>  —  bono al completar\n${$people} <b>Referidos</b>  —  gana por amigo\n<code>${LINE}</code>\n${$zap} <i>Todas las ganancias son instantáneas</i>`,
  },

  // ─────────────────────────── PORTUGUESE ─────────────────────────
  pt: {
    earn:      "💰 Ganhar",
    profile:   "👤 Perfil",
    dailyTask: "📋 Tarefas",
    referral:  "👥 Indicações",
    withdraw:  "💸 Sacar",
    language:  "🌐 Idioma",
    adultBot:  "🔞 Adult",
    movieBot:  "🎬 Filmes",
    rules:     "📜 Regras",

    welcome: `🌐 <b>SELECT YOUR LANGUAGE / ভাষা নির্বাচন করুন</b>\n<code>${SEP}</code>\n🌍 Please select your preferred language to continue:\n<code>${LINE}</code>\n<blockquote>Tap your language below 👇</blockquote>`,

    langSet:    `${$check} <b>Idioma definido para Português!</b>`,
    menuMsg:    `🚀 <b>CineVault Global Rewards</b>\n<code>${SEP}</code>\n👤 Usuário: <b>{name}</b>\n🆔 ID da conta: <code>{id}</code>\n💵 Saldo principal: <b>$ {balance}</b> USD\n👥 Total de referências: <b>{refs}</b>\n<code>${LINE}</code>\n<blockquote>⚡ Assista anúncios diários, reivindique bônus ou visite a Zona de Vídeos!</blockquote>\n🎯 Toque em um botão para começar 👇`,
    selectLang: `🌐 <b>SELECT YOUR LANGUAGE / ভাষা নির্বাচন করুন</b>\n<code>${SEP}</code>\n🌍 Please select your preferred language to continue:`,

    earnMsg: `${$money} <b>CENTRO DE GANHOS</b>
<code>${SEP}</code>
${$chart} <b>Progresso:</b>  <code>{bar}</code>  <b>{watched} / {max}</b>
<code>${LINE}</code>
${$dollar} <i>Ganho hoje:</i>   <b>$ {todayEarned}</b>
${$wallet} <i>Seu saldo:</i>   <b>$ {balance}</b>
${$zap} Por anúncio: <b>$0.01</b>  ·  <b>{remaining}</b> restantes
<code>${LINE}</code>`,

    earnDone: `${$check} <b>Todos os anúncios de hoje vistos!</b>
<code>${SEP}</code>
${$party} Excelente! Você viu todos os <b>{max}</b> anúncios.
${$wallet} <i>Saldo atual:</i> <b>$ {balance}</b>
<code>${LINE}</code>
${$moon} Volte <b>amanhã</b> para mais!`,

    watchAd: "📺 Ver Anúncio  (+$0.01)",
    refresh:  "🔄 Atualizar Saldo",

    adStarted: `${$tv} <b>Anúncio Pronto — Assista Agora!</b>
<code>${SEP}</code>
${$clock} Assista por pelo menos <b>10 segundos</b>
${$check} Depois pressione <b>Eu Assisti</b>
<code>${LINE}</code>
<blockquote>${$warn} Pressionar cedo = <b>Aviso emitido</b>
${$lock} Token único — <b>uso único</b></blockquote>`,

    watchNow:   "▶️ Abrir Anúncio",
    adVerify:   "✅ Eu Assisti",
    adComplete: `${$check} <b>+$0.01 creditado com sucesso!</b>
<code>${SEP}</code>
${$wallet} Saldo: <b>$ {balance}</b>
${$chart} Hoje: <b>{watched} / {max}</b> anúncios
<code>${LINE}</code>
${$fire} <i>Continue — cada anúncio conta!</i>`,

    adFailed: `${$warn} <b>Rápido demais — Verificação falhou!</b>
<code>${SEP}</code>
Você deve assistir o anúncio <b>completo</b> antes de verificar.
<code>${LINE}</code>
<blockquote>${$warn} Aviso <b>{warnCount} / {warnLimit}</b> emitido.
${$ban} Com <b>{warnLimit}</b> avisos → <b>banimento permanente</b></blockquote>`,

    adCheatBan: `${$ban} <b>Conta Permanentemente Banida</b>
<code>${SEP}</code>
<blockquote>Você excedeu o limite de violações permitidas.
Esta decisão é <b>irrevogável</b>.</blockquote>
<code>${LINE}</code>
${$inbox} Entre em contato com o suporte se achar que é um erro.`,

    adAlreadyPending: `${$hourglass} <b>Anúncio em andamento</b> — conclua antes de iniciar um novo.`,
    adsLimit: `${$check} <b>Todos os {max} anúncios vistos hoje!</b>
<code>${SEP}</code>
${$wallet} Saldo: <b>$ {balance}</b>
${$moon} Até <b>amanhã</b>!`,

    channelRequired: `${$lock} <b>Junte-se Primeiro aos Canais Necessários</b>
<code>${SEP}</code>
Você deve entrar em <b>todos</b> os canais para começar:

{channels}
<code>${LINE}</code>
${$check} Após entrar, pressione <b>Entrei em Todos</b>.`,

    joinedVerify:      "✅ Entrei em Todos",
    channelNotJoined:  "❌ Ainda não entrou — entre primeiro.",
    channelJoinReward: `${$party} Entrou no canal! <b>+\${reward}</b> creditado.`,

    profileMsg: `${$user} <b>MEU PERFIL</b>
<code>${SEP}</code>
${$idcard} <i>ID do usuário:</i>  <code>{id}</code>
${$user} <i>Nome:</i>           <b>{name}</b>
${$globe} <i>Idioma:</i>         {lang}
<code>${LINE}</code>
${$wallet} <i>Saldo:</i>             <b>$ {balance}</b>
${$up} <i>Total ganho:</i>     <b>$ {totalEarned}</b>
<code>${LINE}</code>
${$chart} <i>Anúncios hoje:</i> <b>{adsToday} / {maxAds}</b>
${$people} <i>Indicações:</i>   <b>{referrals}</b>
${$warn} <i>Avisos:</i>        <b>{warnings} / {warnLimit}</b>
${$cal} <i>Registrado:</i>    <b>{joined}</b> <i>({days} dias)</i>
<code>${LINE}</code>
<blockquote>📜 <b>REGRAS</b>
▸ Máx <b>{maxAds}</b> anúncios por dia
▸ Proibido bots ou trapaça
▸ Saque mínimo: <b>$ {minWd}</b>
▸ <b>{warnLimit}</b> violações = banimento permanente
▸ Uma conta por pessoa</blockquote>`,

    referralMsg: `${$people} <b>PROGRAMA DE INDICAÇÕES</b>
<code>${SEP}</code>
${$shine} Indique amigos — ganhe <b>$ {refReward}</b> por pessoa!
<code>${LINE}</code>
${$people} <i>Total indicações:</i>  <b>{count}</b>
${$money} <i>Ganhos indicação:</i> <b>$ {earned}</b>
<code>${LINE}</code>
${$link} <b>Seu link de indicação:</b>
<code>{link}</code>
<code>${LINE}</code>
${$share} <i>Compartilhe o link — ganhe instantaneamente!</i>`,

    shareLink: "📨 Compartilhar Link",

    dailyTaskMsg: `${$clip} <b>TAREFAS DIÁRIAS</b>
<code>${SEP}</code>
${$sparkle} Complete todas as tarefas — desbloqueie seu bônus!
${$refresh} Reinicia toda meia-noite
<code>${LINE}</code>
{tasks}
<code>${LINE}</code>
${$check} Progresso: <b>{done} / {total}</b>
${$gift} Bônus diário: <b>$ {bonus}</b>`,

    taskWatchAds:   `${$tv} Assista <b>{threshold}</b> anúncios hoje  →  <b>+$ {reward}</b>`,
    taskShare:      `${$share} Compartilhe o bot com 1 amigo  →  <b>+$ {reward}</b>`,
    taskChannel:    `${$mega} Entrar: <b>{name}</b>  →  <b>+$ {reward}</b>`,
    taskReferral:   `${$people} Traga 1 novo usuário  →  <b>+$ {reward}</b>`,
    taskDonePrefix:    "✅ ",
    taskPendingPrefix: "⬜ ",
    claimBonus:     "🎁 Resgatar Bônus Diário",
    bonusClaimed: `${$gift} <b>Bônus Diário Resgatado!</b>
<code>${SEP}</code>
${$money} Bônus: <b>+$ {bonus}</b>
${$wallet} Novo saldo: <b>$ {balance}</b>`,

    alreadyClaimed:   `${$check} O bônus de hoje já foi resgatado!`,
    tasksNotComplete: `${$warn} Complete todas as tarefas primeiro!`,
    taskShareBtn:     "📨 Compartilhar Bot",
    taskVerifyBtn:    "✅ Verificar",

    withdrawMsg: `${$cashfly} <b>SAQUE</b>
<code>${SEP}</code>
${$wallet} Saldo:   <b>$ {balance}</b>
${$warn} Mínimo: <b>$ {minWd}</b>
<code>${LINE}</code>
${$phone} <b>Selecione método de pagamento:</b>`,

    withdrawLow: `${$cross} <b>Saldo Insuficiente</b>
<code>${SEP}</code>
Precisa de pelo menos <b>$ {minWd}</b> para sacar.
${$wallet} <i>Seu saldo:</i> <b>$ {balance}</b>`,

    withdrawAddress:  `${$note} Digite seu número <b>{method}</b> ou endereço de carteira:`,
    enterWalletAddress: `${$note} Digite seu endereço <b>{method}</b>:\n<code>${LINE}</code>\n${$zap} <i>Exemplo:</i> <code>{example}</code>`,
    withdrawConfirm: `${$check} <b>Solicitação de saque enviada!</b>
<code>${SEP}</code>
${$dollar} Valor:    <b>$ {amount}</b>
${$bank} Método:   <b>{method}</b>
${$mailbox} Endereço: <code>{address}</code>
<code>${LINE}</code>
${$clock} Pagamento processado em <b>24 horas</b>.`,

    withdrawPending: `${$hourglass} Você já tem um <b>saque pendente</b>. Aguarde o processamento.`,
    withdrawSelect:  "Selecione o método:",

    banned: `${$ban} <b>Conta Banida</b>
<code>${SEP}</code>
<blockquote>Sua conta foi banida por violar as regras.</blockquote>
<code>${LINE}</code>
${$inbox} Entre em contato com o suporte se achar que é um erro.`,

    startFirst: `${$warn} Por favor envie /start para começar.`,
    unknownCmd: `Use os botões do menu para navegar. 👇`,
    ageCmd: `🎂 <b>Calculadora de Idade</b>
<code>${SEP}</code>
📅 Envie sua data de nascimento neste formato:
<code>/age DD/MM/YYYY</code>
<code>${LINE}</code>
Exemplo: <code>/age 15/03/1995</code>`,
    ageResult: `🎂 <b>Calculadora de Idade</b>
<code>${SEP}</code>
📅 Data de nascimento: <b>{date}</b>
<code>${LINE}</code>
🔢 Idade: <b>{years} anos, {months} meses, {days} dias</b>
🌟 Total de dias vividos: <b>{totalDays}</b>
<code>${LINE}</code>
🎉 <i>Continue crescendo!</i>`,
    ageInvalid: `❌ <b>Formato de data inválido!</b>
Use: <code>/age DD/MM/YYYY</code>
Exemplo: <code>/age 15/03/1995</code>`,
    changeNameBtn: "✏️ Mudar nome",
    enterNameMsg: `✏️ <b>MUDAR NOME</b>
<code>━━━━━━━━━━━━━━━━━━━━━━━━━</code>
📝 Digite seu novo nome abaixo:
<code>─────────────────────────</code>
<i>Máx. 64 caracteres. Este nome aparecerá no seu perfil.</i>`,
    helpMsg: `🤖 <b>COMANDOS DO BOT</b>
<code>━━━━━━━━━━━━━━━━━━━━━━━━━</code>
/start — Iniciar o bot
/age DD/MM/YYYY — Calcular idade
/leaderboard — Top 10 ganhadores
/stats — Estatísticas do bot
/help — Este painel de ajuda
<code>─────────────────────────</code>
⚡ <i>Pressione um botão do menu para começar!</i>`,
    statsMsg: `📊 <b>ESTATÍSTICAS DO BOT</b>
<code>━━━━━━━━━━━━━━━━━━━━━━━━━</code>
👥 Total de Usuários:  <b>{users}</b>
💰 Total Pago:         <b>$ {totalPaid}</b>
📺 Total de Anúncios:  <b>{totalAds}</b>
🏆 Maior Ganho:        <b>$ {topEarner}</b>`,
    leaderboardTitle: `🏆 <b>TABELA DE LÍDERES</b>
<code>━━━━━━━━━━━━━━━━━━━━━━━━━</code>
{entries}
<code>─────────────────────────</code>
💪 <i>Continue ganhando para subir no ranking!</i>`,
    leaderboardEntry: `{medal} <b>{rank}.</b> {name}  —  <b>$ {earned}</b>`,
    leaderboardEmpty: `🏆 <b>TABELA DE LÍDERES</b>
<i>Ainda sem dados. Seja o primeiro!</i>`,
    supportMsg: `🛟 <b>CENTRO DE SUPORTE</b>
📩 Descreva seu problema em detalhes.
⏱ Tempo de resposta: <b>24 horas</b>`,
    profileBtn: "👤 Meu Perfil",
    earnBtn: "💰 Ganhar",
    withdrawalBtn: "💸 Saque",
    referralBtn: "👥 Indicar",
    adultBtn2: "🔞 Adulto",
    movieSeriesBtn: "🎬 Filmes-Séries",
    setWalletBtn: "💳 Definir Carteira",
    changeLangBtn: "🌐 Mudar Idioma",
    watchAdsBtn: "📺 Ver Anúncios",
    dailyTasksBtn: "📋 Tarefas Diárias",
    confirmBtn: "✅ Confirmar",
    changeMethodBtn: "🔄 Mudar Método",
    cancelBtn: "❌ Cancelar",
    mainMenuBtn: "🏠 Menu Principal",
    backBtn: "⬅️ Voltar",
    confirmWalletMsg: `${$check} <b>Confirmar salvar carteira</b>\n<code>${SEP}</code>\n💳 Método: <b>{method}</b>\n${$mailbox} Endereço: <code>{address}</code>`,
    confirmWdMsg: `${$check} <b>Confirmar saque</b>\n<code>${SEP}</code>\n💳 Método: <b>{method}</b>\n${$mailbox} Endereço: <code>{address}</code>\n${$dollar} Valor: <b>$ {balance}</b>`,
    walletUpdated: `${$check} <b>Carteira atualizada!</b>\n<code>${SEP}</code>\n💳 Método: <b>{method}</b>\n${$mailbox} Endereço: <code>{address}</code>`,
    updateWalletMsg: `💳 <b>Atualizar Carteira</b>\n<code>${SEP}</code>\n${$phone} Selecione método de pagamento:`,
    nameUpdated: `${$check} <b>Nome atualizado!</b>\n<code>${SEP}</code>\n${$user} Novo nome: <b>{name}</b>`,
    earnCategoryMsg: `${$money} <b>Centro de ganhos</b>\n<code>${SEP}</code>\n${$rocket} Escolha como ganhar hoje:\n<code>${LINE}</code>\n${$tv} <b>Ver anúncios</b>  —  +$0.01 por anúncio\n${$clip} <b>Tarefas diárias</b>  —  bonus ao completar\n${$people} <b>Indicações</b>  —  ganhe por amigo\n<code>${LINE}</code>\n${$zap} <i>Todos os ganhos são instantâneos</i>`,
  },
};

export function tr_(lang: Lang, key: string, vars: Record<string, string | number> = {}): string {
  let msg = key === "walletInvalidGeneric"
    ? genericWalletInvalid[lang]
    : walletMessages[lang]?.[key] ?? t[lang]?.[key] ?? t["en"]?.[key] ?? key;
  for (const [k, v] of Object.entries(vars)) {
    const safe = typeof v === "string" ? escHtml(v) : String(v);
    msg = msg.replace(new RegExp(`\\{${k}\\}`, "g"), safe);
  }
  return msg;
}
