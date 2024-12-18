import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "ffmpeg-static";
import ffprobePath from "ffprobe-static";
import path from "path";

// Set paths for ffmpeg and ffprobe
ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath.path);

// Promisify ffprobe
const ffprobeAsync = (filePath) => {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) {
        reject(err);
      } else {
        resolve(metadata);
      }
    });
  });
};

export const createVideo = async (videoPath, audioPath, outputPath) => {
  try {
    const videoMetadata = await ffprobeAsync(videoPath);
    const audioMetadata = await ffprobeAsync(audioPath);

    const videoDuration = videoMetadata.format.duration;
    const audioDuration = audioMetadata.format.duration;

    console.log(`Video Duration: ${videoDuration} seconds`);
    console.log(`Audio Duration: ${audioDuration} seconds`);

    return new Promise((resolve, reject) => {
      const command = ffmpeg();

      // Ensure the correct paths
      command.input(videoPath).input(audioPath);

      // Handle audio longer than video by looping the video
      if (audioDuration > videoDuration) {
        command.inputOptions(["-stream_loop", "-1"]);
      }

      command
        .outputOptions([
          "-shortest", // Stops encoding at the shortest stream
          "-c:v",
          "libx264", // Video codec
          "-c:a",
          "aac", // Audio codec
          "-preset",
          "fast",
          "-crf",
          "23", // Quality level
        ])
        .output(outputPath)
        .on("start", (commandLine) => {
          console.log("Spawned FFmpeg with command: " + commandLine);
        })
        .on("progress", (progress) => {
          console.log(`Processing: ${progress.percent}% done`);
        })
        .on("end", () => {
          console.log("Processing finished successfully");
          resolve();
        })
        .on("error", (err) => {
          console.error("Error during processing:", err.message);
          reject(err);
        })
        .run();
    });
  } catch (error) {
    console.error("Combine video and audio failed:", error.message);
    throw error;
  }
};

// Example Usage
export const processVideoAudio = async () => {
  const videoPath = path.resolve("./src/resources/horrorvideo1.mp4");
  const audioPath = path.resolve("./src/resources/output.mp3");
  const outputPath = path.resolve("./src/resources/final_output.mp4");

  try {
    await createVideo(videoPath, audioPath, outputPath);
  } catch (error) {
    console.error("Video processing failed:", error.message);
  }
};
