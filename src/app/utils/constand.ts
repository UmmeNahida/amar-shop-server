// ── Per-module search fields ──────────────────────────────────────────────────
// Pass the relevant array into QueryBuilder.search() for each module.

export const PRODUCT_SEARCH_FIELDS = [
  "name",
  "description",
  "shortDescription",
  "sku",
  "slug",
];
export const CATEGORY_SEARCH_FIELDS = ["name", "description", "slug"];
export const BRAND_SEARCH_FIELDS = ["name", "description", "slug"];
export const USER_SEARCH_FIELDS = [
  "fullName",
  "email",
  "username",
  "phone",
];
