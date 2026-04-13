// @ts-check
const { test, expect } = require("@playwright/test");

const BUTTON_MAP = {
  "0": "btn-0", "1": "btn-1", "2": "btn-2", "3": "btn-3", "4": "btn-4",
  "5": "btn-5", "6": "btn-6", "7": "btn-7", "8": "btn-8", "9": "btn-9",
  "+": "btn-add", "-": "btn-subtract", "×": "btn-multiply", "/": "btn-divide",
  "(": "btn-paren-left", ")": "btn-paren-right",
  ".": "btn-dot", "=": "btn-equals", "C": "btn-clear", "←": "btn-backspace",
};

async function press(page, keys) {
  for (const key of keys) {
    await page.getByTestId(BUTTON_MAP[key]).click();
  }
}

test.beforeEach(async ({ page }) => {
  await page.goto("/index.html");
});

test.describe("必須要件", () => {
  test("数字ボタン（0〜9）を押すと画面に反映される", async ({ page }) => {
    await press(page, ["1", "2", "3"]);
    await expect(page.locator("#display")).toHaveValue("123");
  });

  test("足し算が正しく動作する", async ({ page }) => {
    await press(page, ["2", "+", "3", "="]);
    await expect(page.locator("#display")).toHaveValue("5");
  });

  test("引き算が正しく動作する", async ({ page }) => {
    await press(page, ["9", "-", "4", "="]);
    await expect(page.locator("#display")).toHaveValue("5");
  });

  test("掛け算が正しく動作する", async ({ page }) => {
    await press(page, ["3", "×", "4", "="]);
    await expect(page.locator("#display")).toHaveValue("12");
  });

  test("割り算が正しく動作する", async ({ page }) => {
    await press(page, ["8", "/", "2", "="]);
    await expect(page.locator("#display")).toHaveValue("4");
  });

  test("かっこを使った計算ができる", async ({ page }) => {
    await press(page, ["(", "2", "+", "3", ")", "×", "4", "="]);
    await expect(page.locator("#display")).toHaveValue("20");
  });

  test("クリアボタン（C）で入力がリセットされる", async ({ page }) => {
    await press(page, ["5", "5", "5"]);
    await expect(page.locator("#display")).toHaveValue("555");
    await press(page, ["C"]);
    await expect(page.locator("#display")).toHaveValue("");
  });

  test("1文字削除ボタン（←）で直前の入力を削除できる", async ({ page }) => {
    await press(page, ["1", "2", "3"]);
    await expect(page.locator("#display")).toHaveValue("123");
    await press(page, ["←"]);
    await expect(page.locator("#display")).toHaveValue("12");
  });

  test("イコールボタン（=）で計算結果が表示される", async ({ page }) => {
    await press(page, ["7", "+", "8", "="]);
    await expect(page.locator("#display")).toHaveValue("15");
  });
});
