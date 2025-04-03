import { Composition, staticFile, Video, AbsoluteFill, Img, Sequence } from 'remotion';

export const MyVideo = ({ images }) => {
    return (
        <AbsoluteFill className="bg-black">
            {images.map((image, index) => (
                <Sequence from={index * 30} durationInFrames={30} key={index}>
                    <Img src={`data:image/png;base64,${image}`} className="w-full h-full object-contain" />
                </Sequence>
            ))}
        </AbsoluteFill>
    );
};

// Define the video composition
export const RemotionVideo = () => {
    return (
        <Composition
            id="MyVideo"
            component={MyVideo}
            durationInFrames={images.length * 30} // Adjust dynamically
            fps={30}
            width={1920}
            height={1080}
            defaultProps={{ images }} // Pass images here
        />
    );
};
