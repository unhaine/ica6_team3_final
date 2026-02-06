import Image from '@tiptap/extension-image';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { ImageNodeView } from './ImageNodeView';

export const CustomImage = Image.extend({
    addAttributes() {
        return {
            ...this.parent?.(),
            isThumbnail: {
                default: false,
                renderHTML: attributes => {
                    if (!attributes.isThumbnail) {
                        return {}
                    }
                    return {
                        'data-is-thumbnail': attributes.isThumbnail,
                    };
                },
                parseHTML: element => {
                    return element.getAttribute('data-is-thumbnail') === 'true';
                },
            },
        };
    },

    addNodeView() {
        return ReactNodeViewRenderer(ImageNodeView);
    },
});
