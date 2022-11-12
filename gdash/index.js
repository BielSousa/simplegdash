window.inicialize = inicialize

function inicialize(data_dash){
    initializeGoogleCharts(data_dash)
    initializeLeaflet()
    inicializeSimpleGDash(data_dash)
}

import { initializeDash } from "./main.js"

function initializeGoogleCharts(data_dash){
    // <script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>

    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = "https://www.gstatic.com/charts/loader.js"
    document.head.appendChild(script)
    script.addEventListener('load', ()=>{
    script.onload = initializeDash(data_dash)
        console.log('Inicializando google charts')
    })
    }

function initializeLeaflet(){
    //  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.2/dist/leaflet.css"
    //  integrity="sha256-sA+zWATbFveLLNqWO2gtiw3HL/lh1giY/Inf1BJ0z14="
    //  crossorigin=""/>
    //  <script src="https://unpkg.com/leaflet@1.9.2/dist/leaflet.js"
    //     integrity="sha256-o9N1jGDZrf5tS+Ft4gbIK7mYMipq9lqpVJ91xHSyKhg="
    //     crossorigin=""></script>

    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://unpkg.com/leaflet@1.9.2/dist/leaflet.css'
    link.integrity = 'sha256-sA+zWATbFveLLNqWO2gtiw3HL/lh1giY/Inf1BJ0z14='
    link.crossOrigin =''
    const script = document.createElement("script")
    script.src = 'https://unpkg.com/leaflet@1.9.2/dist/leaflet.js'
    script.integrity = 'sha256-o9N1jGDZrf5tS+Ft4gbIK7mYMipq9lqpVJ91xHSyKhg='
    script.crossOrigin =''
    document.head.appendChild(link)    
    document.head.appendChild(script)    
}

function inicializeSimpleGDash(){
    // <script type='module' src='./gdash/main.js'></script>
    // <link  rel="stylesheet" type="text/css" href="./gdash/css/main.css"></link>

    const script = document.createElement('script')
    script.type = 'module'
    script.src = './gdash/main.js'
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.type = 'text/css'
    link.href = './gdash/css/main.css'
    document.head.appendChild(link)
    document.head.appendChild(script)
    script.addEventListener('load', ()=>{
    console.log('Inicializando SimpleGDash')
    })
    script.addEventListener('error', ()=>{
    console.log('deu ruim')
    })
}