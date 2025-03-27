import * as THREE from "three"
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js"

// Texture mapping data
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
