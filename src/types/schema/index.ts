export * from "./overview";
export * from "./tasks";
export * from "./tickets";

export type FirestoreParams = {
  id: string;
  [key: string]: any;
};

export type NavbarType = {
  title: string;
};
