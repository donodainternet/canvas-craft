# Canvas Craft

Canvas Craft is an open-source image editor designed for both browser and Node.js environments. With a User-Centric API Design, editing an image is as simple as writing a sentence.

## Example
```
<html>
<head>
  <title>Canvas Image Editor Example</title>
  <script src="./node_modules/canvas-image-editor/dist/canvas-image-editor.js"></script>
</head>
<body>
  <img id="base64Image" alt="Base64 Image">
  <script>
    window.addEventListener('load', () => {
      const base64ImageElement = document.getElementById('base64Image');
      CanvasImageEditor
        .createImageEditor()
        .placeImage('./image10.jpg')
        .crop(21/9)
        .use(grayScale())
        .compose(toPNG())
        .then(([composeResult, canvas]) => {
          base64ImageElement.src = composeResult.toString();
        });
    });
  </script>
</body>
</html>
```
This example crops an image to an ultrawide aspect ratio, applies grayscale, and converts it to PNG.

## Installation
To install Canvas Craft, clone the repository:
```
git clone https://github.com/donodainternet/canvas-craft.git
cd canvas-craft
```

## Getting Started
To use Canvas Craft in your project, import it and start editing:
```
const { CanvasImageEditor, grayScale, toPNG } = require('./path-to-canvas-craft');

const editor = CanvasImageEditor.createImageEditor();

editor
  .placeImage('./your-image.jpg')
  .transform({ x: 0, y: 0 }, { x: 100, y: 0 }, { x: 0, y: 100 }, { x: 100, y: 100 })
  .compose()
  .then(([composeResult, canvas]) => {
    // Use the composed result or canvas as needed
  })
  .catch((error) => {
    console.error('Error editing image:', error);
  });
```
## API Reference
1. **createImageEditor**(): CanvasImageEditor
    - Description: Creates a new instance of the Canvas Image Editor.
    - Returns: CanvasImageEditor

2. **placeImage**(URL: URL, x?: number, y?: number, boundaryWidth?: number, boundaryHeight?: number): CanvasImageEditor
    - Description: Places an image on the canvas.
    - Parameters:
      - URL: URL - URL of the image.
      - x?: number - X-coordinate for the placement.
      - y?: number - Y-coordinate for the placement.
      - boundaryWidth?: number - Width boundary for resizing.
      - boundaryHeight?: number - Height boundary for resizing.
    - Returns: CanvasImageEditor

3. **placeVector**(svgContent: string, x?: number, y?: number, boundaryWidth?: number, boundaryHeight?: number): CanvasImageEditor
    - Description: Places a vector on the canvas.
    - Parameters:
      - svgContent: string - SVG content for the vector.
      - x?: number - X-coordinate for the placement.
      - y?: number - Y-coordinate for the placement.
      - boundaryWidth?: number - Width boundary for resizing.
      - boundaryHeight?: number - Height boundary for resizing.
    - Returns: CanvasImageEditor
      
4. **placeSVG**(URL: URL, x?: number, y?: number, boundaryWidth?: number, boundaryHeight?: number): CanvasImageEditor
    - Description: Places an SVG on the canvas.
    - Parameters:
      - URL: URL - URL of the SVG.
      - x?: number - X-coordinate for the placement.
      - y?: number - Y-coordinate for the placement.
      - boundaryWidth?: number - Width boundary for resizing.
      - boundaryHeight?: number - Height boundary for resizing.
    - Returns: CanvasImageEditor

5. **text**(svgContent: string, fontCssUrl: URL[], x?: number, y?: number, boundaryWidth?: number, boundaryHeight?: number): CanvasImageEditor
    - Description: Places text on the canvas.
    - Parameters:
      - svgContent: string - SVG content for the text.
      - fontCssUrl: URL[] - Array of font CSS URLs.
      - x?: number - X-coordinate for the placement.
      - y?: number - Y-coordinate for the placement.
      - boundaryWidth?: number - Width boundary for resizing.
      - boundaryHeight?: number - Height boundary for resizing.
    - Returns: CanvasImageEditor

6. **transform**(a: CoordinatePoint, b: CoordinatePoint, c: CoordinatePoint, d: CoordinatePoint): CanvasImageEditor
    - Description: Transforms the canvas using arbitrary points.
    - Parameters:
      - a: CoordinatePoint - Point A for transformation.
      - b: CoordinatePoint - Point B for transformation.
      - c: CoordinatePoint - Point C for transformation.
      - d: CoordinatePoint - Point D for transformation.
    - Returns: CanvasImageEditor

7. **compose**(targetFunction: ComposeTargetFunction): Promise<[ComposeResult, HTMLCanvasElement]>
    - Description: Composes the image on the canvas.
    - Parameters:
      - targetFunction: ComposeTargetFunction - Target function for composition.
   - Returns: Promise<[ComposeResult, HTMLCanvasElement]>

8. **resizeToWidth**(newCanvasWidth: number): CanvasImageEditor
    - Description: Resizes the canvas to the specified width.
    - Parameters:
      - newCanvasWidth: number - New width for the canvas.
    - Returns: CanvasImageEditor

9. **resizeToHeight**(newCanvasHeight: number): CanvasImageEditor
    - Description: Resizes the canvas to the specified height.
    - Parameters:
      - newCanvasHeight: number - New height for the canvas.
    - Returns: CanvasImageEditor

10. **slice**(x?: number, y?: number, width?: number, height?: number): CanvasImageEditor
    - Description: Slices the canvas.
    - Parameters:
      - x?: number - X-coordinate for slicing.
      - y?: number - Y-coordinate for slicing.
      - width?: number - Width for slicing.
      - height?: number - Height for slicing.
    - Returns: CanvasImageEditor

11. **crop**(aspectRatio?: number): CanvasImageEditor
    - Description: Crops the canvas to the specified aspect ratio.
    - Parameters:
      - aspectRatio?: number - Aspect ratio for cropping.
    - Returns: CanvasImageEditor

12. **mask**(mask: () => Promise<void>): CanvasImageEditor
    - Description: Applies a mask to the canvas.
    - Parameters:
      - mask: () => Promise<void> - Function for masking.
    - Returns: CanvasImageEditor

13. **use**(filter: () => Promise<void>): CanvasImageEditor
    - Description: Applies a filter to the canvas.
    - Parameters:
      - filter: () => Promise<void> - Function for applying the filter.
    - Returns: CanvasImageEditor

## Filters
1. backgroundBlur:
    - Description: Applies a background blur effect to the canvas.
    - Usage: use(backgroundBlur())

2. backgroundColor(color: string):
    - Description: Sets the background color of the canvas.
    - Parameter:
      - color: Color in string format (e.g., "#ff0000" for red).
    - Usage: use(backgroundColor("#ff0000"))

3. backgroundReplace(url: string):
    - Description: Replaces the canvas background with an image specified by the URL.
    - Parameter:
      - url: URL of the replacement image.
      - Usage: use(backgroundReplace("path/to/image.jpg"))

4. grayScale:
    - Description: Converts the canvas to grayscale.
    - Usage: use(grayScale())
  

## Contributing
Feel free to contribute to Canvas Craft by creating issues or submitting pull requests.

## License
Canvas Craft is licensed under the MIT License.
