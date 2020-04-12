
const glCtx = WebGLRenderingContext;

class Shader extends WebGLShader {
    public static create(context: WebGLRenderingContext, type: GLenum, source: string): Shader | null {
        let shdr: Shader | null = context.createShader(type);
        if(shdr === null) return null;

        context.shaderSource(shdr, source);
        context.compileShader(shdr);
        if(context.getShaderParameter(shdr, context.COMPILE_STATUS)) {
            return shdr;
        } else {
            console.log(context.getShaderInfoLog(shdr));
            context.deleteShader(shdr);
            return null;
        }
    }
}

class Program extends WebGLProgram {
    public static create(context: WebGLRenderingContext, vtxShdr: Shader, frgShdr: string): Program | null;
    public static create(context: WebGLRenderingContext, vtxShdr: string, frgShdr: string): Program | null;
    public static create(context: WebGLRenderingContext, vtxShdr: Shader | string, frgShdr: string): Program | null {
        let vshdr = typeof(vtxShdr) === "string" ? Shader.create(context, context.VERTEX_SHADER, vtxShdr) : vtxShdr;
        let fshdr = Shader.create(context, context.FRAGMENT_SHADER, frgShdr);
        let prog: Program | null = context.createProgram();

        if(prog === null || vshdr === null || fshdr === null) return null;

        context.attachShader(prog, vshdr);
        context.attachShader(prog, fshdr);
        context.linkProgram(prog);
        if(context.getProgramParameter(prog, context.LINK_STATUS)) {
            context.deleteShader(vshdr);
            context.deleteShader(fshdr);
            return prog;
        } else {
            console.log(context.getProgramInfoLog(prog));
            context.deleteProgram(prog);
            context.deleteShader(vshdr);
            context.deleteShader(fshdr);
            return null;
        }
    }
}

// Demo Resources
const quadPositions = [
    -1., +1.,
    -1., -1.,
    +1., +1.,
    +1., -1.,
];

const vtxShdr = `
    precision mediump float;
    
    attribute vec2 position;
    
    varying vec2 texcoord;
    
    void main() {
        texcoord = .5*(position + vec2(1., 1.));
        gl_Position = vec4(position, 0., 1.);
    }   
`;

const frgShdr = `
    precision mediump float;
    
    varying vec2 texcoord;
    
    void main() {
        gl_FragColor = vec4(texcoord, 0., 1.);
    }
`;

// Small render state object so we can stop checking for null
interface RenderState {
    gl: WebGLRenderingContext;
    prog: Program;
    vbuf: WebGLBuffer;
    loc0: number;
}

export default class Renderer {
    public gl: WebGLRenderingContext | null = null;
    public canvas: HTMLCanvasElement | null = null;

    public initialise(canvas: HTMLCanvasElement): boolean {
        this.canvas = canvas;
        const ctx = canvas.getContext("webgl", {
            antialias: false,
            alpha: false,
            depth: false,
            stencil: false,
            premultipliedAlpha: false,
        });

        this.gl = ctx as WebGLRenderingContext;
        if(this.gl === null) throw "Failed to initialise Renderer";

        // For now, draw a coloured quad
        this.initDemoResources();

        return this.gl.getError() === glCtx.NO_ERROR;
    }

    public clear(): void {
        if(this.gl) {
            this.gl.clear(glCtx.COLOR_BUFFER_BIT);
        }
    }

    private rndr: RenderState | null = null;

    public render(): void {
        if(!this.rndr) return;

        const {gl, prog, vbuf, loc0} = this.rndr;

        gl.useProgram(prog);
        gl.bindBuffer(glCtx.ARRAY_BUFFER, vbuf);
        gl.enableVertexAttribArray(loc0);
        gl.vertexAttribPointer(loc0, 2, glCtx.FLOAT, false, 0, 0);
        gl.bindBuffer(glCtx.ARRAY_BUFFER, null);

        gl.drawArrays(glCtx.TRIANGLE_STRIP, 0, 4);

        gl.useProgram(null);
    }

    private initDemoResources(): boolean {
        if(!this.gl) return false;

        const gl = this.gl;

        let vbuf: WebGLBuffer | null = null;
        let prog: Program | null = null;
        let loc0: number = -1;

        vbuf = gl.createBuffer();
        if(!vbuf) return false;

        gl.bindBuffer(glCtx.ARRAY_BUFFER, vbuf);
        gl.bufferData(glCtx.ARRAY_BUFFER, new Float32Array(quadPositions), glCtx.STATIC_DRAW);
        gl.bindBuffer(glCtx.ARRAY_BUFFER, null);

        prog = Program.create(gl, vtxShdr, frgShdr);
        if(!prog) return false;

        loc0 = gl.getAttribLocation(prog, "position");
        if(loc0 !== 0) return false;

        this.rndr = {
            gl: gl,
            vbuf: vbuf,
            prog: prog,
            loc0: loc0,
        }

        return gl.getError() === glCtx.NO_ERROR;
    }
}