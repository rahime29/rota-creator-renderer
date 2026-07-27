import { Composition } from "remotion";
import { TravelVideo } from "./TravelVideo";

export const Root = () => {
  return (
    <>
      <Composition
        id="TravelVideo"
        component={TravelVideo}
        width={1080}
        height={1920}
        fps={30}
        durationInFrames={1800}
        defaultProps={{
          manifest: {
            city: "Istanbul",
            country: "Turkey",
            day: 1,
            title: "Historic Istanbul",
            voiceAudio:
              "https://res.cloudinary.com/demo/video/upload/sample.mp3",
            routeMap:
              "https://res.cloudinary.com/demo/image/upload/sample.jpg",
            places: [],
            timeline: []
          }
        }}
      />
    </>
  );
};
