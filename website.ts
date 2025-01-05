import { walk } from "@std/fs";
import mime from "npm:mime";

// This function returns the filepath of a file in the website directory
// It allows html pages to be found without the need to add .html in the URL
async function getTheFile(filePath: string): Promise<string> {
    // The / path returns index.html
    if (filePath == "/") return "/index.html";

    // Get all of the files in the website directory
    const filePaths = [];
    for await (const walkEntry of walk("./website")) {
        // Only add files to the filePaths array
        if (walkEntry.isFile) {
            filePaths.push(
                // Remove "website" from the path
                walkEntry.path.replaceAll("\\", "/").replace("website", ""),
            );
        }
    }

    // If we add .html to the requested filePath, is it found in filePaths?
    // If so, return that file with the .html extension
    if (filePaths.includes(filePath + ".html")) return filePath + ".html";

    // If the file is found then return that file
    if (filePaths.includes(filePath)) return filePath;

    // If no files are found, return the 404 page
    return "/404.html";
}

// Handle requests to the website part of cappabot.com
async function websiteRequest(req: Request): Promise<Response> {
    const reqURL = new URL(req.url);
    const reqPath = reqURL.pathname;

    const reqFilePath = decodeURIComponent(reqPath);

    // Get the file
    const resFileName = await getTheFile(reqFilePath);
    // If it's the 404 page, the status also needs to be a 404
    const resStatus = resFileName == "404.html" ? 404 : 200;

    // Open the file with deno
    const file = await Deno.open("./website" + resFileName);
    // Get the mime type from the file name
    const contentType = mime.getType(resFileName);
    // If a mime type was found, set the content-type header to that, otherwise the type is text/plain
    const headers = new Headers({
        "content-type": contentType || "text/plain",
    });
    // Return the response with the status and the headers
    return new Response(file.readable, { status: resStatus, headers: headers });
}

// Handle all requests to cappabot.com
async function handler(req: Request) {
    const reqMethod = req.method;

    // If the request method is GET
    if (reqMethod == "GET") {
        // Get parts of the website
        return await websiteRequest(req);
    } else {
        // Otherwise it's a bad request
        return new Response("Yeah idk", { status: 400 });
    }
}

// Serve with deno
Deno.serve(handler);
