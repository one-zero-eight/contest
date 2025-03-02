import * as THREE from "three"
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js"

let sheetResponseBounded = []
let filesResponseBounded = []

let apiMessage = "It looks like you have reloaded the page many times. Please wait a little while until we can response to your request."
async function someBrowsersDoNotSupportGlobalAwaits() {
    let filesResponse
    let sheetResponse

    try {
        filesResponse = await (await fetch("https://www.googleapis.com/drive/v3/files?q='1BHeR3ZdgC78LlmGCWX-VjlHYXkfbC0YVWngzeaQ5S5GXXUo5jMQicIOlS9hlYOyo0p4p2cXT'+in+parents&key=AIzaSyAaK_K5ZedO5Gez6qd45s--Djk8XyqeBBw")).json()
    } catch (e) {
        alert(apiMessage)
        return
    }

    try {
        sheetResponse = await (await fetch("https://sheets.googleapis.com/v4/spreadsheets/1zAAbzVA5-qK7UevrBGPiIJ0uHYu9wcegUK0pTES0JSw/values/Sheet1?key=AIzaSyAaK_K5ZedO5Gez6qd45s--Djk8XyqeBBw")).json()
    } catch (e) {
        alert(apiMessage)
        return
    }
    sheetResponse["values"].reverse()

    let requestedArtworkId = (new URLSearchParams(document.location.search)).get("id")
    let currentImage
    try {
        currentImage = await (await fetch(`https://www.googleapis.com/drive/v3/files/${requestedArtworkId}?key=AIzaSyAaK_K5ZedO5Gez6qd45s--Djk8XyqeBBw&alt=media`)).blob()
    } catch (e) {
        alert(apiMessage)
        return
    }

    for (let [i, elem] of sheetResponse["values"].entries()) {
        if (elem.length == 3 && elem[0] != "For which model is this texture for?") {
            if (filesResponse["files"][i]["id"] != requestedArtworkId)
                continue

            let previousIndex = i > 0 ? i - 1 : filesResponse["files"].length - 1
            let nextIndex = i < filesResponse["files"].length - 1 ? i + 1 : 0
            sheetResponseBounded.push(sheetResponse["values"][previousIndex])
            filesResponseBounded.push(filesResponse["files"][previousIndex])
            sheetResponseBounded.push(sheetResponse["values"][i])
            filesResponseBounded.push(filesResponse["files"][i])
            sheetResponseBounded.push(sheetResponse["values"][nextIndex])
            filesResponseBounded.push(filesResponse["files"][nextIndex])
            break
        }
    }

    if (sheetResponseBounded.length == 0) {
        alert(apiMessage)
        return
    }

    createView(currentImage, requestedArtworkId)
    document.querySelector("#get").setAttribute("href", URL.createObjectURL(currentImage))
    document.querySelector("#get").setAttribute("download", `T_${sheetResponseBounded[1][0].replace("-", "")}_BC`)
}
someBrowsersDoNotSupportGlobalAwaits()
addEventListeners()

let camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000)
let renderer = new THREE.WebGLRenderer({ antialias: true })
let loader = new GLTFLoader()
let light = new THREE.HemisphereLight(0xffffff, 0x717173, 3)
let scene = new THREE.Scene()
scene.add(light)
let material = new THREE.MeshStandardMaterial()
camera.position.z = 100
renderer.setSize(1920, 1920)
function createView(blobResponse, id) {
    renderer.setClearColor(sheetResponseBounded[1][1].length == 7 ?
        parseInt(sheetResponseBounded[1][1].replace("#", ""), 16) : 0x16161a, 1)
    let forModel = sheetResponseBounded[1][0]

    loader.load({
        "T-Shirt": "/models/TShirt.glb",
        "Cap": "/models/Cap.glb",
        "Pants": "/models/Pants.glb",
        "Hoodie": "/models/Hoodie.glb"
    }[forModel], function (gltf) {
        scene.add(gltf.scene)
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
            document.querySelector(".viewerplace").classList.add("background_unset")
        })
    }, undefined, function (error) {
        console.error(error)
    })
    renderer.setAnimationLoop(() => {
        renderer.render(scene, camera)
    })
    renderer.domElement.classList.add("grid__placeholder-item__viewer")
    document.querySelector(".viewerplace").appendChild(renderer.domElement)
}

let globalSensetivity = 1 / 100
let sensetivity = 1 / 100
// change the sensetivity
document.querySelector("form").addEventListener("change", (event) => {
    sensetivity = document.querySelector("#k").value / 1000
    globalSensetivity = sensetivity
})
document.querySelector("#k").addEventListener("click", () => {
    document.querySelector("#k").classList.toggle("none")
})

let previousTouchX = 0
let previousTouchY = 0
let previousTouchXX = null
let previousTouchYY = null
let scaleMode = false
function addEventListeners() {
    document.querySelector(".cross").addEventListener("click", () => {
        history.back()
    })

    document.querySelector(".viewerplace").addEventListener("mousemove", event => {
        if (event.buttons == 1) {
            scene.rotation.y += event.movementX * sensetivity
            scene.rotation.x += event.movementY * sensetivity
        }
    })
    document.querySelector(".viewerplace").addEventListener("wheel", event => {
        camera.position.z += event.deltaY * 5 * sensetivity
    })

    document.querySelector(".viewerplace").addEventListener("touchstart", (event) => {
        previousTouchX = event.touches[0].screenX
        previousTouchY = event.touches[0].screenY
        if (event.touches.length > 1) {
            scaleMode = true
            previousTouchXX = event.touches[1].screenX
            previousTouchYY = event.touches[1].screenY
        }
    })
    document.querySelector(".viewerplace").addEventListener("touchmove", (event) => {
        if (scaleMode) {
            let delta = Math.sqrt((previousTouchX - previousTouchXX) ** 2 + (previousTouchY - previousTouchYY) ** 2)
            delta -= Math.sqrt((event.touches[1].screenX - event.touches[0].screenX) ** 2 + (event.touches[1].screenY - event.touches[0].screenY) ** 2)
            camera.position.z += delta * 25 * sensetivity
            previousTouchXX = event.touches[1].screenX
            previousTouchYY = event.touches[1].screenY
        } else {
            scene.rotation.y += (event.touches[0].screenX - previousTouchX) * sensetivity
            scene.rotation.x += (event.touches[0].screenY - previousTouchY) * sensetivity
        }
        previousTouchX = event.touches[0].screenX
        previousTouchY = event.touches[0].screenY
    })
    document.querySelector(".viewerplace").addEventListener("touchend", (event) => {
        if (event.touches.length == 0) {
            scaleMode = false
        }
    })
}

document.querySelector("#forward").addEventListener("click", () => {
    window.location.href = `https://contest.innohassle.ru/artwork.html?id=${filesResponseBounded[2]["id"]}`
})
document.querySelector("#backward").addEventListener("click", () => {
    window.location.href = `https://contest.innohassle.ru/artwork.html?id=${filesResponseBounded[0]["id"]}`
})
