import * as THREE from "three"
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js"

// Texture mapping data - same as in gallery.js
const textureData = [
  { id: "1osaWv1_9tMylJQNljvkgREz19yGC4LDX", path: "/textures/T-Shirt_1osaWv1_9tMylJQNljvkgREz19yGC4LDX.png", modelType: "T-Shirt", color: "#16161a" },
  { id: "1-pgetUn63L_v4i3c-HSIeuut7SUrdTe8", path: "/textures/T-Shirt_1-pgetUn63L_v4i3c-HSIeuut7SUrdTe8.png", modelType: "T-Shirt", color: "#16161a" },
  { id: "1nyJ5XxtbhOaQBk2fFSTnMtYqds-i8zXl", path: "/textures/T-Shirt_1nyJ5XxtbhOaQBk2fFSTnMtYqds-i8zXl.png", modelType: "T-Shirt", color: "#16161a" },
  { id: "1pQgQS6WIk6fcwrs4kzKsA1OF3U5rKzLY", path: "/textures/T-Shirt_1pQgQS6WIk6fcwrs4kzKsA1OF3U5rKzLY.png", modelType: "T-Shirt", color: "#16161a" },
  { id: "1o72a31y67NFZNPaBLR2c2ZfqxvLl7Mq9", path: "/textures/Cap_1o72a31y67NFZNPaBLR2c2ZfqxvLl7Mq9.png", modelType: "Cap", color: "#16161a" },
  { id: "1pbcIF0GTxlApgm9YgjXqEqBSG71mvbNg", path: "/textures/T-Shirt_1pbcIF0GTxlApgm9YgjXqEqBSG71mvbNg.png", modelType: "T-Shirt", color: "#16161a" },
  { id: "1kInUqRwgjdxpTRVOxsHu9ER5BPz2pZpC", path: "/textures/Pants_1kInUqRwgjdxpTRVOxsHu9ER5BPz2pZpC.png", modelType: "Pants", color: "#16161a" },
  { id: "1AH1KscqsgsdHY_oobQLY__Ps6wRsq3Kz", path: "/textures/Hoodie_1AH1KscqsgsdHY_oobQLY__Ps6wRsq3Kz.png", modelType: "Hoodie", color: "#16161a" },
  { id: "1GBfmdKVCr70yfqCnxT7QeNuhp02iY3_z", path: "/textures/Cap_1GBfmdKVCr70yfqCnxT7QeNuhp02iY3_z.png", modelType: "Cap", color: "#16161a" },
  { id: "1EYegDwbPcHq_L5Tlv5LTqgreaHPSWlb_", path: "/textures/T-Shirt_1EYegDwbPcHq_L5Tlv5LTqgreaHPSWlb_.png", modelType: "T-Shirt", color: "#16161a" },
  { id: "1PXqXexCtjYiQj8PrQoRPgFrY7ztW-vBl", path: "/textures/Hoodie_1PXqXexCtjYiQj8PrQoRPgFrY7ztW-vBl.png", modelType: "Hoodie", color: "#16161a" },
  { id: "1JnaHtr_BUkwvD1VW1Qz-gP70i3OY7yN_", path: "/textures/Hoodie_1JnaHtr_BUkwvD1VW1Qz-gP70i3OY7yN_.png", modelType: "Hoodie", color: "#16161a" },
  { id: "1_NClc4_9qxRcGCNRwGWbDT7Zjw3eBeh1", path: "/textures/Hoodie_1_NClc4_9qxRcGCNRwGWbDT7Zjw3eBeh1.png", modelType: "Hoodie", color: "#16161a" },
  { id: "1-NPe0Rdst0XZ-4O_scUUuxEyMjT1AIym", path: "/textures/T-Shirt_1-NPe0Rdst0XZ-4O_scUUuxEyMjT1AIym.png", modelType: "T-Shirt", color: "#16161a" },
  { id: "1JXkvEckBfNJgGO-EzIYZyHoLf2KOiZUw", path: "/textures/Cap_1JXkvEckBfNJgGO-EzIYZyHoLf2KOiZUw.png", modelType: "Cap", color: "#16161a" },
  { id: "1rf9RKFZBHUz43fXZoBtHP58tMyOJ4oLI", path: "/textures/Hoodie_1rf9RKFZBHUz43fXZoBtHP58tMyOJ4oLI.png", modelType: "Hoodie", color: "#16161a" },
  { id: "1WMJobNk831kBSlYQUdN_9GSF0zAW7WZe", path: "/textures/T-Shirt_1WMJobNk831kBSlYQUdN_9GSF0zAW7WZe.png", modelType: "T-Shirt", color: "#16161a" },
  { id: "1xWJlPKo2o22GGzxXaqeu7TQ5zC0-pRPH", path: "/textures/Hoodie_1xWJlPKo2o22GGzxXaqeu7TQ5zC0-pRPH.png", modelType: "Hoodie", color: "#16161a" },
  { id: "1fYu0n7Qzetq82h5Mpan84dBEnitzso1G", path: "/textures/Cap_1fYu0n7Qzetq82h5Mpan84dBEnitzso1G.png", modelType: "Cap", color: "#16161a" },
  { id: "1g5cQPPlfhWgpGSjdlT94LkMq3GyY2baA", path: "/textures/T-Shirt_1g5cQPPlfhWgpGSjdlT94LkMq3GyY2baA.png", modelType: "T-Shirt", color: "#16161a" },
  { id: "1c5Fgj6rb6MQESFICOQkSLwaA7pzwyOdu", path: "/textures/Hoodie_1c5Fgj6rb6MQESFICOQkSLwaA7pzwyOdu.png", modelType: "Hoodie", color: "#16161a" },
  { id: "1-qLUR0uV7ybiCZwJ7qZJWjqQQZYz3SV7", path: "/textures/Pants_1-qLUR0uV7ybiCZwJ7qZJWjqQQZYz3SV7.png", modelType: "Pants", color: "#16161a" },
  { id: "1yTdsXfzY9S_7aACaKkKNczKWPOVmiqZg", path: "/textures/Cap_1yTdsXfzY9S_7aACaKkKNczKWPOVmiqZg.png", modelType: "Cap", color: "#16161a" },
  { id: "1hWciYSNP8EOnn3TQkqzRBsmShY1GyFmd", path: "/textures/T-Shirt_1hWciYSNP8EOnn3TQkqzRBsmShY1GyFmd.png", modelType: "T-Shirt", color: "#16161a" },
  { id: "1MV4glqqRjmk-Yi_IveR3oEtFweYBVbBX", path: "/textures/T-Shirt_1MV4glqqRjmk-Yi_IveR3oEtFweYBVbBX.png", modelType: "T-Shirt", color: "#16161a" },
  { id: "1uytdzOoj9NlCRFWlMWCXGppk4v7KdpiT", path: "/textures/T-Shirt_1uytdzOoj9NlCRFWlMWCXGppk4v7KdpiT.png", modelType: "T-Shirt", color: "#16161a" },
  { id: "1QrbXswa_nkTvQwFHZWPZTgJWB921K6tT", path: "/textures/Cap_1QrbXswa_nkTvQwFHZWPZTgJWB921K6tT.png", modelType: "Cap", color: "#16161a" },
  { id: "1HlP6o0hu70W9LI-ahTlEOjMih-nO6Hd_", path: "/textures/Pants_1HlP6o0hu70W9LI-ahTlEOjMih-nO6Hd_.png", modelType: "Pants", color: "#16161a" },
  { id: "16bhqSwGD9zy7kRiNu0wUkz4lbbMyipWO", path: "/textures/Hoodie_16bhqSwGD9zy7kRiNu0wUkz4lbbMyipWO.png", modelType: "Hoodie", color: "#16161a" },
  { id: "1g7WviHNox-hsIzD2VXBfErtq7NciSNv2", path: "/textures/T-Shirt_1g7WviHNox-hsIzD2VXBfErtq7NciSNv2.png", modelType: "T-Shirt", color: "#16161a" },
  { id: "1vmyVU_64rOMzCwkn9wD-NLASt13QvNkP", path: "/textures/Pants_1vmyVU_64rOMzCwkn9wD-NLASt13QvNkP.png", modelType: "Pants", color: "#16161a" },
  { id: "1BoD-KURY_xXtR8R85EHHvAUixzs5SMwj", path: "/textures/Hoodie_1BoD-KURY_xXtR8R85EHHvAUixzs5SMwj.png", modelType: "Hoodie", color: "#16161a" },
  { id: "1LiyrTh1KgA9ks89yxe0_t9oqZqao_hKd", path: "/textures/Cap_1LiyrTh1KgA9ks89yxe0_t9oqZqao_hKd.png", modelType: "Cap", color: "#16161a" },
  { id: "1voCeV-JXzu7vZMzQiTOSmyrfPLoKMJ5G", path: "/textures/Hoodie_1voCeV-JXzu7vZMzQiTOSmyrfPLoKMJ5G.png", modelType: "Hoodie", color: "#16161a" },
  { id: "1m2pLRoF7wJ4btKPv0rCirneuWMSBjZVt", path: "/textures/Hoodie_1m2pLRoF7wJ4btKPv0rCirneuWMSBjZVt.png", modelType: "Hoodie", color: "#16161a" },
  { id: "1-PRw20BQGvtuvjU8aHL-615tfB3Y2Rz7", path: "/textures/Hoodie_1-PRw20BQGvtuvjU8aHL-615tfB3Y2Rz7.png", modelType: "Hoodie", color: "#16161a" },
  { id: "1RlIEi5ZUABzMZI02jkbgX5l5M9Nx2UTs", path: "/textures/Pants_1RlIEi5ZUABzMZI02jkbgX5l5M9Nx2UTs.png", modelType: "Pants", color: "#16161a" },
  { id: "1ZJ0-4VfZ27-YzckT5eoYE5tQ_nEYsjn6", path: "/textures/T-Shirt_1ZJ0-4VfZ27-YzckT5eoYE5tQ_nEYsjn6.png", modelType: "T-Shirt", color: "#16161a" },
  { id: "1EktKoGbKMNJOKGlpHwwcfPGHaqDgT_Lq", path: "/textures/T-Shirt_1EktKoGbKMNJOKGlpHwwcfPGHaqDgT_Lq.png", modelType: "T-Shirt", color: "#16161a" },
  { id: "1a1yhdeW2IB5fzmHHm2-xkYwriOSG9OES", path: "/textures/T-Shirt_1a1yhdeW2IB5fzmHHm2-xkYwriOSG9OES.png", modelType: "T-Shirt", color: "#16161a" },
  { id: "1N07vt7TO8lmljqcqpYORbY3gcYgVvk2j", path: "/textures/T-Shirt_1N07vt7TO8lmljqcqpYORbY3gcYgVvk2j.png", modelType: "T-Shirt", color: "#16161a" },
  { id: "1V7Vp2fO1HZujZrW5utXm-Ns5ZL9eKrXl", path: "/textures/T-Shirt_1V7Vp2fO1HZujZrW5utXm-Ns5ZL9eKrXl.png", modelType: "T-Shirt", color: "#16161a" }
];

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
