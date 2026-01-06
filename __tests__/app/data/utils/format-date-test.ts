import { formatDateForInput } from "@/app/data/utils/format-date";

describe("formatDateForInput", () => {
  it("returns empty string if date is undefined", () => {
    expect(formatDateForInput(undefined)).toBe("");
  });

  it("formats date to YYYY-MM-DD", () => {
    const date = new Date("2024-05-10T00:00:00.000Z");

    const result = formatDateForInput(date);

    expect(result).toBe("2024-05-10");
  });

  it("is stable across timezones", () => {
    const date = new Date(2024, 4, 10);

    const result = formatDateForInput(date);

    expect(result).toBe("2024-05-10");
  });
});
