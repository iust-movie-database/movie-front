import { MovieData, ComingSoonData, RatedEntry, CastMember, CrewMember, AwardEntry, ReviewEntry } from "../types";

// Shared placeholder portrait images cycled for cast
const P = [
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1494790108755-2616b612b1bd?w=300&h=300&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop&auto=format",
];

function c(name: string, character: string, idx: number): CastMember {
  return { name, character, img: P[idx % P.length] };
}
function cr(name: string, role: string): CrewMember { return { name, role }; }
function aw(year: number, name: string, category: string, status: "won" | "nominated"): AwardEntry { return { year, name, category, status }; }
function rv(user: string, score: number, comment: string, spoiler = false): ReviewEntry { return { user, score, comment, spoiler }; }

export const MOVIES: MovieData[] = [
  {
    id: 1, title: "تلماسه: بخش دوم", originalTitle: "Dune: Part Two", year: 2024, rating: 8.5, type: "Movie", voteCount: 45231,
    duration: "2h 46m", genres: ["علمی-تخیلی", "ماجراجویی"], age: "PG-13",
    img: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400&h=600&fit=crop&auto=format",
    summary: "پل آترئیدس با چانی و فرمن‌ها متحد می‌شود و به دنبال انتقام از توطئه‌گرانی است که خانواده‌اش را نابود کردند.",
    cast: [c("Timothée Chalamet","Paul Atreides",0),c("Zendaya","Chani",1),c("Rebecca Ferguson","Lady Jessica",2),c("Austin Butler","Feyd-Rautha",3),c("Josh Brolin","Gurney Halleck",4),c("Florence Pugh","Princess Irulan",5)],
    crew: [cr("Denis Villeneuve","Director"),cr("Greig Fraser","Cinematographer"),cr("Jon Spaihts","Screenplay"),cr("Hans Zimmer","Original Score"),cr("Patrice Vermette","Production Design"),cr("Joe Walker","Film Editor")],
    awards: [aw(2024,"Academy Award","Best Cinematography","won"),aw(2024,"Academy Award","Best Visual Effects","won"),aw(2024,"BAFTA","Best Special Visual Effects","won"),aw(2024,"Academy Award","Best Picture","nominated"),aw(2024,"Golden Globe","Best Director","nominated"),aw(2024,"Critics Choice","Best Sci-Fi / Horror Movie","nominated")],
    reviews: [rv("cinephile_42",9.0,"An absolute visual feast. Villeneuve has crafted something truly epic and emotionally resonant."),rv("FilmNerd_87",8.0,"The second half completely redeems the slow burn of the first. A worthy epic."),rv("MovieBuff_X",7.0,"Zendaya finally gets her moment to shine. The ending left me stunned and wanting more.",true)],
    similarMovieIds: [2, 3, 5, 7],
  },
  {
    id: 2, title: "اوپنهایمر", originalTitle: "Oppenheimer", year: 2023, rating: 8.9, type: "Movie", voteCount: 67854,
    duration: "3h 0m", genres: ["درام", "تاریخی"], age: "R",
    img: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=600&fit=crop&auto=format",
    summary: "داستان نقش ج. رابرت اوپنهایمر در ساخت بمب اتمی در طول جنگ جهانی دوم.",
    cast: [c("Cillian Murphy","J. Robert Oppenheimer",0),c("Emily Blunt","Katherine Oppenheimer",1),c("Matt Damon","Leslie Groves",2),c("Robert Downey Jr.","Lewis Strauss",3),c("Florence Pugh","Jean Tatlock",4),c("Rami Malek","David Hill",5)],
    crew: [cr("Christopher Nolan","Director"),cr("Hoyte van Hoytema","Cinematographer"),cr("Christopher Nolan","Screenplay"),cr("Ludwig Göransson","Original Score"),cr("Ruth De Jong","Production Design"),cr("Jennifer Lame","Film Editor")],
    awards: [aw(2024,"Academy Award","Best Picture","won"),aw(2024,"Academy Award","Best Director","won"),aw(2024,"Academy Award","Best Actor (Murphy)","won"),aw(2024,"Golden Globe","Best Motion Picture – Drama","won"),aw(2024,"BAFTA","Best Film","won"),aw(2024,"Academy Award","Best Cinematography","nominated")],
    reviews: [rv("NightOwl_Cinema",10,"A monumental achievement in filmmaking. Nolan's greatest work without question."),rv("TheatreGoer",9,"Cillian Murphy gives a career-defining performance that anchors every frame."),rv("FilmScholar",8,"The editing alone deserves study in every film school around the world.",true)],
    similarMovieIds: [1, 4, 8, 6],
  },
  {
    id: 3, title: "چیزهای بیچاره", originalTitle: "Poor Things", year: 2023, rating: 8.1, type: "Movie", voteCount: 38912,
    duration: "2h 21m", genres: ["فانتزی", "درام"], age: "R",
    img: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=600&fit=crop&auto=format",
    summary: "داستان شگفت‌انگیز بلا بکستر، زنی جوان که توسط دکتر باهوش گادوین بکستر به زندگی باز می‌گردد.",
    cast: [c("Emma Stone","Bella Baxter",0),c("Mark Ruffalo","Duncan Wedderburn",1),c("Willem Dafoe","Dr. Godwin Baxter",2),c("Ramy Youssef","Max McCandles",3),c("Jerrod Carmichael","Harry Astley",4),c("Hanna Schygulla","Madame Swiney",5)],
    crew: [cr("Yorgos Lanthimos","Director"),cr("Robbie Ryan","Cinematographer"),cr("Tony McNamara","Screenplay"),cr("Jerskin Fendrix","Original Score"),cr("Shona Heath","Production Design"),cr("Yorgos Mavropsaridis","Film Editor")],
    awards: [aw(2024,"Academy Award","Best Actress (Stone)","won"),aw(2024,"Golden Globe","Best Motion Picture – Musical or Comedy","won"),aw(2023,"Venice Film Festival","Golden Lion","won"),aw(2024,"BAFTA","Best Costume Design","won"),aw(2024,"Academy Award","Best Picture","nominated"),aw(2024,"Critics Choice","Best Actress","nominated")],
    reviews: [rv("AvantGarde_Fan",9,"Lanthimos at his most imaginative. Emma Stone is otherworldly and completely fearless."),rv("CinematicDreamer",8,"A bold, colorful fever dream that rewards patience and an open mind."),rv("WeirdfestLover",7,"Not for everyone, but for those on its wavelength it's an absolute triumph.",false)],
    similarMovieIds: [5, 7, 2, 8],
  },
  {
    id: 4, title: "قاتلان ماه گل", originalTitle: "Killers of the Flower Moon", year: 2023, rating: 7.7, type: "Movie", voteCount: 52347,
    duration: "3h 26m", genres: ["جنایی", "تاریخی"], age: "R",
    img: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=600&fit=crop&auto=format",
    summary: "اعضای قبیله اوسیج در اوکلاهامای دهه ۱۹۲۰ در شرایط مرموزی به قتل می‌رسند و تحقیقات بزرگ FBI آغاز می‌شود.",
    cast: [c("Leonardo DiCaprio","Ernest Burkhart",0),c("Lily Gladstone","Mollie Burkhart",1),c("Robert De Niro","William Hale",2),c("Jesse Plemons","Tom White",3),c("Tantoo Cardinal","Lizzie Q",4),c("John Lithgow","Prosecutor Leaward",5)],
    crew: [cr("Martin Scorsese","Director"),cr("Rodrigo Prieto","Cinematographer"),cr("Eric Roth","Screenplay"),cr("Robbie Robertson","Original Score"),cr("Jack Fisk","Production Design"),cr("Thelma Schoonmaker","Film Editor")],
    awards: [aw(2024,"Academy Award","Best Cinematography","nominated"),aw(2024,"Golden Globe","Best Motion Picture – Drama","nominated"),aw(2024,"BAFTA","Best Film","nominated"),aw(2023,"Cannes Film Festival","Palme d'Or","nominated"),aw(2024,"Academy Award","Best Supporting Actress (Gladstone)","nominated"),aw(2024,"Critics Choice","Best Director","nominated")],
    reviews: [rv("OsageNation_Fan",9,"A devastating and necessary film. Scorsese reckons with American history unflinchingly."),rv("EpicCinema_X",8,"DiCaprio and Gladstone create one of the most tragic screen couples in years."),rv("HistoryBuff_22",7,"Three and a half hours that feel both too long and never long enough.",false)],
    similarMovieIds: [2, 6, 8, 5],
  },
  {
    id: 5, title: "زندگی‌های گذشته", originalTitle: "Past Lives", year: 2023, rating: 7.9, type: "Movie", voteCount: 29451,
    duration: "1h 46m", genres: ["درام", "عاشقانه"], age: "PG-13",
    img: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&h=600&fit=crop&auto=format",
    summary: "دو دوست دوران کودکی پس از ۲۴ سال در چندین کشور و قاره دوباره به هم می‌رسند.",
    cast: [c("Greta Lee","Nora Moon",0),c("Teo Yoo","Hae Sung",1),c("John Magaro","Arthur Zaturansky",2),c("Moon Seung-ah","Young Nora",3),c("Leem Seung-min","Young Hae Sung",4),c("Yoson An","Cameo Guest",5)],
    crew: [cr("Celine Song","Director"),cr("Shabier Kirchner","Cinematographer"),cr("Celine Song","Screenplay"),cr("Christopher Bear","Original Score"),cr("Grace Yun","Production Design"),cr("Keith Fraase","Film Editor")],
    awards: [aw(2024,"Academy Award","Best Picture","nominated"),aw(2024,"Academy Award","Best Original Screenplay","nominated"),aw(2024,"Golden Globe","Best Motion Picture – Drama","nominated"),aw(2023,"Sundance Film Festival","Audience Award","won"),aw(2024,"BAFTA","Best Casting","nominated"),aw(2024,"Critics Choice","Best Picture","nominated")],
    reviews: [rv("RomanceLover_99",10,"A quiet masterpiece about the roads not taken. Utterly heartbreaking and beautiful."),rv("IndieFilmFan",9,"Greta Lee is a revelation. This film will stay with you for years after viewing."),rv("ArthouseCritic",8,"Song's debut is remarkably assured — intimate and universal at once.",false)],
    similarMovieIds: [3, 7, 8, 6],
  },
  {
    id: 6, title: "منطقه مورد علاقه", originalTitle: "The Zone of Interest", year: 2023, rating: 7.5, type: "Movie", voteCount: 18734,
    duration: "1h 45m", genres: ["درام", "جنگی"], age: "PG-13",
    img: "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=400&h=600&fit=crop&auto=format",
    summary: "فرمانده آشویتس و همسرش سعی می‌کنند زندگی رویایی برای خانواده خود در کنار اردوگاه بسازند.",
    cast: [c("Christian Friedel","Rudolf Höss",0),c("Sandra Hüller","Hedwig Höss",1),c("Johann Karthaus","Claus Höss",2),c("Luis Noah Witte","Hans Höss",3),c("Nele Ahrensmeier","Inge-Brigitt Höss",4),c("Lilli Falk","Heideraud Höss",5)],
    crew: [cr("Jonathan Glazer","Director"),cr("Łukasz Żal","Cinematographer"),cr("Jonathan Glazer","Screenplay"),cr("Mica Levi","Original Score"),cr("Chris Oddy","Production Design"),cr("Paul Watts","Film Editor")],
    awards: [aw(2024,"Academy Award","Best International Feature Film","won"),aw(2024,"Academy Award","Best Sound","won"),aw(2023,"Cannes Film Festival","Grand Prix","won"),aw(2024,"BAFTA","Best Film Not in the English Language","won"),aw(2024,"Academy Award","Best Picture","nominated"),aw(2024,"Golden Globe","Best Non-English Language Film","won")],
    reviews: [rv("HolocaustScholar",10,"The most haunting film about the Holocaust ever made. Silence as horror."),rv("ExperimentalFilm_X",9,"Glazer has created something genuinely new. Deeply unsettling and important."),rv("ArtHouseReviewer",8,"Sandra Hüller is extraordinary. The banality of evil has never been so chilling.",false)],
    similarMovieIds: [4, 8, 2, 5],
  },
  {
    id: 7, title: "سالتبرن", originalTitle: "Saltburn", year: 2023, rating: 7.1, type: "Movie", voteCount: 41289,
    duration: "2h 11m", genres: ["درام", "هیجان‌انگیز"], age: "R",
    img: "https://images.unsplash.com/photo-1571847140471-1d7766e825ea?w=400&h=600&fit=crop&auto=format",
    summary: "یک دانشجو با همکلاسی خود دوست می‌شود که او را برای تابستان به ملک پهناور خانواده‌اش دعوت می‌کند.",
    cast: [c("Barry Keoghan","Oliver Quick",0),c("Jacob Elordi","Felix Catton",1),c("Rosamund Pike","Elspeth Catton",2),c("Richard E. Grant","Sir James Catton",3),c("Alison Oliver","Venetia Catton",4),c("Archie Madekwe","Farleigh Start",5)],
    crew: [cr("Emerald Fennell","Director"),cr("Linus Sandgren","Cinematographer"),cr("Emerald Fennell","Screenplay"),cr("Anthony Willis","Original Score"),cr("Suzie Davies","Production Design"),cr("Victoria Boydell","Film Editor")],
    awards: [aw(2024,"BAFTA","Outstanding British Film","nominated"),aw(2024,"Golden Globe","Best Actor (Keoghan)","nominated"),aw(2024,"Critics Choice","Best Actor","nominated"),aw(2024,"Screen Actors Guild","Outstanding Cast","nominated"),aw(2024,"BAFTA","Best Original Screenplay","nominated"),aw(2024,"Empire Award","Best British Film","won")],
    reviews: [rv("TwistEndingFan",8,"Barry Keoghan gives one of the most unnerving performances in recent memory."),rv("ThrillerAddict",7,"Wickedly entertaining — the final act left my jaw on the floor."),rv("BritCinema_Review",6,"Style over substance, but what incredible style. Fennell is a singular voice.",true)],
    similarMovieIds: [3, 5, 8, 4],
  },
  {
    id: 8, title: "بازماندگان", originalTitle: "The Holdovers", year: 2023, rating: 7.9, type: "Movie", voteCount: 35672,
    duration: "2h 13m", genres: ["کمدی", "درام"], age: "R",
    img: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&h=600&fit=crop&auto=format",
    summary: "معلمی بداخلاق مجبور می‌شود در تعطیلات در دانشگاه بماند و از دانش‌آموز مشکل‌داری مراقبت کند.",
    cast: [c("Paul Giamatti","Paul Hunham",0),c("Dominic Sessa","Angus Tully",1),c("Da'Vine Joy Randolph","Mary Lamb",2),c("Carrie Preston","Lydia Crane",3),c("Andrew Garman","Rev. Woodrup",4),c("Brady Hepner","Krazinski",5)],
    crew: [cr("Alexander Payne","Director"),cr("Eigil Bryld","Cinematographer"),cr("David Hemingson","Screenplay"),cr("Mark Orton","Original Score"),cr("Ryan Warren Smith","Production Design"),cr("Kevin Tent","Film Editor")],
    awards: [aw(2024,"Academy Award","Best Supporting Actress (Randolph)","won"),aw(2024,"Golden Globe","Best Actor – Comedy (Giamatti)","won"),aw(2024,"BAFTA","Best Original Screenplay","nominated"),aw(2024,"Academy Award","Best Actor (Giamatti)","nominated"),aw(2024,"Critics Choice","Best Actress – Comedy","won"),aw(2024,"Screen Actors Guild","Outstanding Cast","nominated")],
    reviews: [rv("ComedyDrama_Fan",10,"Paul Giamatti has never been better. A film warm enough to melt any cold heart."),rv("HolidayFilmBuff",9,"Da'Vine Joy Randolph deserved every award she received. Devastating and funny."),rv("ClassicCinema_33",8,"Feels like a film made in a different era — in the best possible way.",false)],
    similarMovieIds: [5, 7, 3, 6],
  },
];

export const TV_SERIES: MovieData[] = [
  {
    id: 201, title: "خرس", originalTitle: "The Bear", year: 2022, rating: 8.7, type: "TV", voteCount: 54321,
    duration: "30m", genres: ["درام", "کمدی"], age: "TV-MA",
    img: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=600&fit=crop&auto=format",
    summary: "یک آشپز جوان پس از یک فاجعه به شیکاگو باز می‌گردد تا رستوران ساندویچ خانواده‌اش را اداره کند.",
    cast: [c("Jeremy Allen White","Carmen 'Carmy' Berzatto",0),c("Ebon Moss-Bachrach","Richard 'Richie' Jerimovich",3),c("Ayo Edebiri","Sydney Adamu",1),c("Abby Elliott","Natalie 'Sugar' Berzatto",2),c("Lionel Boyce","Marcus Brooks",4),c("Liza Colón-Zayas","Tina",5)],
    crew: [cr("Christopher Storer","Creator / Showrunner"),cr("Joanna Calo","Executive Producer"),cr("Ramy Youssef","Director"),cr("Adam Refs","Cinematographer"),cr("Sofía Alvarez","Writer"),cr("Andrew Miano","Executive Producer")],
    awards: [aw(2023,"Primetime Emmy","Outstanding Comedy Series","won"),aw(2024,"Golden Globe","Best TV Series – Comedy","won"),aw(2023,"Critics Choice","Best Drama Series","won"),aw(2023,"Primetime Emmy","Outstanding Lead Actor (White)","nominated"),aw(2024,"SAG Award","Outstanding Performance – Comedy","nominated"),aw(2024,"BAFTA","Best International Programme","nominated")],
    reviews: [rv("TVAddict_44",10,"The most stressful yet rewarding television experience of the decade. Nothing compares."),rv("StreamWatcher",9,"Every single episode is a masterclass in tension and earned character development."),rv("SeriesJunkie",8,"Season 2 episode 7 alone deserves every award. Absolute perfection in television form.",true)],
    similarMovieIds: [202, 203, 204, 205],
  },
  {
    id: 202, title: "جانشینی", originalTitle: "Succession", year: 2018, rating: 8.9, type: "TV", voteCount: 72145,
    duration: "60m", genres: ["درام"], age: "TV-MA",
    img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=600&fit=crop&auto=format",
    summary: "خانواده رای در نبردی از قدرت و خیانت برای کنترل یک امپراتوری رسانه‌ای جهانی می‌جنگند.",
    cast: [c("Brian Cox","Logan Roy",0),c("Jeremy Strong","Kendall Roy",1),c("Sarah Snook","Siobhan Roy",2),c("Kieran Culkin","Roman Roy",3),c("Matthew Macfadyen","Tom Wambsgans",4),c("Nicholas Braun","Cousin Greg",5)],
    crew: [cr("Jesse Armstrong","Creator / Showrunner"),cr("Mark Mylod","Director"),cr("Andrij Parekh","Cinematographer"),cr("Nicholas Britell","Original Score"),cr("Stephen Turner","Production Design"),cr("Ken Eluto","Film Editor")],
    awards: [aw(2023,"Primetime Emmy","Outstanding Drama Series","won"),aw(2024,"Golden Globe","Best TV Series – Drama","won"),aw(2023,"Primetime Emmy","Outstanding Lead Actor (Strong)","won"),aw(2024,"SAG Award","Outstanding Cast – Drama","won"),aw(2023,"Critics Choice","Best Drama Series","won"),aw(2024,"BAFTA","Best International Programme","won")],
    reviews: [rv("PowerDrama_Fan",10,"The greatest final season in television history. Shakespearean in every sense."),rv("PeakTV_Watcher",10,"Brian Cox and Jeremy Strong are two of the finest actors of their generation."),rv("BusinessDrama_X",9,"Every character is monstrous yet completely compelling. Unmissable television.",false)],
    similarMovieIds: [201, 203, 204, 205],
  },
  {
    id: 203, title: "آخرین از ما", originalTitle: "The Last of Us", year: 2023, rating: 8.8, type: "TV", voteCount: 68943,
    duration: "50m", genres: ["درام", "علمی-تخیلی"], age: "TV-MA",
    img: "https://images.unsplash.com/photo-1509281373149-e957c6296406?w=400&h=600&fit=crop&auto=format",
    summary: "یک قاچاقچی و دختر جوانی آمریکای پس از آخرالزمانی را که در اثر عفونت قارچی کشنده ویران شده، طی می‌کنند.",
    cast: [c("Pedro Pascal","Joel Miller",0),c("Bella Ramsey","Ellie Williams",1),c("Anna Torv","Tess",2),c("Gabriel Luna","Tommy Miller",3),c("Merle Dandridge","Marlene",4),c("Nick Offerman","Bill",5)],
    crew: [cr("Craig Mazin","Creator / Showrunner"),cr("Neil Druckmann","Creator / Executive Producer"),cr("Jasmila Žbanić","Director"),cr("Eben Bolter","Cinematographer"),cr("Gustavo Santaolalla","Original Score"),cr("Timothy Good","Film Editor")],
    awards: [aw(2023,"Primetime Emmy","Outstanding Drama Series","nominated"),aw(2023,"Primetime Emmy","Outstanding Supporting Actor (Offerman)","won"),aw(2023,"Golden Globe","Best TV Series – Drama","nominated"),aw(2023,"Critics Choice","Best Drama Series","nominated"),aw(2023,"SAG Award","Outstanding Cast – Drama","nominated"),aw(2023,"BAFTA","Best International Programme","nominated")],
    reviews: [rv("GameAdaptFan",10,"The finest video game adaptation ever made. Respectful, expanded, and emotionally shattering."),rv("PostApoc_Lover",9,"Pedro Pascal and Bella Ramsey have extraordinary chemistry. Episode 3 is television history."),rv("HorrorDrama_X",8,"Shifts the zombie genre into pure emotional territory. Gut-wrenching from start to finish.",true)],
    similarMovieIds: [201, 202, 204, 205],
  },
  {
    id: 204, title: "جدایی", originalTitle: "Severance", year: 2022, rating: 8.6, type: "TV", voteCount: 49821,
    duration: "45m", genres: ["علمی-تخیلی", "هیجان‌انگیز"], age: "TV-14",
    img: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=400&h=600&fit=crop&auto=format",
    summary: "کارمندان یک شرکت مرموز تحت روندی قرار می‌گیرند که خاطرات کاری و شخصی آن‌ها را از هم جدا می‌کند.",
    cast: [c("Adam Scott","Mark Scout",0),c("Britt Lower","Helly R.",1),c("Zach Cherry","Dylan George",2),c("John Turturro","Irving Bailiff",3),c("Patricia Arquette","Harmony Cobel",4),c("Christopher Walken","Burt Goodman",5)],
    crew: [cr("Dan Erickson","Creator"),cr("Ben Stiller","Director / Executive Producer"),cr("Aoife McArdle","Director"),cr("Jessica Lee Gagné","Cinematographer"),cr("Theodore Shapiro","Original Score"),cr("Geoffrey Richman","Film Editor")],
    awards: [aw(2022,"Primetime Emmy","Outstanding Drama Series","nominated"),aw(2022,"Golden Globe","Best TV Series – Drama","nominated"),aw(2022,"Critics Choice","Best Drama Series","nominated"),aw(2022,"Screen Actors Guild","Outstanding Cast – Drama","nominated"),aw(2022,"BAFTA","Best International Programme","nominated"),aw(2023,"Saturn Award","Best Science Fiction Television Series","won")],
    reviews: [rv("ScifiMystery_Fan",10,"The most original concept on television in years. Every episode ends with pure dread."),rv("OfficeHorror_X",9,"Ben Stiller directs with such precise eeriness. The world-building is flawless."),rv("MindBend_Watcher",8,"Adam Scott is perfectly cast. The season finale will haunt you for weeks.",true)],
    similarMovieIds: [202, 203, 205, 201],
  },
  {
    id: 205, title: "شوگان", originalTitle: "Shogun", year: 2024, rating: 8.5, type: "TV", voteCount: 38764,
    duration: "55m", genres: ["درام", "تاریخی"], age: "TV-MA",
    img: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=400&h=600&fit=crop&auto=format",
    summary: "یک ملوان انگلیسی در دسیسه‌های سیاسی ژاپن فئودالی قرن ۱۶۰۰ درگیر می‌شود.",
    cast: [c("Hiroyuki Sanada","Yoshii Toranaga",0),c("Cosmo Jarvis","John Blackthorne",1),c("Anna Sawai","Toda Mariko",2),c("Tadanobu Asano","Kashigi Yabushige",3),c("Takehiro Hira","Ishido Kazunari",4),c("Moeka Hoshi","Usami Fuji",5)],
    crew: [cr("Rachel Kondo","Showrunner"),cr("Caillin Puente","Executive Producer"),cr("Jonathan van Tulleken","Director"),cr("Christopher Ross","Cinematographer"),cr("Atticus Ross","Original Score"),cr("Victoria Boydell","Film Editor")],
    awards: [aw(2024,"Primetime Emmy","Outstanding Drama Series","won"),aw(2024,"Primetime Emmy","Outstanding Lead Actor (Sanada)","won"),aw(2024,"Golden Globe","Best TV Series – Drama","won"),aw(2024,"SAG Award","Outstanding Cast – Drama","won"),aw(2024,"Critics Choice","Best Drama Series","won"),aw(2024,"BAFTA","Best International Programme","nominated")],
    reviews: [rv("SamuraiDrama_Fan",10,"The most visually stunning prestige TV of 2024. Sanada is an absolute legend."),rv("HistoricalEpic_X",10,"Every frame is a painting. The cultural authenticity and depth are unparalleled."),rv("FXDrama_Watcher",9,"A complete reimagining that surpasses the original miniseries in every possible way.",false)],
    similarMovieIds: [202, 204, 201, 203],
  },
];

export const COMING_SOON: ComingSoonData[] = [
  { id: 101, title: "فوریوسا: حماسه مکس دیوانه", originalTitle: "Furiosa: A Mad Max Saga", year: 2024, type: "Movie", releaseDate: "۲۴ می ۲۰۲۴", genres: ["اکشن", "علمی-تخیلی"], img: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=400&h=600&fit=crop&auto=format" },
  { id: 102, title: "بیگانه: رومولوس", originalTitle: "Alien: Romulus", year: 2024, type: "Movie", releaseDate: "۱۶ آگوست ۲۰۲۴", genres: ["ترسناک", "علمی-تخیلی"], img: "https://images.unsplash.com/photo-1531306728370-e2ebd9d7bb99?w=400&h=600&fit=crop&auto=format" },
  { id: 103, title: "ددپول و ولورین", originalTitle: "Deadpool & Wolverine", year: 2024, type: "Movie", releaseDate: "۲۶ ژوئیه ۲۰۲۴", genres: ["اکشن", "کمدی"], img: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop&auto=format" },
  { id: 104, title: "پنگوئن", originalTitle: "The Penguin", year: 2024, type: "TV", releaseDate: "۱۹ سپتامبر ۲۰۲۴", genres: ["جنایی", "درام"], img: "https://images.unsplash.com/photo-1559583985-c80d8ad9b29f?w=400&h=600&fit=crop&auto=format" },
  { id: 105, title: "گلادیاتور ۲", originalTitle: "Gladiator II", year: 2024, type: "Movie", releaseDate: "۲۲ نوامبر ۲۰۲۴", genres: ["اکشن", "درام"], img: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400&h=600&fit=crop&auto=format" },
];

// Seed ratings data
export const SEED_RATINGS: RatedEntry[] = MOVIES.slice(0, 8).map((m, i) => ({
  id: m.id,
  title: m.title,
  img: m.img,
  type: m.type,
  score: [9, 7, 8, 6, 10, 8, 7, 9][i],
  review: [
    "A masterpiece of modern cinema. Villeneuve delivers on every single level.",
    "Nolan at his absolute best. The practical effects alone deserve every award available.",
    "Lanthimos crafts something genuinely unlike anything else currently in theaters.",
    "Scorsese proves he still has profound stories worth telling at this scale.",
    "A quiet, devastating film that lingers long after the final credits roll.",
    "The performances are haunting and the cinematography is breathtaking throughout.",
    "A bold and provocative film that will divide audiences but rewards patience.",
    "",
  ][i],
  date: ["Mar 12, 2024", "Jan 28, 2024", "Feb 4, 2024", "Nov 15, 2023", "Dec 3, 2023", "Oct 22, 2023", "Sep 18, 2023", "Aug 5, 2023"][i],
}));
