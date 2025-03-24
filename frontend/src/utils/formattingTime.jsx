import { formatDistanceToNow } from 'date-fns';

export const getTimeAgo = (createdAt) => {
  if (!createdAt) return
  return formatDistanceToNow(new Date(createdAt), { addSuffix: true });
}