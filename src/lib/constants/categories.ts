// Mirrors product.domain.enums.ProductCategory on the backend exactly (same English
// constant names, @Enumerated(EnumType.STRING) - the value sent over the wire/URL is
// the enum name itself). Portuguese labels are purely a frontend display concern, same
// pattern as UserType/UserStatus badges in the admin panel not being translated either
// - only the human-facing text here is.
//
// Single source of truth for both the department menu (Header/DepartmentMenu) and the
// catalog's category filter (FiltersPanel), so the two can't drift out of sync.
export const PRODUCT_CATEGORIES = [
  { value: "MACHINES", label: "Máquinas" },
  { value: "NEEDLES", label: "Agulhas" },
  { value: "INKS", label: "Tintas" },
  { value: "DISPOSABLES", label: "Descartáveis" },
  { value: "AFTERCARE", label: "Cuidados pós-tattoo" },
  { value: "ACCESSORIES", label: "Acessórios" },
] as const;

export type ProductCategoryValue = (typeof PRODUCT_CATEGORIES)[number]["value"];
