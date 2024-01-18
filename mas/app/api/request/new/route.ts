import { connectToDB } from "@/lib/db";
import { RequestModel } from "@/schemas/request";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest, response: NextResponse) {
    try {
        await connectToDB()
        const formData: FormData = await request.formData()
        const userInfo = formData.get('userinfo') as string
        const userJson = JSON.parse(userInfo)
        let downloadUrl = '';
        const submitterName = userJson.submitterName;
        const submitterPhone = userJson.submitterPhone;
        const submitterEmail = userJson.submitterEmail;
        const lat = userJson.latlong.lat;
        const long = userJson.latlong.long;
        const file = formData.get('image') as File

        let requestToSave = {
            submitterName: submitterName,
            submitterPhone: submitterPhone,
            submitterEmail: submitterEmail,
            photo: '',
            latlong: {
              coordinates: [lat,long]
            }
        }

        await RequestModel.create(requestToSave);

        return NextResponse.json({
            message: "request created",
            request: requestToSave
        })
    } catch (error) {
        console.log(error)
        return Response.json({
            message: "Something went wrong"
        })
    }
}