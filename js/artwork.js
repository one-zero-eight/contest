import * as THREE from "three"
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js"
import {textureData} from "./texture-data";

let sheetResponseBounded = [];
let filesResponseBounded = [];

async function initializeArtwork() {
  const requestedArtworkId = (new URLSearchParams(document.location.search)).get("id");
  
  // Find the requested texture in the texture data
  const currentTextureIndex = textureData.findIndex(texture => texture.id === requestedArtworkId);
  
  if (currentTextureIndex === -1) {
    console.error(`Texture with ID ${requestedArtworkId} not found`);
    changeVariant(2000);
    return;
  }
  
  // Get previous, current, and next textures
  const prevIndex = currentTextureIndex > 0 ? currentTextureIndex - 1 : textureData.length - 1;
  const nextIndex = currentTextureIndex < textureData.length - 1 ? currentTextureIndex + 1 : 0;
  
  // Add to bounded arrays for navigation
  sheetResponseBounded.push([textureData[prevIndex].modelType, textureData[prevIndex].color, ""]);
  filesResponseBounded.push({ id: textureData[prevIndex].id });
  
  sheetResponseBounded.push([textureData[currentTextureIndex].modelType, textureData[currentTextureIndex].color, ""]);
  filesResponseBounded.push({ id: textureData[currentTextureIndex].id });
  
  sheetResponseBounded.push([textureData[nextIndex].modelType, textureData[nextIndex].color, ""]);
  filesResponseBounded.push({ id: textureData[nextIndex].id });
  
  // Load the current texture
  try {
    const currentTexturePath = textureData[currentTextureIndex].path;
    const response = await fetch(currentTexturePath);
    
    if (!response.ok) {
      throw new Error(`Failed to load texture: ${currentTexturePath}`);
    }
    
    const currentImage = await response.blob();
    
    // Process the image
    const bitmap = await window.createImageBitmap(currentImage);
    const manipulativeCanvas = document.createElement("canvas");
    manipulativeCanvas.setAttribute("width", bitmap.width);
    manipulativeCanvas.setAttribute("height", bitmap.height);
    
    const context = manipulativeCanvas.getContext("2d");
    context.drawImage(bitmap, 0, 0);
    
    const imageData = context.getImageData(0, 0, bitmap.width, bitmap.height);
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
      if (data[i] < 3 && data[i + 1] < 3 && data[i + 2] < 3) {
        data[i] = data[i + 1] = data[i + 2] = 3;
      }
    }
    
    context.putImageData(imageData, 0, 0);
    
    manipulativeCanvas.toBlob(processedImage => {
      createView(processedImage, requestedArtworkId);
      document.querySelector("#get").setAttribute("href", URL.createObjectURL(processedImage));
      document.querySelector("#get").setAttribute("download", `T_${sheetResponseBounded[1][0].replace("-", "")}_BC`);
      manipulativeCanvas.remove();
    });
    
  } catch (error) {
    console.error("Error loading texture:", error);
    changeVariant(2000);
  }
}

initializeArtwork();
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
