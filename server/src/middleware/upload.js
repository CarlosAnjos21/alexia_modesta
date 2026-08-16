import multer from "multer";
import path from "node:path";
import crypto from "node:crypto";

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, path.resolve("uploads")),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${crypto.randomUUID()}${ext}`);
  },
});

function fileFilter(_req, file, cb) {
  const ok = ["image/jpeg", "image/png", "image/webp"].includes(file.mimetype);
  cb(ok ? null : new Error("Formato de imagem não suportado"), ok);
}

export const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });
