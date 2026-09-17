import { Query, type PopulateOptions } from "mongoose";

/**
 * Fields that are consumed by the query builder itself and should
 * never be forwarded to Mongoose as raw filter conditions.
 */
export const EXCLUDED_QUERY_FIELDS = [
  "searchTerm",
  "sort",
  "select",
  "limit",
  "page",
  // price range
  "minPrice",
  "maxPrice",
  // rating range
  "minRating",
  "maxRating",
  // date range
  "startDate",
  "endDate",
];

/**
 * Generic query builder that works with any Mongoose model.
 *
 * Supported query params (all optional):
 *  - searchTerm        : regex search across caller-supplied fields
 *  - sort              : comma-separated field names, prefix "-" for desc  (e.g. "-createdAt,price")
 *  - select            : comma-separated field names to include
 *  - page              : page number (default 1)
 *  - limit             : docs per page (default 10)
 *  - minPrice / maxPrice   : price range  (maps to "price" field)
 *  - minRating / maxRating : rating range (maps to "rating.average" field)
 *  - startDate / endDate   : createdAt date range
 *  - category          : exact match on category ObjectId
 *  - brand             : exact match on brand ObjectId
 *  - status            : exact match on status string
 *  - isFeatured        : boolean string "true" / "false"
 *  - isNewArrival      : boolean string "true" / "false"
 *  - Any other field   : forwarded as exact-match filter
 */
export class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public query: Record<string, unknown>;

  constructor(
    modelQuery: Query<T[], T>,
    query: Record<string, unknown>,
  ) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  // ─── Search ────────────────────────────────────────────────────────────────
  /**
   * @param fields  Model fields to run the regex search against.
   *                e.g. ["name", "description", "sku"]
   */
  search(fields: string[]): this {
    const term = (this.query.searchTerm as string)?.trim();
    if (!term || fields.length === 0) return this;

    const conditions = fields.map((field) => ({
      [field]: { $regex: term, $options: "i" },
    }));

    this.modelQuery = this.modelQuery.find({ $or: conditions });
    return this;
  }

  // ─── Filter ────────────────────────────────────────────────────────────────
  /**
   * Handles:
   *  - price range   (minPrice / maxPrice)
   *  - rating range  (minRating / maxRating)
   *  - date range    (startDate / endDate  → createdAt)
   *  - boolean coercion for isFeatured / isNewArrival
   *  - all remaining query params as exact-match filters
   */
  filter(): this {
    const rawQuery = { ...this.query };

    // Remove builder-reserved keys
    for (const key of EXCLUDED_QUERY_FIELDS) {
      delete rawQuery[key];
    }

    const mongoFilter: Record<string, unknown> = {};

    // ── price range
    const minPrice =
      this.query.minPrice !== undefined
        ? Number(this.query.minPrice)
        : undefined;
    const maxPrice =
      this.query.maxPrice !== undefined
        ? Number(this.query.maxPrice)
        : undefined;
    if (minPrice !== undefined || maxPrice !== undefined) {
      mongoFilter.price = {
        ...(minPrice !== undefined && { $gte: minPrice }),
        ...(maxPrice !== undefined && { $lte: maxPrice }),
      };
    }

    // ── rating range  (maps to nested field rating.average)
    const minRating =
      this.query.minRating !== undefined
        ? Number(this.query.minRating)
        : undefined;
    const maxRating =
      this.query.maxRating !== undefined
        ? Number(this.query.maxRating)
        : undefined;
    if (minRating !== undefined || maxRating !== undefined) {
      mongoFilter["rating.average"] = {
        ...(minRating !== undefined && { $gte: minRating }),
        ...(maxRating !== undefined && { $lte: maxRating }),
      };
    }

    // ── date range  (createdAt)
    const startDate = this.query.startDate as string | undefined;
    const endDate = this.query.endDate as string | undefined;
    if (startDate || endDate) {
      mongoFilter.createdAt = {
        ...(startDate && { $gte: new Date(startDate) }),
        ...(endDate && {
          $lte: new Date(new Date(endDate).setHours(23, 59, 59, 999)),
        }),
      };
    }

    // ── boolean fields
    const booleanFields = ["isFeatured", "isNewArrival"];
    for (const field of booleanFields) {
      if (rawQuery[field] !== undefined) {
        mongoFilter[field] = String(rawQuery[field]) === "true";
        delete rawQuery[field];
      }
    }

    // ── everything else: exact match (category, brand, status, etc.)
    for (const [key, value] of Object.entries(rawQuery)) {
      if (value !== undefined && value !== "") {
        mongoFilter[key] = value;
      }
    }

    this.modelQuery = this.modelQuery.find(mongoFilter as any);
    return this;
  }

  // ─── Sort ──────────────────────────────────────────────────────────────────
  /**
   * Accepts comma-separated field names.
   * Prefix with "-" for descending.  e.g. "-createdAt,price"
   * Default: newest first (-createdAt).
   */
  sort(): this {
    const sortParam = (this.query.sort as string) || "-createdAt";
    const sortString = sortParam.split(",").join(" ");
    this.modelQuery = this.modelQuery.sort(sortString);
    return this;
  }

  // ─── Field selection ───────────────────────────────────────────────────────
  select(): this {
    if (this.query.select) {
      const fields = (this.query.select as string)
        .split(",")
        .join(" ");
      this.modelQuery = this.modelQuery.select(fields);
    }
    return this;
  }

  // ─── Pagination ────────────────────────────────────────────────────────────
  paginate(): this {
    const page = Math.max(Number(this.query.page) || 1, 1);
    const limit = Math.max(Number(this.query.limit) || 10, 1);
    const skip = (page - 1) * limit;

    this.modelQuery = this.modelQuery.skip(skip).limit(limit);
    return this;
  }

  // ─── Populate ──────────────────────────────────────────────────────────────
  populate(
    fields: PopulateOptions | (string | PopulateOptions)[],
  ): this {
    this.modelQuery = this.modelQuery.populate(fields);
    return this;
  }

  // ─── Execute ───────────────────────────────────────────────────────────────
  build() {
    return this.modelQuery;
  }

  // ─── Meta (for pagination response) ───────────────────────────────────────
  async getMeta() {
    const page = Math.max(Number(this.query.page) || 1, 1);
    const limit = Math.max(Number(this.query.limit) || 10, 1);

    // Count using the same filter conditions already applied
    const conditions = (this.modelQuery as any)._conditions ?? {};
    const total =
      await this.modelQuery.model.countDocuments(conditions);
    const totalPage = Math.ceil(total / limit);

    return { page, limit, totalPage, total };
  }
}
