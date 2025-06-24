// src/components/MyEditor.jsx
import { useEditor, EditorContent } from '@tiptap/react'
import { EditorProvider, useCurrentEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

import { Color } from '@tiptap/extension-color'
import ListItem from '@tiptap/extension-list-item'
import TextStyle from '@tiptap/extension-text-style'
// import { EditorProvider, useCurrentEditor } from '@tiptap/react'
// // import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'

import { useGlobalContext } from '../context/globalContext'

const TextEditor = () => {

    // const editor = useEditor({
    //     extensions: [
    //     StarterKit.configure({
    //         bulletList: {
    //         keepMarks: true,
    //         keepAttributes: false,
    //         },
    //         orderedList: {
    //         keepMarks: true,
    //         keepAttributes: false,
    //         },
    //     }),
    //     ],
    //     content: '',
    // })

    const { contentBody, setContentBody } = useGlobalContext();

    const editor = useEditor({
        extensions: [StarterKit, Image],
        content: '',
        onUpdate: ({ editor }) => {
            setContentBody(prev => ({
                ...prev,
                content:editor.getHTML()
            }))
        },
    })

    const MenuBar = ({ editor }) => {
        if (!editor) return null

        const buttonStyle = "px-3 py-1 border rounded mr-2 text-sm font-medium hover:bg-pink-300 transition"

        const handleImageUpload = () => {
            const input = document.createElement('input')
            input.type = 'file'
            input.accept = 'image/*'
            input.onchange = async () => {
                const file = input.files?.[0]
                if (file) {
                const reader = new FileReader()
                reader.onload = () => {
                    const base64 = reader.result
                    editor
                    .chain()
                    .focus()
                    .setImage({ src: base64 })
                    .run()
                }
                reader.readAsDataURL(file)
                }
            }
            input.click()
        }

        return (
            <div className="flex flex-wrap gap-1">
            <button
                onMouseDown={e => e.preventDefault()}
                className={`${buttonStyle} ${editor.isActive('bold') ? 'bg-pink-400' : 'bg-pink-200'}`}
                onClick={() => editor.chain().focus().toggleBold().run()}
            >
                Bold
            </button>
            <button
                onMouseDown={e => e.preventDefault()}
                className={`${buttonStyle} ${editor.isActive('italic') ? 'bg-pink-400' : 'bg-pink-200'}`}
                onClick={() => editor.chain().focus().toggleItalic().run()}
            >
                Italic
            </button>
            {/* <button
                onMouseDown={e => e.preventDefault()}
                className={`${buttonStyle} ${editor.isActive('heading', { level: 1 }) ? 'bg-pink-400' : 'bg-pink-200'}`}
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            >
                H1
            </button> */}
            {/* <button
                onMouseDown={e => e.preventDefault()}
                className={`${buttonStyle} ${editor.isActive('heading', { level: 2 }) ? 'bg-pink-400' : 'bg-pink-200'}`}
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            >
                H2
            </button> */}
            <button
                onMouseDown={e => e.preventDefault()}
                className={`${buttonStyle} ${editor.isActive('bulletList') ? 'bg-pink-400' : 'bg-pink-200'}`}
                onClick={() => editor.chain().focus().toggleBulletList().run()}
            >
                Bullet
            </button>
            <button
                onMouseDown={e => e.preventDefault()}
                className={`${buttonStyle} ${editor.isActive('orderedList') ? 'bg-pink-400' : 'bg-pink-200'}`}
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
            >
                Number
            </button>
            {/* <button
                onMouseDown={e => e.preventDefault()}
                className={buttonStyle}
                onClick={() => editor.chain().focus().undo().run()}
            >
                Undo
            </button>
            <button
                onMouseDown={e => e.preventDefault()}
                className={buttonStyle}
                onClick={() => editor.chain().focus().redo().run()}
            >
                Redo
            </button> */}
            <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={handleImageUpload}
                className="px-3 py-1 border rounded mr-2 text-sm font-medium bg-pink-200 hover:bg-pink-300 transition"
                >
                Upload Image
            </button>
            </div>
        )
    }
    
    return (
        <div className='flex flex-col space-y-2'>
            <MenuBar editor={editor} />
            <div className="border border-gray-300 rounded py-4 px-2 bg-pink-200 shadow-inner shadow-black/10 lg:min-h-64 lg:max-h-64 max-h-36 overflow-y-scroll">
                <EditorContent editor={editor} className="ProseMirror" />
            </div>
        </div>
        
    )
}

export default TextEditor

// const MenuBar = () => {
//   const { editor } = useCurrentEditor()

//   if (!editor) {
//     return null
//   }

//   return (
//     <div className="control-group">
//       <div className="button-group">
//         <button
//           onClick={() => editor.chain().focus().toggleBold().run()}
//           disabled={
//             !editor.can()
//               .chain()
//               .focus()
//               .toggleBold()
//               .run()
//           }
//           className={editor.isActive('bold') ? 'is-active' : ''}
//         >
//           Bold
//         </button>
//         <button
//           onClick={() => editor.chain().focus().toggleItalic().run()}
//           disabled={
//             !editor.can()
//               .chain()
//               .focus()
//               .toggleItalic()
//               .run()
//           }
//           className={editor.isActive('italic') ? 'is-active' : ''}
//         >
//           Italic
//         </button>
//         <button
//           onClick={() => editor.chain().focus().toggleStrike().run()}
//           disabled={
//             !editor.can()
//               .chain()
//               .focus()
//               .toggleStrike()
//               .run()
//           }
//           className={editor.isActive('strike') ? 'is-active' : ''}
//         >
//           Strike
//         </button>
//         <button
//           onClick={() => editor.chain().focus().toggleCode().run()}
//           disabled={
//             !editor.can()
//               .chain()
//               .focus()
//               .toggleCode()
//               .run()
//           }
//           className={editor.isActive('code') ? 'is-active' : ''}
//         >
//           Code
//         </button>
//         <button onClick={() => editor.chain().focus().unsetAllMarks().run()}>
//           Clear marks
//         </button>
//         <button onClick={() => editor.chain().focus().clearNodes().run()}>
//           Clear nodes
//         </button>
//         <button
//           onClick={() => editor.chain().focus().setParagraph().run()}
//           className={editor.isActive('paragraph') ? 'is-active' : ''}
//         >
//           Paragraph
//         </button>
//         <button
//           onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
//           className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}
//         >
//           H1
//         </button>
//         <button
//           onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
//           className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
//         >
//           H2
//         </button>
//         <button
//           onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
//           className={editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}
//         >
//           H3
//         </button>
//         <button
//           onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
//           className={editor.isActive('heading', { level: 4 }) ? 'is-active' : ''}
//         >
//           H4
//         </button>
//         <button
//           onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
//           className={editor.isActive('heading', { level: 5 }) ? 'is-active' : ''}
//         >
//           H5
//         </button>
//         <button
//           onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
//           className={editor.isActive('heading', { level: 6 }) ? 'is-active' : ''}
//         >
//           H6
//         </button>
//         <button
//           onClick={() => editor.chain().focus().toggleBulletList().run()}
//           className={editor.isActive('bulletList') ? 'is-active' : ''}
//         >
//           Bullet list
//         </button>
//         <button
//           onClick={() => editor.chain().focus().toggleOrderedList().run()}
//           className={editor.isActive('orderedList') ? 'is-active' : ''}
//         >
//           Ordered list
//         </button>
//         <button
//           onClick={() => editor.chain().focus().toggleCodeBlock().run()}
//           className={editor.isActive('codeBlock') ? 'is-active' : ''}
//         >
//           Code block
//         </button>
//         <button
//           onClick={() => editor.chain().focus().toggleBlockquote().run()}
//           className={editor.isActive('blockquote') ? 'is-active' : ''}
//         >
//           Blockquote
//         </button>
//         <button onClick={() => editor.chain().focus().setHorizontalRule().run()}>
//           Horizontal rule
//         </button>
//         <button onClick={() => editor.chain().focus().setHardBreak().run()}>
//           Hard break
//         </button>
//         <button
//           onClick={() => editor.chain().focus().undo().run()}
//           disabled={
//             !editor.can()
//               .chain()
//               .focus()
//               .undo()
//               .run()
//           }
//         >
//           Undo
//         </button>
//         <button
//           onClick={() => editor.chain().focus().redo().run()}
//           disabled={
//             !editor.can()
//               .chain()
//               .focus()
//               .redo()
//               .run()
//           }
//         >
//           Redo
//         </button>
//         <button
//           onClick={() => editor.chain().focus().setColor('#958DF1').run()}
//           className={editor.isActive('textStyle', { color: '#958DF1' }) ? 'is-active' : ''}
//         >
//           Purple
//         </button>
//       </div>
//     </div>
//   )
//     }

//     const extensions = [
//       Color.configure({ types: [TextStyle.name, ListItem.name] }),
//       TextStyle.configure({ types: [ListItem.name] }),
//       StarterKit.configure({
//         bulletList: {
//           keepMarks: true,
//           keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
//         },
//         orderedList: {
//           keepMarks: true,
//           keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
//         },
//       }),
//     ]

//     const content = ``
{/* <EditorProvider  extensions={extensions} content={content}></EditorProvider>  */}