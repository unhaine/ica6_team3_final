import { NodeViewWrapper, NodeViewProps } from '@tiptap/react';
import { Star } from 'lucide-react';
import React, { useCallback } from 'react';

export const ImageNodeView = (props: NodeViewProps) => {
    const { node, updateAttributes, editor } = props;
    const isThumbnail = node.attrs.isThumbnail;

    const handleSetThumbnail = useCallback(() => {
        // 1. Reset all other images' isThumbnail to false
        editor.commands.command(({ tr, state, dispatch }) => {
            if (dispatch) {
                state.doc.descendants((node, pos) => {
                    if (node.type.name === 'image' && node.attrs.isThumbnail) {
                        tr.setNodeMarkup(pos, undefined, { ...node.attrs, isThumbnail: false });
                    }
                    return true;
                });
            }
            return true;
        });

        // 2. Set this image as thumbnail
        updateAttributes({
            isThumbnail: true,
        });
    }, [editor, updateAttributes]);

    return (
        <NodeViewWrapper className="relative inline-block group">
            <img
                src={node.attrs.src}
                alt={node.attrs.alt}
                className={`rounded-lg transition-all ${isThumbnail ? 'ring-4 ring-emerald-500' : 'group-hover:ring-2 group-hover:ring-slate-300'}`}
                style={{ maxWidth: '100%', height: 'auto' }}
            />

            <button
                type="button"
                onClick={handleSetThumbnail}
                className={`absolute top-6 right-2 p-2 rounded-full shadow-md transition-all z-10 ${node.attrs.isThumbnail
                        ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                        : 'bg-white/80 text-slate-400 hover:bg-white hover:text-emerald-500 hover:scale-110'
                    }`}
                title={node.attrs.isThumbnail ? "대표 이미지입니다" : "대표 이미지로 설정"}
            >
                <Star size={16} fill={isThumbnail ? "currentColor" : "none"} />
            </button>

            {isThumbnail && (
                <div className="absolute top-2 left-2 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                    대표
                </div>
            )}
        </NodeViewWrapper>
    );
};
