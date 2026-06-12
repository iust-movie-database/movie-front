// Persian (Farsi) Localization and Utilities
import {
  Target, Compass, Orbit, Sparkles, Ghost, Fingerprint, BrainCircuit, Activity,
  Heart, Landmark, Swords, Palette, Users, Laugh, FileText, Music
} from 'lucide-react';

// Convert English numbers to Persian numerals
export function toPersianDigits(num: number | string): string {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return String(num).replace(/\d/g, (digit) => persianDigits[parseInt(digit)]);
}

// Format Persian number with thousand separators (always uses Persian numerals)
export function formatPersianNumber(num: number): string {
  return toPersianDigits(num.toLocaleString('fa-IR'));
}

// Genre icon mapping - professional minimal icons for each genre
export const genreIcons: Record<string, any> = {
  'اکشن': Target,
  'ماجراجویی': Compass,
  'علمی-تخیلی': Orbit,
  'علمی‌تخیلی': Orbit,
  'فانتزی': Sparkles,
  'ترسناک': Ghost,
  'جنایی': Fingerprint,
  'معمایی': BrainCircuit,
  'هیجان‌انگیز': Activity,
  'عاشقانه': Heart,
  'تاریخی': Landmark,
  'جنگی': Swords,
  'انیمیشن': Palette,
  'خانوادگی': Users,
  'کمدی': Laugh,
  'مستند': FileText,
  'موسیقی': Music,
  'درام': FileText,
};

export const translations = {
  // App Name
  appName: 'سینما‌مچ',

  // Navigation
  nav: {
    home: 'خانه',
    discover: 'کشف کنید',
    profile: 'پروفایل',
    search: 'جستجو',
    login: 'ورود',
    signup: 'ثبت‌نام',
    logout: 'خروج',
    cancel: 'لغو',
    darkMode: 'حالت تاریک',
    lightMode: 'حالت روشن',
  },

  // Authentication
  auth: {
    loginTitle: 'ورود',
    signupTitle: 'ثبت‌نام',
    email: 'ایمیل',
    password: 'رمز عبور',
    username: 'نام کاربری',
    forgotPassword: 'فراموشی رمز عبور؟',
    loginButton: 'ورود به سینما‌مچ',
    signupButton: 'ایجاد حساب کاربری',
    haveAccount: 'حساب کاربری دارید؟ ',
    noAccount: 'حساب کاربری ندارید؟ ',
    signInToProfile: 'برای دسترسی به پروفایل خود وارد شوید',
    emailPlaceholder: 'example@email.com',
    usernamePlaceholder: 'مثلاً: سینما_دوست',
    passwordPlaceholder: '••••••••',
  },

  // Home Page
  home: {
    popularGenres: 'ژانرهای محبوب',
    recommendedForYou: 'پیشنهادی برای شما',
    topRatedMovies: 'فیلم‌های برتر',
    topRatedSeries: 'سریال‌های برتر',
    comingSoon: 'به‌زودی',
    seeAll: 'مشاهده همه',
    seeAllInDiscover: 'مشاهده همه در کشف کنید',
    seeCalendar: 'مشاهده تقویم',
    clearFilters: 'پاک کردن فیلترها',
    results: 'نتایج',
    noTitlesFound: 'عنوانی پیدا نشد',
    tryDifferentSearch: 'عبارت جستجو یا ژانر دیگری را امتحان کنید',
    signInToSeeRecommendations: 'برای مشاهده پیشنهادات وارد شوید',
    getPersonalizedRecommendations: 'پیشنهادات شخصی‌سازی شده بر اساس امتیازها و تاریخچه تماشای شما دریافت کنید.',
    loginOrSignup: 'ورود یا ثبت‌نام',
  },

  // Browse/Discover Page
  browse: {
    browseTitle: 'کشف کنید',  // تغییر نام از title به browseTitle
    subtitle: 'هزاران فیلم و سریال را کشف کنید',
    searchPlaceholder: 'جستجوی فیلم، سریال، بازیگر، کارگردان...',
    filterBy: 'فیلتر بر اساس:',
    genre: 'ژانر',
    rating: 'امتیاز',
    year: 'سال',
    yearRange: 'بازه سال',
    sortBy: 'مرتب‌سازی',
    all: 'همه',
    movies: 'فیلم‌ها',
    series: 'سریال‌ها',
    tvShows: 'سریال‌ها',
    applyFilters: 'اعمال فیلترها',
    clearAll: 'پاک کردن همه',
    showing: 'نمایش',
    of: 'از',
    results: 'نتیجه',
    cancel: 'لغو',
    popularity: 'محبوبیت',
    releaseDate: 'تاریخ انتشار',
    sortTitle: 'عنوان',  // تغییر نام از title به sortTitle
    matching: 'مطابق با',
    allYears: 'همه سال‌ها',
    allRatings: 'همه امتیازها',
    active: 'فعال',
    previous: 'قبلی',
    next: 'بعدی',
    browseDiscover: 'کشف و جستجو',
  },

  // Detail Pages
  detail: {
    back: 'بازگشت',
    save: 'ذخیره',
    saved: 'ذخیره شد',
    saveToWatchlist: 'افزودن به لیست تماشا',
    wantToWatch: 'می‌خواهم تماشا کنم',
    watching: 'در حال تماشا',
    watched: 'تماشا شده',
    rate: 'امتیاز:',
    submit: 'ثبت',
    yourRating: 'امتیاز شما',
    alreadyRated: 'شما قبلاً به این عنوان امتیاز داده‌اید',
    editInProfile: 'ویرایش در پروفایل',
    cast: 'بازیگران',
    crew: 'عوامل',
    awards: 'جوایز',
    reviews: 'نقدها',
    similarTitles: 'عناوین مشابه',
    viewDetails: 'مشاهده جزئیات',
    watchTrailer: 'تماشای تریلر',
    director: 'کارگردان',
    writer: 'نویسنده',
    cinematographer: 'فیلمبردار',
    originalScore: 'موسیقی متن',
    productionDesign: 'طراحی تولید',
    filmEditor: 'تدوینگر',
    won: 'برنده',
    nominated: 'نامزد',
    spoilerWarning: 'احتمال لو رفتن داستان',
    seasonsAndEpisodes: 'فصل‌ها و قسمت‌ها',
    season: 'فصل',
    episodes: 'قسمت',
    episode: 'قسمت',
    addToWatchlist: 'افزودن به لیست تماشا',
    selectListType: 'انتخاب لیست',
    selectListDescription: 'این عنوان را در کدام لیست قرار می‌دهید؟',
  },

  // Profile Page
  profile: {
    title: 'پروفایل من',
    stats: 'آمار',
    totalRatings: 'مجموع امتیازها',
    averageRating: 'میانگین امتیاز',
    savedTitles: 'عناوین ذخیره شده',
    myRatings: 'امتیازهای من',
    editProfile: 'ویرایش پروفایل',
    settings: 'تنظیمات',
    filterRatings: 'فیلتر امتیازها:',
    allTypes: 'همه انواع',
    moviesOnly: 'فقط فیلم‌ها',
    seriesOnly: 'فقط سریال‌ها',
    sortRatings: 'مرتب‌سازی:',
    newestFirst: 'جدیدترین',
    oldestFirst: 'قدیمی‌ترین',
    highestFirst: 'بالاترین امتیاز',
    lowestFirst: 'پایین‌ترین امتیاز',
    noRatingsYet: 'هنوز امتیازی ندارید',
    startRating: 'با امتیازدهی به فیلم‌ها و سریال‌های مورد علاقه خود شروع کنید!',
    exploreContent: 'کاوش محتوا',
    edit: 'ویرایش',
    delete: 'حذف',
    yourScore: 'امتیاز شما',
    yourReview: 'نقد شما',
    noReview: 'بدون نقد',
    rated: 'امتیاز داده شده',
    watchlist: 'لیست تماشا',
    ratingsAndReviews: 'امتیازها و نقدها',
    tvShows: 'سریال‌ها',
    memberSince: 'عضو از',
    avatarColor: 'رنگ آواتار',
    username: 'نام کاربری',
    email: 'ایمیل',
    bio: 'بیوگرافی',
    noWrittenReview: 'نقد نوشته‌ای ندارد',
    reviews: 'نقدها',
    wantToWatch: 'می‌خواهم تماشا کنم',
    watching: 'در حال تماشا',
    watched: 'تماشا شده',
    unsave: 'حذف از لیست',
  },

  // Edit Profile Modal
  editProfile: {
    title: 'ویرایش پروفایل',
    email: 'ایمیل',
    changeAvatar: 'تغییر آواتار',
    selectColor: 'انتخاب رنگ',
    saveChanges: 'ذخیره تغییرات',
    close: 'بستن',
    username: 'نام کاربری',
    bio: 'بیوگرافی',
    avatarColor: 'رنگ آواتار',
    cancel: 'لغو',
  },

  // Edit Rating Modal
  editRating: {
    title: 'ویرایش امتیاز',
    yourRating: 'امتیاز شما',
    yourReview: 'نقد شما (اختیاری)',
    reviewPlaceholder: 'نظر خود را درباره این عنوان بنویسید...',
    saveChanges: 'ذخیره تغییرات',
    cancel: 'لغو',
    required: 'الزامی',
    optional: 'اختیاری',
    scoreRequired: 'برای ذخیره، امتیاز الزامی است.',
    review: 'نقد',
    reviewPlaceholderLong: 'نظرات خود را به اشتراک بگذارید... (برای امتیاز بدون نقد خالی بگذارید)',
  },

  // Delete Confirmation
  deleteConfirm: {
    deleteConfirmTitle: 'تأیید حذف',  // تغییر نام از title به deleteConfirmTitle
    deleteRating: 'حذف امتیاز',
    message: 'آیا مطمئن هستید که می‌خواهید این امتیاز را حذف کنید؟ این عمل قابل بازگشت نیست.',
    confirmDelete: 'بله، حذف شود',
    cancel: 'لغو',
    removeRatingFor: 'حذف امتیاز برای',
    permanentDelete: 'این عمل امتیاز و نقد شما برای این عنوان را برای همیشه حذف می‌کند.',
    delete: 'حذف',
  },

  // Common Terms
  common: {
    movie: 'فیلم',
    tvSeries: 'سریال',
    type: 'نوع',
    year: 'سال',
    duration: 'مدت زمان',
    rating: 'امتیاز',
    votes: 'رأی',
    outOf: 'از',
    loading: 'در حال بارگذاری...',
    error: 'خطا',
    success: 'موفقیت',
    min: 'دقیقه',
    hour: 'ساعت',
  },

  // Badges
  badges: {
    trending: '🔥 پرطرفدار',
    topRated: '★ برترین',
    newRelease: '✦ جدید',
    comingSoon: '◉ به‌زودی',
  },

  // Genres
  genres: {
    action: 'اکشن',
    drama: 'درام',
    scifi: 'علمی-تخیلی',
    horror: 'ترسناک',
    comedy: 'کمدی',
    thriller: 'هیجان‌انگیز',
    romance: 'عاشقانه',
    adventure: 'ماجراجویی',
    fantasy: 'فانتزی',
    crime: 'جنایی',
    history: 'تاریخی',
    war: 'جنگی',
  },
};