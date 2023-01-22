import { Document } from "@tiptap/extension-document";
import { Text } from "@tiptap/extension-text";

import { Paragraph } from "@tiptap/extension-paragraph";
import { Heading } from "@tiptap/extension-heading";

import { Bold } from "@tiptap/extension-bold";
import { Italic } from "@tiptap/extension-italic";
import { Underline } from "@tiptap/extension-underline";
import { Strike } from "@tiptap/extension-strike";
import { Code } from "@tiptap/extension-code";

import { Blockquote } from "@tiptap/extension-blockquote";
import { BulletList } from "@tiptap/extension-bullet-list";

import { ListItem } from "@tiptap/extension-list-item";
import { OrderedList } from "@tiptap/extension-ordered-list";
import { HardBreak } from "@tiptap/extension-hard-break";

import { Link } from "@tiptap/extension-link";

import { Image } from "@tiptap/extension-image";

import { lowlight } from "lowlight/lib/core";
import { CodeBlockLowlight } from "@tiptap/extension-code-block-lowlight";
import css from "highlight.js/lib/languages/css";
import js from "highlight.js/lib/languages/javascript";
import ts from "highlight.js/lib/languages/typescript";
import html from "highlight.js/lib/languages/xml";

lowlight.registerLanguage("html", html);
lowlight.registerLanguage("css", css);
lowlight.registerLanguage("js", js);
lowlight.registerLanguage("ts", ts);

export default {
  extensions: [
    Document,
    Paragraph,
    Text,
    Blockquote,
    BulletList,
    CodeBlockLowlight.configure({
      lowlight,
    }),
    Heading.configure({ levels: [1, 2, 3] }),
    OrderedList,
    ListItem,
    HardBreak,
    Bold,
    Code,
    Italic,
    Strike,
    Underline,
    Link.configure({
      autolink: true,
      linkOnPaste: true,
      openOnClick: false,
    }),
    Image.configure({
      inline: true,
    })
  ],
  editorProps: {
    attributes: {
      class:
        "prose",
    },
  },
};
