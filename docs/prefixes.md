# Prefixes

Starting in Brixi v0.8 you can define a prefix and an `@media` query rule. This can be used to create powerful dynamic elements that respond to the users prefered colour scheme or device viewport size. Only define prefixes when absolutely necessary! They will quickly bloat the output CSS file size.

**Example**

```javascript
prefixes: {
    dark: {
        features: ["backgrounds", "fonts", "borders", "shadows"],
        rule: "prefers-color-scheme: dark",
    },
    md: {
        features: ["containers", "display", "margins", "padding", "flexbox"],
        rule: "min-width: 768px",
    }
}
```

The "feature" value maps to the `features` section of the config. For convenience `fonts` and `borders` are grouped.

**Example Backgrounds CSS Output**

```css
.bg-white{
    background-color: var(--white);
}
.bg-grey-950{
    background-color: var(--grey-50);
}
@media (prefers-color-scheme: dark) {
     .dark\:bg-white{
        background-color: var(--white);
    }
    .dark\:bg-grey-950{
        background-color: var(--grey-950);
    }   
}
```

**Example Display CSS Output**

```css
.block{
    display: block;
}
.none{
    display: none;
}
@media (min-width: 768px) {
    .md\:block{
        display: block;
    }
    .md\:none{
        display: none;
    }
}
```

**Example HTML**

```html
<div class="bg-white dark:bg-grey-950 none md:block">
    <!-- snip -->
</div>
```

In this exmaple the `<div>` will use the `display: none` property until the device viewport width is at least `768px` at which point the `display: block` property override will kick in. The background color will default to `var(--white)` unless the users OS is configured to use dark mode. What dark mode is detected the background color `var(--grey-950)` override will kick in.
