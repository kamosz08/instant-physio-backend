import multer from 'multer'

export function getFilePath(fileName: string) {
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)

  return '/uploads/' + `${uniqueSuffix}-${fileName}`
}

export function createStorage() {
  let storage: multer.StorageEngine

  if (process.env.NODE_ENV === 'test') {
    storage = multer.memoryStorage()
  } else {
    storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, '/uploads')
      },
      filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
        cb(null, file.fieldname + '-' + uniqueSuffix)
      },
    })
  }

  const fileFilter = (req, file, cb) => {
    if (file.mimetype.split('/')[0] === 'image') {
      cb(null, true)
    } else {
      cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE'), false)
    }
  }

  const upload = multer({ storage: storage, fileFilter: fileFilter })

  return { upload }
}
