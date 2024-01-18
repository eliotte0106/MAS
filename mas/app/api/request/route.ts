import { connectToDB } from "@/lib/db";
import { RequestModel } from "@/schemas/request";


export async function GET() {
    try {
        await connectToDB()
        const requests = await RequestModel.find({}).populate('assignedInspector')
        return Response.json(requests)
    } catch(error) {
        console.log(error);
        return Response.json({message: "Failed to get requests"});
    }
}