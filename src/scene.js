class Scene
{
    constructor(mgl, input)
    {
        this.mgl = mgl;
        this.input = input;

        this.texWall = new Texture("./textures/wall.png");
        this.texStone = new Texture("./textures/stone.png");
        this.texBlue = new Texture("./textures/blue.png");
        
        let groundPlaneHW = 5.0;
        this.groundPlane = new Plane(new Vec3(-groundPlaneHW, 0.0, groundPlaneHW),
                                    new Vec3(groundPlaneHW, 0.0, groundPlaneHW),
                                    new Vec3(groundPlaneHW, 0.0, -groundPlaneHW),
                                    new Vec3(-groundPlaneHW, 0.0, -groundPlaneHW),
                                    this.texStone);

        this.cube1 = new Cube(new Vec3(0, 1.0, 0.0), 1.0, this.texWall);
        this.cube2 = new Cube(new Vec3(0.5, 1.0, -1.0), 1.0, this.texWall);
        this.cubesCenter = new Vec3(-2.5, 1.0, 0.0);
        this.cubesOffsetDistance = 0.65;
        this.cubesOffsetAngle = 0.0;

        this.sphere = new Icosphere(new Vec3(2.5, 1.0, 0.0), 0.5, this.texBlue);

        this.cameraPos = new Vec3(0, 0, 0);
        this.cameraTarget = new Vec3(0, 0, 0);
        this.cameraUp = new Vec3(0, 1, 0);
        this.cameraAngleH = 300.0;
        this.cameraAngleV = 20.0;
        this.cameraDistance = 9.0;
        this.cameraMinDistance = 15.0;
        this.cameraMaxDistance = 50.0;
        this.cameraRotateSpeed = 0.5;
        this.cameraPanSpeed = 0.1;
        this.cameraMinAngleV = 5.0;
        this.cameraMaxAngleV = 60.0;

        this.mgl.lights.push(new Light(new Vec3(-1.0, 0.0, 0.0), new Color(0.3, 0.3, 0.3), new Color(1.0, 1.0, 1.0)));
        this.mgl.lights.push(new Light(new Vec3(0.0, -1.0, 0.0), new Color(0.3, 0.3, 0.3), new Color(1.0, 1.0, 1.0)));
    }

    Update(dt)
    {
        this.UpdateCamera(dt);
        this.UpdateCubes(dt);
    }

    UpdateCamera(dt)
    {
        // Rotate based on mouse/touch movement
        if (this.input.isTouchActive)
        {
            this.cameraAngleH += this.input.dx * this.cameraRotateSpeed;
            this.cameraAngleV = Math.max(Math.min(this.cameraAngleV + this.input.dy * this.cameraRotateSpeed,
                                                  this.cameraMaxAngleV),
                                                  this.cameraMinAngleV);
        }
        
        // Move in/out based on mouse wheel
        this.cameraDistance = Math.max(Math.min(this.cameraDistance + this.input.wheel*0.01,
                                                this.cameraMaxDistance),
                                                this.cameraMinDistance);

        // Position camera                     
        let cameraDistanceH = Math.cos(this.cameraAngleV*Math.PI/180.0) * this.cameraDistance;
        let cameraOffset = new Vec3(Math.cos(this.cameraAngleH*Math.PI/180.0) * cameraDistanceH,
                                    Math.sin(this.cameraAngleV*Math.PI/180.0) * this.cameraDistance,
                                    Math.sin(this.cameraAngleH*Math.PI/180.0) * cameraDistanceH);

        this.cameraPos = this.cameraTarget.Add(cameraOffset);
        this.mgl.SetCameraLookAt(this.cameraPos, this.cameraTarget, this.cameraUp);
    }

    UpdateCubes(dt)
    {
        // Rotate cube positions around a center point
        this.cubesOffsetAngle = (this.cubesOffsetAngle + dt*90.0) % 360.0;

        let cubeOffset1AngleRad = this.cubesOffsetAngle * (Math.PI / 180.0);        
        let cube1Offset = new Vec3(Math.cos(cubeOffset1AngleRad), 0.0, Math.sin(cubeOffset1AngleRad));
        this.cube1.tm.c3 = this.cubesCenter.Add(cube1Offset.Scale(this.cubesOffsetDistance));

        let cubeOffset2AngleRad = ((this.cubesOffsetAngle + 180.0)%360.0) * (Math.PI / 180.0);
        let cube2Offset = new Vec3(Math.cos(cubeOffset2AngleRad), 0.0, Math.sin(cubeOffset2AngleRad));
        this.cube2.tm.c3 = this.cubesCenter.Add(cube2Offset.Scale(this.cubesOffsetDistance));

        // Rotate cubes themselves around y-axis
        let rotateAngle = (90.0 * (Math.PI / 180.0)) * dt;
        let cosAngle = Math.cos(rotateAngle);
        let sinAngle = Math.sin(rotateAngle);
        let tmRotate = new Matrix4x4(new Vec3(cosAngle, 0.0, -sinAngle),
                                    new Vec3(0.0, 1.0, 0.0),
                                    new Vec3(sinAngle, 0.0, cosAngle),
                                    new Vec3(0.0, 0.0, 0.0));

        this.cube1.tm = this.cube1.tm.MultiplyMatrix4x4(tmRotate);
        this.cube2.tm = this.cube2.tm.MultiplyMatrix4x4(tmRotate);
    }

    Render()
    {
        this.mgl.RenderObject(this.groundPlane);
        this.mgl.RenderObject(this.cube1);
        this.mgl.RenderObject(this.cube2);
        this.mgl.RenderObject(this.sphere);
    }
}