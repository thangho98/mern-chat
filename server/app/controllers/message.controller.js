import { streamUpload } from '../../common/storage/cloudinary/cloudinary-storage';
import socketEvent from '../../socket-even';
import { MessageService } from '../services/messages.service';

export const MessageController = {
  sendMessage: async (req, res) => {
    const files = req.files;
    const listInfoFiles = [];
    if (files && files.length) {
      for (const file of files) {
        const dataUpload = await streamUpload(file);
        listInfoFiles.push({
          fileName: dataUpload.public_id + '.' + dataUpload.format,
          type: dataUpload.resource_type,
          url: dataUpload.secure_url,
        });
      }
    }

    try {
      const savedMessage = await MessageService.savedMessage({
        ...req.body,
        files: listInfoFiles,
      });
      socketEvent.emit('newMessage', savedMessage);
      res.status(200).json(savedMessage);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
};
