import {quantizeImageFile} from "./index";

export default async function () {
    return quantizeImageFile(process.argv[2]);
}