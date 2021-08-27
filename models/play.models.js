import mongoose from "mongoose";
const Schema = mongoose.Schema;

const boardSchema = new Schema(
    {
        player1: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        player2: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        matchStatus: {
            type: String,
        },

        pieces: {
            pawn_Ba: { name: { type: String }, unicode: { type: String }, position: { type: String }, player: { type: String } },
            pawn_Bb: { name: { type: String }, unicode: { type: String }, position: { type: String }, player: { type: String } },
            pawn_Bc: { name: { type: String }, unicode: { type: String }, position: { type: String }, player: { type: String } },
            pawn_Bd: { name: { type: String }, unicode: { type: String }, position: { type: String }, player: { type: String } },
            pawn_Be: { name: { type: String }, unicode: { type: String }, position: { type: String }, player: { type: String } },
            pawn_Bf: { name: { type: String }, unicode: { type: String }, position: { type: String }, player: { type: String } },
            pawn_Bg: { name: { type: String }, unicode: { type: String }, position: { type: String }, player: { type: String } },
            pawn_Bh: { name: { type: String }, unicode: { type: String }, position: { type: String }, player: { type: String } },
            pawn_Wa: { name: { type: String }, unicode: { type: String }, position: { type: String }, player: { type: String } },
            pawn_Wb: { name: { type: String }, unicode: { type: String }, position: { type: String }, player: { type: String } },
            pawn_Wc: { name: { type: String }, unicode: { type: String }, position: { type: String }, player: { type: String } },
            pawn_Wd: { name: { type: String }, unicode: { type: String }, position: { type: String }, player: { type: String } },
            pawn_We: { name: { type: String }, unicode: { type: String }, position: { type: String }, player: { type: String } },
            pawn_Wf: { name: { type: String }, unicode: { type: String }, position: { type: String }, player: { type: String } },
            pawn_Wg: { name: { type: String }, unicode: { type: String }, position: { type: String }, player: { type: String } },
            pawn_Wh: { name: { type: String }, unicode: { type: String }, position: { type: String }, player: { type: String } },
            rook_Ba: { name: { type: String }, unicode: { type: String }, position: { type: String }, player: { type: String } },
            knight_Bb: { name: { type: String }, unicode: { type: String }, position: { type: String }, player: { type: String } },
            bishop_Bc: { name: { type: String }, unicode: { type: String }, position: { type: String }, player: { type: String } },
            queen_Bd: { name: { type: String }, unicode: { type: String }, position: { type: String }, player: { type: String } },
            king_Be: { name: { type: String }, unicode: { type: String }, position: { type: String }, player: { type: String } },
            bishop_Bf: { name: { type: String }, unicode: { type: String }, position: { type: String }, player: { type: String } },
            knight_Bg: { name: { type: String }, unicode: { type: String }, position: { type: String }, player: { type: String } },
            rook_Bh: { name: { type: String }, unicode: { type: String }, position: { type: String }, player: { type: String } },
            rook_Wa: { name: { type: String }, unicode: { type: String }, position: { type: String }, player: { type: String } },
            knight_Wb: { name: { type: String }, unicode: { type: String }, position: { type: String }, player: { type: String } },
            bishop_Wc: { name: { type: String }, unicode: { type: String }, position: { type: String }, player: { type: String } },
            queen_Wd: { name: { type: String }, unicode: { type: String }, position: { type: String }, player: { type: String } },
            king_We: { name: { type: String }, unicode: { type: String }, position: { type: String }, player: { type: String } },
            bishop_Wf: { name: { type: String }, unicode: { type: String }, position: { type: String }, player: { type: String } },
            knight_Wg: { name: { type: String }, unicode: { type: String }, position: { type: String }, player: { type: String } },
            rook_Wh: { name: { type: String }, unicode: { type: String }, position: { type: String }, player: { type: String } },
        }
    },
    { timestamps: true }
);

export const Board = mongoose.model('Board', boardSchema);