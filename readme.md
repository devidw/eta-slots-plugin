# eta slots plugin

all credits go to [alexkar598](https://github.com/alexkar598), [@see](https://github.com/eta-dev/eta/discussions/224#discussioncomment-5748686)

```console
pnpm add eta-slots-plugin
```

```ts
import * as eta from "eta"
import etaSlotsPlugin from "eta-slots-plugin"

eta.configure({
    plugins: [etaSlotsPlugin],
})
```

_layout.eta_
```eta
<% slot("some-slot") ${ %>
  some default content
<% } %>
```

_child.eta_
```eta
<% layout("layout") %>

<% content("some-slot") ${ %>
  some slot content
<% } %>
```