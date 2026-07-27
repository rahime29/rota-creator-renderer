import React from "react";
import {
  AbsoluteFill,
  Img,
  Sequence,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {Audio} from "@remotion/media";

// ==================================================
// TYPES
// ==================================================

export type TimelineSegment = {
  sequence?: number;
  segment_id?: string;

  type:
    | "intro"
    | "route_map_intro"
    | "place_visual"
    | "route_map_summary"
    | "outro"
    | string;

  start_seconds: number;
  duration_seconds: number;
  end_seconds?: number;

  binary_property?: string;

  media_url?: string;
  asset_url?: string;

  title?: string;
  subtitle?: string;

  place?: string;
  area?: string;

  stop_order?: number;
  stop_count?: number;
  stop_indicator?: string;

  hook?: string;
  route_theme?: string;
  area_focus?: string;

  closing_text?: string;
  closing_summary?: string;

  motion_effect?: string;

  transition_in?: string;
  transition_out?: string;

  background_type?: string;

  overlay?: {
    show_brand?: boolean;
    show_city?: boolean;
    show_day?: boolean;
    show_title?: boolean;

    show_route_title?: boolean;
    show_route_theme?: boolean;
    show_stop_count?: boolean;

    show_place_name?: boolean;
    show_stop_indicator?: boolean;
    show_subtitle?: boolean;

    show_route_summary?: boolean;
    show_save_cta?: boolean;
    show_follow_cta?: boolean;
  };
};

export type SubtitleSegment = {
  sequence?: number;
  text: string;

  start_seconds: number;
  end_seconds: number;

  stop_order?: number;
  place?: string;
};

export type TravelVideoProps = {
  project: string;

  video: {
    video_id: string;
    route_id: string;
    package_id: string;

    city: string;
    country: string;
    day: number;

    title: string;
    hook: string;

    route_theme: string;
    area_focus: string;

    closing_text: string;
  };

  settings: {
    width: number;
    height: number;
    fps: number;

    duration_seconds: number;
    duration_in_frames: number;

    aspect_ratio: string;
    background_color: string;
    language: string;
  };

  branding: {
    brand: string;
    handle: string;

    watermark_enabled: boolean;
    watermark_position: string;

    intro_style: string;
    outro_style: string;
  };

  timeline: {
    segments: TimelineSegment[];

    subtitles: {
      enabled: boolean;
      burn_into_video: boolean;
      language: string;
      segments: SubtitleSegment[];
    };

    audio: {
      enabled: boolean;
      binary_property: string;

      url: string;
      secure_url: string;

      volume: number;
    };
  };

  assets: Record<
    string,
    {
      asset_id?: string;
      asset_type?: string;
      binary_property?: string;

      url?: string;
      secure_url?: string;

      status?: string;
    }
  >;
};

// ==================================================
// HELPERS
// ==================================================

const safeText = (
  value: unknown,
  fallback = ""
): string => {
  const result = String(value ?? "").trim();
  return result || fallback;
};

const secondsToFrames = (
  seconds: number,
  fps: number
): number => {
  return Math.max(
    1,
    Math.round(Number(seconds || 0) * fps)
  );
};

const resolveSegmentUrl = (
  segment: TimelineSegment,
  assets: TravelVideoProps["assets"]
): string => {
  const directUrl =
    safeText(segment.media_url) ||
    safeText(segment.asset_url);

  if (directUrl) {
    return directUrl;
  }

  const binaryProperty =
    safeText(segment.binary_property);

  if (!binaryProperty) {
    return "";
  }

  return (
    safeText(assets?.[binaryProperty]?.secure_url) ||
    safeText(assets?.[binaryProperty]?.url)
  );
};

// ==================================================
// SHARED COMPONENTS
// ==================================================

const BrandWatermark: React.FC<{
  brand: string;
  enabled: boolean;
}> = ({brand, enabled}) => {
  if (!enabled) {
    return null;
  }

  return (
    <div
      style={{
        position: "absolute",
        top: 62,
        right: 48,

        padding: "14px 24px",

        borderRadius: 999,

        backgroundColor: "rgba(0, 0, 0, 0.55)",
        color: "#ffffff",

        fontFamily: "Arial, sans-serif",
        fontSize: 27,
        fontWeight: 700,

        letterSpacing: 0.5,
        zIndex: 50,
      }}
    >
      {brand}
    </div>
  );
};

const BottomSubtitle: React.FC<{
  text: string;
}> = ({text}) => {
  if (!safeText(text)) {
    return null;
  }

  return (
    <div
      style={{
        position: "absolute",

        left: 58,
        right: 58,
        bottom: 145,

        display: "flex",
        justifyContent: "center",

        zIndex: 40,
      }}
    >
      <div
        style={{
          maxWidth: 940,

          padding: "18px 30px",

          borderRadius: 20,

          backgroundColor: "rgba(0, 0, 0, 0.70)",
          color: "#ffffff",

          fontFamily: "Arial, sans-serif",
          fontSize: 45,
          fontWeight: 700,

          lineHeight: 1.22,
          textAlign: "center",

          textShadow:
            "0 3px 8px rgba(0, 0, 0, 0.85)",
        }}
      >
        {text}
      </div>
    </div>
  );
};

const DarkOverlay: React.FC<{
  opacity?: number;
}> = ({opacity = 0.25}) => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: `rgba(0, 0, 0, ${opacity})`,
      }}
    />
  );
};

// ==================================================
// INTRO
// ==================================================

const IntroScene: React.FC<{
  segment: TimelineSegment;
  props: TravelVideoProps;
}> = ({segment, props}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const opacity = interpolate(
    frame,
    [0, fps * 0.5],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const scale = interpolate(
    frame,
    [0, fps * 2.5],
    [0.94, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const city = safeText(props.video.city);
  const country = safeText(props.video.country);
  const day = Number(props.video.day || 0);

  const title =
    safeText(segment.title) ||
    safeText(props.video.title);

  const hook =
    safeText(segment.subtitle) ||
    safeText(segment.hook) ||
    safeText(props.video.hook);

  return (
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(145deg, #111827 0%, #1f2937 48%, #020617 100%)",

        justifyContent: "center",
        alignItems: "center",

        padding: 75,
        color: "#ffffff",

        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          opacity,
          transform: `scale(${scale})`,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: 38,
            fontWeight: 700,
            letterSpacing: 5,
            textTransform: "uppercase",
            opacity: 0.82,
            marginBottom: 32,
          }}
        >
          {props.branding.brand}
        </div>

        <div
          style={{
            fontSize: 91,
            fontWeight: 900,
            lineHeight: 1.02,
            marginBottom: 27,
          }}
        >
          {title ||
            [city, day > 0 ? `Day ${day}` : ""]
              .filter(Boolean)
              .join(" ")}
        </div>

        {(city || country) && (
          <div
            style={{
              fontSize: 41,
              fontWeight: 600,
              opacity: 0.88,
              marginBottom: 34,
            }}
          >
            {[city, country]
              .filter(Boolean)
              .join(" · ")}
          </div>
        )}

        {hook && (
          <div
            style={{
              fontSize: 43,
              lineHeight: 1.28,
              fontWeight: 500,
              opacity: 0.93,
            }}
          >
            {hook}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

// ==================================================
// IMAGE SCENE
// ==================================================

const ImageScene: React.FC<{
  segment: TimelineSegment;
  mediaUrl: string;
  props: TravelVideoProps;
}> = ({segment, mediaUrl, props}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const durationFrames = secondsToFrames(
    segment.duration_seconds,
    fps
  );

  const fadeIn = interpolate(
    frame,
    [0, Math.min(12, durationFrames * 0.15)],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const fadeOut = interpolate(
    frame,
    [
      Math.max(0, durationFrames - 12),
      durationFrames,
    ],
    [1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const opacity = Math.min(fadeIn, fadeOut);

  const zoomDirection =
    safeText(segment.motion_effect).includes(
      "zoom_out"
    )
      ? [1.1, 1]
      : [1, 1.1];

  const scale = interpolate(
    frame,
    [0, durationFrames],
    zoomDirection,
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const isMap =
    segment.type === "route_map_intro" ||
    segment.type === "route_map_summary";

  const title =
    safeText(segment.place) ||
    safeText(segment.title);

  const subtitle =
    safeText(segment.subtitle) ||
    safeText(segment.closing_summary);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#000000",
        opacity,
        overflow: "hidden",
      }}
    >
      {mediaUrl ? (
        <Img
          src={mediaUrl}
          maxRetries={4}
          style={{
            width: "100%",
            height: "100%",

            objectFit: isMap ? "cover" : "cover",

            transform: `scale(${scale})`,
          }}
        />
      ) : (
        <AbsoluteFill
          style={{
            backgroundColor: "#111827",
          }}
        />
      )}

      <DarkOverlay opacity={isMap ? 0.14 : 0.25} />

      {title && (
        <div
          style={{
            position: "absolute",

            left: 54,
            right: 54,
            top: 118,

            color: "#ffffff",
            fontFamily: "Arial, sans-serif",

            fontSize: isMap ? 56 : 63,
            fontWeight: 900,
            lineHeight: 1.05,

            textShadow:
              "0 5px 14px rgba(0, 0, 0, 0.9)",

            zIndex: 30,
          }}
        >
          {title}
        </div>
      )}

      {segment.stop_indicator && (
        <div
          style={{
            position: "absolute",

            top: 215,
            left: 54,

            padding: "11px 20px",
            borderRadius: 999,

            backgroundColor:
              "rgba(0, 0, 0, 0.62)",

            color: "#ffffff",

            fontFamily: "Arial, sans-serif",
            fontSize: 31,
            fontWeight: 800,

            zIndex: 31,
          }}
        >
          Stop {segment.stop_indicator}
        </div>
      )}

      <BottomSubtitle text={subtitle} />

      <BrandWatermark
        brand={props.branding.brand}
        enabled={
          props.branding.watermark_enabled
        }
      />
    </AbsoluteFill>
  );
};

// ==================================================
// OUTRO
// ==================================================

const OutroScene: React.FC<{
  segment: TimelineSegment;
  props: TravelVideoProps;
}> = ({segment, props}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const opacity = interpolate(
    frame,
    [0, fps * 0.6],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const closingText =
    safeText(segment.closing_text) ||
    safeText(props.video.closing_text) ||
    `Follow ${props.branding.brand}`;

  return (
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(145deg, #020617 0%, #111827 52%, #1f2937 100%)",

        justifyContent: "center",
        alignItems: "center",

        padding: 75,

        color: "#ffffff",
        fontFamily: "Arial, sans-serif",
        textAlign: "center",
      }}
    >
      <div style={{opacity}}>
        <div
          style={{
            fontSize: 91,
            fontWeight: 900,
            marginBottom: 34,
          }}
        >
          {props.branding.brand}
        </div>

        <div
          style={{
            fontSize: 44,
            fontWeight: 600,
            lineHeight: 1.3,
            marginBottom: 38,
          }}
        >
          {closingText}
        </div>

        {safeText(props.branding.handle) && (
          <div
            style={{
              fontSize: 39,
              fontWeight: 800,
              opacity: 0.85,
            }}
          >
            {props.branding.handle}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

// ==================================================
// MAIN COMPONENT
// ==================================================

export const TravelVideo: React.FC<
  TravelVideoProps
> = (props) => {
  const {fps} = useVideoConfig();

  const segments = Array.isArray(
    props.timeline?.segments
  )
    ? props.timeline.segments
    : [];

  const audioUrl =
    safeText(
      props.timeline?.audio?.secure_url
    ) ||
    safeText(props.timeline?.audio?.url) ||
    safeText(
      props.assets?.voice_audio?.secure_url
    ) ||
    safeText(props.assets?.voice_audio?.url);

  const audioEnabled =
    props.timeline?.audio?.enabled !== false &&
    Boolean(audioUrl);

  const backgroundColor =
    safeText(
      props.settings?.background_color
    ) || "#000000";

  return (
    <AbsoluteFill
      style={{
        backgroundColor,
        overflow: "hidden",
      }}
    >
      {segments.map((segment, index) => {
        const startFrame = Math.max(
          0,
          secondsToFrames(
            segment.start_seconds,
            fps
          )
        );

        const durationFrames =
          secondsToFrames(
            segment.duration_seconds,
            fps
          );

        const mediaUrl =
          resolveSegmentUrl(
            segment,
            props.assets
          );

        return (
          <Sequence
            key={
              safeText(segment.segment_id) ||
              `${segment.type}-${index}`
            }
            from={startFrame}
            durationInFrames={durationFrames}
            premountFor={Math.min(
              fps,
              startFrame
            )}
          >
            {segment.type === "intro" && (
              <IntroScene
                segment={segment}
                props={props}
              />
            )}

            {segment.type ===
              "route_map_intro" && (
              <ImageScene
                segment={segment}
                mediaUrl={mediaUrl}
                props={props}
              />
            )}

            {segment.type ===
              "place_visual" && (
              <ImageScene
                segment={segment}
                mediaUrl={mediaUrl}
                props={props}
              />
            )}

            {segment.type ===
              "route_map_summary" && (
              <ImageScene
                segment={segment}
                mediaUrl={mediaUrl}
                props={props}
              />
            )}

            {segment.type === "outro" && (
              <OutroScene
                segment={segment}
                props={props}
              />
            )}
          </Sequence>
        );
      })}

      {audioEnabled && (
        <Audio
          src={audioUrl}
          volume={Math.max(
            0,
            Math.min(
              1,
              Number(
                props.timeline.audio.volume ??
                  1
              )
            )
          )}
        />
      )}
    </AbsoluteFill>
  );
};
