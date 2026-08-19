export const sculptures = [
  {
    id: 1,
    name: "יוסי כהן",
    age: 22,
    unit: "גדוד 51, חטיבת גולני",
    date: "אוקטובר 2023",
    story:
      "יוסי גדל ברמת גן, הבן הבכור במשפחה של חמישה ילדים. חלם להיות מורה לתולדות ישראל. בשעות הפנאי ניגן גיטרה ולימד ילדי הסביבה נגינה ללא תשלום. נפל בהגנה על בית החולים הקהילתי ביישוב שנתקף.",
  },
  {
    id: 2,
    name: "דוד לוי",
    age: 19,
    unit: "חיל שריון, גדוד 82",
    date: "אוקטובר 2023",
    story:
      "דוד, הצעיר בין שלושה אחים, התגייס מיד עם סיום התיכון. אהב אופנוע ים וחלם לעבוד ביחידת ים. אמו מספרת שידיו תמיד עסקו בהכנת אוכל לשכנים. נפל בעת שהגן על צוות פינוי פצועים.",
  },
  {
    id: 3,
    name: "שרה ממן",
    age: 21,
    unit: "אמ\"ן, יחידת מודיעין שדה",
    date: "נובמבר 2023",
    story:
      "שרה סיימה את שירותה בהצטיינות יתרה. בוגרת תוכנית עתודה אקדמית, תכננה ללמוד פסיכולוגיה. ידועה ברוחב לבה ובחיוכה. בעת המשימה שבה נפלה הצילה שני חבריה לצוות.",
  },
  {
    id: 4,
    name: "מיכאל ביטון",
    age: 23,
    unit: "שייטת 13",
    date: "אוקטובר 2023",
    story:
      "מיכאל גדל בתל אביב, ילד ים מושבע. מאז היה צעיר חלם להצטרף לשייטת. סיים הכשרות מסמר שיער ושירת בגאווה. בין המשימות טיפח גינה קטנה בבסיס — אמר שהאדמה מרגיעה אותו.",
  },
  {
    id: 5,
    name: "רוני שפיר",
    age: 20,
    unit: "גדוד 931, חטיבת נח\"ל",
    date: "דצמבר 2023",
    story:
      "רוני מחיפה, בן יחיד להוריו. מתנדב ביחידת סיוע לקשישים לפני גיוסו. ידיד לכל, לא ידע לאמר לא לאיש. בחופשות ביקר כל שבוע את סבתו בבית אבות. נפל בפשיטה על מוצב שממנו אוחסן נשק טרוריסטי.",
  },
  {
    id: 6,
    name: "אורן אבי",
    age: 24,
    unit: "מג\"ב, יחידת מחוז דרום",
    date: "ינואר 2024",
    story:
      "אורן שב מחופשת גיבוש בגרמניה כשהחלה הלחימה ומיהר להתייצב מרצון. אבא לבת קטנה בת שנה. תכנן להינשא בסוף השנה. אשתו מספרת שכתב לה מכתב אהבה כל ערב לפני השינה.",
  },
];

// Status values use English keys to match the Supabase schema (see supabase-schema.sql).
// Display labels are resolved via STATUS_CONFIG in lib/constants.js.
export const requests = [
  {
    id: 1,
    requesterName: "מרים כהן",
    contactInfo: "miriam.cohen@gmail.com | 050-1234567",
    fallenName: "יוסי כהן",
    story:
      "אמא של יוסי. הבן שלי היה אור בחיינו. אם אפשר, הייתי רוצה שיקבל פסל חול שישמר את זכרו לדורות.",
    status: "pending",
    submittedAt: "2024-01-15",
  },
  {
    id: 2,
    requesterName: "רחל שפיר",
    contactInfo: "r.shapir@walla.co.il | 052-9876543",
    fallenName: "רוני שפיר",
    story:
      "אחות של רוני. הוא היה האיש הכי טוב שהכרתי. כל אחד שפגש אותו אהב אותו. רוצה שזכרו יחיה.",
    status: "in_progress",
    submittedAt: "2024-01-22",
  },
  {
    id: 3,
    requesterName: "ישראל ממן",
    contactInfo: "i.maman@hotmail.com | 054-3456789",
    fallenName: "שרה ממן",
    story:
      "אבא של שרה. היא הייתה גאוות המשפחה. גיבורה שהצילה חברים ונפלה בעצמה. מגיע לה הנצחה ראויה.",
    status: "completed",
    submittedAt: "2023-12-10",
  },
  {
    id: 4,
    requesterName: "שושנה ביטון",
    contactInfo: "shoshana.b@gmail.com | 058-7654321",
    fallenName: "מיכאל ביטון",
    story:
      "אמא של מיכאל. הוא חלם מהים מגיל שש. ראה בשייטת ייעוד. רוצה פסל שיזכיר לכולם את ניצוץ עיניו.",
    status: "pending",
    submittedAt: "2024-02-03",
  },
  {
    id: 5,
    requesterName: "אברהם לוי",
    contactInfo: "a.levi@bezeqint.net | 053-2345678",
    fallenName: "דוד לוי",
    story:
      "סבא של דוד. כל שישי היה מגיע לאכול אצלנו. בישל ביחד ושר שירים ישנים. תבקשו — הוא ראוי.",
    status: "in_progress",
    submittedAt: "2024-01-30",
  },
  // Duplicates for יוסי כהן — used to test duplicate-handling prompt in the dashboard.
  {
    id: 6,
    requesterName: "אריה כהן",
    contactInfo: "a.cohen@gmail.com | 050-9991111",
    fallenName: "יוסי כהן",
    story:
      "אבא של יוסי. רצה שכל העולם ידע מי היה הבן שלנו. גיבור אמיתי.",
    status: "pending",
    submittedAt: "2024-02-10",
  },
  {
    id: 7,
    requesterName: "נועה כהן",
    contactInfo: "n.cohen@walla.co.il | 052-3334444",
    fallenName: "יוסי כהן",
    story:
      "אחות של יוסי. לא יכולתי לסגור עין מאז. הוא אהב כל כך את החיים.",
    status: "pending",
    submittedAt: "2024-02-14",
  },
];
