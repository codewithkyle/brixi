**Format:** `[grid]`

**Layout:**
```bash
columns
rows
```

**Flow:**
```bash
flow-row
flow-column
dense
```

**Count:** `1, 2, 3, 4`

## Gap

**Format:** `gap-{size}`

**CSS:** `gap`

**Default:**
```bash
gaps: [1, 1.5, 2]
```

## Example
```html
<form grid="rows gap-1">
    <input />
    <input />
    <div grid="columns 2 gap-1">
        <input />
        <input />
    </div>
    <button type="submit">Submit</button>
</form>
```