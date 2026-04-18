"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

export type ShopItem = {
  _id: string;
  name: string;
  price: number | string | null;
  photo?: string;
  desc?: string;
};

export type ShopCategory = {
  _id: string;
  name: string;
  items: ShopItem[];
};

export type ShopInfo = {
  name: string;
  desc?: string;
  logo?: string;
  tips?: string;
  currency?: string;
  address?: string;
  tel?: string;
};

type CheckoutForm = {
  fulfillment: "shipping" | "delivery" | "pickup";
  name: string;
  phone: string;
  address: string;
  note: string;
};

type ShopReplicaProps = {
  menu: ShopCategory[];
  shop: ShopInfo;
};

type CartEntry = {
  id: string;
  count: number;
  item: ShopItem;
  unitPrice: number;
  total: number;
  cartLabel: string;
};

type PromoAllocation = {
  freeCount: number;
  machineGiftCount: number;
};

type PromoSummary = {
  subtotal: number;
  discount: number;
  finalTotal: number;
  freeItemCounts: Record<string, number>;
  tierDescriptions: string[];
};

const CART_STORAGE_KEY = "wooli-cart";

function proxiedImage(src?: string, label?: string) {
  if (!src) return "";
  if (src.startsWith("/") && !src.startsWith("/photo/")) return src;
  const params = new URLSearchParams({
    src
  });

  if (label) {
    params.set("label", label);
  }

  return `/api/image?${params.toString()}`;
}

function normalizePrice(price: ShopItem["price"]) {
  const value = Number(price ?? 0);
  return Number.isFinite(value) ? value : 0;
}

function formatPrice(price: number, currency = "$") {
  return `${currency}${price.toFixed(2)}`;
}

function buildCartIndex(cart: Record<string, number>, menu: ShopCategory[]) {
  const lookup = new Map<string, ShopItem>();
  const categoryLookup = new Map<string, string>();

  menu.forEach((category) => {
    category.items.forEach((item) => {
      lookup.set(item._id, item);
      categoryLookup.set(item._id, category.name);
    });
  });

  return Object.entries(cart)
    .filter(([, count]) => count > 0)
    .map(([id, count]) => {
      const item = lookup.get(id);
      if (!item) return null;

      const unitPrice = normalizePrice(item.price);
      return {
        id,
        count,
        item,
        unitPrice,
        total: unitPrice * count,
        cartLabel: buildCartLabel(item.name, categoryLookup.get(id) ?? "")
      };
    })
    .filter(Boolean) as CartEntry[];
}

function buildCartLabel(name: string, categoryName: string) {
  const normalized = name.replace(/^新品·/u, "").trim();
  const cleanCategory = categoryName
    .replace(/[🌟✨🔥🚬🇯🇵]/gu, "")
    .replace(/\s+/gu, " ")
    .trim();

  if (/机器|煙杆|烟杆|烟桿|machine|杆/i.test(normalized)) {
    const withoutPrefix = normalized
      .replace(/^.*?[）)]/u, "")
      .replace(/^(Relx|RELX|Icemax|icemax|Icebomb|ICEBOMB|snowplus|Snowplus|SnowPlus)\s*/u, "")
      .replace(/^(六代烟杆|五代艺术家烟杆|烟杆|一次性)\s*/u, "")
      .trim();
    return withoutPrefix || normalized;
  }

  const byParen = normalized.replace(/^.*?[）)]/u, "").trim();
  if (byParen && byParen !== normalized) {
    return byParen;
  }

  const withoutCategory = normalized.replace(cleanCategory, "").trim();
  if (withoutCategory && withoutCategory !== normalized) {
    return withoutCategory;
  }

  const withoutCommonPrefix = normalized
    .replace(
      /^(Relx|RELX|Icemax|icemax|Icebomb|ICEBOMB|snowplus|Snowplus|SnowPlus)\s*/u,
      ""
    )
    .replace(/^冰爆\s*/u, "")
    .replace(/^(MagicGo\s+)?(鸭嘴兽\s+)?一次性\s*/u, "")
    .trim();
  if (withoutCommonPrefix && withoutCommonPrefix !== normalized) {
    return withoutCommonPrefix;
  }

  const segments = normalized.split(/\s+/u).filter(Boolean);
  return segments.at(-1) ?? normalized;
}

function isMachineGiftCandidate(entry: CartEntry) {
  return (
    entry.unitPrice === 30 &&
    /机器|煙杆|烟杆|烟桿|machine|杆/i.test(entry.item.name)
  );
}

function solveTierAllocation(
  selectedCount: number,
  availableMachineCount: number
): PromoAllocation {
  if (selectedCount <= 0) {
    return { freeCount: 0, machineGiftCount: 0 };
  }

  for (
    let machineGiftCount = Math.min(Math.floor(selectedCount / 10), availableMachineCount);
    machineGiftCount >= 0;
    machineGiftCount -= 1
  ) {
    for (let paidCount = 0; paidCount <= selectedCount; paidCount += 1) {
      const tenGroups = Math.floor(paidCount / 10);
      if (machineGiftCount > tenGroups) {
        continue;
      }

      const freeCount =
        (tenGroups - machineGiftCount) * 3 + (paidCount % 10 >= 5 ? 1 : 0);

      if (selectedCount <= paidCount + freeCount) {
        return {
          freeCount: selectedCount - paidCount,
          machineGiftCount
        };
      }
    }
  }

  return { freeCount: 0, machineGiftCount: 0 };
}

function buildPromoSummary(cartItems: CartEntry[], currency: string): PromoSummary {
  const subtotal = cartItems.reduce((sum, entry) => sum + entry.total, 0);
  const freeItemCounts: Record<string, number> = {};
  const tierDescriptions: string[] = [];
  let remainingMachineCount = cartItems
    .filter(isMachineGiftCandidate)
    .reduce((sum, entry) => sum + entry.count, 0);

  [15, 12].forEach((price) => {
    const tierEntries = cartItems.filter(
      (entry) => entry.unitPrice === price && !isMachineGiftCandidate(entry)
    );
    const selectedCount = tierEntries.reduce((sum, entry) => sum + entry.count, 0);

    if (selectedCount === 0) {
      return;
    }

    const allocation = solveTierAllocation(selectedCount, remainingMachineCount);
    remainingMachineCount -= allocation.machineGiftCount;

    let pendingFreeCount = allocation.freeCount;
    [...tierEntries].reverse().forEach((entry) => {
      if (pendingFreeCount <= 0) {
        return;
      }

      const freeCount = Math.min(entry.count, pendingFreeCount);
      freeItemCounts[entry.id] = (freeItemCounts[entry.id] ?? 0) + freeCount;
      pendingFreeCount -= freeCount;
    });

    if (allocation.freeCount > 0 || allocation.machineGiftCount > 0) {
      const parts: string[] = [];
      if (allocation.freeCount > 0) {
        parts.push(`${allocation.freeCount} 件 ${formatPrice(price, currency)} 商品免费`);
      }
      if (allocation.machineGiftCount > 0) {
        parts.push(`${allocation.machineGiftCount} 个 30 元机器/烟杆免费`);
      }
      tierDescriptions.push(parts.join("，"));
    }
  });

  let pendingMachineFreeCount = cartItems
    .filter(isMachineGiftCandidate)
    .reduce((sum, entry) => sum + entry.count, 0) - remainingMachineCount;

  cartItems
    .filter(isMachineGiftCandidate)
    .forEach((entry) => {
      if (pendingMachineFreeCount <= 0) {
        return;
      }

      const freeCount = Math.min(entry.count, pendingMachineFreeCount);
      freeItemCounts[entry.id] = (freeItemCounts[entry.id] ?? 0) + freeCount;
      pendingMachineFreeCount -= freeCount;
    });

  const discount = cartItems.reduce((sum, entry) => {
    const freeCount = freeItemCounts[entry.id] ?? 0;
    return sum + freeCount * entry.unitPrice;
  }, 0);

  return {
    subtotal,
    discount,
    finalTotal: subtotal - discount,
    freeItemCounts,
    tierDescriptions
  };
}

function getFreeCount(entryId: string, promoSummary: PromoSummary) {
  return promoSummary.freeItemCounts[entryId] ?? 0;
}

function getPayableTotal(entry: CartEntry, promoSummary: PromoSummary) {
  return Math.max(0, entry.total - getFreeCount(entry.id, promoSummary) * entry.unitPrice);
}

export function ShopReplica({ menu, shop }: ShopReplicaProps) {
  const [activeCategory, setActiveCategory] = useState(
    menu.find((category) => category.name === "Relx 烟弹 极凉三颗装")?._id ??
      menu[0]?._id ??
      ""
  );
  const [cart, setCart] = useState<Record<string, number>>({});
  const [selectedItem, setSelectedItem] = useState<ShopItem | null>(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [mobileCategoryOpen, setMobileCategoryOpen] = useState(false);
  const [snapshotSaving, setSnapshotSaving] = useState(false);
  const checkoutScrollRef = useRef<HTMLDivElement | null>(null);
  const [checkoutForm, setCheckoutForm] = useState<CheckoutForm>({
    fulfillment: "shipping",
    name: "",
    phone: "",
    address: "",
    note: ""
  });

  const cartItems = useMemo(() => buildCartIndex(cart, menu), [cart, menu]);
  const promoSummary = useMemo(
    () => buildPromoSummary(cartItems, shop.currency || "$"),
    [cartItems, shop.currency]
  );
  const totalCount = useMemo(
    () => cartItems.reduce((sum, entry) => sum + entry.count, 0),
    [cartItems]
  );
  const totalPrice = promoSummary.finalTotal;

  useEffect(() => {
    try {
      const rawCart = window.localStorage.getItem(CART_STORAGE_KEY);
      if (!rawCart) {
        return;
      }

      const parsedCart = JSON.parse(rawCart) as Record<string, number>;
      if (parsedCart && typeof parsedCart === "object") {
        const sanitized = Object.fromEntries(
          Object.entries(parsedCart).filter(
            ([, count]) => Number.isFinite(count) && count > 0
          )
        );
        setCart(sanitized);
      }
    } catch {
      window.localStorage.removeItem(CART_STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    if (Object.keys(cart).length === 0) {
      window.localStorage.removeItem(CART_STORAGE_KEY);
      return;
    }

    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    const shouldLock =
      checkoutOpen || Boolean(selectedItem) || mobileCategoryOpen;

    if (!shouldLock) {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      return;
    }

    const scrollY = window.scrollY;
    const previousOverflow = document.body.style.overflow;
    const previousPosition = document.body.style.position;
    const previousTop = document.body.style.top;
    const previousWidth = document.body.style.width;
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.position = previousPosition;
      document.body.style.top = previousTop;
      document.body.style.width = previousWidth;
      window.scrollTo(0, scrollY);
    };
  }, [checkoutOpen, selectedItem, mobileCategoryOpen]);

  useEffect(() => {
    if (!checkoutOpen) {
      return;
    }

    function blockBackgroundScroll(event: TouchEvent | WheelEvent) {
      const container = checkoutScrollRef.current;
      const target = event.target;

      if (!(target instanceof Node) || !container) {
        event.preventDefault();
        return;
      }

      if (!container.contains(target)) {
        event.preventDefault();
      }
    }

    document.addEventListener("touchmove", blockBackgroundScroll, {
      passive: false
    });
    document.addEventListener("wheel", blockBackgroundScroll, {
      passive: false
    });

    return () => {
      document.removeEventListener("touchmove", blockBackgroundScroll);
      document.removeEventListener("wheel", blockBackgroundScroll);
    };
  }, [checkoutOpen]);

  const contactLink = useMemo(() => {
    const match = shop.desc?.match(/客服微信[:：]\s*([^\s\n]+)/);
    return match?.[1] ?? "";
  }, [shop.desc]);

  function updateCount(itemId: string, delta: number) {
    setCart((current) => {
      const nextCount = Math.max(0, (current[itemId] ?? 0) + delta);
      if (nextCount === 0) {
        const { [itemId]: _, ...rest } = current;
        return rest;
      }

      return {
        ...current,
        [itemId]: nextCount
      };
    });
  }

  const displayedCategory =
    menu.find((category) => category._id === activeCategory) ?? menu[0] ?? null;

  function selectCategory(categoryId: string) {
    setActiveCategory(categoryId);
    setMobileCategoryOpen(false);
  }

  function updateCheckoutField(field: keyof CheckoutForm, value: string) {
    setCheckoutForm((current) => ({
      ...current,
      [field]: value
    }));
  }

  function clearCart() {
    setCart({});
  }

  function openCheckout() {
    if (totalCount === 0) {
      return;
    }

    setCheckoutOpen(true);
  }

  function getFulfillmentLabel() {
    if (checkoutForm.fulfillment === "shipping") return "邮寄";
    if (checkoutForm.fulfillment === "delivery") return "送货";
    return "自取";
  }

  async function downloadOrderSnapshot() {
    if (cartItems.length === 0) {
      return;
    }

    setSnapshotSaving(true);

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    if (!context) {
      setSnapshotSaving(false);
      return;
    }

    const width = 1400;
    const columnGap = 28;
    const sidePadding = 48;
    const topPadding = 52;
    const cardHeight = 108;
    const columns = 2;
    const rows = Math.ceil(cartItems.length / columns);
    const itemsHeight = rows * cardHeight + Math.max(0, rows - 1) * 14;
    const contactHeight = 220;
    const promoHeight = promoSummary.tierDescriptions.length > 0 ? 88 : 0;
    const footerHeight = 180;
    const height =
      topPadding + 190 + contactHeight + itemsHeight + promoHeight + footerHeight;

    canvas.width = width;
    canvas.height = height;

    context.fillStyle = "#f6f2ea";
    context.fillRect(0, 0, width, height);

    context.fillStyle = "#ffffff";
    context.strokeStyle = "#dbcdb8";
    context.lineWidth = 3;
    context.beginPath();
    context.roundRect(24, 24, width - 48, height - 48, 28);
    context.fill();
    context.stroke();

    context.fillStyle = "#8f6234";
    context.font = "600 28px Arial";
    context.fillText("雾里小铺 Wooli", sidePadding, topPadding + 10);

    context.fillStyle = "#2d1b0f";
    context.font = "700 46px Arial";
    context.fillText("确认订单", sidePadding, topPadding + 72);

    context.fillStyle = "#7a624d";
    context.font = "26px Arial";
    context.fillText(
      `${getFulfillmentLabel()} · ${totalCount} 件商品 · 合计 ${formatPrice(totalPrice, currency)}`,
      sidePadding,
      topPadding + 116
    );

    const infoTop = topPadding + 150;
    context.fillStyle = "#faf4eb";
    context.strokeStyle = "#eadfce";
    context.lineWidth = 2;
    context.beginPath();
    context.roundRect(sidePadding, infoTop, width - sidePadding * 2, contactHeight, 24);
    context.fill();
    context.stroke();

    context.fillStyle = "#8a6844";
    context.font = "600 24px Arial";
    context.fillText("联系信息", sidePadding + 24, infoTop + 40);

    context.fillStyle = "#2d1b0f";
    context.font = "24px Arial";
    const infoLines = [
      `方式：${getFulfillmentLabel()}`,
      checkoutForm.name ? `姓名：${checkoutForm.name}` : "",
      checkoutForm.phone ? `电话：${checkoutForm.phone}` : "电话：",
      checkoutForm.address ? `地址：${checkoutForm.address}` : "",
      checkoutForm.note ? `备注：${checkoutForm.note}` : ""
    ].filter(Boolean);

    infoLines.forEach((line, index) => {
      context.fillText(line, sidePadding + 24, infoTop + 86 + index * 34);
    });

    const itemsTop = infoTop + contactHeight + 28;
    const cardWidth =
      (width - sidePadding * 2 - columnGap * (columns - 1)) / columns;

    cartItems.forEach((entry, index) => {
      const payableTotal = getPayableTotal(entry, promoSummary);
      const freeCount = getFreeCount(entry.id, promoSummary);
      const column = index % columns;
      const row = Math.floor(index / columns);
      const x = sidePadding + column * (cardWidth + columnGap);
      const y = itemsTop + row * (cardHeight + 14);

      context.fillStyle = "#fffaf2";
      context.strokeStyle = "#ece0cf";
      context.lineWidth = 2;
      context.beginPath();
      context.roundRect(x, y, cardWidth, cardHeight, 20);
      context.fill();
      context.stroke();

      context.fillStyle = "#2d1b0f";
      context.font = "bold 22px Arial";
      context.fillText(entry.item.name.slice(0, 26), x + 22, y + 34);

      context.fillStyle = "#8a6844";
      context.font = "20px Arial";
      context.fillText(
        freeCount >= entry.count
          ? `单价 ${formatPrice(0, currency)}`
          : `单价 ${formatPrice(entry.unitPrice, currency)}`,
        x + 22,
        y + 64
      );
      if (freeCount > 0) {
        context.fillStyle = "#1f7a45";
        context.font = "bold 18px Arial";
        context.fillText(
          `赠送 ${freeCount} 件`,
          x + 22,
          y + 88
        );
      }

      context.fillStyle = "#8f6234";
      context.font = "bold 22px Arial";
      context.textAlign = "right";
      context.fillText(`x${entry.count}`, x + cardWidth - 22, y + 34);
      context.fillText(
        formatPrice(payableTotal, currency),
        x + cardWidth - 22,
        y + 64
      );
      context.textAlign = "left";
    });

    let footerTop = itemsTop + itemsHeight + 28;

    if (promoSummary.tierDescriptions.length > 0) {
      context.fillStyle = "#faf4eb";
      context.strokeStyle = "#eadfce";
      context.lineWidth = 2;
      context.beginPath();
      context.roundRect(sidePadding, footerTop, width - sidePadding * 2, 70, 24);
      context.fill();
      context.stroke();

      context.fillStyle = "#2d1b0f";
      context.font = "22px Arial";
      context.fillText(
        `优惠：${promoSummary.tierDescriptions.join("；")}`,
        sidePadding + 24,
        footerTop + 42
      );

      footerTop += 88;
    }

    context.fillStyle = "#2f2014";
    context.beginPath();
    context.roundRect(sidePadding, footerTop, width - sidePadding * 2, 124, 24);
    context.fill();

    context.fillStyle = "#f4d9a8";
    context.font = "600 22px Arial";
    context.fillText("发送给客服即可确认订单", sidePadding + 24, footerTop + 40);

    context.fillStyle = "#ffffff";
    context.font = "24px Arial";
    context.fillText(
      `客服微信：${contactLink || "wulixiaopu-nyc"}`,
      sidePadding + 24,
      footerTop + 80
    );
    context.textAlign = "right";
    context.font = "bold 28px Arial";
    context.fillText(
      promoSummary.discount > 0
        ? `总计 ${formatPrice(totalPrice, currency)}`
        : `总计 ${formatPrice(totalPrice, currency)}`,
      width - sidePadding - 24,
      footerTop + 80
    );
    context.textAlign = "left";

    try {
      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob((value) => resolve(value), "image/png");
      });

      if (!blob) {
        return;
      }

      const filename = `wooli-order-${Date.now()}.png`;
      const file = new File([blob], filename, { type: "image/png" });

      if (
        typeof navigator !== "undefined" &&
        "share" in navigator &&
        "canShare" in navigator &&
        navigator.canShare({ files: [file] })
      ) {
        await navigator.share({
          files: [file],
          title: "Wooli 购物车确认单",
          text: "请保存图片后发送给客服确认订单"
        });
        return;
      }

      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = filename;
      link.click();
      setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
    } catch (error) {
      if (!(error instanceof DOMException && error.name === "AbortError")) {
        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = `wooli-order-${Date.now()}.png`;
        link.click();
      }
    } finally {
      setSnapshotSaving(false);
    }
  }

  const currency = shop.currency || "$";
  const logo = proxiedImage(shop.logo, shop.name);

  return (
    <main className="min-h-screen bg-[#f6f2ea] pb-28 text-[#231815] sm:pb-28">
      <section className="mx-auto max-w-[1180px] px-2 pb-6 pt-2 sm:px-6 sm:pb-10 sm:pt-5">
        <div className="overflow-hidden rounded-[28px] border border-[#dbcdb8] bg-[linear-gradient(135deg,#fffdf9_0%,#f1e6d5_52%,#e8dac5_100%)] shadow-[0_24px_80px_rgba(94,64,35,0.12)]">
          <div className="border-b border-[#e3d8c7] px-3 py-3 sm:px-8 sm:py-8">
            <div className="flex items-start gap-3 sm:gap-5">
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-[20px] border border-[#d7c5aa] bg-white/80 shadow-sm sm:h-20 sm:w-20 sm:rounded-[24px]">
                {logo ? (
                  <Image
                    alt={shop.name}
                    className="h-full w-full object-cover"
                    height={160}
                    src={logo}
                    width={160}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xl font-semibold text-[#8a623b] sm:text-2xl">
                    W
                  </div>
                )}
              </div>

              <div className="flex-1">
                <div className="mb-2 inline-flex max-w-full rounded-full border border-[#d1bb9b] bg-[#fff8ec] px-2.5 py-1 text-[10px] font-semibold tracking-[0.14em] text-[#8d6335] sm:px-3 sm:text-xs sm:tracking-[0.18em]">
                  SAME PRODUCTS · SAME PRICES
                </div>
                <h1 className="text-[1.75rem] font-semibold tracking-tight text-[#2d1b0f] sm:text-4xl">
                  {shop.name}
                </h1>
                <p className="mt-1.5 max-w-4xl whitespace-pre-line text-[11px] leading-4.5 text-[#5f4835] line-clamp-3 sm:mt-3 sm:text-[15px] sm:leading-7 sm:line-clamp-none">
                  {shop.desc}
                </p>

                <div className="mt-2 flex flex-wrap gap-1.5 text-[11px] text-[#6d563f] sm:mt-5 sm:gap-3 sm:text-sm">
                  {shop.address ? (
                    <span className="rounded-full bg-white/70 px-2.5 py-1 sm:px-4 sm:py-2">
                      地址: {shop.address}
                    </span>
                  ) : null}
                  {shop.tel ? (
                    <span className="rounded-full bg-white/70 px-2.5 py-1 sm:px-4 sm:py-2">
                      电话: {shop.tel}
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-2 px-2 py-2 sm:gap-6 sm:px-5 sm:py-4 lg:grid-cols-[240px_minmax(0,1fr)]">
            <aside className="relative lg:sticky lg:top-4 lg:self-start">
              <div className="rounded-[18px] border border-[#e0d4c1] bg-white/80 p-2 backdrop-blur sm:rounded-[24px] sm:p-3">
                <button
                  className="flex w-full items-center justify-between rounded-2xl bg-[#fbf8f2] px-3 py-2 text-left"
                  onClick={() => setMobileCategoryOpen((open) => !open)}
                  type="button"
                >
                  <div>
                    <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#9b7b59] sm:text-xs sm:tracking-[0.22em]">
                      分类导航
                    </div>
                    <div className="mt-1 text-xs font-semibold text-[#5f4937] lg:hidden">
                      {displayedCategory?.name ?? "选择分类"}
                    </div>
                  </div>
                  <span className="text-sm text-[#8f6234]">
                    {mobileCategoryOpen ? "收起" : "展开"}
                  </span>
                </button>

                <div className="mt-2 hidden lg:block lg:space-y-2">
                  {menu.map((category) => {
                    const isActive = category._id === activeCategory;

                    return (
                      <button
                        className={[
                          "w-full rounded-2xl border px-4 py-3 text-left text-sm transition",
                          isActive
                            ? "border-[#8f6234] bg-[#8f6234] text-white shadow-[0_14px_34px_rgba(143,98,52,0.22)]"
                            : "border-[#eadfcd] bg-[#fbf8f2] text-[#5f4937] hover:border-[#c49a6c] hover:bg-white"
                        ].join(" ")}
                        key={category._id}
                        onClick={() => selectCategory(category._id)}
                        type="button"
                      >
                        {category.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {mobileCategoryOpen ? (
                <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-20 rounded-[18px] border border-[#e0d4c1] bg-[#fffdf8]/95 p-2 shadow-[0_18px_40px_rgba(70,44,20,0.14)] backdrop-blur lg:hidden">
                  <div className="max-h-[60vh] space-y-2 overflow-y-auto">
                    {menu.map((category) => {
                      const isActive = category._id === activeCategory;

                      return (
                        <button
                          className={[
                            "w-full rounded-2xl border px-3 py-2.5 text-left text-xs leading-4 transition",
                            isActive
                              ? "border-[#8f6234] bg-[#8f6234] text-white shadow-[0_14px_34px_rgba(143,98,52,0.22)]"
                              : "border-[#eadfcd] bg-[#fbf8f2] text-[#5f4937]"
                          ].join(" ")}
                          key={category._id}
                          onClick={() => selectCategory(category._id)}
                          type="button"
                        >
                          {category.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : null}
            </aside>

            <div className="space-y-6">
              {displayedCategory ? (
                  <section
                    className="rounded-[20px] border border-[#e4d8c8] bg-white/85 p-2.5 shadow-[0_18px_50px_rgba(70,44,20,0.06)] sm:rounded-[28px] sm:p-5"
                    key={displayedCategory._id}
                  >
                    <div className="mb-2 flex items-start justify-between gap-2 border-b border-[#efe5d8] pb-2 sm:mb-4 sm:items-end sm:gap-4 sm:pb-4">
                      <div>
                        <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#a17a52] sm:text-xs sm:tracking-[0.2em]">
                          Category
                        </div>
                        <h2 className="mt-1 text-lg font-semibold leading-5 text-[#2d1b0f] sm:text-2xl">
                          {displayedCategory.name}
                        </h2>
                      </div>
                      <div className="hidden shrink-0 rounded-full bg-[#f6ede1] px-3 py-1 text-xs text-[#8a6844] sm:block sm:text-sm">
                        {displayedCategory.items.length} 件
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3">
                      {displayedCategory.items.map((item) => {
                        const image = proxiedImage(item.photo, item.name);
                        const price = normalizePrice(item.price);
                        const count = cart[item._id] ?? 0;

                        return (
                          <article
                            className="group flex h-full flex-col overflow-hidden rounded-[16px] border border-[#eee3d3] bg-[#fffdfa] sm:rounded-[24px]"
                            key={item._id}
                          >
                            <button
                              className="relative block aspect-[0.86] overflow-hidden bg-[#f2e7d8] sm:aspect-[4/3]"
                              onClick={() => setSelectedItem(item)}
                              type="button"
                            >
                              {image ? (
                                <Image
                                  alt={item.name}
                                  className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                                  fill
                                  sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                                  src={image}
                                />
                              ) : (
                                <div className="flex h-full items-center justify-center text-sm text-[#8f7359]">
                                  暂无图片
                                </div>
                              )}
                              <div className="absolute left-2 top-2 rounded-full bg-white/92 px-2 py-0.5 text-[10px] font-semibold text-[#7f5b37] sm:left-3 sm:top-3 sm:px-3 sm:py-1 sm:text-xs">
                                {formatPrice(price, currency)}
                              </div>
                            </button>

                            <div className="flex flex-1 flex-col px-1.5 py-2 sm:px-4 sm:py-4">
                              <h3 className="line-clamp-2 text-[11px] font-semibold leading-3.5 text-[#29180f] sm:text-base sm:leading-6">
                                {item.name}
                              </h3>
                              {item.desc ? (
                                <p className="mt-1 hidden line-clamp-2 text-xs text-[#7a624d] sm:mt-2 sm:block sm:text-sm">
                                  {item.desc}
                                </p>
                              ) : null}

                              <div className="mt-1.5 flex flex-col gap-1 sm:mt-4 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
                                <div>
                                  <div className="text-[10px] uppercase tracking-[0.14em] text-[#a28463] sm:text-xs sm:tracking-[0.18em]">
                                    Price
                                  </div>
                                  <div className="text-xs font-semibold text-[#8f6234] sm:text-xl">
                                    {formatPrice(price, currency)}
                                  </div>
                                </div>

                                <div className="flex items-center justify-between gap-1 rounded-full border border-[#e7d7c2] bg-[#faf4eb] p-1">
                                  <button
                                    className="h-5 w-5 rounded-full bg-white text-xs text-[#7d5730] transition hover:bg-[#f2e4d0] sm:h-9 sm:w-9 sm:text-lg"
                                    onClick={() => updateCount(item._id, -1)}
                                    type="button"
                                  >
                                    -
                                  </button>
                                  <span className="min-w-3 text-center text-[10px] font-semibold text-[#4d3420] sm:min-w-8 sm:text-sm">
                                    {count}
                                  </span>
                                  <button
                                    className="h-5 w-5 rounded-full bg-[#8f6234] text-xs text-white transition hover:bg-[#754d26] sm:h-9 sm:w-9 sm:text-lg"
                                    onClick={() => updateCount(item._id, 1)}
                                    type="button"
                                  >
                                    +
                                  </button>
                                </div>
                              </div>
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  </section>
                ) : (
                <div className="rounded-[24px] border border-[#e3d7c5] bg-white/85 px-5 py-12 text-center text-[#7b624a]">
                  暂无商品数据
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {selectedItem ? (
        <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/45 p-4 sm:items-center">
          <div className="w-full max-w-2xl overflow-hidden rounded-[28px] bg-[#fffdf8] shadow-[0_24px_70px_rgba(0,0,0,0.26)]">
            <div className="grid gap-0 sm:grid-cols-[1.05fr_minmax(0,1fr)]">
              <div className="bg-[#f1e7d9]">
                {selectedItem.photo ? (
                  <Image
                    alt={selectedItem.name}
                    className="h-full w-full object-cover"
                    height={720}
                    src={proxiedImage(selectedItem.photo, selectedItem.name)}
                    width={720}
                  />
                ) : (
                  <div className="flex h-full min-h-64 items-center justify-center text-[#7e6247]">
                    暂无图片
                  </div>
                )}
              </div>

              <div className="flex flex-col px-5 py-5 sm:px-6 sm:py-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[#a17a52]">
                      Product Preview
                    </div>
                    <h3 className="mt-2 text-2xl font-semibold text-[#29180f]">
                      {selectedItem.name}
                    </h3>
                  </div>

                  <button
                    className="rounded-full border border-[#ead9c2] px-3 py-2 text-sm text-[#765535]"
                    onClick={() => setSelectedItem(null)}
                    type="button"
                  >
                    关闭
                  </button>
                </div>

                {selectedItem.desc ? (
                  <p className="mt-4 text-sm leading-7 text-[#705843]">
                    {selectedItem.desc}
                  </p>
                ) : null}

                <div className="mt-6 rounded-[24px] border border-[#e8dccd] bg-[#faf4eb] p-4">
                  <div className="text-xs uppercase tracking-[0.18em] text-[#a38361]">
                    当前价格
                  </div>
                  <div className="mt-2 text-3xl font-semibold text-[#8f6234]">
                    {formatPrice(normalizePrice(selectedItem.price), currency)}
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between rounded-full border border-[#eadfce] bg-white px-3 py-2">
                  <div>
                    <div className="text-xs uppercase tracking-[0.18em] text-[#a38361]">
                      数量
                    </div>
                    <div className="text-lg font-semibold text-[#382519]">
                      {cart[selectedItem._id] ?? 0}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      className="h-10 w-10 rounded-full bg-[#f2e4d1] text-lg text-[#7b552d]"
                      onClick={() => updateCount(selectedItem._id, -1)}
                      type="button"
                    >
                      -
                    </button>
                    <button
                      className="h-10 rounded-full bg-[#8f6234] px-5 text-sm font-semibold text-white"
                      onClick={() => updateCount(selectedItem._id, 1)}
                      type="button"
                    >
                      加入购物车
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {checkoutOpen ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/55 p-2 touch-none sm:p-4 sm:items-center">
          <div className="flex h-[min(88dvh,820px)] w-full max-w-[980px] flex-col overflow-hidden rounded-[26px] bg-[#fffdf8] shadow-[0_24px_80px_rgba(0,0,0,0.3)] touch-auto sm:max-h-[94vh] sm:rounded-[30px]">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#eee2d2] bg-[#fffdf8] px-3 py-3 sm:px-5">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.22em] text-[#a17a52]">
                  Confirm Cart
                </div>
                <h3 className="mt-1 text-xl font-semibold text-[#2d1b0f] sm:text-2xl">
                  确认购物车
                </h3>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  className="rounded-full border border-[#e4d2bb] px-3 py-2 text-xs text-[#765535] sm:px-4 sm:text-sm"
                  onClick={clearCart}
                  type="button"
                >
                  一键清空
                </button>
                <button
                  className="rounded-full border border-[#e4d2bb] px-3 py-2 text-xs text-[#765535] sm:px-4 sm:text-sm"
                  onClick={() => setCheckoutOpen(false)}
                  type="button"
                >
                  关闭
                </button>
              </div>
            </div>

            <div
              className="grid flex-1 gap-0 overflow-y-auto overscroll-contain touch-pan-y lg:grid-cols-[1.35fr_0.8fr]"
              ref={checkoutScrollRef}
            >
              <div className="border-b border-[#eee2d2] p-4 lg:border-b-0 lg:border-r sm:p-5">
                <div className="mb-3 flex items-center justify-between">
                  <div className="text-base font-semibold text-[#2d1b0f] sm:text-lg">
                    商品明细
                  </div>
                  <div className="rounded-full bg-[#f6ede1] px-3 py-1 text-xs text-[#8a6844] sm:text-sm">
                    {totalCount} 件
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {cartItems.map((entry) => {
                    const freeCount = getFreeCount(entry.id, promoSummary);
                    const payableTotal = getPayableTotal(entry, promoSummary);

                    return (
                    <div
                      className="rounded-[18px] border border-[#ece0cf] bg-[#fffaf2] px-2 py-2 sm:px-2.5"
                      key={entry.id}
                    >
                      <div className="flex items-start gap-1.5 sm:gap-2">
                        <div className="h-10 w-10 overflow-hidden rounded-xl bg-[#f1e7d9] sm:h-14 sm:w-14">
                        {entry.item.photo ? (
                          <Image
                            alt={entry.item.name}
                            className="h-full w-full object-cover"
                            height={56}
                            src={proxiedImage(entry.item.photo, entry.item.name)}
                            width={56}
                          />
                        ) : null}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="line-clamp-2 break-words text-[11px] font-semibold leading-4 text-[#2d1b0f] sm:text-sm">
                          {entry.cartLabel}
                        </div>
                        <div className="mt-0.5 text-[10px] text-[#8a6844] sm:text-xs">
                          单价{" "}
                          {formatPrice(
                            freeCount >= entry.count ? 0 : entry.unitPrice,
                            currency
                          )}
                        </div>
                        {freeCount > 0 ? (
                          <div className="mt-0.5 text-[10px] font-semibold text-[#1f7a45] sm:text-xs">
                            赠送 {freeCount} 件
                          </div>
                        ) : null}
                      </div>
                      <div className="min-w-[34px] text-right sm:min-w-[42px]">
                        <div className="text-[11px] font-semibold text-[#2d1b0f] sm:text-sm">
                          x {entry.count}
                        </div>
                        <div className="mt-0.5 text-[10px] text-[#8f6234] sm:text-sm">
                          {formatPrice(payableTotal, currency)}
                        </div>
                      </div>
                      </div>
                      <div className="mt-1.5 flex items-center justify-end gap-1">
                        <button
                          className="h-6 w-6 rounded-full border border-[#e4d2bb] bg-white text-xs text-[#7b552d] sm:h-7 sm:w-7 sm:text-sm"
                          onClick={() => updateCount(entry.id, -1)}
                          type="button"
                        >
                          -
                        </button>
                        <span className="min-w-4 text-center text-[11px] font-semibold text-[#4d3420] sm:min-w-5 sm:text-xs">
                          {entry.count}
                        </span>
                        <button
                          className="h-6 w-6 rounded-full bg-[#8f6234] text-xs text-white sm:h-7 sm:w-7 sm:text-sm"
                          onClick={() => updateCount(entry.id, 1)}
                          type="button"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  )})}
                </div>

                <div className="mt-3 rounded-[20px] border border-[#e8dccd] bg-[#faf4eb] p-3">
                  <div className="flex items-center justify-between text-xs text-[#7a624d] sm:text-sm">
                    <span>商品小计</span>
                    <span>{formatPrice(promoSummary.subtotal, currency)}</span>
                  </div>
                  {promoSummary.discount > 0 ? (
                    <div className="mt-2 flex items-center justify-between text-xs text-[#1f7a45] sm:text-sm">
                      <span>优惠减免</span>
                      <span>-{formatPrice(promoSummary.discount, currency)}</span>
                    </div>
                  ) : null}
                  <div className="mt-2 flex items-center justify-between text-xs text-[#7a624d] sm:text-sm">
                    <span>商品总数</span>
                    <span>{totalCount} 件</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-base font-semibold text-[#2d1b0f] sm:text-lg">
                    <span>合计</span>
                    <span>{formatPrice(totalPrice, currency)}</span>
                  </div>
                  {promoSummary.tierDescriptions.length > 0 ? (
                    <div className="mt-2 text-[11px] leading-5 text-[#7a624d] sm:text-xs">
                      {promoSummary.tierDescriptions.map((line) => (
                        <div key={line}>{line}</div>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="p-4 sm:p-5">
                <div className="rounded-[20px] border border-[#eadfce] bg-[#fffaf2] p-3">
                  <div className="text-base font-semibold text-[#2d1b0f] sm:text-lg">
                    联系信息
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {[
                      { id: "shipping", label: "邮寄" },
                      { id: "delivery", label: "送货" },
                      { id: "pickup", label: "自取" }
                    ].map((option) => {
                      const active = checkoutForm.fulfillment === option.id;

                      return (
                        <button
                          className={[
                            "rounded-full border px-3 py-1.5 text-xs font-semibold transition sm:px-4 sm:py-2 sm:text-sm",
                            active
                              ? "border-[#8f6234] bg-[#8f6234] text-white"
                              : "border-[#e7d7c2] bg-white text-[#7a624d] hover:border-[#bf925f]"
                          ].join(" ")}
                          key={option.id}
                          onClick={() =>
                            updateCheckoutField(
                              "fulfillment",
                              option.id as CheckoutForm["fulfillment"]
                            )
                          }
                          type="button"
                        >
                          {option.label}
                        </button>
                      );
                    })}
                  </div>
                  <div className="mt-3 space-y-2.5">
                    {checkoutForm.fulfillment === "shipping" ? (
                      <label className="block">
                        <div className="mb-1.5 text-xs text-[#7a624d] sm:text-sm">姓名</div>
                        <input
                          className="w-full rounded-2xl border border-[#e7d7c2] bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[#bf925f]"
                          onChange={(event) =>
                            updateCheckoutField("name", event.target.value)
                          }
                          placeholder="请输入姓名"
                          value={checkoutForm.name}
                        />
                      </label>
                    ) : null}
                    <label className="block">
                      <div className="mb-1.5 text-xs text-[#7a624d] sm:text-sm">电话</div>
                      <input
                        className="w-full rounded-2xl border border-[#e7d7c2] bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[#bf925f]"
                        onChange={(event) =>
                          updateCheckoutField("phone", event.target.value)
                        }
                        placeholder="请输入联系电话"
                        value={checkoutForm.phone}
                      />
                    </label>
                    {checkoutForm.fulfillment !== "pickup" ? (
                      <label className="block">
                        <div className="mb-1.5 text-xs text-[#7a624d] sm:text-sm">地址</div>
                        <input
                          className="w-full rounded-2xl border border-[#e7d7c2] bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[#bf925f]"
                          onChange={(event) =>
                            updateCheckoutField("address", event.target.value)
                          }
                          placeholder={
                            checkoutForm.fulfillment === "shipping"
                              ? "请输入邮寄地址"
                              : "请输入送货地址"
                          }
                          value={checkoutForm.address}
                        />
                      </label>
                    ) : null}
                    <label className="block">
                      <div className="mb-1.5 text-xs text-[#7a624d] sm:text-sm">备注</div>
                      <textarea
                        className="min-h-20 w-full rounded-2xl border border-[#e7d7c2] bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[#bf925f]"
                        onChange={(event) =>
                          updateCheckoutField("note", event.target.value)
                        }
                        placeholder="口味、配送或其他备注"
                        value={checkoutForm.note}
                      />
                    </label>
                  </div>
                </div>

                <div className="mt-3 rounded-[20px] border border-[#eadfce] bg-[#2f2014] p-3 text-white">
                  <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d7bf9b]">
                    下单步骤
                  </div>
                  <div className="mt-2.5 space-y-1.5 text-xs text-[#f2e5d2] sm:text-sm">
                    <p>1. 核对购物车商品和数量</p>
                    <p>2. 选择{getFulfillmentLabel()}方式并填写信息</p>
                    <p>3. 点击确认订单并保存购物车截图</p>
                    <p>4. 添加客服并发送截图付款</p>
                  </div>
                  {promoSummary.tierDescriptions.length > 0 ? (
                    <div className="mt-3 rounded-2xl bg-white/10 px-3 py-2.5 text-xs text-[#f5e7d3] sm:text-sm">
                      {promoSummary.tierDescriptions.map((line) => (
                        <div key={line}>{line}</div>
                      ))}
                    </div>
                  ) : null}
                  {shop.tips ? (
                    <div className="mt-3 rounded-2xl bg-white/10 px-3 py-2.5 text-xs text-[#f5e7d3] sm:text-sm">
                      {shop.tips}
                    </div>
                  ) : null}
                  {contactLink ? (
                    <div className="mt-3 rounded-2xl bg-[#f4d9a8] px-3 py-2.5 text-xs font-semibold text-[#513516] sm:text-sm">
                      客服微信：{contactLink}
                    </div>
                  ) : null}
                </div>

                <div className="mt-4 flex flex-col gap-2.5">
                  <button
                    className="rounded-full bg-[#8f6234] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#754d26]"
                    onClick={downloadOrderSnapshot}
                    type="button"
                  >
                    {snapshotSaving ? "正在生成订单图片..." : "确认订单并保存购物车截图"}
                  </button>
                  <button
                    className="rounded-full border border-[#d9c6ab] px-5 py-2.5 text-sm font-semibold text-[#6f4b28]"
                    onClick={() => setCheckoutOpen(false)}
                    type="button"
                  >
                    返回继续选购
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <div className="fixed bottom-2 right-2 z-30 w-[min(300px,calc(100%-16px))] sm:bottom-4 sm:right-4 sm:w-[320px]">
        <div className="overflow-hidden rounded-[22px] border border-[#d7c4aa] bg-[#2f2014] text-white shadow-[0_24px_70px_rgba(47,32,20,0.35)] sm:rounded-[26px]">
          <div className="flex justify-end px-3 py-3 sm:px-4 sm:py-4">
            <div className="ml-auto w-full max-w-[230px] text-right">
              <div className="text-[11px] uppercase tracking-[0.16em] text-[#d7bf9b]">
                购物车
              </div>
              <div className="mt-1 text-sm font-semibold">
                {totalCount > 0
                  ? `${totalCount} 件商品 · ${formatPrice(totalPrice, currency)}`
                  : "还没有添加商品"}
              </div>
              {promoSummary.discount > 0 ? (
                <div className="mt-1 text-xs text-[#f4d9a8]">
                  已优惠 {formatPrice(promoSummary.discount, currency)}
                </div>
              ) : null}
              <button
                className="mt-2 ml-auto block w-full rounded-full bg-[#f4d9a8] px-3 py-2 text-sm font-semibold text-[#513516]"
                onClick={openCheckout}
                type="button"
              >
                去确认
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
