import React from "react";
import {
  CalculateMetadataFunction,
  Composition,
} from "remotion";
import {
  TravelVideo,
  TravelVideoProps,
} from "./TravelVideo";

const emptyProps: TravelVideoProps = {
  project: "Rota Creator",

  video: {
    video_id: "",
    route_id: "",
    package_id: "",

    city: "",
    country: "",
    day: 0,

    title: "",
    hook: "",
    route_theme: "",
    area_focus: "",
    closing_text: "",
  },

  settings: {
    width: 1080,
    height: 1920,
    fps: 30,

    duration_seconds: 1,
    duration_in_frames: 30,

    aspect_ratio: "9:16",
    background_color: "#000000",
    language: "English",
  },

  branding: {
    brand: "Rota Creator",
    handle: "@rotacreator",

    watermark_enabled: true,
    watermark_position: "top_right",

    intro_style: "brand_gradient",
    outro_style: "brand_gradient",
  },

  timeline: {
    segments: [],

    subtitles: {
      enabled: true,
      burn_into_video: true,
      language: "English",
      segments: [],
    },

    audio: {
      enabled: false,
      binary_property: "voice_audio",
      url: "",
      secure_url: "",
      volume: 1,
    },
  },

  assets: {},
};

const calculateMetadata: CalculateMetadataFunction<
  TravelVideoProps
> = async ({props}) => {
  const fps =
    Number(props.settings?.fps) > 0
      ? Number(props.settings.fps)
      : 30;

  const durationInFrames =
    Number(props.settings?.duration_in_frames) > 0
      ? Math.ceil(
          Number(props.settings.duration_in_frames)
        )
      : Math.max(
          1,
          Math.ceil(
            Number(
              props.settings?.duration_seconds ?? 1
            ) * fps
          )
        );

  const width =
    Number(props.settings?.width) > 0
      ? Number(props.settings.width)
      : 1080;

  const height =
    Number(props.settings?.height) > 0
      ? Number(props.settings.height)
      : 1920;

  return {
    fps,
    durationInFrames,
    width,
    height,
    props,
  };
};

export const Root: React.FC = () => {
  return (
    <Composition
      id="RotaCreatorShort"
      component={TravelVideo}
      defaultProps={emptyProps}
      calculateMetadata={calculateMetadata}
      width={1080}
      height={1920}
      fps={30}
      durationInFrames={30}
    />
  );
};
