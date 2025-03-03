import * as THREE from "three"
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js"

let sheetResponseBounded = []
let filesResponseBounded = []
let filesResponseBoundedIterator

let apiKeys = [
    ["AIzaSyAaK_K5ZedO5Gez6qd45s--Djk8XyqeBBw", true],
    ["AIzaSyD15tvXajAu0P9GGQjai-DZrja8MbMx_JE", true],
    ["AIzaSyB6qB-I7tdy9IIX1btiWmJ--xqT7uKBYtE", true],
    ["AIzaSyAqVX_uG29dogcreKtW6cSLVyiHQOqefgw", true],
    ["AIzaSyCkPuFIZUvas34L1pM42-iEAwzewMv_54U", true],
    ["AIzaSyBBpR5YqGFXgH77H5UCo1u3_q1GJFn1ISs", true]

]

let apiMessage = "It looks like you have reloaded the page many times. Please wait a little while until we can response to your request."
async function someBrowsersDoNotSupportGlobalAwaits() {
    let filesResponse
    let sheetResponse

    try {
        filesResponse = await (await fetch(`https://www.googleapis.com/drive/v3/files?q='1BHeR3ZdgC78LlmGCWX-VjlHYXkfbC0YVWngzeaQ5S5GXXUo5jMQicIOlS9hlYOyo0p4p2cXT'+in+parents&key=${apiKeys[0][0]}`)).json()
    } catch (e) {
        alert(apiMessage)
        return
    }

    try {
        sheetResponse = await (await fetch(`https://sheets.googleapis.com/v4/spreadsheets/1zAAbzVA5-qK7UevrBGPiIJ0uHYu9wcegUK0pTES0JSw/values/Sheet1?key=${apiKeys[0][0]}`)).json()
    } catch (e) {
        alert(apiMessage)
        return
    }
    sheetResponse["values"].reverse()

    for (let [i, elem] of sheetResponse["values"].entries()) {
        if (elem.length == 3 && elem[0] != "For which model is this texture for?") {
            sheetResponseBounded.push(sheetResponse["values"][i])
            filesResponseBounded.push(filesResponse["files"][i])
        }
    }

    for (let elem of filesResponseBounded) {
        let placeholder = document.createElement("div")
        placeholder.classList.add("grid__placeholder-item")
        document.querySelector(".grid").appendChild(placeholder)
    }

    filesResponseBoundedIterator = filesResponseBounded.entries()
    createPreviews()
}
someBrowsersDoNotSupportGlobalAwaits()

let camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000)
let renderer = new THREE.WebGLRenderer({ antialias: true })
let loader = new GLTFLoader()
let light = new THREE.HemisphereLight(0xffffff, 0x717173, 3)
let material = new THREE.MeshStandardMaterial()
camera.position.z = 100
renderer.setSize(1200, 1200)
async function createPreviews() {
    let res = filesResponseBoundedIterator.next()
    if (res.done)
        return
    let [i, file] = res.value
    let blobResponse
    while (apiKeys[0][1])
        try {
            blobResponse = await (await fetch(`https://www.googleapis.com/drive/v3/files/${file["id"]}?key=${apiKeys[0][0]}&alt=media`)).blob()
            break
        } catch (e) {
            changeVariant()
            apiKeys[0][1] = false
            apiKeys.unshift(apiKeys.pop())
        }
    if (!apiKeys[0][1]) {
        for (let elem of apiKeys)
            elem[1] = true
        return
    }

    renderer.setClearColor(sheetResponseBounded[i][1].length == 7 ?
        parseInt(sheetResponseBounded[i][1].replace("#", ""), 16) : 0x16161a, 1)
    let forModel = sheetResponseBounded[i][0]

    await loader.load({
        "T-Shirt": "/models/TShirt.glb",
        "Cap": "/models/Cap.glb",
        "Pants": "/models/Pants.glb",
        "Hoodie": "/models/Hoodie.glb"
    }[forModel], function (gltf) {
        gltf.scene.add(light)
        const loadMeshTextureAndNormals = () => new Promise((resolve, reject) => {
            const manager = new THREE.LoadingManager(() => resolve(textureAndNormals))
            const textureAndNormals = [
                (new THREE.TextureLoader(manager)).load(URL.createObjectURL(blobResponse)),
                (new THREE.TextureLoader(manager)).load({
                        "T-Shirt": "/images/T_TShirt_NL_8K.png",
                        "Cap": "/images/T_Cap_NL_8K.png",
                        "Pants": "/images/T_Pants_NL_8K.png",
                        "Hoodie": "/images/T_Hoodie_NL_8K.png",
                    }[forModel]),
            ]
        })
        loadMeshTextureAndNormals().then(result => {
            result[0].flipY = false
            result[1].flipY = false
            material.map = result[0]
            material.normalMap = result[1]
            gltf.scene.traverse(o => {
            if (o.isMesh) {
                o.material = material
            }
            })
            renderer.clear()
            renderer.render(gltf.scene, camera)
            let copiedCanvas = document.createElement("canvas")
            copiedCanvas.classList.add("wide")
            copiedCanvas.setAttribute("width", 1200)
            copiedCanvas.setAttribute("height", 1200)
            copiedCanvas.getContext("2d").drawImage(renderer.domElement, 0, 0)
            document.querySelectorAll(".grid__placeholder-item")[i].appendChild(copiedCanvas)
            document.querySelectorAll(".grid__placeholder-item")[i].style = "background: unset; aspect-ratio: unset;"
            document.querySelectorAll(".grid__placeholder-item")[i].addEventListener("click", () => {
                window.location.href = `https://contest.innohassle.ru/artwork.html?id=${filesResponseBounded[i]["id"]}`
            })
            createPreviews()
        })
    }, undefined, function (error) {
        console.error(error)
    })
}

// burger
document.querySelector(".burger").addEventListener("click", () => {
    document.querySelector(".burger__line-1").classList.toggle("burger__line-1_full")
    document.querySelector(".navigation-bar__menu").classList.toggle("top-100")
})

let loadingOpacity = 1
function loadingGradualDisappearing() {
    loadingOpacity -= 0.01
    loadingOpacity = Math.max(loadingOpacity, 0)
    document.querySelector(".loading").style.opacity = loadingOpacity
    setTimeout(loadingGradualDisappearing, 100)
}
loadingGradualDisappearing()

let variant = 1
function changeVariant() {
    variant += 1
    if (variant == 7) {
        document.querySelector(".figure__text").textContent = `The gallery is unavailable now`
        document.querySelector(".bottom-subfont").textContent = `You will be redirected to the previous page in 5 seconds.`
        setTimeout(() => { history.back() }, 5000)
    }
    else
        document.querySelector(".figure__text").textContent = `Loading: Variant ${variant}`
    loadingOpacity = 1
}
