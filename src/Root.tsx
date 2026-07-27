import React from "react";
import {Composition} from "remotion";
import {TravelVideo, TravelVideoProps} from "./TravelVideo";

const defaultProps: TravelVideoProps = {
  project: "Rota Creator",

  video: {
    video_id: "rota-creator-test",
    route_id: "test-route",
    package_id: "test-package",

    city: "Istanbul",
    country: "Turkey",
    day: 1,

    title: "Istanbul Day 1",
    hook: "Your ready-made Istanbul route.",

    route_theme: "Historic Istanbul",
    area_focus: "Sultanahmet",

    closing_text:
      "Follow Rota Creator for more ready-made routes.",
  },

  settings: {
    width: 1080,
    height: 1920,
    fps: 30,

    duration_seconds: 60,
    duration_in_frames: 1800,

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

export const Root: React.FC = () => {
  return (
    <Composition
      id="RotaCreatorShort"
      component={TravelVideo}
      width={1080}
      height={1920}
      fps={30}
      durationInFrames={1800}
      defaultProps={defaultProps}
    />
  );
};
