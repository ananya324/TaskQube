const mongoose = require("mongoose");
const workspaceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        default: "",
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    roomCode: {
        type: String,
        unique: true,
    },

},
    {
        timestamps: true,

    }
);
module.exports = mongoose.model("Workspace", workspaceSchema);