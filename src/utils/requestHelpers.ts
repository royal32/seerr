import type { ServiceCommonServerWithDetails } from '@server/interfaces/api/serviceInterfaces';
import type { MediaRequest } from '@server/entity/MediaRequest';
import axios from 'axios';
import { mutate } from 'swr';

type RequestableMediaType = 'movie' | 'tv';

export const hasSingleQualityProfile = async ({
  mediaType,
  is4k = false,
}: {
  mediaType: RequestableMediaType;
  is4k?: boolean;
}): Promise<boolean> => {
  const serviceType = mediaType === 'movie' ? 'radarr' : 'sonarr';
  const { data: servers } = await axios.get<
    ServiceCommonServerWithDetails['server'][]
  >(`/api/v1/service/${serviceType}`);
  const eligibleServers = servers.filter((server) => server.is4k === is4k);
  const targetServer =
    eligibleServers.find((server) => server.isDefault) ?? eligibleServers[0];

  if (!targetServer) {
    return false;
  }

  const { data: serverDetails } = await axios.get<ServiceCommonServerWithDetails>(
    `/api/v1/service/${serviceType}/${targetServer.id}`
  );

  return serverDetails.profiles.length === 1;
};

export const submitMediaRequest = async ({
  tmdbId,
  mediaType,
  is4k = false,
}: {
  tmdbId: number;
  mediaType: RequestableMediaType;
  is4k?: boolean;
}): Promise<MediaRequest> => {
  const response = await axios.post<MediaRequest>('/api/v1/request', {
    mediaId: tmdbId,
    mediaType,
    is4k,
  });

  mutate('/api/v1/request?filter=all&take=10&sort=modified&skip=0');
  mutate('/api/v1/request/count');

  return response.data;
};
