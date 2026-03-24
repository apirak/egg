function normalizeBaseUrl(baseUrl: string): string {
  if (!baseUrl || baseUrl === "/") return "/";
  return baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
}

export function withBasePath(path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  if (typeof window === "undefined") return path;

  const base = normalizeBaseUrl(import.meta.env.BASE_URL || "/");
  if (path === "/") return base;

  const normalizedPath = path.startsWith("/") ? path.slice(1) : path;
  return `${base}${normalizedPath}`;
}
