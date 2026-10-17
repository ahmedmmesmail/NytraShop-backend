# NytraShop Backend — Development Tasks

> **Project:** NytraShop E-Commerce REST API  
> **Stack:** Node.js, Express 5, MongoDB, Mongoose, JWT, bcrypt, Joi  
> **Purpose:** Track the work required to improve the current codebase and prepare it for a reliable production release.
>
> **Task status:** `[ ]` Not started · `[/]` In progress · `[x]` Completed  
> **Important:** These tasks are based on the initial source review. Confirm behavior with tests before marking a task complete. Do not commit secrets or the real `.env` file.

---

## Feature 1 — Project Setup & Configuration

### 1.1 Package metadata and scripts
- [ ] Replace the placeholder package name (`s4`) with an appropriate project/package name.
- [ ] Add a useful package description and author metadata.
- [ ] Make the declared license consistent with the actual project license and `LICENSE` file.
- [ ] Replace the default failing test script with a real test command once the test framework is configured.
- [ ] Define and verify `npm run dev` and `npm start` scripts.
- [ ] Review dependencies and remove unused packages; ensure runtime dependencies are listed under `dependencies` and development-only tools under `devDependencies`.

### 1.2 Environment configuration
- [ ] Standardize environment variable names across the app and documentation (for example, `PORT`, `MONGO_URL` or `MONGODB_URI`, and `JWT_KEY` or `JWT_SECRET`—choose one naming convention).
- [ ] Add `.env.example` containing variable names and safe placeholder values only.
- [ ] Confirm `.env`, credentials, database dumps, logs, and other secrets are excluded by `.gitignore`.
- [ ] Validate required environment variables at startup and fail fast with a clear, non-secret error when required configuration is missing.
- [ ] Document local setup, supported Node.js version, database setup, and run commands.

### 1.3 Startup and shutdown
- [ ] Refactor database initialization so a failed initial MongoDB connection prevents the API from starting in a misleading, partially working state.
- [ ] Add graceful shutdown handling for termination signals and close the HTTP server and MongoDB connection cleanly.
- [ ] Keep development and production configuration behavior explicit and predictable.

---

## Feature 2 — Database Models & Data Integrity

### 2.1 Shared model conventions
- [ ] Standardize model names, collection references, field naming, and casing across schemas, controllers, and queries.
- [ ] Use `mongoose.Schema.Types.ObjectId` for references when related documents use MongoDB ObjectIds.
- [ ] Add `timestamps: true` where creation/update timestamps are useful.
- [ ] Define required fields, sensible defaults, and appropriate `min`/`max` constraints.
- [ ] Decide whether strict schema behavior is appropriate and avoid silently relying on unknown fields being discarded.
- [ ] Add indexes based on actual query patterns and uniqueness requirements; review index creation in deployment.

### 2.2 User model
- [ ] Normalize email values with `trim` and `lowercase`.
- [ ] Add a unique email index and handle MongoDB duplicate-key errors correctly; do not rely on `unique` as a Mongoose validator.
- [ ] Review email length limits and keep model and Joi rules consistent.
- [ ] Ensure password hashes are not returned in API responses by default (for example, via `select: false` or explicit response shaping).
- [ ] Add or validate role defaults and allowed role values; never allow public registration to assign privileged roles.
- [ ] Add useful timestamps.

### 2.3 Product model
- [ ] Review all product fields and align validation rules between Mongoose and Joi.
- [ ] Use the correct data type for `images`; if multiple images are supported, model them as an array of strings or structured image objects.
- [ ] Validate that `price` is non-negative and `priceAfterDiscount`, when present, is non-negative and not greater than `price`.
- [ ] Remove inappropriate `ref` declarations from numeric fields such as `ratingAvg`.
- [ ] Set `soldCount` to allow zero and default it to zero.
- [ ] Define stock behavior explicitly: zero stock is valid, but purchasing an unavailable quantity must be rejected.
- [ ] Verify slug generation, uniqueness requirements, and handling of duplicate slugs.
- [ ] Review product/category/brand/subcategory references and deletion behavior.

### 2.4 Review model
- [ ] Standardize reference field names between the Review schema and controller (avoid inconsistent forms such as `userID`/`userId`).
- [ ] Store user and product references using ObjectIds when appropriate.
- [ ] Define valid rating bounds and precision consistently in Joi and Mongoose.
- [ ] Decide whether one user may review a product more than once; enforce the rule with appropriate application logic and, if suitable, a compound unique index.
- [ ] Define how product rating average and count are recalculated when a review is created, updated, or deleted.
- [ ] Verify that a review cannot reference a nonexistent product or user.

### 2.5 Cart model
- [ ] Redesign the cart to belong to a user and contain multiple items.
- [ ] Represent each item with a product reference and a positive integer quantity.
- [ ] Decide whether a user has one active cart and enforce that rule if needed.
- [ ] Treat the server as the source of truth for prices and totals; recalculate them from current product data.
- [ ] Define behavior for deleted, unavailable, or out-of-stock products.

### 2.6 Coupon model
- [ ] Store expiration as a `Date`, not a string.
- [ ] Define whether discounts are percentage-based or fixed amounts and validate the allowed range.
- [ ] Normalize coupon codes and define uniqueness/case-sensitivity behavior.
- [ ] Add optional rules as required: minimum order value, maximum discount, usage limit, per-user limit, active status, and eligible products.
- [ ] Ensure expired, inactive, or exhausted coupons cannot be applied.

### 2.7 Order model (to be implemented)
- [ ] Design an Order schema with a user reference, item snapshots, quantities, unit prices, subtotal, discount, total, shipping details, status, and timestamps as needed.
- [ ] Store purchase-time product name/price snapshots so later product edits do not change historical orders.
- [ ] Define allowed order/payment/fulfillment statuses and valid transitions.
- [ ] Decide which shipping/contact fields must be captured at order creation.
- [ ] Avoid trusting client-submitted prices, discounts, totals, roles, or ownership identifiers.

---

## Feature 3 — Authentication & Authorization

### 3.1 Registration
- [ ] Validate and normalize registration input before creating a user.
- [ ] Hash passwords with bcrypt using a suitable work factor and never store plaintext passwords.
- [ ] Prevent public clients from setting `role`, password hash, or other privileged/internal fields.
- [ ] Handle duplicate email addresses with a consistent client-safe response.
- [ ] Return only safe user fields in the response.

### 3.2 Login and JWT
- [ ] Fix login flow so the user-existence check happens before reading user properties or signing a token.
- [ ] Validate request input before querying the database.
- [ ] Compare passwords using bcrypt and return a generic invalid-credentials response where appropriate.
- [ ] Sign JWTs only after successful credential verification.
- [ ] Configure and validate token expiration and signing algorithm; keep the secret in environment variables.
- [ ] Return a consistent response shape and avoid exposing password hashes or sensitive internal data.

### 3.3 Authentication middleware
- [ ] Add middleware that reads the token from the documented location, verifies its signature and expiration, and attaches a trusted user identity to the request.
- [ ] Handle missing, malformed, expired, and invalid tokens with appropriate `401 Unauthorized` responses.
- [ ] Load or verify the current user/role as needed so deleted or disabled users cannot keep accessing protected endpoints indefinitely.
- [ ] Keep authentication errors from leaking secrets or token contents.

### 3.4 Role-based authorization
- [ ] Add authorization middleware for protected roles/permissions.
- [ ] Protect product, brand, category, subcategory, and coupon write operations so only authorized roles can use them.
- [ ] Ensure users can read or modify only their own profile, cart, reviews, and orders unless an explicit admin policy allows otherwise.
- [ ] Never trust `userId`, `role`, or ownership information supplied by the client when the server can derive it from the authenticated identity.
- [ ] Test both permitted and forbidden access for every protected route.

---

## Feature 4 — API Routes, Controllers & Validation

### 4.1 Route design
- [ ] Standardize resource-oriented paths, HTTP methods, and parameter naming.
- [ ] Fix malformed update routes such as `/category:id` to use a clear parameter path such as `/categories/:id`.
- [ ] Prefer resource IDs in route parameters for read/update/delete operations rather than requiring `_id` in request bodies.
- [ ] Keep route naming consistent across products, categories, brands, subcategories, coupons, reviews, users, carts, and orders.
- [ ] Apply authentication and authorization middleware at the appropriate route level.

### 4.2 Update and delete behavior
- [ ] Review use of `findOneAndReplace`; use partial-update behavior where PATCH semantics are intended.
- [ ] Validate update payloads separately from create payloads so required creation fields do not unintentionally block partial updates.
- [ ] Enable appropriate Mongoose update validation and explicitly handle not-found results.
- [ ] Validate route IDs as MongoDB ObjectIds before querying.
- [ ] Return a consistent `404 Not Found` when the requested resource does not exist.
- [ ] Avoid returning success for a delete/update operation that did not affect a resource.

### 4.3 Joi validation
- [ ] Align Joi rules with Mongoose constraints, including lengths, number ranges, defaults, and whether zero is allowed.
- [ ] Correct inconsistent validation messages and ensure messages match the actual rules.
- [ ] Validate ObjectId values properly rather than using `alphanum()` alone.
- [ ] Use separate schemas for create, update, query parameters, and route parameters as appropriate.
- [ ] Reject or explicitly strip unexpected fields, especially protected fields such as `role`, price totals, ownership IDs, and internal counters.
- [ ] Normalize values such as emails and coupon codes consistently.

### 4.4 Response and error conventions
- [ ] Standardize success and error response structures.
- [ ] Use suitable HTTP status codes (`200`, `201`, `204`, `400`, `401`, `403`, `404`, `409`, `422`, and `500` as appropriate).
- [ ] Add centralized Express error-handling middleware and ensure async errors reach it.
- [ ] Do not return stack traces, secrets, database connection strings, or internal exception details in production responses.
- [ ] Add a not-found handler for unknown routes.

---

## Feature 5 — Product Catalog & Discovery

### 5.1 Product/category/brand/subcategory operations
- [ ] Confirm CRUD behavior for each catalog resource and cover not-found and invalid-ID cases.
- [ ] Verify category/subcategory/brand references exist before creating or updating a product.
- [ ] Define safe deletion behavior when a category, brand, or product is referenced by other records.
- [ ] Prevent unauthorized clients from creating, updating, or deleting catalog resources.
- [ ] Ensure public product responses omit internal fields and unnecessary database details.

### 5.2 Search, filtering, sorting, and pagination
- [ ] Add pagination with validated page/limit values and a sensible maximum page size.
- [ ] Add useful filters such as category, brand, price range, and availability where applicable.
- [ ] Add sorting for supported fields, with safe allowlists rather than arbitrary client-supplied database keys.
- [ ] Add product search with a defined strategy and indexes appropriate to the expected workload.
- [ ] Return pagination metadata consistently.

### 5.3 Slugs and media
- [ ] Ensure slugs are generated and updated predictably and handle collisions.
- [ ] Decide whether product images are external URLs or uploaded media.
- [ ] If uploads are supported, validate file type/size and use a suitable storage provider; do not store large image binaries directly in product documents without a deliberate design.
- [ ] Document required image fields and expected formats.

---

## Feature 6 — Reviews & Ratings

- [ ] Require authentication to create, update, or delete reviews.
- [ ] Derive the review author from the authenticated user instead of trusting a client-provided user ID.
- [ ] Verify the referenced product exists.
- [ ] Define whether reviews require a completed purchase (verified-purchase policy).
- [ ] Enforce the chosen one-review-per-user-per-product policy, if applicable.
- [ ] Validate rating range and precision consistently.
- [ ] Recalculate product rating average and count after review changes, using a consistent strategy.
- [ ] Ensure users can modify/delete only their own reviews unless an explicit admin permission applies.
- [ ] Test concurrent review updates if rating aggregates are maintained on the product document.

---

## Feature 7 — Shopping Cart

- [ ] Implement Cart controller and router; the current cart model alone does not provide a complete cart feature.
- [ ] Add endpoints to get the current user's cart, add an item, update quantity, remove an item, and clear the cart.
- [ ] Derive cart ownership from the authenticated user.
- [ ] Validate product IDs and positive integer quantities.
- [ ] Verify product availability and stock when adding/updating items.
- [ ] Recalculate item prices and cart totals on the server.
- [ ] Define how cart items behave when products are removed, disabled, repriced, or out of stock.
- [ ] Return consistent cart response data and handle empty carts.

---

## Feature 8 — Checkout, Orders & Inventory

- [ ] Implement Order controller and router; order management is described in the README but is not implemented in the reviewed code.
- [ ] Add a checkout flow that reloads products and prices from the database instead of trusting client totals.
- [ ] Validate stock and coupon eligibility at checkout.
- [ ] Use an atomic stock-update strategy to prevent overselling under concurrent purchases.
- [ ] Use MongoDB transactions where multiple writes must succeed or fail together and the deployment topology supports transactions.
- [ ] Create order item snapshots with purchase-time names, prices, and quantities.
- [ ] Define order statuses and enforce valid status transitions.
- [ ] Define cancellation/refund rules and whether/how stock is restored.
- [ ] Make checkout resilient to retries; use an idempotency strategy where duplicate submissions could create duplicate orders.
- [ ] Ensure users can access only their own orders; restrict administrative status changes.
- [ ] Add tests for insufficient stock, concurrent checkout, invalid coupons, duplicate requests, and cancellation.

---

## Feature 9 — Security, Testing, Documentation & Production Release

### 9.1 Security hardening
- [ ] Add rate limiting, especially for login, registration, and other sensitive endpoints.
- [ ] Configure CORS with explicit allowed origins for the intended clients.
- [ ] Add appropriate HTTP security headers (for example, using Helmet).
- [ ] Review MongoDB query handling and prevent NoSQL injection through untrusted input.
- [ ] Enforce request body size limits and safe parsing.
- [ ] Avoid leaking account existence or sensitive information unnecessarily.
- [ ] Review password policy and bcrypt work factor.
- [ ] Confirm secrets are absent from source control, logs, responses, and documentation.
- [ ] Review dependencies for known vulnerabilities and keep supported versions updated.

### 9.2 Automated testing
- [ ] Choose a test framework compatible with the project (for example, Jest or Vitest) and use Supertest for HTTP integration tests.
- [ ] Add tests for registration, login, invalid credentials, duplicate email, and token validation.
- [ ] Add tests for authorization and cross-user data access.
- [ ] Add tests for CRUD operations, invalid IDs, validation failures, and missing resources.
- [ ] Add tests for product filtering/pagination, reviews, cart operations, checkout, inventory, coupons, and order ownership as those features are implemented.
- [ ] Use an isolated test database and ensure tests never target production data.
- [ ] Add linting/formatting checks if useful and wire them into the development workflow.
- [ ] Run the complete test suite and fix failures before release.

### 9.3 Logging, health, and operations
- [ ] Add a health endpoint that reports application status without exposing secrets.
- [ ] Add structured logging with appropriate redaction of credentials, tokens, and personal data.
- [ ] Handle uncaught exceptions and unhandled promise rejections with a safe shutdown strategy.
- [ ] Confirm production startup fails clearly when configuration or initial database connection is invalid.
- [ ] Document deployment configuration, environment variables, database requirements, and operational assumptions.
- [ ] Verify backups and recovery procedures for the production database.

### 9.4 Documentation and release checklist
- [ ] Update README so it describes only implemented features; mark planned features as planned.
- [ ] Document every endpoint, authentication requirement, request/response example, and common error using OpenAPI/Swagger or equivalent documentation.
- [ ] Add a clear `.env.example` and ensure setup commands work from a clean clone.
- [ ] Ensure the license declared in `package.json`, the `LICENSE` file, and README are consistent.
- [ ] If the project is proprietary, make the viewing/use permissions explicit and review the license text before publishing.
- [ ] Confirm third-party dependencies and assets retain their respective license obligations.
- [ ] Perform a final manual smoke test in a production-like environment.
- [ ] Verify deployment secrets and production database access are configured securely.
- [ ] Tag a release only after critical issues are resolved and the test suite passes.

---

## Definition of Done

- [ ] The app starts only with valid configuration and a working database connection.
- [ ] Authentication and authorization are enforced on all protected routes.
- [ ] Joi and Mongoose validations agree and return predictable errors.
- [ ] Catalog CRUD operations behave correctly for valid, invalid, and missing resources.
- [ ] Reviews are linked correctly to users and products, with consistent rating aggregates.
- [ ] Users can manage their own carts and cannot manipulate server-calculated prices.
- [ ] Checkout creates consistent orders and prevents overselling.
- [ ] Automated tests cover critical success and failure paths and pass.
- [ ] README and API documentation match the implementation.
- [ ] No secrets are committed, and production configuration has been reviewed.
- [ ] License and third-party notices are consistent and present.
