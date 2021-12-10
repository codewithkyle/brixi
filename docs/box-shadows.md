# Box Shadows

**Format:** `.shadow-{color}-{size}`

**CSS:** `box-shadow`

**Default sizes:**

```css
sm:
0px 1px 2px hsl(var(--shadow-color) / 0.7)

md:
0px 2px 2px hsl(var(--shadow-color) / 0.333),
0px 4px 4px hsl(var(--shadow-color) / 0.333),
0px 6px 6px hsl(var(--shadow-color) / 0.333)

lg:
0px 2px 2px hsl(var(--shadow-color) / 0.2),
0px 4px 4px hsl(var(--shadow-color) / 0.2),
0px 8px 8px hsl(var(--shadow-color) / 0.2),
0px 16px 16px hsl(var(--shadow-color) / 0.2),
0px 32px 32px hsl(var(--shadow-color) / 0.2)

xl:
0px 2px 2px hsl(var(--shadow-color) / 0.2),
0px 4px 4px hsl(var(--shadow-color) / 0.2),
0px 8px 8px hsl(var(--shadow-color) / 0.2),
0px 16px 16px hsl(var(--shadow-color) / 0.2),
0px 32px 32px hsl(var(--shadow-color) / 0.2),
0px 48px 48px hsl(var(--shadow-color) / 0.2),
0px 64px 64px hsl(var(--shadow-color) / 0.2)
```

**Default colors:**

```javascript
{
	grey: "0deg 0% 50%",
	success: "142deg 77% 73%",
	warning: "46deg 97% 65%",
	danger: "0deg 94% 82%",
}
```

> **Note**: colors use HSL values.

**Output:**

```css
.shadow-grey-sm {
    box-shadow: 0px 1px 2px hsl(0deg 0% 50% / 0.7);
}
```
