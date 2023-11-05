# Box Shadows

**Format:** `.shadow-{color}-{size}`

**CSS:** `box-shadow`

**Default sizes:**

```css
sm:
0px 1px 3px hsl(var(--shadow-color) / 0.15)

md:
0px 2px 2px hsl(var(--shadow-color) / 0.05)
0px 4px 4px hsl(var(--shadow-color) / 0.05)
0px 8px 8px hsl(var(--shadow-color) / 0.1)

lg:
0px 2px 2px hsl(var(--shadow-color) / 0.05)
0px 4px 4px hsl(var(--shadow-color) / 0.05)
0px 8px 8px hsl(var(--shadow-color) / 0.05)
0px 16px 16px hsl(var(--shadow-color) / 0.05)
0px 32px 32px hsl(var(--shadow-color) / 0.05)

xl:
0px 2px 2px hsl(var(--shadow-color) / 0.05)
0px 4px 4px hsl(var(--shadow-color) / 0.05)
0px 8px 8px hsl(var(--shadow-color) / 0.05)
0px 16px 16px hsl(var(--shadow-color) / 0.05)
0px 32px 32px hsl(var(--shadow-color) / 0.05)
0px 48px 48px hsl(var(--shadow-color) / 0.05)
0px 64px 64px hsl(var(--shadow-color) / 0.05)
```

**Default colors:**

```javascript
{
    black: "0deg 0% 0%",
}
```

colors: {
},
sizes: {

},

> **Note**: colors use HSL values.

Box shadow design based on [this blog post](https://www.joshwcomeau.com/css/designing-shadows/) by Joshua Comeau. For help creating your own custom shadow sizes checkout [this box shadow generator](https://shadows.brumm.af/) or [this one](https://www.joshwcomeau.com/shadow-palette/).
