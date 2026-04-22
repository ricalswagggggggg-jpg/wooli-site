import { ShopReplica, type ShopCategory, type ShopInfo } from "@/components/shop-replica";
import shopData from "@/data/wooli-shop-local.json";

const LEGO_NEW_ITEMS: ShopCategory["items"] = [
  { _id: "lego-strawberry-aloe", name: "Relx 乐高积木 草莓芦荟", price: 20, photo: "/lego-bricks/01-strawberry-aloe.jpg", desc: "Ice Strawberry Aloe" },
  { _id: "lego-blackcurrant-mint", name: "Relx 乐高积木 黑加仑薄荷", price: 20, photo: "/lego-bricks/02-blackcurrant-mint.jpg", desc: "Ice Black Currant Mint" },
  { _id: "lego-longjing", name: "Relx 乐高积木 龙井", price: 20, photo: "/lego-bricks/03-longjing.jpg", desc: "Ice Longjing" },
  { _id: "lego-pocari-sweat", name: "Relx 乐高积木 宝矿力", price: 20, photo: "/lego-bricks/04-pocari-sweat.jpg", desc: "Electro Zest" },
  { _id: "lego-rose-ice", name: "Relx 乐高积木 玫瑰冰", price: 20, photo: "/lego-bricks/05-rose-ice.jpg", desc: "Forest Rose" },
  { _id: "lego-coconut-water", name: "Relx 乐高积木 椰子水", price: 20, photo: "/lego-bricks/06-coconut-water.jpg", desc: "Fresh Coconut" },
  { _id: "lego-mung-bean", name: "Relx 乐高积木 绿豆", price: 20, photo: "/lego-bricks/07-mung-bean.jpg", desc: "Bean Chill" },
  { _id: "lego-snow-pear", name: "Relx 乐高积木 冰糖雪梨", price: 20, photo: "/lego-bricks/08-snow-pear.jpg", desc: "Snow Pear" },
  { _id: "lego-gardenia-tea", name: "Relx 乐高积木 栀子花茶", price: 20, photo: "/lego-bricks/09-gardenia-tea.jpg", desc: "Gardenia Tea" },
  { _id: "lego-sakura-grape", name: "Relx 乐高积木 樱花青提", price: 20, photo: "/lego-bricks/10-sakura-grape.jpg", desc: "Sakura Grape" },
  { _id: "lego-hawthorn-ice", name: "Relx 乐高积木 山楂冰", price: 20, photo: "/lego-bricks/11-hawthorn-ice.jpg", desc: "Ice Hawthorn" },
  { _id: "lego-plum-green-tea", name: "Relx 乐高积木 青梅绿茶", price: 20, photo: "/lego-bricks/12-plum-green-tea.jpg", desc: "Plum Tea" },
  { _id: "lego-coconut-water-2", name: "Relx 乐高积木 椰子水", price: 20, photo: "/lego-bricks/13-coconut-water-2.jpg", desc: "Coconut Water" },
  { _id: "lego-mung-bean-milkshake", name: "Relx 乐高积木 绿豆奶昔", price: 20, photo: "/lego-bricks/14-mung-bean-milkshake.jpg", desc: "Bean Milkshake" },
  { _id: "lego-strawberry", name: "Relx 乐高积木 草莓", price: 20, photo: "/lego-bricks/15-strawberry.jpg", desc: "Strawberry" },
  { _id: "lego-mineral-water", name: "Relx 乐高积木 矿泉水", price: 20, photo: "/lego-bricks/16-mineral-water.jpg", desc: "Mineral Water" },
  { _id: "lego-green-apple", name: "Relx 乐高积木 青苹果", price: 20, photo: "/lego-bricks/17-green-apple.jpg", desc: "Crisp Green" },
  { _id: "lego-emerald-melon", name: "Relx 乐高积木 绿宝石甜瓜", price: 20, photo: "/lego-bricks/18-emerald-melon.jpg", desc: "Emerald Melon" },
  { _id: "lego-taro-ice-cream", name: "Relx 乐高积木 香芋冰淇淋", price: 20, photo: "/lego-bricks/19-taro-ice-cream.jpg", desc: "Taro Ice Cream" },
  { _id: "lego-red-bean", name: "Relx 乐高积木 红豆", price: 20, photo: "/lego-bricks/20-red-bean.jpg", desc: "Red Bean" },
  { _id: "lego-lemon-pineapple", name: "Relx 乐高积木 柠檬菠萝", price: 20, photo: "/lego-bricks/21-lemon-pineapple.jpg", desc: "Lemon Pineapple" },
  { _id: "lego-passionfruit-green-tea", name: "Relx 乐高积木 百香果绿茶", price: 20, photo: "/lego-bricks/22-passionfruit-green-tea.jpg", desc: "Passionfruit Green Tea" },
  { _id: "lego-cola", name: "Relx 乐高积木 可乐", price: 20, photo: "/lego-bricks/23-cola.jpg", desc: "Cola" },
  { _id: "lego-device-orange", name: "Relx 乐高机器 橘色烟杆", price: 30, photo: "/lego-devices/24-orange-device.jpg", desc: "Orange Device" },
  { _id: "lego-device-purple", name: "Relx 乐高机器 紫色烟杆", price: 30, photo: "/lego-devices/25-purple-device.jpg", desc: "Purple Device" }
];

const LEGO_CATEGORY: ShopCategory = {
  _id: "relx-lego-bricks",
  name: "Relx 乐高积木 🌟",
  items: LEGO_NEW_ITEMS
};

const ICEBOMB_CATEGORY: ShopCategory = {
  _id: "icebomb-disposable",
  name: "Icebomb 冰爆一次性",
  items: [
    { _id: "icebomb-coconut-water", name: "Icebomb 冰爆 椰子水", price: 15, photo: "/icebomb/coconut-water.jpg", desc: "Coconut Water" },
    { _id: "icebomb-jasmine-milk-tea", name: "Icebomb 冰爆 茉莉奶茶", price: 15, photo: "/icebomb/jasmine-milk-tea.jpg", desc: "Jasmine Milk Tea" },
    { _id: "icebomb-miami-mint", name: "Icebomb 冰爆 迈阿密薄荷", price: 15, photo: "/icebomb/miami-mint.jpg", desc: "Miami Mint" },
    { _id: "icebomb-green-apple-ice", name: "Icebomb 冰爆 青苹果冰", price: 15, photo: "/icebomb/green-apple-ice.jpg", desc: "Green Apple Ice" },
    { _id: "icebomb-banana-freeze", name: "Icebomb 冰爆 香蕉冰沙", price: 15, photo: "/icebomb/banana-freeze.jpg", desc: "Banana Freeze" },
    { _id: "icebomb-green-grape-ice", name: "Icebomb 冰爆 青提冰", price: 15, photo: "/icebomb/green-grape-ice.jpg", desc: "Green Grape Ice" },
    { _id: "icebomb-longjing-tea", name: "Icebomb 冰爆 龙井茶", price: 15, photo: "/icebomb/longjing-tea.jpg", desc: "Longjing Tea" },
    { _id: "icebomb-kiwi-blast", name: "Icebomb 冰爆 奇异果", price: 15, photo: "/icebomb/kiwi-blast.jpg", desc: "Kiwi Blast" },
    { _id: "icebomb-fresh-lemon", name: "Icebomb 冰爆 鲜果柠檬", price: 15, photo: "/icebomb/fresh-lemon.jpg", desc: "Fresh Lemon" },
    { _id: "icebomb-passion-grapefruit", name: "Icebomb 冰爆 百香果西柚", price: 15, photo: "/icebomb/passion-grapefruit.jpg", desc: "Passion Grapefruit" },
    { _id: "icebomb-lemon-pineapple", name: "Icebomb 冰爆 柠檬菠萝", price: 15, photo: "/icebomb/lemon-pineapple.jpg", desc: "Lemon Pineapple" },
    { _id: "icebomb-peach-oolong-tea", name: "Icebomb 冰爆 蜜桃乌龙茶", price: 15, photo: "/icebomb/peach-oolong-tea.jpg", desc: "Peach Oolong Tea" },
    { _id: "icebomb-guava-ice", name: "Icebomb 冰爆 番石榴冰", price: 15, photo: "/icebomb/guava-ice.jpg", desc: "Guava Ice" },
    { _id: "icebomb-strawberry-ice", name: "Icebomb 冰爆 草莓冰", price: 15, photo: "/icebomb/strawberry-ice.jpg", desc: "Strawberry Ice" },
    { _id: "icebomb-watermelon-ice", name: "Icebomb 冰爆 西瓜冰", price: 15, photo: "/icebomb/watermelon-ice.jpg", desc: "Watermelon Ice" },
    { _id: "icebomb-lychee-ice", name: "Icebomb 冰爆 荔枝冰", price: 15, photo: "/icebomb/lychee-ice.jpg", desc: "Lychee Ice" }
  ]
};

type HomePageProps = {
  searchParams?: {
    category?: string;
  };
};

export default function HomePage({ searchParams }: HomePageProps) {
  const shop = (shopData.content?.shop ?? {
    name: "雾里小铺wooli",
    currency: "$"
  }) as ShopInfo;

  const shopWithCustomLogo: ShopInfo = {
    ...shop,
    logo: "/site-logo.jpg"
  };

  const baseMenu = ((shopData.content?.menu ?? []).filter(
    (category) => Array.isArray(category.items) && category.items.length > 0
  ) as ShopCategory[]);

  const originalLegoItems =
    baseMenu
      .find((category) => category.name.includes("乐高积木"))
      ?.items.filter((item) => item.name !== "乐高机器不单卖‼️") ?? [];

  const mergedLegoCategory: ShopCategory = {
    ...LEGO_CATEGORY,
    items: [
      ...originalLegoItems.slice(0, 1),
      ...LEGO_NEW_ITEMS.filter((item) => item._id === "lego-device-orange" || item._id === "lego-device-purple"),
      ...originalLegoItems.slice(1),
      ...LEGO_NEW_ITEMS.filter((item) => item._id !== "lego-device-orange" && item._id !== "lego-device-purple")
    ]
  };

  const menu = baseMenu.map((category) =>
    category.name.includes("乐高积木") ? mergedLegoCategory : category
  );
  const insertionIndex = menu.findIndex((category) => category.name === "Icemax 一次性");

  if (insertionIndex >= 0) {
    menu.splice(insertionIndex + 1, 0, ICEBOMB_CATEGORY);
  } else {
    menu.push(ICEBOMB_CATEGORY);
  }

  const requestedCategory = searchParams?.category?.trim();
  const initialCategoryId =
    menu.find((category) => category.name === requestedCategory)?._id ??
    undefined;

  return (
    <ShopReplica
      initialCategoryId={initialCategoryId}
      menu={menu}
      shop={shopWithCustomLogo}
    />
  );
}
