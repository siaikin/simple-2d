import {EventTarget} from "./EventTarget";

export class SimpleCanvas {

  public context: CanvasRenderingContext2D;

  private _evt: EventTarget;

  constructor(canvas: HTMLCanvasElement) {
    this.context = canvas.getContext('2d');
    this._evt = new EventTarget();
  }

  public drawText(text: string): void {
    if (!this.context) return;

    this.context.save();

    this.context.textBaseline = 'middle';
    this.context.textAlign = 'center';

    const centerX = this.context.canvas.width * 0.5;
    const centerY = this.context.canvas.height * 0.5;

    this.context.fillText(text, centerX, centerY);

    this.context.strokeStyle = 'green';

    this.context.strokeText(text, centerX, centerY);

    this.context.restore();
  }
}
