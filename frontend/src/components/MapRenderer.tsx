import React from "react";
import Renderer from '../webgl/Renderer';
import fetchPage from '../api/api';

export interface MapRendererProps {
    width: number;
    height: number;
    coord: [number, number];
}

interface MapRendererState {
    renderer: Renderer;
}

export default class MapRenderer extends React.Component<MapRendererProps, MapRendererState> {
    private canvas: HTMLCanvasElement | null = null;
    private aniReq: number = 0;

    public state: MapRendererState = {
        renderer: new Renderer(),
    };

    public constructor(props: MapRendererProps) {
        super(props);
    }

    public componentDidMount(): void {
        // Initialise renderer
        if(this.canvas) this.state.renderer.initialise(this.canvas);
        else console.error("No canvas");

        this.renderFnc();
    }

    public componentWillUnmount(): void {
        cancelAnimationFrame(this.aniReq);
    }

    public componentDidUpdate(prevProps: Readonly<MapRendererProps>, _: Readonly<MapRendererState>): void {
        if(prevProps.coord[0] !== this.props.coord[0] || prevProps.coord[1] !== this.props.coord[1]) {

            fetchPage(this.props.coord, this.handlePage)
            fetchPage([this.props.coord[0]+1, this.props.coord[1]], this.handlePage);
            fetchPage([this.props.coord[0]+2, this.props.coord[1]], this.handlePage);
        }
    }

    private renderFnc = (): void => {
        this.aniReq = requestAnimationFrame(this.renderFnc);
        this.state.renderer.render();
    }

    private handlePage = (coord: [number, number], base64: string):void => {
        // Decode the image, store in a texture, and display on the quad
        if(base64 === "") {
            this.state.renderer.setTexture(coord[0] - this.props.coord[0], null);
            return;
        }

        const image = new Image();
        image.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = image.width;
            canvas.height = image.height;
            const ctx = canvas.getContext("2d");
            if(ctx) {
                ctx.drawImage(image, 0, 0);
                const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
                console.log("offset:" + (coord[0] - this.props.coord[0]));
                this.state.renderer.setTexture(coord[0] - this.props.coord[0], Uint8Array.from(img.data));
            }
        }
        image.src = base64;
    }

    public render(): React.ReactNode {
        const props = this.props;

        return (
            <canvas
                id="mapRenderer"
                ref={r => this.canvas = r}
                width={props.width}
                height={props.height}
            />
        );
    }
}
