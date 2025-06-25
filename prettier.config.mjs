export default {
  importOrder: [
    "^[^@/.]+", // "name"
    "^@[^/]+/", // "@scope/name"
    "^@/", // "@/path"
    "^/", // "/path"
    "^[.]{2}/", // "../path"
    "^[.]/", // "./path"
  ],
  importOrderSideEffects: false,
  importOrderSortSpecifiers: true,
  importOrderCaseInsensitive: true,
  plugins: ["@trivago/prettier-plugin-sort-imports"],
};
