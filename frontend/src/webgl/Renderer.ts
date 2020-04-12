class Shader extends WebGLShader {
    public static create(context: WebGLRenderingContext, type: GLenum, source: string): Shader | null {
        let shdr: Shader | null = context.createShader(type);
        if(shdr === null) return null;

        context.shaderSource(shdr, source);
        context.compileShader(shdr);
        if(context.getShaderParameter(shdr, context.COMPILE_STATUS)) {
            return shdr;
        } else {
            console.log("WebGL " + (type === WebGLRenderingContext.FRAGMENT_SHADER ? "Fragment" : "Vertex") + " Shader:\n" + context.getShaderInfoLog(shdr));
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
            console.log("WebGL Program:\n" + context.getProgramInfoLog(prog));
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
    precision highp float;
    
    attribute vec2 position;
    
    varying vec2 texcoord;
    
    void main() {
        texcoord = .5*(position + vec2(1., 1.));
        gl_Position = vec4(position, 0., 1.);
    }   
`;

const frgShdr = `
    precision highp float;
    
    varying vec2 texcoord;
    
    uniform sampler2D tex0;
    uniform sampler2D tex1;
    uniform sampler2D tex2;
    
    #define oneThird 1./3.
    #define twoThird 2./3.
    
    void main() {
        gl_FragColor = texcoord.x < oneThird 
            ? texture2D(tex0, vec2(texcoord.x*3., texcoord.y))
            : oneThird <= texcoord.x && texcoord.x < twoThird
                ? texture2D(tex1, vec2((texcoord.x - oneThird)*3., texcoord.y))
                : texture2D(tex2, vec2((texcoord.x - twoThird)*3., texcoord.y));
    }
`;

// Small render state object so we can stop checking for null
interface RenderState {
    gl: WebGLRenderingContext;
    prog: Program;
    vbuf: WebGLBuffer;
    loc0: number;
    textures: Array<WebGLTexture>;
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
        if(!this.initDemoResources()) throw "Failed to initialise WebGL Resources";

        return this.gl.getError() === this.gl.NO_ERROR;
    }

    public clear(): void {
        if(this.gl) {
            this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        }
    }

    private rndr: RenderState | null = null;

    public setTexture(unit: number, data: Uint8Array | null): void {
        if(!this.rndr) return;

        const [gl, tex] = [this.rndr.gl, this.rndr.textures[unit]];

        gl.activeTexture(gl.TEXTURE0 + unit);
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texImage2D(
            gl.TEXTURE_2D,
            0,
            gl.RGBA,
            256,
            256,
            0,
            gl.RGBA,
            gl.UNSIGNED_BYTE,
            data
        );

        if(unit !== 0) {
            gl.activeTexture(gl.TEXTURE0);
        }
    }


    public render(): void {
        if(!this.rndr) return;

        const {gl, prog, vbuf, loc0, textures} = this.rndr;

        gl.useProgram(prog);
        gl.bindBuffer(gl.ARRAY_BUFFER, vbuf);
        gl.enableVertexAttribArray(loc0);
        gl.vertexAttribPointer(loc0, 2, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        for(let i = 0; i !== textures.length; ++i) {
            gl.activeTexture(gl.TEXTURE0 + i);
            gl.bindTexture(gl.TEXTURE_2D, textures[i]);
        }

        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

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

        gl.bindBuffer(gl.ARRAY_BUFFER, vbuf);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(quadPositions), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        prog = Program.create(gl, vtxShdr, frgShdr);
        if(!prog) return false;
        
        gl.useProgram(prog);

        loc0 = gl.getAttribLocation(prog, "position");
        if(loc0 !== 0) return false;

        const loc1 = gl.getUniformLocation(prog, "tex0");
        const loc2 = gl.getUniformLocation(prog, "tex1");
        const loc3 = gl.getUniformLocation(prog, "tex2");

        gl.uniform1i(loc1, 0);
        gl.uniform1i(loc2, 1);
        gl.uniform1i(loc3, 2);

        gl.useProgram(null);

        const textures = new Array<WebGLTexture>(3);

        for(let i = 0; i != 3; ++i) {
            let tex = gl.createTexture();
            if(!tex) return false;

            gl.activeTexture(gl.TEXTURE0 + i);
            gl.bindTexture(gl.TEXTURE_2D, tex);
            gl.texImage2D(
                gl.TEXTURE_2D,
                0,
                gl.RGBA,
                256,
                256,
                0,
                gl.RGBA,
                gl.UNSIGNED_BYTE,
                null
            );

            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

            textures[i] = tex;
        }

        this.rndr = {
            gl: gl,
            vbuf: vbuf,
            prog: prog,
            loc0: loc0,
            textures: textures,
        }

        return gl.getError() === gl.NO_ERROR;
    }
}