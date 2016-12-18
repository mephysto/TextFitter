# TextFitter

This script resizes text to make it fit into its parent container. 
The font size either shrinks if the text doesn't initally fit in the container,
or grows until it hits the sides.

* [Codepen Demo][http://codepen.io/mephysto/pen/BQKejp].

## Usage

- No jQuery needed.
- Make sure the parent element your text is in has a width/height,
 or a max-width/max-height set in CSS.

```html
<script src="text-resizer.js"></script>
```


- give the parent element some dimensions
```css
#my-parent-element{
    width: 300px;
    height: 250px;
}
```
- Target the element you want to resize.
```html
<div id='my-parent-element'>
  <span id='my-element'>The path of the righteous man is beset on all sides by the iniquities of the selfish and the tyranny of evil men. Blessed is he who, in the name of charity and good will, shepherds the weak through the valley of darkness, for he is truly his brother's keeper and the finder of lost children. And I will strike down upon thee with great vengeance and furious anger those who would attempt to poison and destroy My brothers. And you will know My name is the Lord when I lay My vengeance upon thee.</span>
</div>
```

- Initialize TextFitter

```js
TextFitter('#my-element');
```

## Options

| Name              | Description | Default Value |
| ----------------- | ----------- | ------------- |
| `minFontsize`   | Minimal font size (in pixels). The text will shrink up to this value. | 10 |
| `maxFontsize`   | Maximum font size (in pixels). The text will stretch up to this value. | 24 |
| `velocity`      | The speed at which we resize. Smaller is slower, but text might fit more neatly.  | 1 |
| `onReadyClass`  | Add this class to the element once it has finished. You can use this to show/hide your text while resizing.  | `false` |
| `debug`         | Output debugging messages to console. | `false` |

For example, if you have a large heading and you need your text to fit. You can use this:
```html
<script>
TextFitter('#my-element', { minFontSize: 16, maxFontSize: 40, velocity: 0.5 });
</script>
```

## Run on multiple elements
TextFitter works on multiple textfields as well.

```css
.text-container{
    width: 728px;
    height: 90px;
}
```

```html
<div class='text-container'>
  <p class="some-element">The path of the righteous man is beset on all sides by the iniquities of the selfish and the tyranny of evil men. Blessed is he who, in the name of charity and good will.</p>
</div>
<div class='text-container'>
  <p class="some-element">shepherds the weak through the valley of darkness, for he is truly his brother's keeper and the finder of lost children. And I will strike down upon thee with great vengeance and furious anger those who would attempt to poison and destroy My brothers.</p>
</div>
<div class='text-container'>
  <p class="some-element">And you will know My name is the Lord when I lay My vengeance upon thee.</p>
</div>

<script>
TextFitter('.some-element p');
</script>
```

## License

`TextFitter` is licensed under the _GNU GENERAL PUBLIC LICENSE_.

    Copyright (c) 2016 Maurice Melchers

[demo]:   http://codepen.io/mephysto/pen/BQKejp