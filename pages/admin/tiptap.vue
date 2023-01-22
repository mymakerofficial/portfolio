<template>
  <Container>
    <div class="py-12 flex flex-col gap-12">
      <div>
        <h1 class="text-xl font-bold text-gray-800 dark:text-gray-100">TipTap Editor</h1>
      </div>
      <div class="p-12 rounded-xl flex flex-col gap-8">
        <div class="flex flex-wrap gap-y-4 gap-x-6">
          <div
              v-for="(section, index) in editorButtons"
              :key="index"
              class="flex flex-row gap-2"
          >
            <button
                v-for="button in section"
                :key="button.label"
                @click.prevent="button.onClick"
                v-text="button.label"
                :disabled="button.disabled ? button.disabled() : false"
                :data-active="button.isActive ? button.isActive() : false"
                class="py-2 px-4 flex items-center justify-center rounded-lg font-medium bg-gray-700 data-[active=true]:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-text text-gray-200 data-[active=true]:text-gray-800"
            />
          </div>
        </div>
        <EditorContent :editor="editor" />
      </div>
      <div class="bg-gray-50 dark:bg-gray-800 p-12 rounded-xl">
        <input v-model="editorJSONString" readonly @focus="$event.target.select()" class="w-full bg-transparent text-inherit"/>
      </div>
    </div>
  </Container>
</template>

<script lang="ts">
import { Editor, EditorContent } from "@tiptap/vue-3";
import tiptapDefaultOptions from "~/lib/tiptapDefaultOptions";

class EditorButton {
  private label: string;
  private onClick: any;
  private disabled: any;
  private isActive: any;

  constructor(label: string, onClick: any, disabled: any, isActive: any) {
    this.label = label;
    this.onClick = onClick;
    this.disabled = disabled;
    this.isActive = isActive;
  }
}

export default defineNuxtComponent({
  components: {
    EditorContent,
  },

  data() {
    const editor = new Editor({
      ...tiptapDefaultOptions,
      content: "write something beautifully...",
      /* @ts-ignore */
      onUpdate: this.onUpdate,
    });

    const editorButtons: EditorButton[][] = [
      [
        new EditorButton(
            "bold",
            () => editor.chain().focus().toggleBold().run(),
            () => !editor.can().chain().focus().toggleBold().run(),
            () => editor.isActive("bold")
        ),
        new EditorButton(
            "italic",
            () => editor.chain().focus().toggleItalic().run(),
            () => !editor.can().chain().focus().toggleItalic().run(),
            () => editor.isActive("italic")
        ),
        new EditorButton(
            "underline",
            () => editor.chain().focus().toggleUnderline().run(),
            () => !editor.can().chain().focus().toggleUnderline().run(),
            () => editor.isActive("underline")
        ),
        new EditorButton(
            "strike",
            () => editor.chain().focus().toggleStrike().run(),
            () => !editor.can().chain().focus().toggleStrike().run(),
            () => editor.isActive("strike")
        ),
        new EditorButton(
            "code",
            () => editor.chain().focus().toggleCode().run(),
            () => !editor.can().chain().focus().toggleCode().run(),
            () => editor.isActive("code")
        ),
      ],
      [
        new EditorButton(
            "h1",
            () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
            () => false,
            () => editor.isActive("heading", { level: 1 })
        ),
        new EditorButton(
            "h2",
            () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
            () => false,
            () => editor.isActive("heading", { level: 2 })
        ),
        new EditorButton(
            "h3",
            () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
            () => false,
            () => editor.isActive("heading", { level: 3 })
        ),
      ],
      [
        new EditorButton(
            "set link",
            () => this.setLink(),
            () => false,
            () => editor.isActive("link")
        ),
        new EditorButton(
            "remove link",
            () => editor.chain().focus().unsetLink().run(),
            () => !editor.isActive("link"),
            () => false
        ),
      ],
      [
        new EditorButton(
            "code block",
            () => editor.chain().focus().toggleCodeBlock().run(),
            () => !editor.can().chain().focus().toggleCodeBlock().run(),
            () => editor.isActive("codeBlock")
        ),
        new EditorButton(
            "blockquote",
            () => editor.chain().focus().toggleBlockquote().run(),
            () => !editor.can().chain().focus().toggleBlockquote().run(),
            () => editor.isActive("blockquote")
        ),
      ],
      [
        new EditorButton(
            "bullet list",
            () => editor.chain().focus().toggleBulletList().run(),
            () => !editor.can().chain().focus().toggleBulletList().run(),
            () => editor.isActive("bulletList")
        ),
        new EditorButton(
            "ordered list",
            () => editor.chain().focus().toggleOrderedList().run(),
            () => !editor.can().chain().focus().toggleOrderedList().run(),
            () => editor.isActive("orderedList")
        ),
      ],
      [
        new EditorButton(
            "add image",
            () => this.addImage(),
            () => false,
            () => editor.isActive("image")
        ),
      ],
    ]

    return {
      editor,
      editorButtons,
      editorJSONString: "",
    };
  },

  methods: {
    onUpdate() {
      this.editorJSONString = JSON.stringify(this.editor.getJSON());
    },
    setLink() {
      const previousUrl = this.editor.getAttributes("link").href;
      const url = window.prompt("URL", previousUrl);

      // cancelled
      if (url === null) {
        return;
      }

      // empty
      if (url === "") {
        this.editor.chain().focus().extendMarkRange("link").unsetLink().run();

        return;
      }

      // update link
      this.editor
          .chain()
          .focus()
          .extendMarkRange("link")
          .setLink({ href: url })
          .run();
    },
    addImage() {
      const url = window.prompt('URL')

      if (url) {
        this.editor
            .chain()
            .focus()
            .setImage({ src: url })
            .run()
      }
    }
  },
})
</script>