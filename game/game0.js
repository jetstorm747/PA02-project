
/*
Game 0
This is a ThreeJS program which implements a simple game
The user moves a cube around the board trying to knock balls into a cone

*/


	// First we declare the variables that hold the objects we need
	// in the animation code
	var scene, renderer;  // all threejs programs need these
	var camera, avatarCam, edgeCam;  // we have two cameras in the main scene
	var avatar;
	var monkeyAvatar;
	var brs;   //big red sphere
	// here are some mesh objects ...

	var cone;
	var npc;

	var endScene, endCamera, endText;
	var startScene, startCamera;//Jacob
	var loseScene, loseCamera;

	var deadBox, scoreText;

	var meaningless = 0;
	meaningless += 1;



var controls =
	     {fwd:false, bwd:false, left:false, right:false,
				speed:10, fly:false, reset:false,
		    camera:camera}

	var gameState =
	     {score:0, health:10, scene:'main', camera:'none' }


	// Here is the main game control
    init(); //
	initControls();
	animate();  // start the animation loop!



function createLoseScene(){
	loseScene = initScene();
	loseText = createSkyBox('youlose.png',10);
	//endText.rotateX(Math.PI);
	loseScene.add(loseText);
	var light1 = createPointLight();
	light1.position.set(0,200,20);
	loseScene.add(light1);
	loseCamera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.1, 1000 );
	loseCamera.position.set(0,50,1);
	loseCamera.lookAt(0,0,0);

}
	function createEndScene(){
		endScene = initScene();
		endText = createSkyBox('youwon.png',10);
		//endText.rotateX(Math.PI);
		endScene.add(endText);
		var light1 = createPointLight();
		light1.position.set(0,200,20);
		endScene.add(light1);
		endCamera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.1, 1000 );
		endCamera.position.set(0,50,1);
		endCamera.lookAt(0,0,0);



	}


	function createStartScene(){
		startScene = initScene();
		initTextMesh();

		startCamera = new THREE.PerspectiveCamera(  75, window.innerWidth / window.innerHeight, 0.1, 1000 );
		startCamera.position.set(0,0,15);
		startCamera.lookAt(0,0,0);

		gameState.scene = 'start';




	}

	function initTextMesh(){
		var loader = new THREE.FontLoader();
		loader.load( '/fonts/helvetiker_regular.typeface.json',
								 createStartText);
		console.log("preparing to load the font");

	}

//Jacob----------------------------------------------------------------------top
	function createStartText(font) {
		var textGeometry1 =
			new THREE.TextGeometry ('PA02',
			{
				font: font,
				size: 4,
				height: 0,
				curveSegments: 12,
				bevelEnabled: false,
				bevelThickness: 0.01,
				bevelSize: 0.08,
				bevelSegments: 5
			}
		);

		var textGeometry2 =
			new THREE.TextGeometry ('>PRESS P TO START<',
			{
				font: font,
				size: 2,
				height: 0,
				curveSegments: 12,
				bevelEnabled: false,
				bevelThickness: 0.01,
				bevelSize: 0.08,
				bevelSegments: 5
			}
		);

		var textMaterial1 = new THREE.MeshBasicMaterial ( {color: 'yellow'});
		var textMesh1 = new THREE.Mesh( textGeometry1, textMaterial1);
		textMesh1.position.set(-7,0,0);
		startScene.add(textMesh1);


		var textMaterial2 = new THREE.MeshBasicMaterial ( {color: 'yellow'});
		var textMesh2 = new THREE.Mesh( textGeometry2, textMaterial2);
		textMesh2.position.set(-14,-4,0);
		startScene.add(textMesh2);

		console.log("addted textMesh to scene");
	}

	//Jacob----------------------------------------------------------------bottom


	/**
	  To initialize the scene, we initialize each of its components
	*/
	function init(){
            initPhysijs();
			scene = initScene();

			createStartScene();//Jacob
			createEndScene();
			createLoseScene();
			initRenderer();
			createMainScene();
	}


	function createMainScene(){
      // setup lighting
			var light1 = createPointLight();
			light1.position.set(0,200,20);
			scene.add(light1);
			var light0 = new THREE.AmbientLight( 0xffffff,0.25);
			scene.add(light0);

			// create main camera
			camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.1, 1000 );
			camera.position.set(0,50,0);
			camera.lookAt(0,0,0);


			// create the ground and the skybox
			var ground = createGround('grass.png');
			scene.add(ground);
			var skybox = createSkyBox('sky.jpg',1);
			scene.add(skybox);

			// create the avatar
			avatarCam = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.1, 1000 );
			// avatar = createAvatar();

			initmonkeyAvatarJSON();
			initmonkeyAvatarOBJ();

			avatarCam.position.set(0,4,0);
			avatarCam.lookAt(0,4,10);

			gameState.camera = avatarCam;


            edgeCam = new THREE.PerspectiveCamera( 120, window.innerWidth / window.innerHeight, 0.1, 1000 );
            edgeCam.position.set(20,20,10);
			gameState.camera = edgeCam;


			addBalls();

			cone = createConeMesh(4,6);
			cone.position.set(10,3,7);
			scene.add(cone);

			npc = createBoxMesh2(0x0000ff,1,2,4);
			npc.position.set(30,5,-30);
			npc.addEventListener('collision',function(other_object){
				if (other_object==avatar){
					gameState.health -= 1;
					npc.position.set(randN(20)+15,5,randN(20)+15);
					npc.__dirtyPosition = true;


				}
			});
			scene.add(npc);

            var wall = createWall(0xffaa00,50,3,1);
            wall.position.set(10,0,10);
            scene.add(wall);
			//console.dir(npc);
			//playGameMusic();
			brs = createBouncyRedSphere();
			brs.position.set(-40,40,40);
			scene.add(brs);
			console.log('just added brs');
			console.dir(brs);

			var platform = createRedBox();
			platform.position.set(0,50,0);
			platform.__dirtyPosition=true;
			scene.add(platform);

			deadBox = createDeadBox();
			deadBox.position.set(-20, 5, 20);
			deadBox.__directPosition = true;
			scene.add(deadBox);




			initScoreTextMesh();
			// initScoreScoreTextMesh();

	}

function updateScoreText() {
	scene.remove(scoreText);
	initScoreTextMesh();
}
function initScoreTextMesh(){
	var loader = new THREE.FontLoader();
	loader.load( '/fonts/helvetiker_regular.typeface.json',
		createScoreText);
	console.log("preparing to load the font");

}
function createScoreText(font) {
	var textGeometry1 =
		new THREE.TextGeometry ('Score: ' + gameState.score,
			{
				font: font,
				size: 4,
				height: 0,
				curveSegments: 12,
				bevelEnabled: false,
				bevelThickness: 0.01,
				bevelSize: 0.08,
				bevelSegments: 5
			}
		);
	var textMaterial1 = new THREE.MeshBasicMaterial ( {color: 'yellow'});
	scoreText = new THREE.Mesh( textGeometry1, textMaterial1);


	scoreText.position.set(40, 20, 40);

	scene.add(scoreText);

}
function createDeadBox(){
	var geometry = new THREE.BoxGeometry( 5, 10, 2);

	var texture = new THREE.TextureLoader().load( '../images/skull.jpg');
	texture.wrapS = THREE.RepeatWrapping;
	texture.wrapT = THREE.RepeatWrapping;

	texture.repeat.set( 3,3);
	var material = new THREE.MeshLambertMaterial( { color: 0xffffff,  map: texture ,side:THREE.DoubleSide} );



	// var material = new THREE.MeshLambertMaterial( { color: 0x000000} );
	var pmaterial = new Physijs.createMaterial(material,0.9,0.95);
	mesh = new Physijs.BoxMesh( geometry, pmaterial, 0);
	//mesh = new Physijs.BoxMesh( geometry, material,0 );
	mesh.castShadow = true;
	mesh.addEventListener( 'collision',
		function( other_object, relative_velocity, relative_rotation, contact_normal ) {
			if (other_object==avatar){
				gameState.scene = 'youlose'

			}
		}
	)
	return mesh;
}

	function createRedBox(){
		var geometry = new THREE.BoxGeometry( 10, 2, 10);
		var material = new THREE.MeshLambertMaterial( { color: 0xff0000} );
		mesh = new Physijs.BoxMesh( geometry, material, 0);
    //mesh = new Physijs.BoxMesh( geometry, material,0 );
		mesh.castShadow = true;
		return mesh;
	}

    function createBouncyRedSphere(){
	    //var geometry = new THREE.SphereGeometry( 4, 20, 20);
	    var geometry = new THREE.SphereGeometry( 5, 16, 16);
	    var material = new THREE.MeshLambertMaterial( { color: 0xff0000} );
	    var pmaterial = new Physijs.createMaterial(material,0.9,0.95);
	    var mass = 10;
	    var mesh = new Physijs.SphereMesh( geometry, pmaterial, mass );
	    mesh.setDamping(0.1,0.1);
	    mesh.castShadow = true;

	    mesh.addEventListener( 'collision',
		    function( other_object, relative_velocity, relative_rotation, contact_normal ) {
			    if (other_object==avatar){
				    console.log("avatar hit the big red ball");
				    soundEffect('bad.wav');
				    gameState.health = gameState.health - 1;

			    }
		    }
	    )

	    return mesh;
	}


	function randN(n){
		return Math.random()*n;
	}




	function addBalls(){
		var numBalls = 20;


		for(i=0;i<numBalls;i++){
			var ball = createBall();
			ball.position.set(randN(20)+15,30,randN(20)+15);
			scene.add(ball);

			ball.addEventListener( 'collision',
				function( other_object, relative_velocity, relative_rotation, contact_normal ) {
					if (other_object==cone){
						gameState.health++;
						console.log("ball "+i+" hit the cone");
						soundEffect('good.wav');
						gameState.score += 1;  // add one to the score
						updateScoreText();
						if (gameState.score==numBalls) {
							gameState.scene='youwon';
						}

						//Jacob----------------------------------------------------------------------Top
						//when the user gets a score of 5, a plow appears as a sort of powerup
						if (gameState.score == 5) {
							createPLow();
						}
						//Jacob-----------------------------------------------------------------------bottom

            //scene.remove(ball);  // this isn't working ...
						// make the ball drop below the scene ..
						// threejs doesn't let us remove it from the schene...
						this.position.y = this.position.y - 100;
						this.__dirtyPosition = true;
					}
          else if (other_object == avatar){
            gameState.health ++;
          }
				}
			)
		}
	}



	function playGameMusic(){
		// create an AudioListener and add it to the camera
		var listener = new THREE.AudioListener();
		camera.add( listener );

		// create a global audio source
		var sound = new THREE.Audio( listener );

		// load a sound and set it as the Audio object's buffer
		var audioLoader = new THREE.AudioLoader();
		audioLoader.load( '/sounds/loop.mp3', function( buffer ) {
			sound.setBuffer( buffer );
			sound.setLoop( true );
			sound.setVolume( 0.05 );
			sound.play();
		});
	}

	function soundEffect(file){
		// create an AudioListener and add it to the camera
		var listener = new THREE.AudioListener();
		camera.add( listener );

		// create a global audio source
		var sound = new THREE.Audio( listener );

		// load a sound and set it as the Audio object's buffer
		var audioLoader = new THREE.AudioLoader();
		audioLoader.load( '/sounds/'+file, function( buffer ) {
			sound.setBuffer( buffer );
			sound.setLoop( false );
			sound.setVolume( 0.5 );
			sound.play();
		});
	}

	/* We don't do much here, but we could do more!
	*/
	function initScene(){
		//scene = new THREE.Scene();
        var scene = new Physijs.Scene();
		return scene;
	}

  function initPhysijs(){
    Physijs.scripts.worker = '/js/physijs_worker.js';
    Physijs.scripts.ammo = '/js/ammo.js';
  }
	/*
		The renderer needs a size and the actual canvas we draw on
		needs to be added to the body of the webpage. We also specify
		that the renderer will be computing soft shadows
	*/
	function initRenderer(){
		renderer = new THREE.WebGLRenderer();
		renderer.setSize( window.innerWidth, window.innerHeight-50 );
		document.body.appendChild( renderer.domElement );
		renderer.shadowMap.enabled = true;
		renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	}


	function createPointLight(){
		var light;
		light = new THREE.PointLight( 0xffffff);
		light.castShadow = true;
		//Set up shadow properties for the light
		light.shadow.mapSize.width = 2048;  // default
		light.shadow.mapSize.height = 2048; // default
		light.shadow.camera.near = 0.5;       // default
		light.shadow.camera.far = 500      // default
		return light;
	}



	function createBoxMesh(color){
		var geometry = new THREE.BoxGeometry( 1, 1, 1);
		var material = new THREE.MeshLambertMaterial( { color: color} );
		mesh = new Physijs.BoxMesh( geometry, material );
    //mesh = new Physijs.BoxMesh( geometry, material,0 );
		mesh.castShadow = true;
		return mesh;
	}

	function createBoxMesh2(color,w,h,d){
		var geometry = new THREE.BoxGeometry( w, h, d);
		var material = new THREE.MeshLambertMaterial( { color: color} );
		mesh = new Physijs.BoxMesh( geometry, material );
		//mesh = new Physijs.BoxMesh( geometry, material,0 );
		mesh.castShadow = true;
		return mesh;
	}

  function createWall(color,w,h,d){
    var geometry = new THREE.BoxGeometry( w, h, d);
    var material = new THREE.MeshLambertMaterial( { color: color} );
    mesh = new Physijs.BoxMesh( geometry, material, 0 );
    //mesh = new Physijs.BoxMesh( geometry, material,0 );
    mesh.castShadow = true;
    return mesh;
  }



	function createGround(image){
		// creating a textured plane which receives shadows
		var geometry = new THREE.PlaneGeometry( 180, 180, 128 );
		var texture = new THREE.TextureLoader().load( '../images/'+image );
		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;
		texture.repeat.set( 15, 15 );
		var material = new THREE.MeshLambertMaterial( { color: 0xffffff,  map: texture ,side:THREE.DoubleSide} );
		var pmaterial = new Physijs.createMaterial(material,0.9,0.05);
		//var mesh = new THREE.Mesh( geometry, material );
		var mesh = new Physijs.BoxMesh( geometry, pmaterial, 0 );

		mesh.receiveShadow = true;

		mesh.rotateX(Math.PI/2);
		return mesh
		// we need to rotate the mesh 90 degrees to make it horizontal not vertical
	}



	function createSkyBox(image,k){
		// creating a textured plane which receives shadows
		var geometry = new THREE.SphereGeometry( 80, 80, 80 );
		var texture = new THREE.TextureLoader().load( '../images/'+image );
		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;
		texture.repeat.set( k, k );
		var material = new THREE.MeshLambertMaterial( { color: 0xffffff,  map: texture ,side:THREE.DoubleSide} );
		//var pmaterial = new Physijs.createMaterial(material,0.9,0.5);
		//var mesh = new THREE.Mesh( geometry, material );
		var mesh = new THREE.Mesh( geometry, material, 0 );

		mesh.receiveShadow = false;


		return mesh
		// we need to rotate the mesh 90 degrees to make it horizontal not vertical


	}

var suzyOBJ;
var theObj;


	function initmonkeyAvatarOBJ(){
		var loader = new THREE.OBJLoader();
		loader.load("../models/suzyA.obj",
					function ( obj) {
						console.log("loading obj file");
						console.dir(obj);
						//scene.add(obj);
						obj.castShadow = true;
						suzyOBJ = obj;
						theOBJ = obj;
						// you have to look inside the suzyOBJ
						// which was imported and find the geometry and material
						// so that you can pull them out and use them to create
						// the Physics object ...
						var geometry = suzyOBJ.children[0].geometry;
						var material = suzyOBJ.children[0].material;
						suzyOBJ = new Physijs.BoxMesh(geometry,material);
						suzyOBJ.position.set(20,20,20);
						scene.add(suzyOBJ);
						console.log("just added suzyOBJ");
						//suzyOBJ = new Physijs.BoxMesh(obj);

						//
					},
					function(xhr){
						console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );},

					function(err){
						console.log("error in loading: "+err);}
				)
	}

	function initmonkeyAvatarJSON(){
		var loader = new THREE.JSONLoader();

		loader.load("../models/suzanne.json",
					function ( geometry, materials ) {
						console.log("loading monkeyAvatar");
						var material = new THREE.MeshLambertMaterial( { color: 0x00ff00 } );
						//geometry.scale.set(0.5,0.5,0.5);
						avatar = new Physijs.BoxMesh( geometry, material );


						avatar.add(avatarCam);

						avatar.translateY(20);
						avatarCam.translateY(-4);
						avatarCam.translateZ(3);
						scene.add(avatar);

						gameState.camera = avatarCam;





					},
					function(xhr){
						console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );},
					function(err){console.log("error in loading: "+err);}
				)

	}


	function createConeMesh(r,h){
		var geometry = new THREE.ConeGeometry( r, h, 32);
		var texture = new THREE.TextureLoader().load( '../images/tile.jpg' );
		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;
		texture.repeat.set( 1, 1 );
		var material = new THREE.MeshLambertMaterial( { color: 0xffffff,  map: texture ,side:THREE.DoubleSide} );
		var pmaterial = new Physijs.createMaterial(material,0.9,0.5);
		var mesh = new Physijs.ConeMesh( geometry, pmaterial, 0 );
		mesh.castShadow = true;
		return mesh;
	}


	function createBall(){
		//var geometry = new THREE.SphereGeometry( 4, 20, 20);
		var geometry = new THREE.SphereGeometry( 1, 16, 16);
		var material = new THREE.MeshLambertMaterial( { color: 0xffff00} );
		var pmaterial = new Physijs.createMaterial(material,0.9,0.95);
    var mesh = new Physijs.BoxMesh( geometry, pmaterial );
		mesh.setDamping(0.1,0.1);
		mesh.castShadow = true;
		return mesh;
	}

	//Jacob------------------------------------------------------------------top
	function createPLow(){
		//this function creates a plow that the avatar can use to eaily push balls
		//var geometry = new THREE.SphereGeometry( 4, 20, 20);
		var geometry = new THREE.BoxGeometry( 15, 1, 4);
		var material = new THREE.MeshLambertMaterial( { color: 'red'} );
		var pmaterial = new Physijs.createMaterial(material,2,0);
    var mesh = new Physijs.BoxMesh( geometry, pmaterial );
		mesh.setDamping(0.1,0.1);
		mesh.castShadow = true;

		mesh.position.set(20,1,17)
		scene.add(mesh);
		console.log("added plow");

	}

//Jacob--------------------------------------------------------------------bottom

	var clock;

	function initControls(){
		// here is where we create the eventListeners to respond to operations

		  //create a clock for the time-based animation ...
			clock = new THREE.Clock();
			clock.start();

			window.addEventListener( 'keydown', keydown);
			window.addEventListener( 'keyup',   keyup );
  }

	function keydown(event){
		console.log("Keydown: '"+event.key+"'");
		//console.dir(event);
		// first we handle the "play again" key in the "youwon" scene
		if ((gameState.scene == 'youwon' && event.key=='r') ||
			(gameState.scene == 'youlose' && event.key == 'r')) {
			gameState.scene = 'main';
			gameState.score = 0;
			gameState.health = 10;
			updateScoreText();
			// next reposition the big red sphere (brs)
			brs.position.set(-40,40,40);
			brs.__dirtyPosition = true;
			brs.setLinearVelocity(0,1,0);
			addBalls();
			return;

		}
if (gameState.scene == 'start' && ( event.key == 'p' || event.key == 'P')) {
		gameState.scene = 'main';

		}
if (gameState.scene == 'main' && (event.key == 'r')) {
 			gameState.scene = 'main';
 			}



		// this is the regular scene
		switch (event.key){
			// change the way the avatar is moving
			case "w": controls.fwd = true;  break;
			case "s": controls.bwd = true; break;
			case "a": controls.left = true; break;
			case "d": controls.right = true; break;
			case "g": controls.strafeRight= true; break;
			case "l": controls.strafeLeft= true; break;
			// case "r": controls.up = true; break;
			case "f": controls.down = true; break;
			case "m": controls.speed = 30; break;

			case "k":
				avatar.position.set(0,60,0);
				avatar.__dirtyPosition = true;
				console.dir(avatar);
				break;


      case " ": controls.fly = true;
          console.log("space!!");
          break;
      case "h": controls.reset = true; break;


			// switch cameras
			case "1": gameState.camera = camera; break;
			case "2": gameState.camera = avatarCam; break;
      case "3": gameState.camera = edgeCam; break;

			// move the camera around, relative to the avatar
			case "ArrowLeft": avatarCam.translateY(1);break;
			case "ArrowRight": avatarCam.translateY(-1);break;
			case "ArrowUp": avatarCam.translateZ(-1);break;
			case "ArrowDown": avatarCam.translateZ(1);break;
			case "Q": console.log("qqqq");avatarCam.translateX(-1);break;
			case "E": avatarCam.translateX(1);break;
			case "r": console.log("case r");avatar.rotation.set(0,0,0); avatar.__dirtyRotation=true;
				console.dir(avatar.rotation); break;

		}

	}

	function keyup(event){
		//console.log("Keydown:"+event.key);
		//console.dir(event);
		switch (event.key){
			case "w": controls.fwd   = false;  break;
			case "s": controls.bwd   = false; break;
			case "a": controls.left  = false; break;
			case "d": controls.right = false; break;
			case "g": controls.strafeRight= false; break;
			case "l": controls.strafeLeft= false; break;
			case "r": controls.up    = false; break;
			case "f": controls.down  = false; break;
			case "m": controls.speed = 10; break;
      case " ": controls.fly = false; break;
      case "h": controls.reset = false; break;
		}
	}

	function updateNPC(){
		npc.lookAt(avatar.position);
	  //npc.__dirtyPosition = true;
		var velocity = -0.5;
		if (npc.position.distanceTo(avatar.position) < 20){
			velocity = 0.5;
		}
		npc.setLinearVelocity(npc.getWorldDirection().multiplyScalar(velocity));
	}

	function updateScoreBox() {
		scoreBox.lookAt(avatar.position);

	}

  function updateAvatar(){
		"change the avatar's linear or angular velocity based on controls state (set by WSAD key presses)"

		var forward = avatar.getWorldDirection();

		if (controls.fwd){
			avatar.setLinearVelocity(forward.multiplyScalar(controls.speed));
		} else if (controls.bwd){
			avatar.setLinearVelocity(forward.multiplyScalar(-controls.speed));
		} else if (controls.strafeLeft){
      var axis = new THREE.Vector3( 0, 1, 0 );
      var angle = Math.PI / 2;
			var sideways = forward;
      sideways.applyAxisAngle( axis, angle );
			avatar.setLinearVelocity(sideways.multiplyScalar(controls.speed));
		}else if (controls.strafeRight){
	      var axis = new THREE.Vector3( 0, 1, 0 );
	      var angle = Math.PI / 2;
				var sideways = forward;
	      sideways.applyAxisAngle( axis, angle );
				avatar.setLinearVelocity(sideways.multiplyScalar(-controls.speed));
		} else {
			var velocity = avatar.getLinearVelocity();
			velocity.x=velocity.z=0;
			avatar.setLinearVelocity(velocity); //stop the xz motion
		}

    if (controls.fly){
      avatar.setLinearVelocity(new THREE.Vector3(0,controls.speed,0));
    }

		if (controls.left){
			avatar.setAngularVelocity(new THREE.Vector3(0,controls.speed*0.1,0));
		} else if (controls.right){
			avatar.setAngularVelocity(new THREE.Vector3(0,-controls.speed*0.1,0));
		}

    if (controls.reset){
      avatar.__dirtyPosition = true;
      avatar.position.set(40,10,40);
    }

	}

function updateSuzyOBJ(){
	var t = clock.getElapsedTime();
	suzyOBJ.material.emissive.r = Math.abs(Math.sin(t));
	suzyOBJ.material.color.b=0
}




function animate() {

		requestAnimationFrame( animate );
		if (gameState.health == 0) gameState.scene = 'youlose';
		switch(gameState.scene) {

			//Jacob--------------------------------------------------------------top
			case "start":
			renderer.render( startScene, startCamera);
			//console.log("Rendering start screen");
			break;
			//Jacob--------------------------------------------------------------bottom

			case "youwon":
				//endText.rotateY(0.005);
				renderer.render( endScene, endCamera );
				break;

			case "main":
				updateAvatar();
				updateNPC();
				// updateScoreBox();

				updateSuzyOBJ();
				if (brs.position.y < 0){
					// when the big red sphere (brs) falls off the platform, end the game
					gameState.scene = 'youwon';
				}
                edgeCam.lookAt(avatar.position);
				// scoreScoreText.lookAt(avatar.position);
				scoreText.lookAt(avatar.position);

	    	scene.simulate();
				if (gameState.camera!= 'none'){
					renderer.render( scene, gameState.camera );
				}
				break;
			case "youlose":
				renderer.render( loseScene, loseCamera );
				break;
			default:
			  console.log("don't know the scene "+gameState.scene);

		}

		//draw heads up display ..
	var info = document.getElementById("info");
	info.innerHTML='<div style="font-size:24pt">Score: '
		+ gameState.score
		+ " health="+gameState.health
		+ '</div>';
	}
