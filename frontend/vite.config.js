import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'


// https://vite.dev/config/
export default defineConfig({
  plugins: [ tailwindcss(),react()],
  server:{
    headers:{
      "Cross-Origin-Embedder-Policy":"require-corp",
      "Cross-Origin-Opener-Policy":"same-origin"
    },

    proxy:{
      "/cdn":{
        target :  "https://unpkg.com",
        changeOrigin:true,
        rewrite:(path)=>path.replace(/^\/cdn/,'')
      }
    }

  }
})
0