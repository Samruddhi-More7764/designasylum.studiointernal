// Client logos — Frame 2095588032 (254:618).
// `width`/`height` are each logo's on-screen size inside the 200×140 card,
// taken directly from Figma.
export interface ClientLogo {
  name: string;
  image: string;
  width: number;
  height: number;
}

export const clientLogos: ClientLogo[] = [
  {
    name: "Logo A",
    image: "/assets/images/logos-new/logo-a.png",
    // 936c35bb — Figma 192×49
    width: 192,
    height: 49,
  },
  {
    name: "Logo B",
    image: "/assets/images/logos-new/logo-b.png",
    // ff348471 — Figma 191×51
    width: 191,
    height: 51,
  },
  {
    name: "Logo C",
    image: "/assets/images/logos-new/logo-c.png",
    // fcf79a34 — Figma 193×82
    width: 193,
    height: 82,
  },
  {
    name: "Logo D",
    image: "/assets/images/logos-new/logo-d.png",
    // a87d83e8 — Figma 176×101
    width: 176,
    height: 101,
  },
];

// Clients grid — 4 × 2, row 2 reshuffles the same logos.
export const clientsGridRows: ClientLogo[][] = [
  [clientLogos[0], clientLogos[1], clientLogos[2], clientLogos[3]],
  [clientLogos[3], clientLogos[2], clientLogos[0], clientLogos[1]],
];

// Frame 2095588032 rows (static, no marquee):
// row 1 = A, B, C, D
// row 2 = D, C, B, A, A
export const marqueeRow1: ClientLogo[] = [
  clientLogos[0],
  clientLogos[1],
  clientLogos[2],
  clientLogos[3],
];

export const marqueeRow2: ClientLogo[] = [
  clientLogos[3],
  clientLogos[2],
  clientLogos[1],
  clientLogos[0],
  clientLogos[0],
];
