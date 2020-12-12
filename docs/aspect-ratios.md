## Aspect Ratios

**Format:** `.ar-{size}:{size}`

**Defaults:**
```bash
aspectRatios: ["16:9", "4:3", "1:1"]
```

**Output:**
```css
.ar-16\:9::before{
	content:"" !important;
	width: 100% !important;
	display: block !important;
	padding-bottom: 56.25% !important;
}
.ar-4\:3::before{
	content:"" !important;
	width: 100% !important;
	display: block !important;
	padding-bottom: 75% !important;
}
.ar-1\:1::before{
	content:"" !important;
	width: 100% !important;
	display: block !important;
	padding-bottom: 100% !important;
}
```