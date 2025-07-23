import vituum from 'vituum'
import tailwindcss from '@tailwindcss/vite'
import expressions from 'posthtml-expressions'
import beautify from 'posthtml-beautify'
import posthtml from './plugins/posthtml/customPostHtml.js'

export default {
   vituum,
   posthtml,
   tailwindcss,
   expressions,
   beautify,
}