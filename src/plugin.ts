const contentRegex = /^content\s*\(\s*"([^]*)"\s*\)\s*\${$/
const slotRegex = /^slot\s*\(\s*"([^]*)"\s*\)(\s*\${)?$/
const plugin = {
    processFnString: (fnStr: string) => {
        return `it[Symbol.for("slotsPlugin")]=it[Symbol.for("slotsPlugin")]||{};${fnStr}`
    },
    processAST: (ast: any[], _env: any) => {
        for (const token of ast) {
            //Make sure it's a template object
            if (typeof token === "string") continue
            //Make sure it's an evaluate tag
            if (token.t !== "e") continue

            const val = token.val.trim()
            //Its a @content "name"
            if (contentRegex.test(val)) {
                const slotName =
                    "_" + contentRegex.exec(val)![1].replaceAll(/\W/g, "")
                token.val = `
          it[Symbol.for("slotsPlugin")]["${slotName}"] = tR;
          tR = "";
          ___slot${slotName}();
          [tR, it[Symbol.for("slotsPlugin")]["${slotName}"]] = [it[Symbol.for("slotsPlugin")]["${slotName}"], tR.trim()];
          function~___slot${slotName} () {
        `
                    .replace(/\s/g, "")
                    .replace("~", " ")
            } else if (slotRegex.test(val)) {
                const match = slotRegex.exec(val)!
                const slotName = "_" + match[1].replaceAll(/\W/g, "")
                const hasDefault = Boolean(match[2])
                token.val = `
          if(it[Symbol.for("slotsPlugin")]["${slotName}"]) {
            tR += it[Symbol.for("slotsPlugin")]["${slotName}"];
          } ${
              hasDefault
                  ? `
              else {
                ___slotdefault${slotName}() ?? "";
              }
          
              function~___slotdefault${slotName} () {`
                  : ""
          }
          `
                    .replace(/\s/g, "")
                    .replace("~", " ")
            }
        }

        return ast
    },
}

export default plugin
