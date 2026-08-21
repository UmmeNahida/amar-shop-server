import DatauriParser from "datauri/parser.js";

const parser = new DatauriParser();

const parseBufferToURI = (buffer:any) => parser.format("", buffer).content;

export default parseBufferToURI;
