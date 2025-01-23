const { createError } = require("../utils/error");
const db = require("../../models");
const { concatenateAndSaveVideo } = require("../utils/video");
const updateProctor = async (req, res,next) => {
    try {
      const proctorId = req.candidate.proctorId
      const result = await db.Proctor.update(
        req.body,
        {
          where: {
            id: proctorId,
          },
        },
      );
      
      if(result && result[0] === 0 ){
        throw createError('Proctor data with given id does not exists',404)
      }
      const updatedProctor = await db.Proctor.findOne({
        where: {
          id: proctorId,
        },
      });
      res.status(200).json({
        status: "success",
        result: updatedProctor,
      });
    } catch (error) {
      next(error);
    }
  };

  const updateVideoUri = async (req, res, next) => {
    try {
      const { proctorId, asset_id, public_id, url, accessId } = req.body;
      // console.log(proctorId, asset_id, public_id, url, accessId)
      // return;
      if (!proctorId) {
        throw createError('Proctor ID and video URL are required', 400);
      }
      await concatenateAndSaveVideo(req.body)
  
      const proctor = await db.Proctor.findOne({
        where: { id: proctorId },
      });
  
      if (!proctor) {
        throw createError('Proctor data with given id does not exist', 404);
      }
  
      let videoChunks = proctor.videoChunks || [];
  
      videoChunks.push({
        asset_id: asset_id,
        public_id: public_id,
        url: url,
        accessId: accessId || `access_${Date.now()}`,
        timestamp: new Date().toISOString(),
      });
  
      await db.Proctor.update(
        { videoChunks },
        { where: { id: proctorId } }
      );
  
      const updatedProctor = await db.Proctor.findOne({
        where: { id: proctorId },
      });
  
      res.status(200).json({
        status: "success",
        result: updatedProctor,
      });
    } catch (error) {
      next(error);
    }
  };
  
  

module.exports = {updateProctor,updateVideoUri}