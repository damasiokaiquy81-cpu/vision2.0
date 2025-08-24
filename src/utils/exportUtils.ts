import { FavoriteConversation } from '../types';

export const exportFavoritesToCSV = (favorites: FavoriteConversation[]): void => {
  if (favorites.length === 0) return;

  const csvContent = [
    ['Data', 'Mensagens', 'Prévia'],
    ...favorites.map(fav => [
      fav.date,
      fav.messageCount.toString(),
      `"${fav.preview.replace(/"/g, '""')}"`
    ])
  ].map(row => row.join(',')).join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `conversas_favoritas_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};