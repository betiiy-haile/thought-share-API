import mongoose, { Schema} from "mongoose"

const PostSchems = new Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    image: {
        public_id: String,
        url: String
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    comments: {
        type: [Schema.Types.ObjectId],
        ref: "Comment"
    }
}, {
    timestamps: true
})


const PostModel = mongoose.model("Post", PostSchems)
export default PostModel