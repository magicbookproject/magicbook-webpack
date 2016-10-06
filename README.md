## Magicbook katex

This plugin allows you to write math equations via latex math expressions and automatically render them in the browser with the Katex math library and in PDF as straight up MathML. We chose to use Katex over Mathjax as it's faster, smaller, and supports bundling alongside other libraries.

## Using the plugin

First install the NPM package, either in your `package.json` file in your book repo, or by running the following.

```
npm i magicbook-katex
```

Just add the plugin to your config.

```json
{
  "addPlugins" : ["magicbook-katex"]
}
```

Then write some content with math markup. Here's an example with an inline and block math equations in your markdown.

```md
This is an inline equation: $$5 + 5$$. The following is a block equation:

$$
5 + 5
$$
```

If you're writing in HTML, the same file would look like this:

```html
<p>This is an inline equation: <span data-type="equation">5 + 5</span>. The following is a block equation:</p>

<div data-type="equation">
5 + 5
</div>
```

The required JavaScript, stylesheets and fonts will automatically be added to the build assets during the build process.
