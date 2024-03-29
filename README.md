# Karozu

A handlebars alternative with end-to-end typesafety.
Karozu means `schematic` in Japanese 😊

## How to use

````typescript
import { createKarozu, baseUtilities } from "karozu";

// ---------Creating Custom Utilities---------
const customUtilities = {
  helloify: (name: string) => `Hello, ${name}`,
  double: (num: number) => num * 2,
  yell: () => "YELLING",
};

// ---------SETUP---------
const karozu = createKarozu({
  utilities: { ...baseUtilities, ...customUtilities },
  templateDir: "src/templates", // optional value
  outputFileName: "compiled.md", // optional value
});

export const { createTemplateFile, options } = karozu;

// ---------Usage---------

type TInput = {
  /** The name of the user, always required. */
  name: string;
  /** The age of the user, always required. */
  age: number;
};

const template = createTemplateFile<TInput>();

template.setTestData({ age: 20, name: "John" });

template.setTemplate(
  ({ name, age }, utils) =>
    utils.helloify(name) +
    `. You are ${utils.double(age)} years old\n${utils.yell()}`,
);

template.compileWithTestData();
/*

This will return:

  Hello, John. You are 40 years old
  YELLING

*/

template.compileTemplate({ name: "Jane", age: 30 });
/*

This will return:

  Hello, Jane. You are 60 years old
  YELLING

*/

// ---------Watch-Command---------
// This will watch the template directory for changes and recompile the template file with test data.
// Requires the templateDir & outputFileName to be set in the createKarozu function.
watch(options);

```
````
