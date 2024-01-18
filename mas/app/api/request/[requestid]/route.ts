import { connectToDB } from "@/lib/db";
import { RequestModel } from "@/schemas/request";
import { RequestStatus } from "@/types";
import { NextResponse } from "next/server";


export async function DELETE(
    req: Request,
    { params }: { params: { requestid: string } }
) {
    try {
        await connectToDB()
        const requestId = params.requestid
        if (!requestId) {
            return new NextResponse("requestid is required", { status: 400 })
        }
        let request = await RequestModel.findByIdAndDelete(requestId)

        if (request) {
            return NextResponse.json({
                request: request,
                message: "request deleted"
            })
        } else {
            return NextResponse.json({
                message: "request not found"
            })
        }

    } catch (error) {
        console.log(error);
        return new NextResponse("Internal error", { status: 500 });
    }
}

export async function PATCH(
    req: Request,
    { params } : { params : { requestid: string }}
) {
    await connectToDB();
    
    const body = await req.json();

    const { inspector, status } = body;
    const requestId = params.requestid;

    if( !requestId) {
        return new NextResponse("requestId is required", { status: 400});
    }

    const request = await RequestModel.findById(requestId);
    if( !request ) {
        return new NextResponse("Invalid request", { status: 404 });
    }

    if( status === RequestStatus.UNASSIGNED) {
        request.assignedInspector = null
    } else
        request.assignedInspector = inspector || request.assignedInspector

    request.status = status || request.status

    await request.save()

    return NextResponse.json({
        request: request,
        message: "request update completed"
    })
}