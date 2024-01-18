import { connectToDB } from "@/lib/db";
import { storageRef } from "@/lib/firebase";
import { RequestModel } from "@/schemas/request";
import { Requests } from "@/types";
import { deleteObject } from "firebase/storage";
import { ObjectId } from "mongodb";

export async function PATCH(
    req: Request
) {
    try {
        await connectToDB();
        const body = await req.json();
        const { requests, status } = body;
        await RequestModel.updateMany({
            _id: requests.map((t: ObjectId) => t)
        }, {
            status: status
        }
        );

        return Response.json("requests updated");

    } catch (error) {
        console.log(error);
        return Response.json("Failed to update requests");
    }
}

export async function DELETE(
    req: Request
) {
    try {
        const body = await req.json();
        const { requests } = body;
        const requestsToDelete = await RequestModel.find<Requests>({
            _id: requests.map((t: ObjectId) => t)
        });

        await RequestModel.deleteMany({
            _id: requests.map((t: ObjectId) => t)
        });

        if( requestsToDelete.length > 0 ) {
            for(const request of requestsToDelete) {
                if( request.photo) {
                    const ref = storageRef(requests.photo)
                    await deleteObject(ref)
                }
            }
        }
        
        return Response.json("requests deletion completed");
    } catch (error) {
        console.log(error);
        return Response.json("Failed to delete requests");
    }

}