/**
 * Chat Rooms Layout
 *
 * Layout wrapper for all chat room pages
 */

import React from 'react';

export default function ChatRoomsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white">
      {children}
    </div>
  );
}
