import { connectDB } from "./db";
import { PORT } from "./config";
import app from "./app";

async function main() {
    try {
        await connectDB();
        app.listen(PORT);
        console.log(`Listening on port ${PORT}`);
    } catch (error) {
        console.error(error);
    }
}

main();
