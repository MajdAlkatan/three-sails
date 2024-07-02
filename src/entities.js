import * as THREE from "three";
import {
  EffectComposer,
  BloomEffect,
  EffectPass,
  FXAAEffect,
  SSAOEffect,
} from "postprocessing";
import { loadModel } from "./utils";
import { loadFbxModel } from "./utils";
import { Sky } from "three/addons/objects/Sky.js";
import Water from "./water";
import {
  WaterBehavior,
  CameraBehavior,
  NewScript,
  SkyBehavior,
  BoxBehavior,
  BoatBehavior,
} from "./scripts/behaviors";
import boatModel from "../assets/models/boat/untitled.glb";
const renderer = new THREE.WebGLRenderer({
  powerPreference: "high-performance",
});
const mainScene = new THREE.Scene();
const composer = new EffectComposer(renderer);
const mainCamera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const gameRenderEntity = {
  tags: ["MainGameRender"],
  c: {
    gameRender: {
      type: "GameRender",
      renderer: renderer,
      scene: mainScene,
      composer: composer,
    },
  },
};

const geo = new THREE.BoxGeometry(1, 1, 1);
const nonIndexGeo = geo.toNonIndexed();
const mat = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const mesh = new THREE.Mesh(geo, mat);

const boxEntity = {
    c: {
        meshFilter: {
            type: 'MeshFilter',
            mesh: mesh,
            scene: mainScene
        },
        transform: {
            type: 'Transform',
            obj: mesh
        },
        script: {
            type: 'Script',
            script: new BoxBehavior()
        },
        rigidBody: {
            type: 'RigidBody',
            geometry: nonIndexGeo,
            mass: 5
        }
        ,
        gui: {
            type: "GUIcomponent",
            list: [
                {
                    path: ["BoxPosition"],
                    guiType: "vector",
                    target: mesh.position,
                    max: {
                        x: 10,
                        y: 20,
                        z: 30,
                    },
                    min: {
                        x: -10,
                        y: -20,
                        z: -30,
                    },
                    step: {
                        x: 1,
                        y: 1,
                        z: 1,
                    },
                    name: {
                        x: "X",
                        y: "Y",
                        z: "Z",
                    },
                    onchange: {
                        x: () => { console.log("x") },
                        y: () => { console.log("y") },
                        z: () => { console.log("z") },
                    }
                }
            ]
        }
    }
};

const cameraEntity = {
  tags: ["MainCamera"],
  c: {
    
    camera: {
      type: "CameraComponent",
      camera: mainCamera,
    },
    transform: {
      type: "Transform",
      obj: mainCamera,
    },
    script: {
      type: "Script",
      script: new CameraBehavior(),
    },
  },
};


const bloomEffect = new BloomEffect({ intensity: 0.0 });
const bloomPass = new EffectPass(mainCamera, bloomEffect);
const fxaaPass = new EffectPass(mainCamera, new FXAAEffect());

const postProcessingEntity = {
  c: {
    bloom: {
      type: "PassComponent",
      pass: bloomPass,
      composer: composer,
    },
    fxaa: {
      type: "PassComponent",
      pass: fxaaPass,
      composer: composer,
    },
    ssao: {
      type: "PassComponent",
      pass: new EffectPass(mainCamera, new SSAOEffect(mainCamera, mainScene)),
    },
  },
};

const sky = new Sky();

const skyEntity = {
  c: {
    meshFilter: {
      type: "MeshFilter",
      mesh: sky,
      scene: mainScene,
    },
    transform: {
      type: "Transform",
      obj: sky,
    },
    script: {
      type: "Script",
      script: new SkyBehavior(),
    },
  },
};

const me = new THREE.Mesh(nonIndexGeo, mat);
nonIndexGeo.scale(10, 10, 10);

const exampleBoxEntity = {
  c: {
    meshFilter: {
      type: "MeshFilter",
      mesh: me,
      scene: mainScene,
    },
    script: {
      type: "Script",
      script: new NewScript(),
    },
    transform: {
      type: "Transform",
      obj: me,
    },
    gui: {
      type: "GUIcomponent",
      list: [
        {
          path: [""],
          guiType: "slider",
          properityName: "x",
          target: me.position,
          max: 3,
          min: -3,
          step: 0.1,
          name: "X-Axis",
        },
      ],
    },
    script: {
      type: "Script",
      script: new NewScript(),
    },
    transform: {
      type: "Transform",
      obj: me,
    },
    rigidBody: {
      type: "RigidBody",
      geometry: nonIndexGeo,
      mass: 55,
    },
  },
};

const water = new Water(65, 4000000, 14000000);
const waterEntity = {
    c: {
        meshFilter: {
            type: "MeshFilter",
            mesh: water,
            scene: mainScene,
        },
        transform: {
            type: "Transform",
            obj: water,
        },
        script: {
            type: "Script",
            script: new WaterBehavior(),
        }
    }
};

const model = await loadModel(boatModel,{x:3,y:3,z:3},{x:0,y:10,z:0});
const boatEntity = {
  tags: ["objectToBeFollowed"],
  c: {
    meshFilter: {
      type: "MeshFilter",
      mesh: model,
      scene: mainScene,
    },
    transform: {
      type: "Transform",
      obj: model,
    },
    
    // rigidBody: {
    //   type: "RigidBody",
    //   geometry: nonIndexGeo,
    //   mass: 100000,
    // },
    // script: {
    //   type: "Script",
    //   script: new BoatBehavior(),
    // },
  },
};

const basicMesh = new THREE.Mesh(geo, mat);
basicMesh.position.set(0,10,0);
mainCamera.position.x=basicMesh.position.x;
mainCamera.position.z=basicMesh.position.z+30;
mainCamera.position.y=basicMesh.position.y+15;
const invisibleMeshEntitiy={
  tags: ["Follower"],
  c:{
    /* meshFilter: {
      type: "MeshFilter",
      mesh: basicMesh,
      scene:mainScene,
    }, */
    transform: {
      type: "Transform",
      obj: basicMesh,
    }
  }
}

const entities = [
  gameRenderEntity,
  boxEntity,
  cameraEntity,
  postProcessingEntity,
  skyEntity,
  exampleBoxEntity,
  waterEntity,
  boatEntity,
  invisibleMeshEntitiy,
];

export { entities };
