const expect = require("chai").expect;
const extractTypescript = require("./extract-typescript.utl");

describe("ast-extractors/extract-typescript - exotics", () => {
  it("doesn't detects 'exotic' dependencies when no exoticRequireStrings were passed", () => {
    expect(
      extractTypescript(
        "const want = require; const yo = want('./required-with-want');",
        []
      )
    ).to.deep.equal([]);
  });

  it("detects dependencies declared with one function names passed as exoticRequireStrings", () => {
    expect(
      extractTypescript(
        "const want = need = require; const yo = want('./required-with-want'); const nope = need('./required-with-need');",
        ["want"]
      )
    ).to.deep.equal([
      {
        moduleName: "./required-with-want",
        moduleSystem: "cjs",
        dynamic: false,
        exoticRequire: "want"
      }
    ]);
  });

  it("detects dependencies declared with member expression passed as exoticRequireStrings", () => {
    expect(
      extractTypescript(
        "const yo = window.require('./required-with-window-require')",
        ["window.require"]
      )
    ).to.deep.equal([
      {
        moduleName: "./required-with-window-require",
        moduleSystem: "cjs",
        dynamic: false,
        exoticRequire: "window.require"
      }
    ]);
  });

  it("detects dependencies declared with multiple function names passed as exoticRequireStrings", () => {
    expect(
      extractTypescript(
        "const want = need = require; const yo = want('./required-with-want'); const nope = need('./required-with-need');",
        ["want", "need"]
      )
    ).to.deep.equal([
      {
        moduleName: "./required-with-want",
        moduleSystem: "cjs",
        dynamic: false,
        exoticRequire: "want"
      },
      {
        moduleName: "./required-with-need",
        moduleSystem: "cjs",
        dynamic: false,
        exoticRequire: "need"
      }
    ]);
  });
});
