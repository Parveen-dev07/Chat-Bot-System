export const UploadService = {
    async uploadFile(file: Express.Multer.File) {

        if (!file) {
            throw new Error("File is required");
        }

        return {
            url: `${process.env.UPLOADS_URL || "http://localhost:5000/uploads"}/${file.filename}`,
        };
    },
};