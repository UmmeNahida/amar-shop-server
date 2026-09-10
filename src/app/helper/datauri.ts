import DatauriParser from "datauri/parser.js";
import cloudinary from "./cloudinary";

export interface IUplodedFiles {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: string;
  size: number;
}

const parser = new DatauriParser();

export const parseBufferToURI = (buffer:string) => parser.format("", buffer).content;

export const uploadedFiles = async (files: IUplodedFiles[]) => {
  return Promise.all(
    files.map(async (file) => {
      const fileString = parseBufferToURI(file.buffer) as string;

      const uploadFile = await cloudinary.uploader.upload(fileString, {
        folder: "nahida-assets",
      });

      return {
        public_id: uploadFile.public_id,
        url: uploadFile.secure_url,
      };
    }),
  );
};