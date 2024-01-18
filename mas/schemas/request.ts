import { Request, RequestStatus } from "@/types";
import mongoose, { Schema, model, models } from "mongoose";


const RequestSchema = new Schema<Request>({
    submitterName: String,
    submitterPhone: String,
    submitterEmail: String,
    assignedInspector: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        default: null
    },
    dateOfRequest: { type: Date, default: Date.now() },
    resolvedDate: Date,
    status: {
        type: String,
        default: RequestStatus.NEW,
        get: (v: any) => `${v}`
    },
    notes: String,
    photo: String,
    latlong: {
        type: { type: String, default: "Point"},
        coordinates: [Number]
    }
}, {
    toJSON: { getters: true }
});

export const RequestModel = models.request || model('request', RequestSchema)