'use client';

import React from 'react';
import { WorkerProfileWithUser } from '@/types';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { getOficioLabel, getZoneLabel, getCategoryLabel, getCategoryForTrade } from '@/lib/constants';
import { getWhatsAppLink } from '@/lib/utils';
import { Star, MapPin, Phone } from 'lucide-react';

interface WorkerCardProps {
  worker: WorkerProfileWithUser;
  onViewProfile?: () => void;
}

export const WorkerCard: React.FC<WorkerCardProps> = ({ worker, onViewProfile }) => {
  const handleContact = () => {
    if (worker.whatsapp || worker.phone) {
      const phone = worker.whatsapp || worker.phone!;
      const message = `Hola ${worker.fullName}, te contacto desde ChangAR por tu servicio de ${getOficioLabel(worker.oficio)}.`;
      window.open(getWhatsAppLink(phone, message), '_blank');
    }
  };

  // Get category - use stored category or derive from trade for backward compatibility
  const category = worker.category || getCategoryForTrade(worker.oficio);
  const categoryLabel = category ? getCategoryLabel(category) : null;

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <div className="flex flex-col gap-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-gray-900">{worker.fullName}</h3>
            <p className="text-sm text-primary-600 font-medium">
              {getOficioLabel(worker.oficio)}
              {categoryLabel && <span className="text-gray-500"> • {categoryLabel}</span>}
            </p>
          </div>
          {worker.availableNow && (
            <Badge variant="success">Disponible ahora</Badge>
          )}
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <MapPin size={16} />
            <span>{getZoneLabel(worker.zone)}</span>
          </div>
          {worker.totalReviews > 0 && (
            <div className="flex items-center gap-1">
              <Star size={16} className="fill-yellow-400 text-yellow-400" />
              <span>{worker.ratingAverage.toFixed(1)} ({worker.totalReviews})</span>
            </div>
          )}
        </div>

        {worker.description && (
          <p className="text-sm text-gray-700 line-clamp-2">{worker.description}</p>
        )}

        <div className="flex gap-2 mt-2">
          {(worker.whatsapp || worker.phone) && (
            <Button
              variant="primary"
              size="sm"
              fullWidth
              onClick={handleContact}
            >
              <Phone size={16} className="mr-1" />
              Contactar
            </Button>
          )}
          {onViewProfile && (
            <Button
              variant="outline"
              size="sm"
              onClick={onViewProfile}
            >
              Ver perfil
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};
