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
    image: {
        type: {
            public_id: String,
            url: String
        },
    },
    posts: {
        type: [Schema.Types.ObjectId],
        ref: "Post"
    }
}, {
    timestamps: true
})

const UserModel = mongoose.model("User", UserSchems);

export default UserModel