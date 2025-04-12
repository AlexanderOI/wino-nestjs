import { Injectable } from '@nestjs/common'
import { File } from '@nest-lab/fastify-multer'
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary'
import sharp from 'sharp'

@Injectable()
export class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    })
  }

  async uploadAvatar(file: File) {
    const optimizedImage = await sharp(file.buffer)
      .resize(512, 512, { fit: 'cover' })
      .toFormat('webp')
      .toBuffer()

    const result: UploadApiResponse = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({}, (err, result) => {
          if (err) reject(err)
          resolve(result)
        })
        .end(optimizedImage)
    })

    return result.secure_url
  }
}
