const db = require("../../models");
const AWS = require("aws-sdk");

// Configure AWS SDK
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();
// const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;

const concatenateAndSaveVideo = async (data) => {
  const { proctorId, s3Url } = data;
  // NOTE: Video chunks logic is removed and video is getting uploaded from frontend directly. And it is calling saveuri after uploading video
  // from frontend.
  //TODO: Remove chunks and upload video logic from here
  try {
    const proctor = await db.Proctor.findOne({
      where: { id: proctorId },
    });

    if (!proctor) {
      throw new Error("Proctor not found");
    }

    ////////////////////////////////////////////////golu//////////

    // console.log('Proctor found:', proctor); // Debug: Log the found proctor

    // const videoChunks = proctor.videoChunks;

    // if (videoChunks.length === 0) {
    //   throw new Error('No video chunks available for concatenation');
    // }

    // const videoUrls = videoChunks.map(chunk => chunk.public_id);
    // console.log('Video URLs:', videoUrls); // Debug: Log the video URLs

    // Concatenate videos logic
    // Use ffmpeg or another library to concatenate the videos
    // const concatenatedVideoBuffer = await concatenateVideos(videoUrls); // Implement this function using ffmpeg

    // Create a unique filename for the concatenated video
    // const fileName = `concatenated_${proctorId}.mp4`;

    // Upload the concatenated video to S3
    // const uploadParams = {
    //   Bucket: BUCKET_NAME,
    //   Key: fileName,

    //   ContentType: 'video/mp4',
    // };

    // const uploadResult = await s3.upload(uploadParams).promise(); // Uploading from frontend
    // console.log('Uploaded to S3:', uploadResult.Location); // Debug: Log the S3 location

    //////////////////////////////////golu//////////////
    // Update the proctor record with the new video URL
    const updateResult = await db.Proctor.update(
      { videoUrl: s3Url },
      { where: { id: proctorId } }
    );

    if (updateResult && updateResult[0] === 0) {
      throw new Error("Proctor data with the given id does not exist");
    }

    const updatedProctor = await db.Proctor.findOne({
      where: { id: proctorId },
    });

    console.log("Updated Proctor:", updatedProctor); // Debug: Log the updated proctor

    return {
      status: "success",
      result: updatedProctor,
    };
  } catch (error) {
    console.error("Error concatenating and saving video:", error);
    return {
      status: "error",
      message: error.message,
    };
  }
};

// Example function to concatenate videos using ffmpeg

module.exports = { concatenateAndSaveVideo };
