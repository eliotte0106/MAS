import { connectToDB } from "@/lib/db"
import { RequestModel } from "@/schemas/request"


export async function GET() {

    try {

        await connectToDB()

        const requests = await RequestModel.aggregate([
            {
                $group: {
                    _id: { status: '$status'},
                    count: { $sum: 1}
                }
            }
        ])

        return Response.json(requests)

    }catch(error) {
        console.log(error)
        return Response.json({
            message: "failed to get request stats"
        })
    }
}