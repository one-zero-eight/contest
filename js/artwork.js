import * as THREE from "three"
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js"

let sheetResponseBounded = []
let filesResponseBounded = []

let apiKey = "AIzaSyAaK_K5ZedO5Gez6qd45s--Djk8XyqeBBw"

async function someBrowsersDoNotSupportGlobalAwaits() {
    let responseAwaits = 1

    let filesResponse
    let sheetResponse

    while (true) {
        filesResponse = await fetch(`https://www.googleapis.com/drive/v3/files?q='1BHeR3ZdgC78LlmGCWX-VjlHYXkfbC0YVWngzeaQ5S5GXXUo5jMQicIOlS9hlYOyo0p4p2cXT'+in+parents&key=${apiKey}`)
        if (filesResponse["status"] == 200) {
            filesResponse = await filesResponse.json()
            break
        } else {
            responseAwaits += 1
            let time = 2 ** responseAwaits * 1000 + Math.random() * 1000
            changeVariant(time)
            await new Promise(resolve => setTimeout(resolve, time))
        }
    }

    responseAwaits = 1

    while (true) {
        sheetResponse = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/1zAAbzVA5-qK7UevrBGPiIJ0uHYu9wcegUK0pTES0JSw/values/Sheet1?key=${apiKey}`)
        if (sheetResponse["status"] == 200) {
            sheetResponse = await sheetResponse.json()
            break
        } else {
            responseAwaits += 1
            let time = 2 ** responseAwaits * 1000 + Math.random() * 1000
            changeVariant(time)
            await new Promise(resolve => setTimeout(resolve, time))
        }
    }
    sheetResponse["values"].reverse()

    responseAwaits = 1

    let requestedArtworkId = (new URLSearchParams(document.location.search)).get("id")

    let thumbnailResponse
    while (true) {
        thumbnailResponse = await fetch(`https://www.googleapis.com/drive/v3/files/${requestedArtworkId}?fields=thumbnailLink&key=${apiKey}`)
        if (thumbnailResponse["status"] == 200) {
            thumbnailResponse = await thumbnailResponse.json()
            break
        } else {
            responseAwaits += 1
            let time = 2 ** responseAwaits * 1000 + Math.random() * 1000
            changeVariant(time)
            await new Promise(resolve => setTimeout(resolve, time))
        }
    }
    thumbnailResponse.thumbnailLink = thumbnailResponse["thumbnailLink"].slice(0, thumbnailResponse["thumbnailLink"].indexOf("=s")) + "=s1920"

    responseAwaits = 1

    let currentImage
    while (true) {
        currentImage = (await fetch(`${thumbnailResponse["thumbnailLink"]}`))
        if (currentImage["status"] == 200) {
            currentImage = await currentImage.blob()
            break
        } else {
            currentImage = await fetch(`https://www.googleapis.com/drive/v3/files/${requestedArtworkId}?key=${apiKey}&alt=media`)
            if (currentImage["status"] == 200) {
                currentImage = await currentImage.blob()
                break
            } else {
                responseAwaits += 1
                let time = 2 ** responseAwaits * 1000 + Math.random() * 1000
                changeVariant(time)
                await new Promise(resolve => setTimeout(resolve, time))
            }
        }
    }

    for (let [i, elem] of sheetResponse["values"].entries()) {
        if (elem.length == 3 && elem[0] != "For which model is this texture for?") {
            if (filesResponse["files"][i]["id"] != requestedArtworkId)
                continue

            let previousIndex = i > 0 ? i - 1 : filesResponse["files"].length - 1
            while (sheetResponse["values"][previousIndex].length != 3 || sheetResponse["values"][previousIndex][0] == "For which model is this texture for?")
                previousIndex = previousIndex > 0 ? previousIndex - 1 : filesResponse["files"].length - 1
            let nextIndex = i < filesResponse["files"].length - 1 ? i + 1 : 0
            while (sheetResponse["values"][nextIndex].length != 3 || sheetResponse["values"][nextIndex][0] == "For which model is this texture for?")
                nextIndex = nextIndex < filesResponse["files"].length - 1 ? nextIndex + 1 : 0
            sheetResponseBounded.push(sheetResponse["values"][previousIndex])
            filesResponseBounded.push(filesResponse["files"][previousIndex])
            sheetResponseBounded.push(sheetResponse["values"][i])
            filesResponseBounded.push(filesResponse["files"][i])
            sheetResponseBounded.push(sheetResponse["values"][nextIndex])
            filesResponseBounded.push(filesResponse["files"][nextIndex])
            break
        }
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

let loadingOpacity = 1
function loadingGradualDisappearing() {
    loadingOpacity -= 0.01
    loadingOpacity = Math.max(loadingOpacity, 0)
    document.querySelector(".loading").style.opacity = loadingOpacity
    setTimeout(loadingGradualDisappearing, 20)
}
loadingGradualDisappearing()

function changeVariant(time) {
    document.querySelector(".figure__text").textContent = `The request for artworks is unsuccessful`
    document.querySelector(".bottom-subfont").textContent = `We are going to try again in ${Math.round(time / 1000)} seconds`
    loadingOpacity = 1
}
