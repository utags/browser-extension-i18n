type I18nMessageMap = Record<string, string>

export function initI18n(
  messageMaps: Record<string, I18nMessageMap>,
  language?: string
) {
  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  language = (language || navigator.language).toLowerCase()
  const language2 = language.slice(0, 2)
  let messagesDefault: I18nMessageMap | undefined
  let messagesLocal: I18nMessageMap | undefined

  for (const entry of Object.entries(messageMaps)) {
    const langs = new Set(
      entry[0]
        .toLowerCase()
        .split(",")
        .map((v) => v.trim())
    )
    const value = entry[1]
    if (langs.has(language)) {
      messagesLocal = value
    }

    // zh-HK will match zh if zh-HK is not provided
    if (langs.has(language2) && !messagesLocal) {
      messagesLocal = value
    }

    if (langs.has("en")) {
      messagesDefault = value
    }

    if (langs.has("en-us") && !messagesDefault) {
      messagesDefault = value
    }
  }

  if (!messagesLocal) {
    messagesLocal = {}
  }

  if (!messagesDefault || messagesDefault === messagesLocal) {
    messagesDefault = {}
  }

  return function (key: string, ...parameters: string[] | number[]) {
    let text: string = messagesLocal![key] || messagesDefault![key] || key
    if (parameters && parameters.length > 0 && text !== key) {
      // eslint-disable-next-line unicorn/no-for-loop
      for (let i = 0; i < parameters.length; i++) {
        text = text.replaceAll(
          new RegExp(`\\{${i + 1}\\}`, "g"),
          String(parameters[i])
        )
      }
    }

    return text
  }
}
