import { BadRequestException } from '@nestjs/common'
import { MulterOptions } from '@nest-lab/fastify-multer'

export const multerOptions: MulterOptions = {
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, callback) => {
    if (!file.mimetype.match(/^image\/(jpeg|jpg|png|webp)$/)) {
      return callback(
        new BadRequestException('Only images are allowed (jpeg, jpg, png, webp)'),
        false,
      )
    }
    callback(null, true)
  },
}
