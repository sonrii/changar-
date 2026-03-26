'use client';

import React from 'react';
import { JobRequestWithClient } from '@/types';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { getOficioLabel, getZoneLabel, getUrgencyConfig, getCategoryLabel, getCategoryForTrade } from '@/lib/constants';
import { formatDate } from '@/lib/utils';
import { MapPin, Clock, User } from 'lucide-react';

interface JobRequestCardProps {
  request: JobRequestWithClient;
  onClick?: () => void;
}

export const JobRequestCard: React.FC<JobRequestCardProps> = ({ request, onClick }) => {
  const urgencyConfig = getUrgencyConfig(request.urgency);
  
  // Get category - use stored category or derive from trade for backward compatibility
  const category = request.category || getCategoryForTrade(request.oficio);
  const categoryLabel = category ? getCategoryLabel(category) : null;

  return (
    <Card onClick={onClick} className={onClick ? 'cursor-pointer' : ''}>
      <div className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-gray-900">{request.title}</h3>
            <p className="text-sm text-primary-600 font-medium">
              {getOficioLabel(request.oficio)}
              {categoryLabel && <span className="text-gray-500"> • {categoryLabel}</span>}
            </p>
          </div>
          <Badge className={urgencyConfig.color}>
            {urgencyConfig.label}
          </Badge>
        </div>

        <p className="text-sm text-gray-700 line-clamp-2">{request.description}</p>

        <div className="flex flex-wrap gap-3 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <MapPin size={16} />
            <span>{getZoneLabel(request.zone)}</span>
          </div>
          <div className="flex items-center gap-1">
            <User size={16} />
            <span>{request.clientName}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={16} />
            <span>{formatDate(request.createdAt)}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};
