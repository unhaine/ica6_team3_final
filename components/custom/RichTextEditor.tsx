'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { CustomImage } from './CustomImage';
import Placeholder from '@tiptap/extension-placeholder';
import { Icon } from '@/components/elements/Icon';
import { useCallback, useState } from 'react';

// Extensions
import { Color } from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import TextAlign from '@tiptap/extension-text-align';
import { Table } from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';

// Emoji
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover'; // Assume Popover exists or standard Shadcn
import { Smile, AlignLeft, AlignCenter, AlignRight, Palette, Grid3X3 } from 'lucide-react';

interface RichTextEditorProps {
    content: string;
    onChange: (html: string) => void;
    placeholder?: string;
    editable?: boolean;
}

export default function RichTextEditor({
    content,
    onChange,
    placeholder = '내용을 입력하세요...',
    editable = true,
}: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            CustomImage.configure({
                inline: true,
                allowBase64: true,
            }),
            Placeholder.configure({
                placeholder,
            }),
            TextStyle,
            Color,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            Table.configure({
                resizable: true,
            }),
            TableRow,
            TableHeader,
            TableCell,
        ],
        content,
        editable,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose-base focus:outline-none max-w-none min-h-[300px] p-4',
            },
        },
        immediatelyRender: false,
    });

    const uploadImage = useCallback(async (file: File) => {
        if (!file) return;

        // TODO: Implement actual image upload to server here if needed to avoid base64
        // For now, we reuse the existing upload API logic or use object URL for preview
        // Optimized flow: Upload to server -> Get URL -> Insert image

        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                editor?.chain().focus().setImage({ src: data.url }).run();
            } else {
                console.error('Image upload failed');
                alert('이미지 업로드에 실패했습니다.');
            }
        } catch (error) {
            console.error('Image upload error:', error);
            alert('이미지 업로드 중 오류가 발생했습니다.');
        }
    }, [editor]);

    const handleImageClick = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
                uploadImage(file);
            }
        };
        input.click();
    };

    if (!editor) {
        return null;
    }

    return (
        <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm">
            {editable && (
                <div className="flex items-center gap-1 p-2 border-b border-slate-100 bg-slate-50 overflow-x-auto">
                    {/* Text Style Buttons */}
                    <button
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        className={`p-2 rounded hover:bg-slate-200 transition-colors ${editor.isActive('bold') ? 'bg-slate-200 text-slate-900' : 'text-slate-500'}`}
                        title="굵게"
                    >
                        <Icon name="Bold" size={18} />
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        className={`p-2 rounded hover:bg-slate-200 transition-colors ${editor.isActive('italic') ? 'bg-slate-200 text-slate-900' : 'text-slate-500'}`}
                        title="기울임"
                    >
                        <Icon name="Italic" size={18} />
                    </button>

                    {/* Text Color */}
                    <div className="flex items-center">
                        <input
                            type="color"
                            onInput={(e) => editor.chain().focus().setColor((e.target as HTMLInputElement).value).run()}
                            value={editor.getAttributes('textStyle').color || '#000000'}
                            className="w-8 h-8 p-1 rounded cursor-pointer border-none bg-transparent"
                            title="글자 색상"
                        />
                    </div>

                    <div className="w-px h-6 bg-slate-300 mx-1" />

                    {/* Alignment */}
                    <button
                        onClick={() => editor.chain().focus().setTextAlign('left').run()}
                        className={`p-2 rounded hover:bg-slate-200 transition-colors ${editor.isActive({ textAlign: 'left' }) ? 'bg-slate-200 text-slate-900' : 'text-slate-500'}`}
                        title="왼쪽 정렬"
                    >
                        <AlignLeft size={18} />
                    </button>
                    <button
                        onClick={() => editor.chain().focus().setTextAlign('center').run()}
                        className={`p-2 rounded hover:bg-slate-200 transition-colors ${editor.isActive({ textAlign: 'center' }) ? 'bg-slate-200 text-slate-900' : 'text-slate-500'}`}
                        title="가운데 정렬"
                    >
                        <AlignCenter size={18} />
                    </button>
                    <button
                        onClick={() => editor.chain().focus().setTextAlign('right').run()}
                        className={`p-2 rounded hover:bg-slate-200 transition-colors ${editor.isActive({ textAlign: 'right' }) ? 'bg-slate-200 text-slate-900' : 'text-slate-500'}`}
                        title="오른쪽 정렬"
                    >
                        <AlignRight size={18} />
                    </button>

                    <div className="w-px h-6 bg-slate-300 mx-1" />

                    {/* Table */}
                    <button
                        onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
                        className="p-2 rounded hover:bg-slate-200 transition-colors text-slate-500"
                        title="표 삽입 (3x3)"
                    >
                        <Grid3X3 size={18} />
                    </button>

                    {/* Emoji Picker */}
                    <Popover>
                        <PopoverTrigger asChild>
                            <button
                                className="p-2 rounded hover:bg-slate-200 transition-colors text-slate-500 hover:text-yellow-500"
                                title="이모티콘"
                            >
                                <Smile size={18} />
                            </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0 border-none shadow-xl" align="start">
                            <EmojiPicker
                                onEmojiClick={(emojiData: EmojiClickData) => {
                                    editor.chain().focus().insertContent(emojiData.emoji).run();
                                }}
                                width={300}
                                height={400}
                                searchDisabled={false}
                                skinTonesDisabled={true} // Simple version
                            />
                        </PopoverContent>
                    </Popover>

                    <div className="w-px h-6 bg-slate-300 mx-1" />

                    <button
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        className={`p-2 rounded hover:bg-slate-200 transition-colors ${editor.isActive('bulletList') ? 'bg-slate-200 text-slate-900' : 'text-slate-500'}`}
                        title="목록"
                    >
                        <Icon name="List" size={18} />
                    </button>

                    <button
                        onClick={handleImageClick}
                        className="p-2 rounded hover:bg-slate-200 transition-colors text-slate-500 hover:text-emerald-600"
                        title="사진 추가"
                    >
                        <Icon name="Image" size={18} />
                    </button>
                </div>
            )}

            <div className="min-h-[300px] cursor-text">
                <EditorContent editor={editor} />
            </div>

            <style jsx global>{`
        .ProseMirror p.is-editor-empty:first-child::before {
          color: #adb5bd;
          content: attr(data-placeholder);
          float: left;
          height: 0;
          pointer-events: none;
        }
        .ProseMirror {
            outline: none;
        }
        .ProseMirror img {
            max-width: 100%;
            height: auto;
            border-radius: 8px;
            margin: 1rem 0;
        }
        
        /* Table Styles */
        .ProseMirror table {
            border-collapse: collapse;
            table-layout: fixed;
            width: 100%;
            margin: 0;
            overflow: hidden;
        }
        .ProseMirror td,
        .ProseMirror th {
            min-width: 1em;
            border: 2px solid #ced4da;
            padding: 3px 5px;
            vertical-align: top;
            box-sizing: border-box;
            position: relative;
        }
        .ProseMirror th {
            font-weight: bold;
            text-align: left;
            background-color: #f8f9fa;
        }
        .ProseMirror .selectedCell:after {
            z-index: 2;
            position: absolute;
            content: "";
            left: 0; right: 0; top: 0; bottom: 0;
            background: rgba(200, 200, 255, 0.4);
            pointer-events: none;
        }
        .ProseMirror .column-resize-handle {
            position: absolute;
            right: -2px;
            top: 0;
            bottom: 0;
            width: 4px;
            background-color: #adf;
            pointer-events: none;
        }
      `}</style>
        </div>
    );
}
