import * as THREE from "three"
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js"
import { textureData } from "./texture-data.js"

let sheetResponseBounded = [];
let filesResponseBounded = [];
let filesResponseBoundedIterator;

async function initializeGallery() {
  // Create file objects from texture data
  for (const texture of textureData) {
    filesResponseBounded.push({
      id: texture.id,
      thumbnailLink: texture.path
    });
    
    sheetResponseBounded.push([
      texture.modelType,
      texture.color,
      ""
    ]);
    
    // Create placeholder for each texture
    let placeholder = document.createElement("div");
    placeholder.classList.add("grid__placeholder-item");
    document.querySelector(".grid").appendChild(placeholder);
  }

  filesResponseBoundedIterator = filesResponseBounded.entries();
  createPreviews();
}

initializeGallery();

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

    let responseAwaits = 1

    // Load texture from local file
    let blobResponse = await fetch(file["thumbnailLink"])
    if (blobResponse.status !== 200) {
        console.error(`Failed to load texture: ${file["thumbnailLink"]}`)
        createPreviews() // Skip to next texture
        return
    }
    blobResponse = await blobResponse.blob()

    let bitmap = await window.createImageBitmap(blobResponse)
    let manipulativeCanvas = document.createElement("canvas")
    manipulativeCanvas.setAttribute("width", bitmap.width)
    manipulativeCanvas.setAttribute("height", bitmap.height)
    let context = manipulativeCanvas.getContext("2d")
    context.drawImage(bitmap, 0, 0)
    let imageData = context.getImageData(0, 0, bitmap.width, bitmap.height)
    let data = imageData.data
    for (let i = 0; i < data.length; i += 4) {
        if (data[i] < 3 && data[i + 1] < 3 && data[i + 2] < 3) {
            data[i] = data[i + 1] = data[i + 2] = 3
        }
    }
    context.putImageData(imageData, 0, 0)
    manipulativeCanvas.toBlob(blobResponse => {
        renderer.setClearColor(sheetResponseBounded[i][1].length == 7 ?
            parseInt(sheetResponseBounded[i][1].replace("#", ""), 16) : 0x16161a, 1)
        let forModel = sheetResponseBounded[i][0]

        loader.load({
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
        manipulativeCanvas.remove()
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

function changeVariant(time) {
    document.querySelector(".figure__text").textContent = `The request for artworks is unsuccessful`
    document.querySelector(".bottom-subfont").textContent = `We are going to try again in ${Math.round(time / 1000)} seconds`
    loadingOpacity = 1
}
