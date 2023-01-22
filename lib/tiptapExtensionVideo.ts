import { Node, mergeAttributes } from '@tiptap/core'

export interface VideoOptions {
  enableControls: boolean,
  HTMLAttributes: Record<string, any>,
}

export const Video = Node.create<VideoOptions>({
  name: 'video', // unique name for the Node
  group: 'block', // belongs to the 'block' group of extensions
  atom: true, // is a single unit

  addOptions() {
    return {
      enableControls: true,
      HTMLAttributes: {},
    }
  },

  addAttributes() {
    return {
      "src": {
        default: null
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'video',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['video', mergeAttributes(this.options.HTMLAttributes, { controls: this.options.enableControls }, HTMLAttributes)];
  },
});