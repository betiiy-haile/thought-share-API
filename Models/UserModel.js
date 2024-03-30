import mongoose ,{ Schema } from "mongoose";


const UserSchems = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true        
    },
    password: {
        type: String,
        required: true
    },
    Image: {
        type: String,
    },
    posts: {
        type: [Schema.Types.ObjectId],
        ref: "Post"
    },
    comments: {
        type: [Schema.Types.ObjectId],
        ref: "Comment"
    }
}, {
    timestamps: true
})

const UserModel = mongoose.model("User", UserSchems);

export default UserModel