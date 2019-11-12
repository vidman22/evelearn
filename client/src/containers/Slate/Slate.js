import React from 'react';
import Plain from 'slate-plain-serializer'
import { Editor,getEventTransfer } from 'slate-react';
import {isKeyHotkey} from 'is-hotkey';
import { Block  } from 'slate';
import { css } from 'emotion';
import SlateDeepTable from 'slate-deep-table';
import imageExtensions from 'image-extensions'
import isUrl from 'is-url'
import { Button, Toolbar } from '../../components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-regular-svg-icons';
import { faHeading, faUnderline, faListUl, faListOl, faItalic, faBold, faQuoteLeft, faHighlighter, faTable, faCode } from '@fortawesome/free-solid-svg-icons';

import './Slate.css';


const plugins = [
    SlateDeepTable()];


function isImage(url) {
  return imageExtensions.includes(getExtension(url))
}

function getExtension(url) {
  return new URL(url).pathname.split('.').pop()
}

function insertImage(editor, src, target) {
  if (target) {
    editor.select(target)
  }

  editor.insertBlock({
    type: 'image',
    data: { src },
  })
}

const schema = {
  document: {
    last: { type: 'paragraph' },
    normalize: (editor, { code, node, child }) => {
        if (code === 'last_child_type_invalid') {
          const paragraph = Block.create('paragraph')
          return editor.insertNodeByKey(node.key, node.nodes.size, paragraph)
      }
    },
  },
  blocks: {
    image: {
      isVoid: true,
    },
  },
}

const DEFAULT_NODE = 'paragraph';

const isBoldHotkey = isKeyHotkey('mod+b')
const isItalicHotkey = isKeyHotkey('mod+i')
const isUnderlineddHotkey = isKeyHotkey('mod+u')
const isCodeHotkey = isKeyHotkey('mod+`')

// Define our app...
export default class Slate extends React.Component {
    // Set the initial value when the app is first constructed.
    constructor(props){
      super(props);
      this.state = {
        
        inputValue: '',
        offsets: [],
        replacementValue: '',
        string: '',
        index: 0,
      }
  }

    schema = {
      annotations: {
        highlight: {
          isAtomic: true,
        },
      },
    };

  onInsertTable = () => {
    const editor = this.props.parentref.current;
      this.props.onChange(
          editor.insertTable()
      );
  }

  onInsertColumn = () => {
    const editor = this.props.parentref.current;
      this.props.onChange(
          editor.insertColumn()
      );
  }

  onInsertRow = () => {
    const editor = this.props.parentref.current;
      this.props.onChange(
          editor.insertRow()
      );
  }

  onRemoveColumn = () => {
    const editor = this.props.parentref.current;
      this.props.onChange(
          editor.removeColumn()
      );
  }

  onRemoveRow= () => {
    const editor = this.props.parentref.current;
      this.props.onChange(
          editor.removeRow()
      );
  }

  onRemoveTable = () => {
    const editor = this.props.parentref.current;
      this.props.onChange(
          editor.removeTable()
      );
  }

  onToggleHeaders = () => {
    const editor = this.props.parentref.current;
      this.props.onChange(
          editor.toggleTableHeaders()
      );
  }

  renderNormalToolbar = () => {
      return (
          <div className="buttons">
              <button onClick={this.onInsertTable}>Insert Table</button>
          </div>
      );
  }

  renderTableToolbar = () => {
    return (
        <div className="buttons">
            <button onClick={this.onInsertTable}>Insert Table</button>
            <button onClick={this.onInsertColumn}>Insert Column</button>
            <button onClick={this.onInsertRow}>Insert Row</button>
            <button onClick={this.onRemoveColumn}>Remove Column</button>
            <button onClick={this.onRemoveRow}>Remove Row</button>
            <button onClick={this.onRemoveTable}>Remove Table</button>
            <button onClick={this.onToggleHeaders}>Toggle Headers</button>
        </div>
    );
}

    hasMark = type => {
      const { value } = this.props;
      return value.activeMarks.some(mark => mark.type === type)
    }

    hasBlock = type => {
      const { value } = this.props;
      return value.blocks.some(node => node.type === type)
    }
  
    // Render the editor.
    render() {
      
      const {value} = this.props;
      let isTable;
     if(!this.props.readOnly) {
       isTable = this.props.parentref.current && this.props.parentref.current.isSelectionInTable(value);
     }
      return (
        <div className="SlateEditor">
          {!this.props.readOnly &&
             <Toolbar>
            {this.renderMarkButton('bold', faBold)}
            {this.renderMarkButton('italic', faItalic)}
            {this.renderMarkButton('underlined', faUnderline)}
            {this.renderMarkButton('code', faCode)}
            {this.renderMarkButton('highlight', faHighlighter)}
            {this.renderBlockButton('heading-one', faHeading)}
            {this.renderBlockButton('heading-two', faHeading)}
            {this.renderBlockButton('block-quote', faQuoteLeft)}
            {this.renderBlockButton('numbered-list', faListOl)}
            {this.renderBlockButton('bulleted-list', faListUl)}
            {this.renderBlockButton('table', faTable)}
            {this.renderBlockButton('image', faImage)}
          </Toolbar>}
          {isTable ? this.renderTableToolbar() : null}

        
        <Editor
          spellCheck
          autoFocus
          placeholder="Place text here..."
          plugins={plugins}
          ref={this.props.parentref}
          value={value}
          onChange={this.props.onChange}
          onKeyDown={this.onKeyDown}
          onDrop={this.onDropOrPaste}
          onPaste={this.onDropOrPaste}
          readOnly={this.props.readOnly}
          renderAnnotation={this.renderAnnotation}
          renderBlock={this.renderBlock}
          renderMark={this.renderMark}
          schema={schema}
          
        />
        </div>
      )
    }

    renderAnnotation = (props, editor, next) => {
      const { children, annotation, attributes } = props
  
      switch (annotation.type) {
        case 'searchHighlight':
          return (
            <span {...attributes} style={{ backgroundColor: '#ffeeba' }}>
              {children}
            </span>
          )
        case 'searchHighlightOptions':
            return (
              <span {...attributes} style={{ backgroundColor: '#ffeebb' }}>
                {children}
              </span>
          )
        case 'placeholder':
           return (
            <div {...attributes} style={{ display: 'inline', backgroundColor: '#eee', textDecoration: 'underline' }}>
                {children}
            </div>
        )
        default:
          return next()
      }
    }

    renderBlockButton = (type, icon) => {
      let isActive = this.hasBlock(type)
  
      if (['numbered-list', 'bulleted-list'].includes(type)) {
        const { value: { document, blocks } } = this.props;
  
        if (blocks.size > 0) {
          const parent = document.getParent(blocks.first().key)
          isActive = this.hasBlock('list-item') && parent && parent.type === type
        }
      }
  
      return (
        <Button
          active={isActive}
          onMouseDown={event => this.onClickBlock(event, type)}
        >
          <FontAwesomeIcon icon={icon} size="lg" />
        </Button>
      )
    }

    renderMarkButton = (type, icon) => {
      const isActive = this.hasMark(type)
  
      return (
        <Button
          active={isActive}
          onMouseDown={event => this.onClickMark(event, type)}
        >
          <FontAwesomeIcon icon={icon} size="lg" />
        </Button>
      )
    }

    renderBlock = (props, editor, next) => {
      const { attributes, children, node, isFocused } = props
  
      switch (node.type) {
        case 'block-quote':
          return <blockquote {...attributes}>{children}</blockquote>
        case 'bulleted-list':
          return <ul {...attributes}>{children}</ul>
        case 'heading-one':
          return <h1 {...attributes}>{children}</h1>
        case 'heading-two':
          return <h3 {...attributes}>{children}</h3>
        case 'list-item':
          return <li {...attributes}>{children}</li>
        case 'numbered-list':
          return <ol {...attributes}>{children}</ol>
        case 'heading':    
          return <h1 {...props.attributes}>{props.children}</h1>;
        case 'subheading': 
          return <h2 {...props.attributes}>{props.children}</h2>;
        case 'image': {
          const src = node.data.get('src')
          return (
            <img
              {...attributes}
              src={src}
              alt={src}
              className={css`
                display: block;
                max-width: 100%;
                max-height: 20em;
                box-shadow: ${isFocused ? '0 0 0 2px blue;' : 'none'};
              `}
            />
          )}
        default:
          return next()
        }
    }

    renderMark = (props, editor, next) => {
      const { children, mark, attributes } = props
  
      switch (mark.type) {
        case 'bold':
          return <strong {...attributes}>{children}</strong>
        case 'code':
          return <code {...attributes}>{children}</code>
        case 'italic':
          return <em {...attributes}>{children}</em>
        case 'underlined':
          return <u {...attributes}>{children}</u>
        case 'highlight':
          return <span {...attributes} style={{backgroundColor: '#d5f4e6'}}>{children}</span>
        case 'insertText':
          return <mark {...attributes} style={{textDecoration: 'underline'}}>{children}</mark>
        case 'omission':
          return <slot {...attributes} style={{ backgroundColor: '#eee', textDecoration: 'underline'}}>{children}</slot>
        case 'omissionWithOptions':
          return <ins {...attributes} style={{ backgroundColor: '#eee', borderTop: '1px solid #eee', textDecoration: 'underline'}}>{children}</ins>
        default:
          return next()
      }
    }

    onKeyDown = (event, editor, next) => {
      let mark
  
      if (isBoldHotkey(event)) {
        mark = 'bold'
      } else if (isItalicHotkey(event)) {
        mark = 'italic'
      } else if (isUnderlineddHotkey(event)) {
        mark = 'underlined'
      } else if (isCodeHotkey(event)) {
        mark = 'code'
      } else {
        return next()
      }
  
      event.preventDefault()
      editor.toggleMark(mark)

      const { value } = editor
      const { document, selection } = value
      const { start, isCollapsed } = selection
      const startNode = document.getDescendant(start.key)
  
      if (isCollapsed && start.isAtStartOfNode(startNode)) {
        const previous = document.getPreviousText(startNode.key)
  
        if (!previous) {
          return next()
        }
  
        const prevBlock = document.getClosestBlock(previous.key)
  
        if (prevBlock.type === 'table-cell') {
          if (['Backspace', 'Delete', 'Enter'].includes(event.key)) {
            event.preventDefault()
          } else {
            return next()
          }
        }
      }
  
      if (value.startBlock.type !== 'table-cell') {
        return next()
      }
  

      switch (event.key) {
        case 'Backspace':
          return this.onBackspace(event, editor, next)
        case 'Delete':
          return this.onDelete(event, editor, next)
        case 'Enter':
          return this.onEnter(event, editor, next)
        default:
          return next()
      }
    }

    onClickMark = (event, type) => {
      event.preventDefault()
      this.props.parentref.current.toggleMark(type)
    }

    onClickBlock = (event, type) => {
      event.preventDefault();
      const editor = this.props.parentref.current;
  
      const { value } = editor
      const { document } = value
  
      // Handle everything but list buttons.
      if (type !== 'bulleted-list' && type !== 'numbered-list' && type !=='table' && type !=='image') {
        const isActive = this.hasBlock(type)
        const isList = this.hasBlock('list-item')
  
        if (isList) {
          editor
            .setBlocks(isActive ? DEFAULT_NODE : type)
            .unwrapBlock('bulleted-list')
            .unwrapBlock('numbered-list')
        } else {
         
          editor.setBlocks(isActive ? DEFAULT_NODE : type)
        }
      } else if (type ==='table') {
        
        this.onInsertTable();
      } else if (type === 'image') {
        this.onClickImage();
      }else {
        // Handle the extra wrapping required for list buttons.
        const isList = this.hasBlock('list-item')
        const isType = value.blocks.some(block => {
          return !!document.getClosest(block.key, parent => parent.type === type)
        })
  
        if (isList && isType) {
          editor
            .setBlocks(DEFAULT_NODE)
            .unwrapBlock('bulleted-list')
            .unwrapBlock('numbered-list')
        } else if (isList) {
          editor
            .unwrapBlock(
              type === 'bulleted-list' ? 'numbered-list' : 'bulleted-list'
            )
            .wrapBlock(type)
        } else {
          editor.setBlocks('list-item').wrapBlock(type)
        }
      }
    }

    onBackspace = (event, editor, next) => {
      const { value } = editor
      const { selection } = value
      if (selection.start.offset !== 0) return next()
      event.preventDefault()
    }

    onDelete = (event, editor, next) => {
      const { value } = editor
      const { selection } = value
      if (selection.end.offset !== value.startText.text.length) return next()
      event.preventDefault()
    }

    onEnter = (event, editor, next) => {
      event.preventDefault()
    }

    onClickImage = () => {
      // event.preventDefault();
      const editor = this.props.parentref.current;
      const src = window.prompt('Enter the URL of the image. Or drag and drop from your computer into the editor. Or copy and paste image or url into editor')
      if (!src) return
        editor.command(insertImage, src)
    }

    onDropOrPaste = (event, editor, next) => {
      
      const transfer = getEventTransfer(event)
      const { value } = editor
      const { text = '' } = transfer
  
      if (value.startBlock.type !== 'table-cell') {
        return next()
      }
  
      if (!text) {
        return next()
      }
  
      const lines = text.split('\n')
      const { document } = Plain.deserialize(lines[0] || '')
      editor.insertFragment(document)

      const target = editor.findEventRange(event)
      if (!target && event.type === 'drop') return next()
  
      const { type, files } = transfer
  
      if (type === 'files') {
        for (const file of files) {
          const reader = new FileReader()
          const [mime] = file.type.split('/')
          if (mime !== 'image') continue
  
          reader.addEventListener('load', () => {
            editor.command(insertImage, reader.result, target)
          })
  
          reader.readAsDataURL(file)
        }
        return
      }
  
      if (type === 'text') {
        if (!isUrl(text)) return next()
        if (!isImage(text)) return next()
        editor.command(insertImage, text, target)
        return
      }
  
      next()
    }

  }
