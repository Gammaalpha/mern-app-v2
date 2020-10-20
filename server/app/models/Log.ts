import mongoose, { Schema, Document } from "mongoose";

export interface ILog extends Document {
    email: string;
    firstName: string,
    lastName: string
}

const LogSchema: Schema = new Schema({
    email: {
        type: String,
        required: true
    },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    date: {
        type: Date,
        default: Date.now
    }
});
export default mongoose.model<ILog>('Log', LogSchema);