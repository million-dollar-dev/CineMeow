import React, { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
    faStar, 
    faThumbsUp, 
    faCheckCircle, 
    faCommentDots, 
    faReply 
} from "@fortawesome/free-solid-svg-icons";

const ReviewItem = ({ review }) => {
    const [likes, setLikes] = useState(review?.likes || 12);
    const [hasLiked, setHasLiked] = useState(false);
    const [showReplyInput, setShowReplyInput] = useState(false);
    const [replyText, setReplyText] = useState("");
    const [replies, setReplies] = useState([]);

    if (!review) return null;

    const {
        user = "Khán giả ẩn danh",
        avatar = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80",
        score = 9.5,
        content = "Phim rất hay và đáng xem tại rạp!",
        tags = ["Đáng tiền", "Kịch tính"],
        verifiedTicket = true,
        role = "Khán giả rạp"
    } = review;
    const date = review.date || review.time || "Vừa xong";

    const handleLike = () => {
        if (!hasLiked) {
            setLikes(prev => prev + 1);
            setHasLiked(true);
        } else {
            setLikes(prev => prev - 1);
            setHasLiked(false);
        }
    };

    const handleSendReply = (e) => {
        e.preventDefault();
        if (replyText.trim()) {
            setReplies(prev => [...prev, {
                user: "Bạn",
                time: "Vừa xong",
                text: replyText.trim()
            }]);
            setReplyText("");
            setShowReplyInput(false);
        }
    };

    return (
        <div className="p-4 sm:p-5 rounded-2xl bg-[#18182e]/80 border border-white/5 hover:border-violet-500/30 transition-all duration-300 space-y-3.5">
            {/* Top User Header */}
            <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <img
                        src={avatar}
                        alt={user}
                        className="w-10 h-10 rounded-full object-cover border-2 border-violet-500/30 flex-shrink-0"
                    />
                    <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-sm font-bold text-white leading-tight">{user}</span>
                            {verifiedTicket && (
                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                    <FontAwesomeIcon icon={faCheckCircle} className="text-[9px]" />
                                    <span>Đã xem rạp</span>
                                </span>
                            )}
                        </div>
                        <p className="text-[11px] text-slate-400">{role} • {date}</p>
                    </div>
                </div>

                {/* Score Pill */}
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 font-black text-xs sm:text-sm">
                    <FontAwesomeIcon icon={faStar} className="text-[11px]" />
                    <span>{score}</span>
                    <span className="text-[10px] text-slate-500 font-normal">/10</span>
                </div>
            </div>

            {/* Review Content */}
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                {content}
            </p>

            {/* Sentiment Tags */}
            {tags && tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                    {tags.map((tag, i) => (
                        <span
                            key={i}
                            className="px-2.5 py-0.5 rounded-lg text-[10px] font-semibold bg-violet-500/10 text-violet-300 border border-violet-500/20"
                        >
                            #{tag}
                        </span>
                    ))}
                </div>
            )}

            {/* Action Bar (Like & Reply) */}
            <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleLike}
                        className={`flex items-center gap-1.5 transition-colors ${
                            hasLiked ? "text-violet-400 font-bold" : "hover:text-white"
                        }`}
                    >
                        <FontAwesomeIcon icon={faThumbsUp} />
                        <span>Hữu ích ({likes})</span>
                    </button>

                    <button
                        onClick={() => setShowReplyInput(!showReplyInput)}
                        className="flex items-center gap-1.5 hover:text-white transition-colors"
                    >
                        <FontAwesomeIcon icon={faReply} className="text-[11px]" />
                        <span>Phản hồi {replies.length > 0 && `(${replies.length})`}</span>
                    </button>
                </div>

                <span className="text-[10px] text-slate-500">Đánh giá xác thực</span>
            </div>

            {/* Reply Input Box */}
            {showReplyInput && (
                <form onSubmit={handleSendReply} className="pt-2 flex items-center gap-2">
                    <input
                        type="text"
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Viết phản hồi của bạn..."
                        className="flex-grow px-3 py-1.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                    />
                    <button
                        type="submit"
                        className="px-3 py-1.5 rounded-xl text-xs font-bold bg-violet-600 hover:bg-violet-500 text-white transition-colors"
                    >
                        Gửi
                    </button>
                </form>
            )}

            {/* Existing Replies List */}
            {replies.length > 0 && (
                <div className="pl-4 border-l-2 border-violet-500/30 space-y-2 pt-2">
                    {replies.map((rep, idx) => (
                        <div key={idx} className="p-2 rounded-xl bg-black/30 text-xs space-y-0.5">
                            <div className="flex items-center justify-between text-slate-400 text-[10px]">
                                <span className="font-bold text-violet-400">{rep.user}</span>
                                <span>{rep.time}</span>
                            </div>
                            <p className="text-slate-300">{rep.text}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ReviewItem;
