import React, { useState, useEffect } from 'react';
import type { UserComment } from '../types';
import { getDataForContent, addComment } from '../services/userRatingService';

interface CommentsSectionProps {
  contentId: string;
}

const CommentsSection: React.FC<CommentsSectionProps> = ({ contentId }) => {
  const [comments, setComments] = useState<UserComment[]>([]);
  const [newComment, setNewComment] = useState('');

  const loadComments = () => {
    const data = getDataForContent(contentId);
    setComments(data?.comments || []);
  };

  useEffect(() => {
    loadComments();
  }, [contentId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      addComment(contentId, newComment);
      setNewComment('');
      loadComments(); // Reload comments after adding
    }
  };

  return (
    <div className="mt-6">
      <h3 className="text-xl font-semibold mb-4">Comments</h3>
      <form onSubmit={handleSubmit} className="mb-6">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="w-full p-2 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500"
          rows={3}
        />
        <button
          type="submit"
          className="mt-2 py-2 px-4 bg-red-600 rounded hover:bg-red-700 disabled:bg-gray-500"
          disabled={!newComment.trim()}
        >
          Post Comment
        </button>
      </form>
      <div className="space-y-4">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="bg-gray-800 p-3 rounded">
              <p className="font-semibold">{comment.author}</p>
              <p className="text-sm text-gray-300 my-1">{comment.text}</p>
              <p className="text-xs text-gray-500">{new Date(comment.timestamp).toLocaleString()}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-400">No comments yet. Be the first to comment!</p>
        )}
      </div>
    </div>
  );
};

export default CommentsSection;
