import React from 'react';
import { X } from 'lucide-react';
import { OpinionForm } from './OpinionForm';
import { OpinionFormData } from './service/api';

interface OpinionModalProps {
  isOpen: boolean;
  bookingId: number;
  roomId: number;
  roomName: string;
  onSubmit: (data: OpinionFormData) => Promise<void>;
  onClose: () => void;
}

export const OpinionModal: React.FC<OpinionModalProps> = ({
  isOpen,
  bookingId,
  roomId,
  roomName,
  onSubmit,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
        >
          <X className="h-5 w-5" />
        </button>
        
        <div className="p-8">
          <OpinionForm
            bookingId={bookingId}
            roomId={roomId}
            roomName={roomName}
            onSubmit={onSubmit}
            onCancel={onClose}
          />
        </div>
      </div>
    </div>
  );
};