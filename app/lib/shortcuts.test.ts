import { describe, expect, it } from "vite-plus/test";
import { gotoActions, normalizeKey, resolveKey } from "./shortcuts";

function keyboardEvent(overrides: Partial<KeyboardEvent>): KeyboardEvent {
  return {
    isComposing: false,
    code: "",
    key: "",
    shiftKey: false,
    ...overrides,
  } as KeyboardEvent;
}

describe("normalizeKey", () => {
  it("maps physical letter keys to lowercase", () => {
    expect(normalizeKey(keyboardEvent({ code: "KeyA" }))).toBe("a");
  });

  it("reports uppercase when shift is held", () => {
    expect(normalizeKey(keyboardEvent({ code: "KeyG", shiftKey: true }))).toBe("G");
  });

  it("maps shift + slash to question mark", () => {
    expect(normalizeKey(keyboardEvent({ code: "Slash", shiftKey: true }))).toBe("?");
  });

  it("falls back to event.key for punctuation", () => {
    expect(normalizeKey(keyboardEvent({ key: "?" }))).toBe("?");
  });

  it("keeps named keys intact", () => {
    expect(normalizeKey(keyboardEvent({ code: "Escape" }))).toBe("Escape");
    expect(normalizeKey(keyboardEvent({ code: "Enter" }))).toBe("Enter");
    expect(normalizeKey(keyboardEvent({ code: "ArrowDown", key: "ArrowDown" }))).toBe("ArrowDown");
  });

  it("ignores IME composition", () => {
    expect(normalizeKey(keyboardEvent({ code: "KeyA", isComposing: true }))).toBeNull();
  });
});

describe("resolveKey", () => {
  it("arms the prefix on g", () => {
    expect(resolveKey(null, "g")).toEqual({ kind: "prefix" });
  });

  it("resolves g-prefix navigation from the nav config", () => {
    expect(resolveKey("g", "a")).toEqual({
      kind: "action",
      action: { type: "navigate", href: "/" },
    });
    expect(resolveKey("g", "p")).toEqual({
      kind: "action",
      action: { type: "navigate", href: "/projects" },
    });
    expect(resolveKey("g", "m")).toEqual({
      kind: "action",
      action: { type: "navigate", href: "/misc" },
    });
  });

  it("resolves g g to the top of the page", () => {
    expect(resolveKey("g", "g")).toEqual({ kind: "action", action: { type: "scroll", to: "top" } });
  });

  it("cancels an unknown second key", () => {
    expect(resolveKey("g", "z")).toEqual({ kind: "cancel" });
  });

  it("does not treat shift + g as the prefix", () => {
    expect(resolveKey(null, "G")).toEqual({
      kind: "action",
      action: { type: "scroll", to: "bottom" },
    });
  });

  it("resolves single-key actions", () => {
    expect(resolveKey(null, "j")).toEqual({
      kind: "action",
      action: { type: "focus-item", direction: 1 },
    });
    expect(resolveKey(null, "?")).toEqual({ kind: "action", action: { type: "help" } });
    expect(resolveKey(null, "t")).toEqual({ kind: "action", action: { type: "theme" } });
  });

  it("maps arrow keys to the same actions as h/j/k/l", () => {
    expect(resolveKey(null, "ArrowDown")).toEqual(resolveKey(null, "j"));
    expect(resolveKey(null, "ArrowUp")).toEqual(resolveKey(null, "k"));
    expect(resolveKey(null, "ArrowLeft")).toEqual(resolveKey(null, "h"));
    expect(resolveKey(null, "ArrowRight")).toEqual(resolveKey(null, "l"));
  });

  it("ignores unbound keys", () => {
    expect(resolveKey(null, "q")).toEqual({ kind: "none" });
  });
});

describe("gotoActions", () => {
  it("has no collisions with single-key actions", () => {
    for (const key of Object.keys(gotoActions)) {
      if (key !== "g") {
        expect(key).toHaveLength(1);
      }
    }
  });
});
