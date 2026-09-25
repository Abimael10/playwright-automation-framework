export function parseCurrencyToNumber(value: string): number {
  const cleaned = value.replace(/[^0-9.,-]/g, "").replace(/,/g, "");
  const num = Number(cleaned);

  if (Number.isNaN(num) || cleaned === "" || cleaned === "-") {
    throw new Error(`Unable to parse currency value: "${value}"`);
  }
  return num;
}