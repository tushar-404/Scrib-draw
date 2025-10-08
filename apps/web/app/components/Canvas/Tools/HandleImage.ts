import Konva from "konva";
import { nanoid } from "nanoid";
import { Action, ImageAction } from "../store";

const HandleImage = (
  stage: Konva.Stage,
  recordAction: (updater: (prev: Action[]) => Action[]) => void,
): (() => void) => {
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = "image/*";
  fileInput.style.display = "none";
  document.body.appendChild(fileInput);

  const onFileChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const src = reader.result as string;
      const img = new window.Image();
      img.src = src;

      img.onload = () => {
        const transform = stage.getAbsoluteTransform().copy();
        transform.invert();
        const center = transform.point({
          x: stage.width() / 2,
          y: stage.height() / 2,
        });

        const MAX_INITIAL_WIDTH = 250;
        let newWidth = img.width;
        let newHeight = img.height;

        if (img.width > MAX_INITIAL_WIDTH) {
          newWidth = MAX_INITIAL_WIDTH;
          newHeight = img.height * (MAX_INITIAL_WIDTH / img.width);
        }

        recordAction((prevActions) => [
          ...prevActions,
          {
            id: nanoid(),
            tool: "image",
            x: center.x - newWidth / 2,
            y: center.y - newHeight / 2,
            width: newWidth,
            height: newHeight,
            src: src,
          } as ImageAction,
        ]);
        target.value = "";
      };
    };
  };

  fileInput.addEventListener("change", onFileChange);
  fileInput.click();

  return () => {
    fileInput.removeEventListener("change", onFileChange);
    document.body.removeChild(fileInput);
  };
};

export default HandleImage;
