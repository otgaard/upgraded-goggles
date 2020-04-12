import React from "react";
import Renderer from '../webgl/Renderer';

export interface MapRendererProps {
    width: number;
    height: number;
    coord: number;
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
        if(prevProps.coord !== this.props.coord) {

        }
    }

    private renderFnc = (): void => {
        this.aniReq = requestAnimationFrame(this.renderFnc);
        this.state.renderer.render();
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
