import { ShopReplica, type ShopCategory, type ShopInfo } from "@/components/shop-replica";
import shopData from "@/data/wooli-shop-local.json";

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

export default function HomePage() {
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

  const menu = [...baseMenu];
  const insertionIndex = menu.findIndex((category) => category.name === "Icemax 一次性");

  if (insertionIndex >= 0) {
    menu.splice(insertionIndex + 1, 0, ICEBOMB_CATEGORY);
  } else {
    menu.push(ICEBOMB_CATEGORY);
  }

  return <ShopReplica menu={menu} shop={shopWithCustomLogo} />;
}
