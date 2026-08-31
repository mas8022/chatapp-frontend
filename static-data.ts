type Contact = {
  id: number;
  name: string;
  username: string;
  message: string;
  time: string;
  unread?: number;
  online?: boolean;
  avatar: string;
  initials: string;
};

export const contacts: Contact[] = [
  {
    id: 1,
    name: "امیرحسین احمدی",
    username: "@amir_dev",
    message: "دمت گرم، کدها رو بررسی می‌کنم.",
    time: "12:42",
    unread: 3,
    online: true,
    avatar: "",
    initials: "ا",
  },
  {
    id: 2,
    name: "سارا محمدی",
    username: "@sara_design",
    message: "طرح جدید خیلی خوب شده ✨",
    time: "11:18",
    online: true,
    avatar: "https://i.pravatar.cc/150?img=47",
    initials: "س",
  },
  {
    id: 3,
    name: "گروه برنامه‌نویسی",
    username: "@programmers",
    message: "رضا: کسی NestJS کار کرده؟",
    time: "10:30",
    unread: 12,
    avatar: "https://i.pravatar.cc/150?img=8",
    initials: "گ",
  },
  {
    id: 4,
    name: "علی رضایی",
    username: "@ali_rezaei",
    message: "فردا صحبت می‌کنیم.",
    time: "دیروز",
    avatar: "https://i.pravatar.cc/150?img=33",
    initials: "ع",
  },
  {
    id: 5,
    name: "نگار کریمی",
    username: "@negar_karimi",
    message: "فایل‌ها ارسال شد.",
    time: "دیروز",
    avatar: "https://i.pravatar.cc/150?img=44",
    initials: "ن",
  },
  {
    id: 6,
    name: "محمد حسینی",
    username: "@mohammad_dev",
    message: "جلسه ساعت ۵ اوکیه؟",
    time: "شنبه",
    online: true,
    avatar: "https://i.pravatar.cc/150?img=14",
    initials: "م",
  },
  {
    id: 7,
    name: "پروژه فروشگاه",
    username: "@shop_project",
    message: "آخرین تغییرات روی گیت قرار گرفت.",
    time: "شنبه",
    unread: 2,
    avatar: "https://i.pravatar.cc/150?img=5",
    initials: "پ",
  },
];
