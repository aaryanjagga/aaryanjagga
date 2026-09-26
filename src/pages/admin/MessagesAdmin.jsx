import { useState, useEffect } from 'react';
import { Mail, Search, Trash2, Clock, Reply, Inbox } from 'lucide-react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import EmptyState from '../../components/ui/EmptyState';
import Skeleton from '../../components/ui/Skeleton';

export default function MessagesAdmin() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all'); // all, unread, read

  // Delete
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const toast = useToast();

  const loadMessages = async () => {
    try {
      const data = await api.getMessages({
        search: searchQuery,
        filter: filter,
      });
      setMessages(data);
    } catch (err) {
      toast.error('Failed to load inquiries');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, [filter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadMessages();
  };

  const handleToggleRead = async (id, currentStatus) => {
    try {
      await api.toggleMessageRead(id, !currentStatus);
      toast.success(currentStatus ? 'Marked as unread' : 'Marked as read');
      loadMessages();
    } catch (err) {
      toast.error('Failed to update message status');
    }
  };

  const handleDelete = async () => {
    if (!messageToDelete) return;
    setIsDeleting(true);
    try {
      await api.deleteMessage(messageToDelete.id);
      toast.success('Message deleted permanently.');
      setDeleteConfirmOpen(false);
      setMessageToDelete(null);
      loadMessages();
    } catch (err) {
      toast.error('Failed to delete message');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 text-left pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 tracking-tight">Contact Messages Inbox</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Review and respond to client inquiries, proposals, and project messages submitted via your portfolio.
          </p>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 p-1 rounded-2xl glass-panel">
          {['all', 'unread', 'read'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium uppercase tracking-wider transition-colors cursor-pointer ${
                filter === f
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search sender, email, subject..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-1.5 text-xs bg-slate-900/60 border border-white/10 rounded-xl text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
          />
        </form>
      </div>

      {/* Messages List */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-28 w-full" />
          ))}
        </div>
      ) : messages.length > 0 ? (
        <div className="space-y-3">
          {messages.map((msg) => (
            <Card
              key={msg.id}
              className={`p-5 transition-all ${
                msg.is_read
                  ? 'bg-white/[0.01] border-white/5 opacity-80'
                  : 'bg-indigo-950/20 border-indigo-500/30 shadow-md shadow-indigo-500/5'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      msg.is_read
                        ? 'bg-white/5 text-slate-400 border border-white/5'
                        : 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                    }`}
                  >
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm sm:text-base font-bold text-slate-100">{msg.name}</h4>
                      {!msg.is_read ? (
                        <Badge variant="rose" size="sm" dot>New</Badge>
                      ) : null}
                    </div>
                    <a
                      href={`mailto:${msg.email}`}
                      className="text-xs text-indigo-400 hover:underline font-mono"
                    >
                      {msg.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-center">
                  <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-500" />
                    {new Date(msg.created_at).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Subject */}
              <h5 className="text-sm font-semibold text-slate-200 mb-1.5">
                {msg.subject || 'Direct Contact Submission'}
              </h5>

              {/* Body */}
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-wrap bg-white/[0.02] p-3.5 rounded-xl border border-white/5 mb-4">
                {msg.message}
              </p>

              {/* Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-white/5">
                <div className="flex items-center gap-2">
                  <a
                    href={`mailto:${msg.email}?subject=${encodeURIComponent(`Re: ${msg.subject || 'Inquiry'}`)}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
                  >
                    <Reply className="w-3.5 h-3.5" />
                    <span>Reply via Email</span>
                  </a>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleRead(msg.id, msg.is_read)}
                  >
                    {msg.is_read ? 'Mark as Unread' : 'Mark as Read'}
                  </Button>
                </div>

                <button
                  onClick={() => {
                    setMessageToDelete(msg);
                    setDeleteConfirmOpen(true);
                  }}
                  className="p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                  title="Delete Message"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Inbox}
          title="Inbox is clear"
          description="No messages match your selected search or filter."
        />
      )}

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Delete this message?"
        message="This inquiry will be permanently deleted from the database."
        isLoading={isDeleting}
      />
    </div>
  );
}
